import { ComponentChildren } from "preact";
import { PrecipitationType } from "../../../fruit-company/weather/models/base";
import { PercentageUnit } from "./units";

const typeClassNames = {
    [PrecipitationType.clear]: "",
    [PrecipitationType.precipitation]: "precipitation",
    [PrecipitationType.rain]: "wi-rain",
    [PrecipitationType.snow]: "wi-snow",
    [PrecipitationType.sleet]: "wi-sleet",
    [PrecipitationType.hail]: "wi-hail",
    [PrecipitationType.mixed]: "wi-day-rain-mix",
};

export interface PrecipitationProps {
    readonly probability: number;
    readonly type: PrecipitationType;
    readonly amount?: number;
    readonly children: ComponentChildren;
}

export function Precipitation({probability, type, children}: PrecipitationProps) {
    if (probability > 0) {
        return (
            <span>
                <span className={`wi ${typeClassNames[type]}`} /> <PercentageUnit measurement={probability} />
            </span>
        );
    } else {
        return (
            <>
                {children}
            </>
        );
    }
}
