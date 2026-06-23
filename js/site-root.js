(function () {
  const script = document.currentScript;
  const src = script?.getAttribute("src") || "";
  const depth = (src.match(/\.\.\//g) || []).length;
  window.SITE_ROOT = depth ? "../".repeat(depth) : "";
})();
