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
const SITE_URL = (SITE.siteUrl || '').trim() ? SITE.siteUrl.trim().replace(/\/?$/, '/') : ''
const ANALYTICS = SITE.analytics || {}
const L = SITE.legal || {}
const ACCENTS = SITE.accents || {}
const ACCENT_OPTS = (ACCENTS.options || []).filter((o) => /^#[0-9a-f]{6}$/i.test(o.color || ''))
const ACCENT_ON = ACCENTS.enabled !== false && ACCENT_OPTS.length > 1
const BRAND = (ACCENT_OPTS[0] && ACCENT_OPTS[0].color) || '#5b49d6'
// A product in the brand colour follows the visitor's accent; any other product colour is its own identity.
const pcColor = (p) => (!p.accent || p.accent.toLowerCase() === BRAND.toLowerCase() ? 'var(--brand)' : p.accent)
const LEGAL_EMAIL = (L.grievanceEmail || C.email || '').trim()
// Legal pages, in footer order. Each lives at legal/<slug>/index.html.
const LEGAL = [
  { slug: 'privacy', title: 'Privacy Policy', icon: 'shield', blurb: 'What we collect, why we collect it, and your rights.' },
  { slug: 'terms', title: 'Terms of Service', icon: 'scale', blurb: 'The rules for using our website and working with us.' },
  { slug: 'licence', title: 'Licence & Pricing', icon: 'key', blurb: 'Yearly licences, free updates, maintenance and renewals.' },
  { slug: 'refunds', title: 'Refunds & Cancellation', icon: 'refresh', blurb: 'When refunds apply and how they are paid.' },
  { slug: 'delivery', title: 'Delivery & Installation', icon: 'truck', blurb: 'How software, licence keys and custom work reach you.' }
]

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
  whatsapp: '<path fill="currentColor" stroke="none" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>',
  file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  key: '<path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/>',
  scale: '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
  truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
  linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>',
  github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  download: '<path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/>',
  star: '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
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
  // Products dropdown (v5): a full-width panel under the header. Up to 4 product cards, industries, custom work.
  const MEGA_MAX = 6 // product rows shown in the dropdown; the rest are one click away
  const MEGA_INDUSTRIES = 5
  const megaItems = products.slice(0, MEGA_MAX).map((p) => `<a class="mitem" href="${R}${p.url}" style="--pc:${esc(pcColor(p))}">
                  <img src="${R}${p.icon}" alt="" width="40" height="40">
                  <span class="mitem__txt"><b>${esc(p.name)}${p.status === 'soon' ? '<em class="mitem__soon">Soon</em>' : p.isNew ? '<em>New</em>' : ''}</b><small>${esc(p.tagline)}</small><span class="mitem__meta">${esc(p.industry || p.category)}${p.trial ? ` · ${esc(p.trial)}` : ''}</span></span>
                  ${icon('arrow')}
                </a>`).join('')
  const more = products.length > MEGA_MAX ? `<a class="mega3__more" href="${R}products/">+${products.length - MEGA_MAX} more products ${icon('arrow')}</a>` : ''
  const inds = new Map()
  for (const p of products) { const k = p.industry || p.category; inds.set(k, (inds.get(k) || 0) + 1) }
  const indLinks = [...inds].slice(0, MEGA_INDUSTRIES).map(([k, n]) => `<a class="mind3" href="${R}products/?industry=${encodeURIComponent(k)}"><span>${esc(k)}</span><em>${n}</em></a>`).join('')
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
            <div class="mega3">
              <div class="mega3__main">
                <p class="mega3__label">Products <span>${products.length}</span></p>
                <div class="mega3__list${products.length <= 3 ? ' is-few' : ''}">${megaItems}</div>
                ${more}
              </div>
              <div class="mega3__side">
                <p class="mega3__label">By industry</p>
                <div class="mind3__list">${indLinks}</div>
                <a class="mcustom3" href="${R}contact/?interest=custom"><span class="mcustom3__ico">${icon('sparkles')}</span><span><b>Custom software</b><small>Built around how you work</small></span></a>
              </div>
            </div>
            <div class="mega3__foot">
              <a class="mega3__all" href="${R}products/">Browse all products ${icon('arrow')}</a>
              <a class="mega3__link" href="${R}legal/licence/">Licence &amp; pricing ${icon('arrow')}</a>
            </div>
          </div>
        </div>
        <a href="${R}services/"${cur('services')}>Services</a>
        <a href="${R}about/"${cur('about')}>About</a>
        <a href="${R}contact/"${cur('contact')}>Contact</a>
      </nav>
      <div class="hdr__act">
        ${accentPicker('header')}
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
        <div class="mnav__theme"><span>Appearance</span>${themeSwitch}</div>${accentPicker('mnav')}
      </div>
    </nav>
  </header>`
}

/* ---------- Footer ---------- */
// Dark rounded panel: brand + ways to reach us, products with their icons (first 4, then "All products · N"),
// company and legal columns, a bar with © and "Back to top", and a large faded wordmark along the bottom.
const FOOTER_PRODUCTS = 4
const footer = (R) => {
  const reach = [
    C.whatsapp && `<a class="ftr__pill" href="https://wa.me/${C.whatsapp}" target="_blank" rel="noopener">${icon('whatsapp')}WhatsApp</a>`,
    C.phone && `<a class="ftr__pill" href="tel:${C.phone.replace(/\s/g, '')}">${icon('phone')}${esc(C.phone)}</a>`,
    C.email && `<a class="ftr__pill" href="mailto:${C.email}">${icon('mail')}${esc(C.email)}</a>`,
    C.hours && `<span class="ftr__pill ftr__pill--plain">${icon('clock')}${esc(C.hours)}</span>`
  ].filter(Boolean).join('')
  const shown = products.slice(0, FOOTER_PRODUCTS)
  const prods = shown
    .map((p) => `<a class="ftr__prod" href="${R}${p.url}"><img src="${R}${p.icon}" alt="" width="34" height="34"><span><b>${esc(p.name)}</b><small>${esc(p.tagline)}</small></span></a>`)
    .join('')
  return `<footer class="ftr">
    <div class="ftr__panel">
      <div class="wrap">
        <div class="ftr__grid">
          <div class="ftr__brand">
            <a class="brand" href="${R || './'}"><img src="${R}assets/img/logo.svg" alt="" width="34" height="34"><span>Crafted<b>Soft</b></span></a>
            <p>Billing, inventory and business software, crafted around the way Indian businesses work.</p>
            <div class="ftr__reach">${reach}</div>
            <a class="btn ftr__cta" href="${R}contact/">Book a free demo ${icon('arrow')}</a>
          </div>
          <nav class="ftr__col ftr__col--products" aria-label="Products"><h4>Products</h4>${prods}<a class="ftr__all" href="${R}products/">All products <span>${products.length}</span>${icon('arrow')}</a></nav>
          <nav class="ftr__col" aria-label="Company"><h4>Company</h4><a href="${R || './'}">Home</a><a href="${R}about/">About us</a><a href="${R}services/">Services</a><a href="${R}contact/?interest=custom">Custom software</a><a href="${R}contact/">Contact</a></nav>
          <nav class="ftr__col" aria-label="Legal"><h4>Legal</h4>${LEGAL.map((l) => `<a href="${R}legal/${l.slug}/">${l.title}</a>`).join('')}</nav>
        </div>
        <div class="ftr__bar">
          <span>© ${new Date().getFullYear()} ${esc(L.businessName || 'CraftedSoft')} · Designed &amp; built in India</span>
          <button type="button" class="ftr__top" data-to-top>Back to top ${icon('arrow')}</button>
        </div>
      </div>
      <div class="ftr__word" aria-hidden="true">CraftedSoft</div>
    </div>
  </footer>
  ${waFab(R)}
  ${helpWidget(R)}`
}

/* Accent colour picker. 'header' = round colour button beside the theme switch that opens a small card;
   'mnav' = a row of swatches in the phone menu. */
function accentPicker(kind) {
  if (!ACCENT_ON) return ''
  const label = esc(ACCENTS.label || 'Accent')
  if (kind === 'mnav') {
    const dots = ACCENT_OPTS.map((o, i) => `<button type="button" class="swatch" data-accent="${esc(o.color)}" style="--c:${esc(o.color)}" aria-label="${esc(o.name)}" title="${esc(o.name)}" aria-pressed="${i === 0}"></button>`).join('')
    return `<div class="mnav__theme mnav__accent"><span>${label}</span><div class="swatches" role="group" aria-label="${label} colour">${dots}</div></div>`
  }
  const wheel = `conic-gradient(${ACCENT_OPTS.map((o) => o.color).concat(ACCENT_OPTS[0].color).join(', ')})`
  const opts = ACCENT_OPTS.map((o, i) => `<button type="button" class="accopt" data-accent="${esc(o.color)}" style="--c:${esc(o.color)}" aria-pressed="${i === 0}"><span class="accopt__dot">${icon('check')}</span><span class="accopt__name">${esc(o.name)}</span></button>`).join('')
  return `<div class="accdd">
          <button type="button" class="accbtn" style="--wheel:${wheel}" aria-expanded="false" aria-controls="accpop" aria-label="${label} colour" title="${label} colour"><span class="accbtn__dot"></span></button>
          <div class="accpop" id="accpop" role="dialog" aria-label="${label} colour" hidden>
            <div class="accpop__head"><b>${label} colour</b><small>Re-colours the whole site</small></div>
            <div class="accpop__grid" role="group" aria-label="${label} colours">${opts}</div>
            <div class="accpop__foot"><span>Saved on this device</span><button type="button" class="accpop__reset" data-accent-reset>Reset</button></div>
          </div>
        </div>`
}

/* Help chat (every page): answers from assets/js/support-data.js in the browser, no server. */
function helpWidget(R) {
  return `<div class="help" id="cs-help">
    <span class="help__peek" aria-hidden="true"><b>Have a question?</b> Ask me</span>
    <button type="button" class="help__launch" aria-expanded="false" aria-controls="cs-help-panel" aria-label="Open CS Assistant">${icon('message', 'i-open')}${icon('x', 'i-close')}</button>
    <section class="help__panel" id="cs-help-panel" role="dialog" aria-label="CS Assistant" hidden>
      <header class="help__head">
        <img src="${R}assets/img/logo.svg" alt="" width="38" height="38">
        <span><b>CS Assistant</b><small>Instant answers, any time</small></span>
        <button type="button" class="help__reset" title="Start over" aria-label="Start over">${icon('refresh')}</button>
        <button type="button" class="help__close" aria-label="Close CS Assistant">${icon('x')}</button>
      </header>
      <div class="help__log" role="log" aria-live="polite"></div>
      <div class="help__chips" aria-label="Suggested questions"></div>
      <form class="help__form" autocomplete="off">
        <label class="sr-only" for="cs-help-q">Type your question</label>
        <input class="help__input" id="cs-help-q" type="text" maxlength="200" placeholder="Ask about products, pricing, setup…">
        <button type="submit" class="help__send" aria-label="Send">${icon('send')}</button>
      </form>
      <p class="help__foot">Need a person? <a href="${R}contact/">Contact the team</a></p>
    </section>
  </div>
  <script src="${R}assets/js/support-data.js" defer></script>
  <script src="${R}assets/js/support.js" defer></script>`
}

/* Floating WhatsApp button (every page). Without a number in contact.whatsapp it stays visible and
   explains that the number is coming soon (main.js), pointing people to the contact form instead. */
function waFab(R) {
  const num = (C.whatsapp || '').replace(/\D/g, '')
  const href = num ? `https://wa.me/${num}` : `${R}contact/`
  return `<a class="wa-fab" href="${href}"${num ? ` target="_blank" rel="noopener" data-wa="${num}"` : ' data-wa-pending'} aria-label="Chat with us on WhatsApp" data-track="WhatsApp">
    <span class="wa-fab__bubble" aria-hidden="true"><b>Questions?</b> Chat with us</span>
    <span class="wa-fab__btn">${icon('whatsapp')}</span>
  </a>`
}

