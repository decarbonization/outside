import { t } from "i18next";
import { MoonPhase } from "../../../fruit-company/weather/models/base";

const phaseClassNames = {
    [MoonPhase.new]: "wi-moon-new",
    [MoonPhase.waxingCrescent]: "wi-moon-waxing-crescent-2",
    [MoonPhase.firstQuarter]: "wi-moon-first-quarter",
    [MoonPhase.full]: "wi-moon-full",
    [MoonPhase.waxingGibbous]: "wi-moon-waxing-gibbous-2",
    [MoonPhase.waningGibbous]: "wi-moon-waning-gibbous-2",
    [MoonPhase.thirdQuarter]: "wi-moon-third-quarter",
    [MoonPhase.waningCrescent]: "wi-moon-waning-crescent-2",
};

export interface MoonProps {
    readonly className?: string;
    readonly phase: MoonPhase;
    readonly labeled?: boolean;
}

export function Moon({className, phase, labeled}: MoonProps) {
    return (
        <>
            <span className={`${className ?? ''} wi ${phaseClassNames[phase]}`} alt={t(`forecast.moonPhase.${phase}`, { defaultValue: String(phase) })} />
            {labeled === true ? ` ${t(`forecast.moonPhase.${phase}`, { defaultValue: String(phase) })}` : ""}
        </>
    );
}
