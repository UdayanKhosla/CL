(function initialiseNavigationSwipe() {
  const nav = document.querySelector(".header-nav");
  if (!nav) return;

  const links = [...nav.querySelectorAll("a")];
  const activeLink = nav.querySelector("a.active");
  if (!activeLink) return;

  const indicator = document.createElement("span");
  indicator.className = "nav-swipe-indicator";
  indicator.setAttribute("aria-hidden", "true");
  nav.prepend(indicator);

  function moveIndicator(link, animate = true) {
    const navBox = nav.getBoundingClientRect();
    const linkBox = link.getBoundingClientRect();
    indicator.style.transitionDuration = animate ? "240ms" : "0ms";
    indicator.style.width = `${linkBox.width}px`;
    indicator.style.transform = `translateX(${linkBox.left - navBox.left - 5}px)`;
  }

  requestAnimationFrame(() => {
    moveIndicator(activeLink, false);
    nav.classList.add("nav-enhanced");
    requestAnimationFrame(() => {
      indicator.style.transitionDuration = "";
    });
  });

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        link.classList.contains("active")
      ) {
        return;
      }

      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin) return;

      event.preventDefault();
      links.forEach((item) => item.classList.remove("active"));
      link.classList.add("active");
      moveIndicator(link);
      window.setTimeout(() => {
        window.location.href = destination.href;
      }, 230);
    });
  });

  window.addEventListener("resize", () => {
    const current = nav.querySelector("a.active");
    if (current) moveIndicator(current, false);
  });
})();
