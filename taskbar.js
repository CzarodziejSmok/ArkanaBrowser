'use strict';
// Ikona Arkany na pasku zadań Windows w kolorach motywu – także gdy Arkana jest PRZYPIĘTA do paska zadań.
//
// Dlaczego sama ikona okna (win.setIcon) nie wystarcza: gdy okno należy do tej samej grupy co przypięty skrót (ten sam identyfikator
// aplikacji, AppUserModelID), Windows rysuje na przycisku ikonę z TEGO SKRÓTU i ignoruje ikonę okna. Skrót .lnk w folderze
// „User Pinned\TaskBar” ma ustaloną ikonę, więc przycisk przestawał zmieniać kolor razem z motywem.
// Rozwiązanie: (1) okno dostaje ten sam identyfikator co przypięty skrót (żeby nie powstawał drugi przycisk), a (2) przy każdej zmianie
// motywu podmieniamy ikonę w samym przypiętym skrócie (shell.writeShortcutLink w trybie „update” zmienia tylko ikonę, resztę zostawia –
// tak samo robi np. Chrome ze skrótem profilu). Plik .ico ma za każdym razem nową nazwę (hash koloru), bo Windows buforuje ikony po ścieżce.
const fs = require('fs'), path = require('path'), crypto = require('crypto');

const SIZES = [16, 24, 32, 48, 64, 128, 256];

// kontener ICO z obrazami PNG (Windows Vista+ czyta takie pliki); pngs: [{size, data:Buffer}]
function buildIco(pngs) {
  const n = pngs.length, head = Buffer.alloc(6 + 16 * n);
  head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(n, 4);
  let off = head.length;
  pngs.forEach((p, i) => {
    const o = 6 + 16 * i;
    head.writeUInt8(p.size >= 256 ? 0 : p.size, o); head.writeUInt8(p.size >= 256 ? 0 : p.size, o + 1);
    head.writeUInt8(0, o + 2); head.writeUInt8(0, o + 3); head.writeUInt16LE(1, o + 4); head.writeUInt16LE(32, o + 6);
    head.writeUInt32LE(p.data.length, o + 8); head.writeUInt32LE(off, o + 12); off += p.data.length;
  });
  return Buffer.concat([head, ...pngs.map(p => p.data)]);
}
// img: nativeImage z Electrona
function icoFromImage(img) {
  return buildIco(SIZES.map(size => ({ size, data: img.resize({ width: size, height: size, quality: 'best' }).toPNG() })));
}

// folder przypiętych skrótów paska zadań Windows
const pinDir = appData => path.join(appData, 'Microsoft', 'Internet Explorer', 'Quick Launch', 'User Pinned', 'TaskBar');
const same = (a, b) => !!a && !!b && path.resolve(String(a)).toLowerCase() === path.resolve(String(b)).toLowerCase();

// przypięte skróty Arkany: cel = nasz plik wykonywalny (a przy uruchomieniu z kodu źródłowego – jeszcze ścieżka aplikacji w argumentach)
function findPinned(opts) {
  const { shell, appData, exe, appPath, packaged } = opts, out = [];
  let list = []; try { list = fs.readdirSync(pinDir(appData)).filter(f => /\.lnk$/i.test(f)); } catch { return out; }
  for (const f of list) {
    const file = path.join(pinDir(appData), f);
    try {
      const l = shell.readShortcutLink(file);
      if (!same(l.target, exe)) continue;
      if (!packaged && !String(l.args || '').toLowerCase().includes(String(appPath).toLowerCase())) continue;
      out.push({ file, aumid: l.appUserModelId || '', icon: l.icon || '' });
    } catch { /* uszkodzony skrót – pomijamy */ }
  }
  return out;
}

// zapis ikony w kolorach motywu do folderu icons i podmiana ikony w przypiętych skrótach; zwraca {file, updated}
function applyThemeIcon(opts) {
  const { shell, img, dir, appData, exe, appPath, packaged, notify } = opts;
  fs.mkdirSync(dir, { recursive: true });
  const buf = icoFromImage(img), hash = crypto.createHash('sha1').update(buf).digest('hex').slice(0, 10);
  const file = path.join(dir, 'arkana-' + hash + '.ico');
  if (!fs.existsSync(file)) fs.writeFileSync(file, buf);
  let updated = 0;
  for (const p of findPinned({ shell, appData, exe, appPath, packaged })) {
    if (same(p.icon, file)) continue;
    try { if (shell.writeShortcutLink(p.file, 'update', { icon: file, iconIndex: 0 })) { updated++; if (notify) notify(p.file); } } catch { /* np. plik zablokowany – spróbujemy przy następnej zmianie */ }
  }
  // sprzątanie: zostają 3 ostatnie pliki (skrót wskazuje na najnowszy)
  try {
    fs.readdirSync(dir).filter(f => /^arkana-[0-9a-f]{10}\.ico$/.test(f) && f !== path.basename(file))
      .map(f => ({ f, t: fs.statSync(path.join(dir, f)).mtimeMs })).sort((a, b) => b.t - a.t).slice(2).forEach(x => { try { fs.unlinkSync(path.join(dir, x.f)); } catch {} });
  } catch {}
  return { file, updated };
}

// opcja wyłączona: przypięty skrót wraca do ikony programu
function restoreIcon(opts) {
  const { shell, appData, exe, appPath, packaged, fallback, notify } = opts; let updated = 0;
  for (const p of findPinned({ shell, appData, exe, appPath, packaged })) {
    if (!/arkana-[0-9a-f]{10}\.ico$/i.test(p.icon)) continue;   // ruszamy tylko skróty, którym sami zmieniliśmy ikonę
    try { if (shell.writeShortcutLink(p.file, 'update', { icon: packaged ? exe : fallback, iconIndex: 0 })) { updated++; if (notify) notify(p.file); } } catch {}
  }
  return { updated };
}

// powiadomienie powłoki Windows o zmianie skrótu (SHChangeNotify), żeby pasek zadań od razu odświeżył ikonę
function notifyShell(file, execFile) {
  if (process.platform !== 'win32') return;
  const q = String(file).replace(/'/g, "''");
  const ps = "Add-Type -Namespace W -Name N -MemberDefinition '[DllImport(\"shell32.dll\",CharSet=CharSet.Unicode)] public static extern void SHChangeNotify(int e,uint f,string a,string b);';" +
    "[W.N]::SHChangeNotify(0x2000,0x5,'" + q + "',$null);[W.N]::SHChangeNotify(0x8000000,0x1000,$null,$null)";   // UPDATEITEM + ASSOCCHANGED
  try { execFile('powershell.exe', ['-NoProfile', '-NonInteractive', '-WindowStyle', 'Hidden', '-Command', ps], { windowsHide: true, timeout: 15000 }, () => {}); } catch {}
}

module.exports = { buildIco, icoFromImage, pinDir, findPinned, applyThemeIcon, restoreIcon, notifyShell, SIZES };
