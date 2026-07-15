/* =========================================================
   Complete Home Services — Site script
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

  // ---- Hero quote form (inline success) ----
  function initLeadForm() {
    document.querySelectorAll(".lead-form form").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        form.innerHTML =
          '<div style="text-align:center;padding:1.5rem 0">' +
          '<div style="font-size:3rem;margin-bottom:.5rem">\u2705</div>' +
          '<h4 style="font-family:Poppins,system-ui,sans-serif;font-weight:400;margin-bottom:.4rem">Quote request received!</h4>' +
          '<p style="color:var(--color-neutral);font-size:var(--text-regular)">We\u2019ll call you back within 15 minutes during business hours.</p>' +
          '<p style="margin-top:1rem;font-size:var(--text-regular)">Can\u2019t wait? Call <a href="tel:+16173069634" style="color:var(--color-science-blue);font-weight:600">(617) 306-9634</a></p>' +
          '</div>';
      });
    });
  }

  // ---- Google reviews carousel scroll ----
  function initReviewsCarousel() {
    window.scrollReviews = function (dir) {
      var t = document.getElementById("reviewTrack");
      if (t) t.scrollBy({ left: dir * 304, behavior: "smooth" });
    };
  }

  // ---- Smart FAQ chatbot (site-wide, injected) ----
  function initChatbot() {
    if (document.getElementById("chatLauncher")) return;

    var BIZ = {
      name: "Complete Home Services",
      phone: "(617) 306-9634",
      phoneTel: "16173069634",
      email: "hello@completehomeservices.com",
      hours: "Mon\u2013Sat 7 AM \u2013 6 PM",
      emergency: "Yes \u2014 same-week service for most jobs, and we prioritize urgent issues",
      area: "all of Newport and nearby towns",
      reviewUrl: "reviews.html"
    };

    var QA = [
      { keys: ["hours", "open", "close", "schedule", "available", "when"],
        answer: "Our regular hours are <strong>" + BIZ.hours + "</strong>. " + BIZ.emergency + ".",
        followUp: ["Get a quote", "Services offered", "What area do you serve?"] },
      { keys: ["emergency", "urgent", "flood", "burst", "leak", "broken", "water everywhere"],
        answer: "For urgent issues we move fast \u2014 call us and we\u2019ll do our best to get someone out same-day.<br><br>\ud83d\udcde <a href='tel:+" + BIZ.phoneTel + "'>" + BIZ.phone + "</a>",
        followUp: ["Call now", "Other question"] },
      { keys: ["price", "cost", "how much", "rate", "estimate", "quote", "pricing", "afford"],
        answer: "Every job is different, so we provide <strong>free written estimates</strong> with no obligation. We\u2019ll come out, look at the work, and give you an honest price before anything starts. No surprises!<br><br>Want us to come take a look?",
        followUp: ["Get a free quote", "Call to discuss", "Services offered"] },
      { keys: ["service", "what do you do", "offer", "help with", "work on", "do you do", "can you"],
        answer: "Here\u2019s what we handle:<br>\ud83d\udd27 General repairs<br>\ud83c\udfa8 Painting &amp; drywall<br>\ud83e\udeb5 Flooring<br>\ud83d\udd28 Carpentry &amp; decking<br>\ud83d\udeaa Doors &amp; windows<br>\u267f Safety &amp; mobility upgrades<br><br>Don\u2019t see what you need? Just ask!",
        followUp: ["Get a quote", "What area do you serve?", "Hours"] },
      { keys: ["area", "location", "where", "serve", "cover", "travel", "come to", "zip", "city", "town"],
        answer: "We serve <strong>" + BIZ.area + "</strong>.<br><br>Not sure if we cover your area? Just give us a call!",
        followUp: ["Get a quote", "Call us", "Hours"] },
      { keys: ["license", "insured", "certified", "bonded", "warranty", "guarantee"],
        answer: "Absolutely! \u2705 We are <strong>fully licensed, bonded, and insured</strong>. All our work comes with a satisfaction guarantee \u2014 if something\u2019s not right, we\u2019ll come back and fix it.",
        followUp: ["Get a quote", "Services offered"] },
      { keys: ["review", "rating", "testimonial", "google", "recommend", "reputation"],
        answer: "We\u2019re proud of our <strong>4.9-star rating</strong> on Google with 127+ reviews! \ud83c\udf1f You can read them on our <a href='" + BIZ.reviewUrl + "'>reviews page</a>.",
        followUp: ["Get a quote", "Services offered", "Hours"] },
      { keys: ["pay", "payment", "credit card", "cash", "check", "finance", "financing"],
        answer: "We accept <strong>cash, check, and all major credit cards</strong>. For larger jobs we can talk through options \u2014 we\u2019ll work with you! \ud83d\udcb3",
        followUp: ["Get a quote", "Call to discuss"] },
      { keys: ["call", "phone", "talk", "speak", "reach", "contact"],
        answer: "You can reach us anytime!<br><br>\ud83d\udcde Call: <a href='tel:+" + BIZ.phoneTel + "'>" + BIZ.phone + "</a><br>\ud83d\udcac Text: <a href='sms:+" + BIZ.phoneTel + "'>" + BIZ.phone + "</a><br>\ud83d\udce7 Email: <a href='mailto:" + BIZ.email + "'>" + BIZ.email + "</a>",
        followUp: ["Get a quote", "Hours"] },
      { keys: ["thank", "thanks", "thx", "appreciate", "awesome", "great", "perfect"],
        answer: "You\u2019re welcome! \ud83d\ude0a Anything else I can help with?",
        followUp: ["Get a quote", "Call us", "No, I\u2019m good!"] },
      { keys: ["bye", "goodbye", "no more", "that\u2019s all", "i\u2019m good", "all set", "no thanks", "nope"],
        answer: "Thanks for chatting! If you ever need us, we\u2019re just a call away at <a href='tel:+" + BIZ.phoneTel + "'>" + BIZ.phone + "</a>. Have a great day! \ud83d\udc4b",
        followUp: [] }
    ];

    var QUICK = {
      "Get a quote": "__quote", "Get a free quote": "__quote",
      "Call now": "__call", "Call us": "__call", "Call to discuss": "__call",
      "Services offered": "What services do you offer?",
      "What area do you serve?": "What area do you serve?",
      "Hours": "What are your hours?",
      "Other question": "I have another question",
      "No, I\u2019m good!": "I\u2019m all set, thanks!"
    };

    var launcher = document.createElement("button");
    launcher.className = "nhd-chat-launcher";
    launcher.id = "chatLauncher";
    launcher.setAttribute("aria-label", "Chat with us");
    launcher.innerHTML =
      '<span class="nhd-chat-launcher__badge">1</span>' +
      '<svg class="nhd-chat-launcher__open" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>' +
      '<svg class="nhd-chat-launcher__close" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';

    var win = document.createElement("div");
    win.className = "nhd-chat-window";
    win.id = "chatWindow";
    win.innerHTML =
      '<div class="nhd-chat__header">' +
        '<img class="nhd-chat__header-avatar" src="https://ui-avatars.com/api/?name=Your+Local+Handyman&background=08519b&color=fff&size=80" alt="">' +
        '<div class="nhd-chat__header-info">' +
          '<div class="nhd-chat__header-name">' + BIZ.name + '</div>' +
          '<div class="nhd-chat__header-status">Usually replies instantly</div>' +
        '</div>' +
      '</div>' +
      '<div class="nhd-chat__messages" id="chatMessages"></div>' +
      '<div class="nhd-chat__input-bar">' +
        '<input class="nhd-chat__input" id="chatInput" type="text" placeholder="Type a message\u2026" autocomplete="off">' +
        '<button class="nhd-chat__send" id="chatSend" aria-label="Send"><svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>' +
      '</div>';

    document.body.appendChild(launcher);
    document.body.appendChild(win);

    var msgArea = win.querySelector("#chatMessages");
    var input = win.querySelector("#chatInput");
    var sendBtn = win.querySelector("#chatSend");
    var isOpen = false, greeted = false;

    function addBubble(text, who) {
      var d = document.createElement("div");
      d.className = "nhd-chat__bubble nhd-chat__bubble--" + who;
      d.innerHTML = text;
      msgArea.appendChild(d);
      msgArea.scrollTop = msgArea.scrollHeight;
    }
    function clearOptions() {
      msgArea.querySelectorAll(".nhd-chat__options").forEach(function (o) { o.remove(); });
    }
    function addOptions(opts) {
      if (!opts || !opts.length) return;
      var wrap = document.createElement("div");
      wrap.className = "nhd-chat__options";
      opts.forEach(function (label) {
        var btn = document.createElement("button");
        btn.className = "nhd-chat__option-btn";
        btn.textContent = label;
        btn.addEventListener("click", function () { clearOptions(); handleQuick(label); });
        wrap.appendChild(btn);
      });
      msgArea.appendChild(wrap);
      msgArea.scrollTop = msgArea.scrollHeight;
    }
    function showTyping() {
      var t = document.createElement("div");
      t.className = "nhd-chat__typing"; t.id = "typingIndicator";
      t.innerHTML = "<span></span><span></span><span></span>";
      msgArea.appendChild(t); msgArea.scrollTop = msgArea.scrollHeight;
    }
    function hideTyping() { var t = document.getElementById("typingIndicator"); if (t) t.remove(); }
    function botReply(text, options) {
      showTyping();
      var delay = Math.min(400 + text.length * 8, 1600);
      setTimeout(function () { hideTyping(); addBubble(text, "bot"); if (options) addOptions(options); }, delay);
    }
    function findAnswer(text) {
      var lower = text.toLowerCase();
      for (var i = 0; i < QA.length; i++)
        for (var k = 0; k < QA[i].keys.length; k++)
          if (lower.indexOf(QA[i].keys[k]) !== -1) return QA[i];
      return null;
    }
    function handleUser(text) {
      addBubble(text, "user");
      var match = findAnswer(text);
      if (match) { botReply(match.answer, match.followUp); }
      else {
        botReply(
          "Good question! I\u2019m a simple helper bot, so for anything specific it\u2019s best to talk to our team:<br><br>" +
          "\ud83d\udcde <a href='tel:+" + BIZ.phoneTel + "'>" + BIZ.phone + "</a><br>" +
          "\ud83d\udcac <a href='sms:+" + BIZ.phoneTel + "'>Text us</a><br><br>Or I can help with these:",
          ["Services offered", "Get a quote", "Hours", "What area do you serve?"]
        );
      }
    }
    function handleQuick(label) {
      var action = QUICK[label] || label;
      if (action === "__call") { window.open("tel:+" + BIZ.phoneTel, "_self"); return; }
      if (action === "__quote") { window.location.href = "contact.html"; return; }
      handleUser(action);
    }
    function greet() {
      if (greeted) return; greeted = true;
      setTimeout(function () {
        addBubble("Hi there! \ud83d\udc4b I\u2019m the " + BIZ.name + " assistant. How can I help you today?", "bot");
        addOptions(["Get a quote", "Services offered", "Hours", "What area do you serve?"]);
      }, 400);
    }

    launcher.addEventListener("click", function () {
      isOpen = !isOpen;
      win.classList.toggle("open", isOpen);
      launcher.classList.toggle("open", isOpen);
      if (isOpen) { greet(); setTimeout(function () { input.focus(); }, 300); }
    });
    sendBtn.addEventListener("click", function () {
      var text = input.value.trim(); if (!text) return;
      input.value = ""; clearOptions(); handleUser(text);
    });
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") sendBtn.click(); });
  }

  // ---- Cookie consent banner (site-wide, injected) ----
  function initCookieBanner() {
    if (localStorage.getItem("ylh_cookie_consent")) return;
    if (document.getElementById("cookieBanner")) return;
    var banner = document.createElement("div");
    banner.className = "nhd-cookie";
    banner.id = "cookieBanner";
    banner.innerHTML =
      '<span>\ud83c\udf6a We use cookies to improve your experience and show you relevant content. <a href="#">Privacy Policy</a></span>' +
      '<div class="nhd-cookie__buttons">' +
        '<button class="nhd-cookie__btn nhd-cookie__btn--decline" id="cookieDecline">Decline</button>' +
        '<button class="nhd-cookie__btn nhd-cookie__btn--accept" id="cookieAccept">Accept</button>' +
      '</div>';
    document.body.appendChild(banner);
    banner.querySelector("#cookieAccept").addEventListener("click", function () {
      localStorage.setItem("ylh_cookie_consent", "accepted"); banner.remove();
    });
    banner.querySelector("#cookieDecline").addEventListener("click", function () {
      localStorage.setItem("ylh_cookie_consent", "declined"); banner.remove();
    });
  }

  // ---- Facebook Pixel + event tracking (site-wide) ----
  function initFacebookPixel() {
    if (window.fbq) return;
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
      (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    // CHANGE THIS: replace with the client's real Pixel ID
    fbq('init', 'YOUR_PIXEL_ID_HERE');
    fbq('track', 'PageView');

    document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
      link.addEventListener('click', function () { fbq('track', 'Contact', { content_category: 'Click-to-Call' }); });
    });
    document.querySelectorAll('a[href^="sms:"]').forEach(function (link) {
      link.addEventListener('click', function () { fbq('track', 'Contact', { content_category: 'Click-to-Text' }); });
    });
    document.querySelectorAll('form').forEach(function (form) {
      form.addEventListener('submit', function () { fbq('track', 'Lead', { content_category: 'Quote Request' }); });
    });
    document.querySelectorAll('a, button').forEach(function (el) {
      var text = (el.textContent || '').toLowerCase();
      if (text.match(/quote|estimate|book|schedule|appointment/)) {
        el.addEventListener('click', function () { fbq('track', 'Schedule', { content_name: el.textContent.trim() }); });
      }
    });
    var scrollTracked = false;
    window.addEventListener('scroll', function () {
      if (scrollTracked) return;
      var pct = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
      if (pct > 0.75) { scrollTracked = true; fbq('trackCustom', 'DeepScroll', { depth: '75%' }); }
    });
    setTimeout(function () { fbq('trackCustom', 'EngagedVisitor', { seconds: 60 }); }, 60000);
  }

  // ---- Init ----
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initNavbar(); initDropdowns(); initAccordion(); initCarousels(); initForms();
      initLeadForm(); initReviewsCarousel(); initChatbot(); initCookieBanner(); initFacebookPixel();
    });
  } else {
    initNavbar(); initDropdowns(); initAccordion(); initCarousels(); initForms();
    initLeadForm(); initReviewsCarousel(); initChatbot(); initCookieBanner(); initFacebookPixel();
  }
})();
