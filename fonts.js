'use strict';
// Czcionki interfejsu (v49.9): (1) lista czcionek zainstalowanych w systemie, odczytana z plików czcionek (Windows: C:\Windows\Fonts i czcionki zainstalowane
// tylko dla użytkownika; macOS i Linux: ich standardowe foldery), (2) czcionki dodane do samej przeglądarki (kopiowane do folderu danych Arkany, system
// Windows pozostaje nietknięty). Nazwy rodzin czytamy z tabeli „name” plików TTF/OTF/TTC, więc lista nie zależy od wbudowanej listy znanych nazw.
// Proces główny nie przyjmuje od okna żadnych ścieżek: pliki dodanych czcionek są identyfikowane własnym identyfikatorem (hex + rozszerzenie).
const fs = require('fs'), path = require('path');
const SFNT = new Set([0x00010000, 0x4F54544F, 0x74727565]);   // 0x00010000 = TrueType, 'OTTO' = CFF, 'true' = stary Apple
const TTC = 0x74746366;                                       // 'ttcf'
const EXT_SYS = /\.(ttf|otf|ttc|otc)$/i, EXT_USER = /\.(ttf|otf|ttc|otc|woff|woff2)$/i, MAX_FILE = 40 * 1024 * 1024, MAX_USER = 60;

function decodeName(buf, off, len, platform) {
  if (off < 0 || len < 0 || off + len > buf.length) return '';
  if (platform === 3 || platform === 0) { const b = Buffer.from(buf.subarray(off, off + len)); if (b.length % 2) return ''; b.swap16(); return b.toString('utf16le').replace(/\0/g, '').trim(); }
  if (platform === 1) return buf.subarray(off, off + len).toString('latin1').replace(/\0/g, '').trim();
  return '';
}
// Rodziny z tabeli „name” (bufor to sama tabela): ID 1 (rodzina), ID 16 (rodzina typograficzna). Z każdego ID bierzemy angielską nazwę, a gdy jej nie ma – pierwszą.
function parseNameTable(buf) {
  try {
    if (!buf || buf.length < 6) return [];
    const count = buf.readUInt16BE(2), strOff = buf.readUInt16BE(4), best = {};
    for (let i = 0; i < count; i++) {
      const o = 6 + i * 12; if (o + 12 > buf.length) break;
      const plat = buf.readUInt16BE(o), lang = buf.readUInt16BE(o + 4), id = buf.readUInt16BE(o + 6), len = buf.readUInt16BE(o + 8), off = buf.readUInt16BE(o + 10);
      if (id !== 1 && id !== 16) continue;
      const s = decodeName(buf, strOff + off, len, plat); if (!s) continue;
      const rank = (plat === 3 && lang === 0x409) ? 3 : (plat === 3 ? 2 : (plat === 1 && lang === 0 ? 2 : 1));
      if (!best[id] || rank > best[id].rank) best[id] = { s, rank };
    }
    return [...new Set([best[16] && best[16].s, best[1] && best[1].s].filter(Boolean))];
  } catch { return []; }
}
// Rodziny z jednego bufora sfnt (cały plik albo jego początek obejmujący tabelę katalogową i „name”); off = początek czcionki w pliku (dla TTC).
function sfntFamilies(file, off, readAt) {
  const head = readAt(off, 12); if (!head || head.length < 12 || !SFNT.has(head.readUInt32BE(0))) return [];
  const n = head.readUInt16BE(4); if (!(n > 0 && n < 200)) return [];
  const dir = readAt(off + 12, n * 16); if (!dir || dir.length < n * 16) return [];
  for (let i = 0; i < n; i++) {
    if (dir.toString('latin1', i * 16, i * 16 + 4) !== 'name') continue;
    const to = dir.readUInt32BE(i * 16 + 8), tl = dir.readUInt32BE(i * 16 + 12); if (!(tl > 0 && tl < 4 * 1024 * 1024)) return [];
    return parseNameTable(readAt(to, tl));
  }
  return [];
}
function fileFamilies(file) {
  let fd = -1;
  try {
    fd = fs.openSync(file, 'r'); const size = fs.fstatSync(fd).size; if (size < 16 || size > MAX_FILE) return [];
    const readAt = (pos, len) => { if (pos < 0 || len < 0 || pos + len > size) return null; const b = Buffer.alloc(len); const r = fs.readSync(fd, b, 0, len, pos); return r === len ? b : b.subarray(0, r); };
    const h = readAt(0, 12); if (!h) return [];
    if (h.readUInt32BE(0) === TTC) {
      const num = h.readUInt32BE(8); if (!(num > 0 && num < 64)) return [];
      const offs = readAt(12, num * 4), out = new Set(); if (!offs || offs.length < num * 4) return [];
      for (let i = 0; i < num; i++) for (const f of sfntFamilies(file, offs.readUInt32BE(i * 4), readAt)) out.add(f);
      return [...out];
    }
    return sfntFamilies(file, 0, readAt);
  } catch { return []; } finally { if (fd >= 0) try { fs.closeSync(fd); } catch {} }
}
function systemDirs(env = process.env, platform = process.platform, home = require('os').homedir()) {
  if (platform === 'win32') {
    const win = env.WINDIR || env.SystemRoot || 'C:\\Windows', local = env.LOCALAPPDATA || path.join(home, 'AppData', 'Local');
    return [path.join(win, 'Fonts'), path.join(local, 'Microsoft', 'Windows', 'Fonts')];
  }
  if (platform === 'darwin') return ['/System/Library/Fonts', '/Library/Fonts', path.join(home, 'Library', 'Fonts')];
  return ['/usr/share/fonts', '/usr/local/share/fonts', path.join(home, '.fonts'), path.join(home, '.local', 'share', 'fonts')];
}
function walk(dir, depth, out, cap) {
  if (depth < 0 || out.length >= cap) return;
  let ents; try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of ents) {
    if (out.length >= cap) return; const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, depth - 1, out, cap); else if (EXT_SYS.test(e.name)) out.push(p);
  }
}
const tick = () => new Promise(r => setImmediate(r));
// Lista nazw rodzin zainstalowanych w systemie (bez powtórzeń, posortowana). Odczyt co kilkadziesiąt plików oddaje sterowanie, żeby proces główny nie zamarzał.
async function listSystem(dirs = systemDirs()) {
  const files = []; for (const d of dirs) walk(d, 4, files, 8000);
  const set = new Set(); let n = 0;
  for (const f of files) { for (const fam of fileFamilies(f)) if (fam && !/^[.@]/.test(fam)) set.add(fam); if (++n % 40 === 0) await tick(); }
  return [...set].sort((a, b) => a.localeCompare(b));
}

