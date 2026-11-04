// MUNIVAR — ariza formasini Telegram'ga yuboruvchi Cloudflare Worker.
// Maxfiy qiymatlar (Cloudflare → Worker → Settings → Variables and Secrets):
//   BOT_TOKEN — @BotFather bergan token
//   CHAT_ID   — arizalar keladigan chat/guruh ID
// ALLOWED_ORIGINS — vergul bilan ajratilgan sayt manzillari (wrangler.toml da)

export default {
  async fetch(req, env) {
    const origin = req.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
    const okOrigin = allowed.includes(origin);
    const cors = {
      'Access-Control-Allow-Origin': okOrigin ? origin : allowed[0] || '',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin'
    };
    const json = (body, status = 200) =>
      new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8' } });

    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (req.method !== 'POST') return json({ ok: false, error: 'method' }, 405);
    if (!okOrigin) return json({ ok: false, error: 'origin' }, 403);

    let data;
    try { data = await req.json(); } catch { return json({ ok: false, error: 'json' }, 400); }

    // bot-spam tuzog'i
    if (data.website) return json({ ok: true });

    const clean = (v, max) => String(v ?? '').replace(/<[^>]*>/g, '').trim().slice(0, max);
    const name = clean(data.name, 80);
    const phone = clean(data.phone, 30);
    const lang = clean(data.lang, 5).toUpperCase();
    if (name.length < 2 || phone.replace(/\D/g, '').length < 7) return json({ ok: false, error: 'invalid' }, 422);

    const h = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
    const money = (n) => `${Math.round(+n || 0).toLocaleString('ru-RU').replace(/ |,/g, ' ')} so'm`;
    const time = new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' });
    let text;

    if (data.kind === 'product') {
      // mahsulot buyurtmasi
      const product = clean(data.productNameUz || data.productName, 100);
      const color = clean(data.color, 40);
      const size = clean(data.size, 20);
      const qty = Math.min(99, Math.max(1, parseInt(data.qty, 10) || 1));
      const total = Math.max(0, +data.total || 0);
      const address = clean(data.address, 160);
      const comment = clean(data.comment, 400);
      const link = /^https?:\/\//.test(String(data.link || '')) ? clean(data.link, 300) : '';
      if (!product) return json({ ok: false, error: 'invalid' }, 422);
      text =
        `🛍 <b>Yangi buyurtma — MUNIVAR</b>\n\n` +
        `👗 <b>Mahsulot:</b> ${h(product)}\n` +
        (color ? `🎨 <b>Rang:</b> ${h(color)}\n` : '') +
        (size ? `📏 <b>O'lcham:</b> ${h(size)}\n` : '') +
        `🔢 <b>Soni:</b> ${qty}\n` +
        (total ? `💰 <b>Jami:</b> ${h(money(total))}\n` : '') +
        `\n👤 <b>Ism:</b> ${h(name)}\n` +
        `📞 <b>Telefon:</b> ${h(phone)}\n` +
        (address ? `📍 <b>Manzil:</b> ${h(address)}\n` : '') +
        (comment ? `💬 <b>Izoh:</b> ${h(comment)}\n` : '') +
        `\n🌐 ${h(lang)} · 🕒 ${time}` +
        (link ? `\n🔗 ${h(link)}` : '');
    } else {
      // konsultatsiya arizasi
      const type = clean(data.type, 40);
      const look = clean(data.look, 12);
      text =
        `📝 <b>Yangi ariza — MUNIVAR</b>\n\n` +
        `👤 <b>Ism:</b> ${h(name)}\n` +
        `📞 <b>Telefon:</b> ${h(phone)}\n` +
        `📍 <b>Turi:</b> ${h(type)}\n` +
        (look ? `👗 <b>Libos:</b> ${h(look)}\n` : '') +
        `🌐 <b>Til:</b> ${h(lang)}\n` +
        `🕒 ${time}`;
    }

    const tg = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: env.CHAT_ID, text, parse_mode: 'HTML', disable_web_page_preview: true })
    });
    if (!tg.ok) return json({ ok: false, error: 'telegram' }, 502);
    return json({ ok: true });
  }
};
