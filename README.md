# CraftedSoft website

Static site: plain HTML, CSS and a little JavaScript. Upload the whole folder to any static host
(Netlify, Vercel, GitHub Pages, cPanel).

Every page lives in its own folder, so addresses are clean (`…/about/`, `…/products/chittill/`): no `.html`, no `#`.

| Page | Address | File |
|---|---|---|
| Home (hero, products, the studio) | `/` | `index.html` |
| About (who we are, our commitments) | `/about/` | `about/index.html` |
| Services (what we build, how we work) | `/services/` | `services/index.html` |
| Product catalogue | `/products/` | `products/index.html` |
| ChitTill product page | `/products/chittill/` | `products/chittill/index.html` |
| Contact | `/contact/` | `contact/index.html` |
| Legal centre | `/legal/` | `legal/index.html` |
| Privacy Policy · Terms · Licence & Pricing · Refunds · Delivery | `/legal/privacy/` … | `legal/<page>/index.html` |
| Not found | (any missing address) | `404.html` |

**Legal pages** are a careful starting point written for CraftedSoft, not legal advice: have a lawyer review them
before you rely on them. Your business name, address, GSTIN, court city and grievance officer go in `legal` in
`site-data.js`; the pages fill them in on the next build. The text itself lives in the HTML files under `legal/`.

**Search and sharing:** the build writes `robots.txt`, `site.webmanifest` and, once `siteUrl` is set in
`site-data.js`, `sitemap.xml` plus canonical links and full-size link-preview images (`assets/img/og/`). After the
site is live, add it to Google Search Console and submit `sitemap.xml`.

**Analytics:** set `analytics.provider` and `analytics.id` in `site-data.js` (Cloudflare Web Analytics is free and
cookie-free). Clicks on Book a demo, Download and WhatsApp are reported as events where the service supports it.

**WhatsApp button:** shown on every page. Put your number in `contact.whatsapp`; until then it explains that the
line is coming soon and points to the contact form.

`products.html`, `contact.html` and `products/chittill.html` are small redirect pages so old links and bookmarks still
work. Old `index.html#about` / `#services` links forward to the new pages too (`assets/js/main.js`). In-page links (the
ChitTill sub-menu, for example) scroll without adding `#` to the address.

## Preview

Double-click `preview.bat`. It serves the folder on http://localhost:5500, exactly like the hosted site, including the
smooth page-to-page transitions. Opening `index.html` straight from disk also works (links then point at each folder's
`index.html`), just without those transitions, which browsers don't allow for local files.

## Edit shared content: `assets/js/site-data.js`, then rebuild

The header, footer, product cards, product menu and contact details are written into every page as static HTML
(so pages appear instantly, with no pop-in). After changing `assets/js/site-data.js`, run:

```
node tools/build.mjs
```

It rewrites only the parts between `<!-- build:name -->` and `<!-- /build:name -->` in each page.

- **Contact details:** `contact` in `site-data.js`. The email there is a placeholder. Add a WhatsApp number
  (country code + number, digits only, e.g. `919876543210`) and the contact form sends enquiries to WhatsApp.

- **Download button:** each product's `download` block in `site-data.js` (`url`, `label`, `version`,
  `platform`, `size`). `url: '#'` is a placeholder: the buttons show a "download coming soon" message. Put your
  GitHub release link there and rebuild:
  - `https://github.com/<user>/<repo>/releases/latest/download/ChitTill-Setup.exe` starts the download directly.
  - `https://github.com/<user>/<repo>/releases/latest` opens the release page in a new tab.

  Remove the `download` block to hide that product's download buttons.
- **Add a product:**
  1. Put its images in `assets/img/<slug>/` (an icon, plus screenshots at 2880×1800 and 1440×900).
  2. Copy the folder `products/chittill/` to `products/<slug>/` and change the text and images in its `index.html`.
  3. Add an entry to `products` in `site-data.js`, then run `node tools/build.mjs`.

  On the Products page each product gets a card; the extra fields `industry` (its filter chip), `accent` (card
  colour), `trial` (e.g. `'14-day free trial'`), `keywords` (extra search words), `isNew` (a "New" badge) and
  `status: 'soon'` (a "Coming soon" card with Notify me) control how it appears. Search and the industry chips work on
  their own, and filtered views can be shared as links (`products/?industry=Retail`, `products/?q=gst`). The footer
  lists the first four products, then "All products · N".

## CS Assistant (help chat): `assets/js/support-data.js`

The chat button (bottom right of every page; the panel opens to its left) answers from a fixed list of questions in
`assets/js/support-data.js`. It runs entirely in the browser: no server, no AI service, and nothing the visitor
types leaves their device. To add or change an answer, edit an entry (no rebuild needed for text changes):

```js
{ id: 'pl-delivery', q: 'Does Platera do home delivery?', product: 'platera',
  keys: ['delivery', 'home delivery', 'parcel', 'takeaway'],
  a: "Yes. ... <a href='{R}products/platera/'>See Platera</a>",
  next: ['pl-aggregator', 'pricing'] },
```

- `q` is shown as a suggestion chip; `keys` are the words and phrases that trigger it (phrases count more).
- `product` (optional) ties the answer to `chittill` or `platera`. On a product page, or after the visitor
  mentions a product, that product's answers win (so "trial" on the Platera page gives the Platera trial).
- `a` is HTML. `{R}` becomes the path to the site root; `{email}`, `{hours}` and `{whatsapp}` come from
  `contact` in site-data.js.
- `next` lists the ids offered as follow-up chips. `topics` sets the first chips per page, `welcome` and
  `fallback` are the greeting and the "I don't know" reply (which offers the nearest topics and the team).
- Small typos are tolerated ("pricng", "chitill"). Add common synonyms to `SYN` in `assets/js/support.js`.
- Any link with `data-open-help` opens the chat, e.g. `<a href="#" data-open-help>Ask a question</a>`.

## Accent colour

Visitors can re-colour the whole site from the round colour button in the header, beside the light/dark switch (on phones it is in the menu, under
Appearance). Their choice is remembered on that device. The colours are `accents` in `site-data.js`; the
**first one is the default brand colour** (the build copies it into `--brand` in style.css). Set
`enabled: false` to remove the picker.

Every brand shade on the site is mixed from `--brand` (`--brand-ink`, `--brand-deep`, `--brand-hi`,
`--brand-lo`, `--brand-pale`, `--brand-mist`, `--tint-1..4`), so **never hard-code a violet hex in CSS**: use
those tokens, or `color-mix(in oklab, var(--brand) N%, …)`. A product whose `accent` equals the default colour
follows the visitor's choice; other product colours (Platera's orange) stay as they are. The logo keeps its colours.

## Day / night mode

The site follows the visitor's system setting until they press the moon/sun button; their choice is remembered.
Screenshots that have a dark version use the classes `on-light` / `on-dark` to swap automatically.

## Fonts

Inter, Inter Tight and Instrument Serif (SIL Open Font License) are embedded in `assets/css/style.css` so they
load instantly on every page; the source files are in `assets/fonts/`.
