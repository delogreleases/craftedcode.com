// CraftedSoft site builder: no dependencies.
//   node tools/build.mjs
// Reads assets/js/site-data.js and writes the shared parts (icons, header,
// footer, product cards, contact details) straight into every .html page
// between <!-- build:NAME --> and <!-- /build:NAME --> markers, so pages are
// complete static HTML (no pop-in when navigating). Run it after editing
// site-data.js or adding a product page.
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, relative, dirname, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import vm from 'node:vm'
import { createHash } from 'node:crypto'

const SITE_DIR = join(dirname(fileURLToPath(import.meta.url)), '..')
const ctx = { window: {} }
vm.runInNewContext(readFileSync(join(SITE_DIR, 'assets/js/site-data.js'), 'utf8'), ctx)
const SITE = ctx.window.CS_SITE
const products = SITE.products || []
const C = SITE.contact || {}

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
const icon = (id, cls = '') => `<svg class="i${cls ? ' ' + cls : ''}" aria-hidden="true"><use href="#i-${id}"/></svg>`

/* ---------- Icons (Lucide, ISC licence) ---------- */
const SPRITE = {
  arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  right: '<path d="m9 18 6-6-6-6"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  menu: '<line x1="4" x2="20" y1="7" y2="7"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="17" y2="17"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  phone: '<path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/>',
  message: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  pin: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  wifioff: '<path d="M12 20h.01"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/><path d="M5 12.859a10 10 0 0 1 5.17-2.69"/><path d="M19 12.859a10 10 0 0 0-2.007-1.523"/><path d="M2 8.82a15 15 0 0 1 4.177-2.643"/><path d="M22 8.82a15 15 0 0 0-11.288-3.764"/><path d="m2 2 20 20"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  headset: '<path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"/><path d="M21 16v2a4 4 0 0 1-4 4h-5"/>',
  grad: '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
  zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  grid: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
  undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"/>',
  pause: '<circle cx="12" cy="12" r="10"/><line x1="10" x2="10" y1="15" y2="9"/><line x1="14" x2="14" y1="15" y2="9"/>',
  cart: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  db: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>',
  printer: '<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/><rect x="6" y="14" width="12" height="8" rx="1"/>',
  wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
  files: '<path d="M20 7h-3a2 2 0 0 1-2-2V2"/><path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z"/><path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8"/>',
  percent: '<line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
  landmark: '<line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/>',
  monitor: '<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>',
  sparkles: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>',
  calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  layers: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
  store: '<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"/>',
  download: '<path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/>',
  scan: '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M8 7v10"/><path d="M12 7v10"/><path d="M17 7v10"/>',
  send: '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>'
}
const sprite = () =>
  `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>${Object.entries(SPRITE)
    .map(([k, v]) => `<symbol id="i-${k}" viewBox="0 0 24 24">${v}</symbol>`)
    .join('')}</defs></svg>`

