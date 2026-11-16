'use strict';
const { eq, ok } = require('./helpers'), fs = require('fs'), path = require('path'), os = require('os'), D = require('../defaultbrowser');
module.exports = async () => {
  const pk = { exe: 'C:\\Users\\Jan "J" K\\AppData\\Local\\Programs\\Arkana Browser\\Arkana Browser.exe', appPath: 'C:\\dev\\arkana', packaged: true, icon: 'C:\\dev\\arkana\\icon.ico' };
  const t = D.regText(pk);
  ok(t.startsWith('Windows Registry Editor Version 5.00\r\n'), 'plik .reg: nagłówek');
  ok(t.includes('[HKEY_CURRENT_USER\\Software\\RegisteredApplications]') && t.includes('"Arkana Browser"="Software\\\\Clients\\\\StartMenuInternet\\\\ArkanaBrowser\\\\Capabilities"'), 'rejestracja w RegisteredApplications');
  ok(t.includes('"http"="ArkanaBrowserURL"') && t.includes('"https"="ArkanaBrowserURL"'), 'adresy http i https');
  ok(['.htm', '.html', '.xhtml', '.shtml'].every(e => t.includes('"' + e + '"="ArkanaBrowserHTML"')), 'pliki .htm/.html/.xhtml/.shtml');
  ok(t.includes('"URL Protocol"=""'), 'ProgId adresu ma URL Protocol');
  ok(t.includes('@="\\"C:\\\\Users\\\\Jan \\"J\\" K\\\\AppData\\\\Local\\\\Programs\\\\Arkana Browser\\\\Arkana Browser.exe\\" \\"%1\\""'), 'polecenie: ścieżka z cudzysłowem i spacjami poprawnie zapisana, na końcu „%1”');
  const dev = D.regText({ ...pk, packaged: false, exe: 'C:\\n\\electron.exe' });
  ok(dev.includes('\\"C:\\\\n\\\\electron.exe\\" \\"C:\\\\dev\\\\arkana\\" \\"%1\\"'), 'z kodu źródłowego: polecenie zawiera folder aplikacji');
  ok(dev.includes('C:\\\\dev\\\\arkana\\\\icon.ico,0'), 'z kodu źródłowego: ikona z pliku icon.ico');
  eq(D.escReg('a\\b"c'), 'a\\\\b\\"c', 'escReg');
  const f = D.regFile('ąę€'); eq([f[0], f[1]], [0xff, 0xfe], '.reg: BOM UTF-16 LE'); eq(f.slice(2).toString('utf16le'), 'ąę€', '.reg: treść odczytywalna');
  eq(D.parseProgId('\r\nHKEY_CURRENT_USER\\...\\UserChoice\r\n    ProgId    REG_SZ    ArkanaBrowserURL\r\n'), 'ArkanaBrowserURL', 'odczyt ProgId'); eq(D.parseProgId('błąd'), '', 'brak ProgId');
  // status z udawanym reg.exe
  const mk = map => (file, args, o, cb) => { const k = args[1] || ''; const hit = Object.keys(map).find(x => k.includes(x)); hit && map[hit] !== null ? cb(null, map[hit]) : cb(new Error('brak')); };
  const O = { execFile: mk({ '\\http\\UserChoice': '    ProgId    REG_SZ    ArkanaBrowserURL\r\n', '\\https\\UserChoice': '    ProgId    REG_SZ    ArkanaBrowserURL\r\n', RegisteredApplications: '    Arkana Browser    REG_SZ    x\r\n' }) };
  eq(await D.status(O), { registered: true, isDefault: true, current: 'ArkanaBrowserURL' }, 'status: jest domyślną');
  eq((await D.status({ execFile: mk({ '\\http\\UserChoice': '    ProgId    REG_SZ    ChromeHTML\r\n', '\\https\\UserChoice': '    ProgId    REG_SZ    ChromeHTML\r\n', RegisteredApplications: '    Arkana Browser    REG_SZ    x\r\n' }) })).isDefault, false, 'status: domyślna jest inna przeglądarka');
  eq(await D.status({ execFile: mk({}) }), { registered: false, isDefault: false, current: '' }, 'status: brak rejestracji');
  eq((await D.status({ execFile: mk({ '\\http\\UserChoice': '    ProgId    REG_SZ    ArkanaBrowserURL\r\n', '\\https\\UserChoice': '    ProgId    REG_SZ    EdgeHTM\r\n' }) })).isDefault, false, 'status: tylko http to za mało');
  // rejestracja: reg import na pliku UTF-16
  let seen = null; const reg = await D.register({ ...pk, execFile: (file, args, o, cb) => { seen = { file, args, data: fs.existsSync(args[1]) ? fs.readFileSync(args[1]) : null }; cb(null, ''); } });
  eq([reg, seen.file, seen.args[0]], [true, 'reg.exe', 'import'], 'rejestracja: reg import'); ok(seen.data && seen.data[0] === 0xff && seen.data.slice(2).toString('utf16le').includes('StartMenuInternet'), 'plik importu istnieje i jest w UTF-16'); ok(!fs.existsSync(seen.args[1]), 'plik tymczasowy usunięty');
  eq(await D.register({ ...pk, execFile: (f, a, o, cb) => cb(new Error('x')) }), false, 'błąd reg.exe zwraca false');
  // adres z linii poleceń
  eq(D.urlFromArgv(['Arkana.exe']), null, 'brak argumentów');
  eq(D.urlFromArgv(['Arkana.exe', 'https://example.com/a?b=1']), 'https://example.com/a?b=1', 'link https'); eq(D.urlFromArgv(['electron.exe', 'C:\\app', 'http://x.pl']), 'http://x.pl', 'z kodu źródłowego: adres po folderze aplikacji');
  eq(D.urlFromArgv(['a.exe', '--flag', 'https://x.pl']), 'https://x.pl', 'flagi są pomijane'); eq(D.urlFromArgv(['a.exe', 'javascript:alert(1)', 'ftp://x']), null, 'inne schematy ignorowane');
  eq(D.urlFromArgv(['a.exe', 'https://' + 'a'.repeat(9000)]), null, 'zbyt długi adres ignorowany');
  const file = path.join(os.tmpdir(), 'ark test.html'); fs.writeFileSync(file, '<p>x</p>');
  ok(/^file:\/\/\/.*ark%20test\.html$/.test(D.urlFromArgv(['a.exe', file])), 'plik .html otwierany jako file://'); eq(D.urlFromArgv(['a.exe', path.join(os.tmpdir(), 'nie-ma.html')]), null, 'nieistniejący plik ignorowany'); eq(D.urlFromArgv(['a.exe', 'rel.html']), null, 'ścieżka względna ignorowana'); fs.unlinkSync(file);
};
