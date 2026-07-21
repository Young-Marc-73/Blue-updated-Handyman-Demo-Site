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

/* =========================================================
   ENHANCEMENTS — North Harbor Digital design/interaction layer
   Sticky navbar condense · hero parallax · scroll reveal ·
   stat count-ups · before/after slider · sticky call bar ·
   toast. Progressive + reduced-motion aware.
   ========================================================= */
(function () {
  "use strict";
  var REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var PHONE = "tel:+15169077001";

  /* ---- Sticky, condensing navbar ---- */
  function initCondenseNav() {
    var nav = document.querySelector(".navbar");
    if (!nav) return;
    var onScroll = function () { nav.classList.toggle("is-scrolled", window.scrollY > 24); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Subtle hero parallax (desktop, motion-safe) ---- */
  function initHeroParallax() {
    if (REDUCE) return;
    var img = document.querySelector(".hero-bg img");
    if (!img || window.innerWidth < 768) return;
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = Math.min(window.scrollY, 900);
        img.style.transform = "translate3d(0," + (y * 0.12) + "px,0) scale(1.06)";
        ticking = false;
      });
    }, { passive: true });
    img.style.transform = "scale(1.06)";
  }

  /* ---- Scroll reveal (staggered) ---- */
  function initReveal() {
    if (REDUCE || !("IntersectionObserver" in window)) return;
    var selectors = [".section-title", ".card", ".greview", ".feature-card",
      ".split-feature > *", ".ba-figure", ".cta-copy", ".cta-image",
      ".steps .step", ".stat", ".accordion-item", ".greviews__card"];
    var els = [];
    selectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        if (el.closest(".hero")) return;            // never hide the hero
        if (els.indexOf(el) !== -1) return;
        els.push(el);
      });
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("reveal--in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach(function (el) {
      el.classList.add("reveal");
      // stagger by index among siblings (cap so it never feels slow)
      var sibs = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.style.transitionDelay = Math.min(sibs, 5) * 70 + "ms";
      io.observe(el);
    });
  }

  /* ---- Count-up numbers ---- */
  function animateCount(el) {
    var to = parseFloat(el.getAttribute("data-to") || "0");
    var dec = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var suffix = el.getAttribute("data-suffix") || "";
    if (REDUCE) { el.textContent = to.toFixed(dec) + suffix; return; }
    var start = null, dur = 1400;
    function tick(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);           // easeOutCubic
      el.textContent = (to * eased).toFixed(dec) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = to.toFixed(dec) + suffix;
    }
    requestAnimationFrame(tick);
  }
  function initCountUp() {
    var nums = document.querySelectorAll("[data-countup]");
    if (!nums.length) return;
    if (!("IntersectionObserver" in window)) { nums.forEach(animateCount); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    nums.forEach(function (n) { io.observe(n); });
  }

  /* ---- Before / After comparison slider ---- */
  function initBeforeAfter() {
    document.querySelectorAll(".ba-slider").forEach(function (slider) {
      var divider = slider.querySelector(".ba-divider");
      var dragging = false;
      function setPos(pct) {
        pct = Math.max(0, Math.min(100, pct));
        slider.style.setProperty("--pos", pct + "%");
        if (divider) divider.setAttribute("aria-valuenow", Math.round(pct));
      }
      function fromEvent(clientX) {
        var r = slider.getBoundingClientRect();
        setPos(((clientX - r.left) / r.width) * 100);
      }
      slider.addEventListener("pointerdown", function (e) {
        dragging = true; slider.setPointerCapture(e.pointerId); fromEvent(e.clientX);
      });
      slider.addEventListener("pointermove", function (e) { if (dragging) fromEvent(e.clientX); });
      slider.addEventListener("pointerup", function () { dragging = false; });
      slider.addEventListener("pointercancel", function () { dragging = false; });
      // Keyboard support on the divider handle
      if (divider) {
        divider.addEventListener("keydown", function (e) {
          var cur = parseFloat(slider.style.getPropertyValue("--pos")) || 50;
          if (e.key === "ArrowLeft") { setPos(cur - 3); e.preventDefault(); }
          else if (e.key === "ArrowRight") { setPos(cur + 3); e.preventDefault(); }
          else if (e.key === "Home") { setPos(0); e.preventDefault(); }
          else if (e.key === "End") { setPos(100); e.preventDefault(); }
        });
      }
      setPos(50);
    });
  }

  /* ---- Sticky mobile call bar (injected once, all pages) ---- */
  function initCallBar() {
    if (document.querySelector(".call-bar")) return;
    document.body.classList.add("has-callbar");
    var bar = document.createElement("div");
    bar.className = "call-bar";
    bar.setAttribute("aria-label", "Quick contact");
    bar.innerHTML =
      '<a class="btn btn-warm" href="' + PHONE + '">' +
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' +
      'Call now</a>' +
      '<a class="btn btn-secondary-alt" href="contact.html" style="background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.5);color:#fff;">Free quote</a>';
    document.body.appendChild(bar);
    var show = function () { bar.classList.toggle("show", window.scrollY > 280); };
    show();
    window.addEventListener("scroll", show, { passive: true });
  }

  /* ---- Toast helper + form-submit feedback ---- */
  function ensureToastStack() {
    var s = document.querySelector(".toast-stack");
    if (!s) { s = document.createElement("div"); s.className = "toast-stack"; s.setAttribute("aria-live", "polite"); document.body.appendChild(s); }
    return s;
  }
  function showToast(msg, type) {
    var stack = ensureToastStack();
    var t = document.createElement("div");
    t.className = "toast" + (type === "info" ? " toast--info" : "");
    t.setAttribute("role", "status");
    t.innerHTML = '<span class="toast__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg></span><span>' + msg + '</span>';
    stack.appendChild(t);
    requestAnimationFrame(function () { t.classList.add("show"); });
    setTimeout(function () { t.classList.remove("show"); setTimeout(function () { t.remove(); }, 350); }, 3200);
  }
  function initFormToast() {
    document.querySelectorAll("form[data-netlify], form[name]").forEach(function (form) {
      form.addEventListener("submit", function () {
        // Non-blocking: acknowledge, then the native POST/redirect proceeds.
        showToast("Sending your request… we'll be in touch shortly.", "info");
      });
    });
  }

  /* ---- Smooth accordion: animate real height, close to a true zero ---- */
  function initAccordionSmooth() {
    document.querySelectorAll(".accordion-item").forEach(function (item) {
      var content = item.querySelector(".accordion-content");
      if (!content) return;
      function sync() {
        if (item.getAttribute("data-state") === "open") {
          content.style.maxHeight = content.scrollHeight + "px";
        } else {
          // if it was left at 'none', give it a concrete height to animate from
          if (content.style.maxHeight === "none" || content.style.maxHeight === "") {
            content.style.maxHeight = content.scrollHeight + "px";
          }
          requestAnimationFrame(function () { content.style.maxHeight = "0px"; });
        }
      }
      // After opening, drop the fixed cap so long answers never clip on resize
      content.addEventListener("transitionend", function (e) {
        if (e.propertyName === "max-height" && item.getAttribute("data-state") === "open") {
          content.style.maxHeight = "none";
        }
      });
      new MutationObserver(sync).observe(item, { attributes: true, attributeFilter: ["data-state"] });
      // initial state
      content.style.maxHeight = item.getAttribute("data-state") === "open" ? "none" : "0px";
    });
  }

  function boot() {
    initCondenseNav(); initHeroParallax(); initReveal();
    initCountUp(); initBeforeAfter(); initCallBar(); initFormToast();
    initAccordionSmooth();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