/* ---------- Header ---------- */
const header = (R, page) => {
  const cur = (key) => (page === key ? ' aria-current="page"' : '')
  const inProducts = page === 'products' || page.startsWith('product-')
  const status = (p) => (p.status === 'soon' ? '<span class="status status--soon">Soon</span>' : '<span class="status">Available</span>')
  const items = products
    .map((p) => `<a class="mega__item" href="${R}${p.url}"><img src="${R}${p.icon}" alt="" width="48" height="48"><span class="mega__txt"><b>${esc(p.name)} ${status(p)}</b><span>${esc(p.tagline)}</span></span>${icon('arrow')}</a>`)
    .join('')
  const fp = products.find((p) => p.featured) || products[0]
  const preview = fp
    ? `<a class="mega__preview" href="${R}${fp.url}"><span class="mega__shot">${
        fp.imageDark
          ? `<img class="on-light" src="${R}${fp.image}" alt="" loading="lazy" width="1440" height="900"><img class="on-dark" src="${R}${fp.imageDark}" alt="" loading="lazy" width="1440" height="900">`
          : `<img src="${R}${fp.image}" alt="" loading="lazy" width="1440" height="900">`
      }</span><span class="mega__cap"><small>Featured</small><b>${esc(fp.name)}</b> · ${esc(fp.tagline)}</span></a>`
    : ''
  const themeSwitch = `<button type="button" class="theme-btn tswitch" aria-label="Switch theme" title="Switch theme"><span class="tswitch__knob" aria-hidden="true"></span>${icon('sun', 'i-sun')}${icon('moon', 'i-moon')}</button>`
  return `<div class="hdr-slot" aria-hidden="true"></div>
  <header class="hdr" id="hdr">
    <div class="hdr__bar">
      <a class="brand" href="${R || './'}" aria-label="CraftedSoft home"><img src="${R}assets/img/logo.svg" alt="" width="30" height="30"><span>Crafted<b>Soft</b></span></a>
      <nav class="hdr__nav" aria-label="Main">
        <span class="hdr__ink" aria-hidden="true"></span>
        <a href="${R || './'}"${cur('home')}>Home</a>
        <div class="dd${inProducts ? ' is-current' : ''}" id="dd-products">
          <button type="button" aria-expanded="false" aria-controls="dd-panel">Products ${icon('down')}</button>
          <div class="mega" id="dd-panel">
            <div class="mega__main">
              <p class="mega__label">Products</p>
              ${items}
              <a class="mega__all" href="${R}products/">Browse all products ${icon('arrow')}</a>
            </div>
            <div class="mega__aside">
              ${preview}
              <a class="mega__custom" href="${R}contact/?interest=custom"><span class="ico">${icon('sparkles')}</span><span><b>Custom software</b><span>Built around how you work</span></span>${icon('arrow')}</a>
            </div>
          </div>
        </div>
        <a href="${R}services/"${cur('services')}>Services</a>
        <a href="${R}about/"${cur('about')}>About</a>
        <a href="${R}contact/"${cur('contact')}>Contact</a>
      </nav>
      <div class="hdr__act">
        ${themeSwitch}
        <a class="btn btn--primary btn--sm hdr__cta" href="${R}contact/">Book a demo</a>
        <button type="button" class="icon-btn burger" aria-label="Open menu" aria-expanded="false" aria-controls="mnav">${icon('menu', 'i-open')}${icon('x', 'i-close')}</button>
      </div>
    </div>
    <nav class="mnav" id="mnav" aria-label="Mobile">
      <div class="mnav__links">
        <a href="${R || './'}">Home</a>
        <a href="${R}products/">Products</a>
        <div class="mnav__products">${products.map((p) => `<a href="${R}${p.url}"><img src="${R}${p.icon}" alt="" width="36" height="36"><span><b>${esc(p.name)}</b><span>${esc(p.tagline)}</span></span></a>`).join('')}</div>
        <a href="${R}services/"${cur('services')}>Services</a>
        <a href="${R}about/"${cur('about')}>About</a>
        <a href="${R}contact/">Contact</a>
      </div>
      <div class="mnav__foot">
        <a class="btn btn--primary btn--lg btn--block" href="${R}contact/">Book a demo ${icon('arrow')}</a>
        <div class="mnav__theme"><span>Appearance</span>${themeSwitch}</div>
      </div>
    </nav>
  </header>`
}

/* ---------- Footer ---------- */
const footer = (R) => {
  const contact = [
    C.whatsapp && `<a href="https://wa.me/${C.whatsapp}" target="_blank" rel="noopener">WhatsApp</a>`,
    C.phone && `<a href="tel:${C.phone.replace(/\s/g, '')}">${esc(C.phone)}</a>`,
    C.email && `<a href="mailto:${C.email}">${esc(C.email)}</a>`,
    `<a href="${R}contact/">Book a demo</a>`
  ].filter(Boolean)
  return `<footer class="ftr">
    <div class="wrap">
      <div class="ftr__top">
        <div class="ftr__brand">
          <a class="brand" href="${R || './'}"><img src="${R}assets/img/logo.svg" alt="" width="30" height="30"><span>Crafted<b>Soft</b></span></a>
          <p>A software studio building billing, inventory and business software around the way Indian businesses work.</p>
        </div>
        <div class="ftr__col"><h4>Products</h4>${products.map((p) => `<a href="${R}${p.url}">${esc(p.name)}</a>`).join('')}<a href="${R}products/">All products</a></div>
        <div class="ftr__col"><h4>Company</h4><a href="${R}about/">About us</a><a href="${R}services/">Services</a><a href="${R}contact/">Contact</a></div>
        <div class="ftr__col"><h4>Contact</h4>${contact.join('')}</div>
      </div>
      <div class="ftr__bottom"><span>© ${new Date().getFullYear()} CraftedSoft. All rights reserved.</span><span>Designed &amp; built in India</span></div>
    </div>
  </footer>`
}

