const CAROUSEL_INTERVAL_MS = 2000;
const CAROUSEL_FADE_MS = 2000;
const CAROUSEL_PRELOAD_LEAD_MS = 800;

function assetUrl(path) {
  const root = window.SITE_ROOT || "";
  return root + path.replace(/^\//, "");
}

function loadCarouselImage(img, src) {
  if (img.src && img.getAttribute("src") === src) {
    return Promise.resolve(img);
  }

  return new Promise((resolve, reject) => {
    const onLoad = () => {
      cleanup();
      resolve(img);
    };
    const onError = () => {
      cleanup();
      reject(new Error(`Failed to load image: ${src}`));
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

function startCarousel(images, sources) {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  images.forEach((img, index) => {
    img.style.opacity = index === 0 ? "1" : "0";
    if (!prefersReducedMotion) {
      img.style.transition = `opacity ${CAROUSEL_FADE_MS}ms ease-in-out`;
    }
  });

  if (prefersReducedMotion || images.length < 2) {
    return;
  }

  let activeIndex = 0;
  const preloadTimers = new Map();

  function clearPreloadTimer(index) {
    const timer = preloadTimers.get(index);
    if (timer !== undefined) {
      window.clearTimeout(timer);
      preloadTimers.delete(index);
    }
  }

  function schedulePreload(index) {
    if (index === activeIndex || images[index].src) {
      return;
    }

    clearPreloadTimer(index);

    const timer = window.setTimeout(() => {
      preloadTimers.delete(index);
      loadCarouselImage(images[index], sources[index]).catch(() => {});
    }, CAROUSEL_PRELOAD_LEAD_MS);

    preloadTimers.set(index, timer);
  }

  function advance() {
    const nextIndex = (activeIndex + 1) % images.length;

    loadCarouselImage(images[nextIndex], sources[nextIndex])
      .then(() => {
        images[nextIndex].style.opacity = "1";
        images[activeIndex].style.opacity = "0";
        activeIndex = nextIndex;
        schedulePreload((activeIndex + 1) % images.length);
      })
      .catch(() => {});
  }

  schedulePreload(1);
  window.setInterval(advance, CAROUSEL_INTERVAL_MS);
}

function createCarouselImages(imageWrap, project) {
  imageWrap.classList.add("project-card__image-wrap--carousel");

  const sources = project.carouselImages.map(assetUrl);
  const images = sources.map((src, index) => {
    const img = document.createElement("img");
    img.alt = project.alt || project.title;
    img.className = "project-card__carousel-image";
    img.decoding = "async";

    if (index === 0) {
      img.fetchPriority = "high";
      img.src = src;
    }

    imageWrap.appendChild(img);
    return img;
  });

  startCarousel(images, sources);
}

function createProjectCard(project, options = {}) {
  const card = document.createElement(project.url ? "a" : "article");
  card.className = "project-card";

  if (project.url) {
    card.href = assetUrl(project.url);
  }

  const imageWrap = document.createElement("div");
  imageWrap.className = "project-card__image-wrap";

  const useCarousel = options.useCarousel && project.carouselImages?.length;

  if (useCarousel) {
    createCarouselImages(imageWrap, project);
  } else {
    const img = document.createElement("img");
    img.src = assetUrl(project.image);
    img.alt = project.alt || project.title;
    img.className = "project-card__image";
    img.loading = "lazy";
    img.decoding = "async";
    imageWrap.appendChild(img);
  }

  const title = document.createElement("h3");
  title.className = "project-card__title";
  title.textContent = project.title;

  card.appendChild(imageWrap);
  card.appendChild(title);

  return card;
}

function renderProjects() {
  document.querySelectorAll("[data-projects-list]").forEach((container) => {
    const pillarId = container.dataset.pillar;
    const useCarousel = container.hasAttribute("data-use-carousel");

    const projects = pillarId
      ? PROJECTS.filter((project) => project.pillar === pillarId)
      : PROJECTS;

    projects.forEach((project) => {
      container.appendChild(createProjectCard(project, { useCarousel }));
    });
  });
}

function renderPillarCarousels() {
  document.querySelectorAll("[data-pillar-carousel]").forEach((container) => {
    const config = PILLAR_CAROUSELS[container.dataset.pillarCarousel];
    if (!config?.carouselImages?.length) {
      return;
    }

    const imageWrap = document.createElement("div");
    imageWrap.className = "project-card__image-wrap";
    createCarouselImages(imageWrap, config);
    container.appendChild(imageWrap);
  });
}

function renderPillarSpreads() {
  document.querySelectorAll("[data-pillar-spreads]").forEach((container) => {
    const config = PILLAR_SPREADS[container.dataset.pillarSpreads];
    if (!config?.images?.length) {
      return;
    }

    const scroll = document.createElement("div");
    scroll.className = "catalog-scroll";
    scroll.setAttribute("role", "region");
    scroll.setAttribute("aria-label", config.label || "Catalog spreads");
    scroll.setAttribute("tabindex", "0");

    config.images.forEach((src, index) => {
      const item = document.createElement("figure");
      item.className = "catalog-scroll__item";

      const img = document.createElement("img");
      img.className = "catalog-scroll__image";
      img.src = assetUrl(src);
      img.alt = `${config.alt || "Catalog spread"} ${index + 1} of ${config.images.length}`;
      img.decoding = "async";

      if (index === 0) {
        img.fetchPriority = "high";
      } else {
        img.loading = "lazy";
      }

      item.appendChild(img);
      scroll.appendChild(item);
    });

    const hint = document.createElement("p");
    hint.className = "catalog-scroll__hint";
    hint.textContent = "Scroll to browse spreads";

    container.appendChild(scroll);
    container.appendChild(hint);
  });
}

renderProjects();
renderPillarCarousels();
renderPillarSpreads();
