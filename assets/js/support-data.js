/* =====================================================================
   CraftedSoft help chat: knowledge base. EDIT THIS FILE to change what
   the help chat knows. It runs entirely in the visitor's browser: no
   server, no AI service, nothing is sent anywhere.

   Each entry:
     id        unique name (used by `next` and `topics`)
     q         the question as shown on a suggestion chip
     keys      words and phrases that point to this answer (lower case).
               Longer phrases count more than single words.
     product   'chittill' | 'platera' | omit for general answers
     a         the answer (HTML). Tokens filled in automatically:
               {R} = link prefix to the site root, {email}, {hours},
               {whatsapp} (a WhatsApp link, or the contact page if no number yet)
     next      ids of follow-up questions to suggest after this answer
   ===================================================================== */
window.CS_SUPPORT = {
  welcome:
    "Hi! I'm CS Assistant, CraftedSoft's helper. Ask me anything about our products, pricing, free trials or setup, or pick a topic below.",
  // Chips shown when the chat opens (per page: product pages get their own set).
  topics: {
    default: ['products', 'pricing', 'trial', 'offline', 'custom', 'install', 'human'],
    chittill: ['ct-what', 'ct-features', 'ct-plans', 'trial-ct', 'requirements', 'pricing', 'human'],
    platera: ['pl-what', 'pl-kitchen', 'pl-captain', 'pl-plans', 'trial-pl', 'pricing', 'human']
  },
  fallback:
    "Sorry, I don't have an answer for that yet. Here are some topics I can help with, or you can ask a person from our team.",

  entries: [
    /* ---------- About CraftedSoft ---------- */
    { id: 'about', q: 'Who is CraftedSoft?', keys: ['craftedsoft', 'who are you', 'about you', 'your company', 'company', 'studio', 'team'],
      a: "CraftedSoft is a software studio from India: a team of engineers building billing, inventory and custom business software. We learn how you work first, build software that fits, install it, and support it ourselves. <a href='{R}about/'>More about us</a>",
      next: ['products', 'custom', 'human'] },
    { id: 'products', q: 'What products do you have?', keys: ['products', 'product', 'software do you have', 'what do you sell', 'apps', 'which software', 'offer'],
      a: "We have two ready-made products, both for Windows PCs and both working fully offline:<ul><li><b>ChitTill</b>: billing made for clothing stores. <a href='{R}products/chittill/'>See ChitTill</a></li><li><b>Platera</b>: billing for restaurants, cafés, bakeries and bars. <a href='{R}products/platera/'>See Platera</a></li></ul>We also build custom software. <a href='{R}products/'>All products</a>",
      next: ['ct-what', 'pl-what', 'custom'] },
    { id: 'custom', q: 'Can you build custom software?', keys: ['custom', 'customise', 'customize', 'customization', 'customisation', 'build for me', 'my own software', 'tailor', 'tailored', 'special requirement', 'own workflow', 'develop', 'pharmacy', 'grocery', 'wholesale', 'supermarket', 'hotel software'],
      a: "Yes, that's what we do. Tell us how your business works and we'll design it with you. You see the screens, bill formats and reports, plus a written quote, before we build anything. We then build it on our tested core, install it, move your data and train your team. <a href='{R}contact/?interest=custom'>Start a custom project</a>",
      next: ['process', 'pricing', 'human'] },
    { id: 'process', q: 'How does a project work?', keys: ['process', 'how do you work', 'steps', 'how it works', 'timeline', 'how long does it take', 'how long will it take', 'how many weeks', 'delivery time'],
      a: "Four steps: <b>1. We listen</b> (a visit or call), <b>2. You see it first</b> (screens and a written quote), <b>3. We build it</b> (with regular demos), <b>4. We set it up</b> (install, data moved, staff trained) and stay on call. The timeline for custom work is in your quote. <a href='{R}services/'>How we work</a>",
      next: ['pricing', 'install', 'human'] },

    /* ---------- Pricing & licences ---------- */
    { id: 'pricing', q: 'How much does it cost?', keys: ['price', 'pricing', 'cost', 'costs', 'how much', 'rate', 'charges', 'fee', 'fees', 'amount', 'quote', 'quotation', 'expensive', 'cheap', 'rupees'],
      a: "The price depends on the product and the customisation you need, so we always send a <b>written quote first</b>, with GST added as applicable. Licences are yearly and the <b>first year of updates is free</b>. After that you choose Annual Maintenance (renewal + updates) or Licence only. <a href='{R}contact/?interest=Pricing'>Ask for a quote</a>",
      next: ['licence', 'trial', 'refund'] },
    { id: 'licence', q: 'How do licences work?', keys: ['licence', 'license', 'yearly', 'annual', 'renewal', 'renew', 'maintenance', 'amc', 'subscription', 'licence only', 'updates cost', 'update charges'],
      a: "Every licence is <b>yearly</b>, tied to one PC (some plans cover more). The first year includes <b>all updates free</b>. After year one:<ul><li><b>Annual Maintenance</b>: licence renewal + all updates for the year.</li><li><b>Licence only</b>: renewal without updates; each update you want is charged separately.</li></ul><a href='{R}legal/licence/'>Licence &amp; pricing terms</a>",
      next: ['expiry', 'pricing', 'newpc'] },
    { id: 'expiry', q: 'What if my licence ends?', keys: ['expire', 'expired', 'expiry', 'licence ends', 'license ends', 'not renew', 'lapse', 'read only', 'locked', 'stop working'],
      a: "Your data is <b>never deleted or locked</b>. The software becomes read-only: you can still view records and reports, reprint bills, export GST data and take backups. New bills, purchases and stock changes wait until you renew. We remind you before it ends.",
      next: ['licence', 'backup'] },
    { id: 'refund', q: 'What is your refund policy?', keys: ['refund', 'refunds', 'money back', 'cancel', 'cancellation', 'return the software'],
      a: "Try first: every product has a free trial and a free demo. Licence and maintenance fees aren't refundable once the key is issued, except for duplicate payments or if we can't make the software work on a supported PC within 15 days. Custom work cancelled before it starts gets a full refund. <a href='{R}legal/refunds/'>Refunds &amp; cancellation</a>",
      next: ['trial', 'pricing'] },

    /* ---------- Trials, demo, download ---------- */
    { id: 'trial', q: 'Is there a free trial?', keys: ['trial', 'free trial', 'try', 'try before', 'demo version', 'test it', 'free'],
      a: "Yes. <b>ChitTill</b> has a <b>7-day</b> free trial and <b>Platera</b> a <b>14-day</b> free trial with every feature open. When you're ready, we send a licence key for your PC. You can also book a free 20-minute demo. <a href='{R}contact/?interest=demo'>Book a free demo</a>",
      next: ['download', 'demo', 'pricing'] },
    { id: 'trial-ct', q: 'How long is the ChitTill trial?', product: 'chittill', keys: ['trial', 'free trial', 'try', 'free', 'how many days'],
      a: "ChitTill has a <b>7-day free trial</b> on one PC. When it ends, ChitTill becomes read-only until a licence key is entered; nothing you entered is lost. <a href='{R}products/chittill/'>About ChitTill</a>",
      next: ['download', 'ct-plans', 'pricing'] },
    { id: 'trial-pl', q: 'How long is the Platera trial?', product: 'platera', keys: ['trial', 'free trial', 'try', 'free', 'how many days'],
      a: "Platera runs as a <b>14-day free trial with every feature open</b>, including Pro features like the kitchen screen and QR ordering. Then you activate it with a licence key; it works even without internet. <a href='{R}products/platera/'>About Platera</a>",
      next: ['download', 'pl-plans', 'pricing'] },
    { id: 'demo', q: 'Can I see a demo?', keys: ['demo', 'demonstration', 'show me', 'see it', 'presentation', 'meeting', 'visit'],
      a: "Of course. Book a <b>free 20-minute demo</b>, at your shop or online. We set it up with products or dishes like yours and answer every question. <a href='{R}contact/?interest=demo'>Book a free demo</a>",
      next: ['trial', 'pricing', 'human'] },
    { id: 'download', q: 'Where can I download it?', keys: ['download', 'installer', 'setup file', 'exe', 'get the software', 'install file'],
      a: "Use the <b>Download for Windows</b> button on the product page: <a href='{R}products/chittill/'>ChitTill</a> or <a href='{R}products/platera/'>Platera</a>. If the download isn't live yet, book a free demo and we'll set it up for you.",
      next: ['requirements', 'install', 'trial'] },

    /* ---------- Technical ---------- */
    { id: 'offline', q: 'Does it work without internet?', keys: ['internet', 'offline', 'online', 'without internet', 'no internet', 'network', 'wifi', 'cloud', 'connectivity'],
      a: "No internet needed. Our software runs on <b>your own computer</b> and keeps working when the internet doesn't: billing, printing, reports and backups. Platera's kitchen screen, captain app and table QR use your own Wi-Fi router, not the internet. Even licence activation works offline.",
      next: ['backup', 'requirements'] },
    { id: 'requirements', q: 'What computer do I need?', keys: ['requirements', 'system requirements', 'computer', 'pc', 'laptop', 'windows', 'ram', 'hardware', 'specification', 'mac', 'macbook', 'apple', 'linux', 'operating system', 'windows 7', 'windows xp'],
      a: "A <b>Windows 10 or 11 (64-bit)</b> PC. For Platera, 4 GB RAM or more is recommended, plus a Wi-Fi router if you use the kitchen screen, waiters' phones or table QR. Our products don't run on Mac or Linux.",
      next: ['printers', 'mobile', 'install'] },
    { id: 'mobile', q: 'Is there a mobile app?', keys: ['mobile', 'android', 'android app', 'mobile app', 'ios app', 'iphone app', 'iphone', 'ios', 'phone app', 'tablet', 'app for phone', 'smartphone'],
      a: "Our products run on a Windows PC. With <b>Platera</b>, waiters take orders on their phones (captain app), and the kitchen screen works on any TV or tablet browser on your Wi-Fi, with no app to install. ChitTill is used at the counter PC.",
      next: ['pl-captain', 'requirements'] },
    { id: 'printers', q: 'Which printers are supported?', keys: ['printer', 'printers', 'print', 'printing', 'thermal', 'receipt printer', '80mm', '58mm', '80 mm', '58 mm', 'a4', 'barcode printer', 'label printer', 'scanner', 'barcode scanner', 'cash drawer'],
      a: "Any printer Windows can print to: <b>80 mm and 58 mm thermal</b> receipt printers, A4 printers and barcode label printers, plus Save as PDF. Barcode scanners work too. We install and test your printers during setup.",
      next: ['install', 'requirements'] },
    { id: 'backup', q: 'Is my data safe?', keys: ['data', 'safe', 'safety', 'secure', 'security', 'backup', 'backups', 'privacy', 'lose data', 'data loss', 'where is my data', 'stored'],
      a: "Your data stays <b>on your own computer</b>; we don't collect your bills or customers. The software backs up automatically to a pen drive or a cloud folder, and every update makes a backup first. <a href='{R}legal/privacy/'>Privacy policy</a>",
      next: ['newpc', 'offline'] },
    { id: 'newpc', q: 'Can I move to a new computer?', keys: ['new computer', 'new pc', 'change pc', 'move', 'transfer', 'reinstall', 'pc broke', 'computer crashed', 'format', 'restore'],
      a: "Yes. We restore your latest backup on the new PC and issue a licence key for it, so you can bill again the same day. Keep backups set up so a copy is always ready.",
      next: ['backup', 'human'] },
    { id: 'gst', q: 'Is it GST compliant?', keys: ['gst', 'tax', 'taxes', 'gstr', 'gstr-1', 'gstr1', 'hsn', 'cgst', 'sgst', 'igst', 'invoice', 'e-invoice', 'accountant', 'filing'],
      a: "Yes. Bills show CGST + SGST or IGST with HSN codes, and the GST reports (rate-wise and HSN-wise) export to Excel for your accountant. ChitTill applies apparel slab rates by price; Platera handles restaurant GST (5% without ITC, or 18% with ITC).",
      next: ['ct-features', 'pl-gst'] },
    { id: 'install', q: 'Will you install and train us?', keys: ['install', 'installation', 'setup', 'set up', 'training', 'train', 'onboarding', 'data migration', 'migrate', 'old software', 'import data', 'move data'],
      a: "Yes. We install the software on-site or remotely, usually within 3 to 7 working days, connect your printers and scanners, move your data from your old software and train your staff. Licence keys arrive on WhatsApp or email within a working day of payment.",
      next: ['human', 'printers', 'pricing'] },
    { id: 'multi', q: 'Can I use it on more than one PC?', keys: ['multiple pc', 'more than one pc', 'two computers', 'many computers', 'branches', 'branch', 'multi store', 'multiple shops', 'outlets', 'chain', 'network of pcs'],
      a: "A licence covers one PC unless your plan includes more: <b>Platera Pro</b> can cover several PCs. For several branches or a chain, we can build a custom setup. <a href='{R}contact/?interest=custom'>Tell us about your business</a>",
      next: ['pl-plans', 'custom'] },
    { id: 'languages', q: 'Which languages does it support?', keys: ['language', 'languages', 'tamil', 'hindi', 'regional', 'bilingual', 'english'],
      a: "The screens are in English today. If you need a different language on bills or screens, tell us: that's something we can customise for you.",
      next: ['custom', 'human'] },

    /* ---------- ChitTill ---------- */
    { id: 'ct-what', q: 'What is ChitTill?', product: 'chittill', keys: ['chittill', 'chit till', 'what is chittill', 'clothing', 'apparel', 'garment', 'garments', 'textile', 'textiles', 'mens wear', 'boutique', 'fashion', 'cloth shop', 'dress shop'],
      a: "<b>ChitTill</b> is billing made for clothing and men's wear stores. Scan, bill, print and close the day in seconds. It handles <b>sizes and colours</b>, GST, offers, loyalty, barcode labels and stock, all without the internet. 7-day free trial. <a href='{R}products/chittill/'>See ChitTill</a>",
      next: ['ct-features', 'ct-plans', 'trial-ct'] },
    { id: 'ct-features', q: 'What can ChitTill do?', product: 'chittill', keys: ['features', 'feature', 'what can', 'functions', 'modules', 'capabilities'],
      a: "Highlights:<ul><li>Keyboard-first counter: scan, pick size and colour, take cash, UPI, card or split</li><li>Stock by <b>size and colour</b>, purchases and suppliers</li><li>Barcode label designer</li><li>Offers that apply themselves, and loyalty points</li><li>Returns and exchanges with credit notes</li><li>Day close, sales, profit and GST reports</li><li>Staff roles and PINs, automatic backups</li></ul>",
      next: ['ct-sizes', 'ct-labels', 'ct-plans'] },
    { id: 'ct-sizes', q: 'Does ChitTill handle sizes and colours?', product: 'chittill', keys: ['size', 'sizes', 'colour', 'colours', 'color', 'colors', 'variant', 'variants', 'size chart'],
      a: "Yes. Stock is counted per <b>size and colour</b>. At billing a size × colour grid shows live stock for every variant, so you never sell what isn't on the shelf, and the low-stock list shows exactly which size is running out.",
      next: ['ct-labels', 'ct-features'] },
    { id: 'ct-labels', q: 'Can ChitTill print barcode labels?', product: 'chittill', keys: ['barcode', 'barcodes', 'label', 'labels', 'tag', 'tags', 'price tag', 'sticker'],
      a: "Yes. Design price tags with shop name, MRP, size and colour, and print a whole purchase in one go on 50×25, 38×25 or A4 label sheets, or save as PDF.",
      next: ['printers', 'ct-features'] },
    { id: 'ct-offers', q: 'Does ChitTill support offers and loyalty?', product: 'chittill', keys: ['offer', 'offers', 'discount', 'discounts', 'buy 2 get 1', 'loyalty', 'points', 'rewards', 'scheme'],
      a: "Yes. Set up dated discounts, “buy 2 get 1” or “₹200 off above ₹5,000”, and ChitTill applies the right offer at billing automatically. Customers earn loyalty points on every bill. (Offers are part of the Pro plan.)",
      next: ['ct-plans', 'ct-features'] },
    { id: 'ct-returns', q: 'How do returns work in ChitTill?', product: 'chittill', keys: ['return', 'returns', 'exchange', 'credit note', 'refund to customer'],
      a: "Find the bill, tick what came back, and issue a credit note or cash back. Stock and GST update themselves.",
      next: ['ct-features'] },
    { id: 'ct-plans', q: 'ChitTill Standard vs Pro?', product: 'chittill', keys: ['plans', 'plan', 'standard', 'pro', 'difference', 'editions', 'edition', 'vs', 'compare', 'premium'],
      a: "<b>Standard</b>: billing, held bills, returns, customers and loyalty, products, stock, purchases, barcode labels, day close, sales/profit/GST reports, staff PINs and backups.<br><b>Pro</b> adds: offers applied at billing, expenses and net profit, the full dashboard (low stock, last 7 days), your shop name on screen, and hiding products without losing history. <a href='{R}products/chittill/'>Compare plans</a>",
      next: ['pricing', 'trial-ct'] },

    /* ---------- Platera ---------- */
    { id: 'pl-what', q: 'What is Platera?', product: 'platera', keys: ['platera', 'what is platera', 'restaurant', 'restaurants', 'cafe', 'café', 'cafes', 'bakery', 'bakeries', 'bar', 'hotel', 'food', 'dhaba', 'canteen', 'food court', 'cloud kitchen'],
      a: "<b>Platera</b> is billing for restaurants, cafés, bakeries and bars: tables and KOTs, a <b>kitchen screen</b>, a <b>captain app</b> for waiters and <b>table QR ordering</b>, with restaurant GST. Everything runs on your own PC and Wi-Fi, with no internet needed. 14-day free trial. <a href='{R}products/platera/'>See Platera</a>",
      next: ['pl-kitchen', 'pl-captain', 'pl-plans'] },
    { id: 'pl-features', q: 'What can Platera do?', product: 'platera', keys: ['features', 'feature', 'what can', 'functions', 'modules', 'capabilities'],
      a: "Highlights:<ul><li>Tables and floors with live status, KOTs per kitchen station</li><li>Kitchen screen on any TV or tablet</li><li>Captain app for waiters, and table QR ordering</li><li>Counter billing with portions, add-ons and kitchen notes</li><li>Dine-in, takeaway and delivery</li><li>Bar counter, kitchen stock and food cost</li><li>Restaurant GST, GSTR-1 and day close</li></ul>",
      next: ['pl-kitchen', 'pl-qr', 'pl-plans'] },
    { id: 'pl-kitchen', q: 'How does the kitchen screen work?', product: 'platera', keys: ['kitchen screen', 'kitchen display', 'kds', 'kitchen', 'chef', 'tv', 'tablet', 'tickets'],
      a: "When a KOT is sent, the ticket appears on any <b>TV or tablet browser</b> on your Wi-Fi, with no app to install. Colours show urgency: new, cooking, nearly due, late and ready. The kitchen taps a dish when it's done, and can filter by station or recall a ticket.",
      next: ['pl-captain', 'pl-kot', 'pl-plans'] },
    { id: 'pl-captain', q: 'What is the captain app?', product: 'platera', keys: ['captain', 'waiter', 'waiters', 'steward', 'order taking', 'take order', 'phone order', 'captain app'],
      a: "Waiters open the captain app on their phones over your Wi-Fi. They see the tables, take orders with add-ons and notes, send KOTs and ask for the bill, all without walking to the counter.",
      next: ['pl-qr', 'pl-kitchen'] },
    { id: 'pl-qr', q: 'Can guests order by QR code?', product: 'platera', keys: ['qr', 'qr code', 'scan', 'table qr', 'self order', 'guest order', 'menu qr', 'digital menu'],
      a: "Yes. Guests scan the card on their table, see your menu with photos, and can order, call a waiter or ask for the bill. Staff <b>accept every order</b> before it reaches the kitchen. (QR ordering is part of Platera Pro.)",
      next: ['pl-plans', 'pl-captain'] },
    { id: 'pl-kot', q: 'How do tables and KOTs work?', product: 'platera', keys: ['table', 'tables', 'kot', 'kots', 'floor', 'seating', 'merge', 'split bill', 'move table', 'token', 'takeaway', 'delivery', 'parcel'],
      a: "Your floor plan shows every table: free, seated or bill printed, with how long it's been running. Tap a table to open its order and press <b>F2</b> to send a KOT to the right station. You can move, merge or split as the evening goes. Takeaway and delivery orders get token numbers.",
      next: ['pl-kitchen', 'pl-aggregator'] },
    { id: 'pl-aggregator', q: 'Does Platera work with Swiggy and Zomato?', product: 'platera', keys: ['swiggy', 'zomato', 'aggregator', 'online order', 'food delivery app', 'uber eats'],
      a: "You can record delivery orders in Platera with the aggregator's order number, so they appear alongside dine-in and takeaway in your reports. Orders are entered in Platera; it doesn't connect to the Swiggy or Zomato systems.",
      next: ['pl-kot', 'custom'] },
    { id: 'pl-gst', q: 'How does Platera handle restaurant GST?', product: 'platera', keys: ['gst', 'tax', '5%', '18%', 'itc', 'service charge', 'packing charge', 'gstr'],
      a: "Standalone restaurants, cafés, takeaway and delivery bill at <b>5% without input tax credit</b>; restaurants in hotels with high room tariffs can use <b>18% with ITC</b>. Bakery items can carry their own rate, service charge is shown separately (and can be switched off), and GSTR-1 exports to Excel.",
      next: ['pl-features', 'pricing'] },
    { id: 'pl-stock', q: 'Does Platera track kitchen stock?', product: 'platera', keys: ['stock', 'inventory', 'ingredients', 'recipe', 'recipes', 'food cost', 'wastage', 'raw material'],
      a: "Yes (Pro). Add ingredients and recipes per dish; stock goes down as dishes are sent to the kitchen. Record purchases and wastage, see low-stock alerts and the food cost of every dish.",
      next: ['pl-plans', 'pl-bar'] },
    { id: 'pl-bar', q: 'Does Platera support a bar?', product: 'platera', keys: ['bar', 'liquor', 'alcohol', 'peg', 'pegs', 'bottle', 'beer', 'wine'],
      a: "Yes (Pro). Liquor items by bottle size, peg measures (30 / 60 ml), open-bottle stock, and liquor sold in its own section of the bill.",
      next: ['pl-plans', 'pl-stock'] },
    { id: 'pl-speed', q: 'Can Platera handle a busy restaurant?', product: 'platera', keys: ['busy', 'rush', 'fast', 'speed', 'performance', 'slow', 'many tables', 'large restaurant', 'how many tables', 'devices'],
      a: "Comfortably. Before release Platera was tested with a full year of history (over 56,000 bills), <b>62 tables</b> and <b>91 devices at once</b> with no errors. Opening a table or sending a KOT takes about a millisecond.",
      next: ['pl-features', 'multi'] },
    { id: 'pl-plans', q: 'Platera Standard vs Pro?', product: 'platera', keys: ['plans', 'plan', 'standard', 'pro', 'difference', 'editions', 'edition', 'vs', 'compare', 'premium'],
      a: "<b>Standard</b> (one PC): counter, tables and KOT printing, menu with portions and add-ons, bills, returns, customers and dues, offers, dashboard, reports and GSTR-1, backups.<br><b>Pro</b> adds, on more PCs: kitchen screen and captain app, table QR ordering, bar, kitchen stock and food cost, purchases, expenses, loyalty, bookings, customer display and the WhatsApp day summary. <a href='{R}products/platera/'>Compare plans</a>",
      next: ['pricing', 'trial-pl'] },

    /* ---------- Contact & small talk ---------- */
    { id: 'human', q: 'Talk to a person', keys: ['human', 'person', 'agent', 'someone', 'staff', 'call', 'phone', 'contact', 'whatsapp', 'email', 'talk to', 'speak', 'support team', 'customer care', 'helpline', 'number'],
      a: "Happy to connect you with our team ({hours}).<ul><li><a href='{whatsapp}' target='_blank' rel='noopener'>Message us on WhatsApp</a></li><li>Email: <a href='mailto:{email}'>{email}</a></li><li><a href='{R}contact/'>Send a message</a> and we'll reply within a working day.</li></ul>",
      next: ['demo', 'products'] },
    { id: 'hello', q: 'Hello', keys: ['hi', 'hello', 'hey', 'hii', 'good morning', 'good evening', 'good afternoon', 'vanakkam', 'namaste'],
      a: "Hello! How can I help? You can ask about our products, pricing, free trials, setup or anything else.",
      next: ['products', 'pricing', 'trial'] },
    { id: 'thanks', q: 'Thank you', keys: ['thanks', 'thank you', 'thankyou', 'ok thanks', 'great', 'super', 'awesome', 'nice', 'bye', 'goodbye'],
      a: "You're welcome! If anything else comes up, I'm right here. To see it working, <a href='{R}contact/?interest=demo'>book a free demo</a>.",
      next: ['demo', 'human'] }
  ]
}
