export type ApiFetch = typeof globalThis.fetch;

export interface ApiToken {
    readonly retryLimit: number;
    readonly isValid: boolean;
    refresh(fetch: ApiFetch): Promise<void>;
}

export interface ApiCall<Token extends ApiToken, Result> {
    prepare(token: Token): Request;
    parse(response: Response): Promise<Result>;
}

export interface ApiPerformOptions<Token extends ApiToken, Result> {
    readonly token: Token;
    readonly call: ApiCall<Token, Result>;
    readonly fetch?: ApiFetch;
}

export class ApiError extends Error {
    constructor(
        public readonly status: number,
        public readonly statusText: string,
        message: string
    ) {
        super(`${status} ${statusText}: ${message}`)
    }
}

export async function perform<T extends ApiToken, R>({token, call, fetch = globalThis.fetch}: ApiPerformOptions<T, R>): Promise<R> {
    if (!token.isValid) {
        await token.refresh(fetch);
    }
    for (let retry = 0, retryLimit = token.retryLimit; retry < retryLimit; retry++) {
        const request = call.prepare(token);
        const response = await fetch(request);
        if (!response.ok && response.status === 401) {
            await token.refresh(fetch);
            continue;
        }
        return await call.parse(response);
    }
    throw new ApiError(401, "Unauthorized", "Retry limit exceeded");
}
