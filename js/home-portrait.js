(function () {
  const portrait = document.querySelector(".home-hero__portrait");
  const hero = document.querySelector(".home-hero");
  if (!portrait || !hero) return;

  const desktop = window.matchMedia("(min-width: 801px)");
  let focused = false;

  function overImage(event) {
    const box = portrait.getBoundingClientRect();
    return event.clientX >= box.left && event.clientX <= box.right
      && event.clientY >= box.top && event.clientY <= box.bottom;
  }

  function open() {
    if (!desktop.matches) return;
    document.body.classList.add("is-portrait-open");
  }

  function close() {
    document.body.classList.remove("is-portrait-open");
  }

  document.addEventListener("pointermove", function (event) {
    if (!desktop.matches || focused) return;
    if (overImage(event)) open();
    else close();
  });

  document.addEventListener("pointerout", function (event) {
    if (!event.relatedTarget) close();
  });

  portrait.addEventListener("focus", function () {
    focused = true;
    open();
  });

  portrait.addEventListener("blur", function () {
    focused = false;
    close();
  });

  desktop.addEventListener("change", function () {
    if (!desktop.matches) close();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") close();
  });
})();
