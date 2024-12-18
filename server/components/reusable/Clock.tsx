/*
 * outside weather app
 * Copyright (C) 2024  MAINTAINERS
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

import classNames from "classnames";
import { useDeps } from "../../hooks/Deps";
import { formatDate } from "./Dates";

export interface ClockProps {
    readonly className?: string;
    readonly time?: Date;
}

export default function Clock({ className, time }: ClockProps) {
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
                <div className="hour clock-hand" style={{ "--degrees": `${30 * hour + minute / 2}deg` }} />
                <div className="minute clock-hand" style={{ "--degrees": `${6 * minute}deg` }} />
                <div className="second clock-hand" style={{ "--degrees": `${6 * second}deg` }} />
                <span className="clock-numeral" style={{ "--n": "1", "--i": "0" }}>|</span>
                <span className="clock-numeral" style={{ "--n": "2", "--i": "0" }}>|</span>
                <span className="clock-numeral" style={{ "--n": "3", "--i": "3" }}>|</span>
                <span className="clock-numeral" style={{ "--n": "4", "--i": "0" }}>|</span>
                <span className="clock-numeral" style={{ "--n": "5", "--i": "0" }}>|</span>
                <span className="clock-numeral" style={{ "--n": "6", "--i": "6" }}>|</span>
                <span className="clock-numeral" style={{ "--n": "7", "--i": "0" }}>|</span>
                <span className="clock-numeral" style={{ "--n": "8", "--i": "0" }}>|</span>
                <span className="clock-numeral" style={{ "--n": "9", "--i": "9" }}>|</span>
                <span className="clock-numeral" style={{ "--n": "10", "--i": "0" }}>|</span>
                <span className="clock-numeral" style={{ "--n": "11", "--i": "0" }}>|</span>
                <span className="clock-numeral" style={{ "--n": "12", "--i": "12" }}>|</span>
            </div>
        </div>
    );
}
