export function prettyOrthogonalScrollables(): void {
    const scrollables = document.querySelectorAll(".orthogonal-scrollable");
    for (let i = 0, length = scrollables.length; i < length; i++) {
        const scrollable = scrollables[i];
        function updateClasses() {
            const classes = scrollable.classList;
            const width = scrollable.clientWidth;
            const contentWidth = scrollable.scrollWidth;
            if (contentWidth <= width) {
                classes.remove("start", "end");
                return;
            }
            const contentOffsetX = scrollable.scrollLeft;
            if (contentOffsetX > 0) {
                classes.add("start");
            } else {
                classes.remove("start");
            }
            if (contentOffsetX < (contentWidth - width)) {
                classes.add("end");
            } else {
                classes.remove("end");
            }
        }
        scrollable.addEventListener("scroll", () => updateClasses());
        updateClasses();
    }
}
