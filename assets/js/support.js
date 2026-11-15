/* CraftedSoft help chat: works entirely in the browser, answering from assets/js/support-data.js.
   No server, no AI service, nothing leaves the visitor's device. */
;(function () {
  const KB = window.CS_SUPPORT
  const SITE = window.CS_SITE || { contact: {} }
  const root = document.getElementById('cs-help')
  if (!KB || !root) return
  const doc = document.documentElement
  const R = doc.dataset.root || ''
  const C = SITE.contact || {}
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
  const $ = (s, r = root) => r.querySelector(s)
  const byId = Object.fromEntries(KB.entries.map((e) => [e.id, e]))
  const pageProduct = ((document.body.dataset.page || '').match(/^product-(\w+)/) || [])[1] || null

  /* ---------- Matching ---------- */
  const STOP = new Set('a an the is are am i we you your my me our it its of to for in on at and or do does did can could will would should be with what which how who when where why there this that these those any some please tell about get have has need want know'.split(' '))
  // Words people use for the same thing (both directions are covered by adding them to the query).
  const SYN = {
    cost: 'price', costs: 'price', rate: 'price', charge: 'price', charges: 'price', fees: 'price', pricing: 'price', quote: 'price',
    license: 'licence', licenses: 'licence', licences: 'licence',
    install: 'installation', setup: 'installation', training: 'installation',
    computer: 'pc', laptop: 'pc', desktop: 'pc', system: 'pc',
    net: 'internet', online: 'internet', wifi: 'internet', offline: 'internet',
    print: 'printer', printing: 'printer', printers: 'printer',
    hotel: 'restaurant', cafe: 'restaurant', café: 'restaurant', bakery: 'restaurant', dhaba: 'restaurant', mess: 'restaurant',
    garment: 'clothing', garments: 'clothing', textile: 'clothing', textiles: 'clothing', apparel: 'clothing', cloth: 'clothing', dress: 'clothing', boutique: 'clothing',
    waiter: 'captain', waiters: 'captain', steward: 'captain',
    colour: 'size', colours: 'size', color: 'size', colors: 'size',
    tax: 'gst', taxes: 'gst', invoice: 'gst',
    costly: 'price', expensive: 'price', cheap: 'price', prices: 'price', budget: 'price'
  }
  const PRODUCT_WORDS = {
    chittill: ['chittill', 'chit till', 'chit-till', 'clothing', 'apparel', 'garment', 'textile', 'mens wear', "men's wear", 'boutique', 'fashion', 'cloth'],
    platera: ['platera', 'restaurant', 'cafe', 'café', 'bakery', 'bar ', 'hotel', 'kot', 'kitchen', 'waiter', 'captain', 'dhaba', 'food']
  }
  const norm = (s) => ' ' + String(s).toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9%₹'\s-]/g, ' ').replace(/\s+/g, ' ').trim() + ' '
  const stem = (w) => w.replace(/(ies)$/, 'y').replace(/(es|s)$/, '').replace(/(ing)$/, '')
  const tokens = (s) => {
    const out = new Set()
    for (const w of norm(s).trim().split(' ')) {
      if (!w || STOP.has(w)) continue
      out.add(w); out.add(stem(w))
      if (SYN[w]) out.add(SYN[w])
    }
    return out
  }
  // Small typo tolerance: "pricng" → pricing, "chitill" → chittill.
  const near = (a, b) => {
    if (a.length < 4 || b.length < 5) return false
    const max = b.length >= 7 ? 2 : 1
    if (Math.abs(a.length - b.length) > max) return false
    let prev = Array.from({ length: b.length + 1 }, (_, i) => i)
    for (let i = 1; i <= a.length; i++) {
      const cur = [i]
      let rowMin = i
      for (let j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
        rowMin = Math.min(rowMin, cur[j])
      }
      if (rowMin > max) return false
      prev = cur
    }
    return prev[b.length] <= max
  }
  const fuzzyHas = (toks, key) => { for (const w of toks) if (near(w, key)) return true; return false }
  // Product names and industries say WHICH product a question is about, not WHAT it asks.
  // They only pick an entry when no real topic word matched (e.g. "tell me about Platera").
  const CONTEXT_WORDS = new Set(['chittill', 'chit till', 'chit-till', 'clothing', 'apparel', 'garment', 'garments', 'textile', 'textiles', 'mens wear', 'boutique', 'fashion', 'cloth',
    'platera', 'restaurant', 'restaurants', 'cafe', 'café', 'cafes', 'bakery', 'bakeries', 'hotel', 'dhaba', 'food', 'canteen', 'mess'])
  const detectProduct = (text) => {
    const t = norm(text)
    const toks = t.trim().split(' ')
    let best = null, n = 0
    for (const [p, words] of Object.entries(PRODUCT_WORDS)) {
      let c = words.filter((w) => t.includes(' ' + w.trim()) || t.includes(w)).length
      if (!c && toks.some((w) => near(w, p))) c = 1
      if (c > n) { n = c; best = p }
    }
    return best
  }
  let lastProduct = pageProduct
  // Returns { topic, ctx }: topic = how well the question's subject matches, ctx = product/industry words only.
  const score = (entry, text, toks, product) => {
    const t = norm(text)
    let topic = 0, ctx = 0
    const seen = new Set() // "tax", "taxes", "invoice" and "gst" are one idea: count it once
    for (const k of entry.keys) {
      const key = k.toLowerCase()
      if (key.includes(' ')) {
        if (t.includes(' ' + key + ' ') || t.includes(key)) {
          if (CONTEXT_WORDS.has(key)) ctx = 1
          else topic += 2 + key.split(' ').length
        }
        continue
      }
      const canon = SYN[key] || stem(key)
      if (seen.has(canon)) continue
      if (toks.has(key) || toks.has(stem(key)) || toks.has(canon) || fuzzyHas(toks, key)) {
        seen.add(canon)
        if (CONTEXT_WORDS.has(key) || CONTEXT_WORDS.has(canon)) ctx = 1
        else topic += 2
      }
    }
    if (norm(entry.q).trim() === t.trim()) topic += 10
    let boost = 0
    if (entry.product) {
      if (product && entry.product !== product) return { topic: 0, ctx: 0, boost: 0 }
      if (product) boost = 3
      else if (lastProduct === entry.product) boost = pageProduct === entry.product ? 2.5 : 1.2
    }
    return { topic, ctx, boost }
  }
  const answerFor = (text) => {
    const toks = tokens(text)
    const product = detectProduct(text)
    const all = KB.entries.map((e) => ({ e, ...score(e, text, toks, product) }))
    // Prefer entries whose topic matched; fall back to product-only matches ("What is Platera?").
    let ranked = all.filter((x) => x.topic > 0).map((x) => ({ e: x.e, s: x.topic + x.ctx + x.boost }))
    if (!ranked.length) ranked = all.filter((x) => x.ctx > 0).map((x) => ({ e: x.e, s: 2 * x.ctx + x.boost }))
    ranked.sort((a, b) => b.s - a.s)
    if (product) lastProduct = product
    const top = ranked[0]
    if (top && top.s >= 2) {
      if (top.e.product) lastProduct = top.e.product
      return { entry: top.e }
    }
    return { entry: null, near: ranked.slice(0, 3).map((x) => x.e.id) }
  }

  /* ---------- Rendering ---------- */
  const fill = (html) =>
    html
      .replaceAll('{R}', R)
      .replaceAll('{email}', C.email || 'hello@craftedsoft.in')
      .replaceAll('{hours}', C.hours || 'Mon–Sat')
      .replaceAll('{whatsapp}', C.whatsapp ? `https://wa.me/${C.whatsapp}` : `${R}contact/`)
  const log = $('.help__log')
  const chipsBox = $('.help__chips')
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
  let history = []
  const save = () => { try { sessionStorage.setItem('cs-help', JSON.stringify(history.slice(-40))) } catch (e) { /* storage blocked */ } }
  const addMsg = (from, html, store = true) => {
    const m = document.createElement('div')
    m.className = `hmsg hmsg--${from}`
    m.innerHTML = html
    log.append(m)
    log.scrollTop = log.scrollHeight
    if (store) { history.push({ from, html }); save() }
    return m
  }
  const setChips = (ids) => {
    chipsBox.innerHTML = ids
      .map((id) => byId[id])
      .filter(Boolean)
      .map((e) => `<button type="button" class="hchip" data-id="${e.id}">${esc(e.q)}</button>`)
      .join('')
  }
  const startTopics = () => KB.topics[pageProduct] || KB.topics.default
  const reply = (entry, near) => {
    const typing = addMsg('bot', '<span class="htyping"><i></i><i></i><i></i></span>', false)
    const delay = reduceMotion ? 0 : 450 + Math.min(700, ((entry && entry.a.length) || 120) * 1.4)
    setTimeout(() => {
      typing.remove()
      if (entry) {
        addMsg('bot', fill(entry.a))
        setChips(entry.next && entry.next.length ? entry.next : startTopics())
      } else {
        addMsg('bot', esc(KB.fallback))
        setChips([...new Set([...(near || []), ...startTopics()])].slice(0, 6).concat(near && near.includes('human') ? [] : ['human']))
      }
      // Keep the visitor's question in view above a long answer, rather than scrolling it away.
      const q = [...log.querySelectorAll('.hmsg--me')].pop()
      if (q) log.scrollTop = q.offsetTop - 12
    }, delay)
  }
  const ask = (text) => {
    const t = text.trim()
    if (!t) return
    addMsg('me', esc(t))
    const { entry, near } = answerFor(t)
    reply(entry, near)
  }

  /* ---------- Open / close ---------- */
  const panel = $('.help__panel')
  const launcher = $('.help__launch')
  const input = $('.help__input')
  let started = false
  const open = (v) => {
    root.classList.toggle('is-open', v)
    launcher.setAttribute('aria-expanded', String(v))
    panel.hidden = !v
    if (v) {
      if (!started) {
        started = true
        let saved = []
        try { saved = JSON.parse(sessionStorage.getItem('cs-help') || '[]') } catch (e) { saved = [] }
        if (saved.length) { history = saved; saved.forEach((m) => addMsg(m.from, m.html, false)); setChips(startTopics()) }
        else { addMsg('bot', esc(KB.welcome)); setChips(startTopics()) }
      }
      setTimeout(() => input.focus({ preventScroll: true }), 50)
      log.scrollTop = log.scrollHeight
    } else launcher.focus({ preventScroll: true })
  }
  launcher.addEventListener('click', () => open(!root.classList.contains('is-open')))
  $('.help__close').addEventListener('click', () => open(false))
  $('.help__reset').addEventListener('click', () => {
    history = []; save(); log.innerHTML = ''
    addMsg('bot', esc(KB.welcome)); setChips(startTopics()); input.focus()
  })
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && root.classList.contains('is-open')) open(false) })
  chipsBox.addEventListener('click', (e) => {
    const b = e.target.closest('.hchip')
    if (!b) return
    const entry = byId[b.dataset.id]
    addMsg('me', esc(entry.q))
    if (entry.product) lastProduct = entry.product
    reply(entry)
  })
  $('.help__form').addEventListener('submit', (e) => {
    e.preventDefault()
    ask(input.value)
    input.value = ''
  })
  // Opened from a link anywhere on the site: <a href="#help" data-open-help>
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('[data-open-help]')
    if (a) { e.preventDefault(); open(true) }
  })
  // Show a one-time greeting bubble beside the launcher, a little after the page loads.
  let greeted = false
  try { greeted = sessionStorage.getItem('cs-help-greeted') === '1' } catch (e) { /* ignore */ }
  if (!greeted && !reduceMotion) {
    setTimeout(() => {
      if (root.classList.contains('is-open')) return
      root.classList.add('is-peek')
      try { sessionStorage.setItem('cs-help-greeted', '1') } catch (e) { /* ignore */ }
      setTimeout(() => root.classList.remove('is-peek'), 6000)
    }, 9000)
  }
})()
