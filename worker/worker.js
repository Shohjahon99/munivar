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
    const type = clean(data.type, 40);
    const look = clean(data.look, 12);
    const lang = clean(data.lang, 5).toUpperCase();
    if (name.length < 2 || phone.replace(/\D/g, '').length < 7) return json({ ok: false, error: 'invalid' }, 422);

    const h = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
    const time = new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' });
    const text =
      `🛍 <b>Yangi ariza — MUNIVAR</b>\n\n` +
      `👤 <b>Ism:</b> ${h(name)}\n` +
      `📞 <b>Telefon:</b> ${h(phone)}\n` +
      `📍 <b>Turi:</b> ${h(type)}\n` +
      (look ? `👗 <b>Libos:</b> ${h(look)}\n` : '') +
      `🌐 <b>Til:</b> ${h(lang)}\n` +
      `🕒 ${time}`;

    const tg = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: env.CHAT_ID, text, parse_mode: 'HTML' })
    });
    if (!tg.ok) return json({ ok: false, error: 'telegram' }, 502);
    return json({ ok: true });
  }
};
