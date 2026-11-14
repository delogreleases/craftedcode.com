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

`products.html`, `contact.html` and `products/chittill.html` are small redirect pages so old links and bookmarks still
work. Old `index.html#about` / `#services` links forward to the new pages too (`assets/js/main.js`). In-page links (the
ChitTill sub-menu, for example) scroll without adding `#` to the address.

## Preview

Double-click `preview.bat`. It serves the folder on http://localhost:5500. Folder addresses like `about/` and the smooth
page-to-page transitions only work over http, so opening the files straight from disk is no longer enough.

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

  When products have more than one `category`, filter buttons appear on the Products page.

## Day / night mode

The site follows the visitor's system setting until they press the moon/sun button; their choice is remembered.
Screenshots that have a dark version use the classes `on-light` / `on-dark` to swap automatically.

## Fonts

Inter, Inter Tight and Instrument Serif (SIL Open Font License) are embedded in `assets/css/style.css` so they
load instantly on every page; the source files are in `assets/fonts/`.
