const header = document.querySelector(".site-header");
const SCROLL_THRESHOLD = 32;

let isScrolled = window.scrollY > SCROLL_THRESHOLD;

function updateHeader() {
  if (!header) {
    return;
  }

  const scrolled = window.scrollY > SCROLL_THRESHOLD;

  if (scrolled !== isScrolled) {
    isScrolled = scrolled;
    header.classList.toggle("is-scrolled", scrolled);
  }
}

if (header) {
  header.classList.toggle("is-scrolled", isScrolled);
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();
}
