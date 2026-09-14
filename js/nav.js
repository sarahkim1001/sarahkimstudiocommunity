(function () {
  function getRoot() {
    if (typeof window.SITE_ROOT === "string") {
      return window.SITE_ROOT;
    }

    const script = document.querySelector('script[src*="nav.js"]');
    const src = script?.getAttribute("src") || "";
    return src.includes("../") ? "../" : "";
  }

  function detectActive() {
    const page = document.body.dataset.navActive;
    if (page) {
      return page;
    }

    const path = window.location.pathname.replace(/\/$/, "");
    if (path.endsWith("/about") || path.includes("/about/")) {
      return "about";
    }
    if (path.includes("contact") || path.includes("start-a-project")) {
      return "contact";
    }
    return "work";
  }

  function linkClass(active, key) {
    return active === key ? " site-nav__link--active" : "";
  }

  const root = getRoot();
  const active = detectActive();

  const markup = `
    <div class="layout-container site-header__grid">
      <nav class="site-nav site-nav--left" aria-label="Primary navigation">
        <ul class="site-nav__list">
          <li><a href="${root}index.html#work" class="site-nav__link${linkClass(active, "work")}">Work</a></li>
          <li><a href="${root}about/index.html" class="site-nav__link${linkClass(active, "about")}">About</a></li>
        </ul>
      </nav>
      <a href="${root}index.html" class="site-wordmark" aria-label="Sarah Kim Studio — Home">
        <span class="site-wordmark__line">Sarah Kim</span>
        <span class="site-wordmark__line">Studio</span>
      </a>
      <nav class="site-nav site-nav--right" aria-label="Contact navigation">
        <ul class="site-nav__list">
          <li><a href="${root}contact.html" class="site-nav__link${linkClass(active, "contact")}">Contact</a></li>
        </ul>
      </nav>
    </div>
  `;

  document.querySelectorAll("[data-site-nav]").forEach((container) => {
    container.innerHTML = markup;
  });
})();
