const FOOTER_CONTACTS_MARKUP = `
  <nav class="about-links site-footer__links" aria-label="Contact links">
    <a href="mailto:sarahkim1001@gmail.com" class="about-links__item" aria-label="Email">
      <svg class="about-links__icon" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="1.5"/>
        <path d="M3 7l9 6 9-6"/>
      </svg>
    </a>
    <a href="https://www.linkedin.com/in/sarah-s-kim-03047020a/" class="about-links__item" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
      <svg class="about-links__icon" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M8 10v7"/>
        <circle class="about-links__icon-dot" cx="8" cy="7.5" r="0.75"/>
        <path d="M12 10v7"/>
        <path d="M12 13c0-1.66 1.34-3 3-3s3 1.34 3 3v4"/>
      </svg>
    </a>
    <a href="https://instagram.com/s4rahkim" class="about-links__item" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
      <svg class="about-links__icon" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle class="about-links__icon-dot" cx="17.25" cy="6.75" r="0.75"/>
      </svg>
    </a>
    <span class="about-links__item about-links__item--pending" aria-label="CV — coming soon" title="CV coming soon">
      <svg class="about-links__icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 4h6l4 4v12a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/>
        <path d="M14 4v4h4"/>
        <path d="M9 13h6M9 17h4"/>
      </svg>
    </span>
  </nav>
`;

document.querySelectorAll("[data-footer-contacts]").forEach((container) => {
  container.innerHTML = FOOTER_CONTACTS_MARKUP;
});
