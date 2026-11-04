// MUNIVAR admin — bitta parol bilan kirish va mahsulotlarni Supabase Storage'ga saqlash.
// Mahsulotlar: storage bucket "munivar" → products.json (ochiq), rasmlar → products/*.webp
//
// Supabase → Edge Functions → Secrets:
//   ADMIN_PASSWORD — admin panel paroli (MAJBURIY)
// SUPABASE_URL va SUPABASE_SERVICE_ROLE_KEY ni Supabase o'zi beradi.
// Funksiya sozlamasida "Verify JWT" o'chirilgan bo'lishi kerak.

const BUCKET = 'munivar';
const DATA_PATH = 'products.json';
const IMG_PREFIX = 'products/';
const SESSION_HOURS = 12;
const DEFAULT_ORIGINS = 'https://munivar.uz,https://www.munivar.uz,https://munivar.vercel.app,https://shohjahon99.github.io,http://localhost:5180';

type Env = { ADMIN_PASSWORD?: string; SUPABASE_URL?: string; SUPABASE_SERVICE_ROLE_KEY?: string; ALLOWED_ORIGINS?: string };

const enc = new TextEncoder();
const b64url = (buf: ArrayBuffer | Uint8Array) =>
  btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

async function hmac(key: string, msg: string) {
  const k = await crypto.subtle.importKey('raw', enc.encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return b64url(await crypto.subtle.sign('HMAC', k, enc.encode(msg)));
}
// vaqtga bog'liq bo'lmagan taqqoslash
function safeEqual(a: string, b: string) {
  const x = enc.encode(a), y = enc.encode(b);
  let d = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) d |= (x[i] || 0) ^ (y[i] || 0);
  return d === 0;
}
// sessiya kaliti parol va service key'dan hosil bo'ladi — parol o'zgarsa, eski sessiyalar bekor
const sessionKey = (env: Env) => `${env.ADMIN_PASSWORD}::${env.SUPABASE_SERVICE_ROLE_KEY}`;
async function makeSession(env: Env) {
  const exp = String(Date.now() + SESSION_HOURS * 3600e3);
  return `${exp}.${await hmac(sessionKey(env), exp)}`;
}
async function checkSession(env: Env, tok: string) {
  const [exp, sig] = String(tok || '').split('.');
  if (!exp || !sig || +exp < Date.now()) return false;
  return safeEqual(sig, await hmac(sessionKey(env), exp));
}

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
  if (!env.ADMIN_PASSWORD || !env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return json({ ok: false, error: 'config' }, 500);

  // deno-lint-ignore no-explicit-any
  let data: any;
  try { data = await req.json(); } catch { return json({ ok: false, error: 'json' }, 400); }

  const storage = `${env.SUPABASE_URL}/storage/v1`;
  const auth = { Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`, apikey: env.SUPABASE_SERVICE_ROLE_KEY };
  const publicBase = `${storage}/object/public/${BUCKET}/`;

  /* ---------- kirish ---------- */
  if (data.action === 'login') {
    if (!safeEqual(String(data.password || ''), env.ADMIN_PASSWORD)) {
      await new Promise((r) => setTimeout(r, 900)); // parol tanlab ko'rishni sekinlashtirish
      return json({ ok: false, error: 'password' }, 401);
    }
    return json({ ok: true, token: await makeSession(env), publicBase });
  }

  // qolgan amallar uchun sessiya kerak
  const tok = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
  if (!(await checkSession(env, tok))) return json({ ok: false, error: 'session' }, 401);

  if (data.action === 'ping') return json({ ok: true, publicBase });

  /* ---------- saqlash: rasmlar + products.json ---------- */
  if (data.action === 'save') {
    const d = data.data;
    if (!d || !Array.isArray(d.products)) return json({ ok: false, error: 'invalid' }, 422);
    const images = Array.isArray(data.images) ? data.images : [];
    const del = (Array.isArray(data.delete) ? data.delete : []).map(String).filter((p: string) => p.startsWith(IMG_PREFIX) && !p.includes('..'));
    if (images.length > 4) return json({ ok: false, error: 'too_many' }, 422);

    // bucket bo'lmasa — yaratamiz (ochiq, faqat rasm va json)
    const b = await fetch(`${storage}/bucket/${BUCKET}`, { headers: auth });
    if (b.status !== 200) {
      const c = await fetch(`${storage}/bucket`, {
        method: 'POST', headers: { ...auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true, file_size_limit: 5 * 1024 * 1024, allowed_mime_types: ['image/webp', 'image/jpeg', 'image/png', 'application/json'] })
      });
      if (!c.ok && c.status !== 409) return json({ ok: false, error: 'bucket', detail: await c.text() }, 502);
    }

    const put = (path: string, body: BodyInit, type: string, cache: string) =>
      fetch(`${storage}/object/${BUCKET}/${path}`, { method: 'POST', headers: { ...auth, 'Content-Type': type, 'x-upsert': 'true', 'cache-control': cache }, body });

    for (const img of images) {
      const path = String(img.path || '');
      if (!path.startsWith(IMG_PREFIX) || path.includes('..') || !/\.(webp|jpe?g|png)$/i.test(path)) return json({ ok: false, error: 'path' }, 422);
      const bin = Uint8Array.from(atob(String(img.b64 || '')), (ch) => ch.charCodeAt(0));
      if (!bin.length || bin.length > 5 * 1024 * 1024) return json({ ok: false, error: 'image_size' }, 422);
      const r = await put(path, bin, img.type || 'image/webp', 'max-age=31536000');
      if (!r.ok) return json({ ok: false, error: 'upload', detail: await r.text() }, 502);
    }

    const r = await put(DATA_PATH, JSON.stringify(d, null, 2), 'application/json', 'no-cache, max-age=0');
    if (!r.ok) return json({ ok: false, error: 'upload', detail: await r.text() }, 502);

    if (del.length) {
      await fetch(`${storage}/object/${BUCKET}`, { method: 'DELETE', headers: { ...auth, 'Content-Type': 'application/json' }, body: JSON.stringify({ prefixes: del }) });
    }
    return json({ ok: true, publicBase });
  }

  return json({ ok: false, error: 'action' }, 400);
}

// Supabase (Deno) da ishga tushirish
// deno-lint-ignore no-explicit-any
const D = (globalThis as any).Deno;
if (D && typeof D.serve === 'function') {
  D.serve((req: Request) => handle(req, {
    ADMIN_PASSWORD: D.env.get('ADMIN_PASSWORD'),
    SUPABASE_URL: D.env.get('SUPABASE_URL'),
    SUPABASE_SERVICE_ROLE_KEY: D.env.get('SUPABASE_SERVICE_ROLE_KEY'),
    ALLOWED_ORIGINS: D.env.get('ALLOWED_ORIGINS')
  }));
}
