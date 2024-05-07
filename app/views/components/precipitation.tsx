import { DepthUnit, PercentageUnit } from "./units";

export interface PrecipitationProps {
    readonly probability: number;
    readonly amount?: number;
    readonly hideAutomatically?: boolean;
}

export function Precipitation({ probability, amount, hideAutomatically = true }: PrecipitationProps) {
    if (probability === 0 && hideAutomatically) {
        return null;
    }
    return (
        <span>
            <PercentageUnit measurement={probability} /> {amount !== undefined ? <DepthUnit measurement={amount} /> : null}
        </span>
    );
}
