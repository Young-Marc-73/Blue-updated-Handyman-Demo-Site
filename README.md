# Your Local Handyman — Static Website

A static HTML/CSS/JS marketing site for a local handyman business. Deployable to Netlify in under five minutes.

---

## What's in this repo

```
.
├── index.html              ← Homepage
├── choose-us.html          ← Why Choose Us
├── repair.html             ← Service pages
├── painting.html
├── flooring.html
├── carpentry.html
├── doors-and-windows.html
├── safety-and-mobility.html
├── reviews.html            ← Customer reviews
├── contact.html            ← Quote form (Netlify Forms-enabled)
├── thank-you.html          ← Form submission landing
├── 404.html                ← Custom error page
│
├── css/styles.css          ← All styles (one file)
├── js/site.js              ← Navbar, dropdown, accordion, carousel
├── fonts/                  ← Inter + Poppins (self-hosted, no CDN)
├── images/                 ← Hero, service, project, and testimonial photos
├── logo/                   ← Logo SVG (light + dark variants)
│
├── netlify.toml            ← Netlify build & header config
├── robots.txt              ← Search/AI crawler permissions
├── sitemap.xml             ← Page index for search engines
├── llms.txt                ← AI assistant guide (ChatGPT, Claude, Perplexity)
└── README.md               ← This file
```

---

## Deploy to Netlify (step-by-step)

### 1. Push to GitHub
Create a new GitHub repo and push everything in this folder to it:

```bash
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/your-local-handyman.git
git push -u origin main
```

### 2. Connect to Netlify
1. Go to [app.netlify.com](https://app.netlify.com) and sign in.
2. Click **Add new site → Import an existing project**.
3. Choose **GitHub**, authorize, then select this repo.
4. **Build settings**: leave everything blank — `netlify.toml` already sets `publish = "."` and there's no build step.
5. Click **Deploy site**.

In 30 seconds you'll have a live URL like `https://random-name.netlify.app`.

### 3. Add your custom domain (when ready)
1. In Netlify, go to **Site settings → Domain management**.
2. Click **Add a domain** and enter your domain (e.g. `yourlocalhandyman.com`).
3. Update your DNS — Netlify will show you exact records (usually a CNAME or A record).
4. Netlify automatically provisions a free Let's Encrypt SSL certificate.

### 4. Update the canonical URLs
This site uses `https://yourlocalhandyman.com` as the canonical domain in:
- Every page's `<link rel="canonical">`
- Every page's OpenGraph `og:url` and `og:image`
- `sitemap.xml`
- `llms.txt`
- The LocalBusiness JSON-LD block in `index.html`

**When you launch with the real domain**, do a find-and-replace across the project from `yourlocalhandyman.com` to your actual domain. (Or hand it back to me and I'll do it.)

---

## Netlify Forms — already wired up

The quote form on `contact.html` uses Netlify Forms. No backend, no database, no API key — Netlify intercepts submissions for you.

### How it works
- The form has `data-netlify="true"` and a hidden `form-name` input.
- Netlify detects this at deploy time and starts accepting submissions automatically.
- Submissions land in **Forms** in your Netlify dashboard.
- After submit, users land on `thank-you.html`.

### To get email notifications
1. In Netlify, go to **Site settings → Forms → Form notifications**.
2. Add an **Email notification** with the email address you want submissions sent to.
3. You can also wire up Slack, webhooks, or Zapier here.

### Spam protection
A honeypot field (`bot-field`) is already in place. For higher-traffic sites, you can also enable reCAPTCHA from the same Forms settings panel.

---

## SEO & AI findability

Already configured:

- ✅ Per-page `<title>`, `<meta description>`, canonical URL
- ✅ OpenGraph + Twitter Card tags for social sharing previews
- ✅ `sitemap.xml` listing every page
- ✅ `robots.txt` allowing search engines and AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.)
- ✅ `llms.txt` — emerging convention that gives AI assistants a structured summary of the site
- ✅ Schema.org JSON-LD on every page:
  - `HomeAndConstructionBusiness` on the homepage with services, hours, address, ratings
  - `FAQPage` schema on every service page (eligible for Google FAQ rich snippets)
  - `ContactPage` on contact.html
  - `Review` and `AggregateRating` on reviews.html
- ✅ Semantic HTML (`<header>`, `<main>`, `<section>`, `<article>`, `<nav>`, `<footer>`)
- ✅ Skip-to-content link, ARIA labels, proper heading hierarchy
- ✅ All content is real text in the HTML (not loaded by JS) — crawler-friendly

### After deploy: tell Google about the site
1. Add the property to [Google Search Console](https://search.google.com/search-console).
2. Submit `sitemap.xml` from the Sitemaps section.
3. Google will start indexing within a few days.

### After deploy: Bing (powers ChatGPT search and Copilot)
1. Add the property to [Bing Webmaster Tools](https://www.bing.com/webmasters).
2. Submit the same sitemap.
3. Bing also powers AI assistants — this matters more than it used to.

---

## Editing the site

It's all static HTML — open any `.html` file in a text editor and change text, swap images, etc.

### Common edits
- **Phone number**: search-and-replace `(619) 555-0147` and `+16195550147` across the project.
- **Brand name**: search-and-replace `Your Local Handyman` across the project.
- **Email**: search-and-replace `hello@yourlocalhandyman.com`.
- **Service area**: search-and-replace `San Diego` and update `addressLocality` / `addressRegion` in the JSON-LD on `index.html`.
- **Colors**: all defined as CSS variables at the top of `css/styles.css`. Change `--color-science-blue` to recolor the whole site.

### Adding a new page
1. Copy an existing service page (e.g. `repair.html`) as a template.
2. Update the `<title>`, `<meta description>`, `<link rel="canonical">`, OG tags, and JSON-LD block.
3. Update the content.
4. Add a link to the navbar in **every** `.html` file (search for `navbar-links` to find the right spot).
5. Add the new URL to `sitemap.xml`.

### Navbar/footer updates
The navbar and footer are duplicated in every HTML file (no build step). If you change one, change them all. Search for `<header class="navbar` and `<footer class="footer` to find them.

---

## Local development

There's no build step. To preview the site locally, just open `index.html` in your browser — or for a more realistic local server:

```bash
# Python (almost always available)
python3 -m http.server 8000

# Node
npx serve .
```

Then open `http://localhost:8000`.

---

## Tech notes

- **No frameworks.** Plain HTML, CSS, and ~150 lines of vanilla JS. No React, no build tools, no `node_modules`.
- **No external runtime dependencies.** Fonts are self-hosted (`fonts/`), no Google Fonts CDN.
- **Image-heavy pages use `loading="lazy"`.** The hero image uses `loading="eager"` and `fetchpriority="high"` for fast LCP.
- **CSS uses modern features** (`oklch`-friendly, CSS variables, `aspect-ratio`, `column-gap`, `gap`). Targets evergreen browsers — Chrome, Edge, Safari, Firefox.
- **Mobile-first** with `md` (768px) and `lg` (992px) breakpoints.

---

## Questions or changes

When you sell the demo and need real images and copy swapped in for the buyer, send everything to me and I'll do a clean swap — same brand structure, just the new client's content.
