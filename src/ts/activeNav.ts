export function setActiveNav() {
  const path = window.location.pathname || "/";

  const links = document.querySelectorAll<HTMLAnchorElement>(".nav__list__item");

  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;

    const normalizedHref = href === "/" ? "/" : href.replace(/\/$/, "");
    const normalizedPath = path === "/" ? "/" : path.replace(/\/$/, "");

    if (normalizedHref === normalizedPath) {
      link.classList.add("nav__list__item--active");
    } else {
      link.classList.remove("nav__list__item--active");
    }
  });
  return path;
}