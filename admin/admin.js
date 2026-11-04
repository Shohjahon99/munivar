/* MUNIVAR admin panel — mahsulotlarni GitHub repozitoriyda (data/products.json + media/products/) boshqaradi.
   Har bir saqlash = bitta commit (Git Data API). GitHub Actions uni gh-pages ga ko'chiradi, sayt 1–2 daqiqada yangilanadi. */
(function () {
  const REPO = { owner: 'Shohjahon99', repo: 'munivar', branch: 'main' };
  const DATA_PATH = 'data/products.json';
  const IMG_DIR = 'media/products';
  const IMG_MAX_W = 1200;
  const TOKEN_KEY = 'munivar_admin_token';

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

  /* ---------- GitHub API ---------- */
  async function gh(path, opts = {}) {
    const r = await fetch(`https://api.github.com/repos/${REPO.owner}/${REPO.repo}${path}`, {
      ...opts,
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', ...(opts.body ? { 'Content-Type': 'application/json' } : {}) }
    });
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      const e = new Error(j.message || `HTTP ${r.status}`);
      e.status = r.status;
      throw e;
    }
    return r.status === 204 ? null : r.json();
  }
  const b64ToText = (b64) => new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\n/g, '')), (c) => c.charCodeAt(0)));
  const blobToB64 = (blob) => new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(String(fr.result).split(',')[1]);
    fr.onerror = rej;
    fr.readAsDataURL(blob);
  });

  async function loadData() {
    const f = await gh(`/contents/${DATA_PATH}?ref=${REPO.branch}`);
    data = JSON.parse(b64ToText(f.content));
    if (!Array.isArray(data.products)) data.products = [];
  }

  /** Bitta commit: products.json + yangi rasmlar (+ o'chirilgan rasmlar) */
  async function commit(message, newImages = [], deletePaths = []) {
    const ref = await gh(`/git/ref/heads/${REPO.branch}`);
    const headSha = ref.object.sha;
    const head = await gh(`/git/commits/${headSha}`);
    const tree = [];
    for (const img of newImages) {
      const blob = await gh('/git/blobs', { method: 'POST', body: JSON.stringify({ content: await blobToB64(img.blob), encoding: 'base64' }) });
      tree.push({ path: img.path, mode: '100644', type: 'blob', sha: blob.sha });
    }
    const json = JSON.stringify(data, null, 2) + '\n';
    const jb = await gh('/git/blobs', { method: 'POST', body: JSON.stringify({ content: json, encoding: 'utf-8' }) });
    tree.push({ path: DATA_PATH, mode: '100644', type: 'blob', sha: jb.sha });
    deletePaths.filter((p) => p.startsWith(IMG_DIR + '/')).forEach((p) => tree.push({ path: p, mode: '100644', type: 'blob', sha: null }));
    const t = await gh('/git/trees', { method: 'POST', body: JSON.stringify({ base_tree: head.tree.sha, tree }) });
    const c = await gh('/git/commits', { method: 'POST', body: JSON.stringify({ message, tree: t.sha, parents: [headSha] }) });
    await gh(`/git/refs/heads/${REPO.branch}`, { method: 'PATCH', body: JSON.stringify({ sha: c.sha }) });
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
    e.status === 401 ? 'Token noto\'g\'ri yoki muddati tugagan.' :
    e.status === 403 || e.status === 404 ? 'Token bu repozitoriyga yozish huquqiga ega emas (Contents: Read and write kerak).' :
    e.status === 409 || e.status === 422 ? 'Repozitoriy shu payt o\'zgargan — sahifani yangilab, qayta urinib ko\'ring.' :
    `Xatolik: ${e.message}`;

  /* ---------- kirish ---------- */
  $('#loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const t = $('#token').value.trim();
    const msg = $('#loginMsg');
    if (!t) return;
    token = t;
    msg.className = 'msg';
    msg.textContent = 'Tekshirilmoqda…';
    try {
      const repo = await gh('');
      if (!repo.permissions || !repo.permissions.push) throw Object.assign(new Error('perm'), { status: 403 });
      store.set(t, $('#remember').checked);
      $('#token').value = '';
      msg.textContent = '';
      await openList();
    } catch (err) {
      token = '';
      msg.className = 'msg err';
      msg.textContent = errText(err);
    }
  });
  $('#logout').onclick = () => { store.clear(); token = ''; show('login'); };

  /* ---------- ro'yxat ---------- */
  async function openList(reload = true) {
    if (reload) {
      show('loading');
      try { await loadData(); } catch (err) {
        if (err.status === 401) { store.clear(); show('login'); $('#loginMsg').className = 'msg err'; $('#loginMsg').textContent = errText(err); return; }
        toast(errText(err), true);
      }
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
      toast('Saqlandi. Saytda 1–2 daqiqada ko\'rinadi.');
    } catch (err) { toast(errText(err), true); }
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
      return path;
    });
    const removed = oldImages.filter((x) => !p.images.includes(x));

    if (isNew) data.products.unshift(p);
    else data.products[data.products.findIndex((x) => x.id === p.id)] = p;

    $('#saveBtn').disabled = true;
    msg.className = 'msg';
    msg.textContent = 'Saqlanmoqda…';
    try {
      await commit(`Admin: ${isNew ? 'yangi mahsulot' : 'tahrirlandi'} — ${nameUz}`, newImages, removed);
      toast('Saqlandi. Saytda 1–2 daqiqada ko\'rinadi.');
      await openList();
    } catch (err) {
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
      toast(errText(err), true);
      await openList();
    } finally {
      $('#delBtn').disabled = false;
    }
  };

  /* ---------- start ---------- */
  token = store.get();
  if (token) openList(); else show('login');
})();
