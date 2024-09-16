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

import { useContext } from "preact/hooks";
import { Deps } from "./_deps";

export interface GlobalFooterProps {

}

export function GlobalFooter({ }: GlobalFooterProps) {
    const { i18n } = useContext(Deps);
    return (
        <footer className="global">
            <a href="https://justthegoodparts.kevinmacwhinnie.com">
                {i18n.t('appByline')}
            </a>
        </footer>
    );
}