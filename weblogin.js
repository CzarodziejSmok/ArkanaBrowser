'use strict';
// Logowanie do kont Google i klucze dostępu (passkeys).
//
// Przyczyna „Ta przeglądarka lub aplikacja może nie być bezpieczna” (sprawdzone 14.11.2026 na Electronie 33 i 45, zmyślonym adresem):
// Google porównuje środowisko strony z prawdziwym Chrome. W Electronie obiekt window.chrome jest pusty (brak chrome.app, chrome.csi,
// chrome.loadTimes – dodaje je dopiero przeglądarka Chrome, nie silnik Chromium) i nie ma navigator.share / canShare.
// Wynik testu: bez uzupełnienia -> /v3/signin/rejected; z uzupełnieniem -> zwykły następny krok („Nie udało się znaleźć tego konta”),
// tak samo jak w prawdziwym Edge. Identyfikator (User-Agent) Firefoksa i marka „Google Chrome” w Client Hints NIE pomagały.
// Uzupełnienie jest uruchamiane w świecie strony z wv-preload.js / wv-shim.js, zanim wykona się jakikolwiek skrypt strony.
//
// Klucze dostępu: strony wywołują WebAuthn, a Electron przekazuje to wprost do Windows Hello, co pokazuje systemowe okno
// „Zaloguj się przy użyciu klucza dostępu”. Domyślnie ukrywamy WebAuthn (strona proponuje hasło). Włącza się to w Ustawieniach → Prywatność.

// strony, na których odbywa się logowanie do konta Google
const AUTH_HOSTS = ['accounts.google.com', 'accounts.youtube.com'];
function isGoogleAuth(u) {
  try { const x = new URL(String(u)); return /^https?:$/.test(x.protocol) && (AUTH_HOSTS.includes(x.hostname) || /^accounts\.google\.(com?\.)?[a-z]{2,3}$/.test(x.hostname)); }
  catch { return false; }
}
// konfiguracja ustawiana z okna (Ustawienia → Prywatność)
const cfg = { gfix: true, passkeys: false };
function setCfg(c) { if (c && typeof c === 'object') { if ('gfix' in c) cfg.gfix = !!c.gfix; if ('passkeys' in c) cfg.passkeys = !!c.passkeys; } return { ...cfg }; }

// Nagłówki: usuwa markę "Electron" z Client Hints (zabezpieczenie; w Electronie 33 jej nie ma, ale nie zaszkodzi).
function rewriteHeaders(url, headers) {
  const h = { ...headers };
  for (const k of Object.keys(h)) if (/^sec-ch-ua(-full-version-list)?$/i.test(k) && /electron/i.test(h[k])) h[k] = h[k].replace(/"Electron";v="[^"]*",?\s*/gi, '').replace(/,\s*$/, '');
  return h;
}

// Uzupełnienie API, które ma Chrome, a nie ma Electron. Funkcje udają natywne (toString), jak w Chrome.
const CHROME_SHIM = `(()=>{try{
const nat=new WeakMap(),oTS=Function.prototype.toString;
const mk=(name,fn)=>{const f={[name]:function(...a){return fn.apply(this,a);}}[name];nat.set(f,'function '+name+'() { [native code] }');return f;};
const ts=mk('toString',function(){return nat.has(this)?nat.get(this):oTS.call(this);});
Object.defineProperty(Function.prototype,'toString',{value:ts,writable:true,configurable:true});
const c=window.chrome||{};
if(!c.app){const st=o=>Object.freeze(o);
c.app={isInstalled:false,InstallState:st({DISABLED:'disabled',INSTALLED:'installed',NOT_INSTALLED:'not_installed'}),RunningState:st({CANNOT_RUN:'cannot_run',READY_TO_RUN:'ready_to_run',RUNNING:'running'}),
getDetails:mk('getDetails',()=>null),getIsInstalled:mk('getIsInstalled',()=>false),installState:mk('installState',cb=>{if(typeof cb==='function')setTimeout(()=>cb('not_installed'),0);}),runningState:mk('runningState',()=>'cannot_run')};}
const nav=()=>performance.getEntriesByType('navigation')[0]||{},t0=performance.timeOrigin;
if(!c.csi)c.csi=mk('csi',()=>({startE:Math.round(t0),onloadT:Math.round(t0+(nav().loadEventEnd||performance.now())),pageT:performance.now(),tran:15}));
if(!c.loadTimes)c.loadTimes=mk('loadTimes',()=>{const n=nav(),s=x=>(t0+(x||0))/1000,p=(performance.getEntriesByName('first-paint')[0]||{}).startTime,h=n.nextHopProtocol||'';
return{requestTime:s(n.requestStart),startLoadTime:s(n.startTime),commitLoadTime:s(n.responseStart),finishDocumentLoadTime:s(n.domContentLoadedEventEnd),finishLoadTime:s(n.loadEventEnd),firstPaintTime:s(p),firstPaintAfterLoadTime:0,
navigationType:'Other',wasFetchedViaSpdy:/^h[23]/.test(h),wasNpnNegotiated:/^h[23]/.test(h),npnNegotiatedProtocol:h||'unknown',wasAlternateProtocolAvailable:false,connectionInfo:h||'unknown'};});
if(!window.chrome)Object.defineProperty(window,'chrome',{value:c,writable:true,configurable:false,enumerable:true});
const NP=Navigator.prototype;
if(!('share' in NP)){Object.defineProperty(NP,'share',{value:mk('share',()=>Promise.reject(new DOMException('Share canceled','AbortError'))),writable:true,configurable:true,enumerable:true});
Object.defineProperty(NP,'canShare',{value:mk('canShare',d=>!!d&&(!!d.url||!!d.text||!!d.title)),writable:true,configurable:true,enumerable:true});}
}catch(e){}})();`;

const PASSKEY_BLOCK = `(()=>{try{const no=()=>Promise.reject(new DOMException('The operation either timed out or was not allowed.','NotAllowedError'));
const C=window.CredentialsContainer&&CredentialsContainer.prototype;if(C){const g=C.get,c=C.create;
Object.defineProperty(C,'get',{value:function(o){return o&&o.publicKey?no():g.call(this,o)},configurable:true,writable:true});
Object.defineProperty(C,'create',{value:function(o){return o&&o.publicKey?no():c.call(this,o)},configurable:true,writable:true});}
try{delete window.PublicKeyCredential}catch(e){}try{delete window.AuthenticatorAttestationResponse;delete window.AuthenticatorAssertionResponse}catch(e){}}catch(e){}})();`;

// to, co dostaje skrypt karty (ipc 'web-cfg')
const pageCfg = () => ({ gfix: cfg.gfix, passkeys: cfg.passkeys, shim: CHROME_SHIM, pk: PASSKEY_BLOCK });

module.exports = { isGoogleAuth, rewriteHeaders, CHROME_SHIM, PASSKEY_BLOCK, pageCfg, cfg, setCfg, AUTH_HOSTS };
