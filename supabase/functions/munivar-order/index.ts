// MUNIVAR — saytdagi buyurtma va arizalarni Telegram guruhga yuboruvchi Supabase Edge Function.
// (worker/worker.js bilan bir xil mantiq; ikkalasidan bittasi ishlatiladi)
//
// Supabase → Edge Functions → Secrets:
//   BOT_TOKEN — @BotFather bergan token (MAJBURIY, kodga yozilmaydi)
//   CHAT_ID   — ixtiyoriy; yozilmasa quyidagi guruh ishlatiladi
//   ALLOWED_ORIGINS — ixtiyoriy; vergul bilan sayt manzillari
// Funksiya sozlamasida "Verify JWT" o'chirilgan bo'lishi kerak (sayt ochiq forma yuboradi).

const DEFAULT_CHAT_ID = '-1004358454653'; // "Noila opa | PC-106 Toshkent shahar" guruhi
const DEFAULT_ORIGINS = 'https://munivar.uz,https://www.munivar.uz,https://shohjahon99.github.io,http://localhost:5180';

type Env = { BOT_TOKEN?: string; CHAT_ID?: string; ALLOWED_ORIGINS?: string };

export async function handle(req: Request, env: Env): Promise<Response> {
  const origin = req.headers.get('Origin') || '';
  const allowed = (env.ALLOWED_ORIGINS || DEFAULT_ORIGINS).split(',').map((s) => s.trim()).filter(Boolean);
  const okOrigin = allowed.includes(origin);
  const cors: Record<string, string> = {
    'Access-Control-Allow-Origin': okOrigin ? origin : allowed[0] || '',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, x-client-info',
    'Vary': 'Origin'
  };
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8' } });

  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (req.method !== 'POST') return json({ ok: false, error: 'method' }, 405);
  if (!okOrigin) return json({ ok: false, error: 'origin' }, 403);
  if (!env.BOT_TOKEN) return json({ ok: false, error: 'config' }, 500);

  // deno-lint-ignore no-explicit-any
  let data: any;
  try { data = await req.json(); } catch { return json({ ok: false, error: 'json' }, 400); }
  if (!data || typeof data !== 'object') return json({ ok: false, error: 'json' }, 400);

  // bot-spam tuzog'i
  if (data.website) return json({ ok: true });

  const clean = (v: unknown, max: number) => String(v ?? '').replace(/<[^>]*>/g, '').trim().slice(0, max);
  const name = clean(data.name, 80);
  const phone = clean(data.phone, 30);
  const lang = clean(data.lang, 5).toUpperCase();
  if (name.length < 2 || phone.replace(/\D/g, '').length < 7) return json({ ok: false, error: 'invalid' }, 422);

  const h = (s: unknown) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' } as Record<string, string>)[c]);
  const money = (n: unknown) => `${Math.round(+(n as number) || 0).toLocaleString('ru-RU').replace(/ |,/g, ' ')} so'm`;
  const time = new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' });
  let text: string;

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

  const send = (chatId: string | number) => fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true })
  });
  let tg = await send(env.CHAT_ID || DEFAULT_CHAT_ID);
  if (!tg.ok) {
    // guruh supergroup ga aylangan bo'lsa, Telegram yangi ID ni qaytaradi — o'sha ID ga qayta yuboramiz
    const err = await tg.json().catch(() => ({}));
    const newId = err.parameters && err.parameters.migrate_to_chat_id;
    if (newId) tg = await send(newId);
  }
  if (!tg.ok) return json({ ok: false, error: 'telegram' }, 502);
  return json({ ok: true });
}

// Supabase (Deno) da ishga tushirish
// deno-lint-ignore no-explicit-any
const D = (globalThis as any).Deno;
if (D && typeof D.serve === 'function') {
  D.serve((req: Request) => handle(req, {
    BOT_TOKEN: D.env.get('BOT_TOKEN'),
    CHAT_ID: D.env.get('CHAT_ID'),
    ALLOWED_ORIGINS: D.env.get('ALLOWED_ORIGINS')
  }));
}
