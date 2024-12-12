import classNames from "classnames";
import { useDeps } from "../_deps";
import { formatDate } from "./dates";

export interface ClockProps {
    readonly className?: string;
    readonly time?: Date;
}

export function Clock({ className, time }: ClockProps) {
    if (time === undefined) {
        return null;
    }
    const { i18n, timeZone } = useDeps();
    const hour = time.getHours() > 12 ? time.getHours() - 12 : time.getHours();
    const minute = time.getMinutes();
    const second = time.getSeconds();
    const label = formatDate(i18n, time, { timeStyle: 'short', timeZone });
    return (
        <div role="time" aria-label={label} className={classNames(className, "clock-container")}>
            <div className="clock-face">
                <div className="hour clock-hand" style={{"--degrees": `${30 * hour + minute / 2}deg`}} />
                <div className="minute clock-hand" style={{"--degrees": `${6 * minute}deg`}} />
                <div className="second clock-hand" style={{"--degrees": `${6 * second}deg`}} />
                <span className="clock-numeral" style={{"--n": "1", "--i": "0"}}>|</span>
                <span className="clock-numeral" style={{"--n": "2", "--i": "0"}}>|</span>
                <span className="clock-numeral" style={{"--n": "3", "--i": "3"}}>|</span>
                <span className="clock-numeral" style={{"--n": "4", "--i": "0"}}>|</span>
                <span className="clock-numeral" style={{"--n": "5", "--i": "0"}}>|</span>
                <span className="clock-numeral" style={{"--n": "6", "--i": "6"}}>|</span>
                <span className="clock-numeral" style={{"--n": "7", "--i": "0"}}>|</span>
                <span className="clock-numeral" style={{"--n": "8", "--i": "0"}}>|</span>
                <span className="clock-numeral" style={{"--n": "9", "--i": "9"}}>|</span>
                <span className="clock-numeral" style={{"--n": "10", "--i": "0"}}>|</span>
                <span className="clock-numeral" style={{"--n": "11", "--i": "0"}}>|</span>
                <span className="clock-numeral" style={{"--n": "12", "--i": "12"}}>|</span>
            </div>
        </div>
    );
}
