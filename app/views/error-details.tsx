import { useContext } from "preact/hooks";
import { Deps } from "./_deps";

export interface ErrorDetailsProps {
    readonly error: Error;
}

export function ErrorDetails({ error }: ErrorDetailsProps) {
    const { i18n } = useContext(Deps);
    return (
        <section>
            <h1>{i18n.t("errorTitle")}</h1>
            <details>
                <summary>{error.message}</summary>
                <pre>
                    {error.stack}
                </pre>
            </details>
        </section>
    );
}
