const CAROUSEL_INTERVAL_MS = 2000;
const CAROUSEL_FADE_MS = 2000;
const CAROUSEL_PRELOAD_LEAD_MS = 800;

function assetUrl(path) {
  const root = window.SITE_ROOT || "";
  const normalized = path.replace(/^\//, "");
  return root + normalized.split("/").map((segment) => encodeURIComponent(segment)).join("/");
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

function createWorkBlock(project) {
  const isPlaceholder = project.placeholder === true;
  const hasDisclaimer = Boolean(project.disclaimer);
  const hasLink = !isPlaceholder && project.url;
  const useArticle = hasDisclaimer || isPlaceholder || !hasLink;
  const block = document.createElement(useArticle ? "article" : "a");
  block.className = "work-block";

  if (isPlaceholder) {
    block.classList.add("work-block--placeholder");
  }

  if (hasDisclaimer) {
    block.classList.add("work-block--has-credit");
  }

  if (hasLink && !useArticle) {
    block.href = assetUrl(project.url);
  }

  const category = document.createElement("p");
  category.className = "work-block__category";
  category.textContent = project.category || "";

  const description = document.createElement("p");
  description.className = "work-block__description";
  description.textContent = project.description || "";

  const imageWrap = document.createElement("div");
  imageWrap.className = "work-block__image-wrap";

  if (isPlaceholder) {
    const label = document.createElement("span");
    label.className = "work-block__placeholder-label";
    label.textContent = project.title || "Coming Soon";
    imageWrap.appendChild(label);
  } else {
    const img = document.createElement("img");
    img.src = assetUrl(project.image);
    img.alt = project.alt || project.title;
    img.className = project.imageFaded
      ? "work-block__image work-block__image--faded"
      : "work-block__image";
    img.loading = "lazy";
    img.decoding = "async";
    imageWrap.appendChild(img);
  }

  if (hasLink && useArticle) {
    const link = document.createElement("a");
    link.href = assetUrl(project.url);
    link.className = "work-block__link";
    link.appendChild(category);
    link.appendChild(description);
    link.appendChild(imageWrap);
    block.appendChild(link);
  } else {
    block.appendChild(category);
    block.appendChild(description);
    block.appendChild(imageWrap);
  }

  if (hasDisclaimer) {
    const credit = document.createElement("p");
    credit.className = "work-block__credit";
    credit.textContent = project.disclaimer;
    block.appendChild(credit);
  }

  return block;
}

function renderWorkGrid() {
  const container = document.querySelector("[data-work-grid]");
  if (!container) {
    return;
  }

  HOME_PROJECTS.forEach((project) => {
    container.appendChild(createWorkBlock(project));
  });
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
    const useCarousel = container.hasAttribute("data-use-carousel");

    HOME_PROJECTS.filter((project) => !project.placeholder).forEach((project) => {
      container.appendChild(createProjectCard(project, { useCarousel }));
    });
  });
}

function renderPillarCarousels() {
  document.querySelectorAll("[data-pillar-carousel]").forEach(() => {});
}

function renderPillarSpreads() {
  document.querySelectorAll("[data-pillar-spreads]").forEach(() => {});
}

renderWorkGrid();
renderProjects();
renderPillarCarousels();
renderPillarSpreads();
