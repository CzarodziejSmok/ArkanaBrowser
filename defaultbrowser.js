'use strict';
// Arkana jako przeglądarka domyślna w Windows.
//
// Windows 10/11 nie pozwala programowi samemu zostać przeglądarką domyślną (wybór użytkownika chroni podpis w kluczu UserChoice).
// Program może tylko zarejestrować się jako przeglądarka (klucze Capabilities / RegisteredApplications), po czym użytkownik wybiera go
// w Ustawieniach systemu. Dlatego: (1) tu zapisujemy rejestrację w HKCU (bez praw administratora), (2) otwieramy stronę „Domyślne aplikacje”
// w Ustawieniach Windows, (3) status sprawdzamy odczytem UserChoice. Poza Windows używamy zwykłego app.setAsDefaultProtocolClient.
const fs = require('fs'), os = require('os'), path = require('path');

const PROG_URL = 'ArkanaBrowserURL', PROG_HTML = 'ArkanaBrowserHTML', CLIENT = 'ArkanaBrowser', APP_NAME = 'Arkana Browser';
const CAP = 'Software\\Clients\\StartMenuInternet\\' + CLIENT + '\\Capabilities';
const FILE_EXT = ['.htm', '.html', '.xhtml', '.shtml'];
const userChoiceKey = proto => 'HKCU\\Software\\Microsoft\\Windows\\Shell\\Associations\\UrlAssociations\\' + proto + '\\UserChoice';

const escReg = s => String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
// polecenie otwierające adres: z instalatora „exe %1”, z kodu źródłowego „electron.exe folder-aplikacji %1”
const command = o => o.packaged ? `"${o.exe}" "%1"` : `"${o.exe}" "${o.appPath}" "%1"`;
const iconRef = o => o.packaged ? `${o.exe},0` : (o.icon || o.exe) + ',0';

// treść pliku .reg z całą rejestracją (import jednym poleceniem, poprawne cytowanie znaków specjalnych)
function regText(o) {
  const cmd = command(o), ico = iconRef(o), L = [];
  const key = k => { L.push('', '[HKEY_CURRENT_USER\\' + k + ']'); };
  const val = (n, v) => L.push((n === '@' ? '@' : '"' + escReg(n) + '"') + '="' + escReg(v) + '"');
  L.push('Windows Registry Editor Version 5.00');
  key('Software\\Classes\\' + PROG_URL); val('@', APP_NAME + ' URL'); val('URL Protocol', '');
  key('Software\\Classes\\' + PROG_URL + '\\DefaultIcon'); val('@', ico);
  key('Software\\Classes\\' + PROG_URL + '\\shell\\open\\command'); val('@', cmd);
  key('Software\\Classes\\' + PROG_HTML); val('@', APP_NAME + ' HTML Document');
  key('Software\\Classes\\' + PROG_HTML + '\\DefaultIcon'); val('@', ico);
  key('Software\\Classes\\' + PROG_HTML + '\\shell\\open\\command'); val('@', cmd);
  key('Software\\Clients\\StartMenuInternet\\' + CLIENT); val('@', APP_NAME);
  key('Software\\Clients\\StartMenuInternet\\' + CLIENT + '\\DefaultIcon'); val('@', ico);
  key('Software\\Clients\\StartMenuInternet\\' + CLIENT + '\\shell\\open\\command'); val('@', o.packaged ? `"${o.exe}"` : `"${o.exe}" "${o.appPath}"`);
  key(CAP); val('ApplicationName', APP_NAME); val('ApplicationDescription', o.description || 'Arkana Browser'); val('ApplicationIcon', ico);
  key(CAP + '\\URLAssociations'); val('http', PROG_URL); val('https', PROG_URL);
  key(CAP + '\\FileAssociations'); FILE_EXT.forEach(e => val(e, PROG_HTML));
  key(CAP + '\\StartMenu'); val('StartMenuInternet', CLIENT);
  key('Software\\RegisteredApplications'); val(APP_NAME, CAP);
  return L.join('\r\n') + '\r\n';
}
const regFile = text => Buffer.concat([Buffer.from([0xff, 0xfe]), Buffer.from(text, 'utf16le')]);   // .reg w UTF-16 LE z BOM

const run = (execFile, file, args) => new Promise(res => { try { execFile(file, args, { windowsHide: true, timeout: 20000 }, (err, stdout) => res({ ok: !err, out: String(stdout || '') })); } catch { res({ ok: false, out: '' }); } });

async function register(o) {
  const f = path.join(os.tmpdir(), 'arkana-browser-reg-' + process.pid + '.reg');
  try { fs.writeFileSync(f, regFile(regText(o))); } catch { return false; }
  const r = await run(o.execFile, 'reg.exe', ['import', f]);
  try { fs.unlinkSync(f); } catch {}
  return r.ok;
}
async function unregister(o) {
  const del = k => run(o.execFile, 'reg.exe', ['delete', 'HKCU\\' + k, '/f']);
  await del('Software\\Clients\\StartMenuInternet\\' + CLIENT); await del('Software\\Classes\\' + PROG_URL); await del('Software\\Classes\\' + PROG_HTML);
  await run(o.execFile, 'reg.exe', ['delete', 'HKCU\\Software\\RegisteredApplications', '/v', APP_NAME, '/f']);
  return true;
}
// ProgId z wyjścia „reg query”
const parseProgId = out => { const m = /ProgId\s+REG_SZ\s+(\S+)/i.exec(out || ''); return m ? m[1] : ''; };
async function status(o) {
  const [http, https, reg] = await Promise.all([
    run(o.execFile, 'reg.exe', ['query', userChoiceKey('http'), '/v', 'ProgId']),
    run(o.execFile, 'reg.exe', ['query', userChoiceKey('https'), '/v', 'ProgId']),
    run(o.execFile, 'reg.exe', ['query', 'HKCU\\Software\\RegisteredApplications', '/v', APP_NAME])]);
  const a = parseProgId(http.out), b = parseProgId(https.out);
  return { registered: reg.ok, isDefault: a === PROG_URL && b === PROG_URL, current: b || a || '' };
}

// adres z linii poleceń (kliknięcie linku w innym programie / dwuklik na pliku .html); null, gdy nie ma
const urlFromArgv = (argv, exists = fs.existsSync) => {
  for (const a of (argv || []).slice(1)) {
    const s = String(a || '');
    if (s.length > 8192 || s.startsWith('-')) continue;
    if (/^https?:\/\//i.test(s)) return s;
    if (/\.(x?html?|shtml)$/i.test(s) && path.isAbsolute(s) && exists(s)) return require('url').pathToFileURL(s).href;
  }
  return null;
};

module.exports = { regText, regFile, register, unregister, status, parseProgId, urlFromArgv, escReg, command, PROG_URL, PROG_HTML, CLIENT, APP_NAME, FILE_EXT };