/* ---------- Product cards ---------- */
const card = (R, p, featured) => {
  const status = p.status === 'soon' ? '<span class="status status--soon pcard__status">Coming soon</span>' : '<span class="status pcard__status">Available</span>'
  const shots = p.imageDark
    ? `<img class="shot on-light" src="${R}${p.image}" alt="${esc(p.name)} screenshot" loading="lazy" width="1440" height="900"><img class="shot on-dark" src="${R}${p.imageDark}" alt="${esc(p.name)} screenshot" loading="lazy" width="1440" height="900">`
    : `<img class="shot" src="${R}${p.image}" alt="${esc(p.name)} screenshot" loading="lazy" width="1440" height="900">`
  return `<a class="pcard${featured ? ' pcard--featured' : ''} reveal" href="${R}${p.url}" data-cat="${esc(p.category)}">
          <div class="pcard__media">${status}${shots}</div>
          <div class="pcard__wrap">
            <div class="pcard__body">
              <div class="pcard__top"><img src="${R}${p.icon}" alt="" width="40" height="40"><div><h3>${esc(p.name)}</h3><small>${esc(p.category)} · ${esc(p.platform)}</small></div></div>
              ${featured ? `<p class="pcard__tagline">${esc(p.tagline)}.</p>` : ''}
              <p>${esc(p.summary)}</p>
              <div class="tags">${(p.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>
            </div>
            <div class="pcard__foot">Explore ${esc(p.name)} ${icon('arrow')}</div>
          </div>
        </a>`
}
const customCard = (R) => `<a class="pcard pcard--custom reveal" href="${R}contact/?interest=custom" data-cat="*">
          <div class="pcard__body">
            <span class="plus">${icon('plus')}</span>
            <h3>Your product could be next</h3>
            <p>Need software that doesn't exist yet? Tell us how your business works and we'll design and build it with you.</p>
            <span class="link">Start a custom project ${icon('arrow')}</span>
          </div>
        </a>`
const productGrid = (R) => {
  const list = [...products]
  const fi = Math.max(0, list.findIndex((p) => p.featured))
  const featured = list.length ? list.splice(fi, 1)[0] : null
  return [featured && card(R, featured, true), ...list.map((p) => card(R, p, false)), customCard(R)].filter(Boolean).join('\n        ')
}
const filters = () => {
  const cats = [...new Set(products.map((p) => p.category))]
  if (cats.length < 2) return ''
  return `<div class="filters" id="filters" role="group" aria-label="Filter by category">${['All', ...cats]
    .map((c, i) => `<button type="button" aria-pressed="${i === 0}" data-f="${esc(c)}">${esc(c)}</button>`)
    .join('')}</div>`
}

/* ---------- Contact ---------- */
const contactList = () => {
  const row = (ic, label, value, href) =>
    href
      ? `<a href="${href}"${href.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}><span class="ico">${icon(ic)}</span><span><small>${label}</small>${esc(value)}</span></a>`
      : `<div><span class="ico">${icon(ic)}</span><span><small>${label}</small>${esc(value)}</span></div>`
  return [
    C.whatsapp && row('message', 'WhatsApp', 'Chat with us', `https://wa.me/${C.whatsapp}`),
    C.phone && row('phone', 'Phone', C.phone, `tel:${C.phone.replace(/\s/g, '')}`),
    C.email && row('mail', 'Email', C.email, `mailto:${C.email}`),
    C.hours && row('clock', 'Hours', C.hours),
    C.location && row('pin', 'Based in', C.location)
  ].filter(Boolean).join('\n            ')
}
const productOptions = () => ['<option value="">Not sure yet</option>', ...products.map((p) => `<option>${esc(p.name)}</option>`)].join('')

/* Contact page (v3): big tappable tiles, small meta lines, product pills */
const contactTiles = () => {
  const tile = (ic, label, value, href) =>
    `<a class="ctile" href="${href}"${href.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}><span class="ctile__ico">${icon(ic)}</span><span class="ctile__txt"><small>${label}</small><b>${esc(value)}</b></span>${icon('arrow')}</a>`
  return [
    C.whatsapp && tile('message', 'WhatsApp', 'Chat with us', `https://wa.me/${C.whatsapp}`),
    C.phone && tile('phone', 'Call us', C.phone, `tel:${C.phone.replace(/\s/g, '')}`),
    C.email && tile('mail', 'Email', C.email, `mailto:${C.email}`),
    tile('store', 'Visit', 'We come to your shop', '#contact-form')
  ].filter(Boolean).join('\n            ')
}
const contactMeta = () =>
  [C.hours && `<span>${icon('clock')}${esc(C.hours)}</span>`, C.location && `<span>${icon('pin')}${esc(C.location)}</span>`].filter(Boolean).join('')
