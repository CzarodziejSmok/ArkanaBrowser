'use strict';
// Blokowanie reklam wewnątrz strony (uzupełnia filtrowanie domen z adblock.js).
//
// Dlaczego sama lista domen nie wystarcza: reklamy w YouTube (i części innych serwisów) pochodzą z tego samego serwisu co treść,
// a o tym, że i kiedy je pokazać, decyduje odpowiedź JSON odtwarzacza (adPlacements, playerAds, adSlots). Dlatego tu są trzy warstwy:
//  1) skrypt uruchamiany w świecie strony PRZED skryptami strony: wycina pola reklamowe z odpowiedzi odtwarzacza YouTube,
//  2) „ratunek”: jeśli reklama mimo to wystartuje, odtwarzacz jest wyciszany, przewijany do końca reklamy i klika „Pomiń”
//     (oraz znika okno „blokery reklam są niedozwolone”),
//  3) style CSS chowające puste miejsca po reklamach (YouTube i kilka powszechnych kontenerów reklamowych na innych stronach).
// Wszystko działa tylko przy włączonej opcji Prywatność → Blokowanie reklam (stan sprawdzany przy ładowaniu strony; po zmianie odśwież kartę).

// ---- 1 + 2: skrypt YouTube (wykonywany w świecie strony; sam sprawdza, czy jest na YouTube) ----
const YT_SCRIPT = `(()=>{try{
const h=location.hostname;if(!/(^|\\.)youtube(-nocookie)?\\.com$/.test(h)||h==='accounts.youtube.com')return;
if(window.__arkAds)return;Object.defineProperty(window,'__arkAds',{value:1});
const KEYS=['adPlacements','playerAds','adSlots','adBreakHeartbeatParams','adBreakParams'];
const prune=o=>{try{if(!o||typeof o!=='object')return o;
for(const k of KEYS)if(k in o)delete o[k];
const pr=o.playerResponse;if(pr&&typeof pr==='object')for(const k of KEYS)if(k in pr)delete pr[k];
if(Array.isArray(o)){for(const x of o)if(x&&typeof x==='object'&&x.playerResponse){for(const k of KEYS)if(k in x.playerResponse)delete x.playerResponse[k];}}
}catch(e){}return o;};
// odpowiedzi JSON ładowane przez XHR i parsowane ręcznie
const jp=JSON.parse;JSON.parse=function parse(t,r){return prune(jp.call(this,t,r));};
// odpowiedzi pobierane przez fetch (youtubei/v1/player, next, get_watch…)
try{const rj=Response.prototype.json;Response.prototype.json=function json(){const u=String(this.url||'');const p=rj.call(this);return /\\/youtubei\\/|\\/get_watch|\\/watch\\?/.test(u)?p.then(prune):p;};}catch(e){}
// dane wbudowane w stronę (pierwsze wejście na film)
try{let v;Object.defineProperty(window,'ytInitialPlayerResponse',{configurable:true,enumerable:true,get(){return v;},set(x){v=prune(x);}});}catch(e){}
// ratunek, gdy reklama mimo to ruszy
let saved=null;const q=s=>document.querySelector(s);
const SKIP='.ytp-ad-skip-button,.ytp-ad-skip-button-modern,.ytp-skip-ad-button,.ytp-ad-skip-button-slot button,.ytp-ad-skip-button-container button,.ytp-ad-overlay-close-button';
const tick=()=>{try{
const pl=q('#movie_player')||q('.html5-video-player'),v=q('video.html5-main-video')||q('video');
const ad=!!pl&&(pl.classList.contains('ad-showing')||pl.classList.contains('ad-interrupting'));
if(ad&&v){if(!saved)saved={m:v.muted,r:v.playbackRate};v.muted=true;try{v.playbackRate=16;}catch(e){}
if(isFinite(v.duration)&&v.duration>0&&v.currentTime<v.duration-.1)try{v.currentTime=v.duration;}catch(e){}}
else if(saved&&v){v.muted=saved.m;try{v.playbackRate=saved.r;}catch(e){}saved=null;}
document.querySelectorAll(SKIP).forEach(b=>{try{b.click();}catch(e){}});
const en=q('ytd-enforcement-message-view-model');
if(en){const d=en.closest('tp-yt-paper-dialog')||en;d.remove();document.querySelectorAll('tp-yt-iron-overlay-backdrop').forEach(x=>x.remove());
try{document.documentElement.style.overflow='';if(document.body)document.body.style.overflow='';}catch(e){}if(v&&v.paused&&!ad)v.play().catch(()=>{});}
}catch(e){}};
setInterval(tick,250);
}catch(e){}})();`;

// ---- 3: style ----
const YT_CSS = [
  '#masthead-ad', '#player-ads', '.video-ads', '.ytp-ad-module', '.ytp-ad-overlay-container', '.ytp-ad-image-overlay',
  'ytd-ad-slot-renderer', 'ytd-in-feed-ad-layout-renderer', 'ytd-banner-promo-renderer', 'ytd-statement-banner-renderer', 'ytd-brand-video-singleton-renderer',
  'ytd-promoted-sparkles-web-renderer', 'ytd-promoted-video-renderer', 'ytd-display-ad-renderer', 'ytd-companion-slot-renderer', 'ytd-action-companion-ad-renderer',
  'ytd-player-legacy-desktop-watch-ads-renderer', 'ytd-primetime-promo-renderer', 'ytd-enforcement-message-view-model', 'tp-yt-paper-dialog:has(ytd-enforcement-message-view-model)',
  'ytd-rich-item-renderer:has(ytd-ad-slot-renderer)', 'ytd-rich-section-renderer:has(ytd-statement-banner-renderer)', 'ytm-promoted-sparkles-web-renderer', 'ytm-companion-ad-renderer'
].join(',') + '{display:none!important}';

// kontenery reklam spotykane na wielu stronach (po zablokowaniu skryptów zostają puste ramki); celowo wąska lista, żeby nie psuć stron
const GEN_CSS = [
  'ins.adsbygoogle', '.adsbygoogle[data-ad-status]', 'div[id^="google_ads_iframe"]', 'iframe[id^="google_ads_iframe"]', 'div[id^="div-gpt-ad"]',
  'iframe[src*="googlesyndication.com"]', 'iframe[src*="doubleclick.net"]', 'iframe[src*="adnxs.com"]', 'div[id^="taboola-"]', '.OUTBRAIN', 'div[data-google-query-id]'
].join(',') + '{display:none!important}';

// to, co dostaje skrypt karty (ipc 'web-cfg'); on = czy blokowanie reklam jest włączone
const pageCfg = on => on ? { ads: YT_SCRIPT, adcss: { yt: YT_CSS, gen: GEN_CSS } } : { ads: '', adcss: null };
const isYouTube = h => /(^|\.)youtube(-nocookie)?\.com$/.test(String(h || '')) && h !== 'accounts.youtube.com';

module.exports = { pageCfg, YT_SCRIPT, YT_CSS, GEN_CSS, isYouTube };
