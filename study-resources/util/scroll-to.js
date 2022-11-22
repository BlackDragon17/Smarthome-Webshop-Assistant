/**
 * Scrolls to the given element.
 *
 * @param {HTMLElement} element
 */
export default function scrollTo(element) {
    const navbarHeight = $(".navbar.navbar-default")[0].offsetHeight;
    const containerPosition = element.getBoundingClientRect().top;
    const offsetPosition = containerPosition + window.pageYOffset - navbarHeight - 10;
    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
    });
}