const productPills = (R) =>
  [
    `<label class="pill-radio"><input type="radio" name="product" value="" checked><span>Not sure yet</span></label>`,
    ...products.map((p) => `<label class="pill-radio"><input type="radio" name="product" value="${esc(p.name)}"><span><img src="${R}${p.icon}" alt="" width="20" height="20">${esc(p.name)}</span></label>`)
  ].join('')

/* ---------- Download buttons (from product.download in site-data.js) ---------- */
// A '#' or empty url is a placeholder: the button stays visible but main.js shows "coming soon" on click.
const dlAttrs = (d) => {
  const url = (d.url || '').trim()
  if (!url || url === '#') return 'href="#" data-download-pending'
  return `href="${esc(url)}"${/^https?:/.test(url) && !/\.(exe|msi|zip)$/i.test(url) ? ' target="_blank" rel="noopener"' : ''}`
}
const dlMeta = (d) => [d.version, d.platform, d.size].filter(Boolean).map(esc).join(' · ')
const download = {
  // Large two-line button for the product hero
  hero: (p) => p.download ? `<a class="btn-dl" ${dlAttrs(p.download)}><span class="btn-dl__ico">${icon('download')}</span><span class="btn-dl__txt"><b>${esc(p.download.label || 'Download')}</b><small>${dlMeta(p.download)}</small></span></a>` : '',
  // Regular button with an icon (plans card, spotlight)
  button: (p, label, cls = 'btn btn--outline') => p.download ? `<a class="${cls} btn--dl" ${dlAttrs(p.download)}>${icon('download')}${esc(label || p.download.label || 'Download')}</a>` : ''
}
const pageProduct = (page) => products.find((p) => page === `product-${p.slug}`)

/* ---------- Products page (v3): catalogue summary + spotlights ---------- */
const big = (R, rel) => {
  const large = rel.replace(/-sm\.webp$/, '.webp')
  return R + (large !== rel && existsSync(join(SITE_DIR, large)) ? large : rel)
}
const catalogSummary = (R) => {
  const avail = products.filter((p) => p.status !== 'soon').length
  const soon = products.length - avail
  const cats = [...new Set(products.map((p) => p.category))]
  const plats = [...new Set(products.map((p) => p.platform))]
  return `<p class="cat-sum__label">Catalogue</p>
          <dl class="cat-sum__rows">
            <div><dt>Available now</dt><dd>${avail} product${avail === 1 ? '' : 's'}</dd></div>
            ${soon ? `<div><dt>Coming soon</dt><dd>${soon}</dd></div>` : ''}
            <div><dt>Categories</dt><dd>${cats.map(esc).join(', ')}</dd></div>
            <div><dt>Platform</dt><dd>${plats.map(esc).join(', ')}</dd></div>
            <div><dt>Customisable</dt><dd class="yes">${icon('check')}Every product</dd></div>
          </dl>
          <div class="cat-sum__index">${products.map((p) => `<a href="#p-${p.slug}"><img src="${R}${p.icon}" alt="" width="28" height="28">${esc(p.name)}${icon('arrow')}</a>`).join('')}</div>`
}
const spotlights = (R) =>
  products
    .map((p, i) => {
      const st = p.status === 'soon' ? '<span class="status status--soon">Coming soon</span>' : '<span class="status">Available</span>'
      const shots = p.imageDark
        ? `<img class="on-light" src="${big(R, p.image)}" alt="${esc(p.name)} screen" loading="lazy" width="2880" height="1800"><img class="on-dark" src="${big(R, p.imageDark)}" alt="${esc(p.name)} screen, dark theme" loading="lazy" width="2880" height="1800">`
        : `<img src="${big(R, p.image)}" alt="${esc(p.name)} screen" loading="lazy" width="2880" height="1800">`
      const demo = `${R}contact/?interest=demo&amp;product=${encodeURIComponent(p.name)}`
      return `<article class="spot${i % 2 ? ' spot--flip' : ''} reveal" id="p-${p.slug}" data-cat="${esc(p.category)}">
          <div class="spot__copy">
            <div class="spot__id"><img src="${R}${p.icon}" alt="" width="52" height="52"><div><b>${esc(p.name)}</b><span>${esc(p.category)} · ${esc(p.platform)}</span></div>${st}</div>
            <h2 class="spot__title">${esc(p.tagline)}.</h2>
            <p class="spot__sum">${esc(p.summary)}</p>
            ${(p.highlights || []).length ? `<ul class="spot__hl">${p.highlights.map((h) => `<li><span class="ico">${icon(h.icon || 'check')}</span><div><b>${esc(h.title)}</b><span>${esc(h.text)}</span></div></li>`).join('')}</ul>` : ''}
            ${(p.facts || []).length ? `<div class="spot__facts">${p.facts.map(([ic, t]) => `<span>${icon(ic)}${esc(t)}</span>`).join('')}</div>` : ''}
            <div class="spot__actions"><a class="btn btn--primary" href="${R}${p.url}">Explore ${esc(p.name)} ${icon('arrow')}</a>${p.download ? download.button(p, 'Download') : `<a class="btn btn--outline" href="${demo}">Book a demo</a>`}</div>
            ${p.download ? `<p class="spot__dlmeta">${dlMeta(p.download)}</p>` : ''}
          </div>
          <a class="spot__media" href="${R}${p.url}" tabindex="-1" aria-hidden="true">
            <span class="spot__window window"><span class="window__bar"><span><img src="${R}${p.icon}" alt="">${esc(p.name)}</span><span class="window__ctrl"><i></i><i></i><i></i></span></span><span class="window__screen">${shots}</span></span>
          </a>
        </article>`
    })
    .join('\n        ')

