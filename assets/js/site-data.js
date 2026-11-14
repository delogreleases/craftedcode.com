/* =====================================================================
   CraftedSoft: site data. EDIT THIS FILE to change contact details or
   add a product. Everything else (menus, product grids, footer)
   updates by itself.
   ===================================================================== */
window.CS_SITE = {
  /* Contact details. Leave a value empty ('') to hide it.
     whatsapp: country code + number, digits only, e.g. '919876543210'.
     When whatsapp is set, the contact form sends the enquiry to WhatsApp;
     otherwise it opens an email to `email`. */
  contact: {
    email: 'hello@craftedsoft.in', // PLACEHOLDER: replace with your real email
    phone: '',
    whatsapp: '',
    location: 'India',
    hours: 'Mon–Sat, 9:30 am – 7:00 pm'
  },

  /* Products, in display order. The first `featured: true` product gets the
     large card on the home page. To add a product:
       1. copy products/chittill.html to products/<slug>.html and edit it,
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
      url: 'products/chittill.html'
    }
    /* Example of a second product (uncomment and edit):
    ,{
      slug: 'stockly',
      name: 'Stockly',
      tagline: 'Inventory for wholesalers',
      summary: 'Purchase orders, godown stock and party ledgers in one place.',
      category: 'Inventory',
      status: 'soon',
      platform: 'Windows desktop',
      icon: 'assets/img/stockly/icon.webp',
      image: 'assets/img/stockly/main-sm.webp',
      tags: ['Multi-godown', 'GST'],
      url: 'products/stockly.html'
    }
    */
  ]
}
