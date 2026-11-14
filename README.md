# CraftedSoft website

Static site: plain HTML, CSS and a little JavaScript. Upload the whole folder to any static host
(Netlify, Vercel, GitHub Pages, cPanel).

| Page | File |
|---|---|
| Home (who we are, commitments, services, products, process) | `index.html` |
| Product catalogue | `products.html` |
| ChitTill product page | `products/chittill.html` |
| Contact | `contact.html` |

## Preview

- Quick look: double-click `index.html`.
- Like the real hosted site (smooth page-to-page transitions): double-click `preview.bat`, which serves the folder
  on http://localhost:5500. Browsers switch page transitions off for files opened straight from disk.

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
  2. Copy `products/chittill.html` to `products/<slug>.html` and change the text and images.
  3. Add an entry to `products` in `site-data.js`, then run `node tools/build.mjs`.

  When products have more than one `category`, filter buttons appear on the Products page.

## Day / night mode

The site follows the visitor's system setting until they press the moon/sun button; their choice is remembered.
Screenshots that have a dark version use the classes `on-light` / `on-dark` to swap automatically.

## Fonts

Inter, Inter Tight and Instrument Serif (SIL Open Font License) are embedded in `assets/css/style.css` so they
load instantly on every page; the source files are in `assets/fonts/`.
