(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const selector = [
    "main h1",
    "main h2",
    "main h3",
    "main p",
    "main figure",
    "main li",
    "main .case-brief__row",
    "main .contact-form__row",
    ".case-hero__stage",
    ".site-footer"
  ].join(", ");

  let items = [];

  function collect() {
    const found = Array.from(document.querySelectorAll(selector)).filter(function (el) {
      return !el.closest(".case-toc, .site-header, .home-hero__bio");
    });
    items = found.filter(function (el) {
      return !found.some(function (other) {
        return other !== el && other.contains(el);
      });
    });
    items.forEach(function (el) {
      el.classList.add("scroll-focus");
    });
  }

  function opacityFor(el, rect, height, atEnd) {
    if (rect.width === 0 && rect.height === 0) return 1;
    if (atEnd && rect.bottom > 0 && rect.top < height) return 1;

    // Grid rows stretch headings to the full row. Judge those by their text, not the stretched box.
    const textLike = el.matches("h1, h2, h3, p, li");
    const bottom = textLike ? rect.top + Math.min(rect.height, 96) : rect.bottom;

    const mid = height * 0.5;
    const band = height * 0.2;
    const focusTop = mid - band;
    const focusBottom = mid + band;
    let gap = 0;

    if (bottom < focusTop) gap = focusTop - bottom;
    else if (rect.top > focusBottom) gap = rect.top - focusBottom;
    else return 1;

    const falloff = height * 0.34;
    const amount = Math.min(1, gap / falloff);
    return 1 - amount * 0.82;
  }

  let frame = 0;

  function update() {
    frame = 0;
    const height = window.innerHeight;
    const maxScroll = document.documentElement.scrollHeight - height;
    const atEnd = maxScroll <= 8 || window.scrollY >= maxScroll - 8;

    items.forEach(function (el) {
      const value = opacityFor(el, el.getBoundingClientRect(), height, atEnd);
      el.style.setProperty("--focus", value.toFixed(3));
    });
  }

  function requestUpdate() {
    if (frame) return;
    frame = window.requestAnimationFrame(update);
  }

  collect();
  update();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  window.addEventListener("load", function () {
    collect();
    update();
  });
})();
