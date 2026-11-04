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
          <span class="pcard__buy" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 8h14l-1.2 11.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>
            ${esc(U.buyNow)}
          </span>
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
    $('[data-pm-tg]').hidden = true;
    $$('.err', form).forEach((x) => x.classList.remove('err'));
    showDone(false);
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

  /* ---------- buyurtma formasi ---------- */
  const form = $('[data-pm-form]');
  const orderBtn = $('[data-pm-order]');
  const tgBtn = $('[data-pm-tg]');
  const doneBox = $('[data-pm-done]');
  let lastOrder = null;   // Telegram orqali qayta yuborish uchun

  function showDone(on, summary) {
    doneBox.hidden = !on;
    $('.pm__info', pm).hidden = on;
    if (on) {
      $('[data-pm-done-sum]').textContent = summary || '';
      $('.pm__sheet', pm).scrollTop = 0;
    }
  }
  $('[data-pm-continue]').addEventListener('click', closeProduct);

  function orderText(o) {
    const U = MV.U;
    const lines = [U.orderHello, '', `👗 ${o.productName}`];
    if (o.color) lines.push(`🎨 ${U.color}: ${o.color}`);
    if (o.size) lines.push(`📏 ${U.size}: ${o.size}`);
    lines.push(`🔢 ${U.qty}: ${o.qty}`);
    if (o.total) lines.push(`💰 ${U.total}: ${fmt(o.total)}`);
    lines.push('', `👤 ${U.name}: ${o.name}`, `📞 ${U.phoneL}: ${o.phone}`);
    if (o.address) lines.push(`📍 ${U.addrL}: ${o.address}`);
    if (o.comment) lines.push(`💬 ${U.commentL}: ${o.comment}`);
    lines.push('', `🔗 ${o.link}`);
    return lines.join('\n');
  }

  const shake = (el) => { el.classList.remove('shake', 'err'); void el.offsetWidth; el.classList.add(el.matches('input,select,textarea') ? 'err' : 'shake'); };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const p = cur, U = MV.U;
    const msgEl = $('[data-pm-msg]');
    $$('.err', form).forEach((x) => x.classList.remove('err'));
    tgBtn.hidden = true;

    const name = form.name.value.trim();
    const phone = form.phone.value.replace(/\D/g, '');
    const errs = [];
    if ((p.colors || []).length && sel.color < 0) { shake($('[data-pm-colors]')); errs.push(U.chooseColor); }
    if ((p.sizes || []).length && !sel.size) { shake($('[data-pm-sizes]')); errs.push(U.chooseSize); }
    if (name.length < 2) { shake(form.name); }
    if (phone.length < 7) { shake(form.phone); }
    if (name.length < 2 || phone.length < 7) errs.push(U.errFill);
    if (errs.length) {
      msgEl.className = 'pm__msg err';
      msgEl.textContent = errs.join(' · ');
      return;
    }

    const unit = p.price ? finalPrice(p) : 0;
    const o = lastOrder = {
      kind: 'product',
      productId: p.id,
      productName: L(p.name),
      productNameUz: p.name.uz,
      color: sel.color >= 0 ? p.colors[sel.color].name : '',
      size: sel.size,
      qty: sel.qty,
      unitPrice: unit,
      total: unit * sel.qty,
      name,
      phone: `${form.cc.value} ${phone}`,
      address: form.address.value.trim(),
      comment: form.comment.value.trim(),
      lang: MV.lang,
      website: form.website.value,
      link: `${S.siteUrl}#p-${encodeURIComponent(p.id)}`
    };

    // server (Telegram bot) ulanmagan — mijozning o'z Telegrami tayyor matn bilan ochiladi
    if (!S.orderEndpoint) {
      MV.openTelegram(orderText(o));
      msgEl.className = 'pm__msg ok';
      msgEl.textContent = U.tgOpened;
      return;
    }

    orderBtn.disabled = true;
    msgEl.className = 'pm__msg';
    msgEl.textContent = U.sending;
    try {
      const r = await fetch(S.orderEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(o) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.ok) throw new Error(j.error || r.status);
      msgEl.textContent = '';
      form.reset();
      showDone(true, [o.productName, o.color, o.size, `${o.qty} ${MV.U.pcs}`, o.total ? fmt(o.total) : ''].filter(Boolean).join(' · '));
    } catch (err) {
      msgEl.className = 'pm__msg err';
      msgEl.textContent = `${U.errOrder} ${S.contacts.phones[0]}`;
      tgBtn.hidden = false;
    } finally {
      orderBtn.disabled = false;
    }
  });
  tgBtn.addEventListener('click', () => { if (lastOrder) MV.openTelegram(orderText(lastOrder)); });

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
