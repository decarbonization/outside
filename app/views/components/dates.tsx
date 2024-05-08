import classNames from "classnames";
import i18next, { t } from "i18next";

export interface DateProps {
    /**
     * Extra class names to apply to the element.
     */
    readonly className?: string;

    /**
     * The instant in time to render.
     */
    readonly when?: Date;

    /**
     * Whether to hide the element if `when` is not provided.
     */
    readonly autoHide?: boolean;
}

function Empty({ className, autoHide = false }: DateProps) {
    if (autoHide) {
        return null;
    } else {
        return (
            <span className={classNames("datetime", "empty", className)}>
                {t("units:placeholder")}
            </span>
        );
    }
}

export function Hour({ className, when, autoHide }: DateProps) {
    if (when === undefined) {
        return <Empty className={className} autoHide={autoHide} />
    }
    return (
        <span className={classNames("datetime", className)}>
            {i18next.format(when, "datetime", undefined, { hour: 'numeric' })}
        </span>
    );
}

export function ShortDate({ className, when, autoHide }: DateProps) {
    if (when === undefined) {
        return <Empty className={className} autoHide={autoHide} />
    }
    return (
        <span className={classNames("datetime", className)}>
            {i18next.format(when, "datetime", undefined, { dateStyle: 'short' })}
        </span>
    );
}

export function ShortTime({ className, when, autoHide }: DateProps) {
    if (when === undefined) {
        return <Empty className={className} autoHide={autoHide} />
    }
    return (
        <span className={classNames("datetime", className)}>
            {i18next.format(when, "datetime", undefined, { timeStyle: 'short' })}
        </span>
    );
}

export function Weekday({ className, when, autoHide }: DateProps) {
    if (when === undefined) {
        return <Empty className={className} autoHide={autoHide} />
    }
    return (
        <span className={classNames("datetime", className)}>
            {i18next.format(when, "datetime", undefined, { weekday: 'short' })}
        </span>
    );
}
