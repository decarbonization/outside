import { useContext } from "preact/hooks";
import { Attribution } from "../../fruit-company/weather/models/attribution";
import { Weather } from "../../fruit-company/weather/models/weather";
import { Deps } from "./_deps";

export interface WeatherSourceProps {
    readonly weather?: Weather;
    readonly attribution?: Attribution;
}

export function WeatherSource({ weather, attribution }: WeatherSourceProps) {
    if (weather === undefined || attribution === undefined) {
        return null;
    }
    const { i18n } = useContext(Deps);
    const attributionURL = [
        weather.currentWeather?.metadata.attributionURL,
        weather.forecastNextHour?.metadata.attributionURL,
        weather.forecastHourly?.metadata.attributionURL,
        weather.forecastDaily?.metadata.attributionURL,
    ].find(url => url !== undefined);
    return (
        <section className="data-source">
            {i18n.t("appPoweredBy")}
            &nbsp;
            <a href={attributionURL}>
                <picture>
                    <source srcset={`${attribution['logoDark@1x']}, ${attribution['logoDark@2x']} 2x, ${attribution['logoDark@3x']} 3x`} media="(prefers-color-scheme: dark)" />
                    <source srcset={`${attribution['logoLight@1x']}, ${attribution['logoLight@2x']} 2x, ${attribution['logoLight@3x']} 3x`} />
                    <img src={attribution['logoLight@1x']} alt={attribution.serviceName} />
                </picture>
            </a>
        </section>
    );
}
