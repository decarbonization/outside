export function autoReload(): void {
    const lastUpdatedFooter = document.querySelector<HTMLElement>(".current-forecast .last-updated");
    if (lastUpdatedFooter === null) {
        return;
    }
    const rawExpires = lastUpdatedFooter.dataset["expires"];
    if (typeof rawExpires !== 'string') {
        console.error(`.last-updated[@data-expires] ${rawExpires} is not a string`)
        return;
    }
    const expires = new Date(rawExpires);
    let isUnloading = false;
    window.addEventListener("beforeunload", () => {
        isUnloading = true;
        console.info("Leaving page, auto refresh disabled");
    });
    document.addEventListener("visibilitychange", () => {
        if (document.hidden || isUnloading) {
            return;
        }
        if (new Date() <= expires) {
            console.info(`No refresh required, data expires on ${expires}`);
            return;
        }
        window.location.reload();
    });
}