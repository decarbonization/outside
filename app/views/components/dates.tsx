import i18next, { t } from "i18next";

export interface DateProps {
    readonly className?: string;
    readonly when?: Date;
}

export function Hour({className, when}: DateProps) {
    if (when === undefined) {
        return (
            <span className={`datetime empty ${className ?? ''}`}>
                {t("units:placeholder")}
            </span>
        );
    }

    return (
        <span className={`datetime ${className ?? ''}`}>
            {i18next.format(when, "datetime", undefined, { hour: 'numeric' })}
        </span>
    );
}

export function ShortDate({className, when}: DateProps) {
    if (when === undefined) {
        return (
            <span className={`datetime empty ${className ?? ''}`}>
                {t("units:placeholder")}
            </span>
        );
    }

    return (
        <span className={`datetime ${className ?? ''}`}>
            {i18next.format(when, "datetime", undefined, { dateStyle: 'short' })}
        </span>
    );
}

export function ShortTime({className, when}: DateProps) {
    if (when === undefined) {
        return (
            <span className={`datetime empty ${className ?? ''}`}>
                {t("units:placeholder")}
            </span>
        );
    }

    return (
        <span className={`datetime ${className ?? ''}`}>
            {i18next.format(when, "datetime", undefined, { timeStyle: 'short' })}
        </span>
    );
}

export function Weekday({className, when}: DateProps) {
    if (when === undefined) {
        return (
            <span className={`datetime empty ${className ?? ''}`}>
                {t("units:placeholder")}
            </span>
        );
    }

    return (
        <span className={`datetime ${className ?? ''}`}>
            {i18next.format(when, "datetime", undefined, { weekday: 'short' })}
        </span>
    );
}
