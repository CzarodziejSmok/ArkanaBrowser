'use strict';
// Blokowanie reklam i śledzenia: lista domen sieci reklamowych i trackerów, blokowane tylko żądania z innych witryn (trzecich stron).
// To proste filtrowanie po domenach, nie zastępuje uBlock Origin: nie usuwa reklam spod adresu strony (np. reklam w YouTube) ani elementów strony.
const HOSTS = `doubleclick.net googlesyndication.com googleadservices.com googletagservices.com adservice.google.com 2mdn.net adnxs.com adsrvr.org adform.net adition.com
criteo.com criteo.net taboola.com outbrain.com rubiconproject.com pubmatic.com openx.net casalemedia.com indexww.com amazon-adsystem.com smartadserver.com teads.tv
sharethrough.com mgid.com revcontent.com zemanta.com yieldmo.com 33across.com lijit.com sovrn.com bidswitch.net contextweb.com advertising.com adcolony.com applovin.com
moatads.com doubleverify.com adsafeprotected.com serving-sys.com sizmek.com mathtag.com bluekai.com demdex.net krxd.net rlcdn.com agkn.com adroll.com improvedigital.com
adtech.com adsymptotic.com media.net ads.yahoo.com advertising.yahoo.com gemius.pl hit.gemius.pl gemius.com adocean.pl adocean-global.com an.yandex.ru mc.yandex.ru
scorecardresearch.com quantserve.com quantcount.com hotjar.com hotjar.io mouseflow.com crazyegg.com fullstory.com chartbeat.com chartbeat.net bat.bing.com clarity.ms
analytics.twitter.com ads.twitter.com static.ads-twitter.com ads.linkedin.com px.ads.linkedin.com snap.licdn.com ads.pinterest.com analytics.tiktok.com ads.tiktok.com
business-api.tiktok.com tr.snapchat.com sc-static.net outbrainimg.com taboolasyndication.com tynt.com bounceexchange.com ml314.com adsystem.com adkernel.com
yadro.ru top-fwz1.mail.ru ad.mail.ru betrad.com evidon.com pippio.com tapad.com turn.com tidaltv.com spotxchange.com springserve.com stickyadstv.com freewheel.tv
innovid.com undertone.com yieldlab.net adscale.de nexage.com onetag-sys.com id5-sync.com liadm.com permutive.com connatix.com cxense.com media6degrees.com`.split(/\s+/).filter(Boolean);
const SET = new Set(HOSTS);
const SLD = new Set(['co', 'com', 'org', 'net', 'gov', 'edu', 'ac']);

function hostBlocked(host) {
  const p = String(host || '').toLowerCase().split('.');
  for (let i = 0; i <= p.length - 2; i++) if (SET.has(p.slice(i).join('.'))) return true;
  return false;
}
function regDomain(host) {
  const p = String(host || '').toLowerCase().split('.'); if (p.length <= 2) return p.join('.');
  return (p[p.length - 1].length === 2 && SLD.has(p[p.length - 2]) ? p.slice(-3) : p.slice(-2)).join('.');
}
const hostOf = u => { try { return new URL(u).hostname; } catch { return ''; } };
// czy to żądanie powinno zostać zablokowane
function shouldBlock(url, pageUrl, resourceType) {
  if (resourceType === 'mainFrame') return false;
  const h = hostOf(url); if (!h || !hostBlocked(h)) return false;
  const ph = hostOf(pageUrl); return !!ph && regDomain(ph) !== regDomain(h);
}
const state = { on: true, count: 0 };
function install(ses) {
  ses.webRequest.onBeforeRequest({ urls: ['http://*/*', 'https://*/*'] }, (d, cb) => {
    if (!state.on) return cb({});
    const page = d.referrer || (d.webContents && !d.webContents.isDestroyed() ? d.webContents.getURL() : '');
    if (shouldBlock(d.url, page, d.resourceType)) { state.count++; return cb({ cancel: true }); }
    cb({});
  });
}
module.exports = { install, state, shouldBlock, hostBlocked, regDomain, HOSTS };