// ---- czcionki dodane do przeglądarki ----
function store(baseDir) {
  const dir = path.join(baseDir, 'fonts'), man = path.join(dir, 'fonts.json');
  const load = () => { try { const j = JSON.parse(fs.readFileSync(man, 'utf8')); return Array.isArray(j) ? j.filter(x => x && /^[0-9a-f]{16}\.(ttf|otf|ttc|otc|woff|woff2)$/i.test(x.file || '') && typeof x.family === 'string') : []; } catch { return []; } };
  const save = list => { fs.mkdirSync(dir, { recursive: true }); const tmp = man + '.tmp'; fs.writeFileSync(tmp, JSON.stringify(list)); fs.renameSync(tmp, man); };
  const publicList = () => load().map(x => ({ id: x.file, family: x.family, name: x.name || x.family }));
  const familyOf = (src, base) => {
    if (/\.(woff2?)$/i.test(src)) return [base];   // WOFF/WOFF2 mają skompresowane tabele: nazwą jest nazwa pliku
    const f = fileFamilies(src); return f.length ? f : [base];
  };
  // Dodaje pliki (ścieżki wskazał użytkownik w oknie wyboru, nie strona). Zwraca { added: [...], skipped: [{name, why}] }.
  function add(paths) {
    const list = load(), added = [], skipped = [];
    for (const src of paths || []) {
      const name = path.basename(String(src)), base = name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim() || 'Czcionka';
      try {
        if (!EXT_USER.test(name)) { skipped.push({ name, why: 'format' }); continue; }
        const st = fs.statSync(src); if (!st.isFile() || st.size < 16 || st.size > MAX_FILE) { skipped.push({ name, why: 'rozmiar' }); continue; }
        if (list.length >= MAX_USER) { skipped.push({ name, why: 'limit' }); continue; }
        const fams = familyOf(src, base), family = fams[0], ext = path.extname(name).toLowerCase();
        if (list.some(x => x.family.toLowerCase() === family.toLowerCase() && x.size === st.size)) { skipped.push({ name, why: 'jest' }); continue; }   // ten sam plik już dodany (ta sama rodzina i rozmiar)
        const file = require('crypto').randomBytes(8).toString('hex') + ext;
        fs.mkdirSync(dir, { recursive: true }); fs.copyFileSync(src, path.join(dir, file));
        const rec = { file, family, name: family, size: st.size }; list.push(rec); added.push({ id: file, family, name: family });
      } catch { skipped.push({ name, why: 'błąd' }); }
    }
    if (added.length) save(list);
    return { added, skipped };
  }
  function remove(id) {
    const list = load(), i = list.findIndex(x => x.file === id); if (i < 0) return false;
    list.splice(i, 1); try { fs.unlinkSync(path.join(dir, id)); } catch {} save(list); return true;
  }
  function read(id) {
    if (!/^[0-9a-f]{16}\.(ttf|otf|ttc|otc|woff|woff2)$/i.test(String(id))) return null;
    if (!load().some(x => x.file === id)) return null;
    try { return fs.readFileSync(path.join(dir, id)); } catch { return null; }
  }
  return { list: publicList, add, remove, read, dir };
}
module.exports = { parseNameTable, fileFamilies, systemDirs, listSystem, store, EXT_USER };
