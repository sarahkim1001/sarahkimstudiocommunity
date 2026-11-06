(function () {
  const toc = document.querySelector("body.page-paper .case-toc");
  const stage = document.querySelector("body.page-paper .case-hero__stage");
  if (!toc || !stage) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const hold = document.createElement("div");
  hold.className = "case-stage-hold";
  stage.parentNode.insertBefore(hold, stage);
  hold.appendChild(stage);
  stage.classList.add("case-stage-hold__sticky");

  const header = document.querySelector(".site-header");

  function fadeDistance() {
    return Math.min(520, Math.round(window.innerHeight * 0.45));
  }

  function layout() {
    const headerH = header ? header.getBoundingClientRect().height : 0;
    const stageH = stage.offsetHeight;
    const available = window.innerHeight - headerH;
    const fits = stageH > 0 && stageH < available - 24;

    if (!fits) {
      stage.style.position = "relative";
      stage.style.top = "auto";
      hold.style.height = "auto";
      toc.style.opacity = "1";
      toc.style.pointerEvents = "auto";
      return false;
    }

    const top = headerH + (available - stageH) / 2;
    stage.style.position = "";
    stage.style.top = top + "px";
    hold.style.height = (stageH + fadeDistance()) + "px";
    return true;
  }

  function update() {
    const room = hold.offsetHeight - stage.offsetHeight;
    if (room <= 1) return;

    const top = parseFloat(stage.style.top) || 0;
    const traveled = top - hold.getBoundingClientRect().top;
    const progress = Math.min(1, Math.max(0, traveled / room));
    toc.style.opacity = String(progress);
    toc.style.pointerEvents = progress < 0.4 ? "none" : "auto";
  }

  function refresh() {
    layout();
    update();
  }

  refresh();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", refresh);
  window.addEventListener("load", refresh);
})();
