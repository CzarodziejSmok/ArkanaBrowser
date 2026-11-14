'use strict';
// Import danych z innych przeglądarek: zakładki, historia i ciasteczka. Bez zależności zewnętrznych:
// własny czytnik SQLite (tylko odczyt), automatyczne wykrywanie profili (Windows) i import z pliku zakładek HTML.
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFile } = require('child_process');

/* ---------- czytnik SQLite: tylko odczyt, UTF-8, z plikiem WAL i stronami przepełnienia ---------- */
const vi = (b, o) => { let v = 0; for (let i = 0; i < 8; i++) { const c = b[o + i]; v = v * 128 + (c & 127); if (!(c & 128)) return [v, i + 1]; } return [v * 256 + b[o + 8], 9]; };
const INTLEN = [0, 1, 2, 3, 4, 6, 8];
function parseCols(sql) {
  const body = sql.slice(sql.indexOf('(') + 1, sql.lastIndexOf(')')), parts = []; let d = 0, cur = '';
  for (const ch of body) { if (ch === '(') d++; if (ch === ')') d--; if (ch === ',' && d === 0) { parts.push(cur); cur = ''; } else cur += ch; }
  parts.push(cur);
  const cols = []; let ipk = -1;
  for (const p of parts) {
    const t = p.trim(); if (/^(primary\s+key|unique|check|foreign\s+key|constraint)\b/i.test(t)) continue;
    const m = /^(?:"([^"]+)"|`([^`]+)`|\[([^\]]+)\]|'([^']+)'|(\S+))\s*([\s\S]*)$/.exec(t); if (!m) continue;
    if (/\binteger\b[^,]*\bprimary\s+key\b/i.test(m[6])) ipk = cols.length;
    cols.push(m[1] || m[2] || m[3] || m[4] || m[5]);
  }
  return { cols, ipk };
}
class Sqlite {
  constructor(file) {
    this.fd = fs.openSync(file, 'r');
    try {
      const h = Buffer.alloc(100); fs.readSync(this.fd, h, 0, 100, 0);
      if (h.toString('latin1', 0, 15) !== 'SQLite format 3') throw new Error('To nie jest baza SQLite');
      this.ps = h.readUInt16BE(16) === 1 ? 65536 : h.readUInt16BE(16);
      this.usable = this.ps - h[20];
      this.wal = new Map();
      this._loadWal(file + '-wal');
      this.tables = {};
      this._walk(1, (rid, buf) => { const r = this._rec(buf); if (r[0] === 'table' && r[4]) this.tables[r[1]] = Object.assign({ root: r[3] }, parseCols(r[4])); });
    } catch (e) { this.close(); throw e; }
  }
  _loadWal(file) {
    let w; try { w = fs.readFileSync(file); } catch { return; }
    if (w.length < 32) return;
    const magic = w.readUInt32BE(0); if (magic !== 0x377f0682 && magic !== 0x377f0683) return;
    const ps = w.readUInt32BE(8), s1 = w.readUInt32BE(16), s2 = w.readUInt32BE(20); if (ps !== this.ps) return;
    let pend = new Map();
    for (let o = 32; o + 24 + ps <= w.length; o += 24 + ps) {
      if (w.readUInt32BE(o + 8) !== s1 || w.readUInt32BE(o + 12) !== s2) break;
      pend.set(w.readUInt32BE(o), Buffer.from(w.subarray(o + 24, o + 24 + ps)));
      if (w.readUInt32BE(o + 4) !== 0) { for (const [k, v] of pend) this.wal.set(k, v); pend = new Map(); }
    }
  }
  page(n) { const w = this.wal.get(n); if (w) return w; const b = Buffer.alloc(this.ps); fs.readSync(this.fd, b, 0, this.ps, (n - 1) * this.ps); return b; }
  _payload(b, c, pl) {
    const U = this.usable, X = U - 35; if (pl <= X) return b.subarray(c, c + pl);
    const M = Math.floor((U - 12) * 32 / 255) - 23, K = M + ((pl - M) % (U - 4)), local = K <= X ? K : M;
    const parts = [b.subarray(c, c + local)]; let next = b.readUInt32BE(c + local), rem = pl - local;
    while (next && rem > 0) { const ob = this.page(next), take = Math.min(rem, U - 4); parts.push(ob.subarray(4, 4 + take)); rem -= take; next = ob.readUInt32BE(0); }
    return Buffer.concat(parts);
  }
  _walk(pg, cb) {
    const b = this.page(pg), o = pg === 1 ? 100 : 0, t = b[o], n = b.readUInt16BE(o + 3);
    if (t === 0x0d) { for (let i = 0; i < n; i++) { let c = b.readUInt16BE(o + 8 + i * 2); const [pl, l1] = vi(b, c), [rid, l2] = vi(b, c + l1); c += l1 + l2; cb(rid, this._payload(b, c, pl)); } }
    else if (t === 0x05) { for (let i = 0; i < n; i++) this._walk(b.readUInt32BE(b.readUInt16BE(o + 12 + i * 2)), cb); this._walk(b.readUInt32BE(o + 8), cb); }
  }
  _rec(buf) {
    const [hs, n] = vi(buf, 0), types = []; let p = n;
    while (p < hs) { const [t, l] = vi(buf, p); types.push(t); p += l; }
    p = hs; const out = [];
    for (const t of types) {
      let v;
      if (t === 0) v = null;
      else if (t <= 6) { const len = INTLEN[t]; v = len === 8 ? Number(buf.readBigInt64BE(p)) : buf.readIntBE(p, len); p += len; }
      else if (t === 7) { v = buf.readDoubleBE(p); p += 8; }
      else if (t === 8) v = 0; else if (t === 9) v = 1;
      else if (t >= 12) { const len = t % 2 ? (t - 13) / 2 : (t - 12) / 2; v = t % 2 ? buf.toString('utf8', p, p + len) : Buffer.from(buf.subarray(p, p + len)); p += len; }
      out.push(v);
    }
    return out;
  }
  has(name) { return !!this.tables[name]; }
  columns(name) { return this.tables[name] ? this.tables[name].cols : []; }
  rows(name, each) {
    const T = this.tables[name]; if (!T) throw new Error('Brak tabeli ' + name);
    this._walk(T.root, (rid, buf) => { const r = this._rec(buf), o = {}; if (T.ipk >= 0 && r[T.ipk] == null) r[T.ipk] = rid; T.cols.forEach((c, i) => { o[c] = r[i] === undefined ? null : r[i]; }); each(o); });
  }
  close() { try { if (this.fd != null) fs.closeSync(this.fd); } catch { /* */ } this.fd = null; }
}

