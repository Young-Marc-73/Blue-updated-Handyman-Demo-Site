/* ============================================================
   site-widgets.js — shared across all color templates.
   Injects, on every page:
     1. Facebook Pixel (+ home-service event tracking)
     2. Lead-gen FAQ chatbot (answers common questions; when it
        can't, offers a callback and collects contact details)
   Single-file install: each page just loads this script + the
   css/widgets.css stylesheet. Auto-themes from CSS tokens.
   ============================================================ */
(function () {
  "use strict";

  /* ════════════════════════════════════════════════════════
     CONFIG — edit per client (identical across the 3 demos)
     ════════════════════════════════════════════════════════ */
  var BIZ = {
    name: "Your Local Handyman",
    phone: "(619) 555-0147",
    phoneTel: "16195550147",
    email: "hello@yourlocalhandyman.com",
    hours: "Mon–Sat, 7 AM – 6 PM",
    area: "all of San Diego County",
    emergency: "Yes — we offer same-week and urgent service"
  };

  // ── Facebook Pixel ID — replace with the client's real ID later.
  var PIXEL_ID = "YOUR_PIXEL_ID_HERE";

  // ── Where captured leads get delivered. Wired in later:
  //    point this at an email/SMS endpoint (Netlify Function,
  //    Zapier hook, etc). Until then leads are logged + stored.
  var LEAD_WEBHOOK = ""; // e.g. "https://hooks.zapier.com/…"

  /* ════════════════════════════════════════════════════════
     PART 1 — FACEBOOK PIXEL + EVENT TRACKING
     ════════════════════════════════════════════════════════ */
  function initPixel() {
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
    (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', PIXEL_ID);
    window.fbq('track', 'PageView');

    // <noscript> fallback pixel
    var ns = document.createElement('noscript');
    ns.innerHTML = '<img height="1" width="1" style="display:none" ' +
      'src="https://www.facebook.com/tr?id=' + PIXEL_ID + '&ev=PageView&noscript=1"/>';
    document.body.appendChild(ns);

    // Click-to-call
    document.querySelectorAll('a[href^="tel:"]').forEach(function (l) {
      l.addEventListener('click', function () {
        window.fbq('track', 'Contact', { content_name: 'Phone Call', content_category: 'Click-to-Call' });
      });
    });
    // Click-to-text
    document.querySelectorAll('a[href^="sms:"]').forEach(function (l) {
      l.addEventListener('click', function () {
        window.fbq('track', 'Contact', { content_name: 'Text Message', content_category: 'Click-to-Text' });
      });
    });
    // Form submissions
    document.querySelectorAll('form').forEach(function (f) {
      f.addEventListener('submit', function () {
        window.fbq('track', 'Lead', { content_name: 'Form Submission', content_category: 'Quote Request' });
      });
    });
    // Quote / estimate / book buttons
    document.querySelectorAll('a, button').forEach(function (el) {
      var t = (el.textContent || '').toLowerCase();
      if (/quote|estimate|book|schedule|appointment/.test(t)) {
        el.addEventListener('click', function () {
          window.fbq('track', 'Schedule', { content_name: (el.textContent || '').trim() });
        });
      }
    });
    // Scroll depth 75%
    var scrolled = false;
    window.addEventListener('scroll', function () {
      if (scrolled) return;
      var pct = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
      if (pct > 0.75) { scrolled = true; window.fbq('trackCustom', 'DeepScroll', { depth: '75%' }); }
    }, { passive: true });
    // Engaged visitor (60s)
    setTimeout(function () { window.fbq('trackCustom', 'EngagedVisitor', { seconds: 60 }); }, 60000);
  }

  /* ════════════════════════════════════════════════════════
     PART 2 — LEAD-GEN CHATBOT
     ════════════════════════════════════════════════════════ */

  // Knowledge base — keyword → answer. Tune per client.
  var QA = [
    { keys: ["hour", "open", "close", "when", "available", "time"],
      answer: "We're open <strong>" + BIZ.hours + "</strong>. " + BIZ.emergency + ".",
      followUp: ["Get a free quote", "Services", "Call us"] },
    { keys: ["emergency", "urgent", "asap", "leak", "flood", "broke", "broken", "right now"],
      answer: "🚨 " + BIZ.emergency + ". For anything urgent, call us and we'll do our best to fit you in fast:<br><br>📞 <a href='tel:" + BIZ.phoneTel + "'>" + BIZ.phone + "</a>",
      followUp: ["Call now", "Other question"] },
    { keys: ["price", "cost", "how much", "rate", "estimate", "quote", "expensive", "cheap", "afford", "pricing"],
      answer: "Every job is different, so we give <strong>free written estimates</strong> with no obligation. We'll look at the work and give you an honest price before anything starts — no surprises.",
      followUp: ["Get a free quote", "Call to discuss", "Services"] },
    { keys: ["service", "what do you", "offer", "help with", "work on", "do you do", "can you", "fix"],
      answer: "We handle it all — big and small:<br>🔧 General repairs<br>🎨 Painting &amp; drywall<br>🪵 Carpentry<br>🚪 Doors &amp; windows<br>🪜 Flooring<br>♿ Safety &amp; mobility upgrades<br><br>What do you need done?",
      followUp: ["Get a free quote", "What area do you serve?", "Hours"] },
    { keys: ["area", "where", "serve", "cover", "location", "zip", "city", "near", "come to"],
      answer: "We serve <strong>" + BIZ.area + "</strong> — from the coast to East County. Not sure if we reach you? Just ask or give us a call.",
      followUp: ["Get a free quote", "Call us", "Hours"] },
    { keys: ["license", "insured", "insurance", "bonded", "certified", "warranty", "guarantee"],
      answer: "Absolutely — we're <strong>fully licensed and insured</strong>, and every job is backed by our satisfaction guarantee. ✅",
      followUp: ["Get a free quote", "Services"] },
    { keys: ["review", "rating", "google", "testimonial", "recommend", "reputation"],
      answer: "We're proud of our <strong>5-star rating</strong> from San Diego homeowners. You'll find dozens of reviews right here on our homepage and on our Google profile. 🌟",
      followUp: ["Get a free quote", "Services"] },
    { keys: ["pay", "payment", "credit card", "cash", "check", "finance", "venmo", "zelle"],
      answer: "We accept <strong>cash, check, and all major credit cards</strong>. For larger projects we can talk financing options too. 💳",
      followUp: ["Get a free quote", "Call to discuss"] },
    { keys: ["call", "phone", "talk", "speak", "reach", "contact", "number"],
      answer: "You can reach us anytime:<br><br>📞 Call <a href='tel:" + BIZ.phoneTel + "'>" + BIZ.phone + "</a><br>📧 <a href='mailto:" + BIZ.email + "'>" + BIZ.email + "</a>",
      followUp: ["Get a free quote", "Hours"] },
    { keys: ["thank", "thanks", "thx", "appreciate", "great", "perfect", "awesome"],
      answer: "You're welcome! 😊 Anything else I can help with?",
      followUp: ["Get a free quote", "Call us", "No, I'm all set"] },
    { keys: ["bye", "goodbye", "no more", "that's all", "all set", "no thanks", "nope", "i'm good"],
      answer: "Thanks for stopping by! We're just a call away at <a href='tel:" + BIZ.phoneTel + "'>" + BIZ.phone + "</a>. Have a great day! 👋",
      followUp: [] }
  ];

  // Quick-reply label → action
  var QUICK = {
    "Get a free quote": "__lead_quote",
    "Get a quote": "__lead_quote",
    "Call now": "__call",
    "Call us": "__call",
    "Call to discuss": "__call",
    "Services": "What services do you offer?",
    "What area do you serve?": "What area do you serve?",
    "Hours": "What are your hours?",
    "Other question": "I have another question",
    "No, I'm all set": "I'm all set, thanks!",
    "Yes, have someone call me": "__lead_callback",
    "No thanks": "No thanks, I'm just looking"
  };

  // Markup
  var CHAT_HTML =
    '<button class="nhd-chat-launcher" id="nhdLauncher" aria-label="Chat with us">' +
      '<span class="nhd-chat-launcher__badge">1</span>' +
      '<svg class="nhd-chat-launcher__open" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>' +
      '<svg class="nhd-chat-launcher__close" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>' +
    '</button>' +
    '<div class="nhd-chat" id="nhdChat" role="dialog" aria-label="Chat">' +
      '<div class="nhd-chat__header">' +
        '<div class="nhd-chat__avatar"><svg viewBox="0 0 24 24"><path d="M12 2L2 7v7c0 5 3.8 8.4 10 9 6.2-.6 10-4 10-9V7L12 2z"/></svg></div>' +
        '<div><div class="nhd-chat__title">' + BIZ.name + '</div><div class="nhd-chat__status">Typically replies in a few minutes</div></div>' +
      '</div>' +
      '<div class="nhd-chat__body" id="nhdBody"></div>' +
      '<div class="nhd-chat__inputbar">' +
        '<input class="nhd-chat__input" id="nhdInput" type="text" placeholder="Type a message…" autocomplete="off">' +
        '<button class="nhd-chat__send" id="nhdSend" aria-label="Send"><svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>' +
      '</div>' +
    '</div>';

  function buildChat() {
    var holder = document.createElement('div');
    holder.innerHTML = CHAT_HTML;
    while (holder.firstChild) document.body.appendChild(holder.firstChild);

    var body = document.getElementById('nhdBody');
    var input = document.getElementById('nhdInput');
    var sendBtn = document.getElementById('nhdSend');
    var launcher = document.getElementById('nhdLauncher');
    var chat = document.getElementById('nhdChat');
    var isOpen = false, greeted = false;

    // Lead capture state: null | 'name' | 'phone' | 'detail'
    var leadStage = null;
    var lead = {};

    function scrollDown() { body.scrollTop = body.scrollHeight; }
    function clearOptions() { body.querySelectorAll('.nhd-options').forEach(function (o) { o.remove(); }); }

    function addBubble(html, who) {
      var d = document.createElement('div');
      d.className = 'nhd-bubble nhd-bubble--' + who;
      d.innerHTML = html;
      body.appendChild(d); scrollDown();
    }
    function addOptions(opts) {
      if (!opts || !opts.length) return;
      var wrap = document.createElement('div');
      wrap.className = 'nhd-options';
      opts.forEach(function (label) {
        var b = document.createElement('button');
        b.className = 'nhd-option'; b.type = 'button'; b.textContent = label;
        b.addEventListener('click', function () { clearOptions(); handleQuick(label); });
        wrap.appendChild(b);
      });
      body.appendChild(wrap); scrollDown();
    }
    function showTyping() {
      var t = document.createElement('div');
      t.className = 'nhd-typing'; t.id = 'nhdTyping';
      t.innerHTML = '<span></span><span></span><span></span>';
      body.appendChild(t); scrollDown();
    }
    function hideTyping() { var t = document.getElementById('nhdTyping'); if (t) t.remove(); }

    function botSay(html, opts, after) {
      showTyping();
      var delay = Math.min(420 + html.length * 7, 1500);
      setTimeout(function () {
        hideTyping(); addBubble(html, 'bot');
        if (opts && opts.length) addOptions(opts);
        if (typeof after === 'function') after();
      }, delay);
    }

    function findAnswer(text) {
      var l = text.toLowerCase();
      for (var i = 0; i < QA.length; i++)
        for (var k = 0; k < QA[i].keys.length; k++)
          if (l.indexOf(QA[i].keys[k]) !== -1) return QA[i];
      return null;
    }

    /* ---- Lead capture flow ---- */
    function startLead(intent, prefillQuestion) {
      lead = { intent: intent, question: prefillQuestion || '', page: location.pathname };
      leadStage = 'name';
      if (intent === 'callback') {
        botSay("No problem — I'll have one of our team get you a clear answer. First, what's your <strong>name</strong>?");
      } else {
        botSay("Happy to help you get a free quote! First, what's your <strong>name</strong>?");
      }
    }
    function handleLeadInput(text) {
      if (leadStage === 'name') {
        lead.name = text; leadStage = 'phone';
        botSay("Thanks, " + escapeHtml(text.split(' ')[0]) + "! What's the <strong>best phone number</strong> to reach you? (You can add an email too.)");
      } else if (leadStage === 'phone') {
        lead.contact = text; leadStage = 'detail';
        botSay("Got it. Briefly, <strong>what do you need done</strong> (or what was your question)?");
      } else if (leadStage === 'detail') {
        if (lead.question) lead.question += ' — ' + text; else lead.question = text;
        leadStage = null;
        deliverLead(lead);
        botSay(
          "Perfect — you're all set, " + escapeHtml((lead.name || '').split(' ')[0]) + "! ✅<br><br>" +
          "Someone from our team will reach out at <strong>" + escapeHtml(lead.contact) + "</strong> shortly. " +
          "Need us sooner? Call <a href='tel:" + BIZ.phoneTel + "'>" + BIZ.phone + "</a>.",
          ["Ask something else", "No, I'm all set"]
        );
      }
    }

    // Deliver the captured lead. Wired to email/SMS later.
    function deliverLead(data) {
      data.timestamp = new Date().toISOString();
      // Persist locally so nothing is lost before the backend exists.
      try {
        var store = JSON.parse(localStorage.getItem('nhd_leads') || '[]');
        store.push(data); localStorage.setItem('nhd_leads', JSON.stringify(store));
      } catch (e) {}
      // Fire the Facebook "Lead" conversion event.
      if (window.fbq) window.fbq('track', 'Lead', { content_name: 'Chatbot Lead', content_category: data.intent });
      // TODO (backend): POST to an email/SMS endpoint when ready.
      if (LEAD_WEBHOOK) {
        try {
          fetch(LEAD_WEBHOOK, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
        } catch (e) {}
      }
      // Visible in the console for the demo / handoff.
      console.log('[Lead captured — deliver via email/SMS]', data);
    }

    function handleUserInput(text) {
      addBubble(escapeHtml(text), 'user');
      if (leadStage) { handleLeadInput(text); return; }
      var match = findAnswer(text);
      if (match) { botSay(match.answer, match.followUp); return; }
      // Unknown question → offer a callback and capture the lead.
      lead = { intent: 'callback', question: text, page: location.pathname };
      botSay(
        "That's a great question — I don't want to guess on it. I can have one of our team <strong>call you with the answer</strong>. Want me to set that up?",
        ["Yes, have someone call me", "No thanks"]
      );
    }

    function handleQuick(label) {
      var action = QUICK[label] || label;
      if (action === '__call') { window.open('tel:' + BIZ.phoneTel, '_self'); return; }
      if (action === '__lead_quote') { addBubble(escapeHtml(label), 'user'); startLead('quote'); return; }
      if (action === '__lead_callback') { addBubble(escapeHtml(label), 'user'); startLead('callback', lead.question); return; }
      if (label === 'Ask something else' || label === 'Other question') {
        addBubble(escapeHtml(label), 'user');
        botSay("Sure — ask away, or pick a topic:", ["Services", "Get a free quote", "Hours", "What area do you serve?"]);
        return;
      }
      handleUserInput(action);
    }

    function greet() {
      if (greeted) return; greeted = true;
      botSay("Hi there! 👋 I'm the " + BIZ.name + " assistant. How can I help you today?",
        ["Get a free quote", "Services", "Hours", "What area do you serve?"]);
    }

    launcher.addEventListener('click', function () {
      isOpen = !isOpen;
      chat.classList.toggle('open', isOpen);
      launcher.classList.toggle('open', isOpen);
      if (isOpen) { greet(); setTimeout(function () { input.focus(); }, 300); }
    });
    sendBtn.addEventListener('click', function () {
      var t = input.value.trim(); if (!t) return;
      input.value = ''; clearOptions(); handleUserInput(t);
    });
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') sendBtn.click(); });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ════════════════════════════════════════════════════════
     BOOT
     ════════════════════════════════════════════════════════ */
  function boot() { initPixel(); buildChat(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
