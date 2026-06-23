(function () {
  const SLIDES = [
    { src: "media/web/younheefloordetail.jpg" },
    { src: "media/web/younheeopening.jpg" },
    { src: "media/web/collectorshome.jpg" },
    { src: "media/web/YounheeMainRoomPanel.jpg" },
    { src: "media/web/collectorhome2.jpg" },
    { src: "media/web/yuliastudioforhomepage.jpg" },
    { src: "media/web/Younheestairs.jpg" },
    { src: "media/web/peachpit.jpg" },
    { src: "media/web/IGGRID.png" },
    { src: "media/web/qualiaoutside.jpg" }
  ];

  const INTERVAL_MS = 2500;
  const FADE_MS = 1500;

  const container = document.querySelector("[data-landing-slideshow]");
  if (!container) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const images = SLIDES.map((slide, index) => {
    const img = document.createElement("img");
    img.className = "landing-slideshow__image";
    img.alt = "";
    img.decoding = "async";
    img.setAttribute("aria-hidden", "true");

    if (slide.objectPosition) {
      img.style.objectPosition = slide.objectPosition;
    }

    if (index === 0) {
      img.fetchPriority = "high";
      img.src = slide.src;
    }

    container.appendChild(img);
    return img;
  });

  if (prefersReducedMotion || images.length < 2) {
    return;
  }

  let activeIndex = 0;

  images.forEach((img, index) => {
    img.style.opacity = index === 0 ? "1" : "0";
    img.style.transition = `opacity ${FADE_MS}ms ease-in-out`;
  });

  function loadImage(img, src) {
    return new Promise((resolve, reject) => {
      if (img.getAttribute("src") === src) {
        resolve(img);
        return;
      }

      const onLoad = () => {
        cleanup();
        resolve(img);
      };
      const onError = () => {
        cleanup();
        reject(new Error(`Failed to load: ${src}`));
      };
      const cleanup = () => {
        img.removeEventListener("load", onLoad);
        img.removeEventListener("error", onError);
      };

      img.addEventListener("load", onLoad);
      img.addEventListener("error", onError);
      img.src = src;
    });
  }

  function advance() {
    const nextIndex = (activeIndex + 1) % SLIDES.length;

    loadImage(images[nextIndex], SLIDES[nextIndex].src)
      .then(() => {
        images[nextIndex].style.opacity = "1";
        images[activeIndex].style.opacity = "0";
        activeIndex = nextIndex;
      })
      .catch(() => {});
  }

  window.setInterval(advance, INTERVAL_MS);
})();