// kopia bazy (i pliku WAL) do katalogu tymczasowego: baza jest zablokowana, gdy przeglądarka działa
function snap(file) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'arkana-imp-')), dst = path.join(tmp, path.basename(file));
  try { fs.copyFileSync(file, dst); } catch (e) { fs.rmSync(tmp, { recursive: true, force: true }); const err = new Error('LOCKED'); err.code = 'LOCKED'; err.cause = e; throw err; }
  if (fs.existsSync(file + '-wal')) { try { fs.copyFileSync(file + '-wal', dst + '-wal'); } catch { /* */ } }
  return { dst, done: () => fs.rmSync(tmp, { recursive: true, force: true }) };
}
function withDb(file, fn) {
  const s = snap(file); let db;
  try { db = new Sqlite(s.dst); return fn(db); } finally { if (db) db.close(); s.done(); }
}

/* ---------- wykrywanie przeglądarek i profili (Windows) ---------- */
const W = process.platform === 'win32';
const readJson = f => JSON.parse(fs.readFileSync(f, 'utf8').replace(/^\uFEFF/, ''));
const first = (...fs_) => fs_.find(f => fs.existsSync(f)) || '';
const isDir = p => { try { return fs.statSync(p).isDirectory(); } catch { return false; } };
function chromiumBrowsers(env) {
  const L = env.LOCALAPPDATA || '', A = env.APPDATA || '', j = path.join;
  return [
    { b: 'chrome', name: 'Google Chrome', roots: [j(L, 'Google', 'Chrome', 'User Data')] },
    { b: 'chromebeta', name: 'Google Chrome Beta', roots: [j(L, 'Google', 'Chrome Beta', 'User Data')] },
    { b: 'edge', name: 'Microsoft Edge', roots: [j(L, 'Microsoft', 'Edge', 'User Data')] },
    { b: 'brave', name: 'Brave', roots: [j(L, 'BraveSoftware', 'Brave-Browser', 'User Data')] },
    { b: 'vivaldi', name: 'Vivaldi', roots: [j(L, 'Vivaldi', 'User Data')] },
    { b: 'chromium', name: 'Chromium', roots: [j(L, 'Chromium', 'User Data')] },
    { b: 'yandex', name: 'Yandex Browser', roots: [j(L, 'Yandex', 'YandexBrowser', 'User Data')] },
    { b: 'opera', name: 'Opera', roots: [j(A, 'Opera Software', 'Opera Stable'), j(L, 'Opera Software', 'Opera Stable')] },
    { b: 'operagx', name: 'Opera GX', roots: [j(A, 'Opera Software', 'Opera GX Stable'), j(L, 'Opera Software', 'Opera GX Stable')] },
  ];
}
// folder główny (Opera trzyma dane bezpośrednio w nim) oraz podfoldery Default i Profile N (Chrome, Edge, nowsze wersje Opery)
function profileDirs(root) {
  const out = [root];
  try { for (const d of fs.readdirSync(root)) if (d === 'Default' || /^Profile \d+$/.test(d)) out.push(path.join(root, d)); } catch { /* */ }
  return out;
}
function chromiumProfile(br, rootDir, dir, label) {
  const f = n => path.join(dir, n), bm = f('Bookmarks'), hi = f('History'), wd = f('Web Data'), pf = f('Preferences');
  const ck = first(path.join(dir, 'Network', 'Cookies'), f('Cookies')), ls = first(f('Local State'), path.join(rootDir, 'Local State'), path.join(path.dirname(dir), 'Local State'));
  if (!fs.existsSync(bm) && !fs.existsSync(hi) && !ck) return null;
  return { id: br.b + '|' + dir, kind: 'chromium', browser: br.name, profile: label, dir, files: { bookmarks: fs.existsSync(bm) ? bm : '', history: fs.existsSync(hi) ? hi : '', cookies: ck, localState: ls, webData: fs.existsSync(wd) ? wd : '', preferences: fs.existsSync(pf) ? pf : '' },
    has: { bookmarks: fs.existsSync(bm), history: fs.existsSync(hi), cookies: !!ck, engine: fs.existsSync(wd) || fs.existsSync(pf) } };
}
function detectChromium(env) {
  const out = [], seen = new Set();
  for (const br of chromiumBrowsers(env)) {
    for (const root of br.roots) {
      if (!isDir(root)) continue;
      let names = {}; try { const c = readJson(path.join(root, 'Local State')).profile.info_cache; for (const k in c) names[k] = c[k].name || ''; } catch { /* */ }
      for (const d of profileDirs(root)) {
        if (seen.has(d)) continue; const base = path.basename(d);
        const p = chromiumProfile(br, root, d, d === root ? '' : (names[base] && names[base] !== base ? names[base] + ' (' + base + ')' : base));
        if (p) { seen.add(d); out.push(p); }
      }
    }
  }
  return out;
}
function firefoxProfile(name, dir, label, id) {
  const pl = path.join(dir, 'places.sqlite'), ck = path.join(dir, 'cookies.sqlite'), se = path.join(dir, 'search.json.mozlz4');
  if (!fs.existsSync(pl) && !fs.existsSync(ck) && !fs.existsSync(se)) return null;
  return { id, kind: 'firefox', browser: name, profile: label, dir, files: { bookmarks: fs.existsSync(pl) ? pl : '', history: fs.existsSync(pl) ? pl : '', cookies: fs.existsSync(ck) ? ck : '', searchJson: fs.existsSync(se) ? se : '' },
    has: { bookmarks: fs.existsSync(pl), history: fs.existsSync(pl), cookies: fs.existsSync(ck), engine: fs.existsSync(se) } };
}
function detectFirefox(env) {
  const base = path.join(env.APPDATA || '', 'Mozilla', 'Firefox'), out = [];
  let ini = ''; try { ini = fs.readFileSync(path.join(base, 'profiles.ini'), 'utf8'); } catch { return out; }
  const secs = []; let cur = null;
  for (const line of ini.split(/\r?\n/)) { const m = /^\[(.+)\]$/.exec(line.trim()); if (m) { cur = { n: m[1] }; secs.push(cur); } else if (cur) { const kv = /^([^=]+)=(.*)$/.exec(line.trim()); if (kv) cur[kv[1]] = kv[2]; } }
  for (const s of secs) {
    if (!/^Profile\d+$/.test(s.n) || !s.Path) continue;
    const dir = s.IsRelative === '0' ? s.Path : path.join(base, s.Path), p = firefoxProfile('Mozilla Firefox', dir, s.Name || path.basename(dir), 'firefox|' + dir);
    if (p) out.push(p);
  }
  return out;
}
function detect(env, win) { if (!(win === undefined ? W : win)) return []; env = env || process.env; return [].concat(detectChromium(env), detectFirefox(env)); }
// ręcznie wskazany folder: profil Firefoksa, profil Chromium albo folder nadrzędny (do dwóch poziomów w dół)
function guessName(dir) {
  const d = dir.toLowerCase();
  return /opera gx/.test(d) ? 'Opera GX' : /opera/.test(d) ? 'Opera' : /edge/.test(d) ? 'Microsoft Edge' : /chrome/.test(d) ? 'Google Chrome' : /brave/.test(d) ? 'Brave' : /vivaldi/.test(d) ? 'Vivaldi' : /yandex/.test(d) ? 'Yandex Browser' : /firefox|mozilla/.test(d) ? 'Mozilla Firefox' : 'Inna przeglądarka';
}
function profilesFromFolder(dir, depth) {
  depth = depth === undefined ? 2 : depth; if (!isDir(dir)) return [];
  const ff = firefoxProfile(guessName(dir), dir, path.basename(dir), 'dir|' + dir); if (ff) return [ff];
  const br = { b: 'dir', name: guessName(dir) }, out = [];
  for (const d of profileDirs(dir)) { const p = chromiumProfile(br, dir, d, d === dir ? path.basename(dir) : path.basename(d)); if (p) out.push(p); }
  if (!out.length && depth > 0) { let subs = []; try { subs = fs.readdirSync(dir).map(n => path.join(dir, n)).filter(isDir); } catch { /* */ } for (const sd of subs.slice(0, 40)) out.push(...profilesFromFolder(sd, depth - 1)); }
  return out;
}
const publicInfo = p => ({ id: p.id, kind: p.kind, browser: p.browser, profile: p.profile, has: p.has });
const findProfile = id => id.startsWith('dir|') ? profilesFromFolder(id.slice(4), 0).find(p => p.id === id) : detect().find(p => p.id === id);

