'use strict';
const { eq, ok } = require('./helpers'), fs = require('fs'), os = require('os'), path = require('path'), T = require('../taskbar');
module.exports = async () => {
  // kontener ICO
  const png = n => Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47]), Buffer.alloc(n, 7)]);
  const ico = T.buildIco([{ size: 16, data: png(10) }, { size: 256, data: png(20) }]);
  eq([ico.readUInt16LE(0), ico.readUInt16LE(2), ico.readUInt16LE(4)], [0, 1, 2], 'ICO: nagłówek (typ 1, 2 obrazy)');
  eq([ico[6], ico[7], ico.readUInt32LE(14), ico.readUInt32LE(18)], [16, 16, 14, 38], 'ICO: wpis 16 px (rozmiar i przesunięcie)');
  eq([ico[22], ico[23], ico.readUInt32LE(34)], [0, 0, 52], 'ICO: 256 px zapisane jako 0, przesunięcie za pierwszym obrazem');
  eq(ico.length, 38 + 14 + 24, 'ICO: długość całości');
  // sztuczny shell i folder przypiętych skrótów
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ark-')), appData = path.join(tmp, 'Roaming'), pd = T.pinDir(appData); fs.mkdirSync(pd, { recursive: true });
  const exe = path.join(tmp, 'Arkana Browser.exe'), links = { 'Arkana Browser.lnk': { target: exe, icon: exe, appUserModelId: 'com.arkana.browser' }, 'Edge.lnk': { target: path.join(tmp, 'msedge.exe'), icon: '' }, 'zepsuty.lnk': null };
  for (const f of Object.keys(links)) fs.writeFileSync(path.join(pd, f), 'x');
  const writes = []; const shell = {
    readShortcutLink: f => { const l = links[path.basename(f)]; if (!l) throw new Error('zły skrót'); return l; },
    writeShortcutLink: (f, mode, o) => { writes.push([path.basename(f), mode, o]); Object.assign(links[path.basename(f)], { icon: o.icon }); return true; } };
  const base = { shell, appData, exe, appPath: tmp, packaged: true };
  const f = T.findPinned(base); eq(f.map(x => path.basename(x.file)), ['Arkana Browser.lnk'], 'znajduje tylko przypięty skrót Arkany (Edge i zepsuty pomija)'); eq(f[0].aumid, 'com.arkana.browser', 'odczytuje identyfikator aplikacji skrótu');
  eq(T.findPinned({ ...base, appData: path.join(tmp, 'brak') }), [], 'brak folderu przypiętych: pusta lista');
  // zapis ikony i podmiana w skrócie
  let n = 0; const mkImg = col => ({ resize: ({ width }) => ({ toPNG: () => Buffer.concat([Buffer.from([0x89, 0x50]), Buffer.from(String(col) + width)]) }) });
  const dir = path.join(tmp, 'icons'), notes = [];
  const r1 = T.applyThemeIcon({ ...base, img: mkImg('a'), dir, notify: x => notes.push(x) });
  ok(/arkana-[0-9a-f]{10}\.ico$/.test(r1.file) && fs.existsSync(r1.file), 'powstaje plik .ico z hashem w nazwie'); eq(r1.updated, 1, 'ikona przypiętego skrótu podmieniona');
  eq(writes[0].slice(1), ['update', { icon: r1.file, iconIndex: 0 }], 'tryb „update”: zmieniamy tylko ikonę'); eq(notes.length, 1, 'powłoka powiadomiona o zmianie');
  const r1b = T.applyThemeIcon({ ...base, img: mkImg('a'), dir }); eq([r1b.file === r1.file, r1b.updated, writes.length], [true, 0, 1], 'ten sam motyw: nic się nie zmienia, skrót nie jest ruszany');
  const r2 = T.applyThemeIcon({ ...base, img: mkImg('b'), dir }); ok(r2.file !== r1.file && r2.updated === 1, 'inny kolor: nowy plik i nowa ikona w skrócie');
  for (const c of ['c', 'd', 'e']) { const t0 = Date.now(); T.applyThemeIcon({ ...base, img: mkImg(c), dir }); while (Date.now() - t0 < 5) {} }
  ok(fs.readdirSync(dir).length <= 3, 'sprzątanie: najwyżej 3 pliki .ico');
  // opcja wyłączona: powrót do ikony programu, tylko dla skrótów zmienionych przez nas
  const rr = T.restoreIcon({ ...base, fallback: 'x.ico' }); eq([rr.updated, links['Arkana Browser.lnk'].icon], [1, exe], 'wyłączenie: przypięty skrót wraca do ikony programu');
  eq(T.restoreIcon({ ...base, fallback: 'x.ico' }).updated, 0, 'ponowne wyłączenie nie rusza skrótu');
  // skrót, którego nie zmienialiśmy, zostaje (np. ikona wybrana przez użytkownika)
  links['Arkana Browser.lnk'].icon = path.join(tmp, 'moja.ico'); eq(T.restoreIcon({ ...base, fallback: 'x.ico' }).updated, 0, 'cudza ikona skrótu nie jest nadpisywana');
  // uruchomienie z kodu źródłowego: liczy się też ścieżka aplikacji w argumentach
  links['Arkana Browser.lnk'] = { target: exe, args: '"' + path.join(tmp, 'inna') + '"', icon: '', appUserModelId: 'x' };
  eq(T.findPinned({ ...base, appPath: path.join(tmp, 'app'), packaged: false }).length, 0, 'dev: skrót do innej aplikacji tego samego electron.exe pomijany');
  fs.rmSync(tmp, { recursive: true, force: true });
};
