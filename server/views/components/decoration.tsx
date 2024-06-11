import classNames from "classnames";
import { useContext } from "preact/hooks";
import { ThemeDecoration, themeIcon, themeIconDescription } from "../../styling/themes";
import { Deps } from "../_deps";

export interface DecorationProps {
    readonly className?: string;
    readonly name: ThemeDecoration;
}

export function Decoration({ className, name }: DecorationProps) {
    const { i18n, theme } = useContext(Deps);
    const iconClassName = themeIcon(theme, { name });
    const iconDescription = themeIconDescription(i18n, { name });
    if (iconClassName !== undefined) {
        return (
            <span className={classNames("icon", className, iconClassName)} aria-label={iconDescription} />
        );
    } else {
        return (
            <span className={classNames("icon-fallback", className)}>
                {iconDescription}
            </span>
        );
    }
}
