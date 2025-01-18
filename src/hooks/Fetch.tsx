/*
 * outside weather app
 * Copyright (C) 2024-2025  MAINTAINERS
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { useCallback, useEffect, useState } from "preact/hooks";

export interface UseFetchProps<T> {
    readonly initialValue?: T;
    readonly fetchKey: (string | number | boolean | symbol | undefined | null)[];
    readonly fetchFn: () => Promise<T>;
}

export type FetchResult<T> =
    | { isPending: true, isFetching: false, data: undefined, error: undefined }
    | { isPending: false, isFetching: true, data: undefined, error: undefined }
    | { isPending: false, isFetching: false, data: T, error: undefined }
    | { isPending: false, isFetching: false, data: undefined, error: Error };

export type UseFetchResult<T> = FetchResult<T> & {
    invalidate: () => void,
};

export default function useFetch<T>({
    initialValue,
    fetchKey,
    fetchFn,
}: UseFetchProps<T>): UseFetchResult<T> {
    const [result, setResult] = useState<FetchResult<T>>(() => {
        if (initialValue !== undefined) {
            return {
                isPending: false,
                isFetching: false,
                data: initialValue,
                error: undefined,
            };
        } else {
            return {
                isPending: true,
                isFetching: false,
                data: undefined,
                error: undefined,
            };
        }
    });
    const invalidate = useCallback(() => {
        setResult({
            isPending: true,
            isFetching: false,
            data: undefined,
            error: undefined,
        });
    }, [setResult]);
    const fetch = useCallback(fetchFn, fetchKey);
    useEffect(() => {
        if (!result.isPending) {
            return;
        }
        (async () => {
            setResult({
                isPending: false,
                isFetching: true,
                data: undefined,
                error: undefined,
            });
            console.log("useEffect.fetching");
            try {
                setResult({
                    isPending: false,
                    isFetching: false,
                    data: await fetch(),
                    error: undefined,
                });
                console.log("useEffect.completed");
            } catch (e) {
                setResult({
                    isPending: false,
                    isFetching: false,
                    data: undefined,
                    error: e instanceof Error ? e : new Error(`e`),
                });
                console.log("useEffect.failed");
            }
        })();
    }, [result, setResult, fetch]);
    return {
        ...result,
        invalidate,
    };
}
