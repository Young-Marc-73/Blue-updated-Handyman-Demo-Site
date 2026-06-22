/* =========================================================
   Your Local Handyman — Site script
   Handles navbar, dropdown, accordion, carousel
   ========================================================= */

(function () {
  "use strict";

  // ---- Mobile nav toggle ----
  function initNavbar() {
    const toggle = document.querySelector(".navbar-toggle");
    const mobileMenu = document.querySelector(".navbar-mobile");
    if (!toggle || !mobileMenu) return;

    toggle.addEventListener("click", function () {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      mobileMenu.classList.toggle("open", !isOpen);
    });

    // Close on link click (mobile)
    mobileMenu.querySelectorAll("a:not(.dropdown-trigger)").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        mobileMenu.classList.remove("open");
      });
    });
  }

  // ---- Dropdowns (hover on desktop, click on mobile) ----
  function initDropdowns() {
    const dropdowns = document.querySelectorAll(".dropdown");
    const mq = window.matchMedia("(min-width: 992px)");

    dropdowns.forEach((dd) => {
      const trigger = dd.querySelector(".dropdown-trigger");
      if (!trigger) return;

      // Click toggle (works on mobile, also as keyboard accessible)
      trigger.addEventListener("click", function (e) {
        e.preventDefault();
        const isOpen = dd.getAttribute("data-open") === "true";
        // Close other open dropdowns
        dropdowns.forEach((other) => {
          if (other !== dd) other.setAttribute("data-open", "false");
        });
        dd.setAttribute("data-open", String(!isOpen));
      });

      // Desktop hover
      dd.addEventListener("mouseenter", function () {
        if (mq.matches) dd.setAttribute("data-open", "true");
      });
      dd.addEventListener("mouseleave", function () {
        if (mq.matches) dd.setAttribute("data-open", "false");
      });
    });

    // Close on outside click
    document.addEventListener("click", function (e) {
      dropdowns.forEach((dd) => {
        if (!dd.contains(e.target)) dd.setAttribute("data-open", "false");
      });
    });
  }

  // ---- Accordion (FAQ) ----
  function initAccordion() {
    document.querySelectorAll(".accordion").forEach((acc) => {
      const allowMultiple = acc.getAttribute("data-type") === "multiple";
      acc.querySelectorAll(".accordion-trigger").forEach((trigger) => {
        trigger.addEventListener("click", function () {
          const item = trigger.closest(".accordion-item");
          if (!item) return;
          const isOpen = item.getAttribute("data-state") === "open";
          if (!allowMultiple) {
            acc.querySelectorAll(".accordion-item").forEach((it) => {
              it.setAttribute("data-state", "closed");
            });
          }
          item.setAttribute("data-state", isOpen ? "closed" : "open");
        });
      });
    });
  }

  // ---- Simple carousel (homepage real stories) ----
  function initCarousels() {
    document.querySelectorAll(".carousel").forEach((carousel) => {
      const track = carousel.querySelector(".carousel-track");
      const slides = track ? Array.from(track.children) : [];
      const dots = Array.from(carousel.querySelectorAll(".carousel-dots button"));
      const prevBtn = carousel.querySelector(".carousel-arrows .prev");
      const nextBtn = carousel.querySelector(".carousel-arrows .next");
      if (!track || slides.length === 0) return;

      let current = 0;

      function update() {
        dots.forEach((d, i) => d.setAttribute("data-active", String(i === current)));
      }

      function scrollTo(i) {
        const slide = slides[i];
        if (!slide) return;
        current = i;
        track.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
        update();
      }

      dots.forEach((dot, i) => {
        dot.addEventListener("click", () => scrollTo(i));
      });

      if (prevBtn) prevBtn.addEventListener("click", () => {
        scrollTo((current - 1 + slides.length) % slides.length);
      });
      if (nextBtn) nextBtn.addEventListener("click", () => {
        scrollTo((current + 1) % slides.length);
      });

      // Sync dots on manual scroll
      let scrollTimeout;
      track.addEventListener("scroll", () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          const scrollLeft = track.scrollLeft;
          let closest = 0;
          let closestDist = Infinity;
          slides.forEach((s, i) => {
            const dist = Math.abs(s.offsetLeft - scrollLeft);
            if (dist < closestDist) { closestDist = dist; closest = i; }
          });
          current = closest;
          update();
        }, 80);
      });

      update();
    });
  }

  // ---- Form: Netlify Forms friendly submit feedback ----
  function initForms() {
    document.querySelectorAll("form[data-netlify]").forEach((form) => {
      form.addEventListener("submit", function () {
        const btn = form.querySelector("[type='submit']");
        if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      });
    });
  }

  // ---- Init ----
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initNavbar(); initDropdowns(); initAccordion(); initCarousels(); initForms();
    });
  } else {
    initNavbar(); initDropdowns(); initAccordion(); initCarousels(); initForms();
  }
})();
