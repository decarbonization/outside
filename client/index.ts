import { autoReload } from "./utilities/auto-reload";
import { prettyOrthogonalScrollables } from "./utilities/pretty-scrollables";

document.addEventListener("DOMContentLoaded", () => {
    prettyOrthogonalScrollables();
    autoReload();
});
