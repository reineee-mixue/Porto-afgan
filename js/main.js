(() => {
  const root = document.documentElement;
  const intro = document.getElementById("introScreen");
  const enterButton = document.getElementById("enterButton");
  const skipIntro = document.getElementById("skipIntro");
  const themeButton = document.querySelector(".theme-toggle");
  const themeIcon = document.querySelector(".theme-icon");
  const menuButton = document.querySelector(".menu-toggle");
  const mobileNav = document.getElementById("mobileNav");
  const backToTop = document.querySelector(".back-to-top");

  // Keep the entrance for each fresh tab session, but don't trap returning visitors.
  const introSeen = sessionStorage.getItem("cat-portfolio-intro-seen");
  if (introSeen) intro?.classList.add("is-hidden");

  function closeIntro() {
    intro?.classList.add("is-hidden");
    sessionStorage.setItem("cat-portfolio-intro-seen", "yes");
  }
  enterButton?.addEventListener("click", closeIntro);
  skipIntro?.addEventListener("click", closeIntro);

  function updateThemeIcon() {
    const isLight = root.dataset.theme === "light";
    if (themeIcon) themeIcon.textContent = isLight ? "☾" : "☼";
    themeButton?.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
  }
  updateThemeIcon();
  themeButton?.addEventListener("click", () => {
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    localStorage.setItem("cat-portfolio-theme", next);
    updateThemeIcon();
  });

  menuButton?.addEventListener("click", () => {
    const open = mobileNav?.classList.toggle("is-open") ?? false;
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  });
  mobileNav?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("is-open");
      menuButton?.setAttribute("aria-expanded", "false");
    });
  });

  const onScroll = () => backToTop?.classList.toggle("visible", window.scrollY > 450);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Reveal sections as they enter the viewport. Content remains visible if unsupported.
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const targets = document.querySelectorAll(".section-block, .contact-card, .music-card");
    targets.forEach(el => { el.style.opacity = "0"; el.style.transform = "translateY(18px)"; });
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.transition = "opacity .6s ease, transform .6s ease";
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    targets.forEach(el => observer.observe(el));
  }
})();