/* ---------- Write pages ---------- */
const htmlFiles = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const full = join(dir, f)
    if (statSync(full).isDirectory()) return ['assets', 'tools', 'node_modules', '.git'].includes(f) ? [] : htmlFiles(full)
    return f.endsWith('.html') ? [full] : []
  })

// Cache-busting: each CSS/JS link gets ?v=<hash of that file>, so browsers always load the latest
// version after a rebuild instead of mixing new pages with an old cached stylesheet or script.
const ASSETS = ['assets/css/style.css', 'assets/js/main.js', 'assets/js/site-data.js']
const version = Object.fromEntries(
  ASSETS.map((a) => [a, createHash('sha1').update(readFileSync(join(SITE_DIR, a))).digest('hex').slice(0, 8)])
)
const stamp = (html) =>
  ASSETS.reduce((h, a) => h.replace(new RegExp(`(${a.replace(/[./]/g, (c) => '\\' + c)})(\\?v=[\\w]+)?"`, 'g'), `$1?v=${version[a]}"`), html)

let changed = 0
for (const file of htmlFiles(SITE_DIR)) {
  const depth = relative(SITE_DIR, file).split(sep).length - 1
  const R = '../'.repeat(depth)
  let src = readFileSync(file, 'utf8')
  src = src.replace(/(<html[^>]*\sdata-root=")[^"]*"/, `$1${R}"`)
  const page = (src.match(/<body[^>]*data-page="([^"]*)"/) || [])[1] || ''
  const parts = {
    sprite: sprite(),
    header: header(R, page),
    footer: footer(R),
    products: productGrid(R),
    filters: filters(),
    'contact-list': contactList(),
    'product-options': productOptions(),
    'contact-tiles': contactTiles(),
    'contact-meta': contactMeta(),
    'product-pills': productPills(R),
    'catalog-summary': catalogSummary(R),
    spotlights: spotlights(R)
  }
  // Product pages: download buttons for the product this page belongs to (data-page="product-<slug>").
  const pp = pageProduct(page)
  if (pp) {
    parts['download-hero'] = download.hero(pp)
    parts['download-trial'] = pp.download
      ? download.button(pp, 'Download free trial')
      : `<a class="btn btn--outline" href="${R}contact/?interest=demo&amp;product=${encodeURIComponent(pp.name)}">Start free trial</a>`
    parts['download-cta'] = download.button(pp, pp.download?.label, 'btn btn--ghost btn--lg')
  }
  const out = stamp(src.replace(/(<!-- build:([\w-]+) -->)[\s\S]*?(<!-- \/build:\2 -->)/g, (m, open, name, close) =>
    name in parts ? `${open}\n${parts[name]}\n${close}` : m
  ))
  if (out !== src) { writeFileSync(file, out); changed++ }
  console.log(`${out !== src ? 'updated' : 'unchanged'}  ${relative(SITE_DIR, file)}`)
}
console.log(`Done: ${changed} page(s) updated from site-data.js (${products.length} product(s)).`)
