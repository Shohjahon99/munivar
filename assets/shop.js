/* MUNIVAR — do'kon: mahsulotlar katalogi, rang/o'lcham tanlash va Telegram orqali buyurtma.
   Mahsulotlar data/products.json faylidan olinadi (admin panel shu faylni tahrirlaydi). */
(function () {
  const S = window.SITE;
  const MV = window.MV;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = MV.esc;
  const L = (v) => MV.L(v);

  const sec = $('#shop');
  const grid = $('[data-shop]');
  const pm = $('#pm');
  let products = [];
  let cur = null;          // ochiq mahsulot
  let sel = { color: -1, size: '', qty: 1, img: 0 };

  const finalPrice = (p) => {
    const d = Math.min(Math.max(+p.discount || 0, 0), 95);
    return d ? Math.round((p.price * (100 - d)) / 100 / 1000) * 1000 : +p.price;
  };
  const fmt = (n) => `${Math.round(n).toLocaleString('ru-RU').replace(/ |,/g, ' ')} ${MV.U.sum}`;
  const priceHtml = (p) => {
    if (!p.price) return `<b>${esc(MV.U.priceOnReq)}</b>`;
    const d = +p.discount || 0;
    return `<b>${esc(fmt(finalPrice(p)))}</b>${d ? `<s>${esc(fmt(p.price))}</s><span class="price__off">−${d}%</span>` : ''}`;
  };

  /* ---------- yuklash ---------- */
  fetch('data/products.json', { cache: 'no-store' })
    .then((r) => r.json())
    .then((d) => {
      products = (d.products || []).filter((p) => p.active !== false && (S.demo || !p.sample));
      MV.onRender(render);
      openFromHash();
      addJsonLd();
    })
    .catch(() => {});

  /* ---------- katalog ---------- */
  function render() {
    sec.hidden = !products.length;
    if (!products.length) return;
    const U = MV.U;
    const hasSample = products.some((p) => p.sample);
    const eb = $('.eyebrow', sec);
    if (hasSample && !$('.sample-tag', eb)) eb.insertAdjacentHTML('beforeend', ` <span class="sample-tag">${esc(U.sample)}</span>`);

    grid.innerHTML = products.map((p, i) => `
      <article class="pcard rv in" data-pi="${i}" tabindex="0" role="button" aria-label="${esc(L(p.name))}">
        <div class="pcard__media">
          <img src="${esc(p.images[0])}" alt="${esc(L(p.name))}" loading="lazy" decoding="async">
          ${p.images[1] ? `<img class="pcard__alt" src="${esc(p.images[1])}" alt="" loading="lazy" decoding="async">` : ''}
          ${+p.discount ? `<span class="pcard__off">−${+p.discount}%</span>` : ''}
        </div>
        <div class="pcard__body">
          <h3 class="pcard__name">${esc(L(p.name))}</h3>
          <div class="price">${priceHtml(p)}</div>
          ${(p.colors || []).length ? `<div class="pcard__dots">${p.colors.map((c) => `<span style="background:${esc(c.hex)}" title="${esc(c.name)}"></span>`).join('')}</div>` : ''}
        </div>
      </article>`).join('');
    if (cur) fillModal();
  }

  grid.addEventListener('click', (e) => {
    const c = e.target.closest('.pcard');
    if (c) openProduct(products[c.dataset.pi]);
  });
  grid.addEventListener('keydown', (e) => {
    const c = e.target.closest('.pcard');
    if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openProduct(products[c.dataset.pi]); }
  });

  /* ---------- mahsulot oynasi ---------- */
  function openProduct(p) {
    if (!p) return;
    cur = p;
    sel = { color: p.colors && p.colors.length === 1 ? 0 : -1, size: p.sizes && p.sizes.length === 1 ? p.sizes[0] : '', qty: 1, img: 0 };
    $('[data-pm-msg]').textContent = '';
    fillModal();
    pm.hidden = false;
    requestAnimationFrame(() => pm.classList.add('on'));
    document.body.classList.add('modal-open');
    if (location.hash !== `#p-${p.id}`) history.replaceState(null, '', `#p-${p.id}`);
  }
  function closeProduct() {
    pm.classList.remove('on');
    document.body.classList.remove('modal-open');
    setTimeout(() => (pm.hidden = true), 300);
    cur = null;
    if (/^#p-/.test(location.hash)) history.replaceState(null, '', location.pathname + location.search);
  }
  function openFromHash() {
    const m = location.hash.match(/^#p-(.+)$/);
    if (m) openProduct(products.find((p) => p.id === decodeURIComponent(m[1])));
  }
  addEventListener('hashchange', openFromHash);

  function fillModal() {
    const p = cur, U = MV.U;
    $('[data-pm-img]').src = p.images[sel.img] || p.images[0];
    $('[data-pm-img]').alt = L(p.name);
    $('[data-pm-thumbs]').innerHTML = p.images.length > 1 ? p.images.map((src, i) =>
      `<button type="button" class="${i === sel.img ? 'is-on' : ''}" data-img="${i}"><img src="${esc(src)}" alt=""></button>`).join('') : '';
    $('[data-pm-name]').textContent = L(p.name);
    $('[data-pm-price]').innerHTML = `<div class="price price--lg">${priceHtml(p)}</div>`;
    $('[data-pm-desc]').textContent = L(p.desc);

    const colors = p.colors || [];
    $('[data-pm-colors-wrap]').hidden = !colors.length;
    $('[data-pm-colors]').innerHTML = colors.map((c, i) =>
      `<button type="button" class="sw${i === sel.color ? ' is-on' : ''}" data-color="${i}" title="${esc(c.name)}" aria-label="${esc(c.name)}" aria-pressed="${i === sel.color}"><span style="background:${esc(c.hex)}"></span></button>`).join('');
    $('[data-pm-color-name]').textContent = sel.color >= 0 ? colors[sel.color].name : '—';

    const sizes = p.sizes || [];
    $('[data-pm-sizes-wrap]').hidden = !sizes.length;
    $('[data-pm-sizes]').innerHTML = sizes.map((s) =>
      `<button type="button" class="sz${s === sel.size ? ' is-on' : ''}" data-size="${esc(s)}" aria-pressed="${s === sel.size}">${esc(s)}</button>`).join('');
    $('[data-pm-size-name]').textContent = sel.size || '—';

    $('[data-pm-qty]').textContent = sel.qty;
    $('[data-pm-total]').textContent = p.price ? fmt(finalPrice(p) * sel.qty) : U.priceOnReq;
  }

  pm.addEventListener('click', (e) => {
    if (e.target === pm || e.target.closest('.pm__x')) return closeProduct();
    const t = e.target.closest('[data-img],[data-color],[data-size],[data-qty]');
    if (!t || !cur) return;
    if (t.dataset.img) sel.img = +t.dataset.img;
    if (t.dataset.color) sel.color = +t.dataset.color;
    if (t.dataset.size) sel.size = t.dataset.size;
    if (t.dataset.qty) sel.qty = Math.min(20, Math.max(1, sel.qty + +t.dataset.qty));
    $$('.shake', pm).forEach((x) => x.classList.remove('shake'));
    $('[data-pm-msg]').textContent = '';
    fillModal();
  });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && pm.classList.contains('on')) closeProduct(); });

  $('[data-pm-order]').addEventListener('click', () => {
    const p = cur, U = MV.U;
    const msgEl = $('[data-pm-msg]');
    const need = [];
    if ((p.colors || []).length && sel.color < 0) need.push(['[data-pm-colors]', U.chooseColor]);
    if ((p.sizes || []).length && !sel.size) need.push(['[data-pm-sizes]', U.chooseSize]);
    if (need.length) {
      need.forEach(([s]) => { const el = $(s); el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); });
      msgEl.className = 'pm__msg err';
      msgEl.textContent = need.map((n) => n[1]).join(' · ');
      return;
    }
    const lines = [U.orderHello, '', `👗 ${L(p.name)}`];
    if (sel.color >= 0) lines.push(`🎨 ${U.color}: ${p.colors[sel.color].name}`);
    if (sel.size) lines.push(`📏 ${U.size}: ${sel.size}`);
    lines.push(`🔢 ${U.qty}: ${sel.qty}`);
    if (p.price) lines.push(`💰 ${U.total}: ${fmt(finalPrice(p) * sel.qty)}`);
    lines.push('', `🔗 ${S.siteUrl}#p-${encodeURIComponent(p.id)}`);
    MV.openTelegram(lines.join('\n'));
    msgEl.className = 'pm__msg ok';
    msgEl.textContent = U.tgOpened;
  });

  /* ---------- SEO: mahsulotlar uchun structured data ---------- */
  function addJsonLd() {
    const real = products.filter((p) => !p.sample && p.price);
    if (!real.length) return;
    const abs = (u) => new URL(u, S.siteUrl).href;
    const data = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: real.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Product',
          name: p.name.uz,
          description: (p.desc && p.desc.uz) || '',
          image: p.images.map(abs),
          brand: { '@type': 'Brand', name: 'MUNIVAR' },
          url: `${S.siteUrl}#p-${encodeURIComponent(p.id)}`,
          offers: { '@type': 'Offer', priceCurrency: 'UZS', price: finalPrice(p), availability: 'https://schema.org/InStock' }
        }
      }))
    };
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
  }
})();