/* ---------- <head>: search, link previews, structured data, analytics ---------- */
const pagePath = (file) => {
  const rel = relative(SITE_DIR, file).split(sep).join('/')
  return rel.endsWith('index.html') ? rel.slice(0, -'index.html'.length) : rel
}
const analyticsTag = () => {
  const id = (ANALYTICS.id || '').trim()
  if (!id) return ''
  switch ((ANALYTICS.provider || '').toLowerCase()) {
    case 'cloudflare':
      return `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "${esc(id)}"}'></script>`
    case 'plausible':
      return `<script defer data-domain="${esc(id)}" src="https://plausible.io/js/script.js"></script>
  <script>window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)}</script>`
    case 'ga4':
      return `<script async src="https://www.googletagmanager.com/gtag/js?id=${esc(id)}"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${esc(id)}');</script>`
    default:
      return ''
  }
}
const headTags = (R, file, src, page) => {
  const title = ((src.match(/<title>([^<]*)<\/title>/) || [])[1] || 'CraftedSoft').trim()
  const desc = ((src.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '').trim()
  const path = pagePath(file)
  const abs = SITE_URL ? SITE_URL + path : ''
  const og = (src.match(/<html[^>]*\sdata-og="([^"]*)"/) || [])[1] || 'assets/img/og/craftedsoft.png'
  const ogUrl = SITE_URL ? SITE_URL + og : R + og
  const ld = []
  const org = {
    '@type': 'Organization',
    name: L.businessName || 'CraftedSoft',
    ...(SITE_URL && { url: SITE_URL, logo: SITE_URL + 'assets/img/apple-touch-icon.png' }),
    ...(C.email && { email: C.email }),
    ...(C.phone && { telephone: C.phone }),
    areaServed: 'IN'
  }
  if (page === 'home') ld.push(org, { '@type': 'WebSite', name: 'CraftedSoft', ...(SITE_URL && { url: SITE_URL }) })
  const pp = pageProduct(page)
  if (pp) {
    ld.push({
      '@type': 'SoftwareApplication',
      name: pp.name,
      description: pp.summary,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Windows 10, Windows 11',
      ...(pp.download?.version && { softwareVersion: pp.download.version.replace(/^v/, '') }),
      ...(SITE_URL && { url: abs, image: SITE_URL + (pp.image || '').replace(/-sm\.webp$/, '.webp') }),
      publisher: { '@type': 'Organization', name: L.businessName || 'CraftedSoft' }
    })
  }
  return [
    abs && `<link rel="canonical" href="${abs}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="CraftedSoft" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    desc && `<meta property="og:description" content="${esc(desc)}" />`,
    abs && `<meta property="og:url" content="${abs}" />`,
    `<meta property="og:image" content="${ogUrl}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:locale" content="en_IN" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<link rel="apple-touch-icon" href="${R}assets/img/apple-touch-icon.png" />`,
    `<link rel="manifest" href="${R}site.webmanifest" />`,
    ld.length && `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': ld })}</script>`,
    analyticsTag()
  ].filter(Boolean).join('\n  ')
}

/* ---------- Legal pages: business details woven into the text ---------- */
const legalValues = () => {
  const name = esc(L.businessName || 'CraftedSoft')
  const email = esc(LEGAL_EMAIL)
  return {
    'v-business': name,
    'v-business-full': [name, L.businessType && esc(L.businessType), L.address && `with its registered office at ${esc(L.address)}`].filter(Boolean).join(', '),
    'v-jurisdiction': L.jurisdiction ? `the courts at ${esc(L.jurisdiction)}` : 'the competent courts in India',
    'v-updated': esc(L.updated || ''),
    'v-email': email ? `<a href="mailto:${email}">${email}</a>` : 'the contact details on our Contact page',
    'v-site': SITE_URL ? `<a href="${SITE_URL}">${esc(SITE_URL.replace(/^https?:\/\//, '').replace(/\/$/, ''))}</a>` : 'our website'
  }
}
const legalContact = () => {
  const rows = [
    ['Business', esc(L.businessName || 'CraftedSoft') + (L.businessType ? `, ${esc(L.businessType)}` : '')],
    L.address && ['Address', esc(L.address)],
    L.gstin && ['GSTIN', esc(L.gstin)],
    LEGAL_EMAIL && ['Email', `<a href="mailto:${esc(LEGAL_EMAIL)}">${esc(LEGAL_EMAIL)}</a>`],
    C.phone && ['Phone', esc(C.phone)],
    ['Grievance Officer', (L.grievanceOfficer ? esc(L.grievanceOfficer) + ', ' : '') + 'reachable at the email above. We acknowledge complaints within 48 hours and aim to resolve them within 30 days.']
  ].filter(Boolean)
  return `<dl class="legal-contact">${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`
}
const legalIndex = (R) =>
  LEGAL.map((l) => `<a class="legal-card reveal" href="${R}legal/${l.slug}/"><span class="ico">${icon(l.icon)}</span><span><b>${l.title}</b><span>${l.blurb}</span></span>${icon('arrow')}</a>`).join('\n          ')
const legalMore = (R, page) =>
  `<p class="legal-more__label">Other policies</p><div class="legal-more__links">${LEGAL.filter((l) => page !== `legal-${l.slug}`)
    .map((l) => `<a href="${R}legal/${l.slug}/">${icon(l.icon)}${l.title}</a>`)
    .join('')}</div>`

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
const customCard = (R, span = 1) => `<a class="pcard pcard--custom${span > 1 ? ` pcard--span${span}` : ''} reveal" href="${R}contact/?interest=custom" data-cat="*">
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
  // 3-column grid: the featured card takes 2 cells, every other product 1. The "your product could be next" card
  // stretches to fill whatever is left on the last row, so it never sits alone with empty space beside it.
  const used = (featured ? 2 : 0) + list.length
  const span = 3 - (used % 3)
  return [featured && card(R, featured, true), ...list.map((p) => card(R, p, false)), customCard(R, span)].filter(Boolean).join('\n        ')
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

/* ---------- Products page (v4): searchable catalogue that scales to any number of products ---------- */
const big = (R, rel) => {
  const large = rel.replace(/-sm\.webp$/, '.webp')
  return R + (large !== rel && existsSync(join(SITE_DIR, large)) ? large : rel)
}
const industryOf = (p) => p.industry || p.category || 'Other'
// Chips for the filter bar: All plus one per industry, each with its product count.
const catalogChips = () => {
  const counts = new Map()
  for (const p of products) counts.set(industryOf(p), (counts.get(industryOf(p)) || 0) + 1)
  const chip = (label, value, n, on) => `<button type="button" class="cchip" aria-pressed="${on}" data-industry="${esc(value)}">${esc(label)}<span>${n}</span></button>`
  return [chip('All', '*', products.length, true), ...[...counts].map(([k, n]) => chip(k, k, n, false))].join('')
}
// Products page hero: "All products / I run a shop / I run a restaurant" (one per industry, label from `audience`).
const catalogAudience = () => {
  const seen = new Map()
  for (const p of products) if (!seen.has(industryOf(p))) seen.set(industryOf(p), p)
  const btn = (label, value, ic, on) => `<button type="button" class="aud" aria-pressed="${on}" data-industry="${esc(value)}">${ic}${esc(label)}</button>`
  return `<span class="aud__pill" aria-hidden="true"></span>` + [btn('All products', '*', icon('grid'), true), ...[...seen].map(([ind, p]) => btn(p.audience || ind, ind, `<img src="__R__${p.icon}" alt="" width="22" height="22">`, false))].join('')
}
const productCard = (R, p) => {
  const soon = p.status === 'soon'
  const shots = p.imageDark
    ? `<img class="on-light" src="${R}${p.image}" alt="" loading="lazy" width="1440" height="900"><img class="on-dark" src="${R}${p.imageDark}" alt="" loading="lazy" width="1440" height="900">`
    : `<img src="${R}${p.image}" alt="" loading="lazy" width="1440" height="900">`
  const words = [p.name, p.tagline, p.summary, industryOf(p), p.category, ...(p.tags || []), ...(p.highlights || []).map((h) => h.title), p.keywords || ''].join(' ').toLowerCase()
  const hl = (p.highlights || []).slice(0, 3).map((h) => `<li>${icon(h.icon || 'check')}${esc(h.title)}</li>`).join('')
  const meta = [p.trial, p.platform].filter(Boolean).map(esc).join(' · ')
  const second = soon
    ? `<a class="btn btn--outline btn--sm pc__btn" href="${R}contact/?interest=demo&amp;product=${encodeURIComponent(p.name)}">Notify me</a>`
    : p.download
      ? `<a class="icon-btn pc__dl" ${dlAttrs(p.download)} aria-label="Download ${esc(p.name)}" title="${esc(p.download.label || 'Download')}${p.download.version ? ' · ' + esc(p.download.version) : ''}">${icon('download')}</a>`
      : ''
  return `<article class="pc reveal" id="p-${p.slug}" data-industry="${esc(industryOf(p))}" data-search="${esc(words)}" style="--pc:${esc(pcColor(p))}">
          <div class="pc__media" aria-hidden="true">
            <span class="pc__badges">${soon ? '<span class="status status--soon">Coming soon</span>' : '<span class="status">Available</span>'}${p.isNew ? '<span class="pc__new">New</span>' : ''}</span>
            <span class="pc__shot">${shots}</span>
          </div>
          <div class="pc__body">
            <div class="pc__id"><img src="${R}${p.icon}" alt="" width="48" height="48"><div><h3><a class="pc__link" href="${R}${p.url}">${esc(p.name)}</a></h3><span>${esc(industryOf(p))}</span></div></div>
            <p class="pc__tag">${esc(p.tagline)}.</p>
            <p class="pc__sum">${esc(p.summary)}</p>
            ${hl ? `<ul class="pc__hl">${hl}</ul>` : ''}
          </div>
          <div class="pc__foot">
            <span class="pc__meta">${meta}</span>
            <span class="pc__acts">${second}<a class="btn btn--primary btn--sm pc__btn" href="${R}${p.url}">${soon ? 'Preview' : 'Explore'} ${icon('arrow')}</a></span>
          </div>
        </article>`
}
const catalog = (R) =>
  [
    ...products.map((p) => productCard(R, p)),
    `<a class="pc pc--build reveal" href="${R}contact/?interest=custom" data-industry="*" data-search="*">
          <span class="pc--build__ico">${icon('plus')}</span>
          <h3>Need something else?</h3>
          <p>Tell us how your business works. We'll design and build software around it, on the same proven core as our products.</p>
          <span class="link">Start a custom project ${icon('arrow')}</span>
        </a>`
  ].join('\n        ')

/* ---------- Write pages ---------- */
const htmlFiles = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const full = join(dir, f)
    if (statSync(full).isDirectory()) return ['assets', 'tools', 'node_modules', '.git'].includes(f) ? [] : htmlFiles(full)
    return f.endsWith('.html') ? [full] : []
  })

// Cache-busting: each CSS/JS link gets ?v=<hash of that file>, so browsers always load the latest
// version after a rebuild instead of mixing new pages with an old cached stylesheet or script.
// The default brand colour is accents.options[0] in site-data.js: keep style.css in step with it.
{
  const cssFile = join(SITE_DIR, 'assets/css/style.css')
  const css = readFileSync(cssFile, 'utf8')
  const synced = css.replace(/--brand: #[0-9a-f]{6};/gi, `--brand: ${BRAND};`)
  if (synced !== css) writeFileSync(cssFile, synced)
}
const ASSETS = ['assets/css/style.css', 'assets/js/main.js', 'assets/js/site-data.js', 'assets/js/support-data.js', 'assets/js/support.js']
const version = Object.fromEntries(
  ASSETS.map((a) => [a, createHash('sha1').update(readFileSync(join(SITE_DIR, a))).digest('hex').slice(0, 8)])
)
const stamp = (html) =>
  ASSETS.reduce((h, a) => h.replace(new RegExp(`(${a.replace(/[./]/g, (c) => '\\' + c)})(\\?v=[\\w]+)?"`, 'g'), `$1?v=${version[a]}"`), html)

let changed = 0
const indexable = []
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
    'catalog-chips': catalogChips(),
    'catalog-audience': catalogAudience().replaceAll('__R__', R),
    catalog: catalog(R),
    head: headTags(R, file, src, page),
    'legal-contact': legalContact(),
    'legal-index': legalIndex(R),
    'legal-more': legalMore(R, page),
    // 404.html is served at any missing address, so its relative links need a fixed base.
    base: SITE_URL ? `<base href="${SITE_URL}" />` : '',
    ...legalValues()
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
  // 'v-…' regions are values inside a sentence (legal pages), so no line breaks around them.
  const out = stamp(src.replace(/(<!-- build:([\w-]+) -->)[\s\S]*?(<!-- \/build:\2 -->)/g, (m, open, name, close) =>
    name in parts ? (name.startsWith('v-') ? `${open}${parts[name]}${close}` : `${open}\n${parts[name]}\n${close}`) : m
  ))
  if (out !== src) { writeFileSync(file, out); changed++ }
  console.log(`${out !== src ? 'updated' : 'unchanged'}  ${relative(SITE_DIR, file)}`)
  if (!/name="robots" content="noindex"/.test(out) && !file.endsWith('404.html')) indexable.push(pagePath(file))
}

/* ---------- Search engine files ---------- */
const today = new Date().toISOString().slice(0, 10)
writeFileSync(
  join(SITE_DIR, 'robots.txt'),
  `User-agent: *\nAllow: /\n${SITE_URL ? `\nSitemap: ${SITE_URL}sitemap.xml\n` : ''}`
)
if (SITE_URL) {
  const pri = (p) => (p === '' ? '1.0' : p.startsWith('products/') ? '0.9' : p.startsWith('legal/') ? '0.3' : '0.7')
  writeFileSync(
    join(SITE_DIR, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexable
      .sort()
      .map((p) => `  <url><loc>${SITE_URL}${p}</loc><lastmod>${today}</lastmod><priority>${pri(p)}</priority></url>`)
      .join('\n')}\n</urlset>\n`
  )
}
writeFileSync(
  join(SITE_DIR, 'site.webmanifest'),
  JSON.stringify({ name: 'CraftedSoft', short_name: 'CraftedSoft', icons: [{ src: 'assets/img/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }, { src: 'assets/img/logo.svg', sizes: 'any', type: 'image/svg+xml' }], theme_color: '#5b49d6', background_color: '#ffffff', display: 'browser' }, null, 2) + '\n'
)

console.log(`Done: ${changed} page(s) updated from site-data.js (${products.length} product(s)).`)
console.log(`Search: robots.txt written${SITE_URL ? `, sitemap.xml with ${indexable.length} pages` : ''}.`)
if (!SITE_URL) console.log('  ! Set siteUrl in site-data.js to add sitemap.xml, canonical links and full link previews.')
if (!(ANALYTICS.provider && ANALYTICS.id)) console.log('  ! Analytics is off: set analytics.provider and analytics.id in site-data.js to turn it on.')
if (!C.whatsapp) console.log('  ! The WhatsApp button shows "coming soon" until contact.whatsapp is set.')
