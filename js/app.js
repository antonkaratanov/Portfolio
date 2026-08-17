(function () {
  "use strict";

  // Must match --menu-duration in css/main.css
  const MENU_ANIMATION_DURATION = 300;

  const burgerMenu = document.querySelector(".burger-menu");
  const header = document.querySelector(".header");
  const headerNav = document.querySelector(".header-nav");
  const body = document.body;

  if (!burgerMenu || !header || !headerNav) {
    return;
  }

  let isAnimating = false;
  let pendingToggle = false;
  let closeTimeoutId = null;

  // --- Scroll shadow on header ---
  let scrollTimeoutId = null;
  window.addEventListener("scroll", () => {
    clearTimeout(scrollTimeoutId);
    scrollTimeoutId = setTimeout(() => {
      header.classList.toggle("header-scrolled", window.scrollY > 0);
    }, 10);
  });

  // --- Menu open/close ---
  function toggleMenu(btn) {
    isAnimating = true;
    clearTimeout(closeTimeoutId);

    const isOpening = !btn.classList.contains("active");

    btn.setAttribute("aria-expanded", String(isOpening));
    headerNav.setAttribute("aria-hidden", String(!isOpening));

    if (isOpening) {
      btn.classList.remove("closing");
      btn.classList.add("active");
      header.classList.add("header-menu-open");
      body.classList.add("no-scroll");
      headerNav.classList.add("visible");
    } else {
      btn.classList.remove("active");
      btn.classList.add("closing");
      header.classList.remove("header-menu-open");
      body.classList.remove("no-scroll");
      headerNav.classList.remove("visible");
    }

    closeTimeoutId = setTimeout(() => {
      btn.classList.remove("closing");
      isAnimating = false;

      if (pendingToggle) {
        pendingToggle = false;
        toggleMenu(btn);
      }
    }, MENU_ANIMATION_DURATION);
  }

  burgerMenu.addEventListener("click", () => {
    if (isAnimating) {
      pendingToggle = true;
      return;
    }
    toggleMenu(burgerMenu);
  });

  headerNav.addEventListener("click", (event) => {
    if (
      event.target.classList.contains("header-nav--item") &&
      burgerMenu.classList.contains("active")
    ) {
      toggleMenu(burgerMenu);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && burgerMenu.classList.contains("active")) {
      toggleMenu(burgerMenu);
    }
  });
})();
