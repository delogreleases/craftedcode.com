/* =====================================================================
   CraftedSoft: site data. EDIT THIS FILE to change contact details or
   add a product. Everything else (menus, product grids, footer)
   updates by itself.
   ===================================================================== */
window.CS_SITE = {
  /* The website's public address, with a trailing slash, e.g. 'https://craftedsoft.in/' or
     'https://<user>.github.io/<repo>/'. Needed for Google (sitemap.xml, canonical links) and for link
     previews on WhatsApp/LinkedIn. Leave '' until the site is live; the build tells you what's missing. */
  siteUrl: '',

  /* Visitor analytics. Leave provider '' for none (default).
       'cloudflare' → id = the Web Analytics token   (free, no cookies; recommended)
       'plausible'  → id = your site domain           (paid, no cookies)
       'ga4'        → id = 'G-XXXXXXXXXX'              (free, uses cookies)
     Clicks on Book a demo, Download and WhatsApp are reported as events where the provider supports it. */
  analytics: { provider: '', id: '' },

  /* Accent colour picker: a small "Accent" pill at the bottom-left of every page (and in the phone menu).
     Visitors pick a colour and the whole site re-colours; their choice is remembered on that device.
     The FIRST option is the default brand colour. Set enabled: false to hide the picker.
     Products whose accent is the default colour follow the visitor's choice; other product colours stay. */
  accents: {
    enabled: true,
    label: 'Accent',
    options: [
      { name: 'Violet', color: '#5b49d6' },
      { name: 'Blue', color: '#2563eb' },
      { name: 'Emerald', color: '#059669' },
      { name: 'Saffron', color: '#ea580c' },
      { name: 'Crimson', color: '#be123c' }
    ]
  },

  /* Contact details. Leave a value empty ('') to hide it.
     whatsapp: country code + number, digits only, e.g. '919876543210'.
     When whatsapp is set, the floating WhatsApp button and the contact form open WhatsApp;
     until then the button explains that the number is coming soon. */
  contact: {
    email: 'hello@craftedsoft.in', // PLACEHOLDER: replace with your real email
    phone: '',
    whatsapp: '',
    location: 'India',
    hours: 'Mon–Sat, 9:30 am – 7:00 pm'
  },

  /* Business details used in the Privacy Policy, Terms and other legal pages (legal/).
     Fill these in, then run the build. Empty values are left out of the pages gracefully. */
  legal: {
    businessName: 'CraftedSoft',     // registered/trade name as on your invoices
    businessType: '',                // e.g. 'a partnership firm' or 'a private limited company'
    address: '',                     // registered address
    gstin: '',                       // GSTIN, if registered
    jurisdiction: '',                // city for courts, e.g. 'Coimbatore, Tamil Nadu'
    grievanceOfficer: '',            // name of the person who handles privacy/grievance requests
    grievanceEmail: '',              // defaults to contact.email when empty
    updated: '14 November 2026'      // "last updated" date shown on every legal page
  },

  /* Products, in display order. The first `featured: true` product gets the
     large card on the home page. To add a product:
       1. copy the folder products/chittill/ to products/<slug>/ and edit its index.html,
       2. put its images in assets/img/<slug>/,
       3. add an entry below. */
  products: [
    {
      slug: 'chittill',
      name: 'ChitTill',
      tagline: 'Billing made for clothing stores',
      summary:
        'Fast, offline billing and stock for apparel and men’s wear shops: sizes and colours, GST, offers, loyalty, barcode labels and day close.',
      category: 'Billing & POS',
      // Products page: the industry chip it is filed under, its card colour, the trial line and extra search words.
      industry: 'Retail',
      audience: 'I run a shop', // label on the Products page switcher
      accent: '#5b49d6',
      trial: '7-day free trial',
      keywords: 'shop store clothing apparel garments mens wear textile footwear barcode labels gst pos',
      status: 'available', // 'available' | 'soon'
      platform: 'Windows desktop',
      featured: true,
      icon: 'assets/img/chittill/chittill-icon.webp',
      image: 'assets/img/chittill/dashboard-sm.webp',
      imageDark: 'assets/img/chittill/dark-dashboard-sm.webp',
      tags: ['Works offline', 'GST-ready', 'Barcode & labels'],
      // Shown on the Products page spotlight. Icons: zap, grid, landmark, percent, users, db, printer, ...
      highlights: [
        { icon: 'zap', title: 'Keyboard-first counter', text: 'Scan, pick size and colour, and bill in seconds.' },
        { icon: 'grid', title: 'Stock by size & colour', text: 'Live stock for every variant, right at billing.' },
        { icon: 'landmark', title: 'GST done right', text: 'CGST/SGST or IGST, HSN codes and auditor-ready reports.' }
      ],
      facts: [
        ['monitor', 'Windows 10 & 11'],
        ['wifioff', 'Works offline'],
        ['calendar', '7-day free trial']
      ],
      // Download button (product page, plans, Products page). Remove this block to hide all download buttons.
      download: {
        // DUMMY for now. Replace '#' with your GitHub release link, for example:
        //   https://github.com/<user>/<repo>/releases/latest/download/ChitTill-Setup.exe   (starts the download)
        //   https://github.com/<user>/<repo>/releases/latest                               (opens the release page)
        // While it is '#', the button shows a "download coming soon" message instead.
        url: '#',
        label: 'Download for Windows',
        version: 'v0.1.0',
        platform: 'Windows 10 & 11 · 64-bit',
        size: '' // optional, e.g. '96 MB'
      },
      url: 'products/chittill/'
    },
    {
      slug: 'platera',
      name: 'Platera',
      tagline: 'Billing made for restaurants',
      summary:
        'Offline billing for restaurants, cafés, bakeries and bars: tables and KOTs, a kitchen screen, waiters ordering on their phones, table QR ordering and restaurant GST.',
      category: 'Billing & POS',
      industry: 'Restaurants & cafés',
      audience: 'I run a restaurant',
      accent: '#f26b1d',
      trial: '14-day free trial',
      keywords: 'restaurant cafe bakery bar hotel food kot kitchen display tables waiter captain qr menu gst pos',
      isNew: true, // shows a "New" badge on its card
      status: 'available',
      platform: 'Windows desktop',
      icon: 'assets/img/platera/platera-icon.webp',
      image: 'assets/img/platera/tables-sm.webp',
      imageDark: 'assets/img/platera/dark-tables-sm.webp',
      tags: ['Tables & KOTs', 'Kitchen screen', 'QR ordering'],
      highlights: [
        { icon: 'grid', title: 'Tables & KOTs', text: 'Every table’s status, KOTs per kitchen station, move, merge and split.' },
        { icon: 'monitor', title: 'Kitchen screen', text: 'Colour-coded tickets on any TV or tablet over your Wi-Fi.' },
        { icon: 'users', title: 'Captain app & table QR', text: 'Waiters order on their phones; guests scan, see the menu and order.' }
      ],
      facts: [
        ['monitor', 'Windows 10 & 11'],
        ['wifioff', 'Works offline'],
        ['calendar', '14-day free trial']
      ],
      // DUMMY for now: put Platera's GitHub release link here (e.g. …/releases/latest/download/Platera-Setup.exe).
      download: {
        url: '#',
        label: 'Download for Windows',
        version: 'v0.1.0',
        platform: 'Windows 10 & 11 · 64-bit',
        size: ''
      },
      url: 'products/platera/'
    }
    /* To add another product, copy one of the entries above, give it its own slug, images and page. */
  ]
}