/* ---------- zakładki ---------- */
const isHttp = u => /^https?:\/\//i.test(u || '');
function chromiumBookmarks(file) {
  const j = readJson(file), roles = { bookmark_bar: 'bar', other: 'other', synced: 'mobile' }, out = [];
  const conv = n => n.type === 'folder' ? { t: 'f', name: n.name || '', children: (n.children || []).map(conv).filter(Boolean) } : (isHttp(n.url) ? { t: 'u', name: n.name || '', url: n.url } : null);
  for (const k of Object.keys(j.roots || {})) { const r = j.roots[k]; if (!r || !roles[k] || !r.children) continue; out.push({ role: roles[k], name: r.name || '', children: r.children.map(conv).filter(Boolean) }); }
  return out;
}
function firefoxBookmarks(file) {
  return withDb(file, db => {
    const places = new Map(), nodes = [];
    db.rows('moz_places', r => { places.set(r.id, r.url); });
    db.rows('moz_bookmarks', r => { nodes.push(r); });
    const kids = new Map(); for (const n of nodes) { if (!kids.has(n.parent)) kids.set(n.parent, []); kids.get(n.parent).push(n); }
    for (const l of kids.values()) l.sort((a, b) => a.position - b.position);
    const conv = n => {
      if (n.type === 2) return { t: 'f', name: n.title || '', children: (kids.get(n.id) || []).map(conv).filter(Boolean) };
      if (n.type === 1) { const u = places.get(n.fk); return isHttp(u) ? { t: 'u', name: n.title || '', url: u } : null; }
      return null;
    };
    const roles = { menu________: 'menu', toolbar_____: 'bar', unfiled_____: 'other', mobile______: 'mobile' }, out = [];
    for (const n of nodes) if (n.type === 2 && roles[n.guid]) out.push({ role: roles[n.guid], name: n.title || '', children: (kids.get(n.id) || []).map(conv).filter(Boolean) });
    return out;
  });
}
const ent = s => s.replace(/&(#x?[0-9a-f]+|amp|lt|gt|quot|apos|nbsp);/gi, (m, e) => { const l = e.toLowerCase(); if (l === 'amp') return '&'; if (l === 'lt') return '<'; if (l === 'gt') return '>'; if (l === 'quot') return '"'; if (l === 'apos') return "'"; if (l === 'nbsp') return ' '; const c = l[1] === 'x' ? parseInt(l.slice(2), 16) : parseInt(l.slice(1), 10); try { return String.fromCodePoint(c); } catch { return m; } }).replace(/<[^>]+>/g, '').trim();
function netscapeBookmarks(html) {
  const root = { t: 'f', name: '', children: [] }, st = [root]; let pend = null;
  const re = /<DL[^>]*>|<\/DL>|<H3[^>]*>([\s\S]*?)<\/H3>|<A\s[^>]*?HREF\s*=\s*"([^"]*)"[^>]*>([\s\S]*?)<\/A>/gi; let m;
  while ((m = re.exec(html))) {
    const tok = m[0].slice(0, 3).toUpperCase();
    if (tok === '<DL') { if (pend) { st[st.length - 1].children.push(pend); st.push(pend); pend = null; } }
    else if (tok === '</D') { if (st.length > 1) st.pop(); }
    else if (tok === '<H3') pend = { t: 'f', name: ent(m[1]), children: [] };
    else { const u = ent(m[2]); if (isHttp(u)) st[st.length - 1].children.push({ t: 'u', name: ent(m[3]), url: u }); }
  }
  const out = [], loose = root.children.filter(c => c.t === 'u');
  if (loose.length) out.push({ role: 'html', name: '', children: loose });
  for (const c of root.children) if (c.t === 'f') out.push({ role: 'html', name: c.name, children: c.children });
  return out;
}

