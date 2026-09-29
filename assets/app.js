(function () {
  const S = window.SITE;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const C = S.contacts;
  const tel = (p) => 'tel:' + p.replace(/[^\d+]/g, '');
  const links = {
    ig: C.instagram && `https://www.instagram.com/${C.instagram}/`,
    tg: C.telegram && (/^https?:/.test(C.telegram) ? C.telegram : `https://t.me/${C.telegram}`),
    wa: C.whatsapp && `https://wa.me/${C.whatsapp}`
  };

  /* ---------- til ---------- */
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  const qLang = new URLSearchParams(location.search).get('lang');
  let lang = [qLang, store.get('lang'), S.defaultLang].find((l) => S.langs.includes(l));
  let U = window.UI[lang];
  const L = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? (v[lang] ?? v[S.defaultLang] ?? '') : (v ?? ''));
  const get = (path) => L(path.split('.').reduce((o, k) => (o ? o[k] : ''), S));

  function fillImg(box, src, alt, srcset) {
    box.classList.add('ph');
    if (!src) return;
    const img = new Image();
    img.alt = alt || '';
    img.loading = 'lazy';
    img.decoding = 'async';
    if (srcset) { img.srcset = srcset; img.sizes = '(min-width:1180px) 26vw, (min-width:700px) 38vw, 74vw'; }
    img.onload = () => box.classList.add('has-img');
    img.onerror = () => img.remove();
    img.src = src;
    box.appendChild(img);
  }

  /* ---------- statik qismlar (bir marta) ---------- */
  const looksEl = $('[data-looks]');
  const starsEl = $('[data-stars]');
  const lookCode = (n) => `MV-${n}`;
  looksEl.innerHTML = S.looks.items.map((l, i) =>
    `<div class="rail__item rv" data-cat="${esc(l.cat)}"><div class="rail__media" data-i="${i}"><span class="rail__code">${esc(lookCode(l.img))}</span></div></div>`).join('');
  $$('.rail__media', looksEl).forEach((b) => {
    const n = S.looks.items[b.dataset.i].img;
    fillImg(b, `media/looks/look-${n}-700.webp`, 'MUNIVAR', `media/looks/look-${n}-700.webp 700w, media/looks/look-${n}-1400.webp 1400w`);
  });
  $('[data-year]').textContent = new Date().getFullYear();

  // hero video
  const small = matchMedia('(max-width:760px)').matches;
  const poster = small && S.hero.posterMobile ? S.hero.posterMobile : S.hero.poster;
  const posterBox = $('[data-poster]');
  if (poster) posterBox.style.background = `#000 url("${poster}") center/cover no-repeat`;
  const vid = $('[data-hero-video]');
  const snd = $('.hero__sound');
  const vsrc = small && S.hero.videoMobile ? S.hero.videoMobile : S.hero.video;
  if (vsrc) {
    vid.src = vsrc;
    if (poster) vid.poster = poster;
    vid.addEventListener('canplay', () => {
      vid.classList.add('ready');
      snd.classList.add('show');
      vid.play().catch(() => {});
    }, { once: true });
    vid.addEventListener('error', () => vid.remove());
  }
  snd.addEventListener('click', () => {
    vid.muted = !vid.muted;
    snd.classList.toggle('is-on', !vid.muted);
    if (vid.paused) vid.play().catch(() => {});
  });

  // founder
  const [bigImg, detailImg] = S.founder.images || [];
  $('[data-founder-art]').innerHTML =
    `<div class="founder__big"></div>` +
    (detailImg ? `<div class="founder__detail"></div>` : '') +
    `<span class="founder__badge"><span class="mark"></span></span>`;
  fillImg($('.founder__big'), bigImg, 'MUNIVAR');
  if (detailImg) fillImg($('.founder__detail'), detailImg, '');
  const ava = $('[data-founder-ava]');
  if (S.founder.photo) fillImg(ava, S.founder.photo, L(S.founder.name));
  else ava.innerHTML = '<span class="mark"></span>';
  const fig = $('[data-founder-ig]');
  if (links.ig) fig.href = links.ig; else fig.remove();

  // aloqa kanallari
  const ico = {
    tel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M5 3.5h4l2 5-2.5 1.5a11 11 0 0 0 5.5 5.5L15.5 13l5 2v4a2 2 0 0 1-2 2A16.5 16.5 0 0 1 3 5.5a2 2 0 0 1 2-2Z"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6" fill="currentColor"/></svg>',
    tg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M21 4 3 11l6 2 2 6 3-4 5 4Z"/><path d="m9 13 8-6"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M3.5 20.5 5 16a8.5 8.5 0 1 1 3 3Z"/><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 .9a5 5 0 0 1-2.8-2.8l.9-1-1-2Z"/></svg>'
  };
  function renderChans() {
    const list = C.phones.map((p) => ['tel', U.phone, p, tel(p)]);
    if (links.ig) list.push(['ig', 'Instagram', '@' + C.instagram, links.ig]);
    if (links.tg) list.push(['tg', 'Telegram', /^https?:/.test(C.telegram) ? L(C.telegramLabel) : '@' + C.telegram, links.tg]);
    if (links.wa) list.push(['wa', 'WhatsApp', C.phones[0], links.wa]);
    $('[data-chans]').innerHTML = list.map(([k, n, v, h]) =>
      `<a class="chan rv in" href="${esc(h)}" ${k === 'tel' ? '' : 'target="_blank" rel="noopener"'}><span class="chan__i">${ico[k]}</span><span class="chan__t"><span class="chan__k">${esc(n)}</span><span class="chan__v">${esc(v)}</span></span></a>`).join('');
    $('[data-socials]').innerHTML = [links.ig && `<a href="${links.ig}" target="_blank" rel="noopener">Instagram</a>`,
      links.tg && `<a href="${links.tg}" target="_blank" rel="noopener">Telegram</a>`,
      `<a href="${tel(C.phones[0])}">${esc(C.phones[0])}</a>`].filter(Boolean).join('');
    $$('[data-tel]').forEach((t) => { t.href = tel(C.phones[0]); t.textContent = C.phones[0]; });
  }

  /* ---------- showroom ---------- */
  const SR = S.showroom || {};
  const hasShowroom = !!(SR.address && (SR.address.uz || SR.address.ru || SR.address.en));
  const mapLink = SR.mapLink || (SR.lat && SR.lng ? `https://yandex.uz/maps/?pt=${SR.lng},${SR.lat}&z=17&l=map` : '');
  if (hasShowroom && SR.lat && SR.lng) {
    $('[data-map]').innerHTML = `<iframe title="Showroom" loading="lazy" src="https://yandex.uz/map-widget/v1/?ll=${SR.lng},${SR.lat}&z=16&pt=${SR.lng},${SR.lat},pm2dgl" allowfullscreen></iframe>`;
  } else {
    $('[data-map]').remove();
  }
  if (!mapLink) $('[data-map-link]').remove(); else $('[data-map-link]').href = mapLink;
  if (!hasShowroom) {
    // showroom yo'q — formada tashrif varianti ham ko'rinmaydi, faqat online buyurtma
    $('[data-type-field]').hidden = true;
    $('#orderForm').type[0].checked = true;
  }
  function renderShowroom() {
    $('#showroom').hidden = !hasShowroom;
    if (!hasShowroom) return;
    const rows = [[U.addr, L(SR.address)], [U.landmarkL, L(SR.landmark)], [U.hoursL, L(SR.hours)]].filter(([, v]) => v);
    $('[data-showroom-list]').innerHTML = rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');
    const ms = $('[data-modal-showroom]');
    ms.hidden = false;
    ms.textContent = `${U.showEyebrow}: ${L(SR.address)}${L(SR.hours) ? ' · ' + L(SR.hours) : ''}`;
  }

  /* ---------- savol-javob ---------- */
  function renderFaq() {
    const items = (S.faq || []).filter((f) => L(f.a));
    $('#faq').hidden = !items.length;
    $('[data-faq]').innerHTML = items.map((f, i) => `
      <details class="faq__i"${i ? '' : ' open'}>
        <summary>${esc(L(f.q))}<span class="faq__pm" aria-hidden="true"></span></summary>
        <div class="faq__a">${esc(L(f.a))}</div>
      </details>`).join('');
  }

  /* ---------- tilga bog'liq qismlar ---------- */
  let catNow = 'all';
  function render() {
    U = window.UI[lang];
    document.documentElement.lang = lang;
    document.title = `MUNIVAR — ${L(S.brand.tagline)}`;

    $$('[data-t]').forEach((el) => (el.textContent = get(el.dataset.t)));
    $$('[data-ui]').forEach((el) => (el.textContent = U[el.dataset.ui]));
    $$('[data-ui-aria]').forEach((el) => el.setAttribute('aria-label', U[el.dataset.uiAria]));
    $$('[data-ui-ph]').forEach((el) => (el.placeholder = U[el.dataset.uiPh]));
    if (!hasShowroom) $('[data-ui="orderLead"]').textContent = U.orderLeadOnline;

    const ids = ['#looks', '#craft', '#founder', '#order'];
    $$('[data-navlinks]').forEach((n) => (n.innerHTML = U.nav.map((t, i) => `<a href="${ids[i]}">${esc(t)}</a>`).join('')));
    $$('[data-lang]').forEach((n) => (n.innerHTML = S.langs.map((l) =>
      `<button class="lang__o${l === lang ? ' is-on' : ''}" type="button" data-set-lang="${l}" aria-pressed="${l === lang}">${l}</button>`).join('')));

    $('[data-trust]').innerHTML = S.trust.map((t) =>
      `<div class="trust__i"><span class="trust__n">${esc(L(t.n))}</span><span class="trust__l">${esc(L(t.l))}</span></div>`).join('');

    $('[data-lcats]').innerHTML = S.looks.cats.map((c) =>
      `<button class="lcat${c.id === catNow ? ' is-on' : ''}" type="button" data-lcat="${esc(c.id)}" aria-pressed="${c.id === catNow}">${esc(L(c.t))}</button>`).join('');

    $('[data-craft]').innerHTML = S.craft.map((c) =>
      `<div class="craft__i rv in"><div class="craft__media ph has-img"><img src="${esc(c.img)}" alt="${esc(L(c.t))}" loading="lazy" decoding="async"></div><h3>${esc(L(c.t))}</h3><p>${esc(L(c.d))}</p></div>`).join('');
    $('[data-occasions]').innerHTML = S.occasions.map((o) => `<li class="rv in">${esc(L(o))}</li>`).join('');

    $('#stars').hidden = !S.stars.length;
    starsEl.innerHTML = S.stars.map((s) => `
      <article class="star">
        <div class="star__top"><div class="star__ava ph${s.photo ? ' has-img' : ''}">${s.photo ? `<img src="${esc(s.photo)}" alt="">` : ''}</div>
          <div><p class="star__name">${esc(L(s.name))}</p><p class="star__role">${esc(L(s.role))}</p></div></div>
        <p class="star__quote">${esc(L(s.quote))}</p>
        ${s.ig ? `<a class="star__ig" href="https://www.instagram.com/${esc(s.ig)}/" target="_blank" rel="noopener">@${esc(s.ig)} →</a>` : ''}
      </article>`).join('');

    $('#reviews').hidden = !S.reviews.length;
    $('[data-reviews]').innerHTML = S.reviews.map((r) => r.shot
      ? `<figure class="review review--shot"><img src="${esc(r.shot)}" alt="${esc(U.revTitle)}" loading="lazy" decoding="async"></figure>`
      : `<figure class="review">
          <blockquote>${esc(L(r.q))}</blockquote>
          <figcaption>${r.photo ? `<img class="review__ava" src="${esc(r.photo)}" alt="" loading="lazy">` : ''}<span>${esc(L(r.who))}</span></figcaption>
        </figure>`).join('');

    renderChans();
    renderShowroom();
    renderFaq();
    if (pickCode) $('[data-pick-name]').textContent = `${U.lookLabel} ${pickCode}`;
    updNav();
  }

  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-set-lang]');
    if (!b) return;
    lang = b.dataset.setLang;
    store.set('lang', lang);
    const u = new URL(location.href);
    u.searchParams.set('lang', lang);
    history.replaceState(null, '', u);
    render();
  });

  /* ---------- kolleksiya filtri ---------- */
  $('[data-lcats]').addEventListener('click', (e) => {
    const b = e.target.closest('.lcat');
    if (!b) return;
    catNow = b.dataset.lcat;
    $$('.lcat').forEach((x) => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', x === b); });
    $$('.rail__item', looksEl).forEach((it) => {
      it.hidden = catNow !== 'all' && it.dataset.cat !== catNow;
      it.classList.add('in');
    });
    looksEl.scrollTo({ left: 0, behavior: 'smooth' });
    updNav();
  });

  /* ---------- nav / drawer ---------- */
  const nav = $('#nav');
  const hero = $('#hero');
  const fab = $('.cta-fab');
  const onScroll = () => {
    const past = window.scrollY > hero.offsetHeight - 90;
    nav.classList.toggle('nav--solid', past);
    nav.classList.toggle('nav--over', !past);
    fab.classList.toggle('show', window.scrollY > hero.offsetHeight * 0.9);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  $('.burger').addEventListener('click', () => document.body.classList.toggle('menu-open'));
  $('#drawer').addEventListener('click', (e) => { if (e.target.closest('a[href^="#"]')) document.body.classList.remove('menu-open'); });

  /* ---------- karusel strelkalari + sichqoncha bilan surish ---------- */
  const arrow = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="${d ? 'M5 12h14m-5-5 5 5-5 5' : 'M19 12H5m5-5-5 5 5 5'}"/></svg>`;
  const rails = { looks: looksEl, stars: starsEl };
  const navs = [];
  $$('.rail-nav').forEach((n) => {
    const r = rails[n.dataset.for];
    n.innerHTML = `<button class="rail-nav__b" type="button" data-ui-aria="prev">${arrow(0)}</button><button class="rail-nav__b" type="button" data-ui-aria="next">${arrow(1)}</button>`;
    const [p, x] = $$('button', n);
    const step = () => r.clientWidth * 0.8;
    p.onclick = () => r.scrollBy({ left: -step(), behavior: 'smooth' });
    x.onclick = () => r.scrollBy({ left: step(), behavior: 'smooth' });
    navs.push(() => { p.disabled = r.scrollLeft < 5; x.disabled = r.scrollLeft + r.clientWidth >= r.scrollWidth - 5; });
    r.addEventListener('scroll', () => navs.forEach((f) => f()), { passive: true });
  });
  function updNav() { requestAnimationFrame(() => navs.forEach((f) => f())); }
  addEventListener('resize', updNav);

  if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
    Object.values(rails).forEach((r) => {
      let down = false, sx = 0, sl = 0, moved = false;
      r.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = r.scrollLeft; r.style.scrollSnapType = 'none'; });
      addEventListener('pointermove', (e) => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 5) { moved = true; r.classList.add('is-dragging'); } r.scrollLeft = sl - dx; });
      addEventListener('pointerup', () => { if (!down) return; down = false; r.classList.remove('is-dragging'); r.style.scrollSnapType = ''; });
      r.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
    });
  }

  /* ---------- lightbox ---------- */
  const lb = document.createElement('div');
  lb.className = 'lb';
  lb.innerHTML = '<img alt=""><button class="lb__x" data-ui-aria="close">×</button><button class="lb__p" data-ui-aria="prev">‹</button><button class="lb__n" data-ui-aria="next">›</button>' +
    '<div class="lb__bar"><span class="lb__code"></span><button class="btn btn--gold lb__ask" type="button" data-ui="askLook"></button></div>';
  document.body.appendChild(lb);
  let cur = [], ci = 0;
  const showLb = () => {
    $('img', lb).src = cur[ci].src;
    $('.lb__code', lb).textContent = cur[ci].code;
  };
  looksEl.addEventListener('click', (e) => {
    const m = e.target.closest('.rail__media.has-img');
    if (!m) return;
    const vis = $$('.rail__item:not([hidden]) .rail__media.has-img', looksEl);
    cur = vis.map((x) => {
      const n = S.looks.items[x.dataset.i].img;
      return { src: `media/looks/look-${n}-1400.webp`, thumb: `media/looks/look-${n}-700.webp`, code: lookCode(n) };
    });
    ci = vis.indexOf(m);
    showLb();
    lb.classList.add('on');
  });
  const closeLb = () => lb.classList.remove('on');
  $('.lb__x', lb).onclick = closeLb;
  $('.lb__p', lb).onclick = () => { ci = (ci - 1 + cur.length) % cur.length; showLb(); };
  $('.lb__n', lb).onclick = () => { ci = (ci + 1) % cur.length; showLb(); };
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });

  /* ---------- modal + forma ---------- */
  const modal = $('#modal');
  const form = $('#orderForm');
  const msg = $('.form__msg', form);
  const btn = $('.btn-send', form);
  const openModal = (e) => {
    if (e) e.preventDefault();
    document.body.classList.remove('menu-open');
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('on'));
    document.body.classList.add('modal-open');
  };
  const closeModal = () => {
    modal.classList.remove('on');
    document.body.classList.remove('modal-open');
    setTimeout(() => (modal.hidden = true), 350);
  };
  document.addEventListener('click', (e) => { if (e.target.closest('[data-open-order]')) openModal(e); });

  // tanlangan libos (lightbox → "Shu libosni so'rash")
  let pickCode = '';
  const pickBox = $('[data-pick]');
  function setPick(code, thumb) {
    pickCode = code || '';
    pickBox.hidden = !pickCode;
    if (!pickCode) return;
    $('[data-pick-img]').src = thumb;
    $('[data-pick-name]').textContent = `${U.lookLabel} ${pickCode}`;
  }
  $('[data-pick-x]').onclick = () => setPick('');
  $('.lb__ask', lb).onclick = () => {
    setPick(cur[ci].code, cur[ci].thumb);
    closeLb();
    openModal();
  };
  $('.modal__x').onclick = closeModal;
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (lb.classList.contains('on')) closeLb(); else if (modal.classList.contains('on')) closeModal();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    $$('.err', form).forEach((x) => x.classList.remove('err'));
    const type = form.type.value;
    const name = form.name.value.trim();
    const phone = form.phone.value.replace(/\D/g, '');
    const bad = [];
    if (!type) bad.push($('.choice', form));
    if (name.length < 2) bad.push(form.name);
    if (phone.length < 7) bad.push(form.phone);
    if (bad.length) {
      bad.forEach((x) => { void x.offsetWidth; x.classList.add('err'); });
      msg.className = 'form__msg err';
      msg.textContent = U.errFill;
      return;
    }
    btn.disabled = true;
    btn.textContent = U.sending;
    msg.className = 'form__msg';
    msg.textContent = '';
    try {
      const r = await fetch(S.orderEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: type === 'online' ? window.UI.uz.tOnline : window.UI.uz.tVisit,
          name, phone: `${form.cc.value} ${phone}`, look: pickCode, lang, website: form.website.value, page: location.href
        })
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.ok) throw new Error(j.error || r.status);
      msg.className = 'form__msg ok';
      msg.textContent = U.ok;
      form.reset();
      setPick('');
      if (!hasShowroom) form.type[0].checked = true;
    } catch (err) {
      msg.className = 'form__msg err';
      msg.textContent = `${U.errSend} ${C.phones[0]}`;
    } finally {
      btn.disabled = false;
      btn.textContent = U.send;
    }
  });

  /* ---------- paydo bo'lish animatsiyasi ---------- */
  render();
  const io = new IntersectionObserver((ents) => ents.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  $$('.rv:not(.in)').forEach((el) => io.observe(el));
})();
