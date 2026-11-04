/* MUNIVAR admin panel — bitta parol bilan kiriladi.
   Mahsulotlar va rasmlar Supabase Storage'da (bucket "munivar") saqlanadi, sayt ularni darhol ko'rsatadi.
   Server: supabase/functions/munivar-admin (parol Supabase Secrets → ADMIN_PASSWORD). */
(function () {
  const ADMIN_API = 'https://adjxdgfifzmepjrxdbte.supabase.co/functions/v1/munivar-admin';
  const PUBLIC_BASE = 'https://adjxdgfifzmepjrxdbte.supabase.co/storage/v1/object/public/munivar/';
  const LOCAL_DATA = '../data/products.json';   // Supabase'da hali ro'yxat bo'lmasa — boshlang'ich ma'lumot
  const IMG_DIR = 'products';
  const IMG_MAX_W = 1200;
  const TOKEN_KEY = 'munivar_admin_session';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (n) => `${Math.round(n).toLocaleString('ru-RU').replace(/ |,/g, ' ')} so'm`;
  const finalPrice = (p) => { const d = +p.discount || 0; return d ? Math.round((p.price * (100 - d)) / 100 / 1000) * 1000 : +p.price; };

  let token = '';
  let data = { products: [] };
  let editing = null;          // tahrirlanayotgan mahsulot (nusxa) yoki yangi
  let slots = [null, null];    // { src, blob? , path? } — rasm slotlari

  /* ---------- token saqlash ---------- */
  const store = {
    get() { try { return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY) || ''; } catch (e) { return ''; } },
    set(t, remember) { try { (remember ? localStorage : sessionStorage).setItem(TOKEN_KEY, t); } catch (e) {} },
    clear() { try { sessionStorage.removeItem(TOKEN_KEY); localStorage.removeItem(TOKEN_KEY); } catch (e) {} }
  };

  /* ---------- server (Supabase funksiyasi) ---------- */
  async function api(action, body = {}) {
    const r = await fetch(ADMIN_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ action, ...body })
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.ok) {
      const e = new Error(j.error || `HTTP ${r.status}`);
      e.status = r.status;
      e.code = j.error;
      throw e;
    }
    return j;
  }
  const blobToB64 = (blob) => new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(String(fr.result).split(',')[1]);
    fr.onerror = rej;
    fr.readAsDataURL(blob);
  });
  const getJson = (u) => fetch(u, { cache: 'no-store' }).then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); });

  async function loadData() {
    data = await getJson(`${PUBLIC_BASE}products.json?t=${Date.now()}`).catch(() => getJson(LOCAL_DATA));
    if (!Array.isArray(data.products)) data.products = [];
  }

  /** Saqlash: products.json + yangi rasmlar (+ o'chirilgan rasmlar) — bitta so'rov */
  async function commit(message, newImages = [], deletePaths = []) {
    const images = [];
    for (const img of newImages) images.push({ path: img.path, type: 'image/webp', b64: await blobToB64(img.blob) });
    const del = deletePaths.filter((u) => u.startsWith(PUBLIC_BASE)).map((u) => u.slice(PUBLIC_BASE.length));
    await api('save', { message, data, images, delete: del });
  }

  /* ---------- rasmni kichraytirish (webp) ---------- */
  function resizeImage(file) {
    return new Promise((res, rej) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, IMG_MAX_W / img.naturalWidth);
        const w = Math.round(img.naturalWidth * scale), h = Math.round(img.naturalHeight * scale);
        const cv = document.createElement('canvas');
        cv.width = w; cv.height = h;
        cv.getContext('2d').drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        cv.toBlob((b) => (b ? res(b) : rej(new Error('rasm'))), 'image/webp', 0.84);
      };
      img.onerror = () => { URL.revokeObjectURL(url); rej(new Error('Rasmni o\'qib bo\'lmadi')); };
      img.src = url;
    });
  }

  /* ---------- ko'rinishlar ---------- */
  const views = ['login', 'listView', 'editView', 'loading'];
  function show(id) {
    views.forEach((v) => ($('#' + v).hidden = v !== id));
    $('#topRight').hidden = id === 'login';
    window.scrollTo(0, 0);
  }
  function toast(text, err) {
    const t = $('#toast');
    t.textContent = text;
    t.className = 'toast' + (err ? ' err' : '');
    t.hidden = false;
    clearTimeout(toast.t);
    toast.t = setTimeout(() => (t.hidden = true), err ? 7000 : 4500);
  }
  const imgUrl = (p) => (/^https?:/.test(p) ? p : `../${p}`);
  const errText = (e) =>
    e.code === 'password' ? 'Parol noto\'g\'ri.' :
    e.code === 'session' ? 'Kirish muddati tugagan — parolni qayta kiriting.' :
    e.code === 'config' ? 'Server sozlanmagan: Supabase\'da ADMIN_PASSWORD kiritilmagan.' :
    e.code === 'image_size' ? 'Rasm juda katta (5 MB dan oshmasin).' :
    e.status === 0 || e instanceof TypeError ? 'Internet bilan aloqa yo\'q — qayta urinib ko\'ring.' :
    `Xatolik: ${e.message}`;
  const logoutWith = (text) => {
    store.clear(); token = ''; show('login');
    if (text) { $('#loginMsg').className = 'msg err'; $('#loginMsg').textContent = text; }
  };

  /* ---------- kirish ---------- */
  $('#loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const pw = $('#password').value;
    const msg = $('#loginMsg');
    if (!pw) return;
    msg.className = 'msg';
    msg.textContent = 'Tekshirilmoqda…';
    $('#loginBtn').disabled = true;
    try {
      token = '';
      const j = await api('login', { password: pw });
      token = j.token;
      store.set(token, $('#remember').checked);
      $('#password').value = '';
      msg.textContent = '';
      await openList();
    } catch (err) {
      token = '';
      msg.className = 'msg err';
      msg.textContent = errText(err);
    } finally {
      $('#loginBtn').disabled = false;
    }
  });
  $('#logout').onclick = () => logoutWith('');

  /* ---------- ro'yxat ---------- */
  async function openList(reload = true) {
    if (reload) {
      show('loading');
      try { await loadData(); } catch (err) { toast(errText(err), true); }
    }
    renderList();
    show('listView');
  }

  function renderList() {
    const ps = data.products;
    const samples = ps.filter((p) => p.sample).length;
    $('#listInfo').textContent = `${ps.length} ta mahsulot` + (samples ? ` · ${samples} tasi namuna` : '');
    $('#delSamples').hidden = !samples;
    $('#plist').innerHTML = ps.length ? ps.map((p, i) => `
      <div class="prow${p.active === false ? ' is-off' : ''}">
        <img src="${esc(imgUrl(p.images[0] || ''))}" alt="">
        <div>
          <div class="prow__name">${esc(p.name.uz)}${p.sample ? '<span class="tag tag--sample">namuna</span>' : ''}${p.active === false ? '<span class="tag tag--off">yashirin</span>' : ''}</div>
          <div class="prow__meta">${p.price ? `${fmt(finalPrice(p))}${+p.discount ? ` <s>${fmt(p.price)}</s> −${+p.discount}%` : ''}` : 'Narx ko\'rsatilmagan'}
            · ${(p.colors || []).map((c) => esc(c.name)).join(', ') || 'rangsiz'} · ${(p.sizes || []).join(', ') || 'o\'lchamsiz'}</div>
        </div>
        <div class="prow__acts">
          <button class="ib" type="button" data-act="up" data-i="${i}" title="Yuqoriga" ${i ? '' : 'disabled'}>↑</button>
          <button class="ib" type="button" data-act="down" data-i="${i}" title="Pastga" ${i < ps.length - 1 ? '' : 'disabled'}>↓</button>
          <button class="ib" type="button" data-act="toggle" data-i="${i}" title="${p.active === false ? 'Ko\'rsatish' : 'Yashirish'}">${p.active === false ? '◌' : '●'}</button>
          <button class="btn btn--ghost" type="button" data-act="edit" data-i="${i}">Tahrirlash</button>
        </div>
      </div>`).join('') : '<div class="empty">Hali mahsulot yo\'q. "+ Yangi mahsulot" tugmasini bosing.</div>';
  }

  $('#plist').addEventListener('click', async (e) => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    const i = +b.dataset.i, ps = data.products, p = ps[i];
    if (b.dataset.act === 'edit') return openEditor(p);
    if (b.dataset.act === 'up' || b.dataset.act === 'down') {
      const j = b.dataset.act === 'up' ? i - 1 : i + 1;
      [ps[i], ps[j]] = [ps[j], ps[i]];
      return quickSave(`Tartib: ${p.name.uz}`);
    }
    if (b.dataset.act === 'toggle') {
      p.active = p.active === false;
      return quickSave(`${p.active ? 'Ko\'rsatildi' : 'Yashirildi'}: ${p.name.uz}`);
    }
  });

  async function quickSave(message) {
    $$('#plist button').forEach((x) => (x.disabled = true));
    try {
      await commit(`Admin: ${message}`);
      toast('Saqlandi — saytda darhol ko\'rinadi.');
    } catch (err) {
      if (err.code === 'session') return logoutWith(errText(err));
      toast(errText(err), true);
    }
    await openList();
  }

  $('#delSamples').onclick = async () => {
    if (!confirm('Barcha namuna mahsulotlar o\'chirilsinmi? (Kolleksiya rasmlari saqlanib qoladi)')) return;
    data.products = data.products.filter((p) => !p.sample);
    await quickSave('Namuna mahsulotlar o\'chirildi');
  };

  /* ---------- tahrirlash ---------- */
  const COLOR_PRESETS = [['Qora', '#16161a'], ['Oq', '#f5f3ee'], ['Bej', '#d8c7a8'], ['Havorang', '#b7cfd4'], ['Kulrang', '#b9b9c2'], ['Bordo', '#6b1e2b'], ['Zaytun', '#2f3920'], ['Pushti', '#e8c4c4']];
  $('#colorPresets').innerHTML = COLOR_PRESETS.map(([n, h]) => `<button type="button" class="chip" data-cname="${n}" data-chex="${h}"><i style="background:${h}"></i>${n}</button>`).join('');

  function colorRow(c = { name: '', hex: '#16161a' }) {
    const d = document.createElement('div');
    d.className = 'crow';
    d.innerHTML = `<input type="color" value="${esc(c.hex)}"><input type="text" placeholder="Rang nomi" value="${esc(c.name)}" maxlength="30"><button type="button" class="ib" title="O'chirish">×</button>`;
    $('button', d).onclick = () => d.remove();
    $('#colors').appendChild(d);
  }
  $('#colorPresets').addEventListener('click', (e) => {
    const b = e.target.closest('[data-cname]');
    if (b) colorRow({ name: b.dataset.cname, hex: b.dataset.chex });
  });
  $$('[data-sizes]').forEach((b) => (b.onclick = () => ($('#sizes').value = b.dataset.sizes)));

  $$('.tab').forEach((t) => (t.onclick = () => {
    $$('.tab').forEach((x) => x.classList.toggle('is-on', x === t));
    $$('.lang-pane').forEach((p) => (p.hidden = p.dataset.lang !== t.dataset.lang));
  }));

  function setSlot(i, s) {
    slots[i] = s;
    const el = $(`.slot[data-slot="${i}"]`);
    el.classList.toggle('has', !!s);
    $('img', el).src = s ? s.src : '';
  }
  $$('.slot').forEach((el) => {
    const i = +el.dataset.slot;
    $('input', el).addEventListener('change', async (e) => {
      const f = e.target.files[0];
      e.target.value = '';
      if (!f) return;
      try {
        const blob = await resizeImage(f);
        setSlot(i, { src: URL.createObjectURL(blob), blob });
      } catch (err) { toast(err.message, true); }
    });
    $('.slot__x', el).addEventListener('click', (e) => { e.preventDefault(); setSlot(i, null); });
  });

  function updatePricePreview() {
    const price = +$('#price').value || 0, d = +$('#discount').value || 0;
    $('#pricePreview').textContent = price ? (d ? `Saytda: ${fmt(finalPrice({ price, discount: d }))} (eski narx ${fmt(price)} chizilgan holda)` : `Saytda: ${fmt(price)}`) : 'Narx bo\'sh bo\'lsa, "Narxi so\'rov bo\'yicha" yoziladi.';
  }
  $('#price').oninput = $('#discount').oninput = updatePricePreview;

  function openEditor(p) {
    editing = p ? JSON.parse(JSON.stringify(p)) : null;
    $('#editTitle').textContent = p ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot';
    $('#delBtn').hidden = !p;
    $('#editMsg').textContent = '';
    ['uz', 'ru', 'en'].forEach((l) => {
      $(`#name_${l}`).value = (p && p.name[l]) || '';
      $(`#desc_${l}`).value = (p && p.desc && p.desc[l]) || '';
    });
    $('#price').value = p && p.price ? p.price : '';
    $('#discount').value = p && +p.discount ? p.discount : '';
    $('#active').checked = !p || p.active !== false;
    $('#sizes').value = p ? (p.sizes || []).join(', ') : 'S, M, L, XL';
    $('#colors').innerHTML = '';
    (p ? p.colors || [] : []).forEach(colorRow);
    if (!p) colorRow({ name: 'Qora', hex: '#16161a' });
    [0, 1].forEach((i) => setSlot(i, p && p.images[i] ? { src: imgUrl(p.images[i]), path: p.images[i] } : null));
    $$('.tab')[0].click();
    updatePricePreview();
    show('editView');
  }
  $('#addBtn').onclick = () => openEditor(null);
  $('#backBtn').onclick = () => openList(false);

  const slug = (s) => s.toLowerCase().replace(/['ʻʼ`’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'mahsulot';
  const rnd = () => Math.random().toString(36).slice(2, 7);

  $('#editForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = $('#editMsg');
    const nameUz = $('#name_uz').value.trim();
    if (!nameUz) { $$('.tab')[0].click(); $('#name_uz').focus(); msg.className = 'msg err'; msg.textContent = 'O\'zbekcha nomini yozing.'; return; }
    if (!slots[0]) { msg.className = 'msg err'; msg.textContent = 'Kamida 1-rasmni qo\'shing.'; return; }
    const discount = Math.min(90, Math.max(0, Math.round(+$('#discount').value || 0)));

    const isNew = !editing;
    const p = editing || { id: `${slug(nameUz)}-${rnd()}` };
    const oldImages = isNew ? [] : [...(p.images || [])];
    p.name = { uz: nameUz, ru: $('#name_ru').value.trim(), en: $('#name_en').value.trim() };
    p.desc = { uz: $('#desc_uz').value.trim(), ru: $('#desc_ru').value.trim(), en: $('#desc_en').value.trim() };
    p.price = Math.max(0, Math.round(+$('#price').value || 0));
    p.discount = discount;
    p.active = $('#active').checked;
    p.colors = $$('#colors .crow').map((r) => ({ hex: $('input[type=color]', r).value, name: $('input[type=text]', r).value.trim() })).filter((c) => c.name);
    p.sizes = $('#sizes').value.split(',').map((s) => s.trim()).filter(Boolean);
    delete p.sample;

    const newImages = [];
    p.images = slots.filter(Boolean).map((s, i) => {
      if (s.path) return s.path;
      const path = `${IMG_DIR}/${p.id}-${i + 1}-${rnd()}.webp`;
      newImages.push({ path, blob: s.blob });
      return PUBLIC_BASE + path;
    });
    const removed = oldImages.filter((x) => !p.images.includes(x));

    if (isNew) data.products.unshift(p);
    else data.products[data.products.findIndex((x) => x.id === p.id)] = p;

    $('#saveBtn').disabled = true;
    msg.className = 'msg';
    msg.textContent = 'Saqlanmoqda…';
    try {
      await commit(`Admin: ${isNew ? 'yangi mahsulot' : 'tahrirlandi'} — ${nameUz}`, newImages, removed);
      toast('Saqlandi — saytda darhol ko\'rinadi.');
      await openList();
    } catch (err) {
      if (err.code === 'session') return logoutWith(errText(err));
      msg.className = 'msg err';
      msg.textContent = errText(err);
      await loadData().catch(() => {});
    } finally {
      $('#saveBtn').disabled = false;
    }
  });

  $('#delBtn').onclick = async () => {
    if (!editing || !confirm(`"${editing.name.uz}" o'chirilsinmi?`)) return;
    data.products = data.products.filter((x) => x.id !== editing.id);
    $('#delBtn').disabled = true;
    try {
      await commit(`Admin: o'chirildi — ${editing.name.uz}`, [], editing.images || []);
      toast('O\'chirildi.');
      await openList();
    } catch (err) {
      if (err.code === 'session') return logoutWith(errText(err));
      toast(errText(err), true);
      await openList();
    } finally {
      $('#delBtn').disabled = false;
    }
  };

  /* ---------- start ---------- */
  token = store.get();
  if (!token) show('login');
  else {
    show('loading');
    api('ping').then(() => openList()).catch((err) => logoutWith(err.code === 'session' ? errText(err) : ''));
  }
})();
