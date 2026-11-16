'use strict';
const { eq, ok } = require('./helpers'), U = require('../updater');
module.exports = async () => {
  const R = { owner: 'CzarodziejSmok', repo: 'ArkanaBrowser' };
  eq(U.repoCfg({ pkg: { build: { publish: [{ provider: 'github', owner: 'CzarodziejSmok', repo: 'ArkanaBrowser' }] } } }), R, 'z package.json (uruchomienie z kodu)');
  // zainstalowana aplikacja: electron-builder usuwa „build” z package.json – to był błąd „Repozytorium aktualizacji nie jest skonfigurowane”
  eq(U.repoCfg({ pkg: { name: 'x', version: '1.0.0' }, yml: '' }), R, 'bez sekcji build w package.json: repozytorium nadal ustalone');
  eq(U.repoCfg({ pkg: {}, yml: 'owner: Ktos\nrepo: Inne\nprovider: github\nupdaterCacheDirName: x-updater\n' }), { owner: 'Ktos', repo: 'Inne' }, 'z app-update.yml wygenerowanego przez instalator');
  eq(U.repoCfg({ pkg: {}, yml: 'provider: github\nowner: "Ktos"\nrepo: \'Inne\'\n' }), { owner: 'Ktos', repo: 'Inne' }, 'app-update.yml z cudzysłowami');
  eq(U.repoCfg({ pkg: { build: { publish: [{ provider: 'github', owner: 'TWOJ-LOGIN', repo: 'x' }] } }, yml: '' }), R, 'wpis-zaślepka jest ignorowany');
  eq(U.repoCfg({ pkg: {}, yml: 'provider: generic\nurl: https://x\n' }), R, 'inny dostawca: stałe repozytorium');
  eq(U.repoCfg({ pkg: {}, yml: 'provider: github\nowner: ../../zle\nrepo: x\n' }), R, 'niepoprawna nazwa: stałe repozytorium');
  ok(U.repoCfg() && U.repoCfg().repo === 'ArkanaBrowser', 'bez argumentów (prawdziwy package.json) działa');
};
