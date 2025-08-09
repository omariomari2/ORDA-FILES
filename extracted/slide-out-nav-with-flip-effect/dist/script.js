console.clear();
const navToggleBtn = document.getElementById("btn-nav-toggle");
const navMenu = document.getElementById("nav-menu");

// toggle nav button
navToggleBtn.addEventListener("click", (event) => {
	event.stopPropagation(); // Prevent immediate closing when clicking the button
	const isExpanded = navToggleBtn.getAttribute("aria-expanded") === "true";
	toggleNav(!isExpanded);
});

// toggle nav panel
function toggleNav(expand) {
	navToggleBtn.setAttribute("aria-expanded", String(expand));
	navMenu.setAttribute("aria-hidden", String(!expand));
	navMenu.toggleAttribute("inert", !expand);

	// add/remove event handler on dom to close nav panel
	expand && document.addEventListener("click", handleOutsideClick);
	!expand && document.removeEventListener("click", handleOutsideClick);
}
function handleOutsideClick(event) {
	if (!navMenu.contains(event.target) && !navToggleBtn.contains(event.target)) {
		toggleNav(false);
	}
}