/* ---------- historia ---------- */
const HLIMIT = 30000, WK = 11644473600000;
const finishHist = a => a.sort((x, y) => y.t - x.t).slice(0, HLIMIT);
function chromiumHistory(file) {
  return withDb(file, db => { const out = []; db.rows('urls', r => { if (r.hidden || !isHttp(r.url) || !r.last_visit_time) return; out.push({ u: r.url, ti: r.title || '', t: Math.round(r.last_visit_time / 1000 - WK), n: r.visit_count || 1 }); }); return finishHist(out); });
}
function firefoxHistory(file) {
  return withDb(file, db => { const out = []; db.rows('moz_places', r => { if (r.hidden || !isHttp(r.url) || !r.last_visit_date) return; out.push({ u: r.url, ti: r.title || '', t: Math.round(r.last_visit_date / 1000), n: r.visit_count || 1 }); }); return finishHist(out); });
}

/* ---------- ciasteczka ---------- */
function dpapiKey(localState) {
  return new Promise((res, rej) => {
    let k; try { k = Buffer.from(readJson(localState).os_crypt.encrypted_key, 'base64'); } catch (e) { return rej(e); }
    if (k.toString('latin1', 0, 5) !== 'DPAPI') return rej(new Error('Nieznany format klucza'));
    const b64 = k.subarray(5).toString('base64');
    const script = "Add-Type -AssemblyName System.Security; [Convert]::ToBase64String([System.Security.Cryptography.ProtectedData]::Unprotect([Convert]::FromBase64String('" + b64 + "'),$null,[System.Security.Cryptography.DataProtectionScope]::CurrentUser))";
    execFile('powershell.exe', ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-Command', script], { windowsHide: true, timeout: 30000 }, (e, out) => e ? rej(e) : res(Buffer.from(String(out).trim(), 'base64')));
  });
}
// v10/v11: AES-256-GCM; od Chrome 130 wartość zaczyna się od skrótu SHA-256 domeny. Inne prefiksy (v20, szyfrowanie aplikacyjne) nie są obsługiwane.
function decryptCookie(enc, key, host) {
  if (!enc || !enc.length) return '';
  const p = enc.toString('latin1', 0, 3); if (p !== 'v10' && p !== 'v11') return undefined;
  const d = crypto.createDecipheriv('aes-256-gcm', key, enc.subarray(3, 15)); d.setAuthTag(enc.subarray(enc.length - 16));
  let pt = Buffer.concat([d.update(enc.subarray(15, enc.length - 16)), d.final()]);
  if (pt.length >= 32 && pt.subarray(0, 32).equals(crypto.createHash('sha256').update(host).digest())) pt = pt.subarray(32);
  return pt.toString('utf8');
}
const SS_CH = { '-1': 'unspecified', 0: 'no_restriction', 1: 'lax', 2: 'strict' };
function chromiumCookies(file, key) {
  return withDb(file, db => {
    const list = []; let unsupported = 0, failed = 0, expired = 0, now = Date.now() / 1000;
    db.rows('cookies', r => {
      if (r.top_frame_site_key) return;
      let v = r.value;
      if (!v) { try { v = decryptCookie(r.encrypted_value, key, r.host_key); } catch { failed++; return; } if (v === undefined) { unsupported++; return; } }
      const persistent = r.has_expires !== undefined ? !!r.has_expires : !!r.expires_utc, exp = persistent && r.expires_utc ? r.expires_utc / 1e6 - WK / 1000 : 0;
      if (persistent && exp && exp < now) { expired++; return; }
      list.push({ host: r.host_key, name: r.name, value: v, path: r.path || '/', secure: !!r.is_secure, httpOnly: !!r.is_httponly, sameSite: SS_CH[r.samesite] || 'unspecified', exp });
    });
    return { list, unsupported, failed, expired };
  });
}
function firefoxCookies(file) {
  return withDb(file, db => {
    const list = []; let expired = 0, now = Date.now() / 1000;
    db.rows('moz_cookies', r => {
      if (r.originAttributes) return;
      let exp = r.expiry || 0; if (exp > 1e11) exp /= 1000;
      if (exp && exp < now) { expired++; return; }
      list.push({ host: r.host, name: r.name, value: r.value, path: r.path || '/', secure: !!r.isSecure, httpOnly: !!r.isHttpOnly, sameSite: r.sameSite === 1 ? 'lax' : r.sameSite === 2 ? 'strict' : 'unspecified', exp });
    });
    return { list, unsupported: 0, failed: 0, expired };
  });
}
// ciasteczka bez daty ważności (sesyjne) dostają 30 dni, żeby zalogowane sesje przetrwały restart
async function applyCookies(list, sessions) {
  const now = Date.now() / 1000; let ok = 0, bad = 0;
  const CL = /(^|\.)(claude\.ai|anthropic\.com)$/i;
  const one = async (c, ses) => {
    const d = { url: (c.secure ? 'https://' : 'http://') + c.host.replace(/^\./, '') + (c.path || '/'), name: c.name, value: c.value, path: c.path || '/', secure: c.secure, httpOnly: c.httpOnly, sameSite: c.sameSite === 'no_restriction' && !c.secure ? 'unspecified' : c.sameSite, expirationDate: c.exp > 0 ? c.exp : now + 30 * 86400 };
    if (c.host.startsWith('.')) d.domain = c.host;
    await ses.cookies.set(d);
  };
  for (let i = 0; i < list.length; i += 50) {
    await Promise.all(list.slice(i, i + 50).map(async c => {
      try { for (const ses of sessions.filter(s => s.all || CL.test(c.host.replace(/^\./, ''))).map(s => s.ses)) await one(c, ses); ok++; } catch { bad++; }
    }));
  }
  return { ok, bad };
}

/* ---------- domyślna wyszukiwarka ---------- */
const PRESETS = [['google', /(^|\.)google\.[a-z.]+$/], ['bing', /(^|\.)bing\.com$/], ['duckduckgo', /(^|\.)duckduckgo\.com$/], ['brave', /(^|\.)search\.brave\.com$/], ['ecosia', /(^|\.)ecosia\.org$/], ['yahoo', /(^|\.)search\.yahoo\.com$/], ['qwant', /(^|\.)qwant\.com$/], ['yandex', /(^|\.)yandex\.[a-z.]+$/]];
const FFIDS = { google: 'google', bing: 'bing', ddg: 'duckduckgo', duckduckgo: 'duckduckgo', brave: 'brave', ecosia: 'ecosia', qwant: 'qwant', yandex: 'yandex', yahoo: 'yahoo' };
function presetOf(url) { try { const h = new URL(url.replace('%s', 'x')).hostname; const p = PRESETS.find(x => x[1].test(h)); return p ? p[0] : ''; } catch { return ''; } }
// szablon wyszukiwania Chromium/Firefoksa ({searchTerms}) -> adres z %s; null, gdy nie da się go bezpiecznie przełożyć
function normalizeEngine(u, name) {
  if (!u || typeof u !== 'string') return null;
  u = u.replace(/\{google:baseURL\}/g, 'https://www.google.com/').replace(/\{searchTerms\}/g, '%s').replace(/\{inputEncoding\}/g, 'UTF-8').replace(/\{google:[A-Za-z]+\}/g, '')
    .replace(/([?&])[^=&{}]*=\{[^{}]*\}/g, '$1').replace(/\?&+/g, '?').replace(/&{2,}/g, '&').replace(/[?&]+$/, '');
  if (/[{}]/.test(u) || !/^https?:\/\//i.test(u) || u.split('%s').length !== 2) return null;
  return { name: name || '', url: u, preset: presetOf(u) };
}
function chromiumEngine(f) {
  let url = '', name = '';
  if (f.webData) {
    withDb(f.webData, db => {
      if (!db.has('meta') || !db.has('keywords')) return; let id = null;
      db.rows('meta', r => { if (r.key === 'Default Search Provider ID') id = Number(r.value); });
      if (id) db.rows('keywords', r => { if (r.id === id) { url = r.url; name = r.short_name; } });
    });
  }
  if (!url && f.preferences) { try { const t = (readJson(f.preferences).default_search_provider_data || {}).template_url_data; if (t) { url = t.url; name = t.short_name; } } catch { /* */ } }
  return normalizeEngine(url, name);
}
// Firefox: search.json.mozlz4 = nagłówek "mozLz40\0", rozmiar (4 B LE) i blok LZ4
function lz4Block(src, size) {
  const dst = Buffer.alloc(size); let s = 0, d = 0;
  while (s < src.length) {
    const tok = src[s++]; let ll = tok >> 4;
    if (ll === 15) { let b; do { b = src[s++]; ll += b; } while (b === 255); }
    if (d + ll > size || s + ll > src.length) throw new Error('Uszkodzony blok LZ4');
    src.copy(dst, d, s, s + ll); s += ll; d += ll; if (s >= src.length) break;
    const off = src.readUInt16LE(s); s += 2; let ml = tok & 15;
    if (ml === 15) { let b; do { b = src[s++]; ml += b; } while (b === 255); }
    ml += 4; if (!off || off > d || d + ml > size) throw new Error('Uszkodzony blok LZ4');
    for (let i = 0; i < ml; i++) { dst[d] = dst[d - off]; d++; }
  }
  return dst;
}
function readMozlz4(file) {
  const b = fs.readFileSync(file); if (b.toString('latin1', 0, 8) !== 'mozLz40\0') throw new Error('Nieznany format pliku');
  return JSON.parse(lz4Block(b.subarray(12), b.readUInt32LE(8)).toString('utf8'));
}
function firefoxEngine(f) {
  const j = readMozlz4(f.searchJson), m = j.metaData || {}, id = m.defaultEngineId || '', cur = m.current || '';
  const e = (j.engines || []).find(x => (id && x.id === id) || (!id && cur && x._name === cur));
  const key = String(id || cur || (e && (e.id || e._name)) || '').toLowerCase().split('@')[0].replace(/[^a-z]/g, '');
  const hit = Object.keys(FFIDS).find(k => key === k || key.startsWith(k));
  if (e && !e._isAppProvided && e._urls) {
    const u = e._urls.find(x => !x.rels || !x.rels.length || x.rels.includes('searchform') === false) || e._urls[0];
    if (u && u.template && (!u.method || u.method === 'GET')) {
      let url = u.template; const ps = (u.params || []).filter(p => !p.purpose || p.purpose === 'searchbar' || p.purpose === 'keyword').map(p => encodeURIComponent(p.name) + '=' + p.value);
      if (ps.length) url += (url.includes('?') ? '&' : '?') + ps.join('&');
      const n = normalizeEngine(url, e._name); if (n) return n;
    }
  }
  if (hit) return { name: (e && e._name) || hit, url: '', preset: FFIDS[hit] };
  return null;
}

/* ---------- operacje wysokiego poziomu ---------- */
const errCode = e => e && e.code === 'LOCKED' ? 'locked' : String((e && e.message) || e);
async function run(id, what, deps) {
  const p = findProfile(id); if (!p) return { ok: false, err: 'notfound' };
  const out = { ok: true, errors: {} }, f = p.files;
  if (what.bookmarks && p.has.bookmarks) { try { out.bookmarks = p.kind === 'firefox' ? firefoxBookmarks(f.bookmarks) : chromiumBookmarks(f.bookmarks); } catch (e) { out.errors.bookmarks = errCode(e); } }
  if (what.history && p.has.history) { try { out.history = p.kind === 'firefox' ? firefoxHistory(f.history) : chromiumHistory(f.history); } catch (e) { out.errors.history = errCode(e); } }
  if (what.engine && p.has.engine) { try { out.engine = p.kind === 'firefox' ? firefoxEngine(f) : chromiumEngine(f); } catch (e) { out.errors.engine = errCode(e); } }
  if (what.cookies && p.has.cookies) {
    try {
      let r; if (p.kind === 'firefox') r = firefoxCookies(f.cookies);
      else { if (!f.localState) throw new Error('Brak pliku Local State'); r = chromiumCookies(f.cookies, await dpapiKey(f.localState)); }
      const a = await applyCookies(r.list, [{ ses: deps.session.defaultSession, all: true }, { ses: deps.session.fromPartition('persist:claude'), all: false }]);
      out.cookies = { imported: a.ok, skipped: a.bad + r.failed + r.expired + r.unsupported, unsupported: r.unsupported };
    } catch (e) { out.errors.cookies = errCode(e); }
  }
  return out;
}
function fromHtml(file) {
  try { return { ok: true, bookmarks: netscapeBookmarks(fs.readFileSync(file, 'utf8')) }; } catch (e) { return { ok: false, err: errCode(e) }; }
}

module.exports = { detect: () => detect().map(publicInfo), fromFolder: dir => profilesFromFolder(dir).map(publicInfo), run, fromHtml, _t: { profilesFromFolder, normalizeEngine, chromiumEngine, firefoxEngine, lz4Block, readMozlz4, presetOf, Sqlite, withDb, decryptCookie, chromiumBookmarks, firefoxBookmarks, netscapeBookmarks, chromiumHistory, firefoxHistory, chromiumCookies, firefoxCookies, applyCookies, detect } };
