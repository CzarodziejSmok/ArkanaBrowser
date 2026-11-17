// PLIK GENEROWANY przez tools/bundle.js z src/js/*.js - nie edytuj go ręcznie.
// ===== src/js/01-state.js =====

const $=id=>document.getElementById(id), url=$('url'), home=$('home'), right=$('right'), split=$('split'), cw=$('cw');
const uid=()=>Math.random().toString(36).slice(2,9);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const host=u=>{try{return new URL(u).hostname.replace(/^www\./,'')}catch{return u}};
const isUrl=s=>/^https?:\/\//i.test(s)||/^[^\s]+\.[a-z]{2,}(\/\S*)?$/i.test(s);
const isG=u=>{try{return /(^|\.)google\.[a-z.]+$/.test(new URL(u).hostname)}catch{return false}};

// ---------- stan (zapamiętywany między uruchomieniami) ----------
let S, SEC=false, INC=false, INCP=''; try{ const ini=window.api&&window.api.getInit&&window.api.getInit(); if(ini&&ini.secondary){ SEC=true; S=ini.state; INC=!!ini.inc; INCP=ini.part||''; } }catch{}   // SEC = okno oderwane (stan jednorazowy), INC = okno incognito
if(!S){ try{S=window.api&&window.api.loadState&&window.api.loadState()}catch{} }
if(!S&&!SEC){try{S=JSON.parse(localStorage.getItem('cb-state'))}catch{}}
if(!S||!S.folders||!S.folders.length) S={folders:[{id:'f1',name:'Praca',tabs:[],active:null},{id:'f2',name:'Prywatne',tabs:[],active:null}],cur:'f1',panel:false,pw:430};
const DEF={login:{gfix:true,passkeys:false},pw:{on:true},adblock:{on:true},search:{engine:'googleweb',custom:''},imp:{hint:true},cl:{rel:true,unrel:true},hist:{on:true,step:6,skip:[]},upd:{auto:true,dl:true},afx:{on:true,calc:50,notes:50,clock:50,conv:50,tr:50,files:50,gej:50,dice:50,mine:50,snake:50},bg:{r:22,g:18,b:15,hold:26,sat:50,bri:50},bgs:[],bgSel:0,bgShape:'h',bgInt:'mid',bgRep:1,bgCut:[],bgSlide:'',bgFade:false,bgSpd:6,bgAdj:{bri:0,sat:0,r:0,g:0,b:0},accs:[],accSel:0,accFade:false,accSpd:6,accAdj:{bri:0,sat:0,r:0,g:0,b:0},acc:'#e8825a',adv:false,accAdv:false,fx:{all:100,dust:45,waves:50,stars:0,aurora:0,rain:0},img:{data:'',op:100,blur:0,dim:30,sat:100,fit:'cover'},keys:{'new-tab':'Ctrl+T','close-tab':'Ctrl+W','dup-tab':'Ctrl+Shift+D','reload-tab':'Ctrl+R','pin-tab':'Ctrl+Shift+P','pin-global':'','mute-tab':'Ctrl+Shift+M','restore-tab':'Ctrl+Shift+T','close-all':'Ctrl+Shift+W','reload-all':'Ctrl+Shift+R','pin-all':'Ctrl+Alt+P','mute-all':'Ctrl+Alt+M','next-tab':'Ctrl+Tab','prev-tab':'Ctrl+Shift+Tab','focus-url':'Ctrl+L','back':'Alt+←','forward':'Alt+→','go-home':'Alt+Home','new-folder':'Ctrl+Shift+N','dup-folder':'Ctrl+Alt+D','rename-folder':'F2','next-folder':'Ctrl+Alt+↓','prev-folder':'Ctrl+Alt+↑','settings':'Ctrl+,','toggle-panel':'Ctrl+Shift+K','history':'Ctrl+H','devtools':'F12','ui-devtools':'Ctrl+Shift+F12','new-window':'Ctrl+N','incognito':'Ctrl+Shift+I','find':'Ctrl+F','zoom-in':'Ctrl+=','zoom-in-alt':'Ctrl+Shift+=','zoom-in-np':'Ctrl+NumpadAdd','zoom-out':'Ctrl+-','zoom-out-np':'Ctrl+NumpadSubtract','zoom-reset':'Ctrl+0','print':'Ctrl+P'},ui:{font:'',cmode:'',pinpos:'top',dynicon:true,pgmode:'theme',lmode:{pl:'',en:'',de:'',es:'',fr:'',he:'',zh:'',szl:''},asst:true,clb:true,win:'simple',nav:'simple',anim:{btn:true,fold:true,tab:true,panel:true,apps:true,boot:true,bootsnd:true},lang:'pl',round:false,step5:false},apps:{on:true,bar:[]}};
function merge(d,o){ const r=JSON.parse(JSON.stringify(d)); if(o&&typeof o==='object') for(const k in r){ if(k in o){ if(Array.isArray(r[k])){ if(Array.isArray(o[k])) r[k]=o[k]; } else if(r[k]&&typeof r[k]==='object') r[k]=merge(r[k],o[k]); else if(typeof o[k]===typeof r[k]) r[k]=o[k]; } } return r; }
function normalize(st){ if(st&&st.ui&&typeof st.ui==='object'&&st.ui.cmode===undefined&&st.ui.lmode&&typeof st.ui.lmode==='object'){ const m=st.ui.lmode[st.ui.lang]; st.ui.cmode=(m==='morse'||m==='braille')?m:''; }   /* v47 → v48: tryb tekstu jest jeden dla wszystkich języków */
  if(st&&st.ui&&typeof st.ui==='object'&&st.ui.pgmode===undefined){ if(st.ui.pgfx===true) st.ui.pgmode='gradient'; else if(st.ui.gtheme===false) st.ui.pgmode='off'; }   /* v45 → v46: dwa przełączniki zastąpił jeden wybór */
  if(st&&st.bg&&st.bg.l!==undefined){ const c=hsl2rgb(st.bg.h,st.bg.s,st.bg.l); st.bg={r:c[0],g:c[1],b:c[2],hold:st.bg.h,sat:50,bri:50}; } return st; }
S.settings=merge(DEF,normalize(S.settings)); fixBgs();
// kolory motywu (v49): lista 1–4 kolorów {r,g,b,hold,sat,bri}; bgSel = rozwinięty (edytowany) kolor; bgShape/bgInt = kształt i intensywność przejść
function fixBgs(){ const s=S.settings, num=(v,a,b,d)=>{ v=+v; return Number.isFinite(v)?Math.min(b,Math.max(a,v)):d; };
  if(!Array.isArray(s.bgs)||!s.bgs.length) s.bgs=[{...s.bg}];
  s.bgs=s.bgs.slice(0,4).map(b=>{ b=b&&typeof b==='object'?b:{}; const d=DEF.bg; return {r:Math.round(num(b.r,0,255,d.r)),g:Math.round(num(b.g,0,255,d.g)),b:Math.round(num(b.b,0,255,d.b)),hold:num(b.hold,0,360,d.hold),sat:num(b.sat,0,100,50),bri:num(b.bri,0,100,50)}; });
  s.bgSel=Math.min(s.bgs.length-1,Math.max(0,s.bgSel|0));
  if(!['h','v','dl','dr','rad','full'].includes(s.bgShape)) s.bgShape='h'; if(!['short','mid','long'].includes(s.bgInt)) s.bgInt='mid';
  // v49.1: powtórzenia (1–5), ruch (bgSlide = kierunek lub ''), przechodzenie w miejscu (bgFade), czas jednego koloru, korekty uniwersalne, kilka kolorów akcentu
  s.bgRep=Math.round(num(s.bgRep,1,5,1)); s.bgSpd=num(s.bgSpd,1,60,6); s.accSpd=num(s.accSpd,1,120,6); s.bgFade=!!s.bgFade; s.accFade=!!s.accFade; if(typeof s.bgSlide!=='string') s.bgSlide='';
  s.bgCut=Array.isArray(s.bgCut)&&s.bgCut.length===s.bgs.length-1&&s.bgCut.every(v=>Number.isFinite(+v)&&v>0&&v<1)?s.bgCut.map(Number).sort((a,b)=>a-b):[];   // niestandardowy podział: n−1 pozycji granic (0–1 wzdłuż przejścia), pusty = równy podział
  const adj=a=>{ a=a&&typeof a==='object'?a:{}; return {bri:Math.round(num(a.bri,-100,100,0)),sat:Math.round(num(a.sat,-100,100,0)),r:Math.round(num(a.r,-255,255,0)),g:Math.round(num(a.g,-255,255,0)),b:Math.round(num(a.b,-255,255,0))}; };
  s.bgAdj=adj(s.bgAdj); s.accAdj=adj(s.accAdj);
  const hx=/^#[0-9a-f]{6}$/i; s.accs=(Array.isArray(s.accs)?s.accs:[]).filter(h=>typeof h==='string'&&hx.test(h)).map(h=>h.toLowerCase()).slice(0,4);
  if(!s.accs.length) s.accs=[hx.test(s.acc||'')?s.acc.toLowerCase():'#e8825a']; s.accSel=Math.min(s.accs.length-1,Math.max(0,s.accSel|0)); s.acc=s.accs[0];
  return s.bgs; }
{ const K=S.settings.keys, re=/^(?:Ctrl\+)?(?:Alt\+)?(?:Shift\+)?Mouse(\d{1,2})$/;   // przycisk myszy w skrócie: tylko środkowy/boczne (3–64), bez klawiszy innych niż Ctrl/Alt/Shift; reszta (np. z ręcznie zmienionego pliku) znika
  for(const a in K){ const v=K[a]; if(typeof v==='string'&&v.includes('Mouse')){ const m=re.exec(v); if(!m||+m[1]<3||+m[1]>64) K[a]=''; } } }
S.tourSeen=!!S.tourSeen;   // poradnik po interfejsie pokazał się już raz (v41)
S.gpins=Array.isArray(S.gpins)?S.gpins:[];   // strony przypięte we wszystkich folderach (widoczne zawsze, karta nie zamyka się przy zmianie folderu)
const VERSION='v49';

// ===== src/js/02-i18n.js =====
// ---------- języki interfejsu ----------
const LANGS={pl:'Polski',en:'English',de:'Deutsch',es:'Español',fr:'Français',he:'עברית',zh:'繁體中文',szl:'Ślōnski'};
const ILOC={szl:'pl',zh:'zh-TW'}, IL=()=>ILOC[S.settings.ui.lang]||S.settings.ui.lang;   // kod ustawień -> język formatowania dat/liczb (Intl)

// ===== src/js/03-i18n-data.js =====
const LROWS=[["Strona startowa","Home page","Startseite","Página de inicio","Page d’accueil","דף הבית","首頁","Sztartowo zajta"],["Wstecz","Back","Zurück","Atrás","Retour","חזרה","上一頁","Nazod"],["Dalej","Forward","Vor","Adelante","Avancer","קדימה","下一頁","Dalij"],["Odśwież","Reload","Neu laden","Recargar","Actualiser","רענן","重新整理","Ôdświyż"],["Zapytaj asystenta lub wpisz adres…","Ask the assistant or enter an address...","Assistenten fragen oder Adresse eingeben...","Pregunta al asistente o escribe una dirección...","Demandez à l’assistant ou saisissez une adresse...","שאל את העוזר או הקלד כתובת...","詢問助理或輸入網址...","Spytej asystynta abo wpisz adres..."],["Minimalizuj","Minimize","Minimieren","Minimizar","Réduire","מזער","最小化","Zminimalizuj"],["Maksymalizuj","Maximize","Maximieren","Maximizar","Agrandir","הגדל","最大化","Zmaksymalizuj"],["Zamknij","Close","Schließen","Cerrar","Fermer","סגור","關閉","Zawrzij"],["Nowa karta","New tab","Neuer Tab","Nueva pestaña","Nouvel onglet","כרטיסייה חדשה","新分頁","Nowo karta"],["Tutaj dzieje się Magia","This is where the Magic happens","Hier geschieht die Magie","Aquí es donde ocurre la Magia","C’est ici que la Magie opère","כאן קורה הקסם","魔法，就在這裡發生","Tukej sie dzieje Magijo"],["O co chcesz zapytać?","What do you want to ask?","Was möchtest du fragen?","¿Qué quieres preguntar?","Que voulez-vous demander ?","מה תרצה לשאול?","你想問什麼？","Ô co chcesz spytać?"],["Zaloguj się raz, naciśnij Enter, by wysłać","Sign in once, press Enter to send","Einmal anmelden, zum Senden Enter drücken","Inicia sesión una vez y pulsa Intro para enviar","Connectez-vous une fois, Entrée pour envoyer","התחבר פעם אחת, לחץ Enter כדי לשלוח","登入一次後，按 Enter 傳送","Zaloguj sia roz, wciś Enter, coby posłać"],["Zamknij panel","Close panel","Panel schließen","Cerrar panel","Fermer le panneau","סגור לוח","關閉面板","Zawrzij panel"],["Foldery","Folders","Ordner","Carpetas","Dossiers","תיקיות","資料夾","Foldery"],["Nowy folder","New folder","Neuer Ordner","Nueva carpeta","Nouveau dossier","תיקייה חדשה","新資料夾","Nowy folder"],["Usuń folder","Delete folder","Ordner löschen","Eliminar carpeta","Supprimer le dossier","מחק תיקייה","刪除資料夾","Skasuj folder"],["Ustawienia","Settings","Einstellungen","Ajustes","Paramètres","הגדרות","設定","Ustawiynia"],["Panel asystenta","Assistant panel","Assistenten-Panel","Panel del asistente","Panneau de l’assistant","חלונית העוזר","助理面板","Panel asystynta"],["Duplikuj kartę","Duplicate tab","Tab duplizieren","Duplicar pestaña","Dupliquer l’onglet","שכפל כרטיסייה","複製分頁","Zduplikuj karta"],["Odśwież kartę","Reload tab","Tab neu laden","Recargar pestaña","Actualiser l’onglet","רענן כרטיסייה","重新整理分頁","Ôdświyż karta"],["Przypnij kartę","Pin tab","Tab anheften","Fijar pestaña","Épingler l’onglet","הצמד כרטיסייה","釘選分頁","Przipnij karta"],["Odepnij kartę","Unpin tab","Tab lösen","Desfijar pestaña","Désépingler l’onglet","בטל הצמדת כרטיסייה","取消釘選分頁","Ôdpnij karta"],["Wycisz kartę","Mute tab","Tab stummschalten","Silenciar pestaña","Couper le son de l’onglet","השתק כרטיסייה","將分頁靜音","Wycisz karta"],["Włącz dźwięk karty","Unmute tab","Tab-Ton einschalten","Activar sonido de la pestaña","Réactiver le son de l’onglet","בטל השתקת כרטיסייה","取消分頁靜音","Włōncz dźwiyk karty"],["Zamknij kartę","Close tab","Tab schließen","Cerrar pestaña","Fermer l’onglet","סגור כרטיסייה","關閉分頁","Zawrzij karta"],["Przywróć zamkniętą kartę","Reopen closed tab","Geschlossenen Tab wiederherstellen","Reabrir pestaña cerrada","Rouvrir l’onglet fermé","שחזר כרטיסייה שנסגרה","重新開啟已關閉的分頁","Przywrōć zawartõ karta"],["Zamknij wszystkie karty","Close all tabs","Alle Tabs schließen","Cerrar todas las pestañas","Fermer tous les onglets","סגור את כל הכרטיסיות","關閉所有分頁","Zawrzij wszystkie karty"],["Odśwież wszystkie karty","Reload all tabs","Alle Tabs neu laden","Recargar todas las pestañas","Actualiser tous les onglets","רענן את כל הכרטיסיות","重新整理所有分頁","Ôdświyż wszystkie karty"],["Przypnij wszystkie karty","Pin all tabs","Alle Tabs anheften","Fijar todas las pestañas","Épingler tous les onglets","הצמד את כל הכרטיסיות","釘選所有分頁","Przipnij wszystkie karty"],["Odepnij wszystkie karty","Unpin all tabs","Alle Tabs lösen","Desfijar todas las pestañas","Désépingler tous les onglets","בטל הצמדת כל הכרטיסיות","取消釘選所有分頁","Ôdpnij wszystkie karty"],["Wycisz wszystkie karty","Mute all tabs","Alle Tabs stummschalten","Silenciar todas las pestañas","Couper le son de tous les onglets","השתק את כל הכרטיסיות","將所有分頁靜音","Wycisz wszystkie karty"],["Włącz dźwięk wszystkich kart","Unmute all tabs","Ton aller Tabs einschalten","Activar sonido de todas las pestañas","Réactiver le son de tous les onglets","בטל השתקת כל הכרטיסיות","取消所有分頁靜音","Włōncz dźwiyk wszystkich kart"],["Zmień ikonę","Change icon","Symbol ändern","Cambiar icono","Changer l’icône","שנה סמל","變更圖示","Zmiyń ikōna"],["Zmień nazwę","Rename","Umbenennen","Renombrar","Renommer","שנה שם","重新命名","Zmiyń miano"],["Duplikuj folder","Duplicate folder","Ordner duplizieren","Duplicar carpeta","Dupliquer le dossier","שכפל תיקייה","複製資料夾","Zduplikuj folder"],["własna ikona + Enter","custom icon + Enter","eigenes Symbol + Enter","icono propio + Intro","icône perso + Entrée","סמל מותאם + Enter","自訂圖示 + Enter","włosno ikōna + Enter"],["Anuluj","Cancel","Abbrechen","Cancelar","Annuler","ביטול","取消","Anuluj"],["Usuń","Delete","Löschen","Eliminar","Supprimer","מחק","刪除","Skasuj"],["Przywróć","Restore","Wiederherstellen","Restaurar","Restaurer","שחזר","還原","Przywrōć"],["Przypisz tutaj","Assign here","Hier zuweisen","Asignar aquí","Assigner ici","הקצה כאן","在此指派","Przipisz tu"],["Rozumiem","Got it","Verstanden","Entendido","Compris","הבנתי","知道了","Rozumia"],["Usunąć folder „{n}”?","Delete folder “{n}”?","Ordner „{n}“ löschen?","¿Eliminar la carpeta «{n}»?","Supprimer le dossier « {n} » ?","למחוק את התיקייה “{n}”?","要刪除資料夾「{n}」嗎？","Skasować folder „{n}”?"],["Wszystkie karty z tego folderu ({n}) zostaną zamknięte. Tej operacji nie można cofnąć.","All tabs in this folder ({n}) will be closed. This cannot be undone.","Alle Tabs in diesem Ordner ({n}) werden geschlossen. Das lässt sich nicht rückgängig machen.","Se cerrarán todas las pestañas de esta carpeta ({n}). No se puede deshacer.","Tous les onglets de ce dossier ({n}) seront fermés. Cette action est irréversible.","כל הכרטיסיות בתיקייה זו ({n}) ייסגרו. לא ניתן לבטל פעולה זו.","此資料夾中的所有分頁（{n}）都會被關閉，且無法復原。","Wszystkie karty we tym foldrze ({n}) bydōm zawarte. Tego niy idzie cofnōńć."],["Przywrócić ustawienia domyślne?","Restore default settings?","Standardeinstellungen wiederherstellen?","¿Restaurar los ajustes predeterminados?","Rétablir les paramètres par défaut ?","לשחזר את הגדרות ברירת המחדל?","要還原預設設定嗎？","Przywrōcić ustawiynia dômyślne?"],["Wszystkie ustawienia (motyw, interfejs, aplikacje, historia i skróty) wrócą do wartości fabrycznych. Karty i foldery zostaną bez zmian.","All settings (theme, interface, apps, history and shortcuts) will return to factory values. Tabs and folders stay untouched.","Alle Einstellungen (Motiv, Oberfläche, Apps, Verlauf und Kürzel) werden zurückgesetzt. Tabs und Ordner bleiben unverändert.","Todos los ajustes (tema, interfaz, aplicaciones, historial y atajos) volverán a los valores de fábrica. Las pestañas y carpetas no cambian.","Tous les réglages (thème, interface, applications, historique et raccourcis) reviendront aux valeurs d’usine. Onglets et dossiers restent inchangés.","כל ההגדרות (ערכת נושא, ממשק, אפליקציות, היסטוריה וקיצורים) יחזרו לערכי היצרן. הכרטיסיות והתיקיות יישארו ללא שינוי.","所有設定（主題、介面、應用程式、歷史記錄與快速鍵）將恢復為原廠值，分頁與資料夾不會受到影響。","Wszyskie ustawiynia (motyw, interfejs, aplikacyje, historyjŏ i skrōty) wrōcōm do fabrycznych wartości. Karty i foldery ostanōm bez zmian."],["Przywrócić domyślne skróty?","Restore default shortcuts?","Standard-Tastenkürzel wiederherstellen?","¿Restaurar los atajos predeterminados?","Rétablir les raccourcis par défaut ?","לשחזר את קיצורי ברירת המחדל?","要還原預設快速鍵嗎？","Przywrōcić dômyślne skrōty?"],["Wszystkie skróty klawiszowe wrócą do ustawień fabrycznych.","All keyboard shortcuts will return to factory settings.","Alle Tastenkürzel werden zurückgesetzt.","Todos los atajos de teclado volverán a los valores de fábrica.","Tous les raccourcis clavier reviendront aux réglages d’usine.","כל קיצורי המקלדת יחזרו להגדרות היצרן.","所有鍵盤快速鍵都會恢復為原廠設定。","Wszyjske skrōty klawiatury wrōcōm do ustawiyń fabrycznych."],["Ta kombinacja jest zarezerwowana","This combination is reserved","Diese Kombination ist reserviert","Esta combinación está reservada","Cette combinaison est réservée","שילוב זה שמור","此組合鍵已被保留","Ta kombinacyjŏ je zarezerwowano"],["{k} służy do kopiowania, wklejania i cofania w polach tekstowych. Wybierz inną kombinację.","{k} is used for copy, paste and undo in text fields. Choose a different combination.","{k} wird zum Kopieren, Einfügen und Rückgängigmachen in Textfeldern verwendet. Wähle eine andere Kombination.","{k} se usa para copiar, pegar y deshacer en los campos de texto. Elige otra combinación.","{k} sert à copier, coller et annuler dans les champs de texte. Choisissez une autre combinaison.","{k} משמש להעתקה, הדבקה וביטול בשדות טקסט. בחר שילוב אחר.","{k} 用於文字欄位中的複製、貼上與復原，請選擇其他組合。","{k} służy do kopiowaniŏ, wklejaniŏ i cofaniŏ w polach tekstu. Wybier inkszõ kombinacyjõ."],["{k} to AltGr+{x}, czyli polskie znaki. Wybierz inną kombinację.","{k} is AltGr+{x}, which types special characters. Choose a different combination.","{k} ist AltGr+{x} und erzeugt Sonderzeichen. Wähle eine andere Kombination.","{k} es AltGr+{x}, que escribe caracteres especiales. Elige otra combinación.","{k} correspond à AltGr+{x} et produit des caractères spéciaux. Choisissez une autre combinaison.","{k} הוא AltGr+{x}, כלומר תווים מיוחדים. בחר שילוב אחר.","{k} 是 AltGr+{x}，用於輸入特殊字元，請選擇其他組合。","{k} to AltGr+{x}, czyli polske znaki. Wybier inkszõ kombinacyjõ."],["Ten skrót jest już używany","This shortcut is already in use","Dieses Kürzel wird bereits verwendet","Este atajo ya está en uso","Ce raccourci est déjà utilisé","קיצור זה כבר בשימוש","此快速鍵已被使用","Ten skrōt je już używany"],["Kombinacja {k} jest przypisana do opcji „{a}”. Przypisanie jej tutaj usunie ją z tamtej opcji.","The combination {k} is assigned to “{a}”. Assigning it here will remove it from there.","Die Kombination {k} ist „{a}“ zugewiesen. Eine Zuweisung hier entfernt sie dort.","La combinación {k} está asignada a «{a}». Asignarla aquí la quitará de allí.","La combinaison {k} est assignée à « {a} ». L’assigner ici la retirera de là-bas.","השילוב {k} מוקצה ל“{a}”. הקצאתו כאן תסיר אותו משם.","組合鍵 {k} 已指派給「{a}」，在此指派會將它從原功能移除。","Kombinacyjŏ {k} je przipisano do „{a}”. Jak jã tukej przipiszesz, to ôdpadnie stōnd."],["⚙ Ustawienia","⚙ Settings","⚙ Einstellungen","⚙ Ajustes","⚙ Paramètres","⚙ הגדרות","⚙ 設定","⚙ Ustawiynia"],["Motyw","Theme","Design","Tema","Thème","ערכת נושא","主題","Motyw"],["Interfejs","Interface","Oberfläche","Interfaz","Interface","ממשק","介面","Interfejs"],["Skróty","Shortcuts","Kürzel","Atajos","Raccourcis","קיצורים","快速鍵","Skrōty"],["Kolor tła","Background color","Hintergrundfarbe","Color de fondo","Couleur de fond","צבע רקע","背景顏色","Farba tła"],["Nasycenie","Saturation","Sättigung","Saturación","Saturation","רוויה","飽和度","Nasycyniy"],["Jasność","Brightness","Helligkeit","Brillo","Luminosité","בהירות","亮度","Jasność"],["Zaawansowane (panel RGB)","Advanced (RGB panel)","Erweitert (RGB-Regler)","Avanzado (panel RGB)","Avancé (panneau RVB)","מתקדם (לוח RGB)","進階（RGB 面板）","Zaawansowane (panel RGB)"],["R — czerwony","R — red","R — Rot","R — rojo","R — rouge","R — אדום","R — 紅","R — czerwōny"],["G — zielony","G — green","G — Grün","G — verde","V — vert","G — ירוק","G — 綠","G — zielōny"],["B — niebieski","B — blue","B — Blau","B — azul","B — bleu","B — כחול","B — 藍","B — niebieski"],["Każdy suwak działa niezależnie. Nasycenie i jasność są korektą nałożoną na kolor z RGB.","Every slider works independently. Saturation and brightness are corrections applied on top of the RGB color.","Jeder Regler arbeitet unabhängig. Sättigung und Helligkeit sind Korrekturen auf der RGB-Farbe.","Cada control funciona de forma independiente. Saturación y brillo son correcciones sobre el color RGB.","Chaque curseur est indépendant. Saturation et luminosité sont des corrections appliquées à la couleur RVB.","כל מחוון פועל בנפרד. רוויה ובהירות הן תיקון המופעל על צבע ה-RGB.","每個滑桿皆獨立運作。飽和度與亮度是疊加在 RGB 顏色上的修正。","Kożdy suwak robi ôsobno. Nasycyniy i jasność to poprawka na farbie z RGB."],["Kolor akcentu","Accent color","Akzentfarbe","Color de acento","Couleur d’accent","צבע הדגשה","強調色","Farba akcyntu"],["Efekty tła","Background effects","Hintergrundeffekte","Efectos de fondo","Effets d’arrière-plan","אפקטי רקע","背景效果","Efekty tła"],["Wszystkie efekty","All effects","Alle Effekte","Todos los efectos","Tous les effets","כל האפקטים","所有效果","Wszystkie efekty"],["Świecący pył","Glowing dust","Leuchtender Staub","Polvo luminoso","Poussière lumineuse","אבק זוהר","發光塵埃","Świycōncy pył"],["Fale","Waves","Wellen","Olas","Vagues","גלים","波浪","Fale"],["Migoczące gwiazdy","Twinkling stars","Funkelnde Sterne","Estrellas parpadeantes","Étoiles scintillantes","כוכבים נוצצים","閃爍的星星","Migotajōnce gwiozdy"],["Zorza","Aurora","Polarlicht","Aurora","Aurore","זוהר קוטבי","極光","Zorza"],["Deszcz światła","Rain of light","Lichtregen","Lluvia de luz","Pluie de lumière","גשם של אור","光雨","Dyszcz świotła"],["Obraz tła","Background image","Hintergrundbild","Imagen de fondo","Image de fond","תמונת רקע","背景圖片","Ôbrŏz tła"],["Wybierz obraz…","Choose image…","Bild wählen…","Elegir imagen…","Choisir une image…","בחר תמונה…","選擇圖片…","Wybier ôbrŏz…"],["Usuń obraz","Remove image","Bild entfernen","Quitar imagen","Retirer l’image","הסר תמונה","移除圖片","Skasuj ôbrŏz"],["Krycie obrazu","Image opacity","Bilddeckkraft","Opacidad de la imagen","Opacité de l’image","אטימות התמונה","圖片不透明度","Kryciy ôbrŏzu"],["Rozmycie","Blur","Weichzeichnung","Desenfoque","Flou","טשטוש","模糊","Rozmazaniy"],["Przyciemnienie","Dimming","Abdunkelung","Oscurecimiento","Assombrissement","הכהיה","變暗","Przyciymnianiy"],["Nasycenie obrazu","Image saturation","Bildsättigung","Saturación de la imagen","Saturation de l’image","רוויית התמונה","圖片飽和度","Nasycyniy ôbrŏzu"],["Dopasowanie","Fit","Anpassung","Ajuste","Ajustement","התאמה","符合方式","Dopasowaniy"],["Wypełnij","Fill","Füllen","Rellenar","Remplir","מלא","填滿","Wypełnij"],["Dopasuj","Contain","Einpassen","Contener","Contenir","התאם","適應","Dopasuj"],["Konfiguracja","Configuration","Konfiguration","Configuración","Configuration","תצורה","設定檔","Kōnfiguracyjŏ"],["Zapisz do pliku…","Save to file…","In Datei speichern…","Guardar en archivo…","Enregistrer dans un fichier…","שמור לקובץ…","儲存至檔案…","Zapisz do plika…"],["Wczytaj z pliku…","Load from file…","Aus Datei laden…","Cargar desde archivo…","Charger depuis un fichier…","טען מקובץ…","從檔案載入…","Wczytej z plika…"],["Domyślne","Defaults","Standard","Predeterminado","Par défaut","ברירות מחדל","預設值","Dômyślne"],["Anulowano.","Cancelled.","Abgebrochen.","Cancelado.","Annulé.","בוטל.","已取消。","Anulowano."],["Zapisano:","Saved:","Gespeichert:","Guardado:","Enregistré :","נשמר:","已儲存：","Zapisano:"],["Wczytano konfigurację ✓","Configuration loaded ✓","Konfiguration geladen ✓","Configuración cargada ✓","Configuration chargée ✓","התצורה נטענה ✓","已載入設定 ✓","Wczytano kōnfiguracyjõ ✓"],["Nie udało się wczytać pliku konfiguracji.","Could not load the configuration file.","Konfigurationsdatei konnte nicht geladen werden.","No se pudo cargar el archivo de configuración.","Impossible de charger le fichier de configuration.","לא ניתן היה לטעון את קובץ התצורה.","無法載入設定檔。","Niy szło wczytać plika kōnfiguracyji."],["Brak obsługi – podmień main.js i preload.js na nowe.","Not supported – replace main.js and preload.js with the new ones.","Nicht unterstützt – ersetze main.js und preload.js durch die neuen.","No compatible: sustituye main.js y preload.js por los nuevos.","Non pris en charge : remplacez main.js et preload.js par les nouveaux.","לא נתמך – החלף את main.js ו-preload.js בחדשים.","不支援 — 請將 main.js 與 preload.js 換成新版。","Niy ôbsłōgiwane – podmiyń main.js i preload.js na nowe."],["Zapisz konfigurację","Save configuration","Konfiguration speichern","Guardar configuración","Enregistrer la configuration","שמור תצורה","儲存設定","Zapisz kōnfiguracyjõ"],["Wczytaj konfigurację","Load configuration","Konfiguration laden","Cargar configuración","Charger la configuration","טען תצורה","載入設定","Wczytej kōnfiguracyjõ"],["Kliknij skrót i naciśnij nową kombinację (do 4 klawiszy naraz). Wymagany jest Ctrl lub Alt albo klawisz F1–F12. Esc anuluje.","Click a shortcut and press a new combination (up to 4 keys at once). Ctrl or Alt, or an F1–F12 key, is required. Esc cancels.","Klicke auf ein Kürzel und drücke eine neue Kombination (bis zu 4 Tasten gleichzeitig). Ctrl oder Alt oder eine F1–F12-Taste ist erforderlich. Esc bricht ab.","Haz clic en un atajo y pulsa una nueva combinación (hasta 4 teclas a la vez). Se requiere Ctrl o Alt, o una tecla F1–F12. Esc cancela.","Cliquez sur un raccourci et appuyez sur une nouvelle combinaison (jusqu’à 4 touches). Ctrl ou Alt, ou une touche F1–F12, est requis. Échap annule.","לחץ על קיצור והקש שילוב חדש (עד 4 מקשים בו-זמנית). נדרש Ctrl או Alt, או מקש F1–F12. Esc מבטל.","點選快速鍵後按下新的組合（最多同時 4 個按鍵）。必須包含 Ctrl 或 Alt，或使用 F1–F12 鍵。按 Esc 取消。","Kliknij skrōt i wciś nowõ kombinacyjõ (do 4 klawiszy naroz). Trza Ctrl abo Alt, abo klawisz F1–F12. Esc anuluje."],["Karty","Tabs","Tabs","Pestañas","Onglets","כרטיסיות","分頁","Karty"],["Wszystkie karty","All tabs","Alle Tabs","Todas las pestañas","Tous les onglets","כל הכרטיסיות","所有分頁","Wszystkie karty"],["Nawigacja","Navigation","Navigation","Navegación","Navigation","ניווט","導覽","Nawigacyjŏ"],["Przypnij / odepnij kartę","Pin / unpin tab","Tab anheften / lösen","Fijar / desfijar pestaña","Épingler / désépingler l’onglet","הצמד / בטל הצמדת כרטיסייה","釘選／取消釘選分頁","Przipnij / ôdpnij karta"],["Wycisz / włącz dźwięk karty","Mute / unmute tab","Tab stummschalten / Ton an","Silenciar / activar sonido de la pestaña","Couper / réactiver le son de l’onglet","השתק / בטל השתקת כרטיסייה","分頁靜音／取消靜音","Wycisz / włōncz dźwiyk karty"],["Przypnij / odepnij wszystkie","Pin / unpin all","Alle anheften / lösen","Fijar / desfijar todas","Épingler / désépingler tous","הצמד / בטל הצמדת הכל","全部釘選／取消釘選","Przipnij / ôdpnij wszystkie"],["Wycisz / włącz dźwięk wszystkich","Mute / unmute all","Alle stummschalten / Ton an","Silenciar / activar sonido de todas","Couper / réactiver le son de tous","השתק / בטל השתקת הכל","全部靜音／取消靜音","Wycisz / włōncz dźwiyk wszystkich"],["Następna karta","Next tab","Nächster Tab","Pestaña siguiente","Onglet suivant","הכרטיסייה הבאה","下一個分頁","Nastympno karta"],["Poprzednia karta","Previous tab","Vorheriger Tab","Pestaña anterior","Onglet précédent","הכרטיסייה הקודמת","上一個分頁","Piyrwyjszo karta"],["Pasek adresu","Address bar","Adressleiste","Barra de direcciones","Barre d’adresse","שורת כתובת","網址列","Pasek adresu"],["Duplikuj bieżący folder","Duplicate current folder","Aktuellen Ordner duplizieren","Duplicar carpeta actual","Dupliquer le dossier actuel","שכפל את התיקייה הנוכחית","複製目前資料夾","Zduplikuj terŏzniejszy folder"],["Zmień nazwę bieżącego folderu","Rename current folder","Aktuellen Ordner umbenennen","Renombrar carpeta actual","Renommer le dossier actuel","שנה שם של התיקייה הנוכחית","重新命名目前資料夾","Zmiyń miano terŏzniejszego foldra"],["Następny folder","Next folder","Nächster Ordner","Carpeta siguiente","Dossier suivant","התיקייה הבאה","下一個資料夾","Nastympny folder"],["Poprzedni folder","Previous folder","Vorheriger Ordner","Carpeta anterior","Dossier précédent","התיקייה הקודמת","上一個資料夾","Piyrwyjszy folder"],["Narzędzia deweloperskie","Developer tools","Entwicklertools","Herramientas de desarrollo","Outils de développement","כלי פיתוח","開發人員工具","Nŏrzyndzia deweloperske"],["Naciśnij klawisze…","Press keys…","Tasten drücken…","Pulsa las teclas…","Appuyez sur les touches…","הקש על מקשים…","請按下按鍵…","Wciś klawisze…"],["brak","none","keins","ninguno","aucun","אין","無","niy ma"],["Usuń skrót","Remove shortcut","Kürzel entfernen","Quitar atajo","Supprimer le raccourci","הסר קיצור","移除快速鍵","Skasuj skrōt"],["Przywróć domyślne skróty","Restore default shortcuts","Standard-Kürzel wiederherstellen","Restaurar atajos predeterminados","Rétablir les raccourcis par défaut","שחזר קיצורי ברירת מחדל","還原預設快速鍵","Przywrōć dômyślne skrōty"],["Maksymalnie 4 klawisze naraz.","Maximum 4 keys at once.","Höchstens 4 Tasten gleichzeitig.","Máximo 4 teclas a la vez.","4 touches maximum à la fois.","עד 4 מקשים בו-זמנית.","最多同時 4 個按鍵。","Maksymalnie 4 klawisze naroz."],["Skrót musi zawierać klawisz z Ctrl lub Alt (albo F1–F12).","A shortcut must include a key with Ctrl or Alt (or F1–F12).","Ein Kürzel muss eine Taste mit Ctrl oder Alt enthalten (oder F1–F12).","Un atajo debe incluir una tecla con Ctrl o Alt (o F1–F12).","Un raccourci doit comporter une touche avec Ctrl ou Alt (ou F1–F12).","הקיצור חייב לכלול מקש עם Ctrl או Alt (או F1–F12).","快速鍵必須包含 Ctrl 或 Alt（或使用 F1–F12）。","Skrōt musi mieć klawisz z Ctrl abo Alt (abo F1–F12)."],["Przyciski okna","Window buttons","Fensterschaltflächen","Botones de ventana","Boutons de fenêtre","כפתורי חלון","視窗按鈕","Przyciski ôkna"],["Minimalizuj, maksymalizuj, zamknij","Minimize, maximize, close","Minimieren, Maximieren, Schließen","Minimizar, maximizar, cerrar","Réduire, agrandir, fermer","מזער, הגדל, סגור","最小化、最大化、關閉","Zminimalizuj, zmaksymalizuj, zawrzij"],["Przyciski nawigacji","Navigation buttons","Navigationsschaltflächen","Botones de navegación","Boutons de navigation","כפתורי ניווט","導覽按鈕","Przyciski nawigacyji"],["Strzałki, odświeżanie i napis Arkana","Arrows, reload and the Arkana title","Pfeile, Neu laden und der Arkana-Schriftzug","Flechas, recargar y el título Arkana","Flèches, actualisation et titre Arkana","חצים, רענון וכיתוב Arkana","箭頭、重新整理與 Arkana 標題","Strzołki, ôdświyżaniy i napis Arkana"],["Prosty","Simple","Einfach","Sencillo","Simple","פשוט","簡單","Prosty"],["Rozbudowany","Fancy","Aufwendig","Elaborado","Élaboré","מורחב","華麗","Rozbudowany"],["Animacje","Animations","Animationen","Animaciones","Animations","אנימציות","動畫","Animacyje"],["Wyłącz animacje osobno dla każdego miejsca.","Turn animations off separately for each area.","Animationen für jeden Bereich einzeln ausschalten.","Desactiva las animaciones por separado en cada zona.","Désactivez les animations séparément pour chaque zone.","כבה אנימציות בנפרד לכל אזור.","可分別關閉各區域的動畫。","Wyłōncz animacyje ôsobno dlŏ kożdego placu."],["Przyciski","Buttons","Schaltflächen","Botones","Boutons","כפתורים","按鈕","Przyciski"],["Język","Language","Sprache","Idioma","Langue","שפה","語言","Godka"],["Zmiana języka odświeża interfejs.","Changing the language reloads the interface.","Ein Sprachwechsel lädt die Oberfläche neu.","Cambiar el idioma recarga la interfaz.","Changer de langue recharge l’interface.","שינוי השפה מרענן את הממשק.","變更語言會重新載入介面。","Zmiana godki ôdświyży interfejs."],["Praca","Work","Arbeit","Trabajo","Travail","עבודה","工作","Robota"],["Prywatne","Personal","Privat","Personal","Perso","אישי","個人","Prywatne"],["kopia","copy","Kopie","copia","copie","עותק","複本","kopijŏ"],["Folder","Folder","Ordner","Carpeta","Dossier","תיקייה","資料夾","Folder"],["Aplikacje","Apps","Apps","Aplicaciones","Applications","אפליקציות","應用程式","Aplikacyje"],["Pasek aplikacji","App bar","App-Leiste","Barra de aplicaciones","Barre d’applications","סרגל אפליקציות","應用程式列","Pasek aplikacyji"],["Dodane do paska","Added to the bar","Zur Leiste hinzugefügt","Añadidas a la barra","Ajoutées à la barre","נוספו לסרגל","已加入列中","Dodane do paska"],["Dostępne aplikacje","Available apps","Verfügbare Apps","Aplicaciones disponibles","Applications disponibles","אפליקציות זמינות","可用的應用程式","Dostympne aplikacyje"],["Brak aplikacji na pasku.","No apps on the bar.","Keine Apps in der Leiste.","No hay aplicaciones en la barra.","Aucune application dans la barre.","אין אפליקציות בסרגל.","列中沒有應用程式。","Niy ma aplikacyji na pasku."],["Aplikacje możesz dodać w ustawieniach, w sekcji Aplikacje.","You can add apps in Settings, in the Apps section.","Apps kannst du in den Einstellungen im Bereich Apps hinzufügen.","Puedes añadir aplicaciones en Ajustes, en la sección Aplicaciones.","Vous pouvez ajouter des applications dans Paramètres, section Applications.","ניתן להוסיף אפליקציות בהגדרות, בסעיף אפליקציות.","你可以在設定的「應用程式」區塊中新增應用程式。","Aplikacyje idzie dodać w ustawiyniach, w czyńści Aplikacyje."],["Otwórz ustawienia","Open settings","Einstellungen öffnen","Abrir ajustes","Ouvrir les paramètres","פתח הגדרות","開啟設定","Ôtwōrz ustawiynia"],["Kliknij aplikację poniżej, aby ją dodać.","Click an app below to add it.","Klicke unten auf eine App, um sie hinzuzufügen.","Haz clic en una aplicación de abajo para añadirla.","Cliquez sur une application ci-dessous pour l’ajouter.","לחץ על אפליקציה למטה כדי להוסיף אותה.","點選下方的應用程式即可新增。","Kliknij aplikacyjõ na dole, coby jã dodać."],["Wszystkie aplikacje są już na pasku.","All apps are already on the bar.","Alle Apps sind bereits in der Leiste.","Todas las aplicaciones ya están en la barra.","Toutes les applications sont déjà dans la barre.","כל האפליקציות כבר בסרגל.","所有應用程式都已在列中。","Wszystkie aplikacyje już sōm na pasku."],["＋ Dodaj","＋ Add","＋ Hinzufügen","＋ Añadir","＋ Ajouter","＋ הוסף","＋ 新增","＋ Dodej"],["− Usuń","− Remove","− Entfernen","− Quitar","− Retirer","− הסר","− 移除","− Skasuj"],["wkrótce","soon","bald","pronto","bientôt","בקרוב","即將推出","wnet"],["Zamknij aplikację","Close app","App schließen","Cerrar aplicación","Fermer l’application","סגור אפליקציה","關閉應用程式","Zawrzij aplikacyjõ"],["Okno testowe","Test window","Testfenster","Ventana de prueba","Fenêtre de test","חלון בדיקה","測試視窗","Ôkno testowe"],["Puste okno do sprawdzenia logiki aplikacji","Empty window for testing app logic","Leeres Fenster zum Testen der App-Logik","Ventana vacía para probar la lógica","Fenêtre vide pour tester la logique","חלון ריק לבדיקת לוגיקת האפליקציה","用於測試應用程式邏輯的空白視窗","Pusto ôkno do sprawdzaniŏ logiki aplikacyji"],["Kalkulator","Calculator","Taschenrechner","Calculadora","Calculatrice","מחשבון","計算機","Kalkulatōr"],["Kalendarz","Calendar","Kalender","Calendario","Calendrier","לוח שנה","行事曆","Kalyndorz"],["Notatnik","Notepad","Notizblock","Bloc de notas","Bloc-notes","פנקס רשימות","記事本","Zeszyt"],["Zegar","Clock","Uhr","Reloj","Horloge","שעון","時鐘","Zegar"],["Stoper","Stopwatch","Stoppuhr","Cronómetro","Chronomètre","שעון עצר","碼錶","Stoper"],["Lista zadań","To-do list","Aufgabenliste","Lista de tareas","Liste de tâches","רשימת משימות","待辦清單","Lista zadań"],["Konwerter","Converter","Umrechner","Conversor","Convertisseur","ממיר","轉換器","Przelicznik"],["Pogoda","Weather","Wetter","Tiempo","Météo","מזג אוויר","天氣","Pogoda"],["Tłumacz","Translator","Übersetzer","Traductor","Traducteur","מתרגם","翻譯","Przekładacz"],["Odtwarzacz","Player","Player","Reproductor","Lecteur","נגן","播放器","Ôdtwarzacz"],["Naukowy","Scientific","Wissenschaftlich","Científica","Scientifique","מדעי","科學型","Naukowy"],["Historia","History","Verlauf","Historial","Historique","היסטוריה","歷史記錄","Historyjŏ"],["Wyczyść historię","Clear history","Verlauf löschen","Borrar historial","Effacer l’historique","נקה היסטוריה","清除記錄","Wyczyść historyjõ"],["Brak historii obliczeń.","No calculation history.","Kein Berechnungsverlauf.","Sin historial de cálculos.","Aucun historique de calculs.","אין היסטוריית חישובים.","沒有計算記錄。","Niy ma historyji ôbliczyń."],["Błąd","Error","Fehler","Error","Erreur","שגיאה","錯誤","Błōnd"],["Kalkulator prosty i naukowy z historią obliczeń","Simple and scientific calculator with history","Einfacher und wissenschaftlicher Rechner mit Verlauf","Calculadora sencilla y científica con historial","Calculatrice simple et scientifique avec historique","מחשבון פשוט ומדעי עם היסטוריית חישובים","附計算記錄的標準型與科學型計算機","Prosty i naukowy kalkulatōr z historyjōm ôbliczyń"],["Wiele notatek z obsługą emoji","Multiple notes with emoji support","Mehrere Notizen mit Emoji-Unterstützung","Varias notas con compatibilidad de emojis","Plusieurs notes avec prise en charge des emojis","מספר פתקים עם תמיכה באימוג'י","支援表情符號的多則筆記","Moc zapiskōw ze wsparciym emoji"],["Nowa notatka","New note","Neue Notiz","Nueva nota","Nouvelle note","פתק חדש","新增筆記","Nowy zapisek"],["Szukaj w notatkach…","Search notes…","Notizen durchsuchen…","Buscar en notas…","Rechercher dans les notes…","חפש בפתקים…","搜尋筆記…","Szukej we zapiskach…"],["Lista notatek","Notes list","Notizenliste","Lista de notas","Liste des notes","רשימת פתקים","筆記清單","Lista zapiskōw"],["Usuń notatkę","Delete note","Notiz löschen","Eliminar nota","Supprimer la note","מחק פתק","刪除筆記","Skasuj zapisek"],["Zacznij pisać…","Start typing…","Fang an zu schreiben…","Empieza a escribir…","Commencez à écrire…","התחל להקליד…","開始輸入…","Zacznij pisać…"],["Bez tytułu","Untitled","Ohne Titel","Sin título","Sans titre","ללא כותרת","無標題","Bez tytułu"],["znaków","characters","Zeichen","caracteres","caractères","תווים","字元","znakōw"],["Usunąć notatkę?","Delete this note?","Diese Notiz löschen?","¿Eliminar esta nota?","Supprimer cette note ?","למחוק את הפתק?","要刪除這則筆記嗎？","Skasować tyn zapisek?"],["Tej operacji nie można cofnąć.","This cannot be undone.","Das lässt sich nicht rückgängig machen.","No se puede deshacer.","Cette action est irréversible.","לא ניתן לבטל פעולה זו.","此操作無法復原。","Tego niy idzie cofnōńć."],["Blokuj o inne okna","Block against other windows","An anderen Fenstern blockieren","Bloquear contra otras ventanas","Bloquer contre les autres fenêtres","חסום מול חלונות אחרים","與其他視窗碰撞","Zablokuj ô inksze ôkna"],["Scal stykające się okna","Merge touching windows","Berührende Fenster verbinden","Unir ventanas en contacto","Fusionner les fenêtres en contact","מזג חלונות נוגעים","合併相接的視窗","Zlep stykajōnce sia ôkna"],["Oddziel okno od grupy","Detach window from group","Fenster aus Gruppe lösen","Separar ventana del grupo","Détacher la fenêtre du groupe","נתק חלון מהקבוצה","將視窗從群組分離","Ôddziel ôkno ôd grupy"],["Anuluj przesuwanie","Cancel move","Verschieben abbrechen","Cancelar movimiento","Annuler le déplacement","בטל הזזה","取消移動","Anuluj przesuwaniy"],["Anuluj zmianę rozmiaru","Cancel resize","Größenänderung abbrechen","Cancelar cambio de tamaño","Annuler le redimensionnement","בטל שינוי גודל","取消調整大小","Anuluj zmiana miary"],["Okna scalone","Windows merged","Fenster verbunden","Ventanas unidas","Fenêtres fusionnées","החלונות מוזגו","視窗已合併","Ôkna zlepione"],["Okno oddzielone","Window detached","Fenster gelöst","Ventana separada","Fenêtre détachée","החלון נותק","視窗已分離","Ôkno ôddzielōne"],["Brak stykających się okien.","No touching windows.","Keine berührenden Fenster.","No hay ventanas en contacto.","Aucune fenêtre en contact.","אין חלונות נוגעים.","沒有相接的視窗。","Niy ma stykajōncych ôkien."],["Blokuj o okna i krawędzie ekranu","Block against windows and screen edges","An Fenstern und Bildschirmrändern blockieren","Bloquear contra ventanas y bordes de pantalla","Bloquer contre les fenêtres et les bords de l’écran","חסום מול חלונות וקצוות המסך","與視窗及螢幕邊緣碰撞","Zablokuj ô ôkna i krańce ekranu"],["Tarcza","Dial","Zifferblatt","Esfera","Cadran","לוח שעון","錶盤","Tarcza"],["Cyfrowy","Digital","Digital","Digital","Numérique","דיגיטלי","數位","Cyfrowy"],["Bez numerów","No numerals","Ohne Ziffern","Sin números","Sans chiffres","ללא מספרים","無數字","Bez numerōw"],["Format 24-godzinny","24-hour format","24-Stunden-Format","Formato de 24 horas","Format 24 heures","פורמט 24 שעות","24 小時制","Format 24-godzinny"],["Alarmy","Alarms","Wecker","Alarmas","Alarmes","התראות","鬧鐘","Budziki"],["Minutnik","Timer","Timer","Temporizador","Minuteur","טיימר","計時器","Minutnik"],["＋ Nowy alarm","＋ New alarm","＋ Neuer Wecker","＋ Nueva alarma","＋ Nouvelle alarme","＋ התראה חדשה","＋ 新增鬧鐘","＋ Nowy budzik"],["Brak alarmów.","No alarms.","Keine Wecker.","No hay alarmas.","Aucune alarme.","אין התראות.","沒有鬧鐘。","Niy ma budzikōw."],["Godzina","Time","Uhrzeit","Hora","Heure","שעה","時間","Godzina"],["Data","Date","Datum","Fecha","Date","תאריך","日期","Data"],["Powtarzaj","Repeat","Wiederholen","Repetir","Répéter","חזור","重複","Powtŏrzej"],["Bez zaznaczonych dni alarm zadzwoni jednorazowo w wybranym dniu.","With no days selected, the alarm rings once on the chosen date.","Ohne ausgewählte Tage klingelt der Wecker einmalig am gewählten Datum.","Sin días seleccionados, la alarma suena una vez en la fecha elegida.","Sans jour sélectionné, l’alarme sonne une seule fois à la date choisie.","אם לא נבחרו ימים, ההתראה תצלצל פעם אחת בתאריך שנבחר.","未選取任何星期時，鬧鐘只會在所選日期響一次。","Jak niy ma zaznaczōnych dni, budzik zadzwōni roz we wybrany dziyń."],["Notatka","Note","Notiz","Nota","Note","הערה","備註","Zapisek"],["Notatka do alarmu…","Note for the alarm…","Notiz zum Wecker…","Nota para la alarma…","Note pour l’alarme…","הערה להתראה…","鬧鐘備註…","Zapisek do budzika…"],["Dźwięk","Sound","Klang","Sonido","Son","צליל","音效","Dźwiyk"],["Dzwonek","Bell","Glocke","Campana","Cloche","פעמון","鈴聲","Dzwōnek"],["Budzik","Alarm clock","Wecker","Despertador","Réveil","שעון מעורר","鬧鐘音","Budzik"],["Narastający","Rising","Aufsteigend","Ascendente","Montant","עולה","漸強","Rosnōncy"],["Melodia","Melody","Melodie","Melodía","Mélodie","מנגינה","旋律","Melodyjŏ"],["Cichy puls","Soft pulse","Sanfter Puls","Pulso suave","Pulsation douce","פולס רך","輕柔脈動","Cichy puls"],["Odsłuchaj","Preview","Anhören","Escuchar","Écouter","האזן","試聽","Posłychej"],["Zapisz","Save","Speichern","Guardar","Enregistrer","שמור","儲存","Zapisz"],["Edytuj","Edit","Bearbeiten","Editar","Modifier","ערוך","編輯","Edytuj"],["ominięty","missed","verpasst","perdida","manquée","הוחמצה","已錯過","ôminiynty"],["Codziennie","Every day","Täglich","Todos los días","Tous les jours","כל יום","每天","Kożdego dnia"],["Podaj godzinę","Enter a time","Uhrzeit eingeben","Indica la hora","Indiquez l’heure","הזן שעה","請輸入時間","Podej godzina"],["Ten termin już minął","This time has already passed","Dieser Zeitpunkt ist bereits vorbei","Esa hora ya pasó","Cet horaire est déjà passé","הזמן הזה כבר עבר","此時間已過","Ta godzina już przeszła"],["Alarm dodany","Alarm added","Wecker hinzugefügt","Alarma añadida","Alarme ajoutée","ההתראה נוספה","已新增鬧鐘","Budzik dodany"],["Czas minął","Time is up","Die Zeit ist um","Se acabó el tiempo","Le temps est écoulé","הזמן נגמר","時間到","Czas ôminōn"],["Drzemka 5 min","Snooze 5 min","Schlummern 5 Min.","Posponer 5 min","Répéter 5 min","נודניק 5 דק׳","貪睡 5 分鐘","Drzymka 5 min"],["Wyłącz","Dismiss","Ausschalten","Apagar","Arrêter","כבה","關閉","Wyłōncz"],["Start","Start","Start","Iniciar","Démarrer","התחל","開始","Start"],["Pauza","Pause","Pause","Pausa","Pause","השהה","暫停","Pauza"],["Wznów","Resume","Fortsetzen","Reanudar","Reprendre","המשך","繼續","Wznōw"],["Resetuj","Reset","Zurücksetzen","Restablecer","Réinitialiser","אפס","重設","Resetuj"],["Stop","Stop","Stopp","Detener","Arrêter","עצור","停止","Stop"],["Okrążenie","Lap","Runde","Vuelta","Tour","הקפה","分圈","Ôkrōnżyniy"],["Dziś","Today","Heute","Hoy","Aujourd’hui","היום","今天","Dzisiej"],["Brak wydarzeń w tym dniu.","No events on this day.","Keine Termine an diesem Tag.","No hay eventos este día.","Aucun événement ce jour-là.","אין אירועים ביום זה.","這天沒有事件。","Niy ma wydarzyń we tyn dziyń."],["Nowe wydarzenie…","New event…","Neuer Termin…","Nuevo evento…","Nouvel événement…","אירוע חדש…","新增事件…","Nowe wydarzyniy…"],["Dodaj alarm","Add alarm","Wecker hinzufügen","Añadir alarma","Ajouter une alarme","הוסף התראה","新增鬧鐘","Dodej budzik"],["Dodaj","Add","Hinzufügen","Añadir","Ajouter","הוסף","新增","Dodej"],["Zegar, alarmy, minutnik, stoper i kalendarz","Clock, alarms, timer, stopwatch and calendar","Uhr, Wecker, Timer, Stoppuhr und Kalender","Reloj, alarmas, temporizador, cronómetro y calendario","Horloge, alarmes, minuteur, chronomètre et calendrier","שעון, התראות, טיימר, שעון עצר ולוח שנה","時鐘、鬧鐘、計時器、碼錶與行事曆","Zegar, budziki, minutnik, stoper i kalyndorz"],["Konwerter jednostek z rzadkimi jednostkami (np. lata świetlne)","Unit converter with rare units (e.g. light-years)","Einheitenumrechner mit seltenen Einheiten (z. B. Lichtjahre)","Conversor de unidades con unidades poco comunes (p. ej., años luz)","Convertisseur d’unités avec unités rares (p. ex. années-lumière)","ממיר יחידות עם יחידות נדירות (למשל שנות אור)","含罕見單位（如光年）的單位轉換器","Przelicznik jednostek ze rzadkimi jednostkami (np. lata świetlne)"],["Długość","Length","Länge","Longitud","Longueur","אורך","長度","Dugość"],["Waga i masa","Weight and mass","Gewicht und Masse","Peso y masa","Poids et masse","משקל ומסה","重量與質量","Waga i masa"],["Objętość","Volume","Volumen","Volumen","Volume","נפח","體積","Objyntość"],["Czas","Time","Zeit","Tiempo","Temps","זמן","時間","Czas"],["Powierzchnia","Area","Fläche","Superficie","Surface","שטח","面積","Powierzchnia"],["Temperatura","Temperature","Temperatur","Temperatura","Température","טמפרטורה","溫度","Temperatura"],["Prędkość","Speed","Geschwindigkeit","Velocidad","Vitesse","מהירות","速度","Gibkość"],["Dane","Data","Daten","Datos","Données","נתונים","資料","Dane"],["Energia","Energy","Energie","Energía","Énergie","אנרגיה","能量","Energijŏ"],["Ciśnienie","Pressure","Druck","Presión","Pression","לחץ","壓力","Ciśniyniy"],["Zamień jednostki","Swap units","Einheiten tauschen","Intercambiar unidades","Inverser les unités","החלף יחידות","交換單位","Zamiyń jednostki"],["Wszystkie jednostki","All units","Alle Einheiten","Todas las unidades","Toutes les unités","כל היחידות","所有單位","Wszystkie jednostki"],["Szukaj jednostki…","Search units…","Einheit suchen…","Buscar unidad…","Rechercher une unité…","חפש יחידה…","搜尋單位…","Szukej jednostki…"],["Skopiowano","Copied","Kopiert","Copiado","Copié","הועתק","已複製","Skopiowane"],["Kopiuj wynik","Copy result","Ergebnis kopieren","Copiar resultado","Copier le résultat","העתק תוצאה","複製結果","Kopiuj wynik"],["Przeliczasz z:","Converting from:","Umrechnen von:","Convertir de:","Convertir de :","ממיר מ:","轉換自：","Przeliczosz z:"],["Przeliczasz na:","Converting to:","Umrechnen in:","Convertir a:","Convertir en :","ממיר ל:","轉換為：","Przeliczosz na:"],["Waluty","Currencies","Währungen","Divisas","Devises","מטבעות","貨幣","Waluty"],["{a} to w przeliczeniu","{a} equals","{a} entspricht","{a} equivale a","{a} équivaut à","{a} שווה ל","{a} 等於","{a} to we przeliczyniu"],["Aktualizacja: {d}","Updated: {d}","Aktualisiert: {d}","Actualizado: {d}","Mis à jour : {d}","עודכן: {d}","更新時間：{d}","Aktualizacyjŏ: {d}"],["Pobieranie kursów…","Fetching rates…","Kurse werden abgerufen…","Obteniendo tipos de cambio…","Récupération des taux…","מוריד שערים…","正在取得匯率…","Pobiyranie kursōw…"],["Brak kursów. Sprawdź połączenie z internetem.","No rates available. Check your internet connection.","Keine Kurse verfügbar. Prüfe deine Internetverbindung.","Sin tipos de cambio. Comprueba tu conexión a internet.","Aucun taux disponible. Vérifiez votre connexion internet.","אין שערים. בדוק את חיבור האינטרנט.","沒有匯率資料，請檢查網路連線。","Niy ma kursōw. Sprawdź połōnczyniy z internetym."],["Spróbuj ponownie","Try again","Erneut versuchen","Reintentar","Réessayer","נסה שוב","再試一次","Sprōbuj zaś"],["Kursy z pamięci (brak połączenia)","Cached rates (offline)","Gespeicherte Kurse (offline)","Tipos guardados (sin conexión)","Taux en mémoire (hors ligne)","שערים מהזיכרון (אין חיבור)","記憶體中的匯率（離線）","Kursy z pamiynci (niy ma połōnczyniŏ)"],["Kurs stały (wartość ustalona prawnie).","Fixed rate (set by law).","Fester Kurs (gesetzlich festgelegt).","Tipo fijo (establecido por ley).","Taux fixe (fixé par la loi).","שער קבוע (נקבע בחוק).","固定匯率（由法律訂定）。","Kurs stały (ustalōny prawym)."],["Wykres niedostępny dla tej pary walut.","Chart not available for this currency pair.","Diagramm für dieses Währungspaar nicht verfügbar.","Gráfico no disponible para este par de divisas.","Graphique indisponible pour cette paire de devises.","הגרף אינו זמין לזוג מטבעות זה.","此貨幣組合無法顯示圖表。","Wykres niydostympny dlŏ tyj pary walut."],["Nie udało się pobrać wykresu.","Could not load the chart.","Diagramm konnte nicht geladen werden.","No se pudo cargar el gráfico.","Impossible de charger le graphique.","לא ניתן היה לטעון את הגרף.","無法載入圖表。","Niy szło pobrać wykresu."],["1R","1Y","1J","1A","1A","1ש׳","1年","1R"],["5L","5Y","5J","5A","5A","5ש׳","5年","5L"],["Wybierz miesiąc i rok","Choose month and year","Monat und Jahr wählen","Elegir mes y año","Choisir le mois et l’année","בחר חודש ושנה","選擇月份和年份","Wybier miesiōnc i rok"],["Obecnie wybrany","Currently selected","Aktuell ausgewählt","Seleccionado actualmente","Actuellement sélectionné","נבחר כעת","目前選用","Terŏzki ôbrany"],["Wybierz język","Choose language","Sprache wählen","Elegir idioma","Choisir la langue","בחר שפה","選擇語言","Wybier godka"],["Wpisz tekst do przetłumaczenia…","Type text to translate…","Text zum Übersetzen eingeben…","Escribe el texto que quieres traducir…","Saisissez le texte à traduire…","הקלד טקסט לתרגום…","輸入要翻譯的文字…","Wpisz tekst do przekładaniŏ…"],["Tłumaczenie pojawi się tutaj","The translation will appear here","Die Übersetzung erscheint hier","La traducción aparecerá aquí","La traduction apparaîtra ici","התרגום יופיע כאן","翻譯會顯示在這裡","Przekład sia pokŏże tukej"],["Zamień języki","Swap languages","Sprachen tauschen","Intercambiar idiomas","Inverser les langues","החלף שפות","交換語言","Zamiyń godki"],["Tłumaczenie…","Translating…","Übersetze…","Traduciendo…","Traduction…","מתרגם…","翻譯中…","Przekładanie…"],["Wykryto: {l}","Detected: {l}","Erkannt: {l}","Detectado: {l}","Détecté : {l}","זוהתה: {l}","偵測到：{l}","Poznane: {l}"],["Wykryj język","Detect language","Sprache erkennen","Detectar idioma","Détecter la langue","זיהוי שפה","自動偵測語言","Poznej godka"],["Wyczyść","Clear","Löschen","Borrar","Effacer","נקה","清除","Wyczyść"],["Kategorie","Categories","Kategorien","Categorías","Catégories","קטגוריות","類別","Kategoryje"],["Duplikuj notatkę","Duplicate note","Notiz duplizieren","Duplicar nota","Dupliquer la note","שכפל פתק","複製筆記","Zduplikuj zapisek"],["Wygląd aplikacji","App appearance","Aussehen der Apps","Aspecto de las aplicaciones","Apparence des applications","מראה האפליקציות","應用程式外觀","Wyglōd aplikacyji"],["Tło aplikacji","App background","Hintergrund der Apps","Fondo de las aplicaciones","Arrière-plan des applications","רקע האפליקציות","應用程式背景","Tło aplikacyji"],["Okrągłe okna aplikacji 🙃","Round app windows 🙃","Runde App-Fenster 🙃","Ventanas de aplicaciones redondas 🙃","Fenêtres d’applications rondes 🙃","חלונות אפליקציה עגולים 🙃","圓形應用程式視窗 🙃","Kōnde ôkna aplikacyji 🙃"],["Żartobliwa opcja: okna stają się kołami, a pasek tytułu zajmuje górny łuk.","A joke option: windows become circles and the title bar sits on the top arc.","Eine Spaßoption: Fenster werden zu Kreisen, die Titelleiste sitzt am oberen Bogen.","Una opción divertida: las ventanas se vuelven círculos y la barra de título ocupa el arco superior.","Une option pour rire : les fenêtres deviennent des cercles et la barre de titre occupe l’arc supérieur.","אפשרות הומוריסטית: החלונות הופכים לעיגולים ושורת הכותרת יושבת על הקשת העליונה.","趣味選項：視窗變成圓形，標題列位於上方弧線。","Szpas: ôkna sōm kōnde, a pasek tytułu je na gōrnym łuku."],["Spokojne cząsteczki w tle aplikacji","Calm particles in the app background","Ruhige Partikel im App-Hintergrund","Partículas tranquilas en el fondo de las aplicaciones","Particules discrètes en arrière-plan des applications","חלקיקים שקטים ברקע האפליקציות","應用程式背景的柔和粒子","Spokojne czōnstki we tle aplikacyji"],["0% wyłącza efekt w danej aplikacji.","0% turns the effect off in that app.","0 % schaltet den Effekt in dieser App aus.","0 % desactiva el efecto en esa aplicación.","0 % désactive l’effet dans cette application.","0% מכבה את האפקט באפליקציה.","0% 會關閉該應用程式的效果。","0% wyłōnczo efekt we ônyj aplikacyji."],["Brak połączenia z internetem. Tłumacz działa tylko online.","No internet connection. The translator works only online.","Keine Internetverbindung. Der Übersetzer funktioniert nur online.","Sin conexión a internet. El traductor solo funciona en línea.","Pas de connexion internet. Le traducteur ne fonctionne qu’en ligne.","אין חיבור לאינטרנט. המתרגם פועל רק באינטרנט.","沒有網路連線。翻譯功能僅能在線上使用。","Niy ma internetu. Przekładacz robi leda online."],["Usługa tłumaczenia jest chwilowo niedostępna. Spróbuj ponownie za chwilę.","The translation service is temporarily unavailable. Please try again shortly.","Der Übersetzungsdienst ist vorübergehend nicht verfügbar. Bitte versuche es gleich noch einmal.","El servicio de traducción no está disponible temporalmente. Inténtalo de nuevo en un momento.","Le service de traduction est momentanément indisponible. Réessayez dans un instant.","שירות התרגום אינו זמין זמנית. נסה שוב בעוד רגע.","翻譯服務暫時無法使用，請稍後再試。","Usługa przekładaniŏ je na chwila niydostympno. Sprōbuj zaś za chwila."],["Tłumacz tekstów (bez logowania i opłat, wymaga internetu)","Text translator (no sign-in or fees, needs internet)","Textübersetzer (ohne Anmeldung und Kosten, benötigt Internet)","Traductor de textos (sin inicio de sesión ni costes, requiere internet)","Traducteur de texte (sans connexion ni frais, internet requis)","מתרגם טקסט (ללא התחברות ותשלום, דורש אינטרנט)","文字翻譯（無須登入或付費，需連線網路）","Przekładacz tekstu (bez logowanŏ i ôpłat, trza internetu)"],["Zmieniacz formatów","File Format Changer","Formatwandler","Cambiador de formatos","Changeur de formats","מחליף פורמטים","格式轉換器","Zmiyniacz formatōw"],["Konwertuje pliki: obrazy, dźwięk, wideo, dokumenty, dane i archiwa","Converts files: images, audio, video, documents, data and archives","Konvertiert Dateien: Bilder, Audio, Video, Dokumente, Daten und Archive","Convierte archivos: imágenes, audio, vídeo, documentos, datos y archivos comprimidos","Convertit des fichiers : images, audio, vidéo, documents, données et archives","ממיר קבצים: תמונות, שמע, וידאו, מסמכים, נתונים וארכיונים","轉換檔案：圖片、音訊、影片、文件、資料與壓縮檔","Przekształco pliki: ôbrŏzy, dźwiyk, wideo, dokumynty, dane i archiwa"],["Upuść plik tutaj lub kliknij, aby wybrać","Drop a file here or click to choose","Datei hier ablegen oder klicken zum Auswählen","Suelta un archivo aquí o haz clic para elegir","Déposez un fichier ici ou cliquez pour choisir","גרור קובץ לכאן או לחץ לבחירה","將檔案拖曳到這裡，或點選以選擇","Puść plik tukej abo kliknij, coby wybrać"],["Konwertuj na:","Convert to:","Konvertieren in:","Convertir a:","Convertir en :","המר ל:","轉換為：","Przekształć na:"],["Konwertuj","Convert","Konvertieren","Convertir","Convertir","המר","轉換","Przekształć"],["Gotowy plik","Converted file","Fertige Datei","Archivo listo","Fichier prêt","הקובץ מוכן","轉換完成的檔案","Gotowy plik"],["Zapisz plik…","Save file…","Datei speichern…","Guardar archivo…","Enregistrer le fichier…","שמור קובץ…","儲存檔案…","Zapisz plik…"],["Wybierz plik do konwersji.","Choose a file to convert.","Wähle eine Datei zum Konvertieren.","Elige un archivo para convertir.","Choisissez un fichier à convertir.","בחר קובץ להמרה.","請選擇要轉換的檔案。","Wybier plik do przekształcaniŏ."],["Konwertowanie…","Converting…","Konvertiere…","Convirtiendo…","Conversion…","ממיר…","轉換中…","Przekształcanie…"],["Gotowe.","Done.","Fertig.","Listo.","Terminé.","הסתיים.","完成。","Gotowe."],["Nie udało się przekonwertować pliku.","The file could not be converted.","Die Datei konnte nicht konvertiert werden.","No se pudo convertir el archivo.","Impossible de convertir le fichier.","לא ניתן להמיר את הקובץ.","無法轉換此檔案。","Niy szło przekształcić plika."],["Ten format wymaga programu ffmpeg.","This format requires ffmpeg.","Dieses Format benötigt ffmpeg.","Este formato requiere ffmpeg.","Ce format nécessite ffmpeg.","פורמט זה דורש ffmpeg.","此格式需要 ffmpeg。","Tyn format trzebuje programu ffmpeg."],["Wykryto ffmpeg: dostępne są dodatkowe formaty.","ffmpeg found: extra formats are available.","ffmpeg gefunden: zusätzliche Formate verfügbar.","ffmpeg detectado: hay formatos adicionales disponibles.","ffmpeg détecté : formats supplémentaires disponibles.","ffmpeg זוהה: פורמטים נוספים זמינים.","偵測到 ffmpeg：可使用更多格式。","Znejdzōny ffmpeg: dostympne sōm dodatkowe formaty."],["Zainstaluj ffmpeg, aby odblokować więcej formatów (MP3, MP4, MKV…).","Install ffmpeg to unlock more formats (MP3, MP4, MKV…).","Installiere ffmpeg, um weitere Formate freizuschalten (MP3, MP4, MKV…).","Instala ffmpeg para desbloquear más formatos (MP3, MP4, MKV…).","Installez ffmpeg pour débloquer plus de formats (MP3, MP4, MKV…).","התקן את ffmpeg כדי לפתוח פורמטים נוספים (MP3, MP4, MKV…).","安裝 ffmpeg 即可解鎖更多格式（MP3、MP4、MKV…）。","Zainstaluj ffmpeg, coby ôdryglować wiyncyj formatōw (MP3, MP4, MKV…)."],["Konwersja wideo w przeglądarce trwa tyle, ile samo wideo.","Converting video in the browser takes as long as the video itself.","Die Videokonvertierung im Browser dauert so lange wie das Video selbst.","Convertir vídeo en el navegador dura tanto como el propio vídeo.","La conversion vidéo dans le navigateur dure aussi longtemps que la vidéo.","המרת וידאו בדפדפן אורכת כמו הווידאו עצמו.","在瀏覽器中轉換影片所需時間與影片長度相同。","Przekształcaniy wideo we przeglōndarce trwo tela, co samo wideo."],["Ten format wejściowy nie jest obsługiwany.","This input format is not supported.","Dieses Eingabeformat wird nicht unterstützt.","Este formato de entrada no es compatible.","Ce format d’entrée n’est pas pris en charge.","פורמט הקלט אינו נתמך.","不支援此輸入格式。","Tyn format wejściowy niy je ôbsłōgiwany."],["Wybrane plików: {n}","Files selected: {n}","Ausgewählte Dateien: {n}","Archivos seleccionados: {n}","Fichiers sélectionnés : {n}","קבצים שנבחרו: {n}","已選擇檔案：{n}","Wybrane plikōw: {n}"],["Wykryty format: {f}","Detected format: {f}","Erkanntes Format: {f}","Formato detectado: {f}","Format détecté : {f}","פורמט שזוהה: {f}","偵測到的格式：{f}","Poznany format: {f}"],["Obrazy","Images","Bilder","Imágenes","Images","תמונות","圖片","Ôbrŏzy"],["Audio","Audio","Audio","Audio","Audio","שמע","音訊","Audio"],["Wideo","Video","Video","Vídeo","Vidéo","וידאו","影片","Wideo"],["Dokumenty","Documents","Dokumente","Documentos","Documents","מסמכים","文件","Dokumynty"],["Archiwa","Archives","Archive","Archivos comprimidos","Archives","ארכיונים","壓縮檔","Archiwa"],["Kodowanie","Encoding","Kodierung","Codificación","Encodage","קידוד","編碼","Kodowaniy"],["Jakość","Quality","Qualität","Calidad","Qualité","איכות","品質","Jakość"],["Maks. rozmiar (px)","Max size (px)","Max. Größe (px)","Tamaño máx. (px)","Taille max. (px)","גודל מרבי (px)","最大尺寸（px）","Maks. miara (px)"],["Tło","Background","Hintergrund","Fondo","Arrière-plan","רקע","背景","Tło"],["Częstotliwość","Sample rate","Abtastrate","Frecuencia","Fréquence","תדר דגימה","取樣率","Frekwyncyjŏ"],["Kanały","Channels","Kanäle","Canales","Canaux","ערוצים","聲道","Kanały"],["Jak w oryginale","Same as original","Wie im Original","Igual que el original","Comme l’original","כמו במקור","與原檔相同","Jak we ôryginale"],["Mono","Mono","Mono","Mono","Mono","מונו","單聲道","Mono"],["Stereo","Stereo","Stereo","Estéreo","Stéréo","סטריאו","立體聲","Stereo"],["Klatki/s","Frames/s","Bilder/s","Fotogramas/s","Images/s","פריימים/שנ׳","每秒幀數","Klatki/s"],["Szerokość (px)","Width (px)","Breite (px)","Ancho (px)","Largeur (px)","רוחב (px)","寬度（px）","Szyrzka (px)"],["Czas klatki (s)","Frame time (s)","Bildzeit (s)","Tiempo del fotograma (s)","Temps de l’image (s)","זמן הפריים (שנ׳)","影格時間（秒）","Czas klatki (s)"],["Separator","Separator","Trennzeichen","Separador","Séparateur","מפריד","分隔符號","Separator"],["Wykrywaj liczby i wartości logiczne","Detect numbers and booleans","Zahlen und Wahrheitswerte erkennen","Detectar números y booleanos","Détecter nombres et booléens","זהה מספרים וערכים בוליאניים","偵測數字與布林值","Poznowej liczby i wartości logiczne"],["Końce wierszy","Line endings","Zeilenenden","Finales de línea","Fins de ligne","סופי שורות","換行符號","Kōńce wierszy"],["Kodowanie źródła","Source encoding","Quellkodierung","Codificación de origen","Encodage source","קידוד מקור","來源編碼","Kodowaniy źrōdła"],["Automatycznie","Automatic","Automatisch","Automático","Automatique","אוטומטי","自動","Autōmatycznie"],["Dzisiaj","Today","Heute","Hoy","Aujourd’hui","היום","今天","Dzisiej"],["Wczoraj","Yesterday","Gestern","Ayer","Hier","אתמול","昨天","Wczorej"],["Szukaj w historii…","Search history…","Verlauf durchsuchen…","Buscar en el historial…","Rechercher dans l’historique…","חיפוש בהיסטוריה…","搜尋記錄…","Szukej we historyji…"],["Usuń z historii","Remove from history","Aus dem Verlauf entfernen","Eliminar del historial","Supprimer de l’historique","הסר מההיסטוריה","從記錄中移除","Skasuj z historyji"],["Historia jest pusta.","History is empty.","Der Verlauf ist leer.","El historial está vacío.","L’historique est vide.","ההיסטוריה ריקה.","記錄是空的。","Historyja je pusto."],["Brak wyników.","No results.","Keine Ergebnisse.","Sin resultados.","Aucun résultat.","אין תוצאות.","沒有結果。","Niy ma wyników."],["Pokaż więcej","Show more","Mehr anzeigen","Mostrar más","Afficher plus","הצג עוד","顯示更多","Pokoż wiyncyj"],["Zapisuj historię przeglądania","Save browsing history","Browserverlauf speichern","Guardar el historial de navegación","Enregistrer l’historique de navigation","שמור היסטוריית גלישה","儲存瀏覽記錄","Zapisuj historyjõ przeglōndaniŏ"],["Przechowuj historię","Keep history for","Verlauf aufbewahren für","Conservar el historial durante","Conserver l’historique pendant","שמור היסטוריה למשך","記錄保留時間","Trzimej historyjõ przez"],["Dni: {n}","Days: {n}","Tage: {n}","Días: {n}","Jours : {n}","ימים: {n}","天數：{n}","Dni: {n}"],["Bez limitu","No limit","Unbegrenzt","Sin límite","Illimité","ללא הגבלה","不限","Bez limitu"],["np. google.com lub zwierzaki","e.g. google.com or pets","z. B. google.com oder tiere","p. ej. google.com o mascotas","p. ex. google.com ou animaux","לדוגמה: google.com או חיות","例如 google.com 或 寵物","np. google.com abo zwierzyna"],["Starsze wpisy są usuwane automatycznie.","Older entries are removed automatically.","Ältere Einträge werden automatisch gelöscht.","Las entradas más antiguas se eliminan automáticamente.","Les entrées plus anciennes sont supprimées automatiquement.","ערכים ישנים יותר נמחקים אוטומטית.","較舊的項目會自動移除。","Starsze wpisy sōm autōmatycznie kasowane."],["Wpis z kropką, ukośnikiem lub „www” pasuje do całego adresu (np. www.google.com). Samo słowo (np. zwierzaki) pasuje tylko do nazwy strony przed końcówką .com, .pl itd. Pasujące wejścia nie są zapisywane, a istniejące zostają usunięte. Dotyczy to także haseł wyszukiwanych w Google.","An entry with a dot, slash or “www” matches the whole address (e.g. www.google.com). A plain word (e.g. pets) matches only the site name before the .com, .pl etc. ending. Matching visits are not saved, and existing ones are removed. This also applies to terms searched on Google.","Ein Eintrag mit Punkt, Schrägstrich oder „www“ passt auf die gesamte Adresse (z. B. www.google.com). Ein einzelnes Wort (z. B. tiere) passt nur auf den Seitennamen vor der Endung .com, .pl usw. Passende Besuche werden nicht gespeichert, vorhandene werden entfernt. Das gilt auch für bei Google gesuchte Begriffe.","Una entrada con punto, barra o «www» coincide con toda la dirección (p. ej. www.google.com). Una sola palabra (p. ej. mascotas) solo coincide con el nombre del sitio antes de la terminación .com, .pl, etc. Las visitas coincidentes no se guardan y las existentes se eliminan. Esto también se aplica a los términos buscados en Google.","Une entrée contenant un point, une barre oblique ou « www » correspond à l’adresse entière (p. ex. www.google.com). Un simple mot (p. ex. animaux) ne correspond qu’au nom du site avant la terminaison .com, .pl, etc. Les visites correspondantes ne sont pas enregistrées et celles qui existent sont supprimées. Cela s’applique aussi aux termes recherchés sur Google.","ערך עם נקודה, לוכסן או “www” תואם לכתובת כולה (לדוגמה www.google.com). מילה בודדת (לדוגמה חיות) תואמת רק לשם האתר לפני הסיומת .com‏, .pl וכו׳. ביקורים תואמים אינם נשמרים, וקיימים נמחקים. זה חל גם על מונחים שנחפשו בגוגל.","含有句點、斜線或「www」的項目會比對整個網址（例如 www.google.com）。單一詞彙（例如 寵物）只比對網站名稱中 .com、.pl 等結尾之前的部分。符合的造訪不會被儲存，已存在的也會被移除。這也適用於在 Google 搜尋的字詞。","Wpis z kropkōm, ukośnikym abo „www” pasuje do cołkigo adresu (np. www.google.com). Samo słowo (np. zwierzyna) pasuje yno do miana strōny przed ôgōnym .com, .pl itd. Pasujōnce wejściŏ niy sōm zapisywane, a dotychczasowe sōm kasowane. Tyż dotyczy to słōw szukanych we Google."],["Wyczyścić całą historię?","Clear all history?","Gesamten Verlauf löschen?","¿Borrar todo el historial?","Effacer tout l’historique ?","למחוק את כל ההיסטוריה?","要清除所有記錄嗎？","Wyczyścić cołkõ historyjõ?"],["Usunięto wpisów: {n}","Entries removed: {n}","Einträge entfernt: {n}","Entradas eliminadas: {n}","Entrées supprimées : {n}","ערכים שהוסרו: {n}","已移除項目：{n}","Skasowane wpisy: {n}"],["Ustawienia historii","History settings","Verlaufseinstellungen","Ajustes del historial","Paramètres de l’historique","הגדרות היסטוריה","記錄設定","Ustawiynia historyje"],["Strony pomijane","Ignored sites","Ignorierte Seiten","Sitios omitidos","Sites ignorés","אתרים מוחרגים","忽略的網站","Pominiynte strōny"],["Uruchamianie przeglądarki","Browser startup","Browserstart","Inicio del navegador","Démarrage du navigateur","הפעלת הדפדפן","瀏覽器啟動","Uruchamianiy przeglōndarki"],["Wczytywanie karty…","Loading tab…","Tab wird geladen…","Cargando pestaña…","Chargement de l’onglet…","טוען לשונית…","正在載入分頁…","Ładowanie karty…"],["Wczytywanie historii…","Loading history…","Verlauf wird geladen…","Cargando historial…","Chargement de l’historique…","טוען היסטוריה…","正在載入記錄…","Ładowanie historyje…"],["Ładowanie panelu asystenta...","Loading assistant panel...","Assistenten-Panel wird geladen...","Cargando el panel del asistente...","Chargement du panneau de l’assistant...","טוען את חלונית העוזר...","正在載入助理面板...","Ładowanie panela asystynta..."],["Kostki z fizyką: łap, rzucaj i niszcz","Physics cubes: grab, throw and smash","Würfel mit Physik: greifen, werfen, zerstören","Cubos con física: agarra, lanza y destruye","Cubes physiques : attrapez, lancez, détruisez","קוביות עם פיזיקה: תפסו, זרקו והרסו","物理方塊：抓取、投擲、擊碎","Kostki z fizykōm: chyćej, ciepej i niszcz"],["Wynik","Score","Punktzahl","Puntuación","Score","ניקוד","分數","Wynik"],["Rekord","Best","Rekord","Récord","Record","שיא","最高紀錄","Rekord"],["Zniszcz wszystkie","Destroy all","Alle zerstören","Destruir todos","Tout détruire","השמד הכול","全部擊碎","Zniszcz wszyńskie"],["Zeruj wynik","Reset score","Punktzahl zurücksetzen","Reiniciar puntuación","Réinitialiser le score","אפס ניקוד","重設分數","Wyzeruj wynik"],["Grafiki kostek","Cube images","Würfelbilder","Imágenes de los cubos","Images des cubes","תמונות הקוביות","方塊圖片","Grafiki kostek"],["Dodaj zdjęcia","Add pictures","Bilder hinzufügen","Añadir imágenes","Ajouter des images","הוסף תמונות","新增圖片","Dodej zdjyńciŏ"],["Nowe kostki losują jedną z tych grafik.","New cubes pick one of these images at random.","Neue Würfel wählen zufällig eines dieser Bilder.","Los cubos nuevos eligen al azar una de estas imágenes.","Les nouveaux cubes choisissent au hasard l’une de ces images.","קוביות חדשות בוחרות באקראי אחת מהתמונות האלה.","新方塊會隨機選用其中一張圖片。","Nowe kostki losujōm jedna z tych grafik."],["Limit: {n} grafik","Limit: {n} images","Limit: {n} Bilder","Límite: {n} imágenes","Limite : {n} images","מגבלה: {n} תמונות","上限：{n} 張圖片","Limit: {n} grafik"],["Nie można odczytać obrazu.","Could not read the image.","Das Bild konnte nicht gelesen werden.","No se pudo leer la imagen.","Impossible de lire l’image.","לא ניתן לקרוא את התמונה.","無法讀取圖片。","Niy idzie przeczytać ôbrazu."],["Zresetować wynik?","Reset the score?","Punktzahl zurücksetzen?","¿Reiniciar la puntuación?","Réinitialiser le score ?","לאפס את הניקוד?","要重設分數嗎？","Wyzerować wynik?"],["Rekord zostanie zachowany.","The best score will be kept.","Der Rekord bleibt erhalten.","Se conservará el récord.","Le record sera conservé.","השיא יישמר.","最高紀錄會保留。","Rekord ostanie."],["Zeruj","Reset","Zurücksetzen","Reiniciar","Réinitialiser","אפס","重設","Wyzeruj"],["Ustawienia aplikacji","App settings","App-Einstellungen","Ajustes de la aplicación","Paramètres de l’application","הגדרות האפליקציה","應用程式設定","Sztalōnki aplikacyje"],["Dźwięk uruchamiania","Startup sound","Startsound","Sonido de inicio","Son de démarrage","צליל הפעלה","啟動音效","Dźwiyk uruchamianiŏ"],["Dopasowanie zdjęć","Image fit","Bildanpassung","Ajuste de imagen","Ajustement de l’image","התאמת תמונה","圖片配置","Dopasowanie zdjyńć"],["Przytnij","Crop","Zuschneiden","Recortar","Recadrer","חתוך","裁切","Przitnij"],["Rozciągnij","Stretch","Strecken","Estirar","Étirer","מתח","拉伸","Rozciōngnij"],["Kafelek","Tile","Kacheln","Mosaico","Mosaïque","ריצוף","並排","Kafelek"],["Kafelki: {n}×{n}","Tiles: {n}×{n}","Kacheln: {n}×{n}","Mosaicos: {n}×{n}","Mosaïques : {n}×{n}","ריצוף: {n}×{n}","並排：{n}×{n}","Kafelki: {n}×{n}"],["Rozmiar kostek","Cube size","Würfelgröße","Tamaño de los cubos","Taille des cubes","גודל הקוביות","方塊大小","Srogość kostek"],["Kości","Dice","Würfel","Dados","Dés","קוביות","骰子","Kostki"],["Rzuty kośćmi: od D3 do D100, wiele kości naraz","Dice rolls: D3 to D100, many dice at once","Würfeln: von D3 bis D100, mehrere Würfel gleichzeitig","Tirada de dados: de D3 a D100, varios dados a la vez","Lancers de dés : de D3 à D100, plusieurs dés à la fois","הטלת קוביות: מ-D3 עד D100, כמה קוביות בבת אחת","擲骰子：D3 至 D100，可同時擲多顆","Rzuty kostkami: ôd D3 do D100, wiela kostek naroz"],["Rzuć kośćmi","Roll dice","Würfeln","Lanzar dados","Lancer les dés","הטל קוביות","擲骰子","Rzuć kostkami"],["Wybierz kości","Choose dice","Würfel wählen","Elige los dados","Choisir les dés","בחר קוביות","選擇骰子","Wybier kostki"],["Modyfikator","Modifier","Modifikator","Modificador","Modificateur","מקדם","修正值","Modyfikator"],["Suma","Total","Summe","Total","Total","סך הכול","總和","Suma"],["Historia rzutów","Roll history","Wurfverlauf","Historial de tiradas","Historique des lancers","היסטוריית הטלות","擲骰記錄","Historyjo rzutōw"],["Brak rzutów","No rolls yet","Noch keine Würfe","Aún no hay tiradas","Aucun lancer","אין הטלות עדיין","尚無擲骰記錄","Karnych rzutōw"],["Wyczyść wybór","Clear selection","Auswahl löschen","Borrar selección","Effacer la sélection","נקה בחירה","清除選擇","Wyczyść wybōr"],["Rzuć ponownie tą kością","Roll this die again","Diesen Würfel erneut werfen","Volver a lanzar este dado","Relancer ce dé","הטל קובייה זו שוב","重擲這顆骰子","Rzuć zaś tōm kostkōm"],["Wybierz kości i rzuć","Choose dice and roll","Würfel wählen und werfen","Elige dados y lanza","Choisissez des dés et lancez","בחר קוביות והטל","選擇骰子並擲出","Wybier kostki i rzuć"],["Wybierz co najmniej jedną kość","Choose at least one die","Wähle mindestens einen Würfel","Elige al menos un dado","Choisissez au moins un dé","בחר לפחות קובייה אחת","請至少選擇一顆骰子","Wybier przynajmnij jedna kostka"],["Zakres: {a}–{b}","Range: {a}–{b}","Bereich: {a}–{b}","Rango: {a}–{b}","Plage : {a}–{b}","טווח: {a}–{b}","範圍：{a}–{b}","Zakres: {a}–{b}"],["Maksymalnie {n} kości naraz","Up to {n} dice at once","Höchstens {n} Würfel gleichzeitig","Máximo {n} dados a la vez","{n} dés maximum à la fois","עד {n} קוביות בבת אחת","最多同時 {n} 顆骰子","Maksymalnie {n} kostek naroz"],["Kliknij kość w wyniku, aby rzucić nią ponownie.","Click a die in the result to roll it again.","Klicke auf einen Würfel im Ergebnis, um ihn erneut zu werfen.","Haz clic en un dado del resultado para volver a lanzarlo.","Cliquez sur un dé du résultat pour le relancer.","לחץ על קובייה בתוצאה כדי להטיל אותה שוב.","點選結果中的骰子即可重擲該顆。","Klik na kostka w wyniku, coby ônōm rzucić zaś."],["Suwaki","Sliders","Regler","Deslizadores","Curseurs","מחוונים","滑桿","Suwaki"],["Suwaki przesuwają się co 5","Sliders move in steps of 5","Regler springen in 5er-Schritten","Los deslizadores avanzan de 5 en 5","Les curseurs avancent par pas de 5","המחוונים נעים בקפיצות של 5","滑桿以 5 為單位移動","Suwaki sie przesuwajōm ô 5"],["Wszystkie suwaki w ustawieniach zmieniają wartość o 5 zamiast o 1 (np. efekty tła o 5%).","All sliders in settings change by 5 instead of 1 (e.g. background effects by 5%).","Alle Regler in den Einstellungen ändern den Wert um 5 statt um 1 (z. B. Hintergrundeffekte um 5 %).","Todos los deslizadores de los ajustes cambian de 5 en 5 en lugar de 1 en 1 (p. ej., efectos de fondo de 5 %).","Tous les curseurs des réglages changent de 5 au lieu de 1 (p. ex. effets d’arrière-plan de 5 %).","כל המחוונים בהגדרות משתנים ב-5 במקום ב-1 (למשל אפקטי רקע ב-5%).","設定中的所有滑桿每次變動 5 而非 1（例如背景特效每次 5%）。","Wszyjske suwaki w sztelōngach zmieniajōm wartość ô 5 zamiast ô 1 (np. efekty tła ô 5%)."],["Aktualizacje","Updates","Aktualisierungen","Actualizaciones","Mises à jour","עדכונים","更新","Aktualizacyje"],["Wersja {v}","Version {v}","Version {v}","Versión {v}","Version {v}","גרסה {v}","版本 {v}","Wersyjo {v}"],["Sprawdzanie…","Checking…","Wird geprüft …","Comprobando…","Vérification…","בודק…","檢查中…","Sprawdziwanie…"],["Masz najnowszą wersję","You have the latest version","Du hast die neueste Version","Tienes la última versión","Vous avez la dernière version","יש לך את הגרסה העדכנית ביותר","您已使用最新版本","Mosz nojnowsza wersyjo"],["Dostępna wersja {v}","Version {v} is available","Version {v} ist verfügbar","Versión {v} disponible","Version {v} disponible","גרסה {v} זמינה","有可用的 {v} 版","Je dostympno wersyjo {v}"],["Pobieranie wersji {v}: {p}%","Downloading version {v}: {p}%","Version {v} wird heruntergeladen: {p} %","Descargando la versión {v}: {p} %","Téléchargement de la version {v} : {p} %","מוריד גרסה {v}: {p}%","正在下載 {v} 版：{p}%","Pobiyrane wersyje {v}: {p}%"],["Wersja {v} jest gotowa do instalacji","Version {v} is ready to install","Version {v} ist bereit zur Installation","La versión {v} está lista para instalar","La version {v} est prête à être installée","גרסה {v} מוכנה להתקנה","{v} 版已可安裝","Wersyjo {v} je gotowo do instalacyje"],["Nie udało się sprawdzić aktualizacji","Could not check for updates","Aktualisierungen konnten nicht geprüft werden","No se pudo buscar actualizaciones","Impossible de vérifier les mises à jour","לא ניתן היה לבדוק עדכונים","無法檢查更新","Niy szło sprawdzić aktualizacyji"],["Repozytorium aktualizacji nie jest skonfigurowane","The update repository is not configured","Das Update-Repository ist nicht konfiguriert","El repositorio de actualizaciones no está configurado","Le dépôt des mises à jour n’est pas configuré","מאגר העדכונים לא הוגדר","尚未設定更新儲存庫","Repozytorium aktualizacyji niy je skonfigurowane"],["Aktualizacjami zajmuje się pierwsza uruchomiona instancja","Updates are handled by the first running instance","Aktualisierungen übernimmt die zuerst gestartete Instanz","Las actualizaciones las gestiona la primera instancia iniciada","Les mises à jour sont gérées par la première instance lancée","העדכונים מטופלים על ידי המופע הראשון שהופעל","更新由最先啟動的執行個體處理","Aktualizacyjami zajmuje sie piyrszo uruchomiono instancyjo"],["Nie sprawdzano jeszcze aktualizacji","Updates have not been checked yet","Noch nicht nach Aktualisierungen gesucht","Aún no se han buscado actualizaciones","Aucune vérification effectuée","עדיין לא נבדקו עדכונים","尚未檢查更新","Aktualizacyji jeszcze niy sprawdzano"],["Sprawdź aktualizacje","Check for updates","Nach Aktualisierungen suchen","Buscar actualizaciones","Rechercher des mises à jour","בדוק עדכונים","檢查更新","Sprawdź aktualizacyje"],["Pobierz","Download","Herunterladen","Descargar","Télécharger","הורד","下載","Pobier"],["Otwórz stronę wydania","Open the release page","Release-Seite öffnen","Abrir la página de la versión","Ouvrir la page de la version","פתח את דף הגרסה","開啟發行頁面","Ôtwōrz strōna wydanio"],["Zainstaluj i uruchom ponownie","Install and restart","Installieren und neu starten","Instalar y reiniciar","Installer et redémarrer","התקן והפעל מחדש","安裝並重新啟動","Zainstaluj i uruchōm zaś"],["Sprawdzaj aktualizacje automatycznie","Check for updates automatically","Automatisch nach Aktualisierungen suchen","Buscar actualizaciones automáticamente","Rechercher automatiquement les mises à jour","בדוק עדכונים אוטומטית","自動檢查更新","Sprawdziwej aktualizacyje autōmatycznie"],["Pobieraj aktualizacje automatycznie","Download updates automatically","Aktualisierungen automatisch herunterladen","Descargar actualizaciones automáticamente","Télécharger automatiquement les mises à jour","הורד עדכונים אוטומטית","自動下載更新","Pobiyrej aktualizacyje autōmatycznie"],["Aktualizacje pochodzą z oficjalnych wydań projektu na GitHubie. Pobrane pliki są weryfikowane sumą SHA-512, a zainstalowana aktualizacja uruchamia się przy zamknięciu przeglądarki lub od razu na życzenie.","Updates come from the project’s official releases on GitHub. Downloaded files are verified with a SHA-512 checksum, and the update installs when the browser is closed or immediately on request.","Aktualisierungen stammen aus den offiziellen Releases des Projekts auf GitHub. Heruntergeladene Dateien werden per SHA-512-Prüfsumme verifiziert; die Aktualisierung wird beim Schließen des Browsers oder auf Wunsch sofort installiert.","Las actualizaciones proceden de las versiones oficiales del proyecto en GitHub. Los archivos descargados se verifican con una suma SHA-512 y la actualización se instala al cerrar el navegador o de inmediato si lo pides.","Les mises à jour proviennent des versions officielles du projet sur GitHub. Les fichiers téléchargés sont vérifiés par une somme SHA-512 ; la mise à jour s’installe à la fermeture du navigateur ou immédiatement sur demande.","העדכונים מגיעים מהגרסאות הרשמיות של הפרויקט ב-GitHub. הקבצים שהורדו מאומתים בסכום בדיקה SHA-512, והעדכון מותקן עם סגירת הדפדפן או מיד לפי בקשה.","更新來自專案在 GitHub 上的官方發行版。下載的檔案會以 SHA-512 校驗碼驗證，更新會在關閉瀏覽器時安裝，也可立即安裝。","Aktualizacyje sōm ze ôficjalnych wydanij projektu na GitHubie. Pobrane zbiory sōm weryfikowane sumōm SHA-512, a zainstalowano aktualizacyjo sie uruchamiô przi zawarciu przeglōndarki abo ôd razu na życzynie."],["Uruchomiono bez instalatora – nowe wersje pobierzesz ze strony wydania.","Started without the installer – download new versions from the release page.","Ohne Installer gestartet – neue Versionen lädst du von der Release-Seite herunter.","Iniciado sin instalador: descarga las nuevas versiones desde la página de la versión.","Lancé sans installateur : téléchargez les nouvelles versions depuis la page de la version.","הופעל ללא מתקין – הורד גרסאות חדשות מדף הגרסה.","未透過安裝程式啟動：請從發行頁面下載新版本。","Uruchōmiōno bez instalatora – nowe wersyje pobierzesz ze strōny wydanio."],["Aktualizacja gotowa","Update ready","Aktualisierung bereit","Actualización lista","Mise à jour prête","העדכון מוכן","更新已就緒","Aktualizacyjo gotowo"],["Wersja {v} została pobrana. Zainstalować teraz? Przeglądarka uruchomi się ponownie.","Version {v} has been downloaded. Install now? The browser will restart.","Version {v} wurde heruntergeladen. Jetzt installieren? Der Browser wird neu gestartet.","Se ha descargado la versión {v}. ¿Instalar ahora? El navegador se reiniciará.","La version {v} a été téléchargée. Installer maintenant ? Le navigateur va redémarrer.","גרסה {v} הורדה. להתקין עכשיו? הדפדפן יופעל מחדש.","已下載 {v} 版。要立即安裝嗎？瀏覽器將重新啟動。","Wersyjo {v} bōła pobrano. Zainstalować teroz? Przeglōndarka uruchōmi sie zaś."],["Zostanie zainstalowana przy zamknięciu przeglądarki","It will be installed when the browser is closed","Wird beim Schließen des Browsers installiert","Se instalará al cerrar el navegador","Elle sera installée à la fermeture du navigateur","תותקן עם סגירת הדפדפן","將於關閉瀏覽器時安裝","Zainstaluje sie przi zawarciu przeglōndarki"],["Brak opublikowanych wydań","No published releases","Keine veröffentlichten Releases","No hay versiones publicadas","Aucune version publiée","אין גרסאות שפורסמו","尚無已發布的版本","Niy ma ôpublikowanych wydanij"],["Saper","Minesweeper","Minesweeper","Buscaminas","Démineur","שולה מוקשים","踩地雷","Saper"],["Klasyczny Saper: własna plansza, życia i zawinięte krawędzie","Classic Minesweeper: custom board, lives and wrap-around edges","Klassisches Minesweeper: eigenes Spielfeld, Leben und umlaufende Ränder","Buscaminas clásico: tablero propio, vidas y bordes que se conectan","Démineur classique : plateau personnalisé, vies et bords qui se rejoignent","שולה מוקשים קלאסי: לוח מותאם, חיים וקצוות מחוברים","經典踩地雷：自訂棋盤、生命值與環繞邊緣","Klasyczny Saper: ôsobno plansza, żywotki i zawinyte krańce"],["Snake","Snake","Snake","Serpiente","Snake","נחש","貪食蛇","Snake"],["Wąż z jabłkami: plansza, tempo, złote i trujące jabłka oraz przeszkody","Snake with apples: board, pace, golden and poisonous apples and obstacles","Snake mit Äpfeln: Spielfeld, Tempo, goldene und giftige Äpfel, Hindernisse","Serpiente con manzanas: tablero, ritmo, manzanas doradas y venenosas, obstáculos","Snake avec pommes : plateau, rythme, pommes dorées et empoisonnées, obstacles","נחש עם תפוחים: לוח, קצב, תפוחי זהב ורעל ומכשולים","貪食蛇：棋盤、速度、金蘋果、毒蘋果與障礙物","Wōnsz z jabkōma: plansza, tympo, złote i trujōce jabka a bariyry"],["Nowa gra","New game","Neues Spiel","Nueva partida","Nouvelle partie","משחק חדש","新遊戲","Nowo gra"],["Ustawienia gry","Game settings","Spieleinstellungen","Ajustes del juego","Réglages du jeu","הגדרות משחק","遊戲設定","Sztelōngi gry"],["Zastosuj i zagraj","Apply and play","Anwenden und spielen","Aplicar y jugar","Appliquer et jouer","החל ושחק","套用並開始","Zastosuj i zagrej"],["Łatwy","Easy","Leicht","Fácil","Facile","קל","簡單","Latwy"],["Średni","Medium","Mittel","Medio","Moyen","בינוני","中等","Postrzedni"],["Trudny","Hard","Schwer","Difícil","Difficile","קשה","困難","Ciynżki"],["Ekstremalny","Extreme","Extrem","Extremo","Extrême","קיצוני","極限","Ekstremalny"],["Własny","Custom","Eigene","Personalizado","Personnalisé","מותאם","自訂","Włosny"],["Kolumny","Columns","Spalten","Columnas","Colonnes","עמודות","欄","Kolumny"],["Wiersze","Rows","Zeilen","Filas","Lignes","שורות","列","Wiersze"],["Miny","Mines","Minen","Minas","Mines","מוקשים","地雷","Miny"],["Rozmiar pola","Cell size","Feldgröße","Tamaño de casilla","Taille des cases","גודל משבצת","格子大小","Srogość pola"],["Dopasuj do okna","Fit to window","An Fenster anpassen","Ajustar a la ventana","Adapter à la fenêtre","התאם לחלון","配合視窗","Dopasuj do ôkna"],["Życia","Lives","Leben","Vidas","Vies","חיים","生命","Żywotki"],["Bezpieczny pierwszy klik","Safe first click","Sicherer erster Klick","Primer clic seguro","Premier clic sûr","לחיצה ראשונה בטוחה","首次點擊安全","Bezpieczny piyrszy klik"],["Akordy (klik na cyfrę)","Chording (click a number)","Akkord (Klick auf Zahl)","Acordes (clic en un número)","Accords (clic sur un chiffre)","אקורד (לחיצה על מספר)","快速展開（點擊數字）","Akordy (klik na cyfra)"],["Znaki zapytania","Question marks","Fragezeichen","Signos de interrogación","Points d’interrogation","סימני שאלה","問號標記","Znaki pytanio"],["Zawinięta plansza","Wrap-around board","Umlaufendes Spielfeld","Tablero envolvente","Plateau cyclique","לוח מחובר בקצוות","環繞棋盤","Zawinyto plansza"],["Plansza","Board","Spielfeld","Tablero","Plateau","לוח","棋盤","Plansza"],["Zasady","Rules","Regeln","Reglas","Règles","חוקים","規則","Zasady"],["Pozostało min","Mines left","Verbleibende Minen","Minas restantes","Mines restantes","מוקשים שנותרו","剩餘地雷","Zostało min"],["Tryb flagi","Flag mode","Flaggenmodus","Modo bandera","Mode drapeau","מצב דגל","旗標模式","Tryb fanki"],["Życie utracone! Zostało: {n}","Life lost! Left: {n}","Leben verloren! Übrig: {n}","¡Vida perdida! Quedan: {n}","Vie perdue ! Restantes : {n}","איבדת חיים! נותרו: {n}","失去一條生命！剩餘：{n}","Żywotek stracōny! Zostało: {n}"],["Wygrana! Czas: {t} s","You won! Time: {t} s","Gewonnen! Zeit: {t} s","¡Ganaste! Tiempo: {t} s","Gagné ! Temps : {t} s","ניצחת! זמן: {t} שנ׳","獲勝！時間：{t} 秒","Wygrana! Czas: {t} s"],["Nowy rekord!","New record!","Neuer Rekord!","¡Nuevo récord!","Nouveau record !","שיא חדש!","新紀錄！","Nowy rekord!"],["Prawy przycisk myszy: flaga. Zmiana rozmiaru planszy lub liczby min zaczyna nową grę po kliknięciu przycisku powyżej.","Right mouse button: flag. Changes to board size or mine count start a new game when you click the button above.","Rechte Maustaste: Flagge. Änderungen an Feldgröße oder Minenzahl starten ein neues Spiel, sobald du die Schaltfläche oben anklickst.","Botón derecho: bandera. Los cambios de tamaño o de minas empiezan una partida nueva al pulsar el botón de arriba.","Clic droit : drapeau. Les changements de taille ou de mines lancent une nouvelle partie au clic sur le bouton ci-dessus.","לחצן ימני: דגל. שינוי גודל הלוח או מספר המוקשים יתחיל משחק חדש בלחיצה על הכפתור שלמעלה.","按右鍵可插旗。變更棋盤大小或地雷數量後，按上方按鈕即開始新遊戲。","Prawy knefel myszy: fanka. Zmiana srogości planszy abo liczby min zaczyno nowo gra po kliknyńciu knefla wyżyj."],["Klasyczny","Classic","Klassisch","Clásico","Classique","קלאסי","經典","Klasyczny"],["Szybki","Fast","Schnell","Rápido","Rapide","מהיר","快速","Szybki"],["Labirynt","Maze","Labyrinth","Laberinto","Labyrinthe","מבוך","迷宮","Labirynt"],["Bez ścian","No walls","Ohne Wände","Sin paredes","Sans murs","בלי קירות","無牆壁","Bez ściōn"],["Przeszkody","Obstacles","Hindernisse","Obstáculos","Obstacles","מכשולים","障礙物","Bariyry"],["Przenikanie ścian","Pass through walls","Durch Wände gehen","Atravesar paredes","Traverser les murs","מעבר דרך קירות","穿牆","Przechodzynie przez ściany"],["Wąż","Snake","Schlange","Serpiente","Serpent","הנחש","蛇","Wōnsz"],["Szybkość","Speed","Geschwindigkeit","Velocidad","Vitesse","מהירות","速度","Szybkość"],["Przyspieszanie","Acceleration","Beschleunigung","Aceleración","Accélération","האצה","加速","Przyspieszanie"],["Początkowa długość","Starting length","Startlänge","Longitud inicial","Longueur initiale","אורך התחלתי","初始長度","Poczōntkowo dugość"],["Wzrost za jabłko","Growth per apple","Wachstum pro Apfel","Crecimiento por manzana","Croissance par pomme","גדילה לכל תפוח","每顆蘋果的成長","Przyrost za jabko"],["Jabłka","Apples","Äpfel","Manzanas","Pommes","תפוחים","蘋果","Jabka"],["Jabłka naraz","Apples at once","Äpfel gleichzeitig","Manzanas a la vez","Pommes en même temps","תפוחים בו-זמנית","同時蘋果數","Jabka naroz"],["Nowe jabłko co","New apple every","Neuer Apfel alle","Nueva manzana cada","Nouvelle pomme toutes les","תפוח חדש כל","新蘋果間隔","Nowe jabko co"],["Czas życia jabłka","Apple lifetime","Lebensdauer des Apfels","Vida de la manzana","Durée de vie de la pomme","משך חיי התפוח","蘋果存活時間","Czas życio jabka"],["bez limitu","unlimited","unbegrenzt","sin límite","illimité","ללא הגבלה","無限制","bez limitu"],["Złote jabłka","Golden apples","Goldene Äpfel","Manzanas doradas","Pommes dorées","תפוחי זהב","金蘋果","Złote jabka"],["Trujące jabłka","Poisonous apples","Giftige Äpfel","Manzanas venenosas","Pommes empoisonnées","תפוחי רעל","毒蘋果","Trujōce jabka"],["Naciśnij strzałkę, aby zacząć","Press an arrow key to start","Zum Starten eine Pfeiltaste drücken","Pulsa una flecha para empezar","Appuyez sur une flèche pour commencer","לחץ על מקש חץ כדי להתחיל","按方向鍵開始","Naciś strzałka, coby zacząć"],["Naciśnij spację, aby wznowić","Press Space to resume","Zum Fortsetzen Leertaste drücken","Pulsa Espacio para reanudar","Appuyez sur Espace pour reprendre","לחץ רווח כדי להמשיך","按空白鍵繼續","Naciś spacyjo, coby wznowić"],["Koniec gry","Game over","Spiel vorbei","Fin del juego","Partie terminée","המשחק נגמר","遊戲結束","Kōnie gry"],["Zagraj ponownie","Play again","Nochmal spielen","Jugar de nuevo","Rejouer","שחק שוב","再玩一次","Zagrej zaś"],["Wynik: {n}","Score: {n}","Punkte: {n}","Puntos: {n}","Score : {n}","ניקוד: {n}","分數：{n}","Wynik: {n}"],["Strzałki lub WASD: sterowanie, spacja: pauza.","Arrow keys or WASD to steer, Space to pause.","Pfeiltasten oder WASD zum Steuern, Leertaste für Pause.","Flechas o WASD para mover, Espacio para pausar.","Flèches ou WASD pour diriger, Espace pour mettre en pause.","חצים או WASD להיגוי, רווח להשהיה.","方向鍵或 WASD 控制，空白鍵暫停。","Strzałki abo WASD: sterowanie, spacyjo: pauza."],["Złote jabłko: +30 pkt i dłuższy wzrost. Trujące: -5 pkt i skrócenie węża. Zmiany planszy i węża obowiązują od nowej gry.","Golden apple: +30 pts and extra growth. Poisonous: −5 pts and a shorter snake. Board and snake changes apply from a new game.","Goldener Apfel: +30 Punkte und mehr Wachstum. Giftiger: −5 Punkte und kürzere Schlange. Änderungen gelten ab einem neuen Spiel.","Manzana dorada: +30 pts y más crecimiento. Venenosa: −5 pts y serpiente más corta. Los cambios valen desde una partida nueva.","Pomme dorée : +30 pts et croissance accrue. Empoisonnée : −5 pts et serpent raccourci. Les changements s’appliquent dès une nouvelle partie.","תפוח זהב: ‏+30 נק׳ וגדילה נוספת. תפוח רעל: ‏−5 נק׳ והנחש מתקצר. שינויים חלים ממשחק חדש.","金蘋果：+30 分並額外成長。毒蘋果：−5 分並縮短蛇身。變更於新遊戲生效。","Złote jabko: +30 pkt i dłuższy przyrost. Trujōce: −5 pkt i skrōcynie wōnsza. Zmiany planszy i wōnsza ôbowiōnzujōm ôd nowyj gry."],["System","System","System","Sistema","Système","מערכת","系統","Systym"],["Panele boczne","Side panels","Seitenleisten","Paneles laterales","Panneaux latéraux","חלוניות צד","側邊面板","Boczne panele"],["Pokaż przycisk panelu asystenta","Show the assistant panel button","Schaltfläche für das Assistenten-Panel anzeigen","Mostrar el botón del panel del asistente","Afficher le bouton du panneau de l’assistant","הצג את כפתור חלונית העוזר","顯示助理面板按鈕","Pokŏż przycisk panelu asystynta"],["Pokaż przycisk ChangeLog","Show the ChangeLog button","ChangeLog-Schaltfläche anzeigen","Mostrar el botón de ChangeLog","Afficher le bouton ChangeLog","הצג את כפתור ChangeLog","顯示 ChangeLog 按鈕","Pokŏż przycisk ChangeLog"],["Skrót klawiszowy panelu asystenta działa także przy ukrytym przycisku (zakładka Skróty).","The assistant panel shortcut also works when the button is hidden (Shortcuts tab).","Das Tastenkürzel für das Assistenten-Panel funktioniert auch bei ausgeblendeter Schaltfläche (Tab Kürzel).","El atajo del panel del asistente funciona también con el botón oculto (pestaña Atajos).","Le raccourci du panneau de l’assistant fonctionne aussi lorsque le bouton est masqué (onglet Raccourcis).","קיצור המקלדת של חלונית העוזר פועל גם כשהכפתור מוסתר (לשונית קיצורים).","即使隱藏按鈕，助理面板的快速鍵仍可使用（快速鍵分頁）。","Skrōt klawiszowy panelu asystynta dziŏła tyż przi skrytym przycisku (zakładka Skrōty)."],["Animacje aplikacji","App animations","App-Animationen","Animaciones de aplicaciones","Animations des applications","אנימציות אפליקציות","應用程式動畫","Animacyje aplikacyji"],["Okna aplikacji","App windows","App-Fenster","Ventanas de aplicaciones","Fenêtres des applications","חלונות אפליקציות","應用程式視窗","Ôkna aplikacyji"],["Pokaż pasek aplikacji","Show the app bar","App-Leiste anzeigen","Mostrar la barra de aplicaciones","Afficher la barre d’applications","הצג את סרגל האפליקציות","顯示應用程式列","Pokŏż pasek aplikacyji"],["Zapisywanie historii","Saving history","Verlauf speichern","Guardado del historial","Enregistrement de l’historique","שמירת היסטוריה","儲存歷史記錄","Zapisowanie historyje"],["O programie","About","Über das Programm","Acerca de","À propos","אודות","關於","Ô programie"],["Zapis i wczytanie obejmują wszystkie ustawienia, ale nie karty i foldery.","Saving and loading cover all settings, but not tabs and folders.","Speichern und Laden umfassen alle Einstellungen, aber nicht Tabs und Ordner.","Guardar y cargar abarca todos los ajustes, pero no las pestañas ni las carpetas.","L’enregistrement et le chargement couvrent tous les réglages, mais pas les onglets ni les dossiers.","השמירה והטעינה כוללות את כל ההגדרות, אך לא כרטיסיות ותיקיות.","儲存與載入涵蓋所有設定，但不包含分頁與資料夾。","Zapis i wczytanie ôbjimujōm wszyskie ustawiynia, ale niy karty i foldery."],["Wydane","Released","Veröffentlicht","Publicadas","Publiées","שוחררו","已發行","Wydane"],["Niewydane","Unreleased","Unveröffentlicht","Sin publicar","Non publiées","טרם שוחררו","未發行","Niewydane"],["Wydana","Released","Veröffentlicht","Publicada","Publiée","שוחררה","已發行","Wydano"],["Niewydana","Unreleased","Unveröffentlicht","Sin publicar","Non publiée","טרם שוחררה","未發行","Niewydano"],["Wersji: {n}","Versions: {n}","Versionen: {n}","Versiones: {n}","Versions : {n}","גרסאות: {n}","版本數：{n}","Wersyji: {n}"],["Brak wpisów do pokazania.","No entries to show.","Keine Einträge vorhanden.","No hay entradas que mostrar.","Aucune entrée à afficher.","אין רשומות להצגה.","沒有可顯示的項目。","Niy ma wpisōw do pokŏzaniŏ."],["Nie udało się wczytać pliku CHANGELOG.txt z folderu aplikacji.","Could not load CHANGELOG.txt from the app folder.","CHANGELOG.txt konnte nicht aus dem App-Ordner geladen werden.","No se pudo cargar CHANGELOG.txt de la carpeta de la aplicación.","Impossible de charger CHANGELOG.txt depuis le dossier de l’application.","לא ניתן לטעון את CHANGELOG.txt מתיקיית היישום.","無法從應用程式資料夾載入 CHANGELOG.txt。","Niy szło wczytać zbioru CHANGELOG.txt ze folderu aplikacyji."],["Tłumaczenie na język interfejsu...","Translating into the interface language...","Übersetzung in die Oberflächensprache...","Traduciendo al idioma de la interfaz...","Traduction dans la langue de l’interface...","מתרגם לשפת הממשק...","正在翻譯成介面語言...","Tumaczynie na gŏdka interfejsu..."],["Pokazano oryginał (po polsku), bo tłumaczenie jest niedostępne.","Showing the original (Polish) because translation is unavailable.","Das Original (Polnisch) wird angezeigt, da die Übersetzung nicht verfügbar ist.","Se muestra el original (en polaco) porque la traducción no está disponible.","Original (en polonais) affiché, car la traduction est indisponible.","מוצג המקור (בפולנית) כי התרגום אינו זמין.","因無法翻譯，顯示原文（波蘭文）。","Pokŏzane ôryginał (po polsku), bo tumaczynie niy je dostympne."],["Programy","Programs","Programme","Programas","Programmes","תוכנות","程式","Programy"],["Gry","Games","Spiele","Juegos","Jeux","משחקים","遊戲","Gry"],["Tekst zwykły","Plain text","Normaler Text","Texto normal","Texte normal","טקסט רגיל","一般文字","Zwykły tekst"],["Kod Morse’a","Morse code","Morsecode","Código Morse","Code Morse","קוד מורס","摩斯電碼","Kod Morse’a"],["Pismo Braille’a","Braille","Brailleschrift","Braille","Braille","ברייל","點字","Pismo Braille’a"],["Chiński: brak tabeli znaków, tryb niedostępny","Chinese: no character table, mode unavailable","Chinesisch: keine Zeichentabelle, Modus nicht verfügbar","Chino: sin tabla de caracteres, modo no disponible","Chinois : pas de table de caractères, mode indisponible","סינית: אין טבלת תווים, המצב אינו זמין","中文：沒有字元對照表，無法使用此模式","Chińsko gŏdka: niy ma tabele znakōw, tryb niydostympny"],["Morse i Braille zamieniają tekst interfejsu w danym języku na kod (uproszczone tabele, bez skrótów). Dotyczy tylko interfejsu Arkany, nie stron internetowych. Zmiana odświeża aplikację.","Morse and Braille turn the interface text in that language into code (simplified tables, no contractions). It affects only the Arkana interface, not websites. Changing it reloads the app.","Morse und Braille wandeln den Oberflächentext der jeweiligen Sprache in Code um (vereinfachte Tabellen, ohne Kürzungen). Betrifft nur die Arkana-Oberfläche, nicht Websites. Die Änderung lädt die App neu.","Morse y Braille convierten el texto de la interfaz de ese idioma en código (tablas simplificadas, sin abreviaturas). Solo afecta a la interfaz de Arkana, no a los sitios web. El cambio recarga la aplicación.","Morse et Braille convertissent le texte de l’interface dans cette langue en code (tables simplifiées, sans abréviations). Cela ne concerne que l’interface d’Arkana, pas les sites web. Le changement recharge l’application.","מורס וברייל ממירים את טקסט הממשק בשפה הנבחרת לקוד (טבלאות מפושטות, ללא קיצורים). משפיע רק על ממשק Arkana ולא על אתרי אינטרנט. השינוי טוען מחדש את האפליקציה.","摩斯電碼與點字會將該語言的介面文字轉成代碼（簡化對照表，不含縮寫）。僅影響 Arkana 介面，不影響網站。變更後會重新載入應用程式。","Morse i Braille zamiyniajōm tekst interfejsu we danyj gŏdce na kod (uproszczōne tabele, bez skrōtōw). Tyczy sie yno interfejsu Arkany, niy zajtōw internetowych. Zmiana ôdświyżo aplikacyjõ."],["Import z innej przeglądarki","Import from another browser","Import aus einem anderen Browser","Importar desde otro navegador","Importer depuis un autre navigateur","ייבוא מדפדפן אחר","從其他瀏覽器匯入","Import ze inkszyj przeglōndarki"],["Przenieś zakładki, historię, wyszukiwarkę i zalogowane sesje. Hasła, rozszerzenia i inne ustawienia innych przeglądarek nie są importowane.","Move bookmarks, history, search engine and logged-in sessions. Passwords, extensions and other settings of other browsers are not imported.","Übertrage Lesezeichen, Verlauf, Suchmaschine und angemeldete Sitzungen. Passwörter, Erweiterungen und andere Einstellungen anderer Browser werden nicht importiert.","Traslada marcadores, historial, buscador y sesiones iniciadas. No se importan contraseñas, extensiones ni otros ajustes de otros navegadores.","Transférez favoris, historique, moteur de recherche et sessions connectées. Les mots de passe, extensions et autres réglages des autres navigateurs ne sont pas importés.","העבר סימניות, היסטוריה, מנוע חיפוש והתחברויות פעילות. סיסמאות, תוספים והגדרות אחרות של דפדפנים אחרים אינם מיובאים.","轉移書籤、歷史記錄、搜尋引擎與已登入的工作階段。不會匯入其他瀏覽器的密碼、擴充功能與其他設定。","Przenojś zokłodki, historyjõ, szukajkã i zalogowane sesyje. Hasła, rozszerzynia i inksze ustawiynia inkszych przeglōndarek niy sōm importowane."],["Znalezione przeglądarki","Browsers found","Gefundene Browser","Navegadores encontrados","Navigateurs trouvés","דפדפנים שנמצאו","找到的瀏覽器","Znojdzione przeglōndarki"],["Szukam przeglądarek...","Looking for browsers...","Suche nach Browsern...","Buscando navegadores...","Recherche des navigateurs...","מחפש דפדפנים...","正在尋找瀏覽器...","Szukōm przeglōndarek..."],["Nie znaleziono przeglądarek. Użyj pliku zakładek (HTML) wyeksportowanego z dowolnej przeglądarki.","No browsers found. Use a bookmarks file (HTML) exported from any browser.","Keine Browser gefunden. Verwende eine aus einem beliebigen Browser exportierte Lesezeichen-Datei (HTML).","No se encontraron navegadores. Usa un archivo de marcadores (HTML) exportado desde cualquier navegador.","Aucun navigateur trouvé. Utilisez un fichier de favoris (HTML) exporté depuis n’importe quel navigateur.","לא נמצאו דפדפנים. השתמש בקובץ סימניות (HTML) שיוצא מכל דפדפן.","找不到瀏覽器。請使用從任何瀏覽器匯出的書籤檔案（HTML）。","Niy znojdzōno przeglōndarek. Użyj zbioru zokłodek (HTML) wyeksportowanego ze jakiejkolwiek przeglōndarki."],["Plik zakładek (HTML)","Bookmarks file (HTML)","Lesezeichen-Datei (HTML)","Archivo de marcadores (HTML)","Fichier de favoris (HTML)","קובץ סימניות (HTML)","書籤檔案（HTML）","Zbiōr zokłodek (HTML)"],["Eksport z dowolnej przeglądarki, także Safari.","Export from any browser, including Safari.","Export aus jedem Browser, auch Safari.","Exportación de cualquier navegador, incluido Safari.","Export depuis n’importe quel navigateur, y compris Safari.","ייצוא מכל דפדפן, כולל Safari.","可從任何瀏覽器匯出，包括 Safari。","Eksport ze jakiejkolwiek przeglōndarki, tyż Safari."],["Co przenieść","What to transfer","Was übertragen","Qué trasladar","Que transférer","מה להעביר","要轉移的內容","Co przenojś"],["Zakładki","Bookmarks","Lesezeichen","Marcadores","Favoris","סימניות","書籤","Zokłodki"],["Ciasteczka (zalogowane sesje)","Cookies (logged-in sessions)","Cookies (angemeldete Sitzungen)","Cookies (sesiones iniciadas)","Cookies (sessions connectées)","עוגיות (התחברויות פעילות)","Cookie（已登入的工作階段）","Ciasteczka (zalogowane sesyje)"],["Ciasteczka","Cookies","Cookies","Cookies","Cookies","עוגיות","Cookie","Ciasteczka"],["Każdy folder zakładek trafi do osobnego folderu Arkany; strony ładują się dopiero po kliknięciu.","Each bookmark folder goes into its own Arkana folder; pages load only when clicked.","Jeder Lesezeichenordner landet in einem eigenen Arkana-Ordner; Seiten laden erst beim Anklicken.","Cada carpeta de marcadores va a su propia carpeta de Arkana; las páginas se cargan solo al hacer clic.","Chaque dossier de favoris va dans son propre dossier Arkana ; les pages ne se chargent qu’au clic.","כל תיקיית סימניות תועבר לתיקייה נפרדת ב-Arkana; הדפים נטענים רק בלחיצה.","每個書籤資料夾會成為獨立的 Arkana 資料夾；頁面在點擊後才會載入。","Kożdy folder zokłodek trefi do ôsobnego folderu Arkany; zajty ładujōm sie dopiyro po kliknyncio."],["Zamknij wybraną przeglądarkę (także w zasobniku systemowym), inaczej jej bazy danych mogą być zablokowane.","Close the selected browser (also in the system tray), otherwise its databases may be locked.","Schließe den gewählten Browser (auch im Infobereich), sonst sind seine Datenbanken eventuell gesperrt.","Cierra el navegador seleccionado (también en la bandeja del sistema); de lo contrario, sus bases de datos pueden estar bloqueadas.","Fermez le navigateur choisi (aussi dans la zone de notification), sinon ses bases de données peuvent être verrouillées.","סגור את הדפדפן שנבחר (גם במגש המערכת), אחרת מסדי הנתונים שלו עלולים להיות נעולים.","請關閉所選的瀏覽器（包括系統匣中的），否則其資料庫可能被鎖定。","Zawrzij wybranõ przeglōndarkã (tyż w zasobniku systymowym), inaczyj jeji bazy danych sōm możne zablokowane."],["Ciasteczka zawierają dane logowania. Importuj tylko ze swojego profilu.","Cookies contain login data. Import only from your own profile.","Cookies enthalten Anmeldedaten. Importiere nur aus deinem eigenen Profil.","Las cookies contienen datos de inicio de sesión. Importa solo desde tu propio perfil.","Les cookies contiennent des données de connexion. N’importez que depuis votre propre profil.","עוגיות מכילות נתוני התחברות. ייבא רק מהפרופיל שלך.","Cookie 含有登入資料。請僅從您自己的設定檔匯入。","Ciasteczka majōm dane logowanio. Importuj yno ze swojigo profilu."],["Importuj","Import","Importieren","Importar","Importer","ייבא","匯入","Importuj"],["Importuję...","Importing...","Importiere...","Importando...","Importation...","מייבא...","正在匯入...","Importuja..."],["Gotowe","Done","Fertig","Listo","Terminé","סיום","完成","Gotowe"],["Wynik importu","Import result","Importergebnis","Resultado de la importación","Résultat de l’importation","תוצאת הייבוא","匯入結果","Wynik importu"],["Zakładki: {n} stron w {m} nowych folderach","Bookmarks: {n} pages in {m} new folders","Lesezeichen: {n} Seiten in {m} neuen Ordnern","Marcadores: {n} páginas en {m} carpetas nuevas","Favoris : {n} pages dans {m} nouveaux dossiers","סימניות: {n} דפים ב-{m} תיקיות חדשות","書籤：{n} 個頁面，位於 {m} 個新資料夾","Zokłodki: {n} zajtōw we {m} nowych folderach"],["Zakładki: brak nowych stron.","Bookmarks: no new pages.","Lesezeichen: keine neuen Seiten.","Marcadores: no hay páginas nuevas.","Favoris : aucune nouvelle page.","סימניות: אין דפים חדשים.","書籤：沒有新頁面。","Zokłodki: niy ma nowych zajtōw."],["Historia: dodano {n} wpisów","History: {n} entries added","Verlauf: {n} Einträge hinzugefügt","Historial: {n} entradas añadidas","Historique : {n} entrées ajoutées","היסטוריה: נוספו {n} רשומות","歷史記錄：已新增 {n} 筆","Historyjŏ: dodane {n} wpisōw"],["Historia: brak nowych wpisów.","History: no new entries.","Verlauf: keine neuen Einträge.","Historial: no hay entradas nuevas.","Historique : aucune nouvelle entrée.","היסטוריה: אין רשומות חדשות.","歷史記錄：沒有新項目。","Historyjŏ: niy ma nowych wpisōw."],["Ciasteczka: zaimportowano {n}, pominięto {s}","Cookies: {n} imported, {s} skipped","Cookies: {n} importiert, {s} übersprungen","Cookies: {n} importadas, {s} omitidas","Cookies : {n} importés, {s} ignorés","עוגיות: יובאו {n}, דולגו {s}","Cookie：已匯入 {n}，略過 {s}","Ciasteczka: zaimportowane {n}, pominiynte {s}"],["Część ciasteczek jest chroniona szyfrowaniem aplikacyjnym (nowszy Chrome) i nie da się jej przenieść: {n}.","Some cookies are protected by app-bound encryption (newer Chrome) and cannot be transferred: {n}.","Einige Cookies sind durch anwendungsgebundene Verschlüsselung geschützt (neueres Chrome) und lassen sich nicht übertragen: {n}.","Algunas cookies están protegidas con cifrado vinculado a la aplicación (Chrome reciente) y no se pueden trasladar: {n}.","Certains cookies sont protégés par un chiffrement lié à l’application (Chrome récent) et ne peuvent pas être transférés : {n}.","חלק מהעוגיות מוגנות בהצפנה הקשורה ליישום (Chrome חדש) ולא ניתן להעבירן: {n}.","部分 Cookie 受應用程式繫結加密保護（較新的 Chrome），無法轉移：{n}。","Czynść ciasteczek je chrōniōno szyfrowaniym aplikacyjnym (nowszy Chrome) i niy idzie jij przenojś: {n}."],["baza jest zablokowana, zamknij przeglądarkę i spróbuj ponownie","the database is locked, close the browser and try again","Die Datenbank ist gesperrt, schließe den Browser und versuche es erneut","la base de datos está bloqueada; cierra el navegador e inténtalo de nuevo","la base de données est verrouillée, fermez le navigateur et réessayez","מסד הנתונים נעול, סגור את הדפדפן ונסה שוב","資料庫已被鎖定，請關閉瀏覽器後再試一次","baza je zablokowano, zawrzij przeglōndarkã i sprōbuj zasie"],["Przenosisz się z innej przeglądarki? Zaimportuj dane","Switching from another browser? Import your data","Wechselst du von einem anderen Browser? Importiere deine Daten","¿Vienes de otro navegador? Importa tus datos","Vous venez d’un autre navigateur ? Importez vos données","עוברים מדפדפן אחר? ייבאו את הנתונים","從其他瀏覽器轉換？匯入您的資料","Przechodzisz ze inkszyj przeglōndarki? Zaimportuj dane"],["Ukryj","Hide","Ausblenden","Ocultar","Masquer","הסתר","隱藏","Skryj"],["Importuj dane...","Import data...","Daten importieren...","Importar datos...","Importer les données...","ייבוא נתונים...","匯入資料...","Importuj dane..."],["Zakładki, historia i ciasteczka z Chrome, Edge, Firefoksa, Opery, Brave i Vivaldi lub z pliku zakładek.","Bookmarks, history and cookies from Chrome, Edge, Firefox, Opera, Brave and Vivaldi, or from a bookmarks file.","Lesezeichen, Verlauf und Cookies aus Chrome, Edge, Firefox, Opera, Brave und Vivaldi oder aus einer Lesezeichen-Datei.","Marcadores, historial y cookies de Chrome, Edge, Firefox, Opera, Brave y Vivaldi, o de un archivo de marcadores.","Favoris, historique et cookies de Chrome, Edge, Firefox, Opera, Brave et Vivaldi, ou d’un fichier de favoris.","סימניות, היסטוריה ועוגיות מ-Chrome, Edge, Firefox, Opera, Brave ו-Vivaldi, או מקובץ סימניות.","來自 Chrome、Edge、Firefox、Opera、Brave 與 Vivaldi 的書籤、歷史記錄與 Cookie，或來自書籤檔案。","Zokłodki, historyjŏ i ciasteczka ze Chrome, Edge, Firefoksa, Opery, Brave i Vivaldi abo ze zbioru zokłodek."],["Pasek zakładek","Bookmarks bar","Lesezeichenleiste","Barra de marcadores","Barre de favoris","סרגל סימניות","書籤列","Pasek zokłodek"],["Inne zakładki","Other bookmarks","Weitere Lesezeichen","Otros marcadores","Autres favoris","סימניות אחרות","其他書籤","Inksze zokłodki"],["Zakładki mobilne","Mobile bookmarks","Mobile Lesezeichen","Marcadores móviles","Favoris mobiles","סימניות מהנייד","行動書籤","Zokłodki mobilne"],["Menu zakładek","Bookmarks menu","Lesezeichenmenü","Menú de marcadores","Menu des favoris","תפריט סימניות","書籤選單","Menu zokłodek"],["Wyszukiwarka","Search engine","Suchmaschine","Buscador","Moteur de recherche","מנוע חיפוש","搜尋引擎","Szukajka"],["Używana, gdy w pasku adresu wpiszesz tekst zamiast adresu.","Used when you type text instead of an address in the address bar.","Wird verwendet, wenn du in der Adressleiste Text statt einer Adresse eingibst.","Se usa cuando escribes texto en lugar de una dirección en la barra de direcciones.","Utilisé lorsque vous saisissez du texte au lieu d’une adresse dans la barre d’adresse.","בשימוש כשמקלידים בסרגל הכתובות טקסט במקום כתובת.","在網址列輸入文字而非網址時使用。","Używano, jak we pasku adresu wpiszesz tekst zamiast adresu."],["Google (tylko wyniki WWW)","Google (web results only)","Google (nur Web-Ergebnisse)","Google (solo resultados web)","Google (résultats web uniquement)","Google (תוצאות אינטרנט בלבד)","Google（僅網頁結果）","Google (yno wyniki WWW)"],["Własna...","Custom...","Benutzerdefiniert...","Personalizado...","Personnalisé...","מותאם אישית...","自訂...","Włosno..."],["Wpisz adres wyszukiwania z %s w miejscu zapytania.","Enter a search URL with %s in place of the query.","Gib eine Such-URL mit %s anstelle der Suchanfrage ein.","Introduce una dirección de búsqueda con %s en lugar de la consulta.","Saisissez une adresse de recherche avec %s à la place de la requête.","הזן כתובת חיפוש עם %s במקום מילות החיפוש.","輸入搜尋網址，並以 %s 代表查詢內容。","Wpisz adres szukanio ze %s w placu zapytanio."],["Wyszukiwarka domyślna","Default search engine","Standardsuchmaschine","Buscador predeterminado","Moteur de recherche par défaut","מנוע חיפוש ברירת מחדל","預設搜尋引擎","Szukajka sztandardowo"],["Wyszukiwarka: ustawiono {n}","Search engine: set to {n}","Suchmaschine: {n} eingestellt","Buscador: configurado {n}","Moteur de recherche : {n} défini","מנוע חיפוש: הוגדר {n}","搜尋引擎：已設為 {n}","Szukajka: ustawiōno {n}"],["Wyszukiwarka: używasz domyślnej, nic do przeniesienia.","Search engine: you use the default one, nothing to transfer.","Suchmaschine: Du nutzt die Standardeinstellung, nichts zu übertragen.","Buscador: usas el predeterminado, no hay nada que trasladar.","Moteur de recherche : vous utilisez celui par défaut, rien à transférer.","מנוע חיפוש: אתה משתמש בברירת המחדל, אין מה להעביר.","搜尋引擎：您使用的是預設值，沒有需要轉移的內容。","Szukajka: używosz sztandardowyj, niy ma co przenojś."],["Wskaż folder profilu...","Choose profile folder...","Profilordner wählen...","Elegir carpeta del perfil...","Choisir le dossier du profil...","בחר תיקיית פרופיל...","選擇設定檔資料夾...","Wskaż folder profilu..."],["Gdy Twojej przeglądarki nie ma na liście (np. Opera GX w innej lokalizacji).","When your browser is not on the list (e.g. Opera GX in another location).","Wenn dein Browser nicht in der Liste ist (z. B. Opera GX an einem anderen Ort).","Cuando tu navegador no aparece en la lista (p. ej. Opera GX en otra ubicación).","Si votre navigateur ne figure pas dans la liste (p. ex. Opera GX à un autre emplacement).","כשהדפדפן שלך אינו ברשימה (למשל Opera GX במיקום אחר).","當您的瀏覽器不在清單中時（例如位於其他位置的 Opera GX）。","Jak Twojij przeglōndarki niy ma na liście (np. Opera GX we inkszyj lokalizacyji)."],["W tym folderze nie znaleziono danych przeglądarki.","No browser data found in this folder.","In diesem Ordner wurden keine Browserdaten gefunden.","No se encontraron datos de navegador en esta carpeta.","Aucune donnée de navigateur trouvée dans ce dossier.","לא נמצאו נתוני דפדפן בתיקייה זו.","在此資料夾中找不到瀏覽器資料。","We tym folderze niy znojdzōno danych przeglōndarki."],["Inna przeglądarka","Other browser","Anderer Browser","Otro navegador","Autre navigateur","דפדפן אחר","其他瀏覽器","Inksza przeglōndarka"],["Lista zadań (pola do odznaczania)","To-do list (checkboxes)","Aufgabenliste (Kontrollkästchen)","Lista de tareas (casillas)","Liste de tâches (cases à cocher)","רשימת משימות (תיבות סימון)","待辦清單（核取方塊）","Lista zadań (kwadraciki do ôdznaczanio)"],["Dodaj pozycję...","Add item...","Eintrag hinzufügen...","Añadir elemento...","Ajouter un élément...","הוסף פריט...","新增項目...","Dodej pozycyjõ..."],["Usuń pozycję","Delete item","Eintrag löschen","Eliminar elemento","Supprimer l’élément","מחק פריט","刪除項目","Wyciep pozycyjõ"],["Usuń wykonane","Clear completed","Erledigte entfernen","Quitar completadas","Supprimer les terminées","נקה שהושלמו","清除已完成","Wyciep zrobiōne"],["Wykonano {a} z {b}","{a} of {b} done","{a} von {b} erledigt","{a} de {b} hechas","{a} sur {b} terminées","{a} מתוך {b} הושלמו","已完成 {a}/{b}","Zrobiōne {a} ze {b}"],["Prywatność","Privacy","Datenschutz","Privacidad","Confidentialité","פרטיות","隱私","Prywatność"],["Uprawnienia stron","Site permissions","Website-Berechtigungen","Permisos de sitios","Autorisations des sites","הרשאות אתרים","網站權限","Uprawniynia zajtōw"],["Hasła","Passwords","Passwörter","Contraseñas","Mots de passe","סיסמאות","密碼","Hasła"],["Blokowanie reklam","Ad blocking","Werbeblocker","Bloqueo de anuncios","Blocage des publicités","חסימת פרסומות","廣告封鎖","Blokowanie reklam"],["Strony pytają o dostęp do kamery, mikrofonu, lokalizacji i innych funkcji. Tu zmienisz zapamiętane decyzje.","Sites ask for access to the camera, microphone, location and other features. Here you can change remembered decisions.","Websites fragen nach Zugriff auf Kamera, Mikrofon, Standort und weitere Funktionen. Hier änderst du gespeicherte Entscheidungen.","Los sitios piden acceso a la cámara, el micrófono, la ubicación y otras funciones. Aquí puedes cambiar las decisiones guardadas.","Les sites demandent l’accès à la caméra, au micro, à la position et à d’autres fonctions. Vous pouvez modifier ici les décisions enregistrées.","אתרים מבקשים גישה למצלמה, למיקרופון, למיקום ולתכונות נוספות. כאן אפשר לשנות החלטות שנשמרו.","網站會要求使用相機、麥克風、位置與其他功能。您可以在此變更已記住的決定。","Zajty pytajōm ô dostymp do kamery, mikrofōnu, lokalizacyji i inkszych funkcyji. Tukej zmiynisz spamiyntane decyzyje."],["Brak zapamiętanych decyzji.","No remembered decisions.","Keine gespeicherten Entscheidungen.","No hay decisiones guardadas.","Aucune décision enregistrée.","אין החלטות שמורות.","沒有已記住的決定。","Niy ma spamiyntanych decyzyji."],["Wyczyść wszystkie","Clear all","Alle löschen","Borrar todo","Tout effacer","נקה הכול","全部清除","Wyczyść wszyskie"],["Usuń decyzję","Remove decision","Entscheidung entfernen","Quitar decisión","Supprimer la décision","הסר החלטה","移除決定","Wyciep decyzyjõ"],["Wyczyścić zapamiętane uprawnienia?","Clear remembered permissions?","Gespeicherte Berechtigungen löschen?","¿Borrar los permisos guardados?","Effacer les autorisations enregistrées ?","לנקות הרשאות שמורות?","清除已記住的權限？","Wyczyścić spamiyntane uprawniynia?"],["Strony znów będą pytać o dostęp.","Sites will ask for access again.","Websites fragen wieder nach Zugriff.","Los sitios volverán a pedir acceso.","Les sites demanderont à nouveau l’accès.","אתרים יבקשו שוב גישה.","網站將再次要求存取權。","Zajty zasie byndōm pytać ô dostymp."],["Usunąć wszystkie zapisane hasła?","Delete all saved passwords?","Alle gespeicherten Passwörter löschen?","¿Eliminar todas las contraseñas guardadas?","Supprimer tous les mots de passe enregistrés ?","למחוק את כל הסיסמאות השמורות?","刪除所有已儲存的密碼？","Wyciepnōńć wszyskie zapisane hasła?"],["Tej operacji nie da się cofnąć.","This cannot be undone.","Das lässt sich nicht rückgängig machen.","Esta acción no se puede deshacer.","Cette action est irréversible.","לא ניתן לבטל פעולה זו.","此操作無法復原。","Tego niy idzie cofnōńć."],["Usuń wszystkie","Delete all","Alle löschen","Eliminar todo","Tout supprimer","מחק הכול","全部刪除","Wyciep wszyskie"],["Pokaż","Show","Anzeigen","Mostrar","Afficher","הצג","顯示","Pokŏż"],["Kopiuj","Copy","Kopieren","Copiar","Copier","העתק","複製","Kopiuj"],["Aktualizuj","Update","Aktualisieren","Actualizar","Mettre à jour","עדכן","更新","Aktualizuj"],["Nigdy dla tej strony","Never for this site","Nie für diese Website","Nunca para este sitio","Jamais pour ce site","לעולם לא עבור אתר זה","此網站永不儲存","Niy ôd nigdy dlŏ tyj zajty"],["brak nazwy","no name","kein Name","sin nombre","sans nom","ללא שם","無名稱","niy ma miana"],["Prośba o uprawnienie","Permission request","Berechtigungsanfrage","Solicitud de permiso","Demande d’autorisation","בקשת הרשאה","權限要求","Prośba ô uprawniynie"],["{s} chce uzyskać dostęp do:","{s} wants access to:","{s} möchte Zugriff auf:","{s} quiere acceder a:","{s} souhaite accéder à :","‏{s} מבקש גישה אל:","{s} 想要存取：","{s} chce uzyskać dostymp do:"],["Zezwól","Allow","Zulassen","Permitir","Autoriser","אפשר","允許","Zezwōl"],["Tylko tym razem","Only this time","Nur dieses Mal","Solo esta vez","Seulement cette fois","רק הפעם","僅此一次","Yno tym razym"],["Zablokuj","Block","Blockieren","Bloquear","Bloquer","חסום","封鎖","Zablokuj"],["Zezwól i Zablokuj zapamiętują decyzję dla tej strony. Zmienisz ją w Ustawienia → Prywatność.","Allow and Block remember the decision for this site. You can change it in Settings → Privacy.","Zulassen und Blockieren merken sich die Entscheidung für diese Website. Du kannst sie unter Einstellungen → Datenschutz ändern.","Permitir y Bloquear recuerdan la decisión para este sitio. Puedes cambiarla en Ajustes → Privacidad.","Autoriser et Bloquer mémorisent la décision pour ce site. Vous pouvez la modifier dans Paramètres → Confidentialité.","אפשר וחסום זוכרים את ההחלטה עבור אתר זה. ניתן לשנות אותה בהגדרות ← פרטיות.","「允許」與「封鎖」會記住此網站的決定。您可以在設定 → 隱私中變更。","Zezwōl i Zablokuj spamiyntujōm decyzyjõ dlŏ tyj zajty. Zmiynisz jã we Ustawiyniach → Prywatność."],["Kamera","Camera","Kamera","Cámara","Caméra","מצלמה","相機","Kamera"],["Mikrofon","Microphone","Mikrofon","Micrófono","Microphone","מיקרופון","麥克風","Mikrofōn"],["Kamera i mikrofon","Camera and microphone","Kamera und Mikrofon","Cámara y micrófono","Caméra et microphone","מצלמה ומיקרופון","相機與麥克風","Kamera i mikrofōn"],["Kamera lub mikrofon","Camera or microphone","Kamera oder Mikrofon","Cámara o micrófono","Caméra ou microphone","מצלמה או מיקרופון","相機或麥克風","Kamera abo mikrofōn"],["Lokalizacja","Location","Standort","Ubicación","Position","מיקום","位置","Lokalizacyjŏ"],["Powiadomienia","Notifications","Benachrichtigungen","Notificaciones","Notifications","התראות","通知","Powiadomiynia"],["Odczyt schowka","Clipboard access","Zugriff auf die Zwischenablage","Acceso al portapapeles","Accès au presse-papiers","גישה ללוח","讀取剪貼簿","Ôdczyt skłodka"],["Udostępnianie ekranu","Screen sharing","Bildschirmfreigabe","Compartir pantalla","Partage d’écran","שיתוף מסך","螢幕分享","Udostympnianie ekranu"],["Urządzenia MIDI","MIDI devices","MIDI-Geräte","Dispositivos MIDI","Périphériques MIDI","התקני MIDI","MIDI 裝置","Zorzōdzynia MIDI"],["Wykrywanie bezczynności","Idle detection","Inaktivitätserkennung","Detección de inactividad","Détection d’inactivité","זיהוי חוסר פעילות","偵測閒置","Wykrywanie bezczynności"],["Zarządzanie oknami","Window management","Fensterverwaltung","Gestión de ventanas","Gestion des fenêtres","ניהול חלונות","視窗管理","Zarzōndzanie ôknami"],["Dostęp do danych strony w innych witrynach","Access to site data on other sites","Zugriff auf Website-Daten auf anderen Websites","Acceso a datos del sitio en otros sitios","Accès aux données du site sur d’autres sites","גישה לנתוני האתר באתרים אחרים","在其他網站存取此網站的資料","Dostymp do danych zajty na inkszych zajtach"],["Otwieranie zewnętrznych aplikacji","Opening external apps","Externe Apps öffnen","Abrir aplicaciones externas","Ouverture d’applications externes","פתיחת יישומים חיצוניים","開啟外部應用程式","Ôtwiyranie zewnyntrznych aplikacyji"],["Dostęp do plików","File access","Dateizugriff","Acceso a archivos","Accès aux fichiers","גישה לקבצים","檔案存取","Dostymp do zbiorōw"],["Wypełnić dane logowania w {h}?","Fill in login details on {h}?","Anmeldedaten auf {h} ausfüllen?","¿Rellenar los datos de inicio de sesión en {h}?","Remplir les identifiants sur {h} ?","למלא פרטי התחברות ב-{h}?","要在 {h} 填入登入資料嗎？","Wypołnić dane logowanio na {h}?"],["Zapisać hasło dla {u} w {h}?","Save password for {u} on {h}?","Passwort für {u} auf {h} speichern?","¿Guardar la contraseña de {u} en {h}?","Enregistrer le mot de passe de {u} sur {h} ?","לשמור את הסיסמה של {u} ב-{h}?","要儲存 {u} 在 {h} 的密碼嗎？","Zapisać hasło dlŏ {u} na {h}?"],["Zaktualizować hasło dla {u} w {h}?","Update password for {u} on {h}?","Passwort für {u} auf {h} aktualisieren?","¿Actualizar la contraseña de {u} en {h}?","Mettre à jour le mot de passe de {u} sur {h} ?","לעדכן את הסיסמה של {u} ב-{h}?","要更新 {u} 在 {h} 的密碼嗎？","Zaktualizować hasło dlŏ {u} na {h}?"],["Proponuj zapisywanie haseł","Offer to save passwords","Speichern von Passwörtern anbieten","Ofrecer guardar contraseñas","Proposer d’enregistrer les mots de passe","הצע לשמור סיסמאות","提示儲存密碼","Proponuj zapisowanie hasłōw"],["Hasła są szyfrowane przez system Windows. Chroni to plik przed odczytem z innego konta lub komputera, ale nie przed osobą korzystającą z Twojej sesji.","Passwords are encrypted by Windows. This protects the file from being read from another account or computer, but not from someone using your session.","Passwörter werden von Windows verschlüsselt. Das schützt die Datei vor dem Lesen von einem anderen Konto oder Computer, nicht aber vor jemandem, der deine Sitzung nutzt.","Windows cifra las contraseñas. Esto protege el archivo de lecturas desde otra cuenta u otro equipo, pero no de alguien que use tu sesión.","Les mots de passe sont chiffrés par Windows. Cela protège le fichier contre une lecture depuis un autre compte ou ordinateur, mais pas contre une personne utilisant votre session.","הסיסמאות מוצפנות על ידי Windows. זה מגן על הקובץ מקריאה מחשבון או ממחשב אחר, אך לא מפני מי שמשתמש בהפעלה שלך.","密碼由 Windows 加密。這可防止檔案被其他帳戶或電腦讀取，但無法防止使用您工作階段的人。","Hasła sōm szyfrowane bez system Windows. To chrōni zbiōr przed ôdczytym ze inkszego kōnta abo kōmputra, ale niy przed ôsobōm, kero używo Twojij sesyji."],["Szyfrowanie systemowe jest niedostępne. Sejf haseł nie działa.","System encryption is unavailable. The password vault does not work.","Die Systemverschlüsselung ist nicht verfügbar. Der Passwort-Tresor funktioniert nicht.","El cifrado del sistema no está disponible. La caja de contraseñas no funciona.","Le chiffrement du système est indisponible. Le coffre de mots de passe ne fonctionne pas.","הצפנת המערכת אינה זמינה. כספת הסיסמאות אינה פועלת.","系統加密無法使用，密碼保險庫無法運作。","Szyfrowanie systymowe niy je dostympne. Sejf hasłōw niy dziŏła."],["Brak zapisanych haseł.","No saved passwords.","Keine gespeicherten Passwörter.","No hay contraseñas guardadas.","Aucun mot de passe enregistré.","אין סיסמאות שמורות.","沒有已儲存的密碼。","Niy ma zapisanych hasłōw."],["Blokuj reklamy i śledzące skrypty","Block ads and tracking scripts","Werbung und Tracking-Skripte blockieren","Bloquear anuncios y scripts de rastreo","Bloquer les publicités et les scripts de suivi","חסום פרסומות וסקריפטי מעקב","封鎖廣告與追蹤指令碼","Blokuj reklamy i śledzōnce skrypty"],["Blokuje żądania do znanych sieci reklamowych i trackerów, gdy pochodzą z innej witryny. To proste filtrowanie po domenach: nie usuwa reklam wbudowanych w stronę (np. w YouTube).","Blocks requests to known ad networks and trackers when they come from another site. This is simple domain filtering: it does not remove ads built into the page (e.g. on YouTube).","Blockiert Anfragen an bekannte Werbenetzwerke und Tracker, wenn sie von einer anderen Website stammen. Das ist einfaches Domain-Filtern: Es entfernt keine in die Seite eingebaute Werbung (z. B. bei YouTube).","Bloquea las solicitudes a redes publicitarias y rastreadores conocidos cuando proceden de otro sitio. Es un filtrado simple por dominios: no elimina los anuncios integrados en la página (p. ej. en YouTube).","Bloque les requêtes vers des réseaux publicitaires et traqueurs connus lorsqu’elles proviennent d’un autre site. C’est un simple filtrage par domaine : il ne supprime pas les publicités intégrées à la page (p. ex. sur YouTube).","חוסם בקשות לרשתות פרסום ולמעקבים מוכרים כשהן מגיעות מאתר אחר. זהו סינון פשוט לפי דומיינים: הוא אינו מסיר פרסומות המשובצות בדף (למשל ביוטיוב).","封鎖來自其他網站、前往已知廣告網路與追蹤器的要求。這是簡單的網域過濾，不會移除內嵌於頁面的廣告（例如 YouTube）。","Blokuje żōndania do znanych sieci reklamowych i trackerōw, jak ôd inkszyj zajty przichodzōm. To prosty filtr po domynach: niy wycieje reklam wbudowanych we zajta (np. we YouTube)."],["Zablokowano w tej sesji: {n}","Blocked this session: {n}","In dieser Sitzung blockiert: {n}","Bloqueado en esta sesión: {n}","Bloqué pendant cette session : {n}","נחסמו בהפעלה זו: {n}","本次工作階段已封鎖：{n}","Zablokowane w tyj sesyji: {n}"],["Szukaj na stronie...","Find on page...","Auf der Seite suchen...","Buscar en la página...","Rechercher dans la page...","חפש בדף...","在頁面中尋找...","Szukej na zajcie..."],["Poprzednie","Previous","Zurück","Anterior","Précédent","הקודם","上一個","Piyrwsze"],["Następne","Next","Weiter","Siguiente","Suivant","הבא","下一個","Nastympne"],["{a} z {b}","{a} of {b}","{a} von {b}","{a} de {b}","{a} sur {b}","{a} מתוך {b}","{a}/{b}","{a} ze {b}"],["Brak wyników","No results","Keine Ergebnisse","Sin resultados","Aucun résultat","אין תוצאות","沒有結果","Niy ma wynikōw"],["Przywróć powiększenie 100%","Reset zoom to 100%","Zoom auf 100 % zurücksetzen","Restablecer zoom al 100 %","Rétablir le zoom à 100 %","אפס את הזום ל-100%","將縮放重設為 100%","Przywrōć powiynkszynie 100%"],["Strona","Page","Seite","Página","Page","דף","頁面","Zajta"],["Szukaj na stronie","Find on page","Auf der Seite suchen","Buscar en la página","Rechercher dans la page","חפש בדף","在頁面中尋找","Szukej na zajcie"],["Powiększ stronę","Zoom in","Seite vergrößern","Acercar página","Agrandir la page","הגדל דף","放大頁面","Powiynksz zajtã"],["Pomniejsz stronę","Zoom out","Seite verkleinern","Alejar página","Réduire la page","הקטן דף","縮小頁面","Pōmniyjsz zajtã"],["Zresetuj powiększenie","Reset zoom","Zoom zurücksetzen","Restablecer zoom","Réinitialiser le zoom","אפס זום","重設縮放","Zresetuj powiynkszynie"],["Drukuj stronę","Print page","Seite drucken","Imprimir página","Imprimer la page","הדפס דף","列印頁面","Drukuj zajtã"],["Narzędzia deweloperskie strony","Page developer tools","Entwicklertools der Seite","Herramientas de desarrollo de la página","Outils de développement de la page","כלי מפתחים של הדף","頁面開發人員工具","Nŏrzyndzia deweloperske zajty"],["Narzędzia deweloperskie interfejsu","Interface developer tools","Entwicklertools der Oberfläche","Herramientas de desarrollo de la interfaz","Outils de développement de l’interface","כלי מפתחים של הממשק","介面開發人員工具","Nŏrzyndzia deweloperske interfejsu"],["Przypięte karty","Pinned tabs","Angeheftete Tabs","Pestañas fijadas","Onglets épinglés","כרטיסיות נעוצות","釘選的分頁","Przipniynte karty"],["Gdzie wyświetlać przypięte karty. Kartę można przypiąć, przeciągając ją nad wybrany pasek.","Where to show pinned tabs. You can pin a tab by dragging it over the chosen bar.","Wo angeheftete Tabs angezeigt werden. Ein Tab lässt sich anheften, indem man ihn über die gewählte Leiste zieht.","Dónde mostrar las pestañas fijadas. Puedes fijar una pestaña arrastrándola sobre la barra elegida.","Où afficher les onglets épinglés. Vous pouvez épingler un onglet en le faisant glisser sur la barre choisie.","היכן להציג כרטיסיות נעוצות. אפשר לנעוץ כרטיסייה על ידי גרירתה מעל הסרגל שנבחר.","釘選分頁的顯示位置。將分頁拖曳到所選的列上即可釘選。","Kaj pokazować przipniynte karty. Karta idzie przipnōńć, cióngnōnc jã nad wybrany pasek."],["Pasek u góry","Top bar","Leiste oben","Barra superior","Barre du haut","סרגל עליון","頂部列","Pasek na wiyrchu"],["Lewy pasek pod folderami","Left bar below folders","Linke Leiste unter den Ordnern","Barra izquierda bajo las carpetas","Barre de gauche sous les dossiers","הסרגל השמאלי מתחת לתיקיות","左側列（資料夾下方）","Lewy pasek pod folderōma"],["Logowanie na stronach","Signing in to websites","Anmeldung auf Websites","Inicio de sesión en sitios web","Connexion aux sites web","התחברות לאתרים","網站登入","Logowanie na zajtach"],["Zgodność z logowaniem do konta Google","Google account sign-in compatibility","Kompatibilität mit der Google-Kontoanmeldung","Compatibilidad con el inicio de sesión de Google","Compatibilité avec la connexion au compte Google","תאימות להתחברות לחשבון Google","Google 帳戶登入相容性","Zgodność z logowaniym do kōnta Google"],["Google blokuje logowanie w przeglądarkach, które nie wyglądają jak Chrome („Ta przeglądarka lub aplikacja może nie być bezpieczna”). Ta opcja dodaje na stronach elementy, które ma Chrome, a których brakuje Arkanie. Wyłącz ją tylko wtedy, gdy przez nią jakaś strona nie działa. Zmiana działa po odświeżeniu strony.","Google blocks sign-in in browsers that do not look like Chrome (“This browser or app may not be secure”). This option adds to websites the parts that Chrome has and Arkana lacks. Turn it off only if a website stops working because of it. The change applies after reloading the page.","Google blockiert die Anmeldung in Browsern, die nicht wie Chrome aussehen („Dieser Browser oder diese App ist möglicherweise nicht sicher“). Diese Option ergänzt auf Websites die Teile, die Chrome hat und Arkana fehlen. Schalte sie nur aus, wenn eine Website deswegen nicht funktioniert. Die Änderung gilt nach dem Neuladen der Seite.","Google bloquea el inicio de sesión en navegadores que no parecen Chrome («Es posible que este navegador o esta aplicación no sean seguros»). Esta opción añade en los sitios las partes que tiene Chrome y le faltan a Arkana. Desactívala solo si algún sitio deja de funcionar por ella. El cambio se aplica al recargar la página.","Google bloque la connexion dans les navigateurs qui ne ressemblent pas à Chrome (« Ce navigateur ou cette application ne sont peut-être pas sécurisés »). Cette option ajoute aux sites les éléments que Chrome possède et qui manquent à Arkana. Ne la désactivez que si un site ne fonctionne plus à cause d’elle. Le changement s’applique après l’actualisation de la page.","Google חוסמת התחברות בדפדפנים שאינם נראים כמו Chrome („ייתכן שהדפדפן או האפליקציה אינם מאובטחים”). אפשרות זו מוסיפה לאתרים רכיבים שיש ב-Chrome וחסרים ב-Arkana. כבה אותה רק אם אתר כלשהו מפסיק לעבוד בגללה. השינוי חל לאחר רענון הדף.","Google 會封鎖看起來不像 Chrome 的瀏覽器登入（「這個瀏覽器或應用程式可能不安全」）。此選項會在網站上補上 Chrome 具備而 Arkana 缺少的部分。只有在某個網站因此無法運作時才關閉它。變更會在重新整理頁面後生效。","Google blokuje logowanie w przeglōndarkach, kere niy wyglōndajōm jak Chrome („Ta przeglōndarka abo aplikacyjŏ może niy być bezpiecznŏ”). Ta ôpcyjŏ dodŏwŏ na zajtach tyn kōnsek, kery mŏ Chrome, a kerego brakuje Arkanie. Wyłōncz jã ino wtedy, jak bez nia jakŏ zajta niy działŏ. Zmiana działŏ po ôdświyżyniu zajty."],["Pozwalaj stronom używać kluczy dostępu (Windows Hello)","Allow websites to use passkeys (Windows Hello)","Websites die Verwendung von Passkeys erlauben (Windows Hello)","Permitir que los sitios usen llaves de acceso (Windows Hello)","Autoriser les sites à utiliser des clés d’accès (Windows Hello)","לאפשר לאתרים להשתמש במפתחות גישה (Windows Hello)","允許網站使用密碼金鑰（Windows Hello）","Przizwŏlej zajtōm używać kluczy dostympu (Windows Hello)"],["Gdy ta opcja jest wyłączona, strony nie mogą otworzyć systemowego okna „Zaloguj się przy użyciu klucza dostępu” i proponują logowanie hasłem. Zmiana działa po odświeżeniu strony.","When this option is off, websites cannot open the system “Sign in with a passkey” window and offer password sign-in instead. The change applies after reloading the page.","Ist diese Option aus, können Websites das Systemfenster „Mit einem Passkey anmelden“ nicht öffnen und bieten stattdessen die Anmeldung mit Passwort an. Die Änderung gilt nach dem Neuladen der Seite.","Si esta opción está desactivada, los sitios no pueden abrir la ventana del sistema «Iniciar sesión con una llave de acceso» y ofrecen iniciar sesión con contraseña. El cambio se aplica al recargar la página.","Lorsque cette option est désactivée, les sites ne peuvent pas ouvrir la fenêtre système « Se connecter avec une clé d’accès » et proposent la connexion par mot de passe. Le changement s’applique après l’actualisation de la page.","כשאפשרות זו כבויה, אתרים לא יכולים לפתוח את חלון המערכת „היכנס באמצעות מפתח גישה” ומציעים התחברות עם סיסמה. השינוי חל לאחר רענון הדף.","關閉此選項時，網站無法開啟系統的「使用密碼金鑰登入」視窗，而會改為提供密碼登入。變更會在重新整理頁面後生效。","Jak ta ôpcyjŏ je wyłōnczōnŏ, zajty niy poradzōm ôtworzić systymowego ôkna „Zaloguj sie kluczym dostympu” i dajōm logowanie hasłym. Zmiana działŏ po ôdświyżyniu zajty."],["Nowe okno","New window","Neues Fenster","Nueva ventana","Nouvelle fenêtre","חלון חדש","新視窗","Nowe ôkno"],["Nowe okno incognito","New incognito window","Neues Inkognitofenster","Nueva ventana de incógnito","Nouvelle fenêtre de navigation privée","חלון גלישה בסתר חדש","新增無痕式視窗","Nowe ôkno incognito"],["Otwórz kartę w oknie incognito","Open tab in incognito window","Tab in Inkognitofenster öffnen","Abrir pestaña en ventana de incógnito","Ouvrir l’onglet dans une fenêtre de navigation privée","פתח כרטיסייה בחלון גלישה בסתר","在無痕式視窗中開啟分頁","Ôtwōrz kartã w ôknie incognito"],["Otwórz folder w oknie incognito","Open folder in incognito window","Ordner in Inkognitofenster öffnen","Abrir carpeta en ventana de incógnito","Ouvrir le dossier dans une fenêtre de navigation privée","פתח תיקייה בחלון גלישה בסתר","在無痕式視窗中開啟資料夾","Ôtwōrz folder w ôknie incognito"],["Menu","Menu","Menü","Menú","Menu","תפריט","選單","Menu"],["Incognito","Incognito","Inkognito","Incógnito","Incognito","גלישה בסתר","無痕","Incognito"],["Ikona aplikacji","App icon","App-Symbol","Icono de la aplicación","Icône de l’application","סמל האפליקציה","應用程式圖示","Ikōna aplikacyje"],["Ikona aplikacji w kolorach motywu","App icon in theme colours","App-Symbol in Designfarben","Icono de la aplicación con los colores del tema","Icône de l’application aux couleurs du thème","סמל האפליקציה בצבעי ערכת הנושא","應用程式圖示使用主題色彩","Ikōna aplikacyje w farbach motywu"],["Ikona Arkany na pasku zadań (także przypiętej) przyjmuje kolory motywu. Po wyłączeniu wraca oryginalna ikona. Zmiana działa od razu.","The Arkana icon on the taskbar (also when pinned) takes the theme colors. When turned off, the original icon returns. The change takes effect immediately.","Das Arkana-Symbol in der Taskleiste (auch angeheftet) übernimmt die Farben des Designs. Beim Ausschalten kehrt das Originalsymbol zurück. Die Änderung wirkt sofort.","El icono de Arkana en la barra de tareas (también anclado) adopta los colores del tema. Al desactivarlo vuelve el icono original. El cambio se aplica al instante.","L’icône d’Arkana dans la barre des tâches (même épinglée) prend les couleurs du thème. Une fois désactivée, l’icône d’origine revient. Le changement est immédiat.","הסמל של Arkana בשורת המשימות (גם כשהוא מוצמד) מקבל את צבעי ערכת הנושא. בכיבוי חוזר הסמל המקורי. השינוי חל מיד.","工作列上的 Arkana 圖示（包括已釘選的）會採用主題色彩。關閉後會恢復原始圖示。變更會立即生效。","Ikōna Arkany na pasku zadań (tyż przipniyntego) bierze farby motywu. Po wyłōnczyniu wraco ôryginalno ikōna. Zmiana robi richtich."],["Przypnij we wszystkich folderach","Pin in all folders","In allen Ordnern anheften","Fijar en todas las carpetas","Épingler dans tous les dossiers","נעץ בכל התיקיות","在所有資料夾中釘選","Przipnij we wszyjskich folderach"],["Odepnij ze wszystkich folderów","Unpin from all folders","Aus allen Ordnern lösen","Desfijar de todas las carpetas","Désépingler de tous les dossiers","בטל נעיצה מכל התיקיות","從所有資料夾取消釘選","Ôdepnij ze wszyjskich folderōw"],["Przypnij tylko w tym folderze","Pin in this folder only","Nur in diesem Ordner anheften","Fijar solo en esta carpeta","Épingler uniquement dans ce dossier","נעץ רק בתיקייה זו","僅在此資料夾中釘選","Przipnij ino w tym folderze"],["Przypnij / odepnij we wszystkich folderach","Pin / unpin in all folders","In allen Ordnern anheften / lösen","Fijar / desfijar en todas las carpetas","Épingler / désépingler dans tous les dossiers","נעץ / בטל נעיצה בכל התיקיות","在所有資料夾中釘選／取消釘選","Przipnij / ôdepnij we wszyjskich folderach"],["Strona jest teraz przypięta we wszystkich folderach","The page is now pinned in all folders","Die Seite ist jetzt in allen Ordnern angeheftet","La página ya está fijada en todas las carpetas","La page est maintenant épinglée dans tous les dossiers","הדף נעוץ עכשיו בכל התיקיות","此頁面現已在所有資料夾中釘選","Zajta je teraz przipniyntŏ we wszyjskich folderach"],["Krok {n}/{m}","Step {n}/{m}","Schritt {n}/{m}","Paso {n}/{m}","Étape {n}/{m}","שלב {n}/{m}","步驟 {n}/{m}","Krok {n}/{m}"],["Pomiń poradnik","Skip the tour","Einführung überspringen","Omitir la guía","Passer le guide","דלג על המדריך","略過導覽","Pominij poradnik"],["Następny krok","Next","Weiter","Siguiente","Suivant","הבא","下一步","Nastympny krok"],["Zakończ","Finish","Fertig","Finalizar","Terminer","סיום","完成","Zakōńcz"],["Witaj w Arkanie","Welcome to Arkana","Willkommen bei Arkana","Te damos la bienvenida a Arkana","Bienvenue dans Arkana","ברוכים הבאים ל־Arkana","歡迎使用 Arkana","Witej w Arkanie"],["Ten krótki poradnik pokaże Ci najważniejsze miejsca interfejsu i do czego służą. Możesz go w każdej chwili pominąć.","This short tour shows you the most important parts of the interface and what they do. You can skip it at any time.","Diese kurze Einführung zeigt dir die wichtigsten Stellen der Oberfläche und wofür sie da sind. Du kannst sie jederzeit überspringen.","Esta breve guía te muestra las partes más importantes de la interfaz y para qué sirven. Puedes omitirla en cualquier momento.","Ce court guide vous présente les éléments les plus importants de l’interface et leur rôle. Vous pouvez le passer à tout moment.","המדריך הקצר הזה יראה לך את המקומות החשובים בממשק ולמה הם משמשים. אפשר לדלג עליו בכל רגע.","這份簡短的導覽會帶你認識介面中最重要的部分及其用途。你可以隨時略過。","Tyn krōtki poradnik pokŏże ci nojważniejsze mijsca interfejsu i do czego służōm. Możesz go w kożdyj chwili pominōńć."],["Logo i nawigacja","Logo and navigation","Logo und Navigation","Logotipo y navegación","Logo et navigation","לוגו וניווט","標誌與導覽","Logo i nawigacyjŏ"],["Logo Arkany wraca do strony startowej. Strzałki cofają i przesuwają do przodu historię karty, a przycisk obok odświeża stronę.","The Arkana logo takes you back to the start page. The arrows move back and forward in the tab’s history, and the button next to them reloads the page.","Das Arkana-Logo führt zurück zur Startseite. Die Pfeile gehen im Verlauf des Tabs zurück und vor, die Schaltfläche daneben lädt die Seite neu.","El logotipo de Arkana te lleva a la página de inicio. Las flechas retroceden y avanzan en el historial de la pestaña, y el botón contiguo recarga la página.","Le logo d’Arkana ramène à la page d’accueil. Les flèches reculent et avancent dans l’historique de l’onglet, et le bouton voisin actualise la page.","הלוגו של Arkana מחזיר לדף הבית. החיצים עוברים אחורה וקדימה בהיסטוריית הכרטיסייה, והכפתור לידם מרענן את הדף.","Arkana 標誌會帶你回到首頁。箭頭可在分頁的歷史記錄中往前或往後，旁邊的按鈕則會重新整理頁面。","Logo Arkany wraco na sztartowo zajta. Strzołki cofajōm i posuwajōm do przodku historyjo karty, a knefel ôbok ôdświyżo zajta."],["Wpisz tu adres strony albo pytanie. Adres otworzy się od razu, a tekst zostanie wyszukany wybraną wyszukiwarką.","Type a web address or a question here. An address opens right away, and any other text is searched with your chosen search engine.","Gib hier eine Webadresse oder eine Frage ein. Eine Adresse wird sofort geöffnet, anderer Text wird mit der gewählten Suchmaschine gesucht.","Escribe aquí una dirección web o una pregunta. La dirección se abre al instante y cualquier otro texto se busca con el buscador elegido.","Saisissez ici une adresse web ou une question. Une adresse s’ouvre aussitôt, et tout autre texte est recherché avec le moteur choisi.","הקלד כאן כתובת אתר או שאלה. כתובת תיפתח מיד, וכל טקסט אחר יחופש במנוע החיפוש שבחרת.","在這裡輸入網址或問題。網址會立即開啟，其他文字則會用你選擇的搜尋引擎搜尋。","Wpisz tukej adres zajty abo pytanie. Adres sie ôtwiyro richtich, a tekst bydzie szukany wybranōm szukiwarkōm."],["Każda strona to osobna karta. Plus dodaje nową kartę, a prawy przycisk myszy na karcie otwiera jej menu. Karty możesz przeciągać, by zmienić ich kolejność.","Every page is a separate tab. The plus button adds a new tab, and right-clicking a tab opens its menu. You can drag tabs to change their order.","Jede Seite ist ein eigener Tab. Mit dem Plus öffnest du einen neuen Tab, und ein Rechtsklick auf einen Tab öffnet sein Menü. Du kannst Tabs ziehen, um sie neu anzuordnen.","Cada página es una pestaña independiente. El botón más añade una pestaña nueva y el clic derecho sobre una pestaña abre su menú. Puedes arrastrar las pestañas para reordenarlas.","Chaque page est un onglet distinct. Le bouton plus ajoute un onglet et un clic droit sur un onglet ouvre son menu. Vous pouvez faire glisser les onglets pour les réorganiser.","כל דף הוא כרטיסייה נפרדת. כפתור הפלוס מוסיף כרטיסייה חדשה, וקליק ימני על כרטיסייה פותח את התפריט שלה. אפשר לגרור כרטיסיות כדי לשנות את סדרן.","每個網頁都是獨立的分頁。加號按鈕會新增分頁，在分頁上按右鍵可開啟其選單。你也可以拖曳分頁來調整順序。","Kożdo zajta to ôsobno karta. Plusik dodowo nowõ karta, a prawy knefel myszy na karcie ôtwiyro jeji menu. Karty idzie przeciōng, coby zmiynić ich kolyjność."],["Tu pojawiają się przypięte karty. Przypinasz je z menu prawego przycisku na karcie – zajmują mało miejsca i są zawsze pod ręką.","Pinned tabs appear here. Pin one from the right-click menu on a tab – they take little space and are always at hand.","Hier erscheinen angeheftete Tabs. Du heftest sie über das Rechtsklick-Menü eines Tabs an – sie brauchen wenig Platz und sind immer griffbereit.","Aquí aparecen las pestañas fijadas. Las fijas desde el menú del clic derecho de una pestaña: ocupan poco espacio y siempre están a mano.","Les onglets épinglés apparaissent ici. On les épingle depuis le menu du clic droit sur un onglet : ils prennent peu de place et restent toujours à portée de main.","כאן מופיעות כרטיסיות נעוצות. נועצים אותן מתפריט הקליק הימני של כרטיסייה – הן תופסות מעט מקום ותמיד בהישג יד.","釘選的分頁會顯示在這裡。從分頁的右鍵選單即可釘選，它們佔用空間很小，隨時可用。","Tukej sie zjawiajōm przipniynte karty. Przipinosz je z menu prawego kneflika na karcie – zajmujōm mało placu i sōm zawdy pod rynkōm."],["Foldery to osobne zestawy kart, np. Praca i Prywatne. Kliknij folder, by do niego przejść, a przerywany przycisk na dole dodaje nowy. Prawy przycisk otwiera opcje folderu.","Folders are separate sets of tabs, for example Work and Private. Click a folder to switch to it, and the dashed button at the bottom adds a new one. Right-click opens the folder’s options.","Ordner sind getrennte Tab-Gruppen, zum Beispiel Arbeit und Privat. Klicke auf einen Ordner, um zu ihm zu wechseln; die gestrichelte Schaltfläche unten legt einen neuen an. Ein Rechtsklick öffnet die Ordneroptionen.","Las carpetas son conjuntos independientes de pestañas, por ejemplo Trabajo y Privado. Haz clic en una carpeta para cambiar a ella; el botón de borde discontinuo de abajo crea una nueva. El clic derecho abre las opciones de la carpeta.","Les dossiers sont des ensembles d’onglets distincts, par exemple Travail et Privé. Cliquez sur un dossier pour y passer ; le bouton en pointillés en bas en crée un nouveau. Le clic droit ouvre ses options.","תיקיות הן קבוצות נפרדות של כרטיסיות, למשל עבודה ופרטי. לחץ על תיקייה כדי לעבור אליה, והכפתור המקווקו בתחתית מוסיף תיקייה חדשה. קליק ימני פותח את אפשרויות התיקייה.","資料夾是各自獨立的分頁組合，例如「工作」和「私人」。點一下資料夾即可切換，底部的虛線按鈕可新增資料夾，按右鍵則可開啟資料夾選項。","Foldery to ôsobne zestawy kart, np. Robota i Prywatne. Kliknij folder, coby do niego przejś, a przerywany knefel na dole dodowo nowy. Prawy knefel ôtwiyro ôpcyje folderu."],["Tu zmienisz motyw i kolory, wygląd interfejsu, skróty klawiszowe, prywatność i blokowanie reklam oraz język. Stąd też uruchomisz ten poradnik ponownie.","Here you change the theme and colors, the look of the interface, keyboard shortcuts, privacy and ad blocking, and the language. You can also start this tour again from here.","Hier änderst du Design und Farben, das Aussehen der Oberfläche, Tastenkürzel, Datenschutz, Werbeblocker und die Sprache. Von hier aus kannst du diese Einführung auch erneut starten.","Aquí cambias el tema y los colores, el aspecto de la interfaz, los atajos de teclado, la privacidad, el bloqueo de anuncios y el idioma. Desde aquí también puedes volver a iniciar esta guía.","Ici, vous changez le thème et les couleurs, l’aspect de l’interface, les raccourcis clavier, la confidentialité, le blocage des publicités et la langue. Vous pouvez aussi relancer ce guide depuis ici.","כאן משנים את הערכה והצבעים, את מראה הממשק, קיצורי מקלדת, פרטיות, חסימת פרסומות ושפה. מכאן אפשר גם להפעיל את המדריך הזה מחדש.","你可以在這裡更改主題與色彩、介面外觀、鍵盤快速鍵、隱私與廣告封鎖，以及語言。也可以從這裡重新啟動這份導覽。","Tukej zmiyniosz motyw i farby, wyglōnd interfejsu, skrōty klawiszowe, prywatnōść i blokowanie reklōm a tyż godka. Stōnd tyż włōnczysz tyn poradnik zaś."],["Otwiera boczny panel z asystentem AI obok przeglądanej strony. Zaloguj się w nim raz, a potem zadawaj pytania, nie opuszczając strony.","Opens a side panel with the AI assistant next to the page you are viewing. Sign in once, then ask questions without leaving the page.","Öffnet neben der angezeigten Seite ein Seitenpanel mit dem KI-Assistenten. Einmal anmelden, dann Fragen stellen, ohne die Seite zu verlassen.","Abre un panel lateral con el asistente de IA junto a la página que estás viendo. Inicia sesión una vez y luego haz preguntas sin salir de la página.","Ouvre un panneau latéral avec l’assistant IA à côté de la page affichée. Connectez-vous une fois, puis posez vos questions sans quitter la page.","פותח לוח צד עם עוזר הבינה המלאכותית לצד הדף שאתה צופה בו. מתחברים פעם אחת ואז אפשר לשאול שאלות בלי לעזוב את הדף.","在你瀏覽的頁面旁開啟內含 AI 助理的側邊面板。只需登入一次，之後就能在不離開頁面的情況下提問。","Ôtwiyro boczny panel z asystyntym AI ôbok ôglōndanyj zajty. Zalogujesz sie roz, a potym pytosz, niy ôpuszczajōnc zajty."],["Pasek z wbudowanymi programami i grami, takimi jak kalkulator, notatnik, zegar czy konwerter. Otwierają się w pływających oknach, które możesz przesuwać.","A bar with built-in programs and games such as a calculator, notepad, clock and converter. They open in floating windows that you can move around.","Eine Leiste mit eingebauten Programmen und Spielen wie Rechner, Notizblock, Uhr und Umrechner. Sie öffnen sich in schwebenden Fenstern, die du verschieben kannst.","Una barra con programas y juegos integrados, como calculadora, bloc de notas, reloj y conversor. Se abren en ventanas flotantes que puedes mover.","Une barre de programmes et de jeux intégrés, comme la calculatrice, le bloc-notes, l’horloge et le convertisseur. Ils s’ouvrent dans des fenêtres flottantes que vous pouvez déplacer.","סרגל של תוכנות ומשחקים מובנים, כמו מחשבון, פנקס רשימות, שעון וממיר. הם נפתחים בחלונות צפים שאפשר להזיז.","內建程式與遊戲的列，例如計算機、記事本、時鐘和轉換器。它們會在可移動的浮動視窗中開啟。","Pasek z wbudowanymi programami i grami, jak kalkulator, notatnik, zygor abo kōnwerter. Ôtwiyrajōm sie we pływajōncych ôknach, kere idzie przesuwać."],["Pokazuje listę odwiedzonych stron z wyszukiwarką. Zapisywanie historii i czas jej przechowywania ustawisz w Ustawieniach.","Shows the list of visited pages with a search box. You can set whether history is saved and how long it is kept in Settings.","Zeigt die Liste der besuchten Seiten mit Suchfeld. Ob der Verlauf gespeichert wird und wie lange, stellst du in den Einstellungen ein.","Muestra la lista de páginas visitadas con un buscador. En Ajustes puedes elegir si se guarda el historial y durante cuánto tiempo.","Affiche la liste des pages visitées avec un champ de recherche. Dans les paramètres, vous choisissez si l’historique est enregistré et pendant combien de temps.","מציג את רשימת הדפים שנצפו עם חיפוש. בהגדרות אפשר לקבוע אם ההיסטוריה נשמרת ולכמה זמן.","顯示已瀏覽頁面的清單並提供搜尋。是否儲存歷史記錄以及保留多久，可在設定中調整。","Pokazuje lista ôdwiydzōnych zajt z szukiwarkōm. Zapisowanie historyje i czas jeji trzimanio ustawisz w Ustawiyniach."],["Znajdziesz tu nowe okno, okno incognito bez zapisywania historii, szukanie na stronie, drukowanie i skrót do Ustawień.","Here you will find a new window, an incognito window that does not save history, find on page, printing and a shortcut to Settings.","Hier findest du ein neues Fenster, ein Inkognitofenster ohne Verlauf, die Suche auf der Seite, Drucken und eine Verknüpfung zu den Einstellungen.","Aquí encontrarás nueva ventana, ventana de incógnito que no guarda historial, buscar en la página, imprimir y un acceso directo a Ajustes.","Vous y trouverez une nouvelle fenêtre, une fenêtre de navigation privée sans historique, la recherche dans la page, l’impression et un raccourci vers les paramètres.","כאן תמצא חלון חדש, חלון גלישה בסתר שאינו שומר היסטוריה, חיפוש בדף, הדפסה וקיצור להגדרות.","這裡有新視窗、不記錄歷史的無痕式視窗、頁面內搜尋、列印，以及前往設定的捷徑。","Tukej znojdziesz nowe ôkno, ôkno incognito bez zapisowanio historyje, szukanie na zajcie, drukowanie i skrōt do Ustawiyń."],["To już wszystko","That’s everything","Das war alles","Eso es todo","C’est tout","זה הכול","導覽結束","To już wszystko"],["Poradnik możesz uruchomić ponownie w dowolnej chwili: Ustawienia → System → Pokaż poradnik ponownie. Miłego korzystania z Arkany!","You can start this tour again at any time: Settings → System → Show the tour again. Enjoy using Arkana!","Du kannst die Einführung jederzeit erneut starten: Einstellungen → System → Einführung erneut anzeigen. Viel Freude mit Arkana!","Puedes volver a iniciar esta guía en cualquier momento: Ajustes → Sistema → Mostrar la guía de nuevo. ¡Disfruta de Arkana!","Vous pouvez relancer ce guide à tout moment : Paramètres → Système → Afficher à nouveau le guide. Bonne découverte d’Arkana !","אפשר להפעיל את המדריך מחדש בכל רגע: הגדרות ← מערכת ← הצג את המדריך שוב. שימוש נעים ב־Arkana!","你可以隨時重新啟動導覽：設定 → 系統 → 再次顯示導覽。祝你使用愉快！","Poradnik idzie włōnczyć zaś w kożdyj chwili: Ustawiynia → Systym → Pokoż poradnik zaś. Fajnego używanio Arkany!"],["Poradnik","Tour","Einführung","Guía","Guide","מדריך","導覽","Poradnik"],["Krótki przewodnik po najważniejszych miejscach interfejsu. Sam pokazuje się tylko przy pierwszym uruchomieniu.","A short walkthrough of the most important parts of the interface. It shows up by itself only on the first launch.","Ein kurzer Rundgang durch die wichtigsten Stellen der Oberfläche. Er erscheint nur beim ersten Start von selbst.","Un breve recorrido por las partes más importantes de la interfaz. Solo aparece por sí sola en el primer inicio.","Une courte visite des éléments les plus importants de l’interface. Il ne s’affiche de lui-même qu’au premier lancement.","סיור קצר במקומות החשובים בממשק. הוא מופיע מעצמו רק בהפעלה הראשונה.","簡短介紹介面中最重要的部分。只會在第一次啟動時自動出現。","Krōtki przewodnik po nojważniejszych mijscach interfejsu. Sōm sie pokazuje yno przi pierszym sztarcie."],["Pokaż poradnik ponownie","Show the tour again","Einführung erneut anzeigen","Mostrar la guía de nuevo","Afficher à nouveau le guide","הצג את המדריך שוב","再次顯示導覽","Pokoż poradnik zaś"],["Naciśnij klawisze lub przycisk myszy…","Press keys or a mouse button…","Tasten oder Maustaste drücken…","Pulsa teclas o un botón del ratón…","Appuyez sur des touches ou un bouton de souris…","לחץ על מקשים או על כפתור עכבר…","請按下按鍵或滑鼠按鈕…","Naciś klawisze abo knefel myszy…"],["Możesz też przypisać przycisk myszy: środkowy lub dowolny boczny (lewy i prawy są zablokowane, żeby nie zepsuć nawigacji). Przycisk myszy działa sam, bez żadnego klawisza. Jeśli chcesz wariant z klawiszem, przytrzymaj przy kliknięciu Ctrl, Alt lub Shift.","You can also assign a mouse button: the middle one or any side button (left and right are blocked so navigation keeps working). A mouse button works on its own, without any key. For a variant with a key, hold Ctrl, Alt or Shift while clicking.","Du kannst auch eine Maustaste zuweisen: die mittlere oder eine beliebige Seitentaste (links und rechts sind gesperrt, damit die Navigation nicht kaputtgeht). Eine Maustaste funktioniert allein, ohne weitere Taste. Für eine Variante mit Taste halte beim Klicken Strg, Alt oder Umschalt gedrückt.","También puedes asignar un botón del ratón: el central o cualquier botón lateral (el izquierdo y el derecho están bloqueados para no estropear la navegación). Un botón del ratón funciona solo, sin ninguna tecla. Para una variante con tecla, mantén pulsada Ctrl, Alt o Mayús al hacer clic.","Vous pouvez aussi attribuer un bouton de souris : le bouton central ou n’importe quel bouton latéral (le gauche et le droit sont bloqués pour ne pas casser la navigation). Un bouton de souris fonctionne seul, sans aucune touche. Pour une variante avec une touche, maintenez Ctrl, Alt ou Maj en cliquant.","אפשר גם להקצות כפתור עכבר: האמצעי או כל כפתור צד (השמאלי והימני חסומים כדי לא לפגוע בניווט). כפתור עכבר פועל לבדו, בלי מקש נוסף. לגרסה עם מקש, החזק Ctrl, Alt או Shift בזמן הלחיצה.","你也可以指定滑鼠按鈕：中鍵或任何側邊按鈕（左鍵和右鍵已鎖定，以免影響瀏覽操作）。滑鼠按鈕可單獨使用，無需搭配其他按鍵。若要搭配按鍵，請在點擊時按住 Ctrl、Alt 或 Shift。","Idzie tyż przipisać knefel myszy: postrzodkowy abo kery bocny (lewy i prawy sōm zablokowane, coby niy zepsuć nawigacyje). Knefel myszy robi sōm, bez żodnygo klawisza. Jak chcesz wariant z klawiszym, przitrzimej przi kliknyńciu Ctrl, Alt abo Shift."],["Mysz: środkowy","Mouse: middle","Maus: mittlere","Ratón: central","Souris : milieu","עכבר: אמצעי","滑鼠：中鍵","Mysz: postrzodkowy"],["Mysz 4 (wstecz)","Mouse 4 (back)","Maus 4 (zurück)","Ratón 4 (atrás)","Souris 4 (retour)","עכבר 4 (אחורה)","滑鼠 4（上一頁）","Mysz 4 (nazod)"],["Mysz 5 (dalej)","Mouse 5 (forward)","Maus 5 (vor)","Ratón 5 (adelante)","Souris 5 (avancer)","עכבר 5 (קדימה)","滑鼠 5（下一頁）","Mysz 5 (dalij)"],["Mysz {n}","Mouse {n}","Maus {n}","Ratón {n}","Souris {n}","עכבר {n}","滑鼠 {n}","Mysz {n}"],["Lewego i prawego przycisku myszy nie można przypisać do skrótu.","The left and right mouse buttons cannot be assigned to a shortcut.","Die linke und die rechte Maustaste können keinem Kürzel zugewiesen werden.","El botón izquierdo y el derecho del ratón no se pueden asignar a un atajo.","Les boutons gauche et droit de la souris ne peuvent pas être attribués à un raccourci.","אי אפשר להקצות את כפתור העכבר השמאלי והימני לקיצור.","滑鼠左鍵和右鍵無法指定為快速鍵。","Lewego i prawego kneflika myszy niy idzie przipisać do skrōtu."],["Do przycisku myszy można dodać tylko Ctrl, Alt lub Shift.","Only Ctrl, Alt or Shift can be combined with a mouse button.","Mit einer Maustaste lassen sich nur Strg, Alt oder Umschalt kombinieren.","Con un botón del ratón solo se pueden combinar Ctrl, Alt o Mayús.","Seuls Ctrl, Alt ou Maj peuvent être combinés avec un bouton de souris.","אפשר לשלב עם כפתור עכבר רק Ctrl, Alt או Shift.","滑鼠按鈕只能搭配 Ctrl、Alt 或 Shift。","Do kneflika myszy idzie dodać yno Ctrl, Alt abo Shift."],["Przeglądarka domyślna","Default browser","Standardbrowser","Navegador predeterminado","Navigateur par défaut","דפדפן ברירת מחדל","預設瀏覽器","Przeglōndarka domyślno"],["Sprawdzam…","Checking…","Wird geprüft…","Comprobando…","Vérification…","בודק…","檢查中…","Sprawdzōm…"],["Arkana jest teraz przeglądarką domyślną ✓","Arkana is now your default browser ✓","Arkana ist jetzt dein Standardbrowser ✓","Arkana es ahora tu navegador predeterminado ✓","Arkana est maintenant votre navigateur par défaut ✓","Arkana היא עכשיו דפדפן ברירת המחדל שלך ✓","Arkana 現在是你的預設瀏覽器 ✓","Arkana je teraz twoja domyślno przeglōndarka ✓"],["Arkana nie jest przeglądarką domyślną.","Arkana is not your default browser.","Arkana ist nicht dein Standardbrowser.","Arkana no es tu navegador predeterminado.","Arkana n’est pas votre navigateur par défaut.","Arkana אינה דפדפן ברירת המחדל שלך.","Arkana 不是你的預設瀏覽器。","Arkana niy je twoja domyślno przeglōndarka."],["Windows nie pozwala programom samodzielnie zmienić przeglądarki domyślnej. Po kliknięciu Arkana zarejestruje się w systemie jako przeglądarka i otworzą się Ustawienia Windows, w których wybierz Arkana Browser dla HTTP i HTTPS. Po wybraniu linki z innych programów będą otwierać się w Arkanie.","Windows does not let programs change the default browser on their own. After you click, Arkana registers itself as a browser and Windows Settings opens, where you choose Arkana Browser for HTTP and HTTPS. Afterwards, links from other programs will open in Arkana.","Windows erlaubt Programmen nicht, den Standardbrowser selbst zu ändern. Nach dem Klick registriert sich Arkana als Browser und die Windows-Einstellungen öffnen sich; dort wählst du Arkana Browser für HTTP und HTTPS. Danach öffnen sich Links aus anderen Programmen in Arkana.","Windows no permite que los programas cambien por sí mismos el navegador predeterminado. Al hacer clic, Arkana se registra como navegador y se abre la Configuración de Windows, donde eliges Arkana Browser para HTTP y HTTPS. Después, los enlaces de otros programas se abrirán en Arkana.","Windows ne permet pas aux programmes de changer eux-mêmes le navigateur par défaut. Après le clic, Arkana s’enregistre comme navigateur et les Paramètres de Windows s’ouvrent ; choisissez-y Arkana Browser pour HTTP et HTTPS. Ensuite, les liens d’autres programmes s’ouvriront dans Arkana.","Windows לא מאפשר לתוכנות לשנות בעצמן את דפדפן ברירת המחדל. לאחר הלחיצה Arkana תירשם כדפדפן ותיפתח ההגדרות של Windows, שבהן יש לבחור ב־Arkana Browser עבור HTTP ו־HTTPS. לאחר מכן קישורים מתוכנות אחרות ייפתחו ב־Arkana.","Windows 不允許程式自行變更預設瀏覽器。點擊後，Arkana 會在系統中註冊為瀏覽器並開啟 Windows 設定，請在其中為 HTTP 和 HTTPS 選擇 Arkana Browser。之後，其他程式中的連結會在 Arkana 中開啟。","Windows niy dowo programōm samym zmiynić domyślnyj przeglōndarki. Po kliknyńciu Arkana zarejestruje sie w systymie jako przeglōndarka i ôtwiyrajōm sie Ustawiynia Windows, kaj wybier Arkana Browser dlo HTTP i HTTPS. Potym linki z inkszych programōw bydōm sie ôtwiyrać w Arkanie."],["Ustawia Arkanę jako domyślną przeglądarkę w systemie.","Sets Arkana as the default browser in the system.","Legt Arkana als Standardbrowser im System fest.","Establece Arkana como navegador predeterminado del sistema.","Définit Arkana comme navigateur par défaut du système.","מגדיר את Arkana כדפדפן ברירת המחדל במערכת.","將 Arkana 設為系統的預設瀏覽器。","Ustawio Arkano jako domyślno przeglōndarka w systymie."],["Ustaw Arkanę jako domyślną","Make Arkana the default","Arkana als Standard festlegen","Establecer Arkana como predeterminado","Définir Arkana par défaut","הגדר את Arkana כברירת מחדל","將 Arkana 設為預設","Ustow Arkano jako domyślno"],["Nie udało się zarejestrować Arkany w systemie.","Could not register Arkana in the system.","Arkana konnte nicht im System registriert werden.","No se pudo registrar Arkana en el sistema.","Impossible d’enregistrer Arkana dans le système.","לא ניתן היה לרשום את Arkana במערכת.","無法在系統中註冊 Arkana。","Niy szło zarejestrować Arkany w systymie."],["Ta funkcja nie jest dostępna w tym oknie.","This feature is not available in this window.","Diese Funktion ist in diesem Fenster nicht verfügbar.","Esta función no está disponible en esta ventana.","Cette fonction n’est pas disponible dans cette fenêtre.","תכונה זו אינה זמינה בחלון זה.","此視窗無法使用這項功能。","Ta funkcyjo niy je dostympno w tym ôknie."],["Kolory stron","Page colors","Seitenfarben","Colores de las páginas","Couleurs des pages","צבעי דפים","網頁色彩","Farby zajt"],["Kolor motywu","Theme color","Designfarbe","Color del tema","Couleur du thème","צבע ערכת הנושא","主題色彩","Farba motywu"],["Gradient kolorów","Color gradient","Farbverlauf","Degradado de color","Dégradé de couleurs","מעבר צבעים","色彩漸層","Gradiynt farb"],["Wyłączone","Off","Aus","Desactivado","Désactivé","כבוי","關閉","Wyłōnczone"],["Kolor motywu: strony Google (np. wyszukiwarka) przyjmują kolory motywu. Gradient kolorów: Arkana pobiera kolor otwartej strony i płynnie łączy go z kolorem motywu na paskach, tak że granica między interfejsem a stroną znika (na jasnych stronach przejście jest ograniczone, żeby napisy na paskach pozostały czytelne). Wyłączone: strony wyglądają natywnie, a paski mają zwykły kolor motywu.","Theme color: Google pages (such as search) take the theme colors. Color gradient: Arkana reads the color of the open page and blends it smoothly with the theme color on the bars, so the border between the interface and the page disappears (on light pages the blend is limited so the text on the bars stays readable). Off: pages look native and the bars use the plain theme color.","Designfarbe: Google-Seiten (z. B. die Suche) übernehmen die Farben des Designs. Farbverlauf: Arkana liest die Farbe der geöffneten Seite aus und mischt sie fließend mit der Designfarbe in den Leisten, sodass die Grenze zwischen Oberfläche und Seite verschwindet (auf hellen Seiten ist der Übergang begrenzt, damit die Beschriftungen lesbar bleiben). Aus: Seiten sehen original aus, die Leisten haben die normale Designfarbe.","Color del tema: las páginas de Google (por ejemplo, el buscador) adoptan los colores del tema. Degradado de color: Arkana toma el color de la página abierta y lo mezcla suavemente con el color del tema en las barras, de modo que desaparece el límite entre la interfaz y la página (en páginas claras la mezcla se limita para que los textos de las barras sigan siendo legibles). Desactivado: las páginas se ven nativas y las barras usan el color normal del tema.","Couleur du thème : les pages Google (par exemple la recherche) prennent les couleurs du thème. Dégradé de couleurs : Arkana relève la couleur de la page ouverte et la fond en douceur avec celle du thème sur les barres, si bien que la frontière entre l’interface et la page disparaît (sur les pages claires, la transition est limitée pour que les textes des barres restent lisibles). Désactivé : les pages ont leur aspect natif et les barres gardent la couleur normale du thème.","צבע ערכת הנושא: דפי Google (למשל החיפוש) מקבלים את צבעי ערכת הנושא. מעבר צבעים: Arkana קוראת את צבע הדף הפתוח ומשלבת אותו בעדינות עם צבע ערכת הנושא בסרגלים, כך שהגבול בין הממשק לדף נעלם (בדפים בהירים המעבר מוגבל כדי שהכיתוב בסרגלים יישאר קריא). כבוי: הדפים נראים כמו במקור והסרגלים בצבע ערכת הנושא הרגיל.","主題色彩：Google 頁面（例如搜尋）會採用主題色彩。色彩漸層：Arkana 會讀取目前網頁的顏色，並在列上與主題色彩平順混合，讓介面與網頁之間的邊界消失（在淺色網頁上，過渡會受到限制，以確保列上的文字仍清晰可讀）。關閉：網頁維持原本外觀，列使用一般的主題色彩。","Farba motywu: zajty Google (np. szukiwarka) bierōm farby motywu. Gradiynt farb: Arkana bierze farba ôtwartyj zajty i gładko jã łōnczy z farbōm motywu na paskach, tak ize granica miyndzy interfejsym a zajtōm zanikuje (na jasnych zajtach przechōd je ôgraniczōny, coby napisy na paskach były czytelne). Wyłōnczone: zajty wyglōdajōm ôryginalnie, a paski majōm zwykłõ farbã motywu."],["Czcionka","Font","Schriftart","Fuente","Police","גופן","字型","Czcionka"],["Czcionka całego interfejsu Arkany (nie stron internetowych). Lista pokazuje czcionki zainstalowane w systemie, a każdą inną możesz wpisać ręcznie.","The font of the whole Arkana interface (not of websites). The list shows fonts installed on your system; you can type any other font name manually.","Die Schriftart der gesamten Arkana-Oberfläche (nicht von Webseiten). Die Liste zeigt im System installierte Schriftarten; jede andere kannst du manuell eingeben.","La fuente de toda la interfaz de Arkana (no de los sitios web). La lista muestra las fuentes instaladas en el sistema; puedes escribir manualmente cualquier otra.","La police de toute l’interface d’Arkana (pas des sites web). La liste affiche les polices installées sur le système ; vous pouvez saisir manuellement n’importe quelle autre.","הגופן של כל הממשק של Arkana (לא של אתרים). הרשימה מציגה גופנים המותקנים במערכת, ואת כל גופן אחר אפשר להקליד ידנית.","Arkana 整個介面的字型（不含網頁）。清單顯示系統已安裝的字型，其他字型可手動輸入名稱。","Czcionka cołkij ôbsługi Arkany (niy zajtōw internetowych). Lista pokazuje czcionki zainstalowane w systymie, a inkszõ idzie wpisać rynczy."],["Szukaj lub wpisz nazwę czcionki…","Search or type a font name…","Schriftart suchen oder eingeben…","Busca o escribe un nombre de fuente…","Rechercher ou saisir un nom de police…","חפשו או הקלידו שם גופן…","搜尋或輸入字型名稱…","Szukej abo wpisz miano czcionki…"],["Użyj","Use","Verwenden","Usar","Utiliser","השתמש","使用","Użyj"],["Wybrana czcionka:","Selected font:","Gewählte Schriftart:","Fuente seleccionada:","Police sélectionnée :","הגופן שנבחר:","目前字型：","Wybrano czcionka:"],["Domyślna (Segoe UI)","Default (Segoe UI)","Standard (Segoe UI)","Predeterminada (Segoe UI)","Par défaut (Segoe UI)","ברירת מחדל (Segoe UI)","預設（Segoe UI）","Sztandardowo (Segoe UI)"],["systemowa","system","System","del sistema","système","מערכת","系統","systymowa"],["Brak pasujących zainstalowanych czcionek. Możesz wpisać nazwę i użyć jej poniżej.","No matching installed fonts. You can type a name and use it above.","Keine passenden installierten Schriftarten. Du kannst einen Namen eingeben und ihn verwenden.","No hay fuentes instaladas que coincidan. Puedes escribir un nombre y usarlo.","Aucune police installée ne correspond. Vous pouvez saisir un nom et l’utiliser.","אין גופנים מותקנים תואמים. אפשר להקליד שם ולהשתמש בו.","沒有符合的已安裝字型。可輸入名稱後使用。","Niy ma pasujōncych czcionek. Idzie wpisać miano i użyć."],["Importuj / eksportuj","Import / export","Importieren / Exportieren","Importar / exportar","Importer / exporter","ייבוא / ייצוא","匯入／匯出","Importuj / eksportuj"],["Importuj pliki…","Import files…","Dateien importieren…","Importar archivos…","Importer des fichiers…","ייבוא קבצים…","匯入檔案…","Importuj zbiory…"],["Ta notatka jako .txt","This note as .txt","Diese Notiz als .txt","Esta nota como .txt","Cette note en .txt","הערה זו כ-.txt","此筆記存為 .txt","Ta notatka jako .txt"],["Ta notatka jako .md","This note as .md","Diese Notiz als .md","Esta nota como .md","Cette note en .md","הערה זו כ-.md","此筆記存為 .md","Ta notatka jako .md"],["Ta notatka jako .html","This note as .html","Diese Notiz als .html","Esta nota como .html","Cette note en .html","הערה זו כ-.html","此筆記存為 .html","Ta notatka jako .html"],["Wszystkie jako jeden .txt","All as one .txt","Alle als eine .txt","Todas en un solo .txt","Toutes dans un seul .txt","הכול בקובץ .txt אחד","全部存為單一 .txt","Wszystkie we jednym .txt"],["Kopia wszystkich (.json)","Backup of all (.json)","Sicherung aller (.json)","Copia de todas (.json)","Sauvegarde de toutes (.json)","גיבוי של הכול (.json)","全部備份 (.json)","Kopia wszystkich (.json)"],["Zapisano","Saved","Gespeichert","Guardado","Enregistré","נשמר","已儲存","Zapisane"],["Pominięto plik binarny","Skipped binary file","Binärdatei übersprungen","Archivo binario omitido","Fichier binaire ignoré","קובץ בינארי דולג","已略過二進位檔","Pominiynto binarny zbiōr"],["Zaimportowano notatek","Notes imported","Notizen importiert","Notas importadas","Notes importées","הערות שיובאו","已匯入筆記","Zaimportowane notatki"],["Nic nie zaimportowano","Nothing imported","Nichts importiert","No se importó nada","Rien n’a été importé","לא יובא דבר","未匯入任何內容","Nic niy zaimportowano"],["Pobrane","Downloads","Downloads","Descargas","Téléchargements","הורדות","下載","Pobrane"],["Pobieranie","Downloading","Wird heruntergeladen","Descargando","Téléchargement","מוריד","下載中","Pobiyranie"],["Rozpoczęto pobieranie","Download started","Download gestartet","Descarga iniciada","Téléchargement démarré","ההורדה החלה","開始下載","Zaczyno sie pobiyranie"],["Dodano do kolejki","Added to queue","Zur Warteschlange hinzugefügt","Añadido a la cola","Ajouté à la file d’attente","נוסף לתור","已加入佇列","Dodane do kolejki"],["Kliknij, aby zobaczyć szczegóły","Click to see details","Klicken für Details","Haz clic para ver los detalles","Cliquez pour voir les détails","לחצו לפרטים","按一下以查看詳細資料","Kliknij, coby zobaczyć szczegōły"],["Wyczyść listę","Clear list","Liste leeren","Borrar lista","Vider la liste","נקה רשימה","清除清單","Wyczyść listã"],["Brak pobranych plików","No downloaded files","Keine heruntergeladenen Dateien","No hay archivos descargados","Aucun fichier téléchargé","אין קבצים שהורדו","沒有已下載的檔案","Niy ma pobranych zbiorōw"],["W kolejce","Queued","In Warteschlange","En cola","En file d’attente","בתור","佇列中","W kolejce"],["Anulowano","Cancelled","Abgebrochen","Cancelado","Annulé","בוטל","已取消","Pociyrpniynte"],["Nie udało się pobrać","Download failed","Download fehlgeschlagen","Error en la descarga","Échec du téléchargement","ההורדה נכשלה","下載失敗","Niy szło pobrać"],["Pokaż w folderze","Show in folder","Im Ordner anzeigen","Mostrar en la carpeta","Afficher dans le dossier","הצג בתיקייה","在資料夾中顯示","Pokoż we folderze"],["Anuluj pobieranie","Cancel download","Download abbrechen","Cancelar descarga","Annuler le téléchargement","בטל הורדה","取消下載","Pociyrp pobiyranie"],["Usuń z listy","Remove from list","Aus Liste entfernen","Quitar de la lista","Retirer de la liste","הסר מהרשימה","從清單移除","Wyciep z listy"],["Kolory motywu","Theme colors","Designfarben","Colores del tema","Couleurs du thème","צבעי ערכת הנושא","主題顏色","Farby motywu"],["Do 4 kolorów motywu. Kliknij kolor, aby edytować jego barwę, nasycenie i jasność. Kolejność zmienisz przeciągając ⠿.","Up to 4 theme colors. Click a color to edit its hue, saturation and brightness. Drag ⠿ to change the order.","Bis zu 4 Designfarben. Klicke auf eine Farbe, um Farbton, Sättigung und Helligkeit zu bearbeiten. Ziehe ⠿, um die Reihenfolge zu ändern.","Hasta 4 colores del tema. Haz clic en un color para editar su tono, saturación y brillo. Arrastra ⠿ para cambiar el orden.","Jusqu’à 4 couleurs de thème. Cliquez sur une couleur pour modifier sa teinte, sa saturation et sa luminosité. Faites glisser ⠿ pour changer l’ordre.","עד 4 צבעי ערכת נושא. לחצו על צבע כדי לערוך גוון, רוויה ובהירות. גררו ⠿ כדי לשנות סדר.","最多 4 個主題顏色。按一下顏色可編輯色相、飽和度與亮度。拖曳 ⠿ 可變更順序。","Aże 4 farby motywu. Kliknij farba, coby poprawić jeji barwã, nasycynie i jasność. Kolejność zmiyniysz przeciōngajōnc ⠿."],["Kolor","Color","Farbe","Color","Couleur","צבע","顏色","Farba"],["Przeciągnij, aby zmienić kolejność","Drag to change the order","Ziehen, um die Reihenfolge zu ändern","Arrastra para cambiar el orden","Faites glisser pour changer l’ordre","גררו כדי לשנות סדר","拖曳以變更順序","Przeciōng, coby zmiynić kolejność"],["Usuń kolor","Remove color","Farbe entfernen","Quitar color","Supprimer la couleur","הסר צבע","移除顏色","Wyciep farba"],["+ Dodaj kolor","+ Add color","+ Farbe hinzufügen","+ Añadir color","+ Ajouter une couleur","+ הוסף צבע","+ 新增顏色","+ Dodej farba"],["Przejścia kolorów","Color transitions","Farbübergänge","Transiciones de color","Transitions de couleurs","מעברי צבע","顏色漸層","Przechody farb"],["Kształt przejścia kolorów (kolejność kolorów na liście to kolejność w aplikacji):","Shape of the color transition (the order on the list is the order in the app):","Form des Farbübergangs (die Reihenfolge in der Liste ist die Reihenfolge in der App):","Forma de la transición de color (el orden de la lista es el orden en la aplicación):","Forme de la transition (l’ordre de la liste est l’ordre dans l’application) :","צורת מעבר הצבעים (סדר הרשימה הוא הסדר באפליקציה):","顏色漸層的形狀（清單順序即應用程式中的順序）：","Sztalt przechodu farb (kolejność na liście to kolejność w aplikacji):"],["Poziomo","Horizontal","Horizontal","Horizontal","Horizontal","אופקי","水平","Poziōmo"],["Pionowo","Vertical","Vertikal","Vertical","Vertical","אנכי","垂直","Pionowo"],["Ukośnie ↙","Diagonal ↙","Diagonal ↙","Diagonal ↙","Diagonale ↙","אלכסוני ↙","對角 ↙","Ukośnie ↙"],["Ukośnie ↘","Diagonal ↘","Diagonal ↘","Diagonal ↘","Diagonale ↘","אלכסוני ↘","對角 ↘","Ukośnie ↘"],["Od środka","From the center","Von der Mitte","Desde el centro","Depuis le centre","מהמרכז","由中心向外","Ôd środka"],["Intensywność przejść:","Transition intensity:","Intensität der Übergänge:","Intensidad de las transiciones:","Intensité des transitions :","עוצמת המעברים:","漸層強度：","Intensywność przechodōw:"],["Szybkie","Fast","Schnell","Rápidas","Rapides","מהירים","快速","Szybke"],["Średnie","Medium","Mittel","Medias","Moyennes","בינוניים","中等","Postrzednie"],["Długie","Long","Lang","Largas","Longues","ארוכים","長","Długie"],["Szybkie: większość ekranu w jednym z kolorów. Średnie: złoty środek. Długie: prawie każdy punkt to mieszanka dwóch kolorów.","Fast: most of the screen in one of the colors. Medium: the middle ground. Long: almost every point is a mix of two colors.","Schnell: der Großteil des Bildschirms in einer der Farben. Mittel: der goldene Mittelweg. Lang: fast jeder Punkt ist eine Mischung zweier Farben.","Rápidas: la mayor parte de la pantalla en uno de los colores. Medias: el término medio. Largas: casi cada punto es una mezcla de dos colores.","Rapides : la majeure partie de l’écran dans l’une des couleurs. Moyennes : le juste milieu. Longues : presque chaque point est un mélange de deux couleurs.","מהירים: רוב המסך באחד הצבעים. בינוניים: אמצע הדרך. ארוכים: כמעט כל נקודה היא תערובת של שני צבעים.","快速：大部分畫面為其中一種顏色。中等：折衷。長：幾乎每個點都是兩種顏色的混合。","Szybke: wiynkszość ekranu we jednyj z farb. Postrzednie: złoty postrzodek. Długie: prawie kożdy punkt to mieszanina dwōch farb."],["Podgląd","Preview","Vorschau","Vista previa","Aperçu","תצוגה מקדימה","預覽","Podglōnd"],["Zastosuj","Apply","Anwenden","Aplicar","Appliquer","החל","套用","Zastosuj"],["Cofnij","Undo","Zurücksetzen","Deshacer","Annuler","בטל","還原","Cofnij"],["Podgląd pokazuje tło oraz górny i lewy pasek. Kształt, intensywność i kolejność działają w aplikacji po kliknięciu „Zastosuj”.","The preview shows the background and the top and left bars. Shape, intensity and order take effect in the app after you click “Apply”.","Die Vorschau zeigt den Hintergrund sowie die obere und linke Leiste. Form, Intensität und Reihenfolge wirken in der App nach einem Klick auf „Anwenden“.","La vista previa muestra el fondo y las barras superior e izquierda. La forma, la intensidad y el orden se aplican en la aplicación al hacer clic en «Aplicar».","L’aperçu montre l’arrière-plan ainsi que les barres du haut et de gauche. La forme, l’intensité et l’ordre prennent effet dans l’application après un clic sur « Appliquer ».","התצוגה המקדימה מציגה את הרקע ואת הסרגלים העליון והשמאלי. הצורה, העוצמה והסדר ייכנסו לתוקף באפליקציה לאחר לחיצה על ״החל״.","預覽顯示背景以及上方和左側的列。形狀、強度與順序會在按下「套用」後於應用程式中生效。","Podglōnd pokazuje tło i gōrny a lewy posek. Sztalt, intensywność i kolejność robiōm w aplikacji po kliknyńciu „Zastosuj”."],["Pełny ekran","Full screen","Vollbild","Pantalla completa","Plein écran","מסך מלא","全螢幕","Cołki ekran"],["Powtórzenia przejścia","Transition repeats","Wiederholungen des Übergangs","Repeticiones de la transición","Répétitions de la transition","חזרות המעבר","漸層重複次數","Powtōrzynia przechodu"],["Ile razy cała kolejność kolorów powtarza się na obszarze aplikacji (np. 1→2→3→4→1→2→3→4).","How many times the whole color sequence repeats across the app area (e.g. 1→2→3→4→1→2→3→4).","Wie oft sich die gesamte Farbfolge über die App-Fläche wiederholt (z. B. 1→2→3→4→1→2→3→4).","Cuántas veces se repite toda la secuencia de colores en el área de la aplicación (p. ej. 1→2→3→4→1→2→3→4).","Combien de fois toute la séquence de couleurs se répète sur la zone de l’application (p. ex. 1→2→3→4→1→2→3→4).","כמה פעמים כל רצף הצבעים חוזר על פני שטח האפליקציה (למשל 1→2→3→4→1→2→3→4).","整個顏色順序在應用程式區域內重複的次數（例如 1→2→3→4→1→2→3→4）。","Ile razy cołko kolejność farb sie powtarzo na ôbszarze aplikacji (np. 1→2→3→4→1→2→3→4)."],["Ruch kolorów","Color motion","Farbbewegung","Movimiento de los colores","Mouvement des couleurs","תנועת צבעים","顏色移動","Ruch farb"],["W trybie pełnego ekranu widać tylko jeden kolor, a pozostałe pokazuje ruch lub przechodzenie.","In full-screen mode only one color is visible; the others are shown by motion or transitions.","Im Vollbildmodus ist nur eine Farbe sichtbar; die anderen zeigen Bewegung oder Übergänge.","En modo de pantalla completa solo se ve un color; los demás los muestran el movimiento o las transiciones.","En mode plein écran, une seule couleur est visible ; les autres apparaissent grâce au mouvement ou aux transitions.","במצב מסך מלא נראה צבע אחד בלבד; האחרים מוצגים באמצעות תנועה או מעבר.","全螢幕模式只會顯示一種顏色，其他顏色透過移動或漸變呈現。","We trybie cołkigo ekranu widać yno jedna farba, a inksze pokazuje ruch abo przechod."],["Kierunek przesuwania się kolorów:","Direction in which the colors move:","Richtung, in die sich die Farben bewegen:","Dirección en la que se mueven los colores:","Direction de déplacement des couleurs :","כיוון תנועת הצבעים:","顏色移動方向：","Kierōnek przesuwanio sie farb:"],["Wyłączony","Off","Aus","Desactivado","Désactivé","כבוי","關閉","Wyłōnczōny"],["↓ W dół","↓ Down","↓ Nach unten","↓ Hacia abajo","↓ Vers le bas","↓ למטה","↓ 向下","↓ We dōł"],["↑ W górę","↑ Up","↑ Nach oben","↑ Hacia arriba","↑ Vers le haut","↑ למעלה","↑ 向上","↑ Do gōry"],["→ W prawo","→ Right","→ Nach rechts","→ A la derecha","→ Vers la droite","→ ימינה","→ 向右","→ W prawo"],["← W lewo","← Left","← Nach links","← A la izquierda","← Vers la gauche","← שמאלה","← 向左","← W lewo"],["↙ W lewy dół","↙ Down-left","↙ Nach links unten","↙ Abajo a la izquierda","↙ Vers le bas à gauche","↙ שמאלה למטה","↙ 向左下","↙ W lewy dōł"],["↗ W prawą górę","↗ Up-right","↗ Nach rechts oben","↗ Arriba a la derecha","↗ Vers le haut à droite","↗ ימינה למעלה","↗ 向右上","↗ W prawõ gōrã"],["↘ W prawy dół","↘ Down-right","↘ Nach rechts unten","↘ Abajo a la derecha","↘ Vers le bas à droite","↘ ימינה למטה","↘ 向右下","↘ W prawy dōł"],["↖ W lewą górę","↖ Up-left","↖ Nach links oben","↖ Arriba a la izquierda","↖ Vers le haut à gauche","↖ שמאלה למעלה","↖ 向左上","↖ W lewõ gōrã"],["Na zewnątrz","Outward","Nach außen","Hacia fuera","Vers l’extérieur","החוצה","向外","Na zewnōntrz"],["Do środka","Inward","Nach innen","Hacia dentro","Vers l’intérieur","פנימה","向內","Do postrzodka"],["Przechodzenie kolorów w miejscu (łączenia stoją, kolory płyną jeden w drugi)","Color fading in place (the joins stay put, colors flow into one another)","Farbübergang an Ort und Stelle (die Nahtstellen bleiben, die Farben fließen ineinander)","Transición de colores en el sitio (las uniones se quedan, los colores pasan de uno a otro)","Fondu des couleurs sur place (les jonctions restent fixes, les couleurs se fondent l’une dans l’autre)","מעבר צבעים במקום (נקודות החיבור נשארות והצבעים זורמים זה לזה)","原地顏色漸變（交界處不動，顏色逐一變換）","Przechodzynie farb na môjscu (połōnczynia stoją, farby płynōm jedna we drugõ)"],["Czas przejścia jednego koloru","Time for one color to change into the next","Dauer des Übergangs einer Farbe","Tiempo de transición de un color","Durée de transition d’une couleur","זמן המעבר של צבע אחד","單一顏色的轉換時間","Czas przechodu jednyj farby"],["Podgląd pokazuje tło oraz górny i lewy pasek (z ruchem, jeśli jest włączony). Kształt, intensywność, powtórzenia, ruch i czas działają w aplikacji po kliknięciu „Zastosuj”.","The preview shows the background and the top and left bars (with motion, if enabled). Shape, intensity, repeats, motion and time take effect in the app after you click “Apply”.","Die Vorschau zeigt den Hintergrund sowie die obere und linke Leiste (mit Bewegung, falls aktiviert). Form, Intensität, Wiederholungen, Bewegung und Zeit wirken in der App nach einem Klick auf „Anwenden“.","La vista previa muestra el fondo y las barras superior e izquierda (con movimiento, si está activado). La forma, la intensidad, las repeticiones, el movimiento y el tiempo se aplican en la aplicación al hacer clic en «Aplicar».","L’aperçu montre l’arrière-plan ainsi que les barres du haut et de gauche (avec mouvement, s’il est activé). La forme, l’intensité, les répétitions, le mouvement et la durée prennent effet dans l’application après un clic sur « Appliquer ».","התצוגה המקדימה מציגה את הרקע ואת הסרגלים העליון והשמאלי (עם תנועה, אם הופעלה). צורה, עוצמה, חזרות, תנועה וזמן ייכנסו לתוקף באפליקציה לאחר לחיצה על ״החל״.","預覽顯示背景以及上方和左側的列（若已開啟則含移動效果）。形狀、強度、重複次數、移動與時間會在按下「套用」後於應用程式中生效。","Podglōnd pokazuje tło i gōrny a lewy posek (z ruchym, jeli je włōnczōny). Sztalt, intensywność, powtōrzynia, ruch i czas robiōm w aplikacji po kliknyńciu „Zastosuj”."],["Korekta wszystkich kolorów motywu","Adjust all theme colors","Alle Designfarben anpassen","Ajustar todos los colores del tema","Ajuster toutes les couleurs du thème","התאמת כל צבעי ערכת הנושא","調整所有主題顏色","Poprawka wszystkich farb motywu"],["Korekta wszystkich kolorów akcentu","Adjust all accent colors","Alle Akzentfarben anpassen","Ajustar todos los colores de acento","Ajuster toutes les couleurs d’accent","התאמת כל צבעי ההדגשה","調整所有強調色","Poprawka wszystkich farb akcyntu"],["Przesuwa jasność, nasycenie i składowe RGB każdego koloru o podaną wartość (nie ustawia ich na stałe). Gdy któryś kolor dojdzie do granicy zakresu, zostaje na niej.","Shifts the brightness, saturation and RGB components of every color by the given amount (it does not set them to a fixed value). When a color reaches the limit of its range, it stays at that limit.","Verschiebt Helligkeit, Sättigung und RGB-Anteile jeder Farbe um den angegebenen Wert (setzt sie nicht fest). Erreicht eine Farbe die Bereichsgrenze, bleibt sie dort.","Desplaza el brillo, la saturación y los componentes RGB de cada color en el valor indicado (no los fija). Cuando un color llega al límite de su rango, se queda en él.","Décale la luminosité, la saturation et les composantes RVB de chaque couleur de la valeur indiquée (sans les fixer). Lorsqu’une couleur atteint la limite de sa plage, elle y reste.","מזיז את הבהירות, הרוויה ורכיבי ה-RGB של כל צבע בערך שצוין (ולא קובע אותם לערך קבוע). כשצבע מגיע לגבול הטווח שלו, הוא נשאר בו.","對每個顏色的亮度、飽和度與 RGB 成分依指定值位移（並非設為固定值）。當顏色到達範圍極限時，會停在極限值。","Przesuwo jasność, nasycynie i skłodniki RGB kożdyj farby ô podanõ wartość (niy ustawio jich na stołe). Jak jakŏ farba dojdzie do granice zakresu, zostowo na niyj."],["Zeruj korektę","Reset adjustment","Anpassung zurücksetzen","Restablecer ajuste","Réinitialiser l’ajustement","אפס התאמה","重設調整","Zeruj poprawkã"],["Do 4 kolorów akcentu. Bez przechodzenia w czasie akcentem jest pierwszy kolor z listy.","Up to 4 accent colors. Without fading over time, the accent is the first color on the list.","Bis zu 4 Akzentfarben. Ohne zeitlichen Übergang ist die erste Farbe der Liste der Akzent.","Hasta 4 colores de acento. Sin transición en el tiempo, el acento es el primer color de la lista.","Jusqu’à 4 couleurs d’accent. Sans transition dans le temps, l’accent est la première couleur de la liste.","עד 4 צבעי הדגשה. ללא מעבר בזמן, ההדגשה היא הצבע הראשון ברשימה.","最多 4 個強調色。若未啟用隨時間漸變，強調色為清單中的第一個顏色。","Aże 4 farby akcyntu. Bez przechodzynia w czasie akcyntym je piyrszŏ farba z listy."],["Przechodzenie kolorów akcentu w czasie","Fade accent colors over time","Akzentfarben im Zeitverlauf überblenden","Transición de los colores de acento en el tiempo","Fondu des couleurs d’accent dans le temps","מעבר צבעי ההדגשה לאורך זמן","強調色隨時間漸變","Przechodzynie farb akcyntu w czasie"],["Podział kolorów:","Color split:","Farbaufteilung:","División de colores:","Répartition des couleurs :","חלוקת הצבעים:","顏色分段：","Podział farb:"],["Równy podział","Equal split","Gleichmäßige Aufteilung","División igual","Répartition égale","חלוקה שווה","平均分段","Rōwny podział"],["Niestandardowy podział…","Custom split…","Benutzerdefinierte Aufteilung…","División personalizada…","Répartition personnalisée…","חלוקה מותאמת…","自訂分段…","Ôsobny podział…"],["Niestandardowy podział","Custom split","Benutzerdefinierte Aufteilung","División personalizada","Répartition personnalisée","חלוקה מותאמת","自訂分段","Ôsobny podział"],["Linie podziału:","Split lines:","Trennlinien:","Líneas de división:","Lignes de séparation :","קווי חלוקה:","分段線：","Linie podziału:"],["Kliknij w prostokącie, aby postawić linię podziału. Linia podąża za kursorem, a podgląd pokazuje wygląd podziału w tym miejscu.","Click in the rectangle to place a split line. The line follows the cursor and the preview shows how the split would look at that spot.","Klicke in das Rechteck, um eine Trennlinie zu setzen. Die Linie folgt dem Cursor, und die Vorschau zeigt, wie die Aufteilung an dieser Stelle aussähe.","Haz clic en el rectángulo para colocar una línea de división. La línea sigue al cursor y la vista previa muestra cómo quedaría la división en ese punto.","Cliquez dans le rectangle pour placer une ligne de séparation. La ligne suit le curseur et l’aperçu montre l’effet de la répartition à cet endroit.","לחצו בתוך המלבן כדי להציב קו חלוקה. הקו עוקב אחרי הסמן והתצוגה המקדימה מראה איך תיראה החלוקה במקום הזה.","在矩形內按一下即可放置分段線。線會跟隨游標，預覽會顯示在該位置分段的效果。","Kliknij we prostokōncie, coby postawić linia podziału. Linia chodzi za kursorym, a podglōnd pokazuje jak by wyglōdoł podział we tym placu."],["Pozostało linii do postawienia:","Lines left to place:","Noch zu setzende Linien:","Líneas por colocar:","Lignes restant à placer :","קווים שנותר להציב:","尚待放置的線：","Ôstało linii do postawiyniŏ:"],["Wszystkie linie postawione. Zatwierdź albo cofnij ostatnią.","All lines placed. Confirm, or undo the last one.","Alle Linien gesetzt. Bestätige oder mache die letzte rückgängig.","Todas las líneas colocadas. Confirma o deshaz la última.","Toutes les lignes sont placées. Validez ou annulez la dernière.","כל הקווים הוצבו. אשרו או בטלו את האחרון.","所有線都已放置。請確認，或復原最後一條。","Wszyskie linie postawiōne. Zatwierdź abo cofnij ôstatniõ."],["Zatwierdź","Confirm","Bestätigen","Confirmar","Valider","אשר","確認","Zatwierdź"],["Eksportuj…","Export…","Exportieren…","Exportar…","Exporter…","ייצוא…","匯出…","Eksportuj…"],["← Wstecz","← Back","← Zurück","← Atrás","← Retour","← חזרה","← 返回","← Nazod"],["Granica jest ustawiana raz w obrębie jednego przejścia, a linie pokazują jej położenie w każdym powtórzeniu (np. 1/3 przejścia to 1/6 ekranu przy 2 powtórzeniach i 1/9 przy 3).","The split is set once within a single transition, and the lines show its position in every repeat (e.g. 1/3 of the transition is 1/6 of the screen with 2 repeats and 1/9 with 3).","Die Grenze wird einmal innerhalb eines Übergangs gesetzt, und die Linien zeigen ihre Position in jeder Wiederholung (z. B. 1/3 des Übergangs entspricht 1/6 des Bildschirms bei 2 Wiederholungen und 1/9 bei 3).","El límite se fija una vez dentro de una transición y las líneas muestran su posición en cada repetición (p. ej., 1/3 de la transición es 1/6 de la pantalla con 2 repeticiones y 1/9 con 3).","La limite est définie une fois au sein d’une transition, et les lignes montrent sa position dans chaque répétition (p. ex. 1/3 de la transition correspond à 1/6 de l’écran avec 2 répétitions et 1/9 avec 3).","הגבול נקבע פעם אחת בתוך מעבר יחיד, והקווים מראים את מיקומו בכל חזרה (למשל 1/3 מהמעבר הוא 1/6 מהמסך עם 2 חזרות ו-1/9 עם 3).","分段位置只在單一漸層內設定一次，線條會顯示它在每次重複中的位置（例如漸層的 1/3 在重複 2 次時為螢幕的 1/6，重複 3 次時為 1/9）。","Granica sie ustawio raz we jednym przechodzie, a linie pokazujōm jeji plac we kożdym powtōrzyniu (np. 1/3 przechodu to 1/6 ekranu przi 2 powtōrzyniach a 1/9 przi 3)."],["Najedź na wybrany kolor i kliknij, aby go skopiować. Esc — anuluj.","Hover over the color you want and click to copy it. Esc — cancel.","Fahre über die gewünschte Farbe und klicke, um sie zu übernehmen. Esc — abbrechen.","Pasa el cursor sobre el color que quieras y haz clic para copiarlo. Esc — cancelar.","Survolez la couleur voulue et cliquez pour la copier. Échap — annuler.","רחפו מעל הצבע הרצוי ולחצו כדי להעתיק אותו. Esc — ביטול.","將游標移到想要的顏色上並按一下即可複製。Esc — 取消。","Najydź na wybranõ farbã i kliknij, coby jã skopiować. Esc — pociyrp."],["Pipeta: wybierz kolor z ekranu","Eyedropper: pick a color from the screen","Pipette: Farbe vom Bildschirm wählen","Cuentagotas: elegir un color de la pantalla","Pipette : choisir une couleur à l’écran","טפטפת: בחירת צבע מהמסך","滴管：從螢幕選取顏色","Pipeta: ôbier farbã z ekranu"]];
// ===== src/js/04-i18n-engine.js =====

// ---------- tryb kodu: Morse i Braille (osobno dla każdego języka; chiński niedostępny - brak tabeli znaków) ----------
const CODEMODE=(()=>{ const u=S.settings.ui, m=u.cmode; return (m==='morse'||m==='braille')&&u.lang!=='zh'?m:''; })();
const cdTab=x=>{ const o={}; x.split('|').forEach(p=>{ o[p[0]]=p.slice(2); }); return o; };
const MRS_L=cdTab('A .-|B -...|C -.-.|D -..|E .|F ..-.|G --.|H ....|I ..|J .---|K -.-|L .-..|M --|N -.|O ---|P .--.|Q --.-|R .-.|S ...|T -|U ..-|V ...-|W .--|X -..-|Y -.--|Z --..|0 -----|1 .----|2 ..---|3 ...--|4 ....-|5 .....|6 -....|7 --...|8 ---..|9 ----.|. .-.-.-|, --..--|? ..--..|\' .----.|! -.-.--|/ -..-.|( -.--.|) -.--.-|& .-...|: ---...|; -.-.-.|= -...-|+ .-.-.|- -....-|_ ..--.-|" .-..-.|$ ...-..-|@ .--.-.|Ą .-.-|Ä .-.-|Ć -.-..|Ç -.-..|Ę ..-..|É ..-..|Ł .-..-|Ń --.--|Ñ --.--|Ó ---.|Ö ---.|Ś ...-...|Ź --..-.|Ż --..-|Ü ..--|ß ...--..|À .--.-|Å .--.-|È .-..-|Ê -..-.|¿ ..-.-|¡ --...-');
const MRS_H=cdTab('א .-|ב -...|ג --.|ד -..|ה ---|ו .|ז --..|ח ....|ט ..-|י ..|כ -.-|ך -.-|ל .-..|מ --|ם --|נ -.|ן -.|ס -.-.|ע .---|פ .--.|ף .--.|צ .--|ץ .--|ק --.-|ר .-.|ש ...|ת -');
const cdSkip=/(\{[^}]*\}|&\w+;|<[^>]+>)/;
const cdMark=(txt,fn)=>{ const m=/^(\s*)([\s\S]*?)(\s*)$/.exec(txt); return m[1]+fn(m[2])+m[3]; };
function encMorse(txt){ const he=S.settings.ui.lang==='he';
  const code=c=>{ if(he&&MRS_H[c]) return MRS_H[c]; const u=c==='ß'?c:c.toUpperCase(); if(MRS_L[u]) return MRS_L[u]; const b=c.normalize('NFD')[0].toUpperCase(); return MRS_L[b]||null; };
  const conv=w=>w.split(cdSkip).map((p,i)=>i%2?p:[...p].map(c=>{ const k=code(c); return k?k.replace(/\./g,'·').replace(/-/g,'−'):c; }).join(' ')).join('');
  return cdMark(txt,x=>x.split(/(\n+)/).map((l,i)=>i%2?l:l.split(/\s+/).map(conv).join(' / ')).join('')); }
const BRA={}; 'abcdefghijklmnopqrstuvwxyz'.split('').forEach((c,i)=>{ BRA[c]='⠁⠃⠉⠙⠑⠋⠛⠓⠊⠚⠅⠇⠍⠝⠕⠏⠟⠗⠎⠞⠥⠧⠺⠭⠽⠵'[i]; });
const BRD='⠚⠁⠃⠉⠙⠑⠋⠛⠓⠊';
const BRX={pl:cdTab('ą ⠡|ć ⠩|ę ⠱|ł ⠣|ń ⠹|ó ⠬|ś ⠪|ź ⠮|ż ⠯'),de:cdTab('ä ⠜|ö ⠪|ü ⠳|ß ⠮'),es:cdTab('á ⠷|é ⠮|í ⠌|ó ⠬|ú ⠾|ü ⠳|ñ ⠻|¿ ⠢|¡ ⠖'),fr:cdTab('à ⠷|â ⠡|ç ⠯|é ⠿|è ⠮|ê ⠣|ë ⠫|î ⠩|ï ⠻|ô ⠹|ù ⠾|û ⠱|ü ⠳|œ ⠪'),en:{},
  he:cdTab('א ⠁|ב ⠃|ג ⠛|ד ⠙|ה ⠓|ו ⠺|ז ⠵|ח ⠭|ט ⠞|י ⠚|כ ⠡|ך ⠡|ל ⠇|מ ⠍|ם ⠍|נ ⠝|ן ⠝|ס ⠎|ע ⠪|פ ⠏|ף ⠏|צ ⠯|ץ ⠯|ק ⠟|ר ⠗|ש ⠩|ת ⠹')};
BRX.szl=BRX.pl;
const BRP={'.':'⠲',',':'⠂',';':'⠆',':':'⠒','!':'⠖',"'":'⠄','’':'⠄','-':'⠤','–':'⠤','/':'⠌','"':'⠶','“':'⠶','”':'⠶','«':'⠶','»':'⠶','…':'⠲⠲⠲'};
function encBraille(txt){ const L=S.settings.ui.lang, X=BRX[L]||{}, en=L==='en', cap=(L==='es'||L==='fr')?'⠨':'⠠';
  const P=Object.assign({},BRP,{'?':en?'⠦':'⠢','(':en?'⠐⠣':L==='fr'?'⠦':'⠶',')':en?'⠐⠜':L==='fr'?'⠴':'⠶'},en?{'&':'⠈⠯','@':'⠈⠁','%':'⠨⠴','+':'⠐⠖','=':'⠐⠶','*':'⠐⠔'}:{});
  const isL=c=>c.toLowerCase()!==c.toUpperCase()||X[c.toLowerCase()];
  const word=w=>{ const ch=[...w], ls=ch.filter(c=>c.toLowerCase()!==c.toUpperCase()), all=ls.length>1&&ls.every(c=>c===c.toUpperCase()); let o='', num=false, capDone=false;
    ch.forEach((c,i)=>{ if(c>='0'&&c<='9'){ if(!num){ o+='⠼'; num=true; } o+=BRD[+c]; return; }
      if(num&&(c==='.'||c===',')&&ch[i+1]>='0'&&ch[i+1]<='9'){ o+=P[c]; return; } num=false;
      const lo=c.toLowerCase(), up=c!==lo;
      let b=X[lo]||BRA[lo]; if(!b&&isL(c)){ const bs=lo.normalize('NFD')[0]; b=BRA[bs]; }
      if(b){ if(up&&X[c]===undefined){ if(all){ if(!capDone){ o+=cap+cap; capDone=true; } } else o+=cap; } o+=b; return; }
      o+=P[c]||c; });
    return o; };
  const conv=w=>w.split(cdSkip).map((p,i)=>i%2?p:word(p)).join('');
  return cdMark(txt,x=>x.split(/(\s+)/).map((p,i)=>i%2?p:conv(p)).join('')); }
const enc=CODEMODE==='morse'?encMorse:CODEMODE==='braille'?encBraille:(x=>x);
const LCODES=['en','de','es','fr','he','zh','szl'];
let LD=null, TRM=null;   // LD: polski -> język interfejsu; TRM (tylko w trybie kodu): to samo, ale z tekstami niezmienionymi
(()=>{ const i=LCODES.indexOf(S.settings.ui.lang); if(i>=0){ LD={};
  for(const r of LROWS){ const v=r[i+1]; if(v===r[0]) continue; LD[r[0]]=v; LD[r[0].toUpperCase()]=v.toUpperCase(); } }
  if(CODEMODE){ TRM={}; for(const r of LROWS){ const v=i>=0?r[i+1]:r[0]; TRM[r[0]]=v; TRM[r[0].toUpperCase()]=v.toUpperCase(); } } })();
const t=k=>enc((LD&&LD[k])||k);
const trLook=k=>CODEMODE?(TRM[k]===undefined?null:enc(TRM[k])):(LD&&LD[k]);
function trText(n){ if(!LD&&!CODEMODE) return; const v=n.nodeValue, k=v.trim(); if(!k) return; const o=trLook(k); if(o&&o!==k) n.nodeValue=v.replace(k,()=>o); }
function trAttr(el,a){ if(!LD&&!CODEMODE) return; const v=el.getAttribute(a); if(!v) return; const o=trLook(v.trim()); if(o&&o!==v) el.setAttribute(a,o); }
function trNode(root){ if(!LD&&!CODEMODE) return;
  if(root.nodeType===3) return trText(root); if(root.nodeType!==1) return;
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT); let n; while((n=w.nextNode())) trText(n);
  const els=[root,...root.querySelectorAll('[title],[placeholder]')]; els.forEach(e=>{ trAttr(e,'title'); trAttr(e,'placeholder'); }); }
function applyLang(){ if(!LD&&!CODEMODE) return; document.documentElement.lang=S.settings.ui.lang==='szl'?'szl':IL(); trNode(document.body);
  new MutationObserver(ms=>{ for(const m of ms){ if(m.type==='childList') m.addedNodes.forEach(trNode); else if(m.type==='characterData') trText(m.target); else if(m.type==='attributes') trAttr(m.target,m.attributeName); } })
    .observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['title','placeholder']}); }

// zapis stanu: wiele wywołań save() w krótkim czasie (np. przełączenie karty = kilka zmian naraz) łączy się w jeden zapis po 120 ms; stan jest zamieniany
// na tekst JSON raz (wspólny dla localStorage i procesu głównego, który zapisuje go bez ponownej konwersji). Przy zamykaniu okna zapis jest natychmiastowy.
const saveNow=()=>{ clearTimeout(saveNow.t); saveNow.t=0; if(SEC) return; let j; try{ j=JSON.stringify(S); }catch{ return; } try{localStorage.setItem('cb-state',j)}catch{} try{window.api&&window.api.saveState&&window.api.saveState(j)}catch{} };
const save=()=>{ if(SEC||saveNow.t) return; saveNow.t=setTimeout(saveNow,120); };
window.addEventListener('beforeunload',saveNow); window.addEventListener('pagehide',saveNow);
document.addEventListener('visibilitychange',()=>{ if(document.hidden&&saveNow.t) saveNow(); });
const F=()=>S.folders.find(f=>f.id===S.cur);
const T=()=>{ const f=F(), a=f.active; return f.tabs.find(t=>t.id===a)||S.gpins.find(t=>t.id===a); };
const isGp=id=>S.gpins.some(t=>t.id===id), findTab=id=>F().tabs.find(t=>t.id===id)||S.gpins.find(t=>t.id===id);
const views={}; let editing=null;

const gcss=()=>`html,body,#gb,#gbw,#main,#cnt,#center_col,#rcnt,#rso,#appbar,#searchform,#hdtb,#hdtb-msb,#top_nav,#sfcnt,.sfbg,.minidiv,#tsf,header,[role=banner],[role=navigation],#botstuff,#foot,#fbar,.fbar,#footcnt,.appbar,#extabar,#slim_appbar{background:${P.gbg}!important;background-color:${P.gbg}!important}
body{color:#f5ede3!important}a h3,h3 a,.LC20lb{color:${P.acc2}!important}cite,.tjvcx,.VuuXrf,.byrV5b{color:${P.mut}!important}
.VwiC3b,.c7r1q,.lEBKkf,.st{color:#d9cdbf!important}input,textarea{background-color:transparent!important;color:#f5ede3!important}
.RNNXgb{background:${P.gpanel}!important;border-color:${P.gline}!important}.SDkEP,.a4bIc,form[role=search]>div{background:transparent!important}
hr,.sfbgg,#hdtb{border-color:${P.gline}!important}`;
// skrypt wykonywany w stronie Google: ujednolica szare powierzchnie u góry i ukrywa przycisk „Tryb AI”
function gpage(c){
  window.__cbc=c;
  if(window.__cbRun){ window.__cbRun(); return; }
  const role=st=>{ const m=/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/.exec(st); if(!m) return null;
    const r=+m[1], g=+m[2], b=+m[3], a=m[4]===undefined?1:+m[4];
    if(a<.9||Math.max(r,g,b)-Math.min(r,g,b)>26) return null;
    const l=(r+g+b)/3; if(l>78) return null; return l<37?'bg':l<57?'panel':'line'; };
  const run=()=>{
    if(document.hidden&&window.__cbc.on!==false){ if(!window.__cbw){ window.__cbw=true; document.addEventListener('visibilitychange',()=>{ window.__cbw=false; run(); },{once:true}); } window.__cbq=true; return; }   // karta w tle: przekolorujemy ją dopiero, gdy stanie się widoczna (bez przeglądania całego DOM przy każdej zmianie strony w tle)
    window.__cbq=false;
    if(window.__cbc.on===false){   // opcja wyłączona: cofamy własne zmiany kolorów (elementy są oznaczone atrybutem data-cbr)
      document.querySelectorAll('[data-cbr]').forEach(el=>{ el.style.removeProperty('background-color'); if(el.hasAttribute('data-cbrr')) el.style.removeProperty('border-radius');
        el.removeAttribute('data-cbr'); el.removeAttribute('data-cbrr'); delete el.__cbr; });
    } else document.querySelectorAll('body, body *').forEach(el=>{
      if(/^(IMG|SVG|PATH|VIDEO|CANVAS|SCRIPT|STYLE|G)$/i.test(el.tagName)) return;
      const b=el.getBoundingClientRect(); if(b.width<40||b.height<8||b.top>300||b.bottom<0) return;
      const r=el.__cbr||role(getComputedStyle(el).backgroundColor);
      if(r){ el.__cbr=r; el.setAttribute('data-cbr','1'); el.style.setProperty('background-color',window.__cbc[r],'important');
        const pr=el.parentElement?parseFloat(getComputedStyle(el.parentElement).borderTopLeftRadius):0; if(pr>0&&!parseFloat(getComputedStyle(el).borderTopLeftRadius)){ el.style.setProperty('border-radius','inherit','important'); el.setAttribute('data-cbrr','1'); } } });
    document.querySelectorAll('a,[role=tab],[role=link],button').forEach(el=>{
      const t=(el.textContent||'').trim();
      if(t.length<12&&/^(Tryb AI|AI Mode)$/i.test(t)) (el.closest('[role=listitem]')||el).style.setProperty('display','none','important'); });
  };
  window.__cbRun=run; run();
  new MutationObserver(()=>{ if(!window.__cbq){ window.__cbq=true; setTimeout(run,350); } }).observe(document.documentElement,{childList:true,subtree:true});
  addEventListener('load',run); addEventListener('resize',run);
}
const scrollCss=()=>`::-webkit-scrollbar{width:10px!important;height:10px!important}::-webkit-scrollbar-track{background:transparent!important}::-webkit-scrollbar-thumb{background:${P.mut}66!important;border-radius:10px!important;border:2px solid transparent!important;background-clip:content-box!important}::-webkit-scrollbar-thumb:hover{background:${P.acc}!important;background-clip:content-box!important}::-webkit-scrollbar-corner{background:transparent!important}`;
function injS(w){ try{ Promise.resolve(w._sk&&w.removeInsertedCSS(w._sk)).catch(()=>{}).then(()=>w.insertCSS(scrollCss())).then(k=>{w._sk=k}).catch(()=>{}); }catch{} }
// kolory stron Google w kolorach motywu (Ustawienia → Interfejs → Kolory stron → „Kolor motywu”; domyślnie włączone); po wyłączeniu usuwamy style i przywracamy natywne kolory
function injG(w){ try{ if(!isG(w.getURL())) return; const on=S.settings.ui.pgmode==='theme';
  Promise.resolve(w._ck&&w.removeInsertedCSS(w._ck)).catch(()=>{}).then(()=>{ w._ck=null; return on?w.insertCSS(gcss()):null; }).then(k=>{ w._ck=k||null; }).catch(()=>{});
  w.executeJavaScript(`(${gpage.toString()})(${JSON.stringify({bg:P.gbg,panel:P.gpanel,line:P.gline,on})})`).catch(()=>{}); }catch{} }


// ===== src/js/05-boot.js =====
// ---------- animacja uruchamiania ----------
const BOOT={on:false,pend:new Map(),skip:false,fin:false,t0:0};   // pend: zadania ładowane w tle (etykieta wyświetlana na końcowym ekranie)
try{ BOOT.on=!SEC&&S.settings.ui.anim.boot!==false&&!sessionStorage.getItem('cb-booted'); }catch{}
function bootTask(label){ if(!BOOT.on) return ()=>{}; const k=Symbol(label); BOOT.pend.set(k,label); const done=()=>BOOT.pend.delete(k); setTimeout(done,7000); return done; }
function bootWait(el,label){ if(!el||!BOOT.on) return; const d=bootTask(label); ['did-stop-loading','did-fail-load'].forEach(ev=>el.addEventListener(ev,d,{once:true})); }
const bEO=p=>1-Math.pow(1-Math.min(1,Math.max(0,p)),3), bEIO=p=>{ p=Math.min(1,Math.max(0,p)); return p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2; }, bLerp=(a,b,p)=>a+(b-a)*p;
const BTM={T1:900,T2:520,T3:650}; BTM.tImp=BTM.T1+BTM.T2; BTM.T3s=BTM.tImp+520; BTM.tEnd=BTM.tImp+1900;   // czasy (ms) liczone od startu logo
// stan ikony w chwili ms: JEDEN ciągły tor od dołu do środka (spirala wokół środka: z dołu w górę po lewej, półkole nad środkiem, wejście w środek po prawej).
// Kąt rośnie ze stale dodatnią prędkością kątową, więc logo nigdy się nie zatrzymuje ani nie łamie kierunku – tylko zmienia prędkość. Obrót ma wielomianową prędkość kątową (też bez zatrzymania).
function bootIcon(L,ms){
  const {T1,tImp,T3s,T3}=BTM, o={x:L.cx,y:L.cy,s:L.fin,rot:720,sh:[6,8],vis:1};
  if(ms<0){ o.vis=0; return o; }
  if(ms<tImp){
    const TH=4.95, w0=.00135, kk=2*(TH-w0*tImp)/(tImp*tImp), dth=w0*ms+.5*kk*ms*ms, rho0=L.H/2+L.s0*.35;   // kąt od startu; tor z dołu ekranu
    const base=L.R+(rho0-L.R)*Math.exp(-1.6*dth), xs=Math.min(1,Math.max(0,(dth-3.4)/(TH-3.4))), rho=base*(1-xs*xs), th=Math.PI/2+dth;
    o.x=L.cx+rho*Math.cos(th); o.y=L.cy+rho*Math.sin(th);
    const u=ms/tImp; o.rot=tImp*(.6*u-2.46*u*u/2+3.41*u*u*u/3);   // prędkość kątowa 0,6 → ~0,16 → 1,55 °/ms, razem 720°
    if(ms<T1){ const p=ms/T1; o.s=bLerp(L.s0,L.peak,1-Math.pow(1-p,2.2)); o.sh=[bLerp(10,46,p),bLerp(12,44,p)]; }
    else { const q=(ms-T1)/BTM.T2; o.s=bLerp(L.peak,L.fin,q*q); o.sh=[bLerp(46,6,q*q),bLerp(44,8,q*q)]; }
  }
  else { const u=Math.min(1,(ms-tImp)/300), dm=Math.exp(-7*u); o.s=L.fin*(1-.07*Math.exp(-6*u)*Math.cos(u*16)); o.rot=720+1.6*dm*Math.sin(u*34); o.x=L.cx+L.U*2.2*dm*Math.sin(u*28); o.y=L.cy+L.U*1.4*dm*Math.sin(u*22); }
  if(ms>=T3s) o.x=bLerp(L.cx,L.icF,bEIO((ms-T3s)/T3));
  return o;
}
// dźwięk startu: cała ścieżka jest syntezowana z góry (WebAudio) z tych samych wzorów co animacja, więc pasuje do prędkości, położenia i obrotu logo
function bootSound(ctx,t0,L,vol){
  const T=BTM, S=ms=>t0+ms/1000, sr=ctx.sampleRate, comp=ctx.createDynamicsCompressor(), master=ctx.createGain();
  comp.threshold.value=-14; comp.ratio.value=3; comp.attack.value=.005; comp.release.value=.25; master.gain.value=vol; master.connect(comp); comp.connect(ctx.destination);
  const irLen=Math.floor(sr*2.4), ir=ctx.createBuffer(2,irLen,sr); for(let c=0;c<2;c++){ const d=ir.getChannelData(c); for(let i=0;i<irLen;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/irLen,2.6); }
  const conv=ctx.createConvolver(); conv.buffer=ir; const rvIn=ctx.createGain(), rvLp=ctx.createBiquadFilter(), wet=ctx.createGain(); rvLp.type='lowpass'; rvLp.frequency.value=6500; wet.gain.value=.7; rvIn.connect(conv); conv.connect(rvLp); rvLp.connect(wet); wet.connect(master);
  const nb=ctx.createBuffer(1,sr*2,sr), nd=nb.getChannelData(0); for(let i=0;i<nd.length;i++) nd[i]=Math.random()*2-1;
  const noise=()=>{ const s=ctx.createBufferSource(); s.buffer=nb; s.loop=true; return s; };
  const route=(node,pan,send,dry)=>{ const p=ctx.createStereoPanner(); p.pan.value=pan; node.connect(p); const d=ctx.createGain(); d.gain.value=dry; p.connect(d); d.connect(master); if(send){ const sg=ctx.createGain(); sg.gain.value=send; p.connect(sg); sg.connect(rvIn); } return p; };
  const env=(gn,at,peak,dur,tail)=>{ gn.gain.setValueAtTime(0,at); gn.gain.linearRampToValueAtTime(peak,at+.006); gn.gain.exponentialRampToValueAtTime(.0008,at+dur); if(tail) gn.gain.setValueAtTime(0,at+dur+.01); };
  // próbkowanie toru logo co 20 ms: prędkość, położenie (pan), rozmiar, obroty/s
  const N=Math.round(T.tImp/20)+1, sp=new Float32Array(N), pn=new Float32Array(N), sz=new Float32Array(N), om=new Float32Array(N); let prev=bootIcon(L,0), mxs=1e-6;
  for(let i=0;i<N;i++){ const s=bootIcon(L,i*20); if(i){ sp[i]=Math.hypot(s.x-prev.x,s.y-prev.y)/20; om[i]=Math.abs(s.rot-prev.rot)/20*1000/360; } pn[i]=Math.max(-1,Math.min(1,(s.x-L.cx)/(L.W*.35)))*.75; sz[i]=(s.s-L.s0)/(L.peak-L.s0); prev=s; }
  sp[0]=sp[1]; om[0]=om[1]; for(let i=0;i<N;i++) mxs=Math.max(mxs,sp[i]);
  const dur=T.tImp/1000, ramp=i=>Math.min(1,i/3)*Math.min(1,(N-1-i)/2), wg=new Float32Array(N), wf=new Float32Array(N), sg=new Float32Array(N), sf=new Float32Array(N), lf=new Float32Array(N);
  for(let i=0;i<N;i++){ const v=sp[i]/mxs; wg[i]=.9*Math.pow(v,.85)*ramp(i); wf[i]=380+2300*(.55*v+.45*Math.max(0,sz[i])); sg[i]=.22*Math.pow(Math.min(1,Math.max(0,(om[i]-1.2)/3.6)),1.4)*ramp(i); sf[i]=80+om[i]*75; lf[i]=.5+om[i]*5; }
  { const s=noise(), bp=ctx.createBiquadFilter(), g=ctx.createGain(), p=ctx.createStereoPanner(); bp.type='bandpass'; bp.Q.value=.8; s.connect(bp); bp.connect(g); g.connect(p); p.connect(master);
    const sd=ctx.createGain(); sd.gain.value=.25; p.connect(sd); sd.connect(rvIn);   // WHOOSH: szum przefiltrowany pasmowo; głośność ~ prędkość, barwa ~ prędkość i wielkość, pan ~ położenie
    g.gain.setValueCurveAtTime(wg,t0,dur); bp.frequency.setValueCurveAtTime(wf,t0,dur); p.pan.setValueCurveAtTime(pn,t0,dur); s.start(t0); s.stop(S(T.tImp)+.05); }
  { const o=ctx.createOscillator(), lp=ctx.createBiquadFilter(), am=ctx.createGain(), lfo=ctx.createOscillator(), lg=ctx.createGain(), g=ctx.createGain(), p=ctx.createStereoPanner();   // OBRÓT: piłokształtny świst z modulacją „łopatek” zgodną z obrotami logo
    o.type='sawtooth'; lp.type='lowpass'; lp.frequency.value=1300; am.gain.value=.55; lg.gain.value=.45; lfo.connect(lg); lg.connect(am.gain); o.connect(lp); lp.connect(am); am.connect(g); g.connect(p); p.connect(master);
    g.gain.setValueCurveAtTime(sg,t0,dur); o.frequency.setValueCurveAtTime(sf,t0,dur); lfo.frequency.setValueCurveAtTime(lf,t0,dur); p.pan.setValueCurveAtTime(pn,t0,dur); o.start(t0); lfo.start(t0); o.stop(S(T.tImp)+.05); lfo.stop(S(T.tImp)+.05); }
  const ti=S(T.tImp);   // THUD: opadnięcie na półsprężystą płachtę
  { const o=ctx.createOscillator(), g=ctx.createGain(); o.frequency.setValueAtTime(130,ti); o.frequency.exponentialRampToValueAtTime(46,ti+.25); env(g,ti,.95,.45); o.connect(g); route(g,0,.15,1); o.start(ti); o.stop(ti+.5); }
  { const s=noise(), lp=ctx.createBiquadFilter(), g=ctx.createGain(); lp.type='lowpass'; lp.frequency.value=520; env(g,ti,.55,.14); s.connect(lp); lp.connect(g); route(g,0,.1,1); s.start(ti); s.stop(ti+.2); }
  { const o=ctx.createOscillator(), vb=ctx.createOscillator(), vg=ctx.createGain(), g=ctx.createGain(); o.frequency.value=78; vb.frequency.value=11; vg.gain.setValueAtTime(9,ti); vg.gain.exponentialRampToValueAtTime(.2,ti+.7); vb.connect(vg); vg.connect(o.frequency); env(g,ti+.01,.3,.7); o.connect(g); route(g,0,.2,1); o.start(ti); vb.start(ti); o.stop(ti+.8); vb.stop(ti+.8); }
  const te=S(T.tEnd);   // krystaliczny ambient: dzwonkowe nuty z pogłosem + miękka poduszka + szmer, wygasa przy końcu animacji
  [[659.25,0,-.4],[987.77,120,.3],[1318.51,250,-.2],[1479.98,400,.45],[1975.53,580,-.5],[2637.02,800,.2]].forEach(([f,d,pan])=>{ const at=ti+.03+d/1000, du=Math.max(.8,Math.min(2.7,te-at+.25));
    [[1,1],[2.76,.32],[5.4,.1],[8.9,.04]].forEach(([r,a],k)=>{ const o=ctx.createOscillator(), g=ctx.createGain(); o.type='sine'; o.frequency.value=f*r*(1+(k?.0015*k:0)); env(g,at,.085*a,du/(1+k*.5)); o.connect(g); route(g,pan,.9,.45); o.start(at); o.stop(at+du+.05); }); });
  [[329.63,-4],[493.88,4],[659.25,-3]].forEach(([f,c],k)=>{ const o=ctx.createOscillator(), lp=ctx.createBiquadFilter(), g=ctx.createGain(); o.type='triangle'; o.frequency.value=f; o.detune.value=c; lp.type='lowpass'; lp.frequency.value=1600;
    g.gain.setValueAtTime(0,ti); g.gain.linearRampToValueAtTime(.05-k*.01,ti+.7); g.gain.setValueAtTime(.05-k*.01,te-.2); g.gain.linearRampToValueAtTime(0,te+.45); o.connect(lp); lp.connect(g); route(g,k-1?0:(k?.3:-.3),.8,.5); o.start(ti); o.stop(te+.5); });
  { const s=noise(), hp=ctx.createBiquadFilter(), g=ctx.createGain(); hp.type='highpass'; hp.frequency.value=5500; g.gain.setValueAtTime(0,ti); g.gain.linearRampToValueAtTime(.022,ti+.6); g.gain.linearRampToValueAtTime(0,te); s.connect(hp); hp.connect(g); route(g,0,.5,.6); s.start(ti); s.stop(te+.1); }
  { const t3=S(T.T3s), d3=T.T3/1000, s=noise(), bp=ctx.createBiquadFilter(), g=ctx.createGain(), p=route(g,0,.25,1);   // wysuwanie nazwy: miękki przesuw w górę pasma + szklany „tik” na końcu
    bp.type='bandpass'; bp.Q.value=1.2; bp.frequency.setValueAtTime(700,t3); bp.frequency.exponentialRampToValueAtTime(3200,t3+d3); g.gain.setValueAtTime(0,t3); g.gain.linearRampToValueAtTime(.2,t3+d3*.4); g.gain.linearRampToValueAtTime(0,t3+d3);
    p.pan.setValueAtTime(-.1,t3); p.pan.linearRampToValueAtTime(.35,t3+d3); s.connect(bp); bp.connect(g); s.start(t3); s.stop(t3+d3+.05);
    [[1760,.06],[2349.3,.035]].forEach(([f,a])=>{ const o=ctx.createOscillator(), og=ctx.createGain(); o.frequency.value=f; env(og,t3+d3,a,.55); o.connect(og); route(og,.3,.8,.6); o.start(t3+d3); o.stop(t3+d3+.6); }); }
  master.gain.setValueAtTime(vol,te); master.gain.linearRampToValueAtTime(0,te+.6);
  return {master,fade(ms){ const n=ctx.currentTime; master.gain.cancelScheduledValues(n); master.gain.setValueAtTime(master.gain.value,n); master.gain.linearRampToValueAtTime(0,n+(ms||140)/1000); }};
}
function bootGo(){
  const el=$('boot'); if(!el) return;
  if(!BOOT.on){ el.remove(); return; }
  try{ sessionStorage.setItem('cb-booted','1'); }catch{}
  try{ const tb=T(); if(tb&&tb.url&&views[tb.id]) bootWait(views[tb.id],'Wczytywanie karty…'); }catch{}
  if(S.panel) bootWait(cw,"Ładowanie panelu asystenta…");
  const cv=$('bootc'), g=cv.getContext('2d'), im=$('booti'), nm=$('bootn'), lb=$('bootl'), L={}; BOOT.L=L;
  let dpr=1, bgc=null, tw=0, nh=0, PA=[], BR=null; const A=accRgb, A2=acc2Rgb, F=fgRgb;
  const glow=c=>{ const s=document.createElement('canvas'); s.width=s.height=64; const x=s.getContext('2d'), r=x.createRadialGradient(32,32,0,32,32,32); r.addColorStop(0,`rgba(${c},1)`); r.addColorStop(.35,`rgba(${c},.35)`); r.addColorStop(1,`rgba(${c},0)`); x.fillStyle=r; x.fillRect(0,0,64,64); return s; };
  const GS={[A]:glow(A),[A2]:glow(A2),[F]:glow(F)};
  function layout(){   // wszystko zależy od bieżącego rozmiaru okna (okno może zmienić rozmiar w trakcie startu)
    const W=innerWidth, H=innerHeight; L.W=W; L.H=H; dpr=Math.min(2,devicePixelRatio||1); cv.width=Math.round(W*dpr); cv.height=Math.round(H*dpr); g.setTransform(dpr,0,0,dpr,0,0);
    const U=Math.max(.45,Math.min(screen.height/1080,W/760,H/640)); L.U=U; L.cx=W/2; L.cy=H/2; L.fin=150*U; L.peak=215*U; L.s0=36*U; L.R=.55*L.fin; L.RMAX=Math.hypot(W,H)/2*1.1;
    im.style.width=im.style.height=L.peak+'px'; nm.querySelector('b').style.fontSize=(88*U)+'px'; nm.querySelector('small').style.fontSize=(17*U)+'px'; tw=nm.offsetWidth; nh=nm.offsetHeight;
    const TW=L.fin+26*U+tw, x0=L.cx-TW/2; L.icF=x0+L.fin/2; L.txF=x0+L.fin+26*U; L.tx0=L.cx+L.fin/2-tw;
    bgc=document.createElement('canvas'); bgc.width=cv.width; bgc.height=cv.height; const b=bgc.getContext('2d'); b.scale(dpr,dpr);   // statyczne tło liczone raz
    const lg=b.createLinearGradient(0,0,0,H); lg.addColorStop(0,`rgba(${A},.10)`); lg.addColorStop(.55,`rgba(${A},0)`); lg.addColorStop(1,`rgba(${A2},.16)`); b.fillStyle=lg; b.fillRect(0,0,W,H);
    const rg=b.createRadialGradient(L.cx,L.cy,0,L.cx,L.cy,Math.max(W,H)*.65); rg.addColorStop(0,`rgba(${A},.20)`); rg.addColorStop(1,`rgba(${A},0)`); b.fillStyle=rg; b.fillRect(0,0,W,H);
    if(!PA.length){ const N=Math.round(46+W*H/45000); for(let i=0;i<N;i++) PA.push({x:Math.random()*W,y:Math.random()*H,r:(1.2+Math.random()*3.4)*U,v:(4+Math.random()*10)*U,a:.25+Math.random()*.5,c:Math.random()<.3?A2:Math.random()<.5?A:F,ph:Math.random()*6.28}); }
    else PA.forEach(p=>{ p.x=Math.min(p.x,W); p.y=Math.min(p.y,H); });
  }
  el.style.background=getComputedStyle(document.body).getPropertyValue('--bg').trim()||'#16120f';
  im.src=drawIcon(); layout(); addEventListener('resize',layout);
  const {T1,tImp,T3s,tEnd}=BTM, RS=[0,170,360], LIFE=1500;
  const rings=ms=>{ const o=[]; RS.forEach((d,i)=>{ const age=ms-tImp-d; if(age<0||age>LIFE) return; const u=age/LIFE; o.push({r:L.RMAX*(1-Math.pow(1-u,1.7)),w:(34+u*80)*L.U,a:Math.min(1,Math.pow(1-u,1.1)*(1.25-i*.2))}); }); return o; };
  function draw(clk,ms){
    const W=L.W, H=L.H, U=L.U, cx=L.cx, cy=L.cy; g.clearRect(0,0,W,H); g.globalAlpha=Math.min(1,clk/450); g.drawImage(bgc,0,0,W,H); g.globalAlpha=1;
    const ra=rings(ms), fl=ms-tImp;
    if(fl>=0&&fl<600){ const k=1-fl/600, fg=g.createRadialGradient(cx,cy,0,cx,cy,300*U); fg.addColorStop(0,`rgba(${A2},${.6*k})`); fg.addColorStop(1,`rgba(${A},0)`); g.fillStyle=fg; g.fillRect(0,0,W,H); }
    for(const q of ra){   // fala: pas z mocniejszym kolorem motywu + jasny grzbiet i cień (naprężenie materiału)
      const r0=Math.max(0,q.r-q.w), r1=q.r+q.w, k=(q.r-r0)/(r1-r0), gr=g.createRadialGradient(cx,cy,r0,cx,cy,r1);
      gr.addColorStop(0,`rgba(${A},0)`); gr.addColorStop(k*.3,`rgba(0,0,0,${.15*q.a})`); gr.addColorStop(k*.6,`rgba(${A},${.45*q.a})`); gr.addColorStop(k*.88,`rgba(${A2},${.85*q.a})`);
      gr.addColorStop(k,`rgba(255,255,255,${.14*q.a})`); gr.addColorStop(Math.min(.99,k+.1),`rgba(${A},${.28*q.a})`); gr.addColorStop(1,`rgba(${A},0)`);
      g.fillStyle=gr; g.beginPath(); g.arc(cx,cy,r1,0,6.2832); g.fill(); }
    for(const p of PA){   // pył (gotowe sprite'y zamiast gradientów na klatkę): fala unosi i przesuwa cząstki, które mija
      const bx=p.x+Math.sin(clk*.0004+p.ph)*8*U, by=((p.y-p.v*clk/1000)%H+H)%H, dx=bx-cx, dy=by-cy, d=Math.hypot(dx,dy)||1; let off=0, lift=0;
      for(const q of ra){ const z=(d-q.r)/q.w, e=Math.exp(-z*z); off+=q.a*22*U*z*e; lift+=q.a*e; }
      const sz=p.r*(1+2*lift)*3, al=Math.min(1,p.a*(1+3*lift)); g.globalAlpha=al; g.drawImage(GS[p.c],bx+dx/d*off-sz,by+dy/d*off-sz,sz*2,sz*2); }
    g.globalAlpha=1;
    const o=bootIcon(L,ms);
    if(o.vis){ const so=o.sh[0]*U, sr=o.s*.55+o.sh[1]*U*.7, sg=g.createRadialGradient(o.x,o.y+so,0,o.x,o.y+so,sr); sg.addColorStop(0,'rgba(0,0,0,.5)'); sg.addColorStop(1,'rgba(0,0,0,0)'); g.fillStyle=sg; g.beginPath(); g.arc(o.x,o.y+so,sr,0,6.2832); g.fill(); }
    const fr=ms-tImp, TR=470;   // koło alchemiczne: błysk przy uderzeniu, szybki obrót przeciwny do obrotu ikony, wyhamowanie i zanik przed ruszeniem ikony w lewo (tImp+520)
    if(fr>=0&&fr<TR){ const u=fr/TR, a=Math.min(1,fr/40)*(1-Math.pow(Math.max(0,(u-.35)/.65),1.6)), th=-(420*Math.PI/180)*(1-Math.pow(1-u,2.6)), sc=.8+.28*(1-Math.pow(1-u,3)), R=L.fin*.95;
      if(!BR||BR.k!==Math.round(R)) BR={k:Math.round(R),c:bootRing(R)};
      g.save(); g.translate(o.x,o.y); g.rotate(th); g.scale(sc,sc); g.globalAlpha=Math.max(0,a); g.globalCompositeOperation='lighter'; g.drawImage(BR.c,-BR.c.width/2,-BR.c.height/2); g.restore(); }
    im.style.opacity=o.vis?1:0; im.style.transform=`translate(${o.x-L.peak/2}px,${o.y-L.peak/2}px) rotate(${o.rot}deg) scale(${o.s/L.peak})`;
    if(ms>=T3s){ const q3=bEIO((ms-T3s)/BTM.T3), tl=bLerp(L.tx0,L.txF,q3); nm.style.opacity=1; nm.style.transform=`translate(${tl}px,${cy-nh/2}px)`; nm.style.clipPath=`inset(0 0 0 ${Math.max(0,o.x+L.fin/2-tl)}px)`; }
  }
  let clk=0, ls=null, last=performance.now(), stable=0, icOK=false, snd=null, ctx=null;
  (im.decode?im.decode():Promise.resolve()).then(()=>{ icOK=true; },()=>{ icOK=true; });
  function start(){   // start logo dopiero, gdy ikona jest zdekodowana, a klatki płynne (tło z efektami pojawia się wcześniej)
    ls=clk+80; { const R=L.fin*.95; BR={k:Math.round(R),c:bootRing(R)}; }   // koło alchemiczne gotowe przed uderzeniem (bez przycięcia klatki)
    if(S.settings.ui.anim.bootsnd!==false){ try{ ctx=new (window.AudioContext||window.webkitAudioContext)(); ctx.resume(); snd=bootSound(ctx,ctx.currentTime+.08,L,.5); setTimeout(()=>{ if(ctx&&ctx.state!=='running'){ try{ ctx.close(); }catch{} snd=null; } },300); }catch{ snd=null; } } }
  function finish(fast){ if(BOOT.fin) return; BOOT.fin=true; removeEventListener('resize',layout); el.classList.add('out'); setTimeout(()=>el.remove(),520); if(snd&&fast) snd.fade(140); if(ctx) setTimeout(()=>{ try{ ctx.close(); }catch{} },3500); }
  el.addEventListener('mousedown',()=>{ BOOT.skip=true; }); document.addEventListener('keydown',()=>{ BOOT.skip=true; },{once:true});
  BOOT.dbg=()=>({clk,ls}); BOOT.draw=draw;
  (function frame(now){ if(BOOT.fin) return; requestAnimationFrame(frame);
    const dt=now-last; last=now; clk+=Math.min(dt,34);   // zegar animacji ignoruje zacięcia: po przestoju animacja wznawia się płynnie zamiast przeskakiwać
    if(ls===null){ stable=dt<=22?stable+1:0; if((icOK&&stable>=6&&clk>=450)||clk>=1800) start(); }
    const ms=ls===null?-1:clk-ls; draw(clk,ms);
    if(BOOT.skip){ finish(true); return; }
    if(ms>=tEnd&&!BOOT.pend.size){ finish(false); return; }
    if(ms>=tEnd){ lb.textContent=t([...BOOT.pend.values()].pop()); lb.classList.add('show'); } })(performance.now());
}

// ===== src/js/06-history.js =====
// ---------- historia przeglądania ----------
const HSTEPS=[1,3,7,14,30,60,90,180,365,730,0];   // dni przechowywania; 0 = bez limitu (skrajne prawe ustawienie suwaka)
let HIST=[], hReady=false, hTimer=0, hPrune=0, hLimit=200, hQ='', hdT=0; const hcur=new Map();   // HIST: wpisy {i,t,u,ti,ic} od najstarszego; hcur: karta -> bieżący wpis
if(SEC) document.body.classList.add('sec');
const HDB={ db:null,   // historia leży w IndexedDB (nie w S), żeby zapis stanu po każdej nawigacji nie rósł z historią
  open(){ return new Promise((res,rej)=>{ const r=indexedDB.open('cb-hist',1); r.onupgradeneeded=()=>r.result.createObjectStore('k'); r.onsuccess=()=>res(r.result); r.onerror=()=>rej(r.error); }); },
  async load(){ try{ this.db=await this.open(); return await new Promise(res=>{ const q=this.db.transaction('k').objectStore('k').get('h'); q.onsuccess=()=>res(Array.isArray(q.result)?q.result:[]); q.onerror=()=>res([]); }); }catch{ return []; } },
  put(a){ if(!this.db) return; try{ this.db.transaction('k','readwrite').objectStore('k').put(a,'h'); }catch{} } };
const histDays=()=>HSTEPS[Math.min(HSTEPS.length-1,Math.max(0,S.settings.hist.step|0))];
function histSave(){ if(SEC||!hReady) return; clearTimeout(hTimer); hTimer=setTimeout(()=>HDB.put(HIST),1500); }
function histPrune(){ const d=histDays(); hPrune=Date.now(); if(!d) return; const lim=hPrune-d*864e5; HIST=HIST.filter(x=>x.t>=lim); }
// dopasowanie wpisu z listy pomijanych: z kropką, ukośnikiem lub dwukropkiem (www., https://, google.com) = fragment całego adresu;
// samo słowo = fragment nazwy hosta przed końcówką (.com, .pl, .co.uk), więc „zwierzaki” łapie www.zwierzaki.com, ale nie szkola.com/zwierzaki
const H2L=new Set(['co','com','org','net','gov','edu','ac','or','ne','go']);
function histName(host){ const l=host.toLowerCase().split('.'); let n=l.length; if(n>1){ n--; if(n>1&&l[n].length===2&&H2L.has(l[n-1])) n--; } return l.slice(0,n).join('.'); }
function histMatch(e,u){ e=String(e).trim().toLowerCase(); if(!e) return false;
  try{ if(isG(u)){ const x=new URL(u); if(x.pathname==='/search'&&(x.searchParams.get('q')||'').toLowerCase().includes(e)) return true; } }catch{}   // hasło wyszukiwane w Google też podlega liście
  if(/[\/:.]/.test(e)) return u.toLowerCase().includes(e);
  try{ return histName(new URL(u).hostname).includes(e); }catch{ return false; } }
const histSkipped=u=>S.settings.hist.skip.some(e=>histMatch(e,u));
function histDirty(){ clearTimeout(hdT); hdT=setTimeout(()=>{ if($('hist').classList.contains('open')) histRender(); },250); }
function histAdd(tb,u){
  if(SEC||!S.settings.hist.on||!/^https?:/i.test(u)||histSkipped(u)){ hcur.delete(tb.id); return; }
  const now=Date.now(), last=HIST[HIST.length-1];
  if(last&&last.u===u&&now-last.t<30000){ hcur.set(tb.id,last); return; }   // odświeżenia, przekierowania i zdarzenia in-page tej samej strony
  const e={i:uid(),t:now,u,ti:'',ic:''}; HIST.push(e); hcur.set(tb.id,e);
  if(now-hPrune>36e5) histPrune();
  histSave(); histDirty();
}
function histTitle(tb,ti){ const e=hcur.get(tb.id); if(e&&e.u===tb.url&&e.ti!==ti){ e.ti=ti; histSave(); histDirty(); } }
function histIcon(tb,ic){ const e=hcur.get(tb.id); if(e&&e.u===tb.url&&ic&&e.ic!==ic){ e.ic=ic; histSave(); histDirty(); } }
if(!SEC){ const bt=bootTask('Wczytywanie historii…'); HDB.load().then(a=>{ HIST=a.concat(HIST); hReady=true; histPrune(); histSave(); bt(); }); }
const hFmt=ms=>new Date(ms).toLocaleTimeString(IL(),{hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
function hDay(ms){ const d=new Date(ms), n=new Date(), z=x=>new Date(x.getFullYear(),x.getMonth(),x.getDate());
  const df=Math.round((z(n)-z(d))/864e5); if(df===0) return t('Dzisiaj'); if(df===1) return t('Wczoraj');
  const s=d.toLocaleDateString(IL(),{weekday:'long',day:'numeric',month:'long',...(d.getFullYear()!==n.getFullYear()?{year:'numeric'}:{})}); return s.charAt(0).toUpperCase()+s.slice(1); }
function histRow(e){ let host=''; try{ host=new URL(e.u).hostname; }catch{}
  const ti=e.ti||e.u.replace(/^https?:\/\/(www\.)?/i,'');
  return `<div class="hr" data-i="${e.i}" title="${esc(e.u)}"><span class="ht">${hFmt(e.t)}</span><span class="hi">${e.ic?`<img src="${esc(e.ic)}" alt="">`:'🌐'}</span><span class="hti">${esc(ti)}</span><span class="hd">${esc(host)}</span><button class="hx" title="${esc(t('Usuń z historii'))}">×</button></div>`; }
function histRender(){
  const L=$('hl'), top=L.scrollTop, q=hQ.trim().toLowerCase(), rows=[];
  for(let i=HIST.length-1;i>=0;i--){ const e=HIST[i]; if(!q||(e.ti+' '+e.u).toLowerCase().includes(q)) rows.push(e); }
  if(!rows.length){ L.innerHTML=`<div class="hem">${esc(t(HIST.length?'Brak wyników.':'Historia jest pusta.'))}</div>`; return; }
  let h='', day='', n=0;
  for(const e of rows){ if(n>=hLimit) break; const dk=new Date(e.t).toDateString(); if(dk!==day){ day=dk; h+=`<h4>${esc(hDay(e.t))}</h4>`; } h+=histRow(e); n++; }
  if(rows.length>n) h+=`<button class="hmore" id="hmore">${esc(t('Pokaż więcej'))}</button>`;
  L.innerHTML=h; L.scrollTop=top;
}
function histOpen(u,nt){ if(nt){ newTab(u); return; } const tb=T(); tb.url=u; if(views[tb.id]) views[tb.id].setAttribute('src',u); activate(tb.id); toggleHist(false); }
function histDel(id,row){ const fin=()=>{ const k=HIST.findIndex(x=>x.i===id); if(k>=0) HIST.splice(k,1); histSave(); histRender(); };
  if(row&&an('panel')){ row.classList.add('rm'); setTimeout(fin,200); } else fin(); }
function toggleHist(v){ const el=$('hist'), o=v===undefined?!el.classList.contains('open'):v; if(o===el.classList.contains('open')) return;
  el.classList.toggle('open',o); document.body.classList.toggle('hist-open',o); $('hbtn').classList.toggle('on',o);
  if(o){ hLimit=200; hQ=''; $('hq').value=''; histRender(); setTimeout(()=>$('hq').focus(),60); } }
$('hbtn').onclick=()=>toggleHist();
$('hq').addEventListener('input',e=>{ hQ=e.target.value; hLimit=200; histRender(); });
$('hclr').onclick=()=>ask('Wyczyścić całą historię?','Tej operacji nie można cofnąć.','Wyczyść').then(ok=>{ if(ok){ HIST=[]; hcur.clear(); HDB.put(HIST); histRender(); } });
$('hset').onclick=()=>{ toggleHist(false); setTab='hist'; toggleSet(true); };
$('hl').addEventListener('click',e=>{ if(e.target.id==='hmore'){ hLimit+=200; histRender(); return; }
  const r=e.target.closest('.hr'); if(!r) return; const id=r.dataset.i;
  if(e.target.closest('.hx')){ histDel(id,r); return; }
  const en=HIST.find(x=>x.i===id); if(en) histOpen(en.u,e.ctrlKey||e.metaKey); });
$('hl').addEventListener('auxclick',e=>{ if(e.button!==1) return; const r=e.target.closest('.hr'); const en=r&&HIST.find(x=>x.i===r.dataset.i); if(en) histOpen(en.u,true); });
$('hl').addEventListener('error',e=>{ if(e.target.tagName==='IMG') e.target.replaceWith(Object.assign(document.createElement('span'),{textContent:'🌐'})); },true);
document.addEventListener('mousedown',e=>{ if($('hist').classList.contains('open')&&!e.target.closest('#hist,#hbtn')) toggleHist(false); });
document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&$('hist').classList.contains('open')) toggleHist(false); });
// lista stron pomijanych (ustawienia → Interfejs → Historia)
const hkChips=()=>S.settings.hist.skip.map((s,i)=>`<span class="chp">${esc(s)}<button data-hkd="${i}" title="Usuń">×</button></span>`).join('');
function hkAdd(){ const inp=$('hkin'); if(!inp) return; const v=inp.value.trim(), H=S.settings.hist; if(!v) return; inp.value='';
  if(H.skip.some(x=>x.toLowerCase()===v.toLowerCase())) return; H.skip.push(v);
  const n=HIST.length; HIST=HIST.filter(x=>!histMatch(v,x.u)); const r=n-HIST.length;
  if(r){ histSave(); histDirty(); toast(t('Usunięto wpisów: {n}').replace('{n}',r)); }
  $('hkl').innerHTML=hkChips(); save(); }
$('set').addEventListener('click',e=>{ const el=e.target;
  if(el.id==='hkadd') hkAdd();
  else if(el.dataset&&el.dataset.hkd!==undefined){ S.settings.hist.skip.splice(+el.dataset.hkd,1); $('hkl').innerHTML=hkChips(); save(); } });
$('set').addEventListener('keydown',e=>{ if(e.target.id==='hkin'&&e.key==='Enter'){ e.preventDefault(); hkAdd(); } });


// ===== src/js/07-tabs.js =====
// ---------- karty ----------
S.closed=S.closed||[];
const entering=new Set(), leaving=new Set(), enteringF=new Set(), leavingF=new Set(); let menuOpen=false, dragId=null, dragGone=false, dragSwallow=false, xd=null;
function an(k){ return S.settings.ui.anim[k]; }
function later(k,ms,fn){ if(an(k)) setTimeout(fn,ms); else fn(); }
function mkView(t){
  const w=document.createElement('webview');
  w.setAttribute('allowpopups',''); if(INC&&INCP) w.setAttribute('partition',INCP); w.setAttribute('src',t.url); w.style.display='none';
  $('left').appendChild(w); views[t.id]=w; guestHooks(t,w); pgHook(w);
  w.addEventListener('dom-ready',()=>{ injG(w); injS(w); try{ w.setAudioMuted(!!t.muted); }catch{} });
  const nv=e=>{ if(e.isMainFrame===false) return; let u=e.url, rw=false;
    try{ const x=new URL(u);   // wyszukiwania Google zawsze w trybie „Web” (udm=14): bez przeglądu AI, Gemini i trybu AI
      if(isG(u)&&x.pathname==='/search'&&!x.searchParams.has('tbm')){ const m=x.searchParams.get('udm'); if(!m||m==='50'){ x.searchParams.set('udm','14'); u=x.toString(); rw=true; try{ w.loadURL(u); }catch{} } } }catch{}
    t.url=u; if(!rw) histAdd(t,u); if(T()===t) setUrlBar(); save(); };
  w.addEventListener('did-navigate',nv); w.addEventListener('did-navigate-in-page',nv);
  w.addEventListener('page-title-updated',e=>{ t.title=e.title; histTitle(t,e.title); renderTabsSoon(); save(); });
  w.addEventListener('page-favicon-updated',e=>{ t.icon=e.favicons[0]; histIcon(t,t.icon); renderTabsSoon(); save(); });
}
// strony często zmieniają tytuł wiele razy pod rząd (liczniki, czaty, odtwarzacze): pasek kart przebudowujemy raz na klatkę, a nie przy każdej zmianie
let rtRaf=0; const renderTabsSoon=()=>{ if(!rtRaf) rtRaf=requestAnimationFrame(()=>{ rtRaf=0; renderTabs(); }); };
function setUrlBar(){
  const t=T(); if(!t||document.activeElement===url) return;
  let v=t.url||''; try{ const u=new URL(v); if(isG(v)&&u.pathname==='/search') v=u.searchParams.get('q')||v; }catch{}
  url.value=v;
}
function activate(id){
  const f=F(); f.active=id; const t=T(); if(!t) return;
  if(t.url&&!views[t.id]) mkView(t);
  for(const k in views) views[k].style.display=(k===id)?'':'none';
  home.style.display=t.url?'none':'flex';
  url.value=''; setUrlBar(); renderTabs(); renderSide(); save(); pgSoon();
  if(!t.url&&!editing) $('hs').focus();
}
function newTab(u='',after){
  const t={id:uid(),url:u,title:''}, f=F(), i=after?f.tabs.findIndex(x=>x.id===after):-1;
  if(i>=0) f.tabs.splice(i+1,0,t); else f.tabs.push(t);
  entering.add(t.id); activate(t.id); return t;
}
function dupTab(id){ const o=findTab(id); if(!o) return; const n=newTab(o.url,id); n.title=o.title; n.icon=o.icon; n.muted=o.muted; renderTabs(); save(); }
const pushClosed=t=>{ if(t.url){ S.closed.push({url:t.url,title:t.title,icon:t.icon,pinned:t.pinned,muted:t.muted}); if(S.closed.length>15) S.closed.shift(); } };
function closeTab(id){
  if(isGp(id)) return unGlobal(id,'close');
  const f=F(); if(!f.tabs.some(t=>t.id===id)||leaving.has(id)) return;
  leaving.add(id); renderTabs();
  later('tab',190,()=>{ leaving.delete(id); rmTab(f,id); });
}
function rmTab(f,id,moved){
  const i=f.tabs.findIndex(t=>t.id===id); if(i<0) return; if(!moved) pushClosed(f.tabs[i]);
  if(views[id]){ views[id].remove(); delete views[id]; }
  f.tabs.splice(i,1); const cur=(f===F());
  if(!f.tabs.length){ if(cur) newTab(); else { f.tabs.push({id:uid(),url:'',title:''}); f.active=f.tabs[0].id; save(); } return; }
  if(f.active===id){ const n=f.tabs[Math.min(i,f.tabs.length-1)].id; if(cur) activate(n); else f.active=n; } else if(cur) renderTabs();
  save();
}
function closeAll(){
  const f=F(), ids=f.tabs.map(t=>t.id).filter(id=>!leaving.has(id)); if(!ids.length) return;
  ids.forEach(id=>leaving.add(id)); renderTabs();
  later('tab',200,()=>{
    ids.forEach(id=>{ leaving.delete(id); const i=f.tabs.findIndex(t=>t.id===id); if(i<0) return; pushClosed(f.tabs[i]); if(views[id]){ views[id].remove(); delete views[id]; } f.tabs.splice(i,1); });
    const nt={id:uid(),url:'',title:''}; f.tabs.push(nt);
    if(f===F()){ entering.add(nt.id); activate(nt.id); } else { f.active=nt.id; save(); }
  });
}
function restoreTab(){ const c=S.closed.pop(); if(!c) return; const t=newTab(c.url); Object.assign(t,{title:c.title,icon:c.icon,pinned:c.pinned,muted:c.muted}); renderTabs(); save(); }
function reloadTab(id){ const w=views[id]; if(w) w.reload(); }
function reloadAll(){ F().tabs.forEach(t=>reloadTab(t.id)); }
function pinTab(id){ const t=F().tabs.find(x=>x.id===id); if(!t) return; t.pinned=!t.pinned; entering.add(id); renderTabs(); save(); }
function pinAll(){ const f=F(), v=!f.tabs.every(t=>t.pinned); f.tabs.forEach(t=>{ if(!!t.pinned!==v) entering.add(t.id); t.pinned=v; }); renderTabs(); save(); }
function muteTab(id){ const t=findTab(id); if(!t) return; t.muted=!t.muted; try{ views[id]&&views[id].setAudioMuted(t.muted); }catch{} renderTabs(); save(); }
function muteAll(){ const f=F(), v=!f.tabs.every(t=>t.muted); f.tabs.forEach(t=>{ t.muted=v; try{ views[t.id]&&views[t.id].setAudioMuted(v); }catch{} }); renderTabs(); save(); }
function cycle(d){ const f=F(), i=f.tabs.findIndex(t=>t.id===f.active); activate(f.tabs[(i+d+f.tabs.length)%f.tabs.length].id); }
let swBusy=false, rising=false, swPending=null;
function swFolder(id){
  if(swBusy){ swPending=id; return; }          // kliknięcie w trakcie animacji: zapamiętaj ostatni wybór
  if(id===S.cur) return;
  if(!an('tab')||!an('fold')){ switchFolder(id); return; }
  swBusy=true; swPending=null;
  const els=[...$('tabs').children,...pinBox().children];
  els.forEach((el,i)=>{ el.classList.remove('rise','ent'); el.style.animation='none'; void el.offsetWidth; el.style.animation=''; el.style.animationDelay=Math.min(i,6)*22+'ms'; el.classList.add('sdn'); });
  setTimeout(()=>{ rising=true; switchFolder(id); swBusy=false;
    if(swPending&&swPending!==S.cur){ const n=swPending; swPending=null; setTimeout(()=>swFolder(n),60); } else swPending=null; },190+Math.min(els.length,7)*22);
}
function switchFolder(id){
  S.cur=id; for(const k in views){ if(isGp(k)) continue; views[k].remove(); delete views[k]; }   // karty przypięte we wszystkich folderach zostają otwarte
  const f=F(); if(!f.tabs.length) f.tabs.push({id:uid(),url:'',title:''});
  activate(f.tabs.find(t=>t.id===f.active)||isGp(f.active)?f.active:f.tabs[0].id);
}
function tabHtml(t,f,pin,gp){
  const cls=(t.id===f.active?' on':'')+(entering.has(t.id)?' ent':'')+(leaving.has(t.id)?' out':'')+(t.id===dragId?' drg'+(dragGone?' gone':''):''), nm=esc(t.title||(t.url?host(t.url):'Nowa karta')),
    ic=INC?incHatSvg():(t.icon?`<img src="${esc(t.icon)}">`:'<i>✺</i>'), mu=t.muted?'<s class="mu">🔇</s>':'';
  return pin?`<div class="pt${cls}${gp?' gp':''}" data-id="${t.id}" title="${nm}">${ic}<span>${nm}</span>${mu}${gp?GP_IC:''}</div>`
            :`<div class="tab${cls}" data-id="${t.id}" title="${nm}">${ic}<span>${nm}</span>${mu}<b data-x="${t.id}">×</b></div>`;
}
// przypięte karty: pasek u góry (#pinsi) albo lewy pasek pod folderami (#lpins) – Ustawienia → Interfejs
const pinLeft=()=>S.settings.ui.pinpos==='left';
const pinBox=()=>pinLeft()?$('lpins'):$('pinsi');
function renderTabs(){
  const f=F(), pins=f.tabs.filter(t=>t.pinned), left=pinLeft();
  const un=f.tabs.filter(t=>!t.pinned).map(t=>tabHtml(t,f,0));
  if(xd) un.splice(xd.idx,0,tabHtml({id:'__xd',url:xd.tab.url,title:xd.tab.title,icon:xd.tab.icon},f,0).replace('class="tab','class="tab xd'));
  $('tabs').innerHTML=un.join('');
  const ph=S.gpins.map(t=>tabHtml(t,f,1,1)).join('')+pins.map(t=>tabHtml(t,f,1)).join('');
  $('pinsi').innerHTML=left?'':ph; $('lpins').innerHTML=left?ph:'';
  const np=pins.length+S.gpins.length; $('pins').classList.toggle('has',!left&&np>0); $('lpins').classList.toggle('has',left&&np>0);
  entering.clear(); fitTabs();
  if(rising){ [...$('tabs').children,...pinBox().children].forEach((el,i)=>{ el.classList.add('rise'); el.style.animationDelay=Math.min(i,6)*28+'ms'; }); rising=false; }
}
function fitTabs(){ const n=F().tabs.filter(t=>!t.pinned).length; if(!n) return; const w=($('tabs').clientWidth-2*(n-1))/n; $('tabs').classList.toggle('sm',w<110); $('tabs').classList.toggle('xs',w<56); }
new ResizeObserver(fitTabs).observe($('tabs'));
$('tabs').addEventListener('click',e=>{ if(e.target.dataset.x) return closeTab(e.target.dataset.x); const t=e.target.closest('.tab'); if(t) activate(t.dataset.id); });
for(const el of [$('pinsi'),$('lpins')]) el.addEventListener('click',e=>{ const t=e.target.closest('.pt'); if(t) activate(t.dataset.id); });
// dużo przypiętych kart u góry: przewijanie kółkiem w poziomie (pasek przewijania pod kartami)
$('pinsi').addEventListener('wheel',e=>{ const p=$('pinsi'); if(p.scrollWidth>p.clientWidth&&Math.abs(e.deltaY)>Math.abs(e.deltaX)){ p.scrollLeft+=e.deltaY; e.preventDefault(); } },{passive:false});
$('nt').onclick=()=>newTab();
for(const el of [$('tabs'),$('pinsi'),$('lpins')]){
  el.addEventListener('auxclick',e=>{ const t=e.target.closest('.tab,.pt'); if(t&&e.button===1) closeTab(t.dataset.id); });
  el.addEventListener('contextmenu',e=>{ const el2=e.target.closest('.tab,.pt'); if(!el2) return; e.preventDefault(); tabMenu(e,el2.dataset.id); });
}

// ---------- menu kontekstowe ----------
const kbs=a=>{ const k=a&&S.settings.keys[a]; return k?`<span class="mk">${k.split('+').map(x=>`<kbd>${esc(keyTokLabel(x))}</kbd>`).join('')}</span>`:''; };
function showMenu(x,y,items,pin){
  const m=$('cm');
  m.innerHTML=items.map((it,i)=>it==='sep'?'<div class="ms"></div>':`<div class="mi${it.off?' off':''}" data-i="${i}"><span>${esc(it.l)}</span>${kbs(it.a)}</div>`).join('');
  m._items=items; menuOpen=!!pin; m.classList.add('open');
  const r=m.getBoundingClientRect(); m.style.left=Math.max(6,Math.min(x,innerWidth-r.width-6))+'px'; m.style.top=Math.max(6,Math.min(y,innerHeight-r.height-6))+'px';
  if(pin) $('sidewrap').classList.add('pin');
}
function closeMenu(){ const m=$('cm'); if(!m.classList.contains('open')) return; m.classList.remove('open'); menuOpen=false; $('sidewrap').classList.toggle('pin',!!editing||!!pk); }
$('cm').addEventListener('click',e=>{ const it=e.target.closest('.mi'); if(!it) return; const fn=$('cm')._items[it.dataset.i].f; closeMenu(); fn(); });
document.addEventListener('mousedown',e=>{ if(!$('cm').contains(e.target)) closeMenu(); },true);
addEventListener('blur',closeMenu); addEventListener('resize',closeMenu);
function tabMenu(e,id){
  if(isGp(id)) return gpMenu(e,id);
  const f=F(), t=f.tabs.find(x=>x.id===id), allP=f.tabs.every(x=>x.pinned), allM=f.tabs.every(x=>x.muted);
  showMenu(e.clientX,e.clientY,[
    {l:'Nowa karta',a:'new-tab',f:()=>newTab()},
    {l:'Duplikuj kartę',a:'dup-tab',f:()=>dupTab(id)},
    {l:'Odśwież kartę',a:'reload-tab',off:!t.url,f:()=>reloadTab(id)},
    {l:t.pinned?'Odepnij kartę':'Przypnij kartę',a:'pin-tab',f:()=>pinTab(id)},
    {l:'Przypnij we wszystkich folderach',a:'pin-global',off:!t.url||INC,f:()=>makeGlobal(id)},
    {l:t.muted?'Włącz dźwięk karty':'Wycisz kartę',a:'mute-tab',f:()=>muteTab(id)},
    {l:'Zamknij kartę',a:'close-tab',f:()=>closeTab(id)},
    {l:'Przywróć zamkniętą kartę',a:'restore-tab',off:!S.closed.length,f:restoreTab},
    'sep',
    {l:'Zamknij wszystkie karty',a:'close-all',f:closeAll},
    {l:'Odśwież wszystkie karty',a:'reload-all',f:reloadAll},
    {l:allP?'Odepnij wszystkie karty':'Przypnij wszystkie karty',a:'pin-all',f:pinAll},
    {l:allM?'Włącz dźwięk wszystkich kart':'Wycisz wszystkie karty',a:'mute-all',f:muteAll},
    'sep',
    {l:'Otwórz kartę w oknie incognito',off:!t.url||INC,f:()=>openIncognito([t],f.name,f.icon)},
    {l:'Otwórz folder w oknie incognito',off:!f.tabs.some(x=>x.url)||INC,f:()=>openIncognito(f.tabs,f.name,f.icon)},
    {l:'Nowe okno incognito',a:'incognito',f:()=>newWindow(true)}
  ]);
}

// ---------- foldery ----------
function renderSide(){
  $('fl').innerHTML='<h6>FOLDERY</h6>'+S.folders.map(f=>{
    if(editing===f.id) return `<input class="fi" data-e="${f.id}" value="${esc(f.name)}" maxlength="24">`;
    const cls=(f.id===S.cur?' on':'')+(enteringF.has(f.id)?' ent':'')+(leavingF.has(f.id)?' out':'')+(f.id===dragId?' drg'+(dragGone?' gone':''):'');
    return `<div class="fd${cls}" data-id="${f.id}" title="${esc(f.name)}"><i class="ic">${folderIc(f.icon)}</i><span>${esc(f.name)}</span>${S.folders.length>1?`<div class="ems"><em data-d="${f.id}" title="Usuń folder">×</em></div>`:''}</div>`;
  }).join('')+'<div id="nf" title="Nowy folder"><i class="ic">＋</i><span>Nowy folder</span></div>';
  enteringF.clear(); $('side').scrollLeft=0; $('fl').scrollLeft=0;
  $('sidewrap').classList.toggle('pin',!!editing||!!pk||menuOpen||dragId!==null);
  const i=$('fl').querySelector('.fi');
  if(i){ i.focus({preventScroll:true}); i.select(); let done=false;
    const fin=ok=>{ if(done) return; done=true; const f=S.folders.find(x=>x.id===editing); if(f&&ok&&i.value.trim()) f.name=i.value.trim(); editing=null; renderSide(); save(); };
    i.onkeydown=e=>{ if(e.key==='Enter') fin(true); if(e.key==='Escape') fin(false); }; i.onblur=()=>fin(true); }
}
// wybór ikony folderu
const FIC={folder:'<path d="M3.5 7.5a2 2 0 0 1 2-2h4l2 2.5h7a2 2 0 0 1 2 2v7.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/>',briefcase:'<rect x="3" y="7.5" width="18" height="12" rx="2"/><path d="M9 7.5V6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6v1.5M3 13h18"/>',home:'<path d="M4 11 12 4l8 7"/><path d="M6 9.5V19a1 1 0 0 0 1 1h3.5v-5.5h3V20H17a1 1 0 0 0 1-1V9.5"/>',gamepad:'<rect x="2.5" y="7" width="19" height="10.5" rx="5"/><path d="M7.5 10.5v3.5M5.8 12.2h3.5M15.5 11.5h.01M18 13.5h.01"/>',music:'<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>',film:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/>',books:'<rect x="3" y="4" width="4.5" height="16" rx="1"/><rect x="8.5" y="4" width="4.5" height="16" rx="1"/><path d="m14.8 6 3.7-1 3 14.2-3.7 1z"/>',brain:'<path d="M12 5v14"/><path d="M12 5a3.5 3.5 0 0 0-6.4 1.8A3.6 3.6 0 0 0 4 10a3.6 3.6 0 0 0 1.4 2.8A3.6 3.6 0 0 0 8 18.5 3.5 3.5 0 0 0 12 19M12 5a3.5 3.5 0 0 1 6.4 1.8A3.6 3.6 0 0 1 20 10a3.6 3.6 0 0 1-1.4 2.8A3.6 3.6 0 0 1 16 18.5 3.5 3.5 0 0 1 12 19"/>',bulb:'<path d="M9.5 17.5h5M10.5 20.5h3"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.3 1 2.1h5c0-.8.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',wrench:'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"/>',laptop:'<rect x="5" y="5" width="14" height="10" rx="1.8"/><path d="M2.5 19h19"/>',cart:'<circle cx="9" cy="19.5" r="1.4"/><circle cx="17" cy="19.5" r="1.4"/><path d="M2.5 4h2.7l2.2 11h10.3l2-8H6.2"/>',plane:'<path d="M12 3c1 0 1.6.8 1.6 2v5.5l8 4.5v2l-8-2.2V19l2.2 1.6V22L12 21l-3.8 1v-1.4L10.4 19v-4.2l-8 2.2v-2l8-4.5V5c0-1.2.6-2 1.6-2z"/>',utensils:'<path d="M7 3v7a2 2 0 0 0 2 2 2 2 0 0 0 2-2V3M9 3v18M17 21V3c-2.2 1.4-3.5 4-3.5 7v3H17"/>',newspaper:'<rect x="3.5" y="4.5" width="14" height="15" rx="2"/><path d="M17.5 8.5h2a1.5 1.5 0 0 1 1.5 1.5v7.5a2 2 0 0 1-2 2M7 9h7M7 12.5h7M7 16h4"/>',graduation:'<path d="m2.5 9.5 9.5-5 9.5 5-9.5 5z"/><path d="M6 11.5v4.5c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5M21.5 9.5v6"/>',chat:'<path d="M4 5.5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H10l-4.5 4v-4H6a2 2 0 0 1-2-2z"/>',star:'<path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9l-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z"/>',heart:'<path d="M12 20s-8-4.7-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.3 12 20 12 20z"/>',flame:'<path d="M12 21c3.9 0 6.5-2.6 6.5-6.3 0-2.4-1.2-4.2-2.8-5.8-.3 1.3-1 2.3-2 2.8.5-3-.8-6-3.7-7.7.1 3.6-3.9 5.1-3.9 10.5C6.1 18.2 8.2 21 12 21z"/>',leaf:'<path d="M5 19c0-8 4-13.5 14.5-14.5.5 10.5-5.5 14.5-12.5 14.5"/><path d="M5 19c2-5 5-8 9-10"/>',palette:'<circle cx="13.5" cy="6.5" r="1"/><circle cx="17.5" cy="10.5" r="1"/><circle cx="8.5" cy="7.5" r="1"/><circle cx="6.5" cy="12.5" r="1"/><path d="M12 2a10 10 0 0 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.3A4.9 4.9 0 0 0 22 10.6C22 5.8 17.5 2 12 2z"/>',chart:'<path d="M3.5 3.5v17h17"/><path d="m7 15 3.5-4 3 2.5 5-6.5"/>',lock:'<rect x="4.5" y="10.5" width="15" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>'};
const FEMO={"📁":"folder","💼":"briefcase","🏠":"home","🎮":"gamepad","🎵":"music","🎬":"film","📚":"books","🧠":"brain","💡":"bulb","🔧":"wrench","💻":"laptop","🛒":"cart","✈":"plane","🍳":"utensils","📰":"newspaper","🎓":"graduation","💬":"chat","⭐":"star","❤":"heart","🔥":"flame","🌿":"leaf","🎨":"palette","📈":"chart","🔒":"lock"};
const folderIc=ic=>{ ic=ic||'📁'; const k=ic.startsWith('i:')?ic.slice(2):FEMO[ic.replace(/\uFE0F/g,'')]; return FIC[k]?`<svg viewBox="0 0 24 24">${FIC[k]}</svg>`:esc(ic); };

let pk=null;
function closePicker(){ if(pk){ pk.remove(); pk=null; } $('sidewrap').classList.toggle('pin',!!editing||menuOpen); }
function openPicker(fid){
  closePicker();
  const row=document.querySelector(`.fd[data-id="${fid}"]`), r=row?row.getBoundingClientRect():{top:120};
  pk=document.createElement('div'); pk.id='pk'; pk.style.top=Math.max(8,Math.min(r.top,innerHeight-250))+'px';
  pk.innerHTML=Object.keys(FIC).map(k=>`<button data-e="i:${k}"><svg viewBox="0 0 24 24">${FIC[k]}</svg></button>`).join('')+'<input placeholder="własna ikona + Enter">';
  document.body.appendChild(pk); $('sidewrap').classList.add('pin');
  const set=ic=>{ S.folders.find(x=>x.id===fid).icon=ic; closePicker(); renderSide(); save(); };
  pk.onclick=e=>{ const b=e.target.closest('button[data-e]'); if(b) set(b.dataset.e); };
  const inp=pk.querySelector('input'); inp.focus();
  inp.onkeydown=e=>{ if(e.key==='Enter'){ const v=inp.value.trim(); if(v){ const g=[...new Intl.Segmenter().segment(v)][0]; set(g.segment); } } if(e.key==='Escape') closePicker(); };
}
document.addEventListener('mousedown',e=>{ if(pk&&!pk.contains(e.target)) closePicker(); });
addEventListener('blur',closePicker);
for(const el of [$('side'),$('fl'),$('sidewrap')]) el.addEventListener('scroll',()=>{ if(el.scrollLeft) el.scrollLeft=0; });
function dupFolder(id){
  const i=S.folders.findIndex(f=>f.id===id), f=S.folders[i], map={};
  const tabs=f.tabs.map(t=>{ const n={...t,id:uid()}; map[t.id]=n.id; return n; });
  const nf={id:uid(),name:f.name+' ('+t('kopia')+')',icon:f.icon||'📁',tabs,active:map[f.active]||(tabs[0]&&tabs[0].id)||null};
  S.folders.splice(i+1,0,nf); enteringF.add(nf.id); renderSide(); save();
}
function addFolder(){ const f={id:uid(),name:t('Folder')+' '+(S.folders.length+1),icon:'📁',tabs:[],active:null}; S.folders.push(f); editing=f.id; enteringF.add(f.id); switchFolder(f.id); }
function cycleF(d){ const i=S.folders.findIndex(f=>f.id===S.cur); swFolder(S.folders[(i+d+S.folders.length)%S.folders.length].id); }
$('fl').addEventListener('click',e=>{
  const d=e.target.dataset;
  if(e.target.closest('#nf')) return addFolder();
  if(d.d){ const f=S.folders.find(x=>x.id===d.d);
    const del=()=>{ leavingF.add(f.id); renderSide();
      later('fold',230,()=>{ leavingF.delete(f.id); S.folders=S.folders.filter(x=>x.id!==f.id); if(S.cur===f.id) switchFolder(S.folders[0].id); else { renderSide(); save(); } }); };
    if(f.tabs.every(t=>!t.url)) del();   // wszystkie karty to menu główne – bez ostrzeżenia
    else ask(t('Usunąć folder „{n}”?').replace('{n}',f.name),t('Wszystkie karty z tego folderu ({n}) zostaną zamknięte. Tej operacji nie można cofnąć.').replace('{n}',f.tabs.length),'Usuń').then(ok=>{ if(ok) del(); });
    return; }
  const el=e.target.closest('.fd'); if(el&&el.dataset.id&&el.dataset.id!==S.cur) swFolder(el.dataset.id);
});
$('fl').addEventListener('dblclick',e=>{ const el=e.target.closest('.fd'); if(el&&el.dataset.id){ editing=el.dataset.id; renderSide(); } });
$('fl').addEventListener('contextmenu',e=>{
  const el=e.target.closest('.fd'); if(!el) return; e.preventDefault();
  const id=el.dataset.id, cur=id===S.cur;
  showMenu(e.clientX,e.clientY,[
    {l:'Zmień ikonę',f:()=>openPicker(id)},
    {l:'Zmień nazwę',a:cur&&'rename-folder',f:()=>{ editing=id; renderSide(); }},
    {l:'Duplikuj folder',a:cur&&'dup-folder',f:()=>dupFolder(id)},
    'sep',
    {l:'Otwórz folder w oknie incognito',off:INC||!(S.folders.find(x=>x.id===id)||{tabs:[]}).tabs.some(x=>x.url),f:()=>{ const fo=S.folders.find(x=>x.id===id); if(fo) openIncognito(fo.tabs,fo.name,fo.icon); }}
  ],true);
});


// ---------- strony przypięte we wszystkich folderach ----------
const GP_IC='<svg class="gpi" viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 3.5 20.5 9.5 17.6 10.4 14.2 13.8 14.8 18.4 13 20.2 9.4 16.6 4.6 21.4 3.6 20.4 8.4 15.6 4.8 12 6.6 10.2 11.2 10.8 14.6 7.4z"/></svg>';
// karta z bieżącego folderu staje się stroną przypiętą we wszystkich folderach (jej karta i strona działają dalej)
function makeGlobal(id){
  const f=F(), i=f.tabs.findIndex(t=>t.id===id); if(i<0||INC) return;
  const tb=f.tabs.splice(i,1)[0]; tb.pinned=true; S.gpins.push(tb); entering.add(tb.id);
  if(!f.tabs.length) f.tabs.push({id:uid(),url:'',title:''});
  f.active=id; renderTabs(); save(); toast(t('Strona jest teraz przypięta we wszystkich folderach'));
}
// mode: 'here' = zostaje jako przypięta karta bieżącego folderu, 'tab' = zwykła karta bieżącego folderu, 'close' = zamknięcie
function unGlobal(id,mode){
  const i=S.gpins.findIndex(t=>t.id===id); if(i<0) return;
  const t=S.gpins.splice(i,1)[0], cur=F();
  for(const f of S.folders) if(f!==cur&&f.active===id) f.active=(f.tabs[0]||{}).id||null;
  if(mode==='close'){ pushClosed(t); if(views[id]){ views[id].remove(); delete views[id]; }
    if(cur.active===id) activate(cur.tabs[0].id); else renderTabs(); save(); return; }
  t.pinned=mode==='here'; cur.tabs.push(t); entering.add(t.id); activate(cur.active===id?id:cur.active); save();
}
function gpMenu(e,id){
  const t=S.gpins.find(x=>x.id===id); if(!t) return;
  showMenu(e.clientX,e.clientY,[
    {l:'Odśwież kartę',a:'reload-tab',off:!t.url,f:()=>reloadTab(id)},
    {l:t.muted?'Włącz dźwięk karty':'Wycisz kartę',a:'mute-tab',f:()=>muteTab(id)},
    {l:'Duplikuj kartę',a:'dup-tab',f:()=>dupTab(id)},
    'sep',
    {l:'Przypnij tylko w tym folderze',f:()=>unGlobal(id,'here')},
    {l:'Odepnij ze wszystkich folderów',a:'pin-global',f:()=>unGlobal(id,'tab')},
    {l:'Zamknij kartę',a:'close-tab',f:()=>closeTab(id)}
  ]);
}
function toggleGlobal(id){ if(isGp(id)) unGlobal(id,'tab'); else makeGlobal(id); }

// ===== src/js/08-panel.js =====
// ---------- nawigacja i panel asystenta ----------
const pwSet=()=>document.documentElement.style.setProperty('--pw',(S.pw||430)+'px');
function setPanel(v){ S.panel=v; right.classList.toggle('open',v); split.classList.toggle('open',v); $('toggle').classList.toggle('on',v); save(); }
function togglePanel(){ const v=!S.panel; setPanel(v); if(v&&cw.getAttribute('src')==='about:blank') cw.setAttribute('src','https://claude.ai/new'); }
const SE={googleweb:{n:'Google (tylko wyniki WWW)',url:'https://www.google.com/search?q=%s&udm=14'},google:{n:'Google',url:'https://www.google.com/search?q=%s'},bing:{n:'Bing',url:'https://www.bing.com/search?q=%s'},duckduckgo:{n:'DuckDuckGo',url:'https://duckduckgo.com/?q=%s'},brave:{n:'Brave Search',url:'https://search.brave.com/search?q=%s'},ecosia:{n:'Ecosia',url:'https://www.ecosia.org/search?q=%s'},yahoo:{n:'Yahoo',url:'https://search.yahoo.com/search?p=%s'},qwant:{n:'Qwant',url:'https://www.qwant.com/?q=%s'},yandex:{n:'Yandex',url:'https://yandex.com/search/?text=%s'}};
const seValid=u=>/^https?:\/\/[^\s]*%s/i.test(u||'');
const searchUrl=q=>{ const se=S.settings.search||{}, tpl=se.engine==='custom'&&seValid(se.custom)?se.custom:(SE[se.engine]||SE.googleweb).url; return tpl.replace('%s',()=>encodeURIComponent(q)); };
function go(input){
  input=input.trim(); if(!input) return; const t=T();
  const search=!isUrl(input);   // panel asystenta nie wysuwa się już sam: otwiera się przyciskiem lub skrótem
  t.url=search?searchUrl(input):(/^https?:/i.test(input)?input:'https://'+input);
  if(views[t.id]) views[t.id].setAttribute('src',t.url);
  activate(t.id);
}
url.addEventListener('keydown',e=>{ if(e.key==='Enter'){ go(url.value); url.blur(); } });
url.addEventListener('blur',setUrlBar);
$('hs').addEventListener('keydown',e=>{ if(e.key==='Enter'){ go(e.target.value); e.target.value=''; } });
document.querySelectorAll('.tile').forEach(x=>x.onclick=()=>go(x.dataset.u));
const V=()=>views[T()?.id];
$('back').onclick=()=>V()?.canGoBack()&&V().goBack();
$('fwd').onclick=()=>V()?.canGoForward()&&V().goForward();
$('reload').onclick=()=>V()?.reload();
function goHome(){ const t=T(); t.url=''; t.title=''; t.icon=''; if(views[t.id]){ views[t.id].remove(); delete views[t.id]; } activate(t.id); }
$('brand').onclick=goHome;
$('toggle').onclick=togglePanel;
$('close').onclick=()=>setPanel(false);
const ACTS={
  'new-tab':()=>newTab(),'close-tab':()=>closeTab(F().active),'dup-tab':()=>dupTab(F().active),'reload-tab':()=>reloadTab(F().active),
  'pin-tab':()=>pinTab(F().active),'pin-global':()=>toggleGlobal(F().active),'mute-tab':()=>muteTab(F().active),'restore-tab':restoreTab,
  'close-all':closeAll,'reload-all':reloadAll,'pin-all':pinAll,'mute-all':muteAll,
  'next-tab':()=>cycle(1),'prev-tab':()=>cycle(-1),'focus-url':()=>{ url.focus(); url.select(); },
  'back':()=>$('back').onclick(),'forward':()=>$('fwd').onclick(),'go-home':goHome,
  'new-folder':addFolder,'dup-folder':()=>dupFolder(S.cur),'rename-folder':()=>{ editing=S.cur; renderSide(); },
  'next-folder':()=>cycleF(1),'prev-folder':()=>cycleF(-1),'settings':()=>toggleSet(),'toggle-panel':togglePanel,'history':()=>toggleHist()
};
const act=a=>{ if(ACTS[a]) ACTS[a](); };
try{window.api.onShortcut(act)}catch(e){console.warn('Zły preload.js',e)}
try{window.api.onOpenTab(u=>newTab(u))}catch(e){console.warn('Zły preload.js – podmień go na nowy',e)}
split.addEventListener('mousedown',e=>{ e.preventDefault(); document.body.classList.add('dragging'); split.classList.add('drag');
  const mv=ev=>{ S.pw=Math.round(Math.min(Math.max(innerWidth-ev.clientX,300),innerWidth*0.7)); pwSet(); };
  const up=()=>{ document.body.classList.remove('dragging'); split.classList.remove('drag'); removeEventListener('mousemove',mv); removeEventListener('mouseup',up); save(); };
  addEventListener('mousemove',mv); addEventListener('mouseup',up); });

// ---------- efekty tła ----------
const cv=$('bg'), cx=cv.getContext('2d'); let W=0,H=0,last=0;
new ResizeObserver(()=>{ const w=cv.clientWidth, h=cv.clientHeight; if(w===W&&h===H) return; W=cv.width=w; H=cv.height=h; draw(performance.now()); bgKick(); }).observe(cv);  // po zmianie rozmiaru płótno jest czyszczone, więc rysujemy od razu
const rnd=Math.random;
const DUST=Array.from({length:140},(_,i)=>({x:rnd(),y:rnd(),r:1+rnd()*2.6,v:.00005+rnd()*.00011,p:rnd()*6.28,c:i%3}));
const STARS=Array.from({length:120},()=>({x:rnd(),y:rnd(),r:.5+rnd()*1.1,p:rnd()*6.28,sp:.4+rnd()*1.2}));
const RAIN=Array.from({length:90},()=>({x:rnd(),y:rnd(),l:.03+rnd()*.05,v:.0003+rnd()*.0005}));
const fxv=k=>S.settings.fx[k]/100*S.settings.fx.all/100;
// sprite'y poświat (jedna tekstura na kolor zamiast gradientu na cząstkę i klatkę)
const GSP=new Map();
function glowSp(c,n){ const k=c+'|'+n; let s=GSP.get(k); if(!s){ if(GSP.size>40) GSP.clear(); s=document.createElement('canvas'); s.width=s.height=n; const x=s.getContext('2d'), m=n/2, g=x.createRadialGradient(m,m,0,m,m,m); g.addColorStop(0,`rgba(${c},1)`); g.addColorStop(1,`rgba(${c},0)`); x.fillStyle=g; x.fillRect(0,0,n,n); GSP.set(k,s); } return s; }
let bgIdle=false, bgLast=0; var bgRaf=0;
// Pętla działa tylko wtedy, gdy tło jest widoczne: strona startowa na wierzchu, okno nie jest zminimalizowane/zasłonięte i włączony jest choć jeden efekt.
// W pozostałych przypadkach nie zostawiamy żadnego requestAnimationFrame (wcześniej pętla budziła okno 60 razy na sekundę także pod otwartą stroną).
// Wznawiają ją: pokazanie strony startowej (styl #home), powrót okna na ekran, zmiana rozmiaru i zmiana ustawień efektów (bgKick z applySettings).
const bgLive=()=>!document.hidden&&W>0&&home.style.display!=='none'&&['aurora','waves','stars','rain','dust'].some(k=>fxv(k)>0);
// fr30: wspólny podział czasu na kroki 1/30 s dla wszystkich pętli ~30 kl./s (tło, podglądy w ustawieniach, ruch kolorów motywu). Pętle rysują w tych samych
// klatkach ekranu, więc okno składa obraz 30 razy na sekundę, a nie osobno dla każdej pętli (dwie pętle przesunięte o klatkę dawały 60 składań na sekundę).
function fr30(o,t){ const k=Math.floor(t/33.334); if(o.k30===k) return false; o.k30=k; return true; }
function frame(t){ bgRaf=0; const live=bgLive(); if(live) bgRaf=requestAnimationFrame(frame); else arkRotKick();
  if(live&&!fr30(frame,t)) return; bgLast=t; draw(t); if(live) arkRotTick(); }   // obrót logo jedzie na klatkach tła (gdy tło stoi, ma własny zegar: 22-logo.js)   // ~30 kl./s wystarcza dla powolnych efektów; ostatnia klatka po zatrzymaniu czyści płótno, gdy efekty wyłączono
function bgKick(){ if(!bgRaf&&typeof home!=='undefined') bgRaf=requestAnimationFrame(frame); }
// okno incognito: efekty tła (zorza, fale, gwiazdy, deszcz, pył) płyną wyraźnie wolniej – czas efektów biegnie INC_SLOW razy wolniej
const INC_SLOW=.3; let vtime=0;
function bgClock(t){ const d0=Math.min(50,(t-last)||16); last=t; if(!INC) return {t,dt:d0}; vtime+=d0*INC_SLOW; return {t:vtime,dt:d0*INC_SLOW}; }
function draw(t0){
  const bc=bgClock(t0), t=bc.t, dt=bc.dt;
  if(home.style.display==='none'||!W) return;
  const fa=fxv('aurora'), fw=fxv('waves'), fs=fxv('stars'), fr=fxv('rain'), fd=fxv('dust');
  if(!(fa>0||fw>0||fs>0||fr>0||fd>0)){ if(!bgIdle){ cx.clearRect(0,0,W,H); bgIdle=true; } return; }   // bez efektów nic nie rysujemy
  bgIdle=false; cx.clearRect(0,0,W,H);
  const C=[accRgb,acc2Rgb,fgRgb]; let a=fa;
  if(a>0){ for(let k=0;k<3;k++){ const x=W*(.2+.3*k+.1*Math.sin(t*.00018+k*2)), y=H*(.22+.12*Math.cos(t*.00013+k*1.7)), g=cx.createRadialGradient(x,y,0,x,y,W*.42); g.addColorStop(0,`rgba(${C[k]},${.28*a})`); g.addColorStop(1,`rgba(${C[k]},0)`); cx.fillStyle=g; cx.fillRect(0,0,W,H); }
    // miękkie zanikanie przy bocznych krawędziach: poświata nie jest już ucinana na styku z paskiem
    const ew=Math.round(W*.16); cx.globalCompositeOperation='destination-out';
    let ge=cx.createLinearGradient(0,0,ew,0); ge.addColorStop(0,'rgba(0,0,0,1)'); ge.addColorStop(.5,'rgba(0,0,0,.3)'); ge.addColorStop(1,'rgba(0,0,0,0)'); cx.fillStyle=ge; cx.fillRect(0,0,ew,H);
    ge=cx.createLinearGradient(W-ew,0,W,0); ge.addColorStop(0,'rgba(0,0,0,0)'); ge.addColorStop(.5,'rgba(0,0,0,.3)'); ge.addColorStop(1,'rgba(0,0,0,1)'); cx.fillStyle=ge; cx.fillRect(W-ew,0,ew,H);
    cx.globalCompositeOperation='source-over'; }
  a=fw;
  if(a>0) for(let k=0;k<3;k++){ cx.beginPath(); cx.moveTo(0,H); for(let x=0;x<=W;x+=10) cx.lineTo(x,H*(.80+.055*k)+Math.sin(x*.0042+t*.00035*(1+k*.35)+k*2.1)*(10+14*a+k*5)); cx.lineTo(W,H); cx.closePath(); cx.fillStyle=`rgba(${accRgb},${(.05-k*.012)*(.3+1.4*a)})`; cx.fill(); }
  a=fs;
  if(a>0){ const n=Math.ceil(STARS.length*Math.min(1,a*1.2)); for(let i=0;i<n;i++){ const q=STARS[i]; cx.fillStyle=`rgba(${fgRgb},${a*(.15+.85*Math.abs(Math.sin(t*.001*q.sp+q.p)))})`; cx.beginPath(); cx.arc(q.x*W,q.y*H,q.r,0,6.283); cx.fill(); } }
  a=fr;
  if(a>0){ cx.lineWidth=1; cx.strokeStyle=`rgba(${acc2Rgb},${.3*a})`; const n=Math.ceil(RAIN.length*Math.min(1,a*1.2)); cx.beginPath(); for(let i=0;i<n;i++){ const d=RAIN[i]; d.y+=d.v*dt; if(d.y>1.05){ d.y=-.1; d.x=rnd(); } cx.moveTo(d.x*W,d.y*H); cx.lineTo(d.x*W,(d.y+d.l)*H); } cx.stroke(); }   // jedna ścieżka = jedno rysowanie
  a=fd;
  if(a>0){ const n=Math.ceil(DUST.length*Math.min(1,a*1.2)), sp=C.map(c=>glowSp(c,64)), ma=Math.min(1,.4+a); for(let i=0;i<n;i++){ const d=DUST[i]; d.y-=d.v*dt; if(d.y<-.02){ d.y=1.02; d.x=rnd(); }
    const x=(d.x+Math.sin(t*.0003+d.p)*.015)*W, y=d.y*H, R=d.r*5; cx.globalAlpha=(.25+.4*Math.abs(Math.sin(t*.001+d.p)))*ma; cx.drawImage(sp[d.c],x-R,y-R,2*R,2*R); } cx.globalAlpha=1; }
}
bgKick();
new MutationObserver(()=>{ bgKick(); arkRotKick(); }).observe(home,{attributes:true,attributeFilter:['style']});   // obrót logo: 22-logo.js
document.addEventListener('visibilitychange',()=>{ bgKick(); arkRotKick(); });

// ---------- okno dialogowe w stronie ----------
function ask(title,text,ok='OK'){ return new Promise(res=>{
  const m=$('md'); m.querySelector('h3').textContent=title; m.querySelector('p').textContent=text; $('mo').textContent=ok; m.classList.add('open'); $('mo').focus();
  const kd=e=>{ if(e.key==='Escape'){ e.stopPropagation(); done(false); } else if(e.key==='Enter'&&document.activeElement!==$('mc')){ e.preventDefault(); done(true); } };
  const bd=e=>{ if(e.target===m) done(false); };
  const done=v=>{ m.classList.remove('open'); document.removeEventListener('keydown',kd,true); m.removeEventListener('mousedown',bd); res(v); };
  document.addEventListener('keydown',kd,true); m.addEventListener('mousedown',bd); $('mo').onclick=()=>done(true); $('mc').onclick=()=>done(false);
}); }


// ===== src/js/09-settings.js =====
// ---------- ustawienia: każdy parametr jest niezależny ----------
let P={}, accRgb='232,130,90', acc2Rgb='242,179,107', fgRgb='245,237,227', svT, gT;
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
function hsl2rgb(h,s,l){ s/=100; l/=100; const a=s*Math.min(l,1-l), f=n=>{ const k=(n+h/30)%12; return l-a*Math.max(-1,Math.min(k-3,9-k,1)); }; return [f(0),f(8),f(4)].map(x=>Math.round(x*255)); }
function rgb2hsl(r,g,b){ r/=255; g/=255; b/=255; const mx=Math.max(r,g,b), mn=Math.min(r,g,b), d=mx-mn, l=(mx+mn)/2; let h=0,s=0;
  if(d){ s=d/(1-Math.abs(2*l-1)); h=mx===r?((g-b)/d)%6:mx===g?(b-r)/d+2:(r-g)/d+4; h=(h*60+360)%360; } return [h,s*100,l*100]; }
const hex=a=>'#'+a.map(x=>x.toString(16).padStart(2,'0')).join('');
const unhex=h=>{ const m=/^#?([0-9a-f]{6})$/i.exec(String(h).trim()); return m?[0,2,4].map(i=>parseInt(m[1].substr(i,2),16)):null; };
const saveSoon=()=>{ clearTimeout(svT); svT=setTimeout(save,300); };
const setPath=(p,v)=>{ const k=p.split('.'); (k[0]==='bg'?curBg():S.settings[k[0]])[k[1]]=v; };
function curBg(){ const bs=fixBgs(); return bs[S.settings.bgSel]; }
// kolor akcentu, który edytują suwaki RGB (rozwinięty na liście), oraz korekty uniwersalne (v49.1): przesuwają jasność, nasycenie i RGB każdego koloru o wartość, nigdy poza zakresem
function accGet(){ fixBgs(); return S.settings.accs[S.settings.accSel]; }
function accSet(h){ fixBgs(); S.settings.accs[S.settings.accSel]=String(h).toLowerCase(); S.settings.acc=S.settings.accs[0]; }
function effBg(b,a){ a=a||{}; return {...b,r:clamp(b.r+(a.r|0),0,255),g:clamp(b.g+(a.g|0),0,255),b:clamp(b.b+(a.b|0),0,255),sat:clamp(b.sat+(a.sat|0),0,100),bri:clamp(b.bri+(a.bri|0),0,100)}; }
function effAcc(h,a){ a=a||{}; let c=unhex(h)||[232,130,90]; if(a.sat||a.bri){ const q=rgb2hsl(...c); c=hsl2rgb(q[0],clamp(q[1]+(a.sat|0),0,100),clamp(q[2]+(a.bri|0),0,100)); } return [clamp(c[0]+(a.r|0),0,255),clamp(c[1]+(a.g|0),0,255),clamp(c[2]+(a.b|0),0,255)]; }
function accApply(ar){   // ustawia akcent w interfejsie; wołane przy każdej zmianie ustawień oraz co klatkę przy przechodzeniu kolorów akcentu w czasie
  if(INC){ const q=rgb2hsl(...ar); ar=hsl2rgb(q[0],q[1]*.22,clamp(q[2]*.88,0,100)); }
  const ah=rgb2hsl(...ar), a2=hsl2rgb((ah[0]+12)%360,ah[1],clamp(ah[2]+12,0,90));
  P.acc=hex(ar); P.acc2=hex(a2); accRgb=ar.join(','); acc2Rgb=a2.join(',');
  const r=document.documentElement.style; r.setProperty('--acc',P.acc); r.setProperty('--acc2',P.acc2); r.setProperty('--accrgb',accRgb); }   // kolor, który edytują suwaki (rozwinięty na liście kolorów motywu)
// kolor bazowy (R,G,B) + korekty nasycenia i jasności, z których żadna nie zmienia pozostałych
function calcBg(b){ const q=rgb2hsl(b.r,b.g,b.b), h=q[1]>.5?q[0]:b.hold; return [h,clamp(q[1]+(b.sat-50)*2,0,100),clamp(q[2]+(b.bri-50)*.8,0,100)]; }
function applySettings(){
  applyUi();
  const st=S.settings;
  // 1–4 kolory motywu: każdy liczony osobno, kolory jednolite (ramki, pola, linie) to ich średnia, a duże powierzchnie dostają przejście kolorów (--tg0/1/2)
  const cl=fixBgs().map(b=>{ let [h,s,l]=calcBg(effBg(b,st.bgAdj)); if(INC){ s*=.18; l=l>55?l-9:l*.8; } return [h,s,l]; });   // okno incognito: przyciemniona i wyszarzała wersja motywu użytkownika
  const [h,s,l]=cl[0], lAvg=cl.reduce((a,c)=>a+c[2],0)/cl.length, light=lAvg>55, dir=light?-1:1;
  const lv=(dl,ds=1)=>cl.map(([h,s,l])=>hsl2rgb(h,s*ds,clamp(l+dl*dir,0,100))), lgv=(dl,ds=1)=>cl.map(([h,s,l])=>hsl2rgb(h,s*ds,clamp(Math.min(l,40)+dl,0,100)));
  const av=a=>[0,1,2].map(i=>Math.round(a.reduce((x,c)=>x+c[i],0)/a.length));
  P={bg:hex(av(lv(0))),panel:hex(av(lv(3.7))),panel2:hex(av(lv(7.4))),line:hex(av(lv(12,.9))),mut:hex(hsl2rgb(h,Math.min(s,12),light?36:62)),fg:light?'#1b1612':INC?'#ececef':'#f5ede3',
     gbg:hex(lgv(0)[0]),gpanel:hex(lgv(3.7)[0]),gline:hex(lgv(12,.9)[0]),bg1:hex(lv(0)[0])};   // strony (tło webview i kolorowanie Google) dziedziczą PIERWSZY kolor motywu, a nie średnią
  fgRgb=light?'27,22,18':INC?'236,236,239':'245,237,227';
  accApply(effAcc((st.accs&&st.accs[0])||st.acc,st.accAdj));
  const r=document.documentElement.style;
  for(const k of ['bg','bg1','panel','panel2','line','mut','acc','acc2','fg']) r.setProperty('--'+k,P[k]);
  tmSync();   // przejścia kolorów motywu (--tg0/1/2) i ruch kolorów; zob. 36-themecolors.js
  bgKick();   // efekty tła mogły zostać włączone: wznawiamy pętlę tła (zatrzymuje się sama, gdy nic nie widać)
  // kropka w napisie „inCognito”: odcień wybranego motywu (akcentu), ale zawsze o tej samej jasności i nasyceniu co domyślny pomarańcz (#e8825a) –
  // niezależnie od ustawień jasności i nasycenia oraz od wyszarzenia okna incognito (używamy surowego st.acc, a nie przyciemnionego ar)
  { const d=rgb2hsl(232,130,90), bq=rgb2hsl(...(unhex((st.accs&&st.accs[0])||st.acc)||[232,130,90]));
    r.setProperty('--incdot',hex(hsl2rgb(bq[1]<8?d[0]:bq[0],d[1],d[2]))); }
  { const c=unhex(P.panel); r.setProperty('--cc',(0.2126*c[0]+0.7152*c[1]+0.0722*c[2])/255>0.55?'#000':'#fff'); }
  const im=st.img, bi=$('bgimg');
  bi.style.backgroundImage=im.data?`url("${im.data}")`:'none';
  bi.style.backgroundSize=im.fit==='contain'?'contain':'cover';
  bi.style.opacity=im.op/100; bi.style.filter=`blur(${im.blur}px) saturate(${im.sat}%)`; bi.style.transform=im.blur?'scale(1.1)':'none';
  $('bgdim').style.background=im.data?`rgba(${av(lv(0)).join(',')},${im.dim/100})`:'none';
  try{ window.api.setTitlebar(P.panel,P.fg); }catch{}
  clearTimeout(gT); gT=setTimeout(()=>{ for(const k in views){ injG(views[k]); injS(views[k]); } injS(cw); sendIcon(); pgRefresh(); },150);
  if(!INC) try{ localStorage.setItem('cb-bg',getComputedStyle(document.body).getPropertyValue('--bg').trim()); }catch{}
}
const SW=[[26,19,7.3],[0,0,3],[220,8,9],[222,45,10],[212,55,12],[185,50,9],[145,35,8],[75,30,8],[285,35,10],[320,40,11],[350,50,10],[12,50,10],[250,40,11],[200,14,12]];
const swCol=c=>c[1]>15?`hsl(${c[0]} ${Math.min(75,Math.round(c[1]*1.3+15))}% 46%)`:`hsl(${c[0]} ${c[1]}% ${Math.round(c[2]*2.2+6)}%)`;   // wyraźna, stała próbka (bez wpływu nasycenia i jasności)
const AC=['#e8825a','#f2b36b','#e5c158','#7fc97f','#4fc3b7','#5aa9e8','#9b8cf0','#e06ba8','#e5534b'];
const FX=[['all','Wszystkie efekty'],['dust','Świecący pył'],['waves','Fale'],['stars','Migoczące gwiazdy'],['aurora','Zorza'],['rain','Deszcz światła']];
const fmt=(p,v)=>{ if(p==='hist.step'){ const d=HSTEPS[v]; return d?t('Dni: {n}').replace('{n}',d):t('Bez limitu'); } if(/^(bg|acc)Adj\./.test(p)) return (v>0?'+':'')+v; if(p==='bg.sat'||p==='bg.bri'){ const d=(v-50)*2; return (d>0?'+':'')+d; } return p.startsWith('bg.')?String(v):p==='img.blur'?v+'px':v+'%'; };
const stp=p=>p==='hist.step'?1:(S.settings.ui.step5?5:1);
const sla=(k,label,val)=>`<div class="sr"><span>${label}<b>${val}</b></span><div class="rg" data-k="${k}"><i class="tr"></i><i class="fl"></i><input type="range" data-a="${k}" min="0" max="255" step="${stp('acc')}" value="${val}"></div></div>`;
const sl=(p,label,min,max,val,kind)=>`<div class="sr"><span>${label}<b>${fmt(p,val)}</b></span><div class="rg" data-k="${kind}"><i class="tr"></i><i class="fl"></i>${kind==='fx'?`<canvas class="mf" data-fx="${p.split('.')[1]}"></canvas>`:''}<input type="range" data-p="${p}" min="${min}" max="${max}" step="${stp(p)}" value="${val}"></div></div>`;
const dispCol=b=>{ const [h,s,l]=calcBg(b); return `hsl(${h} ${s}% ${l*.65+20}%)`; };
function paintSliders(){
  const b=curBg();
  $('set').querySelectorAll('.rg').forEach(g=>{ const i=g.querySelector('input'); g.style.setProperty('--v',(i.value-i.min)/(i.max-i.min)*100);
    const k=g.dataset.k; if(k==='sat'||k==='bri') g.style.setProperty('--g',`linear-gradient(90deg,${[0,25,50,75,100].map(x=>dispCol({...b,[k]:x})).join(',')})`); });
 if(typeof themeRefresh==='function') themeRefresh();
}
function renderSet(){
  const tabFn={keys:renderKeys,ui:renderUi,apps:renderApps,priv:renderPrivTab,hist:renderHistTab,sys:renderSysTab}[setTab];
  if(tabFn) return tabFn();
  const st=S.settings, im=st.img;
  $('set').innerHTML=`<div class="sh"><b>⚙ Ustawienia</b><button id="sx">×</button></div>${tabsHtml()}
  ${themeColorsHtml()}
  ${accentHtml()}
  <h5>EFEKTY TŁA</h5>${FX.map(([k,n])=>sl('fx.'+k,n,0,100,st.fx[k],'fx')).join('')}
  <h5>OBRAZ TŁA</h5><div class="br"><button id="pick">Wybierz obraz…</button>${im.data?'<button id="rmimg">Usuń obraz</button>':''}</div><input type="file" id="fi" accept="image/*" hidden>
  ${im.data?sl('img.op','Krycie obrazu',0,100,im.op,'img')+sl('img.blur','Rozmycie',0,30,im.blur,'img')+sl('img.dim','Przyciemnienie',0,90,im.dim,'img')+sl('img.sat','Nasycenie obrazu',0,200,im.sat,'img')+`<label class="sr"><span>Dopasowanie</span><select data-p="img.fit"><option value="cover" ${im.fit==='cover'?'selected':''}>Wypełnij</option><option value="contain" ${im.fit==='contain'?'selected':''}>Dopasuj</option></select></label>`:''}`;
  paintSliders(); tmSync();
}
function syncAcc(){ const c=unhex(accGet())||[232,130,90]; $('set').querySelectorAll('[data-a]').forEach(i=>{ const v=c['rgb'.indexOf(i.dataset.a)]; i.value=v; i.closest('.sr').querySelector('b').textContent=v; }); const ah=$('ahx'); if(ah&&document.activeElement!==ah) ah.value=accGet(); paintSliders(); }
function syncRgb(){ const b=curBg();
  $('set').querySelectorAll('[data-p^="bg."]').forEach(i=>{ const k=i.dataset.p.slice(3); if('rgb'.includes(k)&&k.length===1){ i.value=b[k]; i.closest('.sr').querySelector('b').textContent=b[k]; } }); }
function holdHue(){ const b=curBg(), q=rgb2hsl(b.r,b.g,b.b); if(q[1]>.5) b.hold=q[0]; }
$('set').addEventListener('input',e=>{
  const t=e.target;
  if(t.dataset.p){ const p=t.dataset.p, v=t.type==='range'?+t.value:t.value; setPath(p,v);
    if(t.type==='range') t.closest('.sr').querySelector('b').textContent=fmt(p,v);
    if(/^bg\.[rgb]$/.test(p)){ holdHue(); const hx=$('hx'); if(hx) hx.value=hex([curBg().r,curBg().g,curBg().b]); }
    paintSliders(); applySettings(); saveSoon(); }
  else if(t.dataset.a){ const c=unhex(accGet())||[232,130,90]; c['rgb'.indexOf(t.dataset.a)]=+t.value; accSet(hex(c)); t.closest('.sr').querySelector('b').textContent=t.value; const ah=$('ahx'); if(ah) ah.value=accGet(); paintSliders(); applySettings(); saveSoon(); }
  else if(t.id==='ahx'){ const c=unhex(t.value); if(c){ accSet(hex(c)); syncAcc(); applySettings(); saveSoon(); } }
  else if(t.id==='hx'){ const c=unhex(t.value); if(c){ const b=curBg(); [b.r,b.g,b.b]=c; holdHue(); syncRgb(); paintSliders(); applySettings(); saveSoon(); } }
});
$('set').addEventListener('change',e=>{ if(e.target.id==='appson'){ S.settings.apps.on=e.target.checked; $('appsad').classList.toggle('open',e.target.checked); renderBar(); save(); } if(e.target.dataset.an){ S.settings.ui.anim[e.target.dataset.an]=e.target.checked; applyUi(); save(); }
  if(e.target.id==='dynicon'){ S.settings.ui.dynicon=e.target.checked; save(); sendIcon(); }
  if(e.target.id==='lng'){ S.settings.ui.lang=e.target.value; save(); setTimeout(()=>location.reload(),150); } if(e.target.id==='adv'){ S.settings.adv=e.target.checked; $('set').querySelector('.ad').classList.toggle('open',e.target.checked); save(); } if(e.target.id==='fi'&&e.target.files[0]) loadImg(e.target.files[0]); });
$('set').addEventListener('click',e=>{
  const t=e.target, d=t.dataset, kbEl=t.closest('[data-kb]');
  if(t.closest('.ap')){ const c=t.closest('.ap'); toggleAdd(c.dataset.ap,c.dataset.add==='1'); }
  else if(t.closest('.seg')&&d.v){ const sg=t.closest('.seg'); S.settings.ui[sg.dataset.seg]=d.v; sg.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b===t)); applyUi(); save(); }
  else if(t.closest('[data-tab]')){ if(recAct) stopRec(); setTab=t.closest('[data-tab]').dataset.tab; renderSet(); $('set').scrollTop=0; }
  else if(kbEl){ if(recAct) stopRec(); startRec(kbEl.dataset.kb); }
  else if(d.kc){ S.settings.keys[d.kc]=''; pushKeys(); save(); renderKeys(); }
  else if(t.id==='rk') ask('Przywrócić domyślne skróty?','Wszystkie skróty klawiszowe wrócą do ustawień fabrycznych.','Przywróć').then(ok=>{ if(ok){ S.settings.keys={...DEF.keys}; pushKeys(); save(); renderKeys(); } });
  else if(d.sw!==undefined){ const c=SW[d.sw], rgb=hsl2rgb(c[0],c[1],c[2]); Object.assign(curBg(),{r:rgb[0],g:rgb[1],b:rgb[2],hold:c[0],sat:50,bri:50}); renderSet(); applySettings(); save(); }
  else if(d.ac){ accSet(d.ac); syncAcc(); applySettings(); save(); }
  else if(t.id==='sx') toggleSet(false);
  else if(t.id==='pick') $('fi').click();
  else if(t.id==='rmimg'){ S.settings.img.data=''; renderSet(); applySettings(); save(); }
  else if(t.id==='ex') exportCfg();
  else if(t.id==='imp') importCfg();
  else if(t.id==='rs') ask('Przywrócić ustawienia domyślne?','Wszystkie ustawienia (motyw, interfejs, aplikacje, historia i skróty) wrócą do wartości fabrycznych. Karty i foldery zostaną bez zmian.','Przywróć').then(ok=>{ if(ok){ S.settings=merge(DEF,{}); renderSet(); applySettings(); pushKeys(); renderBar(); save(); } });
});
function loadImg(file){
  const r=new FileReader();
  r.onload=()=>{ const im=new Image(); im.onload=()=>{
    const k=Math.min(1,1920/Math.max(im.width,im.height)), c=document.createElement('canvas'); c.width=Math.round(im.width*k); c.height=Math.round(im.height*k);
    c.getContext('2d').drawImage(im,0,0,c.width,c.height); S.settings.img.data=c.toDataURL('image/jpeg',.85);
    renderSet(); applySettings(); save(); }; im.src=r.result; };
  r.readAsDataURL(file);
}
const msg=t=>{ const e=$('sst'); if(e) e.textContent=t; };
async function exportCfg(){ try{ const p=await window.api.exportConfig(JSON.stringify({app:'arkana-browser',version:2,settings:S.settings}),t('Zapisz konfigurację')); msg(p?t('Zapisano:')+' '+p:'Anulowano.'); }catch{ msg('Brak obsługi – podmień main.js i preload.js na nowe.'); } }
async function importCfg(){ try{ const txt=await window.api.importConfig(t('Wczytaj konfigurację')); if(!txt) return msg('Anulowano.');
  const o=JSON.parse(txt); if(!o.settings) throw 0; S.settings=merge(DEF,normalize(o.settings)); fixBgs(); GD_(null); renderSet(); applySettings(); pushKeys(); renderBar(); save(); msg('Wczytano konfigurację ✓'); }catch{ msg('Nie udało się wczytać pliku konfiguracji.'); } }
function toggleSet(v){ const o=v===undefined?!$('set').classList.contains('open'):v; if(!o&&recAct) stopRec(); if(o){ toggleCl(false); renderSet(); } $('set').classList.toggle('open',o); }
$('gear').onclick=()=>toggleSet();
document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ if($('cm').classList.contains('open')) closeMenu(); else{ toggleSet(false); toggleCl(false); } } });

// ---------- skróty klawiszowe ----------
const ACT=[
  ['Karty',[['new-tab','Nowa karta'],['close-tab','Zamknij kartę'],['dup-tab','Duplikuj kartę'],['reload-tab','Odśwież kartę'],['pin-tab','Przypnij / odepnij kartę'],['pin-global','Przypnij / odepnij we wszystkich folderach'],['mute-tab','Wycisz / włącz dźwięk karty'],['restore-tab','Przywróć zamkniętą kartę']]],
  ['Wszystkie karty',[['close-all','Zamknij wszystkie karty'],['reload-all','Odśwież wszystkie karty'],['pin-all','Przypnij / odepnij wszystkie'],['mute-all','Wycisz / włącz dźwięk wszystkich']]],
  ['Nawigacja',[['next-tab','Następna karta'],['prev-tab','Poprzednia karta'],['focus-url','Pasek adresu'],['back','Wstecz'],['forward','Dalej'],['go-home','Strona startowa']]],
  ['Foldery',[['new-folder','Nowy folder'],['dup-folder','Duplikuj bieżący folder'],['rename-folder','Zmień nazwę bieżącego folderu'],['next-folder','Następny folder'],['prev-folder','Poprzedni folder']]],
  ['Strona',[['find','Szukaj na stronie'],['zoom-in','Powiększ stronę'],['zoom-out','Pomniejsz stronę'],['zoom-reset','Zresetuj powiększenie'],['print','Drukuj stronę'],['devtools','Narzędzia deweloperskie strony']]],
  ['Interfejs',[['new-window','Nowe okno'],['incognito','Nowe okno incognito'],['settings','Ustawienia'],['toggle-panel','Panel asystenta'],['history','Historia'],['ui-devtools','Narzędzia deweloperskie interfejsu']]]
];
const ANAME=Object.fromEntries(ACT.flatMap(g=>g[1]));
let setTab='theme', recAct=null; const held=new Set(), peak=new Set();
const MODS=['Ctrl','Alt','Shift'];
const NAMES={Comma:',',Period:'.',Slash:'/',Semicolon:';',Quote:"'",BracketLeft:'[',BracketRight:']',Backslash:'\\',Minus:'-',Equal:'=',Backquote:'`',ArrowUp:'↑',ArrowDown:'↓',ArrowLeft:'←',ArrowRight:'→'};
const keyLabel=c=>/^Key[A-Z]$/.test(c)?c[3]:/^Digit\d$/.test(c)?c[5]:NAMES[c]||c;
const modOf=c=>/^Control/.test(c)?'Ctrl':/^Alt/.test(c)?'Alt':/^Shift/.test(c)?'Shift':/^Meta/.test(c)?'Meta':null;
const canon=arr=>{ const x=[...new Set(arr)]; return [...MODS.filter(m=>x.includes(m)),...x.filter(k=>!MODS.includes(k)).sort()]; };
const same=(x,y)=>canon(x).join('+')===canon(y).join('+');
function clash(x,y){
  if(same(x,y)) return true;
  const sub=(p,q)=>{ const mp=p.filter(k=>!MODS.includes(k)); return mp.length>1&&mp.some(k=>same(p.filter(z=>z!==k),q)); };
  return sub(x,y)||sub(y,x);
}
const pushKeys=()=>{ try{ window.api.setKeys(S.settings.keys); }catch{} };
const STABS=[
  ['theme','Motyw','<circle cx="13.5" cy="6.5" r="1"/><circle cx="17.5" cy="10.5" r="1"/><circle cx="8.5" cy="7.5" r="1"/><circle cx="6.5" cy="12.5" r="1"/><path d="M12 2a10 10 0 0 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.3A4.9 4.9 0 0 0 22 10.6C22 5.8 17.5 2 12 2z"/>'],
  ['ui','Interfejs','<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11"/>'],
  ['apps','Aplikacje','<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>'],
  ['priv','Prywatność','<path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z"/><path d="m9 12 2 2 4-4"/>'],
  ['hist','Historia','<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/>'],
  ['keys','Skróty','<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>'],
  ['sys','System','<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>']
];
const tabsHtml=()=>`<div class="stabs">${STABS.map(([k,n,ic])=>`<button data-tab="${k}" class="${setTab===k?'on':''}"><svg viewBox="0 0 24 24">${ic}</svg><span>${n}</span></button>`).join('')}</div>`;
// przyciski myszy w skrótach mają zapis MouseN (3 = środkowy, 4 i 5 = boczne, 6… = kolejne przyciski); tu zamieniamy go na czytelną nazwę
function keyTokLabel(x){ const m=/^Mouse(\d{1,2})$/.exec(x); if(!m) return x; const n=+m[1]; return n===3?t('Mysz: środkowy'):n===4?t('Mysz 4 (wstecz)'):n===5?t('Mysz 5 (dalej)'):t('Mysz {n}').replace('{n}',n); }
const chips=k=>k?k.split('+').map(x=>`<kbd>${esc(keyTokLabel(x))}</kbd>`).join(''):'<em>brak</em>';
function renderKeys(){
  const K=S.settings.keys;
  $('set').innerHTML=`<div class="sh"><b>⚙ Ustawienia</b><button id="sx">×</button></div>${tabsHtml()}
  <p class="hint">Kliknij skrót i naciśnij nową kombinację (do 4 klawiszy naraz). Wymagany jest Ctrl lub Alt albo klawisz F1–F12. Esc anuluje.</p>
  <p class="hint">Możesz też przypisać przycisk myszy: środkowy lub dowolny boczny (lewy i prawy są zablokowane, żeby nie zepsuć nawigacji). Przycisk myszy działa sam, bez żadnego klawisza. Jeśli chcesz wariant z klawiszem, przytrzymaj przy kliknięciu Ctrl, Alt lub Shift.</p>
  ${ACT.map(([g,list])=>`<h5>${g.toUpperCase()}</h5>${list.map(([a,n])=>`<div class="kr"><span>${n}</span><div class="kb${recAct===a?' rec':''}" data-kb="${a}">${recAct===a?'<em>Naciśnij klawisze lub przycisk myszy…</em>':chips(K[a])}</div>${K[a]&&recAct!==a?`<button class="kc" data-kc="${a}" title="Usuń skrót">×</button>`:'<i class="kcs"></i>'}</div>`).join('')}`).join('')}
  <div class="br" style="margin-top:18px"><button id="rk">Przywróć domyślne skróty</button></div><div id="sst"></div>`;
}
function renderUi(){
  const u=S.settings.ui, seg=(k,o)=>`<div class="seg" data-seg="${k}">${o.map(([v,l])=>`<button data-v="${v}" class="${u[k]===v?'on':''}">${l}</button>`).join('')}</div>`;
  $('set').innerHTML=`<div class="sh"><b>⚙ Ustawienia</b><button id="sx">×</button></div>${tabsHtml()}
  <h5>PRZYCISKI OKNA</h5><p class="hint">Minimalizuj, maksymalizuj, zamknij</p>${seg('win',[['win','Windows'],['simple','Prosty'],['fancy','Rozbudowany']])}
  <h5>PRZYCISKI NAWIGACJI</h5><p class="hint">Strzałki, odświeżanie i napis Arkana</p>${seg('nav',[['simple','Prosty'],['fancy','Rozbudowany']])}
  <h5>WYSZUKIWARKA</h5><p class="hint">Używana, gdy w pasku adresu wpiszesz tekst zamiast adresu.</p>
  <div class="sew">${Object.keys(SE).map(k=>`<button class="seb${S.settings.search.engine===k?' on':''}" data-se="${k}">${SE[k].n}</button>`).join('')}<button class="seb${S.settings.search.engine==='custom'?' on':''}" data-se="custom">Własna...</button></div>
  ${S.settings.search.engine==='custom'?`<input id="secust" class="sein${seValid(S.settings.search.custom)?'':' bad'}" placeholder="https://example.com/search?q=%s" value="${esc(S.settings.search.custom||'')}"><p class="hint">Wpisz adres wyszukiwania z %s w miejscu zapytania.</p>`:''}
  <h5>PRZYPIĘTE KARTY</h5><p class="hint">Gdzie wyświetlać przypięte karty. Kartę można przypiąć, przeciągając ją nad wybrany pasek.</p>${seg('pinpos',[['top','Pasek u góry'],['left','Lewy pasek pod folderami']])}
  <h5>IKONA APLIKACJI</h5><label class="ck"><input type="checkbox" id="dynicon" ${u.dynicon!==false?'checked':''}><span class="tg"></span>Ikona aplikacji w kolorach motywu</label>
  <p class="hint">Ikona Arkany na pasku zadań (także przypiętej) przyjmuje kolory motywu. Po wyłączeniu wraca oryginalna ikona. Zmiana działa od razu.</p>
  ${fontSection()}
  <h5>KOLORY STRON</h5>${seg('pgmode',[['theme','Kolor motywu'],['gradient','Gradient kolorów'],['off','Wyłączone']])}
  <p class="hint">Kolor motywu: strony Google (np. wyszukiwarka) przyjmują kolory motywu. Gradient kolorów: Arkana pobiera kolor otwartej strony i płynnie łączy go z kolorem motywu na paskach, tak że granica między interfejsem a stroną znika (na jasnych stronach przejście jest ograniczone, żeby napisy na paskach pozostały czytelne). Wyłączone: strony wyglądają natywnie, a paski mają zwykły kolor motywu.</p>
  <h5>PANELE BOCZNE</h5>
  <label class="ck"><input type="checkbox" id="asstbtn" ${u.asst!==false?'checked':''}><span class="tg"></span>Pokaż przycisk panelu asystenta</label>
  <label class="ck"><input type="checkbox" id="clbtnon" ${u.clb!==false?'checked':''}><span class="tg"></span>Pokaż przycisk ChangeLog</label>
  <p class="hint">Skrót klawiszowy panelu asystenta działa także przy ukrytym przycisku (zakładka Skróty).</p>
  <h5>ANIMACJE</h5><p class="hint">Wyłącz animacje osobno dla każdego miejsca.</p>
  ${[['btn','Przyciski'],['fold','Foldery'],['tab','Karty'],['panel',"Panel asystenta"],['boot','Uruchamianie przeglądarki'],['bootsnd','Dźwięk uruchamiania']].map(([k,n])=>`<label class="ck"><input type="checkbox" data-an="${k}" ${u.anim[k]?'checked':''}><span class="tg"></span>${n}</label>`).join('')}
  <h5>SUWAKI</h5><label class="ck"><input type="checkbox" id="st5" ${u.step5?'checked':''}><span class="tg"></span>Suwaki przesuwają się co 5</label><p class="hint">Wszystkie suwaki w ustawieniach zmieniają wartość o 5 zamiast o 1 (np. efekty tła o 5%).</p>`;
  paintSliders();
}

function renderHistTab(){
  $('set').innerHTML=`<div class="sh"><b>⚙ Ustawienia</b><button id="sx">×</button></div>${tabsHtml()}
  <h5 id="hsec">ZAPISYWANIE HISTORII</h5><label class="ck"><input type="checkbox" id="hon" ${S.settings.hist.on?'checked':''}><span class="tg"></span>Zapisuj historię przeglądania</label>
  ${sl('hist.step','Przechowuj historię',0,10,S.settings.hist.step,'hist')}<p class="hint">Starsze wpisy są usuwane automatycznie.</p>
  <h5>STRONY POMIJANE</h5><div class="hk"><input id="hkin" placeholder="np. google.com lub zwierzaki" autocomplete="off" spellcheck="false"><button id="hkadd">Dodaj</button></div><div id="hkl">${hkChips()}</div>
  <p class="hint">Wpis z kropką, ukośnikiem lub „www” pasuje do całego adresu (np. www.google.com). Samo słowo (np. zwierzaki) pasuje tylko do nazwy strony przed końcówką .com, .pl itd. Pasujące wejścia nie są zapisywane, a istniejące zostają usunięte. Dotyczy to także haseł wyszukiwanych w Google.</p>`;
  paintSliders();
}

function renderSysTab(){
  const u=S.settings.ui;
  $('set').innerHTML=`<div class="sh"><b>⚙ Ustawienia</b><button id="sx">×</button></div>${tabsHtml()}
  <h5>JĘZYK</h5>${langPicker(u.lang)}<p class="hint">Zmiana języka odświeża interfejs.</p><p class="hint">Morse i Braille zamieniają tekst interfejsu w danym języku na kod (uproszczone tabele, bez skrótów). Dotyczy tylko interfejsu Arkany, nie stron internetowych. Zmiana odświeża aplikację.</p>
  <h5>AKTUALIZACJE</h5><div id="updbox"></div>
  <label class="ck"><input type="checkbox" id="upauto" ${S.settings.upd.auto?'checked':''}><span class="tg"></span>Sprawdzaj aktualizacje automatycznie</label>
  <label class="ck"><input type="checkbox" id="updl" ${S.settings.upd.dl?'checked':''}><span class="tg"></span>Pobieraj aktualizacje automatycznie</label>
  <p class="hint">Aktualizacje pochodzą z oficjalnych wydań projektu na GitHubie. Pobrane pliki są weryfikowane sumą SHA-512, a zainstalowana aktualizacja uruchamia się przy zamknięciu przeglądarki lub od razu na życzenie.</p>
  <h5>IMPORT Z INNEJ PRZEGLĄDARKI</h5><p class="hint">Zakładki, historia i ciasteczka z Chrome, Edge, Firefoksa, Opery, Brave i Vivaldi lub z pliku zakładek.</p><div class="br"><button id="impopen">Importuj dane...</button></div>
  <h5>PRZEGLĄDARKA DOMYŚLNA</h5><p class="hint" id="defst"></p><p class="hint" id="defhint"></p><div class="br"><button id="defset">Ustaw Arkanę jako domyślną</button></div>
  <h5>PORADNIK</h5><p class="hint">Krótki przewodnik po najważniejszych miejscach interfejsu. Sam pokazuje się tylko przy pierwszym uruchomieniu.</p><div class="br"><button id="tourbtn">Pokaż poradnik ponownie</button></div>
  <h5>KONFIGURACJA</h5><div class="br"><button id="ex">Zapisz do pliku…</button><button id="imp">Wczytaj z pliku…</button><button id="rs">Domyślne</button></div><p class="hint">Zapis i wczytanie obejmują wszystkie ustawienia, ale nie karty i foldery.</p><div id="sst"></div>
  <h5>O PROGRAMIE</h5>
  <p class="hint">Arkana Browser ${UPD.cur?'v'+UPD.cur:VERSION}</p>`;
  paintSliders(); updPaint(); defPaint();
}
function applyUi(){
  const u=S.settings.ui, c=document.body.classList;
  c.toggle('inc',INC); c.toggle('pinl',u.pinpos==='left');
  if(applyUi.pp!==undefined&&applyUi.pp!==u.pinpos&&S.cur) renderTabs(); applyUi.pp=u.pinpos;
  ['win','simple','fancy'].forEach(m=>c.toggle('wb-'+m,u.win===m)); ['simple','fancy'].forEach(m=>c.toggle('nb-'+m,u.nav===m));
  c.toggle('round',!!u.round); c.toggle('no-asst',u.asst===false); c.toggle('no-cl',u.clb===false); c.toggle('na-btn',!u.anim.btn); arkRotTick(); arkRotKick(); c.toggle('na-fold',!u.anim.fold); c.toggle('na-tab',!u.anim.tab); c.toggle('na-panel',!u.anim.panel); c.toggle('na-apps',!u.anim.apps);
  const ws=document.querySelectorAll('.aw'); if(ws.length){ ws.forEach(w=>{ w.__rs=0; place(w,rectOf(w)); roundSync(w); }); updateContacts(); }
  applyPgfx(); applyFont();
}
function startRec(a){ recAct=a; held.clear(); peak.clear(); try{ window.api.pauseKeys(true); }catch{} renderKeys(); }
function stopRec(){ recAct=null; held.clear(); peak.clear(); try{ window.api.pauseKeys(false); }catch{} }
document.addEventListener('keydown',e=>{
  if(!recAct) return; e.preventDefault(); e.stopPropagation(); if(e.repeat) return;
  const m=modOf(e.code); if(m==='Meta') return; const lab=m||keyLabel(e.code);
  if(e.code==='Escape'&&!peak.size){ stopRec(); renderKeys(); return; }
  if(peak.size>=4&&!peak.has(lab)){ msg('Maksymalnie 4 klawisze naraz.'); return; }
  held.add(lab); peak.add(lab);
},true);
document.addEventListener('keyup',e=>{
  if(!recAct) return; e.preventDefault(); held.delete(modOf(e.code)||keyLabel(e.code));
  if(!held.size&&peak.size) finishRec();
},true);
// ---- przycisk myszy jako skrót (środkowy lub boczny; lewy i prawy zablokowane) ----
const mouseNumOf=b=>b===1?3:b===3?4:b===4?5:b+1;   // numer przycisku DOM -> numer jak w grach (lewy i prawy tu nie trafiają)
let recMouseT=0, recMouseB=-1;
document.addEventListener('mousedown',e=>{
  if(!recAct) return;
  if(e.button===0||e.button===2){ if(e.target.closest&&e.target.closest('.kb.rec')){ e.preventDefault(); e.stopPropagation(); msg('Lewego i prawego przycisku myszy nie można przypisać do skrótu.'); } return; }
  e.preventDefault(); e.stopPropagation(); recMouseT=Date.now(); recMouseB=e.button;
  finishMouseRec(mouseNumOf(e.button),e);
},true);
const swallowRec=e=>{ if(recMouseB===e.button&&Date.now()-recMouseT<1500){ e.preventDefault(); e.stopPropagation(); } };
document.addEventListener('mouseup',swallowRec,true); document.addEventListener('auxclick',swallowRec,true);
document.addEventListener('contextmenu',e=>{ if(recAct&&e.target.closest&&e.target.closest('.kb.rec')) e.preventDefault(); },true);
async function finishMouseRec(n,e){
  const a=recAct, K=S.settings.keys, extra=[...peak].filter(x=>!MODS.includes(x));
  const mods=MODS.filter(m=>peak.has(m)||(m==='Ctrl'&&e.ctrlKey)||(m==='Alt'&&e.altKey)||(m==='Shift'&&e.shiftKey));
  stopRec();
  if(n>64||extra.length){ renderKeys(); return msg('Do przycisku myszy można dodać tylko Ctrl, Alt lub Shift.'); }
  const str=[...mods,'Mouse'+n].join('+');
  const other=Object.keys(K).find(b=>b!==a&&K[b]===str);
  if(other){ const ok=await ask('Ten skrót jest już używany',t('Kombinacja {k} jest przypisana do opcji „{a}”. Przypisanie jej tutaj usunie ją z tamtej opcji.').replace('{k}',str.split('+').map(keyTokLabel).join('+')).replace('{a}',t(ANAME[other]||other)),'Przypisz tutaj'); if(!ok){ renderKeys(); return; } K[other]=''; }
  K[a]=str; pushKeys(); save(); renderKeys();
}
async function finishRec(){
  const a=recAct, combo=canon([...peak]), mods=combo.filter(x=>MODS.includes(x)), main=combo.filter(x=>!MODS.includes(x)), str=combo.join('+'), K=S.settings.keys;
  stopRec();
  if(!main.length||!(mods.includes('Ctrl')||mods.includes('Alt')||main.some(x=>/^F\d{1,2}$/.test(x)))){ renderKeys(); return msg('Skrót musi zawierać klawisz z Ctrl lub Alt (albo F1–F12).'); }
  const reserved=['Ctrl+C','Ctrl+V','Ctrl+X','Ctrl+A','Ctrl+Z','Ctrl+Y'].includes(str), altgr=mods.length===2&&mods.includes('Ctrl')&&mods.includes('Alt')&&main.length===1&&'ACELNOSXZ'.includes(main[0]);
  if(reserved||altgr){ renderKeys(); await ask('Ta kombinacja jest zarezerwowana',(reserved?t('{k} służy do kopiowania, wklejania i cofania w polach tekstowych. Wybierz inną kombinację.'):t('{k} to AltGr+{x}, czyli polskie znaki. Wybierz inną kombinację.')).replace('{k}',str).replace('{x}',main[0]),'Rozumiem'); return; }
  const other=Object.keys(K).find(b=>b!==a&&K[b]&&clash(K[b].split('+'),combo));
  if(other){ const ok=await ask('Ten skrót jest już używany',t('Kombinacja {k} jest przypisana do opcji „{a}”. Przypisanie jej tutaj usunie ją z tamtej opcji.').replace('{k}',str).replace('{a}',t(ANAME[other]||other)),'Przypisz tutaj'); if(!ok){ renderKeys(); return; } K[other]=''; }
  K[a]=str; pushKeys(); save(); renderKeys();
}

// ---------- animacje wewnątrz suwaków efektów ----------
const hh=i=>{ const x=Math.sin(i*12.9898)*43758.5453; return x-Math.floor(x); };
function drawMini(g,fx,w,h,v,t){
  const A=accRgb, B=acc2Rgb, F=fgRgb;
  const dust=()=>{ const n=4+Math.round(v*w/10), sB=glowSp(B,32), sF=glowSp(F,32); for(let i=0;i<n;i++){ const x=hh(i+1)*w, y=h+3-((t*.012*(.5+hh(i+2))+hh(i+3)*h*3)%(h+6)), r=(1+hh(i+4)*1.6)*2.6, al=(.35+.55*hh(i+5))*(.4+.6*v);
    g.globalAlpha=al; g.drawImage(i%2?sB:sF,x-r,y-r,2*r,2*r); } g.globalAlpha=1; };   // tekstura poświaty (gradient od pełnego koloru do przezroczystości) z przezroczystością al = ten sam wygląd co gradient na cząstkę
  const waves=()=>{ for(let k=0;k<2;k++){ g.beginPath(); g.moveTo(0,h); for(let x=0;x<=w;x+=4) g.lineTo(x,h*(.62+.14*k)+Math.sin(x*.07+t*.003*(1+k*.4)+k*2)*h*(.1+.22*v)); g.lineTo(w,h); g.closePath(); g.fillStyle=`rgba(${k?B:A},${.3+.3*v})`; g.fill(); } };
  const stars=()=>{ const n=3+Math.round(v*w/8); for(let i=0;i<n;i++){ g.fillStyle=`rgba(${F},${(.2+.8*Math.abs(Math.sin(t*.003*(.5+hh(i+3))+i)))*(.4+.6*v)})`; g.beginPath(); g.arc(hh(i)*w,hh(i+9)*h,.7+hh(i+2)*.6,0,6.283); g.fill(); } };
  const aurora=()=>{ for(let k=0;k<3;k++){ const x=w*(.15+.3*k+.12*Math.sin(t*.0008+k*2)), c=[A,B,F][k], gr=g.createRadialGradient(x,h/2,0,x,h/2,h*2.2); gr.addColorStop(0,`rgba(${c},${.3+.45*v})`); gr.addColorStop(1,`rgba(${c},0)`); g.fillStyle=gr; g.fillRect(0,0,w,h); } };
  const rain=()=>{ const n=3+Math.round(v*w/9); g.lineWidth=1; g.strokeStyle=`rgba(${B},${.4+.5*v})`; for(let i=0;i<n;i++){ const x=hh(i)*w, y=((t*.05*(.6+hh(i+1))+hh(i+2)*h*3)%(h+8))-4; g.beginPath(); g.moveTo(x,y); g.lineTo(x,y+5); g.stroke(); } };
  ({dust,waves,stars,aurora,rain,all:()=>{ aurora(); waves(); dust(); }})[fx]();
}
function mini(t){
  mini.r=0; if(!$('set').classList.contains('open')||document.hidden) return;   // ustawienia zamknięte: pętla stoi (wznawia ją otwarcie ustawień)
  mini.r=requestAnimationFrame(mini); if(!fr30(mini,t)) return; mini.l=t;
  $('set').querySelectorAll('.rg .fl:not(.plsoff)').forEach(plsPhase);   // pulsowanie suwaków w tym samym rytmie co podglądy (animacja CSS wstrzymana, klatkę wybiera opóźnienie)
  const sr=$('set').getBoundingClientRect();
  $('set').querySelectorAll('canvas.mf').forEach(c=>{
    const cr=c.getBoundingClientRect(); if(cr.bottom<sr.top||cr.top>sr.bottom) return;   // podgląd przewinięty poza widoczną część panelu: nie rysujemy (dorysuje się po przewinięciu)
    const w=c.clientWidth, h=c.clientHeight; if(c.width!==w) c.width=w; if(c.height!==h) c.height=h;
    const g=c.getContext('2d'); g.clearRect(0,0,w,h); const v=c.parentElement.querySelector('input').value/100; if(v<=0) return;
    g.save(); g.beginPath(); g.roundRect(0,0,w*v,h,9); g.clip(); drawMini(g,c.dataset.fx,w,h,v,t); g.restore(); });
}
const miniKick=()=>{ if(!mini.r) mini.r=requestAnimationFrame(mini); };
// Pulsowanie wypełnienia suwaków (animacja pls, 2,4 s). Pomiar: dowolna animacja CSS w 60 kl./s zmusza okno do składania całego obrazu 60 razy na sekundę
// (ok. 25–30% rdzenia), niezależnie od liczby suwaków. Dlatego w ustawieniach animacja jest wstrzymana (css/app.css), a jej klatkę wybiera ujemne opóźnienie
// ustawiane w pętli podglądów (30 kl./s): przeglądarka sama liczy wartość z tych samych klatek kluczowych i krzywej ease-in-out, a wolna zmiana jasności
// wygląda tak samo. Suwaki przewinięte poza widoczną część panelu nie są animowane wcale. Faza = wspólny zegar (czas mod 2,4 s), więc wszystkie pulsują równo.
let plsIO=null;
const plsPhase=f=>{ f.style.animationDelay=(-(performance.now()%2400)).toFixed(0)+'ms'; };
function plsWatch(){ try{ if(!plsIO) plsIO=new IntersectionObserver(es=>es.forEach(e=>{ const f=e.target; if(e.isIntersecting){ if(f.classList.contains('plsoff')){ plsPhase(f); f.classList.remove('plsoff'); } } else f.classList.add('plsoff'); }),{root:$('set')});
  $('set').querySelectorAll('.rg .fl').forEach(f=>{ if(f._pw) return; f._pw=1; plsPhase(f); plsIO.observe(f); }); }catch{} }
new MutationObserver(plsWatch).observe($('set'),{childList:true,subtree:true});
miniKick(); new MutationObserver(miniKick).observe($('set'),{attributes:true,attributeFilter:['class']}); document.addEventListener('visibilitychange',miniKick);


// ===== src/js/10-app-gejos.js =====
// ---------- aplikacja: Gejos.exe ----------
const GJ={S:56,PAD:16,FL:26,MAXIMG:10,G:1500,DT:1/120,IT:10,K:420,C:34};
const GJ_DIG=[   // własna, szeroka czcionka cyfr: łamane w kwadracie 0..1 (rysowane grubą kreską z zaokrągleniami)
 [[[0,0],[1,0],[1,1],[0,1],[0,0]]],
 [[[.1,.26],[.55,0],[.55,1]],[[.05,1],[1,1]]],
 [[[0,0],[1,0],[1,.5],[0,.5],[0,1],[1,1]]],
 [[[0,0],[1,0],[1,1],[0,1]],[[.25,.5],[1,.5]]],
 [[[0,0],[0,.55],[1,.55]],[[.75,0],[.75,1]]],
 [[[1,0],[0,0],[0,.5],[1,.5],[1,1],[0,1]]],
 [[[1,0],[0,0],[0,1],[1,1],[1,.5],[0,.5]]],
 [[[0,0],[1,0],[.4,1]]],
 [[[0,0],[1,0],[1,1],[0,1],[0,0]],[[0,.5],[1,.5]]],
 [[[1,.5],[0,.5],[0,0],[1,0],[1,1],[0,1]]]];
// --- silnik fizyki: sztywne kwadraty (port idei Box2D-Lite: SAT + obcinanie, impulsy sekwencyjne z ciepłym startem) ---
let GJ_ID=1;
function gjBox(x,y,hw,hh,st){ return {id:GJ_ID++,x,y,r:0,vx:0,vy:0,w:0,hw,hh,st:!!st,im:st?0:1,ii:st?0:3/(hw*hw+hh*hh),fr:st?.7:.5,e:st?.5:.35,ent:false,age:0,gate:false,img:null,sp:null,sk:'',sl:false}; }
const gjFlip=f=>((f&0xF)<<8)|((f&0xF00)>>8)|((f&0xF0)<<8)|((f&0xF000)>>8);
function gjIn(hx,hy,x,y,r,nx,ny){
  const c=Math.cos(r), s=Math.sin(r), lx=-(c*nx+s*ny), ly=-(-s*nx+c*ny), E=(a,b)=>(a<<8)|(b<<12); let v;
  if(Math.abs(lx)>Math.abs(ly)){ v=lx>0?[[hx,-hy,E(3,4)],[hx,hy,E(4,1)]]:[[-hx,hy,E(1,2)],[-hx,-hy,E(2,3)]]; }
  else { v=ly>0?[[hx,hy,E(4,1)],[-hx,hy,E(1,2)]]:[[-hx,-hy,E(2,3)],[hx,-hy,E(3,4)]]; }
  return v.map(p=>({x:x+c*p[0]-s*p[1],y:y+s*p[0]+c*p[1],fp:p[2]}));
}
function gjClip(vin,nx,ny,off,edge){
  const out=[], a=vin[0], b=vin[1], d0=nx*a.x+ny*a.y-off, d1=nx*b.x+ny*b.y-off;
  if(d0<=0) out.push(a); if(d1<=0) out.push(b);
  if(d0*d1<0){ const k=d0/(d0-d1), p={x:a.x+k*(b.x-a.x),y:a.y+k*(b.y-a.y),fp:0}; p.fp=d0>0?((a.fp&~0x0F0F)|edge):((b.fp&~0xF0F0)|(edge<<4)); out.push(p); }
  return out;
}
function gjCollide(A,B){
  const cA=Math.cos(A.r), sA=Math.sin(A.r), cB=Math.cos(B.r), sB=Math.sin(B.r), dx=B.x-A.x, dy=B.y-A.y;
  const dAx=cA*dx+sA*dy, dAy=-sA*dx+cA*dy, dBx=cB*dx+sB*dy, dBy=-sB*dx+cB*dy, cc=Math.abs(cA*cB+sA*sB), ss=Math.abs(cA*sB-sA*cB);
  const fAx=Math.abs(dAx)-A.hw-(cc*B.hw+ss*B.hh), fAy=Math.abs(dAy)-A.hh-(ss*B.hw+cc*B.hh); if(fAx>0||fAy>0) return null;
  const fBx=Math.abs(dBx)-(cc*A.hw+ss*A.hh)-B.hw, fBy=Math.abs(dBy)-(ss*A.hw+cc*A.hh)-B.hh; if(fBx>0||fBy>0) return null;
  let axis=0, sep=fAx, nx=dAx>0?cA:-cA, ny=dAx>0?sA:-sA; const RT=.95, AT=.01;
  if(fAy>RT*sep+AT*A.hh){ axis=1; sep=fAy; nx=dAy>0?-sA:sA; ny=dAy>0?cA:-cA; }
  if(fBx>RT*sep+AT*B.hw){ axis=2; sep=fBx; nx=dBx>0?cB:-cB; ny=dBx>0?sB:-sB; }
  if(fBy>RT*sep+AT*B.hh){ axis=3; sep=fBy; nx=dBy>0?-sB:sB; ny=dBy>0?cB:-cB; }
  let fnx,fny,front,snx,sny,side,negSide,posSide,negE,posE,inc;
  if(axis===0){ fnx=nx; fny=ny; front=A.x*fnx+A.y*fny+A.hw; snx=-sA; sny=cA; side=A.x*snx+A.y*sny; negSide=-side+A.hh; posSide=side+A.hh; negE=3; posE=1; inc=gjIn(B.hw,B.hh,B.x,B.y,B.r,fnx,fny); }
  else if(axis===1){ fnx=nx; fny=ny; front=A.x*fnx+A.y*fny+A.hh; snx=cA; sny=sA; side=A.x*snx+A.y*sny; negSide=-side+A.hw; posSide=side+A.hw; negE=2; posE=4; inc=gjIn(B.hw,B.hh,B.x,B.y,B.r,fnx,fny); }
  else if(axis===2){ fnx=-nx; fny=-ny; front=B.x*fnx+B.y*fny+B.hw; snx=-sB; sny=cB; side=B.x*snx+B.y*sny; negSide=-side+B.hh; posSide=side+B.hh; negE=3; posE=1; inc=gjIn(A.hw,A.hh,A.x,A.y,A.r,fnx,fny); }
  else { fnx=-nx; fny=-ny; front=B.x*fnx+B.y*fny+B.hh; snx=cB; sny=sB; side=B.x*snx+B.y*sny; negSide=-side+B.hw; posSide=side+B.hw; negE=2; posE=4; inc=gjIn(A.hw,A.hh,A.x,A.y,A.r,fnx,fny); }
  const p1=gjClip(inc,-snx,-sny,negSide,negE); if(p1.length<2) return null;
  const p2=gjClip(p1,snx,sny,posSide,posE); if(p2.length<2) return null;
  const out=[]; for(const p of p2){ const s=fnx*p.x+fny*p.y-front; if(s<=0) out.push({x:p.x-s*fnx,y:p.y-s*fny,sep:s,nx,ny,fp:axis>=2?gjFlip(p.fp):p.fp,Pn:0,Pt:0}); }
  return out.length?out:null;
}
function gjWorld(){
  const wd={bodies:[],walls:[],arbs:new Map()};
  wd.step=function(dt,force){
    const bs=this.bodies, ws=this.walls, live=new Set(), pair=(A,B)=>{
      if(A.id>B.id){ const q=A; A=B; B=q; } const key=A.id*100000+B.id, cs=gjCollide(A,B);
      if(cs){ let ar=this.arbs.get(key); if(!ar){ ar={A,B,c:cs,fr:0}; this.arbs.set(key,ar); } else { for(const n of cs){ const o=ar.c.find(c=>c.fp===n.fp); if(o){ n.Pn=o.Pn; n.Pt=o.Pt; } } ar.c=cs; } live.add(key); } };
    for(let i=0;i<bs.length;i++){ const A=bs[i];
      for(let j=i+1;j<bs.length;j++){ const B=bs[j], dx=A.x-B.x, dy=A.y-B.y, rr=(A.hw+B.hw)*1.43; if(dx*dx+dy*dy<=rr*rr) pair(A,B); }
      for(const wl of ws){ if(wl.gate&&!A.ent) continue; pair(A,wl); } }
    for(const k of [...this.arbs.keys()]) if(!live.has(k)) this.arbs.delete(k);
    for(const b of bs){ b.vy+=GJ.G*dt; if(force) force(b,dt); b.vx/=1+dt*.04; b.vy/=1+dt*.04; b.w/=1+dt*.9; }
    const inv=1/dt;
    for(const ar of this.arbs.values()){ const A=ar.A, B=ar.B, e=(A.e+B.e)/2; ar.fr=Math.sqrt(A.fr*B.fr);
      for(const c of ar.c){
        const r1x=c.x-A.x, r1y=c.y-A.y, r2x=c.x-B.x, r2y=c.y-B.y, rn1=r1x*c.nx+r1y*c.ny, rn2=r2x*c.nx+r2y*c.ny, tx=c.ny, ty=-c.nx, rt1=r1x*tx+r1y*ty, rt2=r2x*tx+r2y*ty;
        c.r1x=r1x; c.r1y=r1y; c.r2x=r2x; c.r2y=r2y;
        c.mN=1/(A.im+B.im+A.ii*(r1x*r1x+r1y*r1y-rn1*rn1)+B.ii*(r2x*r2x+r2y*r2y-rn2*rn2));
        c.mT=1/(A.im+B.im+A.ii*(r1x*r1x+r1y*r1y-rt1*rt1)+B.ii*(r2x*r2x+r2y*r2y-rt2*rt2));
        c.bias=Math.min(400,-.2*inv*Math.min(0,c.sep+.5));
        const dvx=B.vx-B.w*r2y-A.vx+A.w*r1y, dvy=B.vy+B.w*r2x-A.vy-A.w*r1x, vn=dvx*c.nx+dvy*c.ny; c.bounce=vn<-90?-e*vn:0;
        const Px=c.Pn*c.nx+c.Pt*tx, Py=c.Pn*c.ny+c.Pt*ty;
        A.vx-=A.im*Px; A.vy-=A.im*Py; A.w-=A.ii*(r1x*Py-r1y*Px); B.vx+=B.im*Px; B.vy+=B.im*Py; B.w+=B.ii*(r2x*Py-r2y*Px); } }
    for(let it=0;it<GJ.IT;it++) for(const ar of this.arbs.values()){ const A=ar.A, B=ar.B;
      for(const c of ar.c){
        let dvx=B.vx-B.w*c.r2y-A.vx+A.w*c.r1y, dvy=B.vy+B.w*c.r2x-A.vy-A.w*c.r1x;
        const vn=dvx*c.nx+dvy*c.ny; let dPn=c.mN*(-vn+Math.max(c.bias,c.bounce)); const P0=c.Pn; c.Pn=Math.max(P0+dPn,0); dPn=c.Pn-P0;
        let Px=dPn*c.nx, Py=dPn*c.ny;
        A.vx-=A.im*Px; A.vy-=A.im*Py; A.w-=A.ii*(c.r1x*Py-c.r1y*Px); B.vx+=B.im*Px; B.vy+=B.im*Py; B.w+=B.ii*(c.r2x*Py-c.r2y*Px);
        dvx=B.vx-B.w*c.r2y-A.vx+A.w*c.r1y; dvy=B.vy+B.w*c.r2x-A.vy-A.w*c.r1x;
        const tx=c.ny, ty=-c.nx, vt=dvx*tx+dvy*ty, mx=ar.fr*c.Pn, T0=c.Pt; c.Pt=Math.max(-mx,Math.min(mx,T0+c.mT*(-vt))); const dPt=c.Pt-T0; Px=dPt*tx; Py=dPt*ty;
        A.vx-=A.im*Px; A.vy-=A.im*Py; A.w-=A.ii*(c.r1x*Py-c.r1y*Px); B.vx+=B.im*Px; B.vy+=B.im*Py; B.w+=B.ii*(c.r2x*Py-c.r2y*Px); } }
    for(const b of bs){ const sp=Math.hypot(b.vx,b.vy); if(sp>2600){ b.vx*=2600/sp; b.vy*=2600/sp; } b.x+=dt*b.vx; b.y+=dt*b.vy; b.r+=dt*b.w; }
  };
  return wd;
}
function gjSprite(img,dpr,fit,tile){   // kostka: zdjęcie na całej ściance + delikatna poświata przy krawędziach; bez zdjęcia ciemny środek z poświatą
  const s=GJ.S, z=s+GJ.PAD*2, c=document.createElement('canvas'); c.width=c.height=Math.ceil(z*dpr); const g=c.getContext('2d'); g.scale(dpr,dpr); g.translate(z/2,z/2); g.imageSmoothingQuality='high';
  const rr=i=>{ g.beginPath(); g.roundRect(-s/2+i,-s/2+i,s-2*i,s-2*i,Math.max(2,s*.24-i)); }, A=accRgb, ok=img&&img.complete&&img.naturalWidth;
  rr(0); g.shadowColor=`rgba(${A},.4)`; g.shadowBlur=13; g.fillStyle=P.bg; g.fill(); g.shadowBlur=0;
  g.save(); rr(0); g.clip();
  if(ok){ const iw=img.naturalWidth, ih=img.naturalHeight, m=Math.min(iw,ih), sx=(iw-m)/2, sy=(ih-m)/2;
    if(fit==='stretch') g.drawImage(img,-s/2,-s/2,s,s);
    else if(fit==='tile'){ const n=Math.min(6,Math.max(2,tile|0||3)), cs=s/n; for(let a=0;a<n;a++) for(let b=0;b<n;b++) g.drawImage(img,sx,sy,m,m,-s/2+a*cs,-s/2+b*cs,cs+.5,cs+.5); }
    else g.drawImage(img,sx,sy,m,m,-s/2,-s/2,s,s);
    const gr=g.createRadialGradient(0,0,s*.25,0,0,s*.75); gr.addColorStop(0,`rgba(${A},0)`); gr.addColorStop(1,`rgba(${A},.30)`); g.fillStyle=gr; g.fillRect(-s,-s,2*s,2*s); }
  else { const gr=g.createRadialGradient(0,0,0,0,0,s*.75); gr.addColorStop(0,'rgba(0,0,0,.45)'); gr.addColorStop(.5,`rgba(${A},.10)`); gr.addColorStop(1,`rgba(${A},.36)`); g.fillStyle=gr; g.fillRect(-s,-s,2*s,2*s); }
  g.lineWidth=ok?7:9; g.strokeStyle=`rgba(${A},${ok?.38:.34})`; g.shadowColor=`rgba(${A},.7)`; g.shadowBlur=12; rr(0); g.stroke(); g.restore();
  g.shadowBlur=0; g.lineWidth=1.5; g.strokeStyle=`rgba(${A},.85)`; rr(.75); g.stroke();
  if(!ok){ g.lineCap='round'; g.lineWidth=3; g.strokeStyle=`rgba(${acc2Rgb},.85)`; for(let k=0;k<8;k++){ g.rotate(Math.PI/4); g.beginPath(); g.moveTo(0,-5); g.lineTo(0,k%2?-11:-16); g.stroke(); } }
  return c;
}
function gjNum(g,W,fy,n){   // wynik w tle: cyfry są tym mniejsze, im więcej ich jest
  const s=String(n), c=s.length, asp=.7, gp=.24; let h=Math.min(fy*.62*Math.pow(.8,c-1),(W*.9)/(c*asp+(c-1)*gp*asp)); h=Math.max(10,h);
  const dw=h*asp, tw=c*dw+(c-1)*dw*gp, lw=h*.15, x0=(W-tw)/2+lw/2, y0=(fy-h)/2+lw/2, ww=dw-lw, hh=h-lw;
  g.save(); g.strokeStyle=`rgba(${fgRgb},.075)`; g.lineWidth=lw; g.lineJoin='round'; g.lineCap='round';
  for(let i=0;i<c;i++){ const ox=x0+i*dw*(1+gp); g.beginPath(); for(const pl of GJ_DIG[+s[i]]) pl.forEach((p,k)=>{ const X=ox+p[0]*ww, Y=y0+p[1]*hh; k?g.lineTo(X,Y):g.moveTo(X,Y); }); g.stroke(); }
  g.restore();
}
async function gjToIcon(f){   // dowolny obraz czytelny dla przeglądarki; reszta (TIFF, HEIC…) przez ffmpeg, jeśli jest
  let src=null;
  try{ src=await createImageBitmap(f); }catch{}
  if(!src){ try{ const im=new Image(); im.src=URL.createObjectURL(f); await im.decode(); src=im; }catch{} }
  if(!src&&window.api&&window.api.filePath&&window.api.ffRun){ try{ const p=window.api.filePath(f); if(p){ const x=await window.api.ffRun({id:'gj'+uid(),inPath:p,key:'png',ext:'png',read:true,opts:{}}); if(x&&x.ok&&x.data) src=await createImageBitmap(new Blob([new Uint8Array(x.data)],{type:'image/png'})); } }catch{} }
  if(!src) throw new Error('img');
  const W=src.width||src.naturalWidth||256, H=src.height||src.naturalHeight||256, k=Math.min(1,256/Math.max(W,H)), c=document.createElement('canvas'); c.width=Math.max(1,Math.round(W*k)); c.height=Math.max(1,Math.round(H*k));
  c.getContext('2d').drawImage(src,0,0,c.width,c.height);
  let u=c.toDataURL('image/webp',.9); if(!u.startsWith('data:image/webp')) u=c.toDataURL('image/png'); return u;
}
function mountGej(el,w){
  const D=(S.aw.data.gej=S.aw.data.gej||{score:0,best:0,imgs:[]}); D.imgs=D.imgs||[]; D.score=D.score|0; D.best=Math.max(D.best|0,D.score); D.fit=['crop','stretch','tile'].includes(D.fit)?D.fit:'crop'; D.tile=Math.min(6,Math.max(2,D.tile|0||3)); D.size=Math.min(72,Math.max(44,D.size|0||56)); GJ.S=D.size;
  el.innerHTML=`<div class="gj"><canvas class="gjc"></canvas><button class="gjm" title="Ustawienia aplikacji"><i></i></button><div class="gjp">
    <div class="gjs"><span>Wynik</span><b class="gjsc"></b></div><div class="gjs"><span>Rekord</span><b class="gjbs"></b></div>
    <button class="gjbt" data-a="all">Zniszcz wszystkie</button><button class="gjbt" data-a="reset">Zeruj wynik</button>
    <div class="gjs"><span>Grafiki kostek</span><b class="gjn"></b></div><div class="gjth"></div>
    <button class="gjbt" data-a="add">Dodaj zdjęcia</button><div class="gjs"><span>Dopasowanie zdjęć</span></div><div class="gjseg"><button data-f="crop">Przytnij</button><button data-f="stretch">Rozciągnij</button><button data-f="tile">Kafelek</button></div>
    <div class="gjtl"><span class="gjtn"></span><input type="range" class="gjtr" min="2" max="6" step="1"></div>
    <div class="gjs"><span>Rozmiar kostek</span><b class="gjsz"></b></div><input type="range" class="gjzr" min="44" max="72" step="2">
    <p class="gjhint">Nowe kostki losują jedną z tych grafik.</p>
    <input type="file" accept="image/*,.tif,.tiff,.heic,.heif,.tga,.pcx,.jp2,.avif,.ico,.jfif" multiple hidden></div></div>`;
  const root=el.querySelector('.gj'), cv=root.querySelector('.gjc'), g=cv.getContext('2d'), pn=root.querySelector('.gjp'), fi=root.querySelector('input[type=file]'), q=s=>root.querySelector(s);
  const wd=gjWorld(), wl={L:gjBox(0,0,200,2000,1),R:gjBox(0,0,200,2000,1),T:gjBox(0,0,600,200,1),F:gjBox(0,0,600,200,1)}; wl.L.gate=wl.R.gate=wl.T.gate=true; wd.walls=[wl.L,wl.R,wl.T,wl.F];
  let stc=null,stk='',W=0,H=0,dpr=1,last=performance.now(),acc=0,spawnT=1100,lastImg=-1,grab=null,ims=[]; const dust=[];
  const rebuild=()=>{ ims=D.imgs.map(u=>{ const i=new Image(); i.src=u; return i; }); };
  function stats(){ q('.gjsc').textContent=D.score; q('.gjbs').textContent=D.best; q('.gjn').textContent=D.imgs.length+'/'+GJ.MAXIMG; q('[data-a=add]').disabled=D.imgs.length>=GJ.MAXIMG;
    root.querySelectorAll('[data-f]').forEach(b=>b.classList.toggle('on',b.dataset.f===D.fit)); q('.gjtl').style.display=D.fit==='tile'?'':'none'; q('.gjtr').value=D.tile; q('.gjtn').textContent=t('Kafelki: {n}×{n}').replace(/\{n\}/g,D.tile); q('.gjzr').value=D.size; q('.gjsz').textContent=D.size+' px';
    q('.gjth').innerHTML=D.imgs.map((u,i)=>`<div class="gjt"><img src="${u}" alt=""><button data-i="${i}" title="Usuń">×</button></div>`).join(''); }
  function fit(){ W=root.clientWidth; H=root.clientHeight; if(!W||!H) return; dpr=Math.min(2,devicePixelRatio||1); cv.width=Math.round(W*dpr); cv.height=Math.round(H*dpr);
    const fy=H-GJ.FL; wl.F.x=W/2; wl.F.y=fy+200; wl.F.hw=W/2+600; wl.T.x=W/2; wl.T.y=-200; wl.T.hw=W/2+600; wl.L.x=-200; wl.L.y=H/2; wl.R.x=W+200; wl.R.y=H/2; }
  new ResizeObserver(fit).observe(root);
  const rm=b=>{ const i=wd.bodies.indexOf(b); if(i>=0) wd.bodies.splice(i,1); if(grab&&grab.b===b) grab=null; cv.classList.remove('dr'); };
  function burst(b){ const cols=[accRgb,acc2Rgb,fgRgb], c=Math.cos(b.r), s=Math.sin(b.r);
    for(let i=0;i<24;i++){ const lx=(Math.random()*2-1)*b.hw, ly=(Math.random()*2-1)*b.hh, a=Math.random()*6.283, sp=80+Math.random()*260;
      dust.push({x:b.x+c*lx-s*ly,y:b.y+s*lx+c*ly,vx:b.vx*.5+Math.cos(a)*sp,vy:b.vy*.5+Math.sin(a)*sp-60,age:0,life:.3+Math.random()*.3,sz:2+Math.random()*4,c:cols[i%3]}); } }
  function destroy(b,scored){ rm(b); burst(b); if(scored){ D.score++; if(D.score>D.best) D.best=D.score; saveSoon(); stats(); } }
  const maxN=()=>Math.max(1,Math.floor(1.5*W/GJ.S));   // łączna powierzchnia ≤ 1,5 × (bok kostki × długość podłogi)
  function spawn(){ if(W<GJ.S*2||H<GJ.S*3||wd.bodies.length>=maxN()) return;
    const b=gjBox(GJ.S+Math.random()*(W-GJ.S*2),-GJ.S*1.1-Math.random()*30,GJ.S/2,GJ.S/2,0); b.r=Math.random()*6.283; b.vx=(Math.random()*2-1)*60; b.vy=20+Math.random()*60; b.w=(Math.random()*2-1)*3;
    const n=D.imgs.length; let k=-1; if(n===1) k=0; else if(n>1){ do k=Math.floor(Math.random()*n); while(k===lastImg); } lastImg=k; b.img=k>=0?ims[k]:null; wd.bodies.push(b); }
  function force(b,dt){ if(!grab||grab.b!==b) return; const c=Math.cos(b.r), s=Math.sin(b.r), rx=c*grab.lx-s*grab.ly, ry=s*grab.lx+c*grab.ly;
    let fx=GJ.K*(grab.tx-(b.x+rx))-GJ.C*(b.vx-b.w*ry), fy=GJ.K*(grab.ty-(b.y+ry))-GJ.C*(b.vy+b.w*rx); const m=Math.hypot(fx,fy); if(m>22000){ fx*=22000/m; fy*=22000/m; }
    b.vx+=fx*dt*b.im; b.vy+=fy*dt*b.im; b.w+=(rx*fy-ry*fx)*dt*b.ii; b.w/=1+dt*8; }
  function post(dt){ for(const b of wd.bodies.slice()){ b.age+=dt; const e=b.hw*(Math.abs(Math.cos(b.r))+Math.abs(Math.sin(b.r)));
      if(!b.ent&&b.x-e>=0&&b.x+e<=W&&b.y-e>=0) b.ent=true;
      const out=b.x+e<0||b.x-e>W||b.y-e>H||(b.ent&&b.y+e<0)||(!b.ent&&b.age>12);   // wypadnięcie poza arenę po wpadnięciu = usunięcie bez punktu
      if(out||!isFinite(b.x+b.y)) rm(b); } }
  function draw(){
    g.setTransform(dpr,0,0,dpr,0,0); g.clearRect(0,0,W,H); const fy=H-GJ.FL, key=accRgb+'|'+P.bg+'|'+D.fit+D.tile+'|'+GJ.S;
    const sk2=key+'|'+W+'|'+H+'|'+dpr+'|'+D.score+'|'+fgRgb;
    if(!stc||stk!==sk2){ stc=stc||document.createElement('canvas'); stc.width=cv.width; stc.height=cv.height; const q=stc.getContext('2d'); q.setTransform(dpr,0,0,dpr,0,0); q.clearRect(0,0,W,H); gjNum(q,W,fy,D.score);
      const gf=q.createLinearGradient(0,fy,0,H); gf.addColorStop(0,`rgba(${accRgb},.18)`); gf.addColorStop(.25,`rgba(${accRgb},.07)`); gf.addColorStop(1,'rgba(0,0,0,.38)'); q.fillStyle=gf; q.fillRect(0,fy,W,GJ.FL);
      q.save(); q.strokeStyle=`rgba(${accRgb},.6)`; q.lineWidth=1.5; q.shadowColor=`rgba(${accRgb},.8)`; q.shadowBlur=8; q.beginPath(); q.moveTo(0,fy+.75); q.lineTo(W,fy+.75); q.stroke(); q.restore(); stk=sk2; }
    g.setTransform(1,0,0,1,0,0); g.drawImage(stc,0,0); g.setTransform(dpr,0,0,dpr,0,0);
    const z=GJ.S+GJ.PAD*2;
    for(const b of wd.bodies){ const ok=b.img&&b.img.complete&&b.img.naturalWidth; if(!b.sp||b.sk!==key||(ok&&!b.sl)){ b.sp=gjSprite(b.img,dpr,D.fit,D.tile); b.sk=key; b.sl=!!ok; }
      g.save(); g.translate(b.x,b.y); g.rotate(b.r); g.drawImage(b.sp,-z/2,-z/2,z,z); g.restore(); }
    for(const p of dust){ g.fillStyle=`rgba(${p.c},${Math.max(0,1-p.age/p.life)})`; g.fillRect(p.x-p.sz/2,p.y-p.sz/2,p.sz,p.sz); }
  }
  function frame(now){
    if(!w.isConnected) return; requestAnimationFrame(frame);
    if(now-last<12) return;
    const dt=Math.min(.05,(now-last)/1000); last=now; if(!W) return;
    spawnT-=dt*1000; if(spawnT<=0){ spawnT=1700+Math.random()*1500; spawn(); }   // spokojne tempo: kostka co ~1,7–3,2 s
    acc+=dt; let n=0; while(acc>=GJ.DT&&n<5){ wd.step(GJ.DT,force); acc-=GJ.DT; n++; } if(n===5) acc=0;
    post(dt);
    for(let i=dust.length-1;i>=0;i--){ const p=dust[i]; p.age+=dt; p.vy+=500*dt; p.vx*=.985; p.x+=p.vx*dt; p.y+=p.vy*dt; if(p.age>=p.life) dust.splice(i,1); }
    draw();
  }
  const pt=e=>{ const r=cv.getBoundingClientRect(); return [e.clientX-r.left,e.clientY-r.top]; };
  function pick(x,y){ for(let i=wd.bodies.length-1;i>=0;i--){ const b=wd.bodies[i], dx=x-b.x, dy=y-b.y, c=Math.cos(b.r), s=Math.sin(b.r), lx=c*dx+s*dy, ly=-s*dx+c*dy; if(Math.abs(lx)<=b.hw&&Math.abs(ly)<=b.hh) return {b,lx,ly}; } return null; }
  cv.addEventListener('pointerdown',e=>{ if(e.button!==0) return; const [x,y]=pt(e), h=pick(x,y); if(!h) return; e.preventDefault(); cv.setPointerCapture(e.pointerId);
    grab={b:h.b,lx:h.lx,ly:h.ly,tx:x,ty:y,x0:x,y0:y,t0:performance.now(),mv:false,id:e.pointerId}; cv.classList.add('dr'); const i=wd.bodies.indexOf(h.b); wd.bodies.push(...wd.bodies.splice(i,1)); });
  cv.addEventListener('pointermove',e=>{ const [x,y]=pt(e); if(grab&&e.pointerId===grab.id){ grab.tx=x; grab.ty=y; if(Math.hypot(x-grab.x0,y-grab.y0)>6) grab.mv=true; } else cv.style.cursor=pick(x,y)?'grab':''; });
  const up=e=>{ if(!grab||e.pointerId!==grab.id) return; const gb=grab; grab=null; cv.classList.remove('dr'); if(e.type==='pointerup'&&!gb.mv&&performance.now()-gb.t0<250&&wd.bodies.includes(gb.b)) destroy(gb.b,true); };
  cv.addEventListener('pointerup',up); cv.addEventListener('pointercancel',up);
  q('.gjm').onclick=()=>pn.classList.toggle('open');
  pn.addEventListener('click',e=>{ const bt=e.target.closest('button'); if(!bt) return;
    if(bt.dataset.f){ D.fit=bt.dataset.f; saveSoon(); stats(); return; }
    if(bt.dataset.i!==undefined){ D.imgs.splice(+bt.dataset.i,1); rebuild(); saveSoon(); stats(); return; }
    const a=bt.dataset.a; if(a==='all'){ wd.bodies.slice().forEach(b=>destroy(b,false)); }
    else if(a==='reset'){ ask('Zresetować wynik?','Rekord zostanie zachowany.','Zeruj').then(ok=>{ if(ok){ D.score=0; saveSoon(); stats(); } }); }
    else if(a==='add') fi.click(); });
  fi.addEventListener('change',async()=>{ const list=[...fi.files]; fi.value=''; let full=0,bad=0,added=0;
    for(const f of list){ if(D.imgs.length>=GJ.MAXIMG){ full++; continue; } try{ D.imgs.push(await gjToIcon(f)); added++; }catch{ bad++; } }
    if(added){ rebuild(); saveSoon(); stats(); } if(full) toast(t('Limit: {n} grafik').replace('{n}',GJ.MAXIMG)); else if(bad) toast(t('Nie można odczytać obrazu.')); });
  q('.gjtr').addEventListener('input',e=>{ D.tile=+e.target.value; saveSoon(); stats(); });
  q('.gjzr').addEventListener('input',e=>{ D.size=+e.target.value; GJ.S=D.size; for(const b of wd.bodies){ b.hw=b.hh=GJ.S/2; b.ii=3/(b.hw*b.hw+b.hh*b.hh); } saveSoon(); stats(); });
  rebuild(); stats(); fit(); requestAnimationFrame(f=>{ last=f; frame(f); });
  el.__gj={wd,wl,D,destroy,spawn,fit};
}

// ===== src/js/11-app-windows.js =====
// ---------- aplikacje (prawy pasek i pływające okna) ----------
const APPS=[
  {id:'calc',ic:'🧮',n:'Kalkulator',d:'Kalkulator prosty i naukowy z historią obliczeń',w:320,h:480,mount:mountCalc},
  {id:'notes',ic:'📝',n:'Notatnik',d:'Wiele notatek z obsługą emoji',w:580,h:400,mount:mountNotes},
  {id:'clock',ic:'🕒',n:'Zegar',d:'Zegar, alarmy, minutnik, stoper i kalendarz',w:430,h:560,mount:mountClock},{id:'conv',ic:'🔁',n:'Konwerter',d:'Konwerter jednostek z rzadkimi jednostkami (np. lata świetlne)',w:430,h:640,mount:mountConv},{id:'files',ic:'🗃️',n:'Zmieniacz formatów',d:'Konwertuje pliki: obrazy, dźwięk, wideo, dokumenty, dane i archiwa',w:600,h:720,mount:mountFc},{id:'gej',ic:'🎲',n:'Gejos.exe',d:'Kostki z fizyką: łap, rzucaj i niszcz',w:520,h:420,mount:mountGej},{id:'dice',ic:'🔟',n:'Kości',d:'Rzuty kośćmi: od D3 do D100, wiele kości naraz',w:440,h:660,mount:mountDice},{id:'mine',ic:'💣',n:'Saper',d:'Klasyczny Saper: własna plansza, życia i zawinięte krawędzie',w:520,h:660,mount:mountMine},{id:'snake',ic:'🐍',n:'Snake',d:'Wąż z jabłkami: plansza, tempo, złote i trujące jabłka oraz przeszkody',w:540,h:640,mount:mountSnake},{id:'wx',ic:'⛅',n:'Pogoda',ph:1},{id:'tr',ic:'🌐',n:'Tłumacz',d:'Tłumacz tekstów (bez logowania i opłat, wymaga internetu)',w:640,h:420,mount:mountTr},{id:'mus',ic:'🎵',n:'Odtwarzacz',ph:1}
];
const AIC={calc:'<rect x="5" y="2.5" width="14" height="19" rx="2.5"/><rect x="8" y="5.5" width="8" height="3.5" rx=".8"/><path d="M8.5 13h.01M12 13h.01M15.5 13h.01M8.5 16.5h.01M12 16.5h.01M15.5 16.5h.01"/>',notes:'<path d="M18 12.5V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h5"/><path d="M8.5 8.5h6M8.5 12h3"/><path d="m20.5 15.2-5.7 5.7-2.8.6.6-2.8 5.7-5.7a1.4 1.4 0 0 1 2.2 2.2z"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',conv:'<path d="M4 8h14M14.5 4.5 18 8l-3.5 3.5M20 16H6M9.5 12.5 6 16l3.5 3.5"/>',files:'<path d="M12 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6l5 5v3"/><path d="M13 3v5h5"/><path d="M14 17h7M18 13.8l3 3.2-3 3.2"/>',gej:'<path d="M12 3 20 7.5v9L12 21l-8-4.5v-9z"/><path d="M12 12 4 7.5M12 12l8-4.5M12 12v9"/>',dice:'<rect x="3.5" y="3.5" width="17" height="17" rx="3.5"/><circle cx="8.5" cy="8.5" r="1" fill="currentColor" stroke="none"/><circle cx="15.5" cy="8.5" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="8.5" cy="15.5" r="1" fill="currentColor" stroke="none"/><circle cx="15.5" cy="15.5" r="1" fill="currentColor" stroke="none"/>',mine:'<circle cx="10.5" cy="14" r="6.5"/><path d="M7.3 13a3.3 3.3 0 0 1 3.2-3"/><path d="m15.2 9.3 2.6-2.6"/><path d="M19.5 2.5v3M18 4h3"/>',snake:'<path d="M19 6H8.5a3.5 3.5 0 0 0 0 7h7a3.5 3.5 0 0 1 0 7H5"/><circle cx="19" cy="6" r="1" fill="currentColor" stroke="none"/>',wx:'<path d="M17.5 19H9a6 6 0 1 1 5.8-7.6h2.7a3.8 3.8 0 0 1 0 7.6z"/>',tr:'<path d="M4 6h9M8.5 4v2M6 6c.5 3 2.5 5.5 6 7M12 6c-.5 3-3 6-7.5 7.5"/><path d="m12 20 4.5-10L21 20M13.5 17h6"/>',mus:'<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4.5" height="6.5" rx="1.8"/><rect x="16.5" y="14" width="4.5" height="6.5" rx="1.8"/>'};
APPS.forEach(a=>{ if(AIC[a.id]) a.ic=`<svg viewBox="0 0 24 24">${AIC[a.id]}</svg>`; });   // ikony aplikacji: liniowe SVG w stylu ikon ustawień i ChangeLog
const APP=Object.fromEntries(APPS.map(a=>[a.id,a]));
S.aw=S.aw||{}; S.aw.open=S.aw.open||[]; S.aw.pos=S.aw.pos||{}; S.aw.links=S.aw.links||[]; S.aw.data=S.aw.data||{};
S.aw.open=S.aw.open.filter(id=>APP[id]); S.settings.apps.bar=S.settings.apps.bar.filter(id=>APP[id]);   // usuń aplikacje, których już nie ma (np. okno testowe)
let zTop=1, toastT;
const GRID='<svg viewBox="0 0 24 24"><rect x="4" y="4" width="6.5" height="6.5" rx="1.6"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6"/></svg>';
function toast(m){ const e=$('toast'); e.textContent=m; e.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(()=>e.classList.remove('show'),2300); }
function renderBar(){
  const A=S.settings.apps; document.body.classList.toggle('noapps',!A.on);
  $('rl').innerHTML='<h6>APLIKACJE</h6>'+(A.bar.length
    ? A.bar.filter(id=>APP[id]).map(id=>{ const a=APP[id]; return `<div class="fd app${S.aw.open.includes(id)?' on':''}" data-app="${id}" title="${esc(a.n)}"><i class="ic">${a.ic}</i><span>${esc(a.n)}</span></div>`; }).join('')
    : `<div class="rempty"><i class="ic re-i">${GRID}</i><p>Brak aplikacji na pasku.</p><p class="sm">Aplikacje możesz dodać w ustawieniach, w sekcji Aplikacje.</p><button id="rset">Otwórz ustawienia</button></div>`);
}
$('rl').addEventListener('click',e=>{
  if(e.target.id==='rset'){ setTab='apps'; toggleSet(true); return; }
  const it=e.target.closest('.app'); if(it) toggleApp(it.dataset.app);
});
const winOf=id=>document.querySelector(`.aw[data-app="${id}"]`);
const liveWins=()=>[...document.querySelectorAll('.aw:not(.out)')];
const rectOf=w=>({x:parseFloat(w.style.left),y:parseFloat(w.style.top),w:parseFloat(w.style.width),h:parseFloat(w.style.height)});
function toggleApp(id){ const w=winOf(id); if(w&&!w.classList.contains('out')) closeApp(id); else openApp(id); }
// --- okrągłe okna: stały kształt koła, zawinięty pasek tytułu, styki po łuku ---
const RMIN=330, RBAND=30, RANG=42*Math.PI/180;
const isRound=()=>document.body.classList.contains('round');
function roundSync(w){
  const h=w.querySelector('.awh'), b=w.querySelector('.awb'); if(!h||!b||!w.isConnected) return;
  let sv=h.querySelector('.awr'); const on=isRound();
  if(!on){ if(sv) sv.remove(); h.style.clipPath=''; ['left','right','top','bottom'].forEach(k=>b.style[k]=''); h.querySelectorAll('.ic,.awx').forEach(e=>{ e.style.left=e.style.top=e.style.transform=''; }); w.__rs=0; return; }
  const s=w.clientWidth; if(!s) return; if(w.__rs===s&&sv) return; w.__rs=s;
  const c=s/2, R=c, Ri=R-RBAND, A=RANG, rm=Ri+RBAND/2, f=n=>n.toFixed(1), P=(a,r)=>[c+r*Math.sin(a),c-r*Math.cos(a)];
  const [x1,y1]=P(-A,R-.5), [x2,y2]=P(A,R-.5), [x3,y3]=P(A,Ri), [x4,y4]=P(-A,Ri);
  const d=`M${f(x1)} ${f(y1)}A${R-.5} ${R-.5} 0 0 1 ${f(x2)} ${f(y2)}L${f(x3)} ${f(y3)}A${Ri} ${Ri} 0 0 0 ${f(x4)} ${f(y4)}Z`;
  const rb=Ri+RBAND/2-4.5, ta=A-34/rm, [tx1,ty1]=P(-ta,rb), [tx2,ty2]=P(ta,rb), pid='awp-'+w.dataset.app, L=rb*2*ta;
  const title=t(APP[w.dataset.app].n);
  if(!sv){ sv=document.createElementNS('http://www.w3.org/2000/svg','svg'); sv.setAttribute('class','awr'); h.prepend(sv); }
  sv.innerHTML=`<path class="bf" d="${d}"/><path class="bs" d="${d}"/><path id="${pid}" d="M${f(tx1)} ${f(ty1)}A${f(rb)} ${f(rb)} 0 0 1 ${f(tx2)} ${f(ty2)}" fill="none"/><text><textPath href="#${pid}" startOffset="50%" text-anchor="middle"></textPath></text>`;
  const tp=sv.querySelector('textPath'); tp.textContent=title;
  let n=title.length; while(n>1&&tp.getComputedTextLength()>L){ n--; tp.textContent=title.slice(0,n).trimEnd()+'…'; }
  h.style.clipPath=`path('${d}')`;
  const put=(e,a)=>{ if(!e) return; const [x,y]=P(a,rm); e.style.left=(x-e.offsetWidth/2)+'px'; e.style.top=(y-e.offsetHeight/2)+'px'; e.style.transform=''; };
  put(h.querySelector('.ic'),-(A-16/rm)); put(h.querySelector('.awx'),A-16/rm);
  // prostokąt zawartości: górne rogi pod wewnętrznym łukiem paska, dolne wewnątrz koła
  const u=Ri-3, v=R-5; let best=0, bw=0, bt=0, bb=0;
  for(let hw=40;hw<Math.min(u,v);hw++){ const ht=Math.sqrt(u*u-hw*hw), hb=Math.sqrt(v*v-hw*hw), ar=hw*(ht+hb); if(ar>best){ best=ar; bw=hw; bt=ht; bb=hb; } }
  b.style.left=(c-bw)+'px'; b.style.right=(c-bw)+'px'; b.style.top=(c-bt)+'px'; b.style.bottom=(c-bb)+'px';
}
function place(w,p){
  if(isRound()){ const s=Math.max(RMIN,p.w,p.h); p={...p,w:s,h:s}; }
  w.style.left=p.x+'px'; w.style.top=p.y+'px'; w.style.width=p.w+'px'; w.style.height=p.h+'px'; if(w.isConnected) roundSync(w);
}
// punkt styku dwóch kół: odcinek wspólnej prostej, na którym odstęp między okręgami ≤ G
function arcTouch(Lw,Rw,vert){
  const G=5, rad=o=>Math.min(o.w,o.h)/2, cx=o=>o.x+o.w/2, cy=o=>o.y+o.h/2, rl=rad(Lw), rr=rad(Rw); let lo=null, hi=null;
  const a0=vert?Math.max(Lw.y,Rw.y):Math.max(Lw.x,Rw.x), a1=vert?Math.min(Lw.y+Lw.h,Rw.y+Rw.h):Math.min(Lw.x+Lw.w,Rw.x+Rw.w);
  for(let q=Math.ceil(a0);q<=a1;q++){
    const dl=vert?q-cy(Lw):q-cx(Lw), dr=vert?q-cy(Rw):q-cx(Rw); if(Math.abs(dl)>=rl||Math.abs(dr)>=rr) continue;
    const gl=Math.sqrt(rl*rl-dl*dl), gr=Math.sqrt(rr*rr-dr*dr);
    const gap=vert?(cx(Rw)-gr)-(cx(Lw)+gl):(cy(Rw)-gr)-(cy(Lw)+gl);
    if(gap<=G){ if(lo===null) lo=q; hi=q; } }
  return lo===null?null:{s:lo,l:Math.max(6,hi-lo)};
}
function savePos(w){ S.aw.pos[w.dataset.app]=rectOf(w); save(); }
function focusWin(w){ document.querySelectorAll('.aw').forEach(x=>x.classList.toggle('act',x===w));
  groupOf(w.dataset.app).forEach(i=>{ const m=winOf(i); if(m&&m!==w) m.style.zIndex=++zTop; }); w.style.zIndex=++zTop; try{ w.focus({preventScroll:true}); }catch{} updateContacts(); }
function openApp(id){
  const a=APP[id]; if(!a) return;
  if(a.ph){ toast(t(a.n)+' — '+t('wkrótce')); return; }
  let w=winOf(id); if(w&&!w.classList.contains('out')){ focusWin(w); return; }
  const k=Object.keys(S.aw.pos).length%5, aw=a.w||420, ah=a.h||300, p=S.aw.pos[id]||{x:Math.max(80,innerWidth/2-aw/2)+k*34,y:90+k*34,w:aw,h:ah};
  w=document.createElement('div'); w.className='aw'+(an('apps')?' ent':''); w.dataset.app=id; w.tabIndex=-1;
  w.innerHTML=`<div class="awh"><i class="ic">${a.ic}</i><span>${esc(a.n)}</span><button class="awx" title="Zamknij aplikację">×</button></div><div class="awb"></div>`+['n','s','e','w','ne','nw','se','sw'].map(d=>`<i class="rz ${d}" data-d="${d}"></i>`).join('');
  place(w,p); $('aws').appendChild(w); roundSync(w); focusWin(w);
  if(a.mount) a.mount(w.querySelector('.awb'),w);
  w.querySelector('.awb').prepend(Object.assign(document.createElement('canvas'),{className:'afx'})); afxKick();   // tło z cząsteczkami (wspólne)
  if(!S.aw.open.includes(id)) S.aw.open.push(id); savePos(w); renderBar(); updateContacts();
}
function closeApp(id){
  const w=winOf(id); S.aw.open=S.aw.open.filter(x=>x!==id); S.aw.links=S.aw.links.filter(l=>!l.includes(id));
  if(w){ savePos(w); w.classList.add('out'); later('apps',180,()=>{ w.remove(); updateContacts(); }); }
  save(); renderBar(); updateContacts();
}
$('aws').addEventListener('click',e=>{ const x=e.target.closest('.awx'); if(x) closeApp(x.closest('.aw').dataset.app); });
// --- styki i scalanie okien ---
function contactList(){
  const ws=liveWins().map(w=>({id:w.dataset.app,...rectOf(w)})), out=[], T=1.5;
  for(let i=0;i<ws.length;i++) for(let j=i+1;j<ws.length;j++){ const a=ws[i], b=ws[j];
    const oy=Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y), ox=Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x);
    const rd=isRound(), add=(L,Rr,v,x,y,l)=>{ if(!rd){ out.push({a:a.id,b:b.id,v,x,y,l}); return; }
      const q=arcTouch(L,Rr,v); if(q) out.push({a:a.id,b:b.id,v,x,y,l:q.l,r:1,...(v?{y:q.s}:{x:q.s})}); };
    if(oy>6){ if(Math.abs(a.x+a.w-b.x)<=T) add(a,b,1,b.x,Math.max(a.y,b.y),oy); else if(Math.abs(b.x+b.w-a.x)<=T) add(b,a,1,a.x,Math.max(a.y,b.y),oy); }
    if(ox>6){ if(Math.abs(a.y+a.h-b.y)<=T) add(a,b,0,Math.max(a.x,b.x),b.y,ox); else if(Math.abs(b.y+b.h-a.y)<=T) add(b,a,0,Math.max(a.x,b.x),a.y,ox); } }
  return out;
}
const linked=(a,b)=>S.aw.links.some(l=>(l[0]===a&&l[1]===b)||(l[0]===b&&l[1]===a));
let collide=false;   // tryb kolizji (Shift podczas przesuwania)
function updateContacts(){
  const box=$('aws'); box.querySelectorAll('.cs').forEach(e=>e.remove());
  const cs=contactList(), T=3, R=14;      // R = promień zaokrąglenia rogów okna: linia obejmuje tylko prostą część krawędzi
  cs.forEach(c=>{ const lk=linked(c.a,c.b); if(!lk&&!collide) return;
    const st=(c.v?c.y:c.x)+(c.r?0:R), len=c.l-(c.r?0:2*R); if(len<4) return;
    const e=document.createElement('i'); e.className='cs'+(lk?' lk':'');
    if(c.v){ e.style.left=(c.x-T/2)+'px'; e.style.top=st+'px'; e.style.width=T+'px'; e.style.height=len+'px'; }
    else { e.style.top=(c.y-T/2)+'px'; e.style.left=st+'px'; e.style.height=T+'px'; e.style.width=len+'px'; }
    e.style.zIndex=Math.max(+(winOf(c.a)?.style.zIndex)||0,+(winOf(c.b)?.style.zIndex)||0);
    box.appendChild(e); });
  return cs;
}
function groupOf(id){ const seen=new Set([id]), q=[id];
  while(q.length){ const x=q.pop(); S.aw.links.forEach(([a,b])=>{ const o=a===x?b:b===x?a:null; if(o&&!seen.has(o)){ seen.add(o); q.push(o); } }); }
  return [...seen].filter(i=>winOf(i)); }
function sweepMove(rects,ddx,ddy,others){
  let ax=ddx;
  for(const r of rects) for(const o of others){ if(r.y<o.y+o.h&&r.y+r.h>o.y){
    if(ddx>0&&r.x+r.w<=o.x+.01) ax=Math.min(ax,o.x-(r.x+r.w)); else if(ddx<0&&r.x>=o.x+o.w-.01) ax=Math.max(ax,o.x+o.w-r.x); } }
  const mx=rects.map(r=>({...r,x:r.x+ax})); let ay=ddy;
  for(const r of mx) for(const o of others){ if(r.x<o.x+o.w&&r.x+r.w>o.x){
    if(ddy>0&&r.y+r.h<=o.y+.01) ay=Math.min(ay,o.y-(r.y+r.h)); else if(ddy<0&&r.y>=o.y+o.h-.01) ay=Math.max(ay,o.y+o.h-r.y); } }
  return [ax,ay];
}
// --- pasek podpowiedzi klawiszy ---
function showHint(mode){
  const chips=mode==='move'?[['Shift','Blokuj o okna i krawędzie ekranu','sh'],['M','Scal stykające się okna','mg hide'],['U','Oddziel okno od grupy','um hide'],['Esc','Anuluj przesuwanie','es']]:[['Esc','Anuluj zmianę rozmiaru','es']];
  $('kh').querySelector('.khi').innerHTML=chips.map(([k,l,c])=>`<span class="khc ${c}"><kbd>${k}</kbd>${l}</span>`).join(''); $('kh').classList.add('show');
}
const hideHint=()=>$('kh').classList.remove('show');
const hintChip=(c,on)=>{ const e=$('kh').querySelector('.'+c); if(!e) return; if(c==='sh'){ e.classList.toggle('on',on); return; }
  const was=!e.classList.contains('hide'); e.classList.toggle('hide',!on); if(on&&!was){ e.classList.remove('pop'); void e.offsetWidth; e.classList.add('pop'); } };
// --- przytrzymanie okna: przesuwanie / zmiana rozmiaru ---
$('aws').addEventListener('mousedown',e=>{
  const w=e.target.closest('.aw'); if(!w||w.classList.contains('out')) return; focusWin(w);
  const rz=e.target.closest('.rz'), h=e.target.closest('.awh');
  if(!rz&&!(h&&!e.target.closest('.awx'))) return; e.preventDefault();
  startHold(w,rz?rz.dataset.d:'',e);
});
function startHold(w,d,e){
  const id=w.dataset.app, box=$('aws').getBoundingClientRect(), BW=box.width, BH=box.height;
  let grp,others,start,cur,sx=e.clientX,sy=e.clientY,lastX=sx,lastY=sy,done=false;
  const orig=new Map();
  const hl=()=>document.querySelectorAll('.aw').forEach(x=>x.classList.toggle('act',grp.includes(x)||x===w));   // podświetl całą grupę scalonych okien
  const rebase=()=>{ grp=d?[w]:groupOf(id).map(winOf); others=liveWins().filter(o=>!grp.includes(o)).map(rectOf); start=grp.map(rectOf); cur={dx:0,dy:0}; sx=lastX; sy=lastY; grp.forEach(g=>{ if(!orig.has(g)) orig.set(g,rectOf(g)); }); hl(); };
  rebase();
  const refresh=()=>{ const cs=updateContacts(), ids=grp.map(g=>g.dataset.app);
    hintChip('mg',collide&&cs.some(c=>ids.includes(c.a)!==ids.includes(c.b))); hintChip('um',S.aw.links.some(l=>l.includes(id))); };
  document.body.classList.add('dragging'); showHint(d?'resize':'move'); hintChip('sh',e.shiftKey); collide=!d&&e.shiftKey; refresh();
  const mv=ev=>{ lastX=ev.clientX; lastY=ev.clientY; hintChip('sh',ev.shiftKey); collide=!d&&ev.shiftKey;
    if(d&&isRound()){ const st=start[0], dx=lastX-sx, dy=lastY-sy, hz=d==='e'||d==='w';   // koło: jeden wymiar zmienia drugi, środek drugiej osi zostaje
      const sz=Math.max(RMIN,d==='e'?st.w+dx:d==='w'?st.w-dx:d==='s'?st.h+dy:st.h-dy);
      let x=hz?(d==='w'?st.x+st.w-sz:st.x):st.x-(sz-st.w)/2, y=hz?st.y-(sz-st.h)/2:(d==='n'?st.y+st.h-sz:st.y);
      x=clamp(x,-sz+90,BW-90); y=clamp(y,0,BH-40); place(w,{x,y,w:sz,h:sz}); }
    else if(d){ const st=start[0], dx=lastX-sx, dy=lastY-sy; let x=st.x,y=st.y,ww=st.w,hh=st.h;
      if(d.includes('e')) ww=st.w+dx; if(d.includes('s')) hh=st.h+dy; if(d.includes('w')) ww=st.w-dx; if(d.includes('n')) hh=st.h-dy;
      ww=Math.max(220,ww); hh=Math.max(140,hh); if(d.includes('w')) x=st.x+st.w-ww; if(d.includes('n')) y=st.y+st.h-hh;
      x=clamp(x,-ww+90,BW-90); y=clamp(y,0,BH-40); place(w,{x,y,w:ww,h:hh}); }
    else { let lo=-1e9,hi=1e9,lo2=-1e9,hi2=1e9;
      const tight=ev.shiftKey;   // z Shiftem okno nie może wystawać poza ekran
      start.forEach(r=>{ lo=Math.max(lo,(tight?0:-r.w+90)-r.x); hi=Math.min(hi,(tight?BW-r.w:BW-90)-r.x); lo2=Math.max(lo2,-r.y); hi2=Math.min(hi2,(tight?BH-r.h:BH-40)-r.y); });
      const dx=clamp(lastX-sx,lo,hi), dy=clamp(lastY-sy,lo2,hi2); let ddx=dx-cur.dx, ddy=dy-cur.dy;
      if(ev.shiftKey&&others.length){ const rects=start.map(r=>({...r,x:r.x+cur.dx,y:r.y+cur.dy})); [ddx,ddy]=sweepMove(rects,ddx,ddy,others); }
      cur.dx+=ddx; cur.dy+=ddy; grp.forEach((g,i)=>place(g,{x:start[i].x+cur.dx,y:start[i].y+cur.dy,w:start[i].w,h:start[i].h})); }
    refresh(); };
  const end=()=>{ if(done) return; done=true; document.body.classList.remove('dragging'); removeEventListener('mousemove',mv); removeEventListener('mouseup',end);
    document.removeEventListener('keydown',kd,true); document.removeEventListener('keyup',ku,true); hideHint(); collide=false;
    document.querySelectorAll('.aw').forEach(x=>x.classList.toggle('act',x===w));   // po puszczeniu zostaje tylko okno chwycone
    orig.forEach((r,g)=>{ if(g.isConnected) savePos(g); }); updateContacts(); };
  const merge=()=>{ if(!collide) return; const ids=grp.map(g=>g.dataset.app), cs=contactList().filter(c=>ids.includes(c.a)!==ids.includes(c.b));
    if(!cs.length) return;
    cs.forEach(c=>{ const mine=ids.includes(c.a)?c.a:c.b, other=mine===c.a?c.b:c.a; if(!linked(mine,other)) S.aw.links.push([mine,other]); });
    save(); rebase(); grp.forEach(g=>{ g.style.zIndex=++zTop; }); w.style.zIndex=++zTop; toast(t('Okna scalone')); refresh(); };
  const unmerge=()=>{ if(!S.aw.links.some(l=>l.includes(id))) return; S.aw.links=S.aw.links.filter(l=>!l.includes(id)); save(); rebase(); toast(t('Okno oddzielone')); refresh(); };
  const kd=ev=>{ const k=ev.key;
    if(k==='Escape'){ ev.stopPropagation(); orig.forEach((r,g)=>place(g,r)); end(); }
    else if(k==='Shift'){ hintChip('sh',true); collide=!d; refresh(); }
    else if(!d&&(k==='m'||k==='M')){ ev.preventDefault(); merge(); }
    else if(!d&&(k==='u'||k==='U')){ ev.preventDefault(); unmerge(); } };
  const ku=ev=>{ if(ev.key==='Shift'){ hintChip('sh',false); collide=false; refresh(); } };
  addEventListener('mousemove',mv); addEventListener('mouseup',end); document.addEventListener('keydown',kd,true); document.addEventListener('keyup',ku,true);
}
addEventListener('resize',()=>{ const box=$('aws').getBoundingClientRect(); document.querySelectorAll('.aw').forEach(w=>{ const x=clamp(parseFloat(w.style.left),-parseFloat(w.style.width)+90,Math.max(0,box.width-90)), y=clamp(parseFloat(w.style.top),0,Math.max(0,box.height-40)); w.style.left=x+'px'; w.style.top=y+'px'; }); updateContacts(); });
function setWinSize(w,nw,nh){ const r=rectOf(w), box=$('aws').getBoundingClientRect(); place(w,{x:clamp(r.x,0,Math.max(0,box.width-nw)),y:r.y,w:nw,h:nh}); savePos(w); updateContacts(); }
// sekcja w ustawieniach
function appCard(id,added){ const a=APP[id]; return `<div class="ap${added?' added':''}" data-ap="${id}" data-add="${added?0:1}"><i class="ic">${a.ic}</i><div class="apn"><b>${esc(a.n)}</b><small>${a.ph?'wkrótce':esc(a.d||'')}</small></div><em class="apact">${added?'− Usuń':'＋ Dodaj'}</em></div>`; }
function renderApps(){
  const A=S.settings.apps, bar=A.bar.filter(id=>APP[id]), avail=APPS.filter(a=>!bar.includes(a.id)), u=S.settings.ui;
  $('set').innerHTML=`<div class="sh"><b>⚙ Ustawienia</b><button id="sx">×</button></div>${tabsHtml()}
  <h5>PASEK APLIKACJI</h5>
  <label class="ck"><input type="checkbox" id="appson" ${A.on?'checked':''}><span class="tg"></span>Pokaż pasek aplikacji</label>
  <div class="ad ${A.on?'open':''}" id="appsad"><div class="adi" id="applists">${appLists(bar,avail)}</div></div>
  <h5>OKNA APLIKACJI</h5><label class="ck"><input type="checkbox" id="rnd" ${u.round?'checked':''}><span class="tg"></span>Okrągłe okna aplikacji 🙃</label><p class="hint">Żartobliwa opcja: okna stają się kołami, a pasek tytułu zajmuje górny łuk.</p>
  <label class="ck"><input type="checkbox" data-an="apps" ${u.anim.apps?'checked':''}><span class="tg"></span>Animacje aplikacji</label>
  <h5>TŁO APLIKACJI</h5><label class="ck"><input type="checkbox" id="afxon" ${S.settings.afx.on?'checked':''}><span class="tg"></span>Spokojne cząsteczki w tle aplikacji</label>
  ${[['calc','Kalkulator'],['notes','Notatnik'],['clock','Zegar'],['conv','Konwerter'],['files','Zmieniacz formatów'],['tr','Tłumacz'],['gej','Gejos.exe'],['dice','Kości'],['mine','Saper'],['snake','Snake']].map(([k,n])=>sl('afx.'+k,n,0,100,S.settings.afx[k],'afx')).join('')}<p class="hint">0% wyłącza efekt w danej aplikacji.</p>`;
  paintSliders();
}
const APPCATS=[['prog','Programy'],['game','Gry']], APPGAMES=new Set(['gej','dice','mine','snake']), appCat=id=>APPGAMES.has(id)?'game':'prog';
const appLists=(bar,avail)=>`<h5>DODANE DO PASKA</h5>${bar.length?bar.map(id=>appCard(id,true)).join(''):'<p class="hint">Kliknij aplikację poniżej, aby ją dodać.</p>'}
  <h5>DOSTĘPNE APLIKACJE</h5>${avail.length?APPCATS.map(([k,n])=>{ const l=avail.filter(a=>appCat(a.id)===k); return l.length?`<div class="apcat">${n}</div>`+l.map(a=>appCard(a.id,false)).join(''):''; }).join(''):'<p class="hint">Wszystkie aplikacje są już na pasku.</p>'}`;
function toggleAdd(id,add){
  const A=S.settings.apps; if(!APP[id]) return;
  if(add){ if(!A.bar.includes(id)) A.bar.push(id); } else { A.bar=A.bar.filter(x=>x!==id); if(winOf(id)) closeApp(id); }
  const bar=A.bar.filter(i=>APP[i]), avail=APPS.filter(a=>!bar.includes(a.id)), box=$('applists');
  if(box) box.innerHTML=appLists(bar,avail);
  renderBar(); save();
}


// ===== src/js/12-app-calc.js =====
// ---------- aplikacja: kalkulator ----------
function calcEval(src,deg){
  const s=src.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-').replace(/π/g,'pi').replace(/√/g,'sqrt').replace(/\s+/g,'');
  let i=0; const bad=()=>{ throw new Error('x'); };
  const rad=x=>deg?x*Math.PI/180:x, back=x=>deg?x*180/Math.PI:x;
  const F={sin:x=>Math.sin(rad(x)),cos:x=>Math.cos(rad(x)),tan:x=>Math.tan(rad(x)),asin:x=>back(Math.asin(x)),acos:x=>back(Math.acos(x)),atan:x=>back(Math.atan(x)),ln:Math.log,log:Math.log10,sqrt:Math.sqrt,abs:Math.abs,exp:Math.exp};
  const FK=Object.keys(F).sort((a,b)=>b.length-a.length);
  const fact=n=>{ if(n<0||n!==Math.floor(n)||n>170) bad(); let r=1; for(let k=2;k<=n;k++) r*=k; return r; };
  function expr(){ let v=term(); while(s[i]==='+'||s[i]==='-'){ const o=s[i++], r=term(); v=o==='+'?v+r:v-r; } return v; }
  function term(){ let v=unary(); for(;;){ const c=s[i]||''; if(c==='*'||c==='/'){ i++; const r=unary(); v=c==='*'?v*r:v/r; } else if(c==='('||/[a-z\d.]/.test(c)) v*=unary(); else break; } return v; }
  function unary(){ if(s[i]==='-'){ i++; return -unary(); } if(s[i]==='+'){ i++; return unary(); } return pow(); }
  function pow(){ let b=post(); if(s[i]==='^'){ i++; b=Math.pow(b,unary()); } return b; }
  function post(){ let v=prim(); for(;;){ if(s[i]==='!'){ i++; v=fact(v); } else if(s[i]==='%'){ i++; v=v/100; } else break; } return v; }
  function prim(){
    if(s[i]==='('){ i++; const v=expr(); if(s[i]===')') i++; return v; }
    const m=/^(\d*\.?\d+(?:e[+-]?\d+)?|\d+\.)/i.exec(s.slice(i)); if(m){ i+=m[0].length; return parseFloat(m[0]); }
    const f=/^[a-z]+/.exec(s.slice(i));
    if(f){ const nm=f[0];
      for(const k of FK) if(nm.startsWith(k)){ i+=k.length; if(s[i]!=='(') bad(); i++; const v=expr(); if(s[i]===')') i++; return F[k](v); }
      if(nm.startsWith('pi')){ i+=2; return Math.PI; } if(nm[0]==='e'){ i++; return Math.E; } }
    return bad(); }
  const v=expr(); if(i<s.length) bad(); return v;
}
function mountCalc(el,w){
  const D=(S.aw.data.calc=S.aw.data.calc||{mode:'s',deg:true,hist:[]});
  let expr='', lastEx='', prev='0', just=false, err=false, second=false;
  el.innerHTML=`<div class="calc" tabindex="0"><div class="c-top"><div class="c-seg"><button data-m="s">Prosty</button><button data-m="x">Naukowy</button></div><button class="c-hb" title="Historia">🕘</button></div>
    <div class="c-disp"><div class="c-ex"></div><div class="c-res">0</div></div>
    <div class="c-main"><div class="c-fn"></div><div class="c-pad"></div></div>
    <div class="c-hist"><div class="c-hh"><b>Historia</b><button class="c-hc">Wyczyść historię</button></div><div class="c-hl"></div></div></div>`;
  const root=el.firstElementChild, ex=root.querySelector('.c-ex'), rs=root.querySelector('.c-res'), fn=root.querySelector('.c-fn'), pad=root.querySelector('.c-pad'), hl=root.querySelector('.c-hl');
  const PAD=[['C','C','fx'],['⌫','BS','fx'],['%','%','fx'],['÷','÷','op'],['7','7'],['8','8'],['9','9'],['×','×','op'],['4','4'],['5','5'],['6','6'],['−','−','op'],['1','1'],['2','2'],['3','3'],['+','+','op'],['±','NEG','fx'],['0','0'],['.','.'],['=','EQ','eq']];
  const FNK=()=>[['2nd','2ND','fx'+(second?' on':'')],[D.deg?'DEG':'RAD','DEG','fx'],['(','(','fx'],[')',')','fx'],
    second?['sin⁻¹','asin(','fn']:['sin','sin(','fn'],second?['cos⁻¹','acos(','fn']:['cos','cos(','fn'],second?['tan⁻¹','atan(','fn']:['tan','tan(','fn'],['π','π','fn'],
    ['ln','ln(','fn'],['log','log(','fn'],['e','e','fn'],['n!','!','fn'],['x²','^2','fn'],['√','√(','fn'],['xʸ','^','fn'],['1/x','INV','fn'],
    ['|x|','abs(','fn'],['Ans','ANS','fn'],['eˣ','exp(','fn'],['10ˣ','10^','fn']];
  const btns=l=>l.map(([lab,k,c])=>`<button data-k="${k}" class="${c||''}">${lab}</button>`).join('');
  const fmt=n=>{ if(!isFinite(n)) return null; let v=parseFloat(n.toPrecision(12)); if(v===0) v=0; const a=Math.abs(v);
    return (a!==0&&(a>=1e15||a<1e-9))?v.toExponential(6).replace(/\.?0+e/,'e').replace('e+','e'):String(v); };
  const render=()=>{
    ex.textContent=just?lastEx:expr; let r;
    if(err) r=t('Błąd');
    else if(just) r=expr;
    else if(!expr) r='0';
    else if(/^−?[\d.]+(e[+-]?\d+)?$/i.test(expr)) r=expr;
    else { try{ const f=fmt(calcEval(expr,D.deg)); if(f!==null) prev=f; }catch{} r=prev; }
    rs.textContent=r; rs.classList.toggle('er',err); rs.style.fontSize=(r.length>11?Math.max(16,34-(r.length-11)*1.7):34)+'px';
    root.querySelectorAll('.c-seg button').forEach(b=>b.classList.toggle('on',b.dataset.m===D.mode)); root.classList.toggle('sci',D.mode==='x');
    hl.innerHTML=D.hist.length?D.hist.map((h,i)=>`<div class="he" data-i="${i}"><small>${esc(h.e)} =</small><b>${esc(h.r)}</b></div>`).join(''):'<p class="hint">Brak historii obliczeń.</p>';
  };
  const buildFn=()=>{ fn.innerHTML=btns(FNK()); };
  const OPS=/[+−×÷^]/;
  const press=k=>{
    if(err){ expr=''; err=false; prev='0'; just=false; }
    if(/^[\d.]$/.test(k)){ if(just){ expr=''; just=false; } if(k==='.'&&(expr.split(/[^\d.]/).pop()||'').includes('.')) return render(); expr+=k; }
    else if(k==='C'){ expr=''; just=false; prev='0'; }
    else if(k==='BS'){ if(just){ just=false; } expr=expr.replace(/(?:asin|acos|atan|sin|cos|tan|ln|log|exp|abs|√)\($|[\s\S]$/,''); }
    else if(k==='EQ'){ if(!expr) return; let v; try{ v=calcEval(expr,D.deg); }catch{ v=NaN; } const r=fmt(v);
      if(r===null){ err=true; return render(); }
      D.hist.unshift({e:expr,r}); D.hist=D.hist.slice(0,60); saveSoon(); lastEx=expr+' ='; expr=r; just=true; prev=r; }
    else if(k==='NEG'){ just=false; const m=/^−\((.*)\)$/.exec(expr); expr=!expr?'−':m?m[1]:'−('+expr+')'; }
    else if(k==='INV'){ just=false; expr=expr?'1÷('+expr+')':'1÷('; }
    else if(k==='ANS'){ if(!D.hist[0]) return; if(just) expr=''; just=false; expr+=D.hist[0].r; }
    else if(k==='DEG'){ D.deg=!D.deg; saveSoon(); buildFn(); }
    else if(k==='2ND'){ second=!second; buildFn(); }
    else { const op=/^[+−×÷^!%]$/.test(k);
      if(just&&!op){ expr=''; } just=false;
      if(/^[+×÷^]$/.test(k)&&OPS.test(expr.slice(-1))) expr=expr.slice(0,-1)+k;
      else if(k==='−'&&/[+−]$/.test(expr)) expr=expr.slice(0,-1)+k;
      else expr+=k; }
    render();
  };
  const setMode=m=>{ D.mode=m; saveSoon();
    const r=rectOf(w); if(m==='x') setWinSize(w,Math.max(r.w,600),Math.max(r.h,480)); else if(r.w>380) setWinSize(w,320,r.h); render(); };
  pad.innerHTML=btns(PAD); buildFn();
  root.addEventListener('mousedown',e=>{ if(e.target.closest('button')){ e.preventDefault(); root.focus({preventScroll:true}); } });
  root.addEventListener('click',e=>{
    const b=e.target.closest('button'), he=e.target.closest('.he'); if(!b&&!he) return;
    if(he){ const h=D.hist[+he.dataset.i]; if(!expr||just){ expr=h.r; just=false; } else expr+=h.r; root.classList.remove('h'); render(); return; }
    if(b.dataset.k) press(b.dataset.k); else if(b.dataset.m) setMode(b.dataset.m);
    else if(b.classList.contains('c-hb')) root.classList.toggle('h');
    else if(b.classList.contains('c-hc')){ D.hist=[]; saveSoon(); render(); } });
  root.addEventListener('keydown',e=>{
    if(e.ctrlKey||e.metaKey||e.altKey) return;
    const map={'*':'×','/':'÷','-':'−','Enter':'EQ','=':'EQ','Backspace':'BS','Escape':'C','Delete':'C',',':'.','p':'π','P':'π'}, x=map[e.key]??e.key;
    if(/^[0-9.+^()!%]$/.test(x)||['×','÷','−','EQ','BS','C','π'].includes(x)){ e.preventDefault(); press(x); } });
  render();
}

// ===== src/js/13-app-notes.js =====
// ---------- aplikacja: notatnik ----------
function mountNotes(el,w){
  const D=(S.aw.data.notes=S.aw.data.notes||{list:[],cur:null,sl:true});
  if(!D.list.length){ const n={id:uid(),c:'',u:Date.now()}; D.list.push(n); D.cur=n.id; }
  if(!D.list.find(n=>n.id===D.cur)) D.cur=D.list[0].id;
  let q='';
  el.innerHTML=`<div class="nt"><div class="nt-l"><div class="nt-lt"><input class="nt-s" placeholder="Szukaj w notatkach…"><button class="nt-n" title="Nowa notatka">＋</button></div><div class="nt-ls"></div></div>
    <div class="nt-e"><div class="nt-bar"><button class="nt-t" title="Lista notatek">☰</button><input class="nt-ti" maxlength="80" spellcheck="false"><button class="nt-lk" title="Lista zadań (pola do odznaczania)"><svg viewBox="0 0 24 24"><path d="m4 7 1.5 1.5L8 5.8M4 13l1.5 1.5L8 11.8M11 7h9M11 13h9M4 19h.01M11 19h9"/></svg></button><button class="nt-em" title="Emoji">😊</button><button class="nt-dp" title="Duplikuj notatkę">⧉</button><button class="nt-io-b" title="Importuj / eksportuj">⇅</button><button class="nt-d" title="Usuń notatkę">🗑</button></div>
    <textarea class="nt-ta" spellcheck="false" placeholder="Zacznij pisać…"></textarea><div class="nt-li"></div><div class="nt-f"><span class="nt-c"></span><button class="nt-cl">Usuń wykonane</button></div><div class="nt-pk"></div><div class="nt-io"></div><input type="file" class="nt-fi" multiple hidden accept=".txt,.md,.markdown,.csv,.tsv,.json,.log,.html,.htm,.xml,.rtf,.ini,.cfg,.yml,.yaml,.tex,.srt,.vtt,.bat,.js,.css,text/*"></div></div>`;
  const root=el.firstElementChild, io=root.querySelector('.nt-io'), fi=root.querySelector('.nt-fi'), ls=root.querySelector('.nt-ls'), ta=root.querySelector('.nt-ta'), ti=root.querySelector('.nt-ti'), cc=root.querySelector('.nt-c'), pk=root.querySelector('.nt-pk'), sr=root.querySelector('.nt-s'), li=root.querySelector('.nt-li'), lk=root.querySelector('.nt-lk'), lcl=root.querySelector('.nt-cl');
  const EM='😀 😂 😍 🥰 😎 🤔 😴 😭 😡 👍 👎 🙏 👏 🎉 🔥 ⭐ 💡 ✅ ❌ ❤️ 💔 📌 📎 📝 📅 ⏰ 💼 🏠 🛒 ✈️ 🍕 ☕ 🎵 📚 💻 📱 🔒 🔑 🌈 ☀️ 🌙 🌿 🐱 🐶 🚀 💬 🎯'.split(' ');
  pk.innerHTML=EM.map(e=>`<button>${e}</button>`).join('');
  const cur=()=>D.list.find(n=>n.id===D.cur);
  // tryb listy zadań: pozycje są zapisane w tekście notatki jako wiersze "[ ] tekst" i "[x] tekst" (bez osobnej struktury, więc wyszukiwanie, kopiowanie i eksport działają jak zawsze)
  const LRE=/^\s*(?:[-*]\s*)?\[([ xX])\]\s?/, clean=x=>x.replace(LRE,'');
  const parseL=c=>c.split('\n').filter(x=>x.trim()).map(x=>{ const m=LRE.exec(x); return m?{d:m[1]!==' ',t:x.slice(m[0].length)}:{d:false,t:x.trim()}; });
  const joinL=a=>a.map(i=>(i.d?'[x] ':'[ ] ')+i.t).join('\n'), toTxt=c=>parseL(c).map(i=>i.d?'[x] '+i.t:i.t).join('\n');
  const prog=n=>{ const a=parseL(n.c); return [a.filter(i=>i.d).length,a.length]; };
  let items=[], lastIn=null;
  const first=n=>{ const l=(n.c.split('\n').map(clean).find(x=>x.trim())||'').trim(); return l?l.slice(0,40):t('Bez tytułu'); };
  const title=n=>n.t||first(n);
  const sub=n=>{ const ln=n.c.split('\n').map(clean).filter(x=>x.trim()); return (ln[1]||'').trim(); };
  const when=n=>new Date(n.u).toLocaleString(IL(),{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
  const list=()=>{ const f=q.toLowerCase(); ls.innerHTML=[...D.list].sort((a,b)=>b.u-a.u).filter(n=>!f||(n.c+' '+(n.t||'')).toLowerCase().includes(f))
    .map(n=>`<div class="ni${n.id===D.cur?' on':''}" data-id="${n.id}"><b>${esc(title(n))}</b><small>${esc(when(n))}${n.l?' · ✓ '+prog(n).join('/'):''}${sub(n)?' · '+esc(sub(n).slice(0,24)):''}</small></div>`).join(''); };
  const meta=()=>{ const n=cur(); ti.value=n.t||''; ti.placeholder=first(n); cc.textContent=n.l?t('Wykonano {a} z {b}').replace('{a}',prog(n)[0]).replace('{b}',prog(n)[1]):[...n.c].length+' '+t('znaków'); };
  const show=()=>{ const n=cur(), L=!!n.l; ta.value=n.c; root.classList.toggle('lm',L); lk.classList.toggle('on',L); if(L){ items=parseL(n.c); rItems(); } meta(); list(); root.classList.toggle('sl',!!D.sl); };
  const select=id=>{ D.cur=id; saveSoon(); show(); if(root.classList.contains('narrow')){ D.sl=false; root.classList.remove('sl'); } if(!cur().l) ta.focus(); };
  ta.addEventListener('input',()=>{ const n=cur(); n.c=ta.value; n.u=Date.now(); meta(); list(); saveSoon(); });
  sr.addEventListener('input',()=>{ q=sr.value; list(); });
  ti.addEventListener('input',()=>{ const n=cur(), v=ti.value.trim(); if(v) n.t=v; else delete n.t; list(); saveSoon(); });
  ti.addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); (cur().l?(li.querySelector('.nt-new')||ta):ta).focus(); } });
  root.querySelector('.nt-dp').onclick=()=>{ const n=cur(), c={id:uid(),c:n.c,l:n.l,t:title(n)+' ('+t('kopia')+')',u:Date.now()}; D.list.push(c); select(c.id); };
  ls.addEventListener('click',e=>{ const it=e.target.closest('.ni'); if(it) select(it.dataset.id); });
  root.querySelector('.nt-n').onclick=()=>{ const n={id:uid(),c:'',u:Date.now()}; D.list.push(n); q=''; sr.value=''; select(n.id); };
  root.querySelector('.nt-t').onclick=()=>{ D.sl=!D.sl; root.classList.toggle('sl',D.sl); saveSoon(); };
  root.querySelector('.nt-em').onclick=e=>{ e.stopPropagation(); pk.classList.toggle('open'); };
  root.addEventListener('mousedown',e=>{ if(!e.target.closest('.nt-pk,.nt-em')) pk.classList.remove('open'); if(!e.target.closest('.nt-io,.nt-io-b')) io.classList.remove('open'); });
  pk.addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return;
    const tg=root.classList.contains('lm')?((lastIn&&lastIn.isConnected)?lastIn:li.querySelector('.nt-new')):ta, a=tg.selectionStart, z=tg.selectionEnd;
    tg.setRangeText(b.textContent,a,z,'end'); tg.dispatchEvent(new Event('input',{bubbles:true})); tg.focus(); });
  root.querySelector('.nt-d').onclick=async()=>{ const n=cur();
    if(n.c.trim()&&!(await ask(t('Usunąć notatkę?'),t('Tej operacji nie można cofnąć.'),'Usuń'))) return;
    D.list=D.list.filter(x=>x.id!==n.id); if(!D.list.length) D.list.push({id:uid(),c:'',u:Date.now()}); D.cur=D.list[0].id; saveSoon(); show(); };
  new ResizeObserver(()=>{ const nar=el.clientWidth<420; if(nar!==root.classList.contains('narrow')){ root.classList.toggle('narrow',nar); if(nar){ D.sl=false; root.classList.remove('sl'); } } }).observe(el);
  const rItems=focus=>{
    li.innerHTML=items.map((it,i)=>`<div class="nt-it${it.d?' done':''}" data-i="${i}"><label class="nt-ck"><input type="checkbox" ${it.d?'checked':''}><i></i></label><input class="nt-tx" value="${esc(it.t)}" spellcheck="false"><button class="nt-x" title="Usuń pozycję">×</button></div>`).join('')
      +'<div class="nt-ad"><span>+</span><input class="nt-new" placeholder="Dodaj pozycję..."></div>';
    if(focus!==undefined&&focus!==null){ const e=focus<0?li.querySelector('.nt-new'):li.querySelectorAll('.nt-tx')[focus]; if(e){ e.focus(); const L=e.value.length; try{ e.setSelectionRange(L,L); }catch{} } }
  };
  const sync=()=>{ const n=cur(); n.c=joinL(items); n.u=Date.now(); meta(); list(); saveSoon(); };
  const addNew=inp=>{ const v=inp.value.trim(); if(!v) return false; items.push({d:false,t:v}); inp.value=''; sync(); return true; };
  lk.onclick=()=>{ const n=cur(); n.l=!n.l; n.c=n.l?joinL(parseL(n.c)):toTxt(n.c); n.u=Date.now(); saveSoon(); show(); if(n.l) (li.querySelector('.nt-new')).focus(); else ta.focus(); };
  lcl.onclick=()=>{ items=items.filter(i=>!i.d); sync(); rItems(); };
  li.addEventListener('focusin',e=>{ if(e.target.matches('.nt-tx,.nt-new')) lastIn=e.target; });
  li.addEventListener('change',e=>{ const row=e.target.closest('.nt-it');
    if(row&&e.target.type==='checkbox'){ const i=+row.dataset.i; items[i].d=e.target.checked; row.classList.toggle('done',items[i].d); sync(); }
    else if(e.target.classList.contains('nt-new')){ if(addNew(e.target)) rItems(); } });
  li.addEventListener('input',e=>{ const row=e.target.closest('.nt-it'); if(row&&e.target.classList.contains('nt-tx')){ items[+row.dataset.i].t=e.target.value; sync(); } });
  li.addEventListener('click',e=>{ const x=e.target.closest('.nt-x'); if(x){ const i=+x.closest('.nt-it').dataset.i; items.splice(i,1); sync(); rItems(Math.min(i,items.length-1)); } });
  li.addEventListener('keydown',e=>{
    if(e.isComposing) return; const inp=e.target;
    if(inp.classList.contains('nt-new')){
      if(e.key==='Enter'){ e.preventDefault(); if(addNew(inp)) rItems(-1); }
      else if((e.key==='Backspace'||e.key==='ArrowUp')&&!inp.value&&items.length){ e.preventDefault(); li.querySelectorAll('.nt-tx')[items.length-1].focus(); }
      return; }
    if(!inp.classList.contains('nt-tx')) return; const i=+inp.closest('.nt-it').dataset.i;
    if(e.key==='Enter'){ e.preventDefault(); items.splice(i+1,0,{d:false,t:''}); sync(); rItems(i+1); }
    else if(e.key==='Backspace'&&!inp.value){ e.preventDefault(); items.splice(i,1); sync(); rItems(i>0?i-1:(items.length?0:-1)); }
    else if(e.key==='ArrowUp'&&i>0){ e.preventDefault(); li.querySelectorAll('.nt-tx')[i-1].focus(); }
    else if(e.key==='ArrowDown'){ e.preventDefault(); const nx=li.querySelectorAll('.nt-tx')[i+1]; (nx||li.querySelector('.nt-new')).focus(); } });
  show();
  // import i eksport plików tekstowych (v48): .txt, .md, .csv, .json, .html i inne pliki tekstowe; kopia zapasowa wszystkich notatek w .json wraca przy imporcie
  const ioMenu=sub=>{ io.dataset.sub=sub?'1':''; io.innerHTML=(sub?[['back','← Wstecz'],['-'],['txt','Ta notatka jako .txt'],['md','Ta notatka jako .md'],['html','Ta notatka jako .html'],['-'],['all','Wszystkie jako jeden .txt'],['bak','Kopia wszystkich (.json)']]:[['imp','Importuj pliki…'],['sub','Eksportuj…']]).map(([k,l])=>k==='-'?'<hr>':`<button data-io="${k}">${l}</button>`).join(''); };   // menu główne: Importuj / Eksportuj…; „Eksportuj…” otwiera listę formatów
  ioMenu(false);
  const safe=x=>(x||'').replace(/[\\/:*?"<>|\r\n]+/g,' ').trim().slice(0,60)||t('Notatka');
  const dl=(name,txt,mime)=>{ const b=new Blob(['\ufeff'+txt],{type:mime+';charset=utf-8'}), u=URL.createObjectURL(b), a=document.createElement('a'); a.href=u; a.download=name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(u),4000); toast(t('Zapisano')+': '+name); };
  const plain=n=>n.l?parseL(n.c).map(i=>(i.d?'[x] ':'[ ] ')+i.t).join('\n'):n.c;
  const htmlOf=n=>`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${esc(title(n))}</title></head><body><h1>${esc(title(n))}</h1>${n.l?'<ul style="list-style:none;padding:0">'+parseL(n.c).map(i=>`<li>${i.d?'☑':'☐'} ${esc(i.t)}</li>`).join('')+'</ul>':'<pre style="white-space:pre-wrap;font:inherit">'+esc(n.c)+'</pre>'}</body></html>`;
  const stripHtml=h=>{ try{ const d=new DOMParser().parseFromString(h,'text/html'); d.querySelectorAll('script,style,head').forEach(x=>x.remove()); return (d.body.innerText||d.body.textContent||'').replace(/\n{3,}/g,'\n\n').trim(); }catch{ return h; } };
  const addNote=(name,c,l)=>{ const n={id:uid(),c,u:Date.now()}; if(name) n.t=name; if(l) n.l=true; D.list.push(n); return n; };
  const imp=async files=>{ let k=0, last=null;
    for(const f of files){ let tx; try{ tx=await f.text(); }catch{ continue; } if(/[\u0000]/.test(tx.slice(0,2000))){ toast(t('Pominięto plik binarny')+': '+f.name); continue; }
      tx=tx.replace(/^\ufeff/,'').replace(/\r\n?/g,'\n'); const ext=(f.name.split('.').pop()||'').toLowerCase(), base=f.name.replace(/\.[^.]+$/,'');
      if(ext==='json'){ let j=null; try{ j=JSON.parse(tx); }catch{} const arr=j&&Array.isArray(j.notes)?j.notes:(Array.isArray(j)?j:null);
        if(arr&&arr.every(x=>x&&typeof x==='object'&&typeof x.c==='string')){ arr.forEach(x=>{ last=addNote(typeof x.t==='string'?x.t.slice(0,80):'',x.c,!!x.l); k++; }); continue; } }
      if(ext==='html'||ext==='htm') tx=stripHtml(tx);
      last=addNote(base.slice(0,80),tx,false); k++; }
    if(k){ q=''; sr.value=''; select(last.id); toast(t('Zaimportowano notatek')+': '+k); } else toast(t('Nic nie zaimportowano')); };
  const exp=k=>{ const n=cur();
    if(k==='txt') dl(safe(title(n))+'.txt',plain(n),'text/plain');
    else if(k==='md') dl(safe(title(n))+'.md','# '+title(n)+'\n\n'+(n.l?parseL(n.c).map(i=>'- ['+(i.d?'x':' ')+'] '+i.t).join('\n'):n.c)+'\n','text/markdown');
    else if(k==='html') dl(safe(title(n))+'.html',htmlOf(n),'text/html');
    else if(k==='all') dl('notatki.txt',[...D.list].sort((a,b)=>b.u-a.u).map(x=>title(x)+'\n'+'='.repeat(Math.min(40,Math.max(3,title(x).length)))+'\n'+plain(x)).join('\n\n\n')+'\n','text/plain');
    else if(k==='bak') dl('notatki-kopia.json',JSON.stringify({arkana:'notes',v:1,notes:D.list.map(x=>({t:x.t||'',c:x.c,l:!!x.l,u:x.u}))},null,1),'application/json'); };
  root.querySelector('.nt-io-b').onclick=e=>{ e.stopPropagation(); pk.classList.remove('open'); if(!io.classList.contains('open')) ioMenu(false); io.classList.toggle('open'); };
  io.addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return; const k=b.dataset.io; if(k==='sub'){ ioMenu(true); return; } if(k==='back'){ ioMenu(false); return; } io.classList.remove('open'); if(k==='imp') fi.click(); else exp(k); });
  fi.addEventListener('change',()=>{ const fs=[...fi.files]; fi.value=''; if(fs.length) imp(fs); });
  root.addEventListener('dragover',e=>{ if(e.dataTransfer&&[...e.dataTransfer.types].includes('Files')) e.preventDefault(); });
  root.addEventListener('drop',e=>{ const fs=e.dataTransfer&&[...e.dataTransfer.files]; if(fs&&fs.length){ e.preventDefault(); imp(fs); } });
}


// ===== src/js/14-app-clock.js =====
// ---------- aplikacja: zegar, alarmy, minutnik, stoper i kalendarz ----------
const pad2=n=>String(n).padStart(2,'0');
const dkey=d=>d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate());
const capF=s=>s.charAt(0).toUpperCase()+s.slice(1);
const CLD=()=>{ const D=(S.aw.data.clock=S.aw.data.clock||{});
  const d={tab:'clock',style:'a',h24:true,alarms:[],snooze:[],timer:{dur:300,end:0,left:300,run:false},tsnd:'beep',sw:{run:false,t0:0,acc:0,laps:[]},events:{},sel:'',cm:''};
  for(const k in d) if(D[k]===undefined) D[k]=d[k]; return D; };
// --- dźwięki (WebAudio, bez plików) ---
const SNDN=[['bell','Dzwonek'],['beep','Budzik'],['rise','Narastający'],['chime','Melodia'],['pulse','Cichy puls']];
let AUDX=null, sndT=null;
function audio(){ try{ AUDX=AUDX||new (window.AudioContext||window.webkitAudioContext)(); if(AUDX.state==='suspended') AUDX.resume(); }catch{} return AUDX; }
function tone(f,t0,dur,type,vol){ const o=AUDX.createOscillator(), g=AUDX.createGain(); o.type=type; o.frequency.value=f;
  g.gain.setValueAtTime(0.0001,t0); g.gain.linearRampToValueAtTime(vol,t0+.015); g.gain.exponentialRampToValueAtTime(.0001,t0+dur);
  o.connect(g); g.connect(AUDX.destination); o.start(t0); o.stop(t0+dur+.05); }
const SND={
  bell:t=>{ [880,1320,1760].forEach((f,i)=>tone(f,t,1.5/(i+1),'sine',.24/(i+1))); return 2; },
  beep:t=>{ for(let i=0;i<4;i++) tone(1000,t+i*.18,.1,'square',.1); return 1.4; },
  rise:t=>{ [523,659,784,1047].forEach((f,i)=>tone(f,t+i*.2,.4,'triangle',.22)); return 1.6; },
  chime:t=>{ [659,587,523,587,659,659,659].forEach((f,i)=>tone(f,t+i*.28,.32,'sine',.22)); return 2.4; },
  pulse:t=>{ tone(440,t,.5,'sine',.2); tone(440,t+.7,.5,'sine',.2); return 1.6; }
};
function stopSnd(){ clearInterval(sndT); sndT=null; }
function playSnd(id,loop){ stopSnd(); if(!audio()) return; const f=SND[id]||SND.bell;
  const once=()=>{ try{ return f(AUDX.currentTime+.03); }catch{ return 2; } }, per=once(); if(loop) sndT=setInterval(once,(per+.7)*1000); }
// --- dzwonienie alarmu: otwiera aplikację lub wynosi ją na wierzch ---
const RING=[]; let CLK=null;   // CLK = uchwyt otwartej aplikacji (ring/refresh)
function ringStart(r){
  RING.push(r); playSnd(r.snd,true); document.body.classList.remove('noapps');
  try{ window.api.attention(); }catch{}
  const w=winOf('clock'); if(w&&!w.classList.contains('out')) focusWin(w); else openApp('clock');
  CLK&&CLK.ring();
}
function clockTick(){
  if(SEC) return;
  const D=CLD(), now=new Date(), ms=+now, stamp=dkey(now)+' '+pad2(now.getHours())+':'+pad2(now.getMinutes()); let dirty=false;
  D.alarms.forEach(a=>{ if(!a.on) return; const lab=pad2(a.h)+':'+pad2(a.m);
    if(a.days&&a.days.length){
      if(a.h===now.getHours()&&a.m===now.getMinutes()&&a.days.includes(now.getDay())&&a.last!==stamp){ a.last=stamp; dirty=true; ringStart({t:lab,n:a.note||'',snd:a.snd}); } }
    else { const at=new Date(a.date+'T'+lab+':00').getTime();
      if(ms>=at){ a.on=false; a.last=stamp; dirty=true; if(ms-at<120000) ringStart({t:lab,n:a.note||'',snd:a.snd}); else a.missed=true; } } });
  const sn=D.snooze.length; D.snooze=D.snooze.filter(s=>{ if(ms<s.until) return true; ringStart({t:s.t,n:s.n,snd:s.snd}); return false; }); if(D.snooze.length!==sn) dirty=true;
  const T=D.timer; if(T.run&&ms>=T.end){ T.run=false; T.left=T.dur; dirty=true; ringStart({t:t('Minutnik'),n:t('Czas minął'),snd:D.tsnd,timer:1}); }
  if(RING.length&&!winOf('clock')){ RING.length=0; stopSnd(); renderBar(); }   // zamknięcie okna = wyciszenie
  if(dirty){ save(); CLK&&CLK.refresh(); }
}
setInterval(clockTick,1000);
// --- tarcze ---
function anSvg(st){ const a=st==='a'; let s='<svg viewBox="-100 -100 200 200" class="cl-an"><circle r="97" class="cl-rim"/>';
  for(let i=0;i<60;i++){ const big=i%5===0; if(!a&&!big) continue; const r1=big?(a?80:78):89, g=i*Math.PI/30, sn=Math.sin(g), cs=-Math.cos(g);
    s+=`<line class="cl-tk${big?' b':''}" x1="${(sn*r1).toFixed(2)}" y1="${(cs*r1).toFixed(2)}" x2="${(sn*92).toFixed(2)}" y2="${(cs*92).toFixed(2)}"/>`; }
  if(a) for(let n=1;n<=12;n++){ const g=n*Math.PI/6; s+=`<text class="cl-nm" x="${(Math.sin(g)*64).toFixed(2)}" y="${(-Math.cos(g)*64).toFixed(2)}">${n}</text>`; }
  return s+'<line class="cl-hh" x1="0" y1="8" x2="0" y2="-44"/><line class="cl-mh" x1="0" y1="10" x2="0" y2="-66"/><line class="cl-sh" x1="0" y1="16" x2="0" y2="-76"/><circle r="4" class="cl-pin"/></svg>'; }
const SEG7={0:'abcdef',1:'bc',2:'abdeg',3:'abcdg',4:'bcfg',5:'acdfg',6:'acdefg',7:'abc',8:'abcdefg',9:'abcdfg'};
const hseg=(x1,x2,y,t=3.2)=>`${x1},${y} ${x1+t},${y-t} ${x2-t},${y-t} ${x2},${y} ${x2-t},${y+t} ${x1+t},${y+t}`;
const vseg=(x,y1,y2,t=3.2)=>`${x},${y1} ${x+t},${y1+t} ${x+t},${y2-t} ${x},${y2} ${x-t},${y2-t} ${x-t},${y1+t}`;
const SEGP={a:hseg(5,31,4),g:hseg(5,31,35),d:hseg(5,31,66),b:vseg(34,6,33),c:vseg(34,37,64),f:vseg(2,6,33),e:vseg(2,37,64)};
const DIGX=[0,46,112,158,224,270];
function digSvg(){ let s='<svg viewBox="-4 -2 316 74" class="cl-dg">';
  DIGX.forEach((x,i)=>{ s+=`<g transform="translate(${x},0)" data-i="${i}">`+Object.keys(SEGP).map(k=>`<polygon class="sg" data-s="${k}" points="${SEGP[k]}"/>`).join('')+'</g>'; });
  [98,210].forEach(x=>{ s+=`<circle class="cl-col" cx="${x}" cy="22" r="3.6"/><circle class="cl-col" cx="${x}" cy="48" r="3.6"/>`; });
  return s+'</svg>'; }
function mountClock(el,w){
  const D=CLD(), L=IL();
  if(!D.cm) D.cm=dkey(new Date()).slice(0,7); if(!D.sel) D.sel=dkey(new Date());
  el.innerHTML='<div class="clk" tabindex="0"><div class="cl-tabs"><i class="cl-ind"></i></div><div class="cl-body"></div><div class="cl-rg"></div></div>';
  const root=el.firstElementChild, tabs=root.querySelector('.cl-tabs'), ind=tabs.querySelector('.cl-ind'), holder=root.querySelector('.cl-body'), rg=root.querySelector('.cl-rg');
  let body=document.createElement('div'); body.className='cl-pg'; holder.appendChild(body);
  const TABS=[['clock','Zegar'],['alarms','Alarmy'],['timer','Minutnik'],['sw','Stoper'],['cal','Kalendarz']];
  let edit=null, live=null, pickOpen=false, pickY=0;
  const wd=i=>new Date(2024,0,7+i).toLocaleDateString(L,{weekday:'short'}), WD=[1,2,3,4,5,6,0];
  const sndOpts=sel=>SNDN.map(([k,n])=>`<option value="${k}"${sel===k?' selected':''}>${n}</option>`).join('');
  const fmtT=s=>{ s=Math.max(0,Math.ceil(s-1e-6)); const h=Math.floor(s/3600), m=Math.floor(s%3600/60); return (h?h+':'+pad2(m):m)+':'+pad2(s%60); };
  const fmtS=ms=>{ const cs=Math.floor(ms/10)%100, s=Math.floor(ms/1000)%60, m=Math.floor(ms/60000)%60, h=Math.floor(ms/3600000); return (h?h+':'+pad2(m):m)+':'+pad2(s)+'.'+pad2(cs); };
  const dsum=a=>a.days&&a.days.length?(a.days.length===7?t('Codziennie'):WD.filter(d=>a.days.includes(d)).map(wd).join(' ')):new Date(a.date+'T12:00').toLocaleDateString(L,{day:'numeric',month:'short',year:'numeric'});
  // ===== zegar =====
  function vClock(){
    const st=D.style;
    body.innerHTML=`<div class="cl-pc"><div class="cl-chips">${[['a','Tarcza'],['d','Cyfrowy'],['m','Bez numerów']].map(([k,n])=>`<button data-st="${k}" class="${st===k?'on':''}">${n}</button>`).join('')}</div>
      <div class="cl-face">${st==='d'?digSvg():anSvg(st)}</div><div class="cl-date"></div>${st==='d'?`<label class="ck"><input type="checkbox" class="cl-h24"${D.h24?' checked':''}><span class="tg"></span>Format 24-godzinny</label>`:''}</div>`;
    const dt=body.querySelector('.cl-date'); let dl='';
    const setDate=(n,ap)=>{ const k=dkey(n)+ap; if(k===dl) return; dl=k; dt.textContent=(ap?ap.trim()+' · ':'')+capF(n.toLocaleDateString(L,{weekday:'long',day:'numeric',month:'long',year:'numeric'})); };
    if(st==='d'){ const gs=[...body.querySelectorAll('.cl-dg g')], cols=body.querySelectorAll('.cl-col'), last=[]; let lc=null;
      live=()=>{ const n=new Date(); let h=n.getHours(), ap=''; if(!D.h24){ ap=h<12?' AM':' PM'; h=h%12||12; }
        const ds=pad2(h)+pad2(n.getMinutes())+pad2(n.getSeconds());
        gs.forEach((g,i)=>{ if(last[i]===ds[i]) return; last[i]=ds[i]; const on=SEG7[ds[i]]; g.querySelectorAll('.sg').forEach(p=>p.classList.toggle('on',on.includes(p.dataset.s))); });
        const c=n.getSeconds()%2===0; if(c!==lc){ lc=c; cols.forEach(x=>x.classList.toggle('off',!c)); } setDate(n,ap); }; }
    else { const hh=body.querySelector('.cl-hh'), mh=body.querySelector('.cl-mh'), sh=body.querySelector('.cl-sh');
      live=()=>{ const n=new Date(), s=n.getSeconds()+n.getMilliseconds()/1000, m=n.getMinutes()+s/60, h=(n.getHours()%12)+m/60;
        hh.setAttribute('transform','rotate('+h*30+')'); mh.setAttribute('transform','rotate('+m*6+')'); sh.setAttribute('transform','rotate('+s*6+')'); setDate(n,''); }; }
    live();
  }
  // ===== alarmy =====
  function vAlarms(){
    if(edit) return vForm();
    const al=[...D.alarms].sort((x,y)=>x.h*60+x.m-(y.h*60+y.m));
    body.innerHTML=`<div class="cl-pc"><div class="cl-top"><button class="cl-new">＋ Nowy alarm</button></div><div class="cl-al">${al.length?al.map(a=>
      `<div class="cl-a${a.on?' on':''}"><div class="cl-at"><b>${pad2(a.h)}:${pad2(a.m)}</b><small>${esc(dsum(a))}${a.missed&&!a.on?' · '+esc(t('ominięty')):''}</small>${a.note?`<em>${esc(a.note)}</em>`:''}</div>
      <label class="ck"><input type="checkbox" data-tg="${a.id}"${a.on?' checked':''}><span class="tg"></span></label><button class="cl-ib" data-ed="${a.id}" title="Edytuj">✎</button><button class="cl-ib" data-rm="${a.id}" title="Usuń">🗑</button></div>`).join(''):'<p class="hint">Brak alarmów.</p>'}</div></div>`;
  }
  function vForm(){
    const e=edit;
    body.innerHTML=`<div class="cl-pc"><label class="cl-f"><span>Godzina</span><input type="time" class="cl-tm" value="${pad2(e.h)}:${pad2(e.m)}"></label>
      <label class="cl-f"><span>Data</span><input type="date" class="cl-dt" value="${e.date}"></label>
      <div class="cl-f"><span>Powtarzaj</span><div class="cl-chips">${WD.map(d=>`<button data-wd="${d}" class="${e.days.includes(d)?'on':''}">${wd(d)}</button>`).join('')}</div></div>
      <p class="hint">Bez zaznaczonych dni alarm zadzwoni jednorazowo w wybranym dniu.</p>
      <label class="cl-f"><span>Notatka</span><input type="text" class="cl-nt" maxlength="120" placeholder="Notatka do alarmu…" value="${esc(e.note)}"></label>
      <div class="cl-f"><span>Dźwięk</span><div class="cl-sr"><select class="cl-sn">${sndOpts(e.snd)}</select><button class="cl-ib cl-pv" title="Odsłuchaj">▶</button></div></div>
      <div class="cl-btns"><button class="cl-ok">Zapisz</button><button class="cl-cn">Anuluj</button></div></div>`;
  }
  function saveForm(){
    const e=edit, tm=body.querySelector('.cl-tm').value; if(!/^\d\d:\d\d$/.test(tm)) return toast(t('Podaj godzinę'));
    e.h=+tm.slice(0,2); e.m=+tm.slice(3); e.date=body.querySelector('.cl-dt').value||dkey(new Date()); e.note=body.querySelector('.cl-nt').value.trim(); e.snd=body.querySelector('.cl-sn').value;
    if(!e.days.length&&new Date(e.date+'T'+tm+':00')<=new Date()) return toast(t('Ten termin już minął'));
    e.on=true; e.missed=false; e.last=''; const i=D.alarms.findIndex(a=>a.id===e.id); if(i>=0) D.alarms[i]=e; else D.alarms.push(e);
    edit=null; save(); draw();
  }
  // ===== minutnik =====
  function vTimer(){
    const T=D.timer, idle=!T.run&&T.left===T.dur, h=Math.floor(T.dur/3600), m=Math.floor(T.dur%3600/60), s=T.dur%60;
    body.innerHTML=`<div class="cl-pc"><div class="cl-rn"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" class="cl-r0"/><circle cx="60" cy="60" r="54" class="cl-r1" transform="rotate(-90 60 60)"/></svg>
      <div class="cl-big">${idle?`<div class="cl-ti"><input type="number" min="0" max="99" class="cl-n" data-u="h" value="${h}"><i>:</i><input type="number" min="0" max="59" class="cl-n" data-u="m" value="${pad2(m)}"><i>:</i><input type="number" min="0" max="59" class="cl-n" data-u="s" value="${pad2(s)}"></div>`:'<span class="cl-td"></span>'}</div></div>
      <div class="cl-chips cl-pr">${[[60,'1 min'],[300,'5 min'],[600,'10 min'],[900,'15 min'],[1800,'30 min'],[3600,'1 h']].map(([v,n])=>`<button data-pr="${v}"${T.dur===v?' class="on"':''}>${n}</button>`).join('')}</div>
      <div class="cl-btns"><button class="cl-go"${T.dur<=0?' disabled':''}>${T.run?'Pauza':T.left<T.dur?'Wznów':'Start'}</button><button class="cl-rs">Resetuj</button></div>
      <div class="cl-f"><span>Dźwięk</span><div class="cl-sr"><select class="cl-tsn">${sndOpts(D.tsnd)}</select><button class="cl-ib cl-pv2" title="Odsłuchaj">▶</button></div></div></div>`;
    const td=body.querySelector('.cl-td'), r1=body.querySelector('.cl-r1'), C=2*Math.PI*54; r1.style.strokeDasharray=C;
    live=()=>{ const rem=T.run?Math.max(0,(T.end-Date.now())/1000):T.left; if(td){ const ts=fmtT(rem); if(td.textContent!==ts){ td.textContent=ts; td.classList.toggle('h',rem>=3600); } } r1.style.strokeDashoffset=T.dur>0?C*(1-rem/T.dur):C; };
    live();
  }
  // ===== stoper =====
  const swEl=()=>D.sw.acc+(D.sw.run?Date.now()-D.sw.t0:0);
  function vSw(){
    const W=D.sw, laps=W.laps, sp=laps.map(l=>l.s), mn=Math.min(...sp), mx=Math.max(...sp);
    body.innerHTML=`<div class="cl-pc"><div class="cl-sd">0:00.00</div><div class="cl-btns"><button class="cl-sg">${W.run?'Stop':W.acc>0?'Wznów':'Start'}</button><button class="cl-lp"${W.run?'':' disabled'}>Okrążenie</button><button class="cl-rs2"${!W.run&&W.acc>0?'':' disabled'}>Resetuj</button></div>
      <div class="cl-laps">${laps.map((l,i)=>`<div class="cl-l${laps.length>1&&l.s===mn?' best':laps.length>1&&l.s===mx?' worst':''}"><span>${laps.length-i}</span><b>${fmtS(l.s)}</b><small>${fmtS(l.tot)}</small></div>`).join('')}</div></div>`;
    const sd=body.querySelector('.cl-sd'); live=()=>{ const ms=swEl(); sd.textContent=fmtS(ms); sd.classList.toggle('sm',ms>=3600000); }; live();
  }
  // ===== kalendarz =====
  function pkHtml(Y,M){ const now=new Date(), ys=[]; for(let y=1900;y<=2200;y++) ys.push(y);
    return `<div class="cl-pk"><div class="cl-pkm">${Array.from({length:12},(_,i)=>`<button data-pm="${i}" class="${pickY===Y&&i===M-1?'on':''}${pickY===now.getFullYear()&&i===now.getMonth()?' now':''}">${esc(capF(new Date(2024,i,1).toLocaleDateString(L,{month:'long'})))}</button>`).join('')}</div>
      <div class="cl-pky">${ys.map(y=>`<button data-py="${y}" class="${y===pickY?'on':''}${y===now.getFullYear()?' now':''}">${y}</button>`).join('')}</div></div>`; }
  function vCal(){
    const [Y,M]=D.cm.split('-').map(Number), off=(new Date(Y,M-1,1).getDay()+6)%7, today=dkey(new Date()); let cells='';
    for(let i=0;i<42;i++){ const d=new Date(Y,M-1,1-off+i), k=dkey(d), has=(D.events[k]||[]).length;
      cells+=`<button class="cl-d${d.getMonth()!==M-1?' o':''}${k===today?' td':''}${k===D.sel?' sel':''}" data-d="${k}">${d.getDate()}${has?'<i></i>':''}</button>`; }
    body.innerHTML=`<div class="cl-pc"><div class="cl-ch"><button class="cl-ib" data-m="-1">‹</button><button class="cl-mt${pickOpen?' open':''}" title="Wybierz miesiąc i rok">${esc(capF(new Date(Y,M-1,1).toLocaleDateString(L,{month:'long',year:'numeric'})))}</button><button class="cl-ib" data-m="1">›</button><button class="cl-tdb">Dziś</button></div>
      ${pickOpen?pkHtml(Y,M):''}<div class="cl-wd">${WD.map(d=>`<span>${wd(d)}</span>`).join('')}</div><div class="cl-gr">${cells}</div><div class="cl-ev"></div></div>`;
    if(pickOpen){ const yl=body.querySelector('.cl-pky'), on=yl&&yl.querySelector('.on'); if(on) yl.scrollTop=on.offsetTop-yl.clientHeight/2+on.offsetHeight/2; }
    evList();
  }
  function evList(){
    const box=body.querySelector('.cl-ev'); if(!box) return; const list=(D.events[D.sel]||[]).slice().sort((a,b)=>(a.tm||'99').localeCompare(b.tm||'99'));
    box.innerHTML=`<div class="cl-evh">${esc(capF(new Date(D.sel+'T12:00').toLocaleDateString(L,{weekday:'long',day:'numeric',month:'long'})))}</div>
      <div class="cl-evl">${list.length?list.map(e=>`<div class="cl-e"><span>${e.tm?esc(e.tm):'•'}</span><b>${esc(e.tt)}</b>${e.tm?`<button class="cl-ib" data-eal="${e.id}" title="Dodaj alarm">🔔</button>`:''}<button class="cl-ib" data-edl="${e.id}" title="Usuń">🗑</button></div>`).join(''):'<p class="hint">Brak wydarzeń w tym dniu.</p>'}</div>
      <div class="cl-eva"><input type="time" class="cl-et"><input type="text" class="cl-etx" maxlength="80" placeholder="Nowe wydarzenie…"><button class="cl-ib cl-eab" title="Dodaj">＋</button></div>`;
  }
  // ===== wspólne =====
  const V={clock:vClock,alarms:vAlarms,timer:vTimer,sw:vSw,cal:vCal};
  const ORDER=TABS.map(x=>x[0]); let shown=null;
  tabs.insertAdjacentHTML('beforeend',TABS.map(([k,n])=>`<button data-t="${k}">${n}</button>`).join(''));
  function moveInd(anim){ const b=tabs.querySelector('button.on'); if(!b) return; ind.style.transition=anim?'':'none'; ind.style.left=b.offsetLeft+'px'; ind.style.width=b.offsetWidth+'px'; }
  new ResizeObserver(()=>moveInd(false)).observe(tabs);
  function draw(dir){   // dir: >0 nowa zakładka jest po prawej, <0 po lewej (animacja przejścia)
    live=null; tabs.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.t===D.tab));
    const change=shown!==null&&shown!==D.tab;
    if(change&&dir&&!document.body.classList.contains('na-apps')){ const old=body; old.classList.add(dir>0?'o-l':'o-r'); setTimeout(()=>old.remove(),260); body=document.createElement('div'); body.className='cl-pg '+(dir>0?'i-r':'i-l'); holder.appendChild(body); }
    else if(change) body.innerHTML='';
    moveInd(shown!==null); shown=D.tab; (V[D.tab]||vClock)();
  }
  const newAlarm=()=>{ const n=new Date(Date.now()+3600000); return {id:uid(),h:n.getHours(),m:0,date:dkey(n),days:[],note:'',snd:'bell',on:true}; };
  const ring=()=>{ const r=RING[0]; rg.classList.toggle('on',!!r);
    rg.innerHTML=r?`<div class="cl-rb"><div class="cl-rk">${r.timer?'⏲️':'⏰'}</div><b class="cl-rt">${esc(r.t)}</b>${r.n?`<p class="cl-rnt">${esc(r.n)}</p>`:''}${RING.length>1?`<small>+${RING.length-1}</small>`:''}<div class="cl-btns"><button class="cl-off">Wyłącz</button><button class="cl-snz">Drzemka 5 min</button></div></div>`:''; };
  const dismiss=snz=>{ const r=RING.shift(); if(!r) return; if(snz) D.snooze.push({until:Date.now()+300000,t:r.t,n:r.n,snd:r.snd});
    save(); if(RING.length) playSnd(RING[0].snd,true); else { stopSnd(); renderBar(); } ring(); };
  const api={el,ring,refresh(){ if((D.tab==='alarms'&&!edit)||D.tab==='timer') draw(); }}; CLK=api;
  root.addEventListener('mousedown',e=>{ if(!e.target.closest('input,select,textarea')) e.preventDefault(); });
  root.addEventListener('click',e=>{
    if(pickOpen&&!e.target.closest('.cl-pk,.cl-mt')){ pickOpen=false; if(D.tab==='cal') draw(); }
    const b=e.target.closest('button'); if(!b) return; const d=b.dataset;
    if(b.classList.contains('cl-off')) return dismiss(false); if(b.classList.contains('cl-snz')) return dismiss(true);
    if(d.t){ const dir=ORDER.indexOf(d.t)-ORDER.indexOf(D.tab); D.tab=d.t; edit=null; pickOpen=false; saveSoon(); return draw(dir); }
    if(d.st){ D.style=d.st; saveSoon(); return draw(); }
    if(b.classList.contains('cl-new')){ edit=newAlarm(); return draw(); }
    if(d.ed){ const a=D.alarms.find(x=>x.id===d.ed); if(a){ edit={...a,days:[...a.days]}; draw(); } return; }
    if(d.rm){ D.alarms=D.alarms.filter(x=>x.id!==d.rm); save(); return draw(); }
    if(d.wd){ const n=+d.wd, i=edit.days.indexOf(n); if(i<0) edit.days.push(n); else edit.days.splice(i,1); return b.classList.toggle('on',i<0); }
    if(b.classList.contains('cl-cn')){ edit=null; return draw(); } if(b.classList.contains('cl-ok')) return saveForm();
    if(b.classList.contains('cl-pv')) return playSnd(body.querySelector('.cl-sn').value,false);
    if(b.classList.contains('cl-pv2')) return playSnd(D.tsnd,false);
    const T=D.timer;
    if(d.pr){ T.dur=+d.pr; T.left=T.dur; T.run=false; saveSoon(); return draw(); }
    if(b.classList.contains('cl-go')){ audio();
      if(!T.run){ if(T.dur<=0) return; if(T.left<=0) T.left=T.dur; T.end=Date.now()+T.left*1000; T.run=true; } else { T.left=Math.max(0,(T.end-Date.now())/1000); T.run=false; }
      save(); return draw(); }
    if(b.classList.contains('cl-rs')){ T.run=false; T.left=T.dur; save(); return draw(); }
    const W=D.sw;
    if(b.classList.contains('cl-sg')){ if(W.run){ W.acc+=Date.now()-W.t0; W.run=false; } else { W.t0=Date.now(); W.run=true; } save(); return draw(); }
    if(b.classList.contains('cl-lp')){ if(!W.run) return; const tot=swEl(), prev=W.laps.length?W.laps[0].tot:0; W.laps.unshift({s:tot-prev,tot}); saveSoon(); return draw(); }
    if(b.classList.contains('cl-rs2')){ W.run=false; W.acc=0; W.laps=[]; save(); return draw(); }
    if(b.classList.contains('cl-mt')){ pickOpen=!pickOpen; pickY=+D.cm.slice(0,4); return draw(); }
    if(d.py){ pickY=+d.py; return draw(); }
    if(d.pm!==undefined){ D.cm=pickY+'-'+pad2(+d.pm+1); pickOpen=false; saveSoon(); return draw(); }
    if(d.m){ const [Y,M]=D.cm.split('-').map(Number), n=new Date(Y,M-1+(+d.m),1); D.cm=dkey(n).slice(0,7); saveSoon(); return draw(); }
    if(b.classList.contains('cl-tdb')){ const n=new Date(); D.sel=dkey(n); D.cm=D.sel.slice(0,7); saveSoon(); return draw(); }
    if(d.d){ D.sel=d.d; if(d.d.slice(0,7)!==D.cm){ D.cm=d.d.slice(0,7); saveSoon(); return draw(); }
      body.querySelectorAll('.cl-d').forEach(x=>x.classList.toggle('sel',x.dataset.d===D.sel)); saveSoon(); return evList(); }
    if(b.classList.contains('cl-eab')){ const tx=body.querySelector('.cl-etx').value.trim(); if(!tx) return body.querySelector('.cl-etx').focus();
      (D.events[D.sel]=D.events[D.sel]||[]).push({id:uid(),tt:tx,tm:body.querySelector('.cl-et').value}); saveSoon(); return draw(); }
    if(d.edl){ D.events[D.sel]=(D.events[D.sel]||[]).filter(x=>x.id!==d.edl); if(!D.events[D.sel].length) delete D.events[D.sel]; saveSoon(); return draw(); }
    if(d.eal){ const ev=(D.events[D.sel]||[]).find(x=>x.id===d.eal); if(!ev||!ev.tm) return;
      if(new Date(D.sel+'T'+ev.tm+':00')<=new Date()) return toast(t('Ten termin już minął'));
      D.alarms.push({id:uid(),h:+ev.tm.slice(0,2),m:+ev.tm.slice(3),date:D.sel,days:[],note:ev.tt,snd:'bell',on:true}); save(); return toast(t('Alarm dodany')); }
  });
  root.addEventListener('change',e=>{ const i=e.target;
    if(i.dataset.tg){ const a=D.alarms.find(x=>x.id===i.dataset.tg); if(!a) return; a.on=i.checked; a.missed=false; a.last='';
      if(a.on&&!a.days.length){ const tm=pad2(a.h)+':'+pad2(a.m); let d=new Date(a.date+'T'+tm+':00'); if(d<=new Date()){ const n=new Date(); if(new Date(dkey(n)+'T'+tm+':00')<=n) n.setDate(n.getDate()+1); a.date=dkey(n); } }
      save(); return draw(); }
    if(i.classList.contains('cl-h24')){ D.h24=i.checked; saveSoon(); }
    else if(i.classList.contains('cl-tsn')){ D.tsnd=i.value; saveSoon(); } });
  root.addEventListener('input',e=>{ const i=e.target; if(!i.classList.contains('cl-n')) return;
    const n=[...body.querySelectorAll('.cl-n')].map(x=>Math.max(0,parseInt(x.value,10)||0)); D.timer.dur=Math.min(359999,n[0]*3600+n[1]*60+n[2]); D.timer.left=D.timer.dur; D.timer.run=false; saveSoon();
    const go=body.querySelector('.cl-go'); if(go) go.disabled=D.timer.dur<=0; body.querySelectorAll('[data-pr]').forEach(x=>x.classList.toggle('on',+x.dataset.pr===D.timer.dur)); });
  let lt=0; const loop=ts=>{ if(!el.isConnected){ if(CLK===api) CLK=null; return; } if(ts-lt>33){ lt=ts; if(live) live(); } requestAnimationFrame(loop); };
  draw(); ring(); requestAnimationFrame(loop);
}

// ===== src/js/15-app-conv.js =====
// ---------- aplikacja: konwerter jednostek ----------
// Jednostka: [symbol, 'pl|en|de|es|fr', współczynnik względem jednostki bazowej kategorii]
const CVN=['pl','en','de','es','fr','he','zh','szl'];
const CU=a=>a.map(([s,n,f])=>({s,n:n.split('|'),f}));
const C_LEN=CU([
 ['m','metr|metre|Meter|metro|mètre',1],['km','kilometr|kilometre|Kilometer|kilómetro|kilomètre',1000],['cm','centymetr|centimetre|Zentimeter|centímetro|centimètre',.01],['mm','milimetr|millimetre|Millimeter|milímetro|millimètre',.001],
 ['µm','mikrometr|micrometre|Mikrometer|micrómetro|micromètre',1e-6],['nm','nanometr|nanometre|Nanometer|nanómetro|nanomètre',1e-9],['pm','pikometr|picometre|Pikometer|picómetro|picomètre',1e-12],['fm','femtometr (fermi)|femtometre (fermi)|Femtometer (Fermi)|femtómetro (fermi)|femtomètre (fermi)',1e-15],
 ['Å','angstrem|ångström|Ångström|ångström|ångström',1e-10],['in','cal|inch|Zoll|pulgada|pouce',.0254],['ft','stopa|foot|Fuß|pie|pied',.3048],['yd','jard|yard|Yard|yarda|yard',.9144],
 ['mi','mila lądowa|mile|Meile|milla|mille',1609.344],['nmi','mila morska|nautical mile|Seemeile|milla náutica|mille marin',1852],['fur','furlong|furlong|Furlong|furlong|furlong',201.168],['ch','łańcuch (chain)|chain|Chain|cadena|chaîne',20.1168],
 ['rd','pręt (rod)|rod|Rute|vara|perche',5.0292],['ftm','sążeń morski (fathom)|fathom|Faden|braza|brasse',1.8288],['lea','liga (league)|league|League|legua|lieue',4828.032],['hand','dłoń (hand)|hand|Hand|palmo|paume',.1016],
 ['cbt','łokieć (cubit)|cubit|Elle|codo|coudée',.4572],['stad','stadion grecki|Greek stadion|Stadion|estadio|stade',185],['vrs','wiorsta|verst|Werst|versta|verste',1066.8],['pt','punkt typograficzny|typographic point|typografischer Punkt|punto tipográfico|point typographique',.000352778],
 ['ls','sekunda świetlna|light-second|Lichtsekunde|segundo luz|seconde-lumière',299792458],['lmin','minuta świetlna|light-minute|Lichtminute|minuto luz|minute-lumière',17987547480],['lh','godzina świetlna|light-hour|Lichtstunde|hora luz|heure-lumière',1079252848800],
 ['au','jednostka astronomiczna|astronomical unit|astronomische Einheit|unidad astronómica|unité astronomique',149597870700],['ly','rok świetlny|light-year|Lichtjahr|año luz|année-lumière',9460730472580800],
 ['pc','parsek|parsec|Parsec|pársec|parsec',30856775814913673],['kpc','kiloparsek|kiloparsec|Kiloparsec|kiloparsec|kiloparsec',3.0856775814913673e19],['Mpc','megaparsek|megaparsec|Megaparsec|megapársec|mégaparsec',3.0856775814913673e22],
 ['R⊕','promień Ziemi|Earth radius|Erdradius|radio terrestre|rayon terrestre',6371008.8],['R☉','promień Słońca|solar radius|Sonnenradius|radio solar|rayon solaire',695700000],['d☾','odległość Ziemia–Księżyc|Earth–Moon distance|Entfernung Erde–Mond|distancia Tierra–Luna|distance Terre–Lune',384400000],
 ['boisko','boisko piłkarskie (długość)|football pitch (length)|Fußballfeld (Länge)|campo de fútbol (largo)|terrain de football (longueur)',105],['ℓP','długość Plancka|Planck length|Planck-Länge|longitud de Planck|longueur de Planck',1.616255e-35]]);
const C_MASS=CU([
 ['kg','kilogram|kilogram|Kilogramm|kilogramo|kilogramme',1],['g','gram|gram|Gramm|gramo|gramme',.001],['mg','miligram|milligram|Milligramm|miligramo|milligramme',1e-6],['µg','mikrogram|microgram|Mikrogramm|microgramo|microgramme',1e-9],
 ['t','tona|tonne|Tonne|tonelada|tonne',1000],['q','kwintal|quintal|Doppelzentner|quintal|quintal',100],['lb','funt|pound|Pfund|libra|livre',.45359237],['oz','uncja|ounce|Unze|onza|once',.028349523125],
 ['st','stone|stone|Stone|stone|stone',6.35029318],['tn','tona amerykańska (short ton)|US short ton|US-Tonne|tonelada corta|tonne courte',907.18474],['ton','tona brytyjska (long ton)|long ton|britische Tonne|tonelada larga|tonne longue',1016.0469088],
 ['ct','karat|carat|Karat|quilate|carat',.0002],['gr','gran (grain)|grain|Grain|grano|grain',6.479891e-5],['dr','dram|dram|Dram|dracma|gros',.0017718451953125],['ozt','uncja trojańska|troy ounce|Feinunze|onza troy|once troy',.0311034768],
 ['lbt','funt trojański|troy pound|Troy-Pfund|libra troy|livre troy',.3732417216],['dwt','pennyweight|pennyweight|Pennyweight|pennyweight|pennyweight',.00155517384],['slug','slug|slug|Slug|slug|slug',14.5939029372],
 ['u','jednostka masy atomowej (dalton)|atomic mass unit (dalton)|atomare Masseneinheit (Dalton)|unidad de masa atómica (dalton)|unité de masse atomique (dalton)',1.66053906892e-27],['me','masa elektronu|electron mass|Elektronenmasse|masa del electrón|masse de l’électron',9.1093837139e-31],
 ['mp','masa protonu|proton mass|Protonenmasse|masa del protón|masse du proton',1.67262192595e-27],['mP','masa Plancka|Planck mass|Planck-Masse|masa de Planck|masse de Planck',2.176434e-8],
 ['M☾','masa Księżyca|lunar mass|Mondmasse|masa lunar|masse lunaire',7.342e22],['M⊕','masa Ziemi|Earth mass|Erdmasse|masa terrestre|masse terrestre',5.9722e24],['M♃','masa Jowisza|Jupiter mass|Jupitermasse|masa de Júpiter|masse de Jupiter',1.89813e27],['M☉','masa Słońca|solar mass|Sonnenmasse|masa solar|masse solaire',1.98841e30]]);
const C_VOL=CU([
 ['L','litr|litre|Liter|litro|litre',1],['mL','mililitr|millilitre|Milliliter|mililitro|millilitre',.001],['cL','centylitr|centilitre|Zentiliter|centilitro|centilitre',.01],['dL','decylitr|decilitre|Deziliter|decilitro|décilitre',.1],['hL','hektolitr|hectolitre|Hektoliter|hectolitro|hectolitre',100],
 ['m³','metr sześcienny|cubic metre|Kubikmeter|metro cúbico|mètre cube',1000],['cm³','centymetr sześcienny|cubic centimetre|Kubikzentimeter|centímetro cúbico|centimètre cube',.001],['mm³','milimetr sześcienny|cubic millimetre|Kubikmillimeter|milímetro cúbico|millimètre cube',1e-6],['km³','kilometr sześcienny|cubic kilometre|Kubikkilometer|kilómetro cúbico|kilomètre cube',1e12],
 ['in³','cal sześcienny|cubic inch|Kubikzoll|pulgada cúbica|pouce cube',.016387064],['ft³','stopa sześcienna|cubic foot|Kubikfuß|pie cúbico|pied cube',28.316846592],['yd³','jard sześcienny|cubic yard|Kubikyard|yarda cúbica|yard cube',764.554857984],
 ['gal','galon amerykański|US gallon|US-Gallone|galón estadounidense|gallon américain',3.785411784],['galUK','galon brytyjski|imperial gallon|britische Gallone|galón imperial|gallon impérial',4.54609],
 ['qt','kwarta amerykańska|US quart|US-Quart|cuarto de galón (EE. UU.)|quart américain',.946352946],['pt US','pinta amerykańska|US pint|US-Pint|pinta (EE. UU.)|pinte américaine',.473176473],['pt UK','pinta brytyjska|imperial pint|britische Pinte|pinta imperial|pinte impériale',.56826125],
 ['cup','szklanka amerykańska (cup)|US cup|US-Cup|taza (EE. UU.)|tasse américaine',.2365882365],['gill','gill amerykański|US gill|US-Gill|gill (EE. UU.)|gill américain',.1182941183],['fl oz US','uncja płynu (US)|US fluid ounce|US-Flüssigunze|onza líquida (EE. UU.)|once liquide américaine',.0295735295625],
 ['fl oz UK','uncja płynu (UK)|imperial fluid ounce|britische Flüssigunze|onza líquida imperial|once liquide impériale',.0284130625],['tbsp','łyżka stołowa (US)|US tablespoon|US-Esslöffel|cucharada (EE. UU.)|cuillère à soupe (US)',.01478676478125],['tsp','łyżeczka (US)|US teaspoon|US-Teelöffel|cucharadita (EE. UU.)|cuillère à café (US)',.00492892159375],
 ['łyż','łyżka (15 mL)|metric tablespoon (15 mL)|metrischer Esslöffel (15 ml)|cucharada métrica (15 ml)|cuillère à soupe métrique (15 ml)',.015],['szkl','szklanka (250 mL)|metric cup (250 mL)|metrische Tasse (250 ml)|taza métrica (250 ml)|tasse métrique (250 ml)',.25],
 ['kr','kropla (ok. 0,05 mL)|drop (approx. 0.05 mL)|Tropfen (ca. 0,05 ml)|gota (aprox. 0,05 ml)|goutte (env. 0,05 ml)',5e-5],['bbl','baryłka ropy|oil barrel|Ölfass|barril de petróleo|baril de pétrole',158.987294928],
 ['bu','buszel amerykański|US bushel|US-Bushel|bushel (EE. UU.)|boisseau américain',35.23907016688],['pk','peck amerykański|US peck|US-Peck|peck (EE. UU.)|peck américain',8.80976754172],['hhd','hogshead|hogshead|Hogshead|hogshead|hogshead',238.4809423],
 ['wine','butelka wina (0,75 L)|wine bottle (0.75 L)|Weinflasche (0,75 l)|botella de vino (0,75 l)|bouteille de vin (0,75 l)',.75],['mag','magnum (1,5 L)|magnum (1.5 L)|Magnum (1,5 l)|magnum (1,5 l)|magnum (1,5 l)',1.5],['neb','nabuchodonozor (15 L)|Nebuchadnezzar (15 L)|Nebukadnezar (15 l)|nabucodonosor (15 l)|Nabuchodonosor (15 l)',15],
 ['ac ft','akr-stopa|acre-foot|Acre-Foot|acre-pie|acre-pied',1233481.83754752],['pool','basen olimpijski|Olympic swimming pool|olympisches Schwimmbecken|piscina olímpica|piscine olympique',2500000]]);
const C_TIME=CU([
 ['s','sekunda|second|Sekunde|segundo|seconde',1],['ms','milisekunda|millisecond|Millisekunde|milisegundo|milliseconde',.001],['µs','mikrosekunda|microsecond|Mikrosekunde|microsegundo|microseconde',1e-6],['ns','nanosekunda|nanosecond|Nanosekunde|nanosegundo|nanoseconde',1e-9],['ps','pikosekunda|picosecond|Pikosekunde|picosegundo|picoseconde',1e-12],
 ['min','minuta|minute|Minute|minuto|minute',60],['h','godzina|hour|Stunde|hora|heure',3600],['d','doba|day|Tag|día|jour',86400],['wk','tydzień|week|Woche|semana|semaine',604800],['fn','dwa tygodnie (fortnight)|fortnight|vierzehn Tage|quincena|quinzaine',1209600],
 ['mo','miesiąc (średni)|month (average)|Monat (Durchschnitt)|mes (promedio)|mois (moyen)',2629746],['yr','rok (gregoriański)|year (Gregorian)|Jahr (gregorianisch)|año (gregoriano)|année (grégorienne)',31556952],['yrJ','rok juliański|Julian year|julianisches Jahr|año juliano|année julienne',31557600],
 ['yrS','rok gwiazdowy|sidereal year|Sternjahr|año sidéreo|année sidérale',31558149.76],['dec','dekada|decade|Jahrzehnt|década|décennie',315569520],['cen','wiek|century|Jahrhundert|siglo|siècle',3155695200],['mil','tysiąclecie|millennium|Jahrtausend|milenio|millénaire',31556952000],
 ['qh','kwadrans|quarter of an hour|Viertelstunde|cuarto de hora|quart d’heure',900],['sd','doba gwiazdowa|sidereal day|Sternentag|día sidéreo|jour sidéral',86164.0905],['sol','dzień marsjański (sol)|Martian day (sol)|Marstag (Sol)|día marciano (sol)|jour martien (sol)',88775.244],
 ['chk','chelek (hebrajski)|chelek (Hebrew)|Chelek (hebräisch)|jélek (hebreo)|héleq (hébreu)',10/3],['ke','ke (chiński)|ke (Chinese)|Ke (chinesisch)|ke (chino)|ke (chinois)',864],['shk','shake|shake|Shake|shake|shake',1e-8],['jif','jiffy (1/60 s)|jiffy (1/60 s)|Jiffy (1/60 s)|jiffy (1/60 s)|jiffy (1/60 s)',1/60],
 ['tP','czas Plancka|Planck time|Planck-Zeit|tiempo de Planck|temps de Planck',5.391247e-44],['Uni','wiek Wszechświata|age of the Universe|Alter des Universums|edad del Universo|âge de l’Univers',4.3508e17]]);
const C_AREA=CU([
 ['m²','metr kwadratowy|square metre|Quadratmeter|metro cuadrado|mètre carré',1],['km²','kilometr kwadratowy|square kilometre|Quadratkilometer|kilómetro cuadrado|kilomètre carré',1e6],['cm²','centymetr kwadratowy|square centimetre|Quadratzentimeter|centímetro cuadrado|centimètre carré',1e-4],['mm²','milimetr kwadratowy|square millimetre|Quadratmillimeter|milímetro cuadrado|millimètre carré',1e-6],
 ['ha','hektar|hectare|Hektar|hectárea|hectare',1e4],['a','ar|are|Ar|área|are',100],['dun','dunam|dunam|Dunam|dunam|dounam',1000],['ac','akr|acre|Acre|acre|acre',4046.8564224],['rood','rood|rood|Rood|rood|rood',1011.7141056],
 ['in²','cal kwadratowy|square inch|Quadratzoll|pulgada cuadrada|pouce carré',6.4516e-4],['ft²','stopa kwadratowa|square foot|Quadratfuß|pie cuadrado|pied carré',.09290304],['yd²','jard kwadratowy|square yard|Quadratyard|yarda cuadrada|yard carré',.83612736],
 ['mi²','mila kwadratowa|square mile|Quadratmeile|milla cuadrada|mille carré',2589988.110336],['twp','township (36 mi²)|township (36 mi²)|Township (36 mi²)|township (36 mi²)|township (36 mi²)',93239571.972],['morga','morga pruska|Prussian morgen|preußischer Morgen|morgen prusiano|morgen prussien',2553.22],
 ['tsubo','tsubo|tsubo|Tsubo|tsubo|tsubo',3.30578512],['cmil','circular mil|circular mil|Circular Mil|circular mil|circular mil',5.067075e-10],['barn','barn|barn|Barn|barn|barn',1e-28],['shed','shed|shed|Shed|shed|shed',1e-52],['pitch','boisko piłkarskie|football pitch|Fußballfeld|campo de fútbol|terrain de football',7140]]);
const KT={ // temperatura: przeliczenia przez kelwiny
 C:[v=>v+273.15,k=>k-273.15],K:[v=>v,k=>k],F:[v=>(v+459.67)*5/9,k=>k*9/5-459.67],R:[v=>v*5/9,k=>k*9/5],Re:[v=>v*1.25+273.15,k=>(k-273.15)*.8],
 De:[v=>373.15-v*2/3,k=>(373.15-k)*1.5],N:[v=>v*100/33+273.15,k=>(k-273.15)*.33],Ro:[v=>(v-7.5)*40/21+273.15,k=>(k-273.15)*21/40+7.5],TP:[v=>v*1.416784e32,k=>k/1.416784e32]};
const C_TEMP=[['C','stopień Celsjusza|degree Celsius|Grad Celsius|grado Celsius|degré Celsius','°C'],['K','kelwin|kelvin|Kelvin|kelvin|kelvin','K'],['F','stopień Fahrenheita|degree Fahrenheit|Grad Fahrenheit|grado Fahrenheit|degré Fahrenheit','°F'],
 ['R','stopień Rankine’a|degree Rankine|Grad Rankine|grado Rankine|degré Rankine','°R'],['Re','stopień Réaumura|degree Réaumur|Grad Réaumur|grado Réaumur|degré Réaumur','°Ré'],['De','stopień Delisle’a|degree Delisle|Grad Delisle|grado Delisle|degré Delisle','°De'],
 ['N','stopień Newtona|degree Newton|Grad Newton|grado Newton|degré Newton','°N'],['Ro','stopień Rømera|degree Rømer|Grad Rømer|grado Rømer|degré Rømer','°Rø'],['TP','temperatura Plancka|Planck temperature|Planck-Temperatur|temperatura de Planck|température de Planck','T_P']]
 .map(([k,n,s])=>({s,n:n.split('|'),to:KT[k][0],from:KT[k][1]}));
const C_SPEED=CU([
 ['m/s','metr na sekundę|metre per second|Meter pro Sekunde|metro por segundo|mètre par seconde',1],['km/h','kilometr na godzinę|kilometre per hour|Kilometer pro Stunde|kilómetro por hora|kilomètre par heure',1/3.6],['mph','mila na godzinę|mile per hour|Meile pro Stunde|milla por hora|mille par heure',.44704],
 ['kn','węzeł|knot|Knoten|nudo|nœud',1852/3600],['ft/s','stopa na sekundę|foot per second|Fuß pro Sekunde|pie por segundo|pied par seconde',.3048],['km/s','kilometr na sekundę|kilometre per second|Kilometer pro Sekunde|kilómetro por segundo|kilomètre par seconde',1000],
 ['cm/s','centymetr na sekundę|centimetre per second|Zentimeter pro Sekunde|centímetro por segundo|centimètre par seconde',.01],['Ma','Mach (poziom morza, 15 °C)|Mach (sea level, 15 °C)|Mach (Meereshöhe, 15 °C)|Mach (nivel del mar, 15 °C)|Mach (niveau de la mer, 15 °C)',340.29],
 ['c','prędkość światła|speed of light|Lichtgeschwindigkeit|velocidad de la luz|vitesse de la lumière',299792458],['v⊕','prędkość ucieczki z Ziemi|Earth escape velocity|Fluchtgeschwindigkeit der Erde|velocidad de escape de la Tierra|vitesse de libération terrestre',11186],
 ['vorb','prędkość orbitalna Ziemi|Earth orbital speed|Bahngeschwindigkeit der Erde|velocidad orbital de la Tierra|vitesse orbitale de la Terre',29780],['f/f','furlong na dwa tygodnie|furlong per fortnight|Furlong pro vierzehn Tage|furlong por quincena|furlong par quinzaine',201.168/1209600]]);
const C_DATA=(()=>{ const B=['bajt|byte|Byte|byte|octet'.split('|'),'bit|bit|Bit|bit|bit'.split('|')], out=[{s:'bit',n:B[1],f:1},{s:'nibble',n:'półbajt (nibble)|nibble|Nibble|nibble|quartet'.split('|'),f:4},{s:'B',n:B[0],f:8}];
  const P=[['k','kilo|kilo|Kilo|kilo|kilo'],['M','mega|mega|Mega|mega|méga'],['G','giga|giga|Giga|giga|giga'],['T','tera|tera|Tera|tera|téra'],['P','peta|peta|Peta|peta|péta'],['E','eksa|exa|Exa|exa|exa']].map(([s,n])=>[s,n.split('|')]);
  const I=['kibi','mebi','gibi','tebi','pebi','exbi'], nm=(p,b,i)=>i===2?p+b.toLowerCase():p+b;
  P.forEach(([s,pn],k)=>{ out.push({s:s+'B',n:B[0].map((b,i)=>nm(pn[i],b,i)),f:8*Math.pow(1000,k+1)}); out.push({s:(s==='k'?'K':s)+'iB',n:B[0].map((b,i)=>(i===2?capF(I[k])+b.toLowerCase():I[k]+b)),f:8*Math.pow(1024,k+1)}); });
  P.forEach(([s,pn],k)=>out.push({s:s+'b',n:B[1].map((b,i)=>nm(pn[i],b,i)),f:Math.pow(1000,k+1)}));
  return out; })();
const C_ENERGY=CU([
 ['J','dżul|joule|Joule|julio|joule',1],['kJ','kilodżul|kilojoule|Kilojoule|kilojulio|kilojoule',1000],['MJ','megadżul|megajoule|Megajoule|megajulio|mégajoule',1e6],['cal','kaloria (mała)|calorie|Kalorie|caloría|calorie',4.184],['kcal','kilokaloria|kilocalorie|Kilokalorie|kilocaloría|kilocalorie',4184],
 ['Wh','watogodzina|watt-hour|Wattstunde|vatio-hora|wattheure',3600],['kWh','kilowatogodzina|kilowatt-hour|Kilowattstunde|kilovatio-hora|kilowattheure',3.6e6],['MWh','megawatogodzina|megawatt-hour|Megawattstunde|megavatio-hora|mégawattheure',3.6e9],
 ['eV','elektronowolt|electronvolt|Elektronenvolt|electronvoltio|électronvolt',1.602176634e-19],['keV','kiloelektronowolt|kiloelectronvolt|Kiloelektronenvolt|kiloelectronvoltio|kiloélectronvolt',1.602176634e-16],['MeV','megaelektronowolt|megaelectronvolt|Megaelektronenvolt|megaelectronvoltio|mégaélectronvolt',1.602176634e-13],
 ['erg','erg|erg|Erg|ergio|erg',1e-7],['BTU','brytyjska jednostka cieplna (BTU)|British thermal unit (BTU)|British Thermal Unit (BTU)|unidad térmica británica (BTU)|British thermal unit (BTU)',1055.05585262],['therm','therm (US)|therm (US)|Therm (US)|therm (EE. UU.)|therm (US)',105480400],
 ['ft·lbf','stopofunt-siła|foot-pound force|Fuß-Pfund-Kraft|libra-pie|pied-livre-force',1.3558179483314004],['L·atm','litroatmosfera|litre-atmosphere|Literatmosphäre|litro-atmósfera|litre-atmosphère',101.325],['hp·h','koń mechaniczny na godzinę|horsepower-hour|Pferdestärkenstunde|caballo de vapor-hora|cheval-vapeur-heure',2684519.537696],
 ['toe','tona ekwiwalentu ropy|tonne of oil equivalent|Tonne Öläquivalent|tonelada equivalente de petróleo|tonne d’équivalent pétrole',4.1868e10],['tTNT','tona trotylu (TNT)|ton of TNT|Tonne TNT|tonelada de TNT|tonne de TNT',4.184e9],['MtTNT','megatona trotylu|megaton of TNT|Megatonne TNT|megatonelada de TNT|mégatonne de TNT',4.184e15],
 ['Eh','hartree|hartree|Hartree|hartree|hartree',4.3597447222e-18],['Ry','rydberg|rydberg|Rydberg|rydberg|rydberg',2.1798723611e-18],['EP','energia Plancka|Planck energy|Planck-Energie|energía de Planck|énergie de Planck',1.9561e9],['foe','foe (10^44 J)|foe (10^44 J)|Foe (10^44 J)|foe (10^44 J)|foe (10^44 J)',1e44]]);
const C_PRES=CU([
 ['Pa','paskal|pascal|Pascal|pascal|pascal',1],['hPa','hektopaskal|hectopascal|Hektopascal|hectopascal|hectopascal',100],['kPa','kilopaskal|kilopascal|Kilopascal|kilopascal|kilopascal',1000],['MPa','megapaskal|megapascal|Megapascal|megapascal|mégapascal',1e6],['GPa','gigapaskal|gigapascal|Gigapascal|gigapascal|gigapascal',1e9],
 ['bar','bar|bar|Bar|bar|bar',1e5],['mbar','milibar|millibar|Millibar|milibar|millibar',100],['atm','atmosfera fizyczna|standard atmosphere|physikalische Atmosphäre|atmósfera estándar|atmosphère normale',101325],['at','atmosfera techniczna|technical atmosphere|technische Atmosphäre|atmósfera técnica|atmosphère technique',98066.5],
 ['mmHg','milimetr słupa rtęci|millimetre of mercury|Millimeter Quecksilbersäule|milímetro de mercurio|millimètre de mercure',133.322387415],['Torr','tor|torr|Torr|torr|torr',101325/760],['inHg','cal słupa rtęci|inch of mercury|Zoll Quecksilbersäule|pulgada de mercurio|pouce de mercure',3386.389],
 ['psi','funt na cal kwadratowy (psi)|pound per square inch (psi)|Pfund pro Quadratzoll (psi)|libra por pulgada cuadrada (psi)|livre par pouce carré (psi)',6894.757293168],['ksi','kilofunt na cal kwadratowy (ksi)|kilopound per square inch (ksi)|Kilopfund pro Quadratzoll (ksi)|kilolibra por pulgada cuadrada (ksi)|kilolivre par pouce carré (ksi)',6894757.293168],
 ['inH₂O','cal słupa wody|inch of water|Zoll Wassersäule|pulgada de agua|pouce d’eau',249.08891],['mmH₂O','milimetr słupa wody|millimetre of water|Millimeter Wassersäule|milímetro de agua|millimètre d’eau',9.80665],['Ba','barie|barye|Barye|baria|barye',.1]]);
const CATS=[
 {id:'len',ic:'📏',n:'Długość',u:C_LEN,df:['km','mi']},{id:'mass',ic:'⚖️',n:'Waga i masa',u:C_MASS,df:['kg','lb']},{id:'vol',ic:'🧪',n:'Objętość',u:C_VOL,df:['L','gal']},
 {id:'time',ic:'⏳',n:'Czas',u:C_TIME,df:['h','min']},{id:'area',ic:'🗺️',n:'Powierzchnia',u:C_AREA,df:['m²','ft²']},{id:'temp',ic:'🌡️',n:'Temperatura',u:C_TEMP,df:['C','F'],tmp:1},
 {id:'speed',ic:'🚀',n:'Prędkość',u:C_SPEED,df:['km/h','mph']},{id:'data',ic:'💾',n:'Dane',u:C_DATA,df:['GB','MiB']},{id:'en',ic:'⚡',n:'Energia',u:C_ENERGY,df:['kcal','kJ']},{id:'pres',ic:'🎈',n:'Ciśnienie',u:C_PRES,df:['bar','psi']},{id:'fx',ic:'💱',n:'Waluty',u:[],df:['PLN','USD']}];
// temperatura ma symbole ze znakiem stopnia; df wskazuje klucze C/F, więc mapujemy je na symbole
CATS.find(c=>c.id==='temp').df=['°C','°F'];
const IUN={m:'meter',km:'kilometer',cm:'centimeter',mm:'millimeter','in':'inch',ft:'foot',yd:'yard',mi:'mile',kg:'kilogram',g:'gram',lb:'pound',oz:'ounce',st:'stone',L:'liter',mL:'milliliter',gal:'gallon','fl oz US':'fluid-ounce',
  s:'second',ms:'millisecond','µs':'microsecond',ns:'nanosecond',min:'minute',h:'hour',d:'day',wk:'week',mo:'month',yr:'year',ha:'hectare',ac:'acre','°C':'celsius','°F':'fahrenheit','km/h':'kilometer-per-hour',mph:'mile-per-hour','m/s':'meter-per-second',
  bit:'bit',B:'byte',kB:'kilobyte',MB:'megabyte',GB:'gigabyte',TB:'terabyte',PB:'petabyte',kb:'kilobit',Mb:'megabit',Gb:'gigabit',Tb:'terabit'};
const IUC={};
function unitIntl(sym,loc){ const id=IUN[sym]; if(!id) return null; const k=loc+'|'+id; if(k in IUC) return IUC[k]; let r=null;
  try{ const p=new Intl.NumberFormat(loc,{style:'unit',unit:id,unitDisplay:'long'}).formatToParts(1).find(x=>x.type==='unit'); r=(p&&p.value.trim())||null; }catch{} return IUC[k]=r; }
function cvFmt(n,L,sig){ sig=sig||12; if(!isFinite(n)) return '—'; if(n===0) return '0'; const a=Math.abs(n), dec=(1.1).toLocaleString(L).charAt(1);
  if(a>=1e15||a<1e-6) return n.toExponential(6).replace(/\.?0+e/,'e').replace('e+','e').replace('.',dec);
  return n.toLocaleString(L,{maximumSignificantDigits:sig}); }
// ---------- waluty: kursy pobiera proces główny (bez CORS), wynik trafia do pamięci podręcznej w S ----------
// Waluty o kursie ustalonym prawnie: [waluta bazowa, ile jednostek bazowych to 1 taka jednostka]
const FIXED={PLZ:['PLN',1e-4],DEM:['EUR',1/1.95583],FRF:['EUR',1/6.55957],ITL:['EUR',1/1936.27],ESP:['EUR',1/166.386],NLG:['EUR',1/2.20371],ATS:['EUR',1/13.7603],BEF:['EUR',1/40.3399],FIM:['EUR',1/5.94573],
 IEP:['EUR',1/.787564],PTE:['EUR',1/200.482],GRD:['EUR',1/340.75],LUF:['EUR',1/40.3399],SIT:['EUR',1/239.64],CYP:['EUR',1/.585274],MTL:['EUR',1/.4293],SKK:['EUR',1/30.126],EEK:['EUR',1/15.6466],LVL:['EUR',1/.702804],
 LTL:['EUR',1/3.4528],HRK:['EUR',1/7.5345],RUR:['RUB',1e-3],TRL:['TRY',1e-6],ROL:['RON',1e-4],BYR:['BYN',1e-4],AZM:['AZN',1/5000],TMM:['TMT',1/5000],MZM:['MZN',1e-3],GHC:['GHS',1e-4],SRG:['SRD',1e-3],MGF:['MGA',1/5]};
const PLZN=['złoty przed denominacją (do 1994)','Polish złoty before redenomination (to 1994)','Złoty vor der Denominierung (bis 1994)','esloti antes de la desnominación (hasta 1994)','złoty avant la dénomination (jusqu’en 1994)','זלוטי פולני לפני הדנומינציה (עד 1994)','波蘭茲羅提（1994 年面額改革前）','złoty przed denominacyjōm (do 1994)'];
const FXPRI=['PLN','PLZ','USD','EUR','GBP','CHF','CZK','UAH','NOK','SEK','DKK','HUF','JPY','CNY','CAD','AUD','TRY','RUB'];
const FXR=[['1M',30],['3M',90],['1R',365],['5L',1825]];
const FXCH=new Map();
const CVORD=['len','area','vol','mass','time','speed','temp','pres','en','data','fx'];   // kolejność tematyczna w panelu   // wykresy w pamięci na czas sesji
function mountConv(el,w){
  const LC=S.settings.ui.lang, L=IL(), li=Math.max(0,CVN.indexOf(LC)), D=(S.aw.data.conv=S.aw.data.conv||{cat:'len',f:{},t:{},v:'1'});
  if(!CATS.find(c=>c.id===D.cat)) D.cat='len'; if(D.slot!=='f'&&D.slot!=='t') D.slot='f'; if(!D.rg) D.rg=30;
  el.innerHTML=`<div class="cvw"><div class="cv" tabindex="0"><div class="cv-top"><button class="cv-mn" title="Kategorie">☰</button><b class="cv-cn"></b></div><div class="cv-main">
    <div class="cv-row" data-slot="f"><input class="cv-in" inputmode="decimal" spellcheck="false" autocomplete="off"><button class="cv-u" data-slot="f"></button></div>
    <button class="cv-sw" title="Zamień jednostki">⇅</button>
    <div class="cv-row" data-slot="t"><div class="cv-out"></div><button class="cv-u" data-slot="t"></button><button class="cv-cp" title="Kopiuj wynik">⧉</button></div>
    <div class="cv-eq"></div></div><div class="cv-fx"></div>
    <div class="cv-all"><div class="cv-ah"><b class="cv-hd"></b><input class="cv-q" placeholder="Szukaj jednostki…" spellcheck="false"></div><div class="cv-al"></div></div></div><div class="cv-bk"></div><div class="cv-dr"><div class="cv-dh">Kategorie</div><div class="cv-di"></div></div></div>`;
  const wrap=el.firstElementChild, root=wrap.querySelector('.cv'), cats=wrap.querySelector('.cv-di'), cname=wrap.querySelector('.cv-cn'), inp=root.querySelector('.cv-in'), out=root.querySelector('.cv-out'), eq=root.querySelector('.cv-eq'), fxb=root.querySelector('.cv-fx'), al=root.querySelector('.cv-al'), q=root.querySelector('.cv-q'), hd=root.querySelector('.cv-hd');
  const cat=()=>CATS.find(c=>c.id===D.cat), nm=u=>u.n[li]||unitIntl(u.s,L)||(LC==='szl'?u.n[0]:(u.n[1]||u.n[0])), un=(c,s)=>c.u.find(x=>x.s===s)||c.u[0], cur=slot=>un(cat(),D[slot][D.cat]);
  const conv=(v,c,a,b)=>c.tmp?b.from(a.to(v)):v*a.f/b.f;
  const num=()=>{ const s=D.v.trim().replace(/\s/g,'').replace(',','.'); return s===''||s==='-'?NaN:Number(s); };
  const F=()=>D.fx||(D.fx={});
  let fxBusy=false, fxErr='', tok=0;
  // --- lista walut z kursów ---
  function fxBuild(){
    const C=CATS.find(c=>c.id==='fx'), R=F().rates; if(!R){ C.u=[]; return; }
    let dn=null; try{ dn=new Intl.DisplayNames([L],{type:'currency'}); }catch{}
    const name=c=>{ if(c==='PLZ') return PLZN[li]; let n=c; try{ n=(dn&&dn.of(c))||c; }catch{} return capF(n); }, u=[];
    Object.keys(R).forEach(c=>{ if(!FIXED[c]&&R[c]>0) u.push({s:c,n:[name(c)],f:1/R[c]}); });
    Object.keys(FIXED).forEach(c=>{ const [b,m]=FIXED[c]; if(R[b]>0) u.push({s:c,n:[name(c)],f:m/R[b]}); });
    u.sort((a,b)=>{ const x=FXPRI.indexOf(a.s), y=FXPRI.indexOf(b.s); if(x>=0||y>=0) return (x<0?99:x)-(y<0?99:y); return a.n[0].localeCompare(b.n[0],L); });
    C.u=u;
  }
  async function fxFetch(force){
    const f=F(); if(!force&&f.rates&&Date.now()-(f.ts||0)<6*3600e3) return;
    fxBusy=true; fxErr=''; fxPanel();
    try{ const r=await window.api.httpGet('https://open.er-api.com/v6/latest/USD'); if(!r||!r.ok) throw new Error(r&&r.err||'net');
      const j=JSON.parse(r.body); if(j.result!=='success'||!j.rates) throw new Error('bad'); f.rates=j.rates; f.ts=Date.now(); f.upd=j.time_last_update_utc||''; save(); }
    catch(e){ fxErr=String(e.message||e); }
    fxBusy=false; if(!el.isConnected) return; fxBuild(); if(D.cat==='fx'){ drawSel(); run(); renderList(false); fxPanel(); }
  }
  const mk=c=>FIXED[c]?{code:FIXED[c][0],m:FIXED[c][1]}:{code:c,m:1};
  async function fxSeries(a,b,days){
    const A=mk(a.s), B=mk(b.s); if(A.code===B.code) return {flat:1};
    const key=A.code+B.code+days; if(FXCH.has(key)) return FXCH.get(key);
    const f=F(); if(!f.ecb){ const r=await window.api.httpGet('https://api.frankfurter.dev/v1/currencies'); if(!r||!r.ok) throw new Error('net'); f.ecb=Object.keys(JSON.parse(r.body)); if(!f.ecb.includes('EUR')) f.ecb.push('EUR'); save(); }
    if(!f.ecb.includes(A.code)||!f.ecb.includes(B.code)) return {none:1};
    const r=await window.api.httpGet(`https://api.frankfurter.dev/v1/${dkey(new Date(Date.now()-days*864e5))}..${dkey(new Date())}?base=${A.code}&symbols=${B.code}`); if(!r||!r.ok) throw new Error('net');
    const j=JSON.parse(r.body), pts=Object.keys(j.rates||{}).sort().map(d=>[d,j.rates[d][B.code]*A.m/B.m]); const o=pts.length>1?{pts}:{none:1}; FXCH.set(key,o); return o;
  }
  function chartSvg(pts){
    const vs=pts.map(p=>p[1]), mn=Math.min(...vs), mx=Math.max(...vs), sp=(mx-mn)||mx*.01||1, n=pts.length, X=i=>i/(n-1)*300, Y=v=>6+(1-(v-mn)/sp)*88;
    const path=pts.map((p,i)=>(i?'L':'M')+X(i).toFixed(1)+' '+Y(p[1]).toFixed(1)).join('');
    return `<div class="cv-cw"><div class="cv-sv"><svg class="cv-svg" viewBox="0 0 300 100" preserveAspectRatio="none"><defs><linearGradient id="cvg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--acc);stop-opacity:.35"/><stop offset="1" style="stop-color:var(--acc);stop-opacity:0"/></linearGradient></defs>
      <path d="${path}L300 100L0 100Z" fill="url(#cvg)"/><path d="${path}" class="cv-ln"/><line class="cv-xl" y1="0" y2="100" x1="-9" x2="-9"/></svg><i class="cv-dot"></i></div><div class="cv-ya"><span>${cvFmt(mx,L,5)}</span><span>${cvFmt(mn,L,5)}</span></div></div><div class="cv-tt"> </div>`;
  }
  function bindChart(host,pts){
    const sv=host.querySelector('.cv-sv'); if(!sv) return; const dot=host.querySelector('.cv-dot'), xl=host.querySelector('.cv-xl'), tt=host.querySelector('.cv-tt'), n=pts.length, b=cur('t');
    const vs=pts.map(p=>p[1]), mn=Math.min(...vs), mx=Math.max(...vs), sp=(mx-mn)||mx*.01||1;
    const show=i=>{ const p=pts[i], x=i/(n-1); dot.style.left=(x*100)+'%'; dot.style.top=(6+(1-(p[1]-mn)/sp)*88)+'%'; xl.setAttribute('x1',x*300); xl.setAttribute('x2',x*300);
      tt.textContent=new Date(p[0]+'T12:00').toLocaleDateString(L,{day:'numeric',month:'short',year:'numeric'})+' · '+cvFmt(p[1],L,6)+' '+b.s; };
    show(n-1);
    sv.addEventListener('mousemove',e=>{ const r=sv.getBoundingClientRect(); show(Math.max(0,Math.min(n-1,Math.round((e.clientX-r.left)/r.width*(n-1))))); });
    sv.addEventListener('mouseleave',()=>show(n-1));
  }
  async function loadChart(){
    const host=fxb.querySelector('.cv-chart'); if(!host) return; const c=cat(), a=un(c,D.f.fx), b=un(c,D.t.fx), my=++tok; host.innerHTML='<p class="hint">…</p>';
    try{ const o=await fxSeries(a,b,D.rg); if(my!==tok||!el.isConnected) return;
      if(o.flat) host.innerHTML=`<p class="hint">${t('Kurs stały (wartość ustalona prawnie).')}</p>`; else if(o.none) host.innerHTML=`<p class="hint">${t('Wykres niedostępny dla tej pary walut.')}</p>`; else { host.innerHTML=chartSvg(o.pts); bindChart(host,o.pts); } }
    catch{ if(my===tok&&el.isConnected) host.innerHTML=`<p class="hint">${t('Nie udało się pobrać wykresu.')}</p>`; }
  }
  function fxPanel(){
    if(D.cat!=='fx'){ fxb.innerHTML=''; return; }
    const c=cat(), f=F();
    if(!c.u.length){ fxb.innerHTML=`<p class="hint">${fxBusy?t('Pobieranie kursów…'):t('Brak kursów. Sprawdź połączenie z internetem.')}</p>${fxBusy?'':`<button class="cv-rt">${t('Spróbuj ponownie')}</button>`}`; return; }
    const a=un(c,D.f.fx), b=un(c,D.t.fx), when=f.ts?new Date(f.ts).toLocaleString(L,{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}):'';
    fxb.innerHTML=`<div class="cv-fa">${esc(t('{a} to w przeliczeniu').replace('{a}','1 '+nm(a)))}</div><div class="cv-fb">${esc(cvFmt(a.f/b.f,L,6))} ${esc(nm(b))}</div>
      <div class="cv-fc">${esc(fxErr?t('Kursy z pamięci (brak połączenia)')+' · '+when:t('Aktualizacja: {d}').replace('{d}',when))} · Rates By Exchange Rate API</div>
      <div class="cv-rg">${FXR.map(([k,d])=>`<button data-r="${d}" class="${D.rg===d?'on':''}">${t(k)}</button>`).join('')}</div><div class="cv-chart"></div>`;
    loadChart();
  }
  // --- widok ---
  function drawCats(){ cats.innerHTML=CVORD.map(id=>CATS.find(c=>c.id===id)).map(c=>`<button data-c="${c.id}" class="${c.id===D.cat?'on':''}"><i>${c.ic}</i><span>${t(c.n)}</span></button>`).join(''); const c=cat(); cname.textContent=c.ic+' '+t(c.n); }
  function drawSel(){ const c=cat(); if(!c.u.length){ root.querySelectorAll('.cv-u').forEach(b=>{ b.textContent='—'; }); return; }
    D.f[c.id]=un(c,D.f[c.id]||c.df[0]).s; D.t[c.id]=un(c,D.t[c.id]||c.df[1]).s;
    root.querySelectorAll('.cv-u').forEach(b=>{ const u=cur(b.dataset.slot); b.textContent=`${nm(u)} (${u.s})`; }); }
  function setSlotUI(){ root.querySelectorAll('.cv-row').forEach(r=>r.classList.toggle('act',r.dataset.slot===D.slot)); hd.textContent=t(D.slot==='f'?'Przeliczasz z:':'Przeliczasz na:'); }
  function run(){ const c=cat(); if(!c.u.length){ out.textContent='—'; eq.textContent=''; return; }
    const a=cur('f'), b=cur('t'), v=num(), r=conv(v,c,a,b);
    out.textContent=isNaN(v)?'—':cvFmt(r,L); out.classList.toggle('big',out.textContent.length>11); eq.textContent=`1 ${a.s} = ${cvFmt(conv(1,c,a,b),L)} ${b.s}`; }
  function renderList(scroll){ const c=cat(), sel=c.u.length?D[D.slot][c.id]:'', f=q.value.trim().toLowerCase();
    if(!c.u.length){ al.innerHTML=`<p class="hint">${fxBusy?t('Pobieranie kursów…'):'—'}</p>`; return; }
    al.innerHTML=c.u.filter(u=>!f||nm(u).toLowerCase().includes(f)||u.s.toLowerCase().includes(f)).map(u=>`<div class="cv-r${u.s===sel?' on':''}" data-s="${esc(u.s)}"><span>${esc(nm(u))}</span><small>${esc(u.s)}</small></div>`).join('')||'<p class="hint">—</p>';
    const on=al.querySelector('.on'); if(scroll&&on) al.scrollTop=Math.max(0,on.offsetTop-al.clientHeight/2+on.offsetHeight/2); }
  function setSlot(s){ if(D.slot===s) return; D.slot=s; saveSoon(); setSlotUI(); renderList(true); }
  function full(){ drawCats(); drawSel(); inp.value=D.v; run(); setSlotUI(); renderList(true); fxPanel(); if(D.cat==='fx') fxFetch(false); }
  inp.addEventListener('input',()=>{ D.v=inp.value; saveSoon(); run(); });
  inp.addEventListener('focus',()=>setSlot('f'));
  q.addEventListener('input',()=>renderList(false));
  root.addEventListener('mousedown',e=>{ if(!e.target.closest('input')) e.preventDefault(); });
  root.addEventListener('click',e=>{
    const r=e.target.closest('.cv-r');
    if(r){ D[D.slot][D.cat]=r.dataset.s; saveSoon(); drawSel(); run(); renderList(false); fxPanel(); return; }
    const b=e.target.closest('button');
    if(b){
      if(b.dataset.c){ D.cat=b.dataset.c; saveSoon(); q.value=''; return full(); }
      if(b.classList.contains('cv-sw')){ const c=D.cat, x=D.f[c]; D.f[c]=D.t[c]; D.t[c]=x; saveSoon(); drawSel(); run(); renderList(true); return fxPanel(); }
      if(b.classList.contains('cv-cp')){ const s=out.textContent; if(s==='—') return; try{ navigator.clipboard.writeText(s).then(()=>toast(t('Skopiowano'))).catch(()=>{}); }catch{} return; }
      if(b.dataset.r){ D.rg=+b.dataset.r; saveSoon(); return fxPanel(); }
      if(b.classList.contains('cv-rt')) return fxFetch(true);
    }
    const row=e.target.closest('.cv-row'); if(row) setSlot(row.dataset.slot);
  });
  wrap.addEventListener('click',e=>{
    if(e.target.closest('.cv-mn')){ wrap.classList.toggle('dopen'); return; }
    if(e.target.closest('.cv-bk')){ wrap.classList.remove('dopen'); return; }
    const b=e.target.closest('.cv-di button'); if(b){ D.cat=b.dataset.c; saveSoon(); q.value=''; wrap.classList.remove('dopen'); full(); } });
  fxBuild(); full();
}


// ===== src/js/16-lang-picker.js =====
// ---------- wybór języka: przycisk z powiewającą flagą (3D) i rozwijana lista ----------
const LORDER=['pl','en','de','es','fr','he','zh','szl'];
const LSAMPLE={pl:'Witaj w Arkana Browser!',en:'Welcome to Arkana Browser!',de:'Willkommen bei Arkana Browser!',es:'¡Bienvenido a Arkana Browser!',fr:'Bienvenue dans Arkana Browser !',he:'ברוכים הבאים ל-Arkana Browser!',zh:'歡迎使用 Arkana Browser！',szl:'Witej we Arkana Browser!'};
const SZLN={pl:'Śląski',en:'Silesian',de:'Schlesisch',es:'Silesio',fr:'Silésien',he:'שלזית',zh:'西利西亞語',szl:'Ślōnski'};
const SZLUI={pl:'Polski',en:'Angelski',de:'Ńymiecki',es:'Hiszpański',fr:'Francuski',he:'Hebrajski',zh:'Chiński tradycyjny',szl:'Ślōnski'};
function langName(ui,code){ if(code==='szl') return SZLN[ui]||LANGS.szl; if(ui==='szl') return SZLUI[code]||LANGS[code];
  try{ return capF(new Intl.DisplayNames([ILOC[ui]||ui],{type:'language'}).of(code==='zh'?'zh-Hant':code)); }catch{ return LANGS[code]; } }
// flagi: SVG w prawdziwych proporcjach (renderowane w wysokiej rozdzielczości) oraz dwa gotowe obrazy (Śląsk z herbem, Chiny)
const FLAGSVG={
  pl:[8,5,'<rect width="8" height="5" fill="#fff"/><rect y="2.5" width="8" height="2.5" fill="#dc143c"/>'],
  de:[5,3,'<rect width="5" height="3" fill="#ffce00"/><rect width="5" height="2" fill="#dd0000"/><rect width="5" height="1" fill="#000"/>'],
  es:[3,2,'<rect width="3" height="2" fill="#aa151b"/><rect y=".5" width="3" height="1" fill="#f1bf00"/>'],
  fr:[3,2,'<rect width="3" height="2" fill="#ed2939"/><rect width="2" height="2" fill="#fff"/><rect width="1" height="2" fill="#002395"/>'],
  en:[60,30,'<clipPath id="s"><path d="M0,0 v30 h60 v-30 z"/></clipPath><clipPath id="t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath><g clip-path="url(#s)"><path d="M0,0 v30 h60 v-30 z" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#t)" stroke="#C8102E" stroke-width="4"/><path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/><path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6"/></g>'],
  he:[220,160,'<rect width="220" height="160" fill="#fff"/><rect y="15" width="220" height="25" fill="#0038b8"/><rect y="120" width="220" height="25" fill="#0038b8"/><g fill="none" stroke="#0038b8" stroke-width="5.5"><path d="M110,47 L138.58,96.5 L81.42,96.5 Z"/><path d="M110,113 L138.58,63.5 L81.42,63.5 Z"/></g>']};
const FLAGPNG={zh:'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ABCwAAAACFgAAAAELAAAABCwAAAACFgAAAAELAAAAAIWAAAACFgAAAAELAAAAAIWAAAACFgAAAAELAAAAAIWAAAACFgAAAAELAAAAAIWAAAACFgAAAAELAAAAAIWAAAAAQsAAAAELAAAAAIWAAAAAQsAAAAELAAAAAIWAAAAAQsAAAAELAAAAAIWAAAAAQsAAICABQAAAAIWAAAAAQsAAICABQAAAAIWAAAAAQsAAICABQAAAAIWAAAAAQsAAICABQAAAAIWAAAAAQsAAICABQAAQMACAAAAAQsAAICABQAAQMACAAAAAQsAAICABQAAQMACAAAAAQsAAICABQAAQMACAAAAAQsAAICABQAAQMACAAAgYAEAAICABQAAQMACAAAgYAEAAICABQAAQMACAAAgYAEAAICABQAAQMACAAAgYAEAAICABQAAQMACAAAgYAEAABCwAAAAQMACAAAgYAEAABCwAAAAQMACAAAgYAEAABCwAAAAQMACAAAgYAEAABCwAAAACFgcAgAAAAIWAAAAAQsAAICABQAAAAIWAAAAAQsAAICABQAAAAIWAAAAAQsAAICABQAAAAIWAAAAAQsAAICABQAAQMACAAAAAQsAAICABQAAQMACAAAAAQsAAICABQAAQMACAAAAAQsAAICABQAAQMACAAAAAQsAAICABQAAQMACAAAgYAEAAICABQAAQMACAAAgYAEAAICABQAAQMACAAAgYAEAAICABQAAQMACAAAgYAEAAICABQAAQMACAAAgYAEAABCwAAAAQMACAAAgYAEAABCwAAAAQMACAAAgYAEAABCwAAAAQMACAAAgYAEAABCwAAAAQMACAAAgYAEAABCwAAAACFgAAAAgYAEAABCwAAAACFgAAAAgYAEAABCwAAAACFgAAAAgYAEAABCwAAAACFgAAAAELAAAABCwAAAACFgAAAAELAAAABCwAAAACFgAAAAELAAAABCwAAAACFgAAAAELAAAABCwAAAACFgAAAAELAAAAAIWAAAACFgAAAAELAAAAAIWAAAACFgAAAAELAAAAAIWAAAACFgAAAAELAAAAAIWAAAACFgAAAAELAAAAAIWAAAAAQsAAAAELAAAAAIWAAAAAQsAAAAELAAAAAIWAAAAAQsAAAAELAAAAAIWAAAAAQsAAAAELAAAAAIWAAAAAQsAAICABQAAAAIWAAAAAQsAAICABQAAAAIWAAAAAQsAAICABQAAAAIWAAAAAQsAAICABQAAQMACAADAHPr/VFpNWEFrBooAAAAASUVORK5CYII=',szl:'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'};
const FSRC={};
function flagSrc(k){
  if(FSRC[k]) return FSRC[k]; const o={ready:false,width:1,height:1,img:new Image()}; FSRC[k]=o; let url;
  if(FLAGPNG[k]) url='data:image/png;base64,'+FLAGPNG[k];
  else { const [vw,vh,body]=FLAGSVG[k], w=960, h=Math.round(960*vh/vw); url='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${vw} ${vh}">${body}</svg>`); }
  o.img.onload=()=>{ o.width=o.img.naturalWidth; o.height=o.img.naturalHeight; o.ready=true; }; o.img.src=url; return o; }
// Flaga jako tkanina: kolumny podążają za krzywą fali (długość łuku => wgłębienia „do tyłu”), perspektywa i cieniowanie z nachylenia.
// Płótno jest wyższe niż widoczne okno (28%), a flaga większa niż okno + amplituda, więc w dołach fali nie prześwituje tło.
const FCACHE=new WeakMap();
function flagScaled(cv,src,Wq,Hq){ const key=cv.dataset.f+Wq+'x'+Hq; let c=FCACHE.get(cv); if(!c||c.key!==key){ const off=document.createElement('canvas'); off.width=Wq; off.height=Hq; const g=off.getContext('2d'); g.imageSmoothingEnabled=true; g.imageSmoothingQuality='high'; g.drawImage(src.img,0,0,Wq,Hq); c={key,off}; FCACHE.set(cv,c); } return c.off; }
function drawFlag(cv,t){
  const src=flagSrc(cv.dataset.f); if(!src.ready) return; const g=cv.getContext('2d'), dpr=window.devicePixelRatio||1, cw=cv.clientWidth, ch=cv.clientHeight; if(!cw||!ch) return;
  const W=Math.round(cw*dpr), H=Math.round(ch*dpr); if(cv.width!==W) cv.width=W; if(cv.height!==H) cv.height=H; g.clearRect(0,0,W,H);
  const Hv=H/1.28, A=Hv*.075, sc=Math.max(1.16*W/src.width,(Hv+2.6*A)/src.height), Wq=Math.ceil(src.width*sc), Hq=Math.ceil(src.height*sc), off=flagScaled(cv,src,Wq,Hq), y0=H/2, slopes=new Float32Array(W+4);
  let x=0; for(let i=0;i<Wq&&x<W+2;i++){
    const p=i/Wq, ph=p*6.1-t*2.5, ph2=p*13.7-t*4.2+1.3, amp=.3+.7*p, dy=(Math.sin(ph)*A+Math.sin(ph2)*A*.2)*amp, slope=amp*A*(Math.cos(ph)*6.1+Math.cos(ph2)*13.7*.2)/Wq, len=Math.sqrt(1+slope*slope);
    const hh=Hq*(1+.045*Math.cos(ph)), top=y0+dy-hh/2, w=1/len; g.drawImage(off,i,0,1,Hq,x,top,w+.85,hh); const xi=Math.floor(x); if(xi>=0&&xi<W) slopes[xi]=slope; x+=w; }
  let last=0; for(let X=0;X<W;X++){ if(slopes[X]!==0) last=slopes[X]; else slopes[X]=last; }
  g.globalCompositeOperation='source-atop';
  for(let X=0;X<W;X++){ const sh=Math.max(-1,Math.min(1,slopes[X]*6)); if(Math.abs(sh)<.02) continue; g.fillStyle=sh>0?`rgba(0,0,0,${(sh*.42).toFixed(3)})`:`rgba(255,255,255,${(-sh*.3).toFixed(3)})`; g.fillRect(X,0,1,H); }
  g.globalCompositeOperation='source-over'; }
// falujące flagi: zegar działa tylko przy otwartych ustawieniach i widocznym oknie (wcześniej budził okno 30 razy na sekundę zawsze)
let lgIv=0; const lgSync=()=>{ const on=!document.hidden&&$('set').classList.contains('open'); if(on&&!lgIv) lgIv=setInterval(lgTick,33); else if(!on&&lgIv){ clearInterval(lgIv); lgIv=0; } };
function lgTick(){ const st=$('set'); if(!st||!st.classList.contains('open')) return; const lg=$('lg'); if(!lg) return; const open=lg.classList.contains('open'), lr=lg.querySelector('.lg-l').getBoundingClientRect(), t=performance.now()/1000;
  st.querySelectorAll('canvas.lf').forEach(c=>{ const box=c.parentElement;
    if(c.closest('.lg-l')){ if(!open) return; const r=box.getBoundingClientRect(); if(r.bottom<lr.top||r.top>lr.bottom) return; } else if(!c.offsetParent) return;
    drawFlag(c,t); }); }
lgSync(); new MutationObserver(lgSync).observe($('set'),{attributes:true,attributeFilter:['class']}); document.addEventListener('visibilitychange',lgSync);
const lgModes=()=>{ const m=S.settings.ui.cmode||'', zh=S.settings.ui.lang==='zh';
  return `<div class="lg-mm">${[['','Aa','Tekst zwykły'],['morse','·−','Kod Morse’a'],['braille','⠃','Pismo Braille’a']].map(([k,l,n])=>`<button class="lg-mb${m===k?' on':''}${zh&&k?' off':''}" data-m="${k}" title="${zh&&k?'Chiński: brak tabeli znaków, tryb niedostępny':n}" tabindex="-1"><b>${l}</b><small>${n}</small></button>`).join('')}</div>`; };
function langPicker(cur){
  cur=LORDER.includes(cur)?cur:'pl';
  const names=c=>{ const a=langName(cur,c), b=LANGS[c]; return `<div class="lg-n"><b>${esc(a)}</b>${a!==b?`<small>${esc(b)}</small>`:''}</div>`; }, fl=c=>`<div class="lg-fl"><canvas class="lf" data-f="${c}"></canvas></div>`;
  return `<div class="lg" id="lg">${lgModes()}<div class="lg-b" id="lgb" role="button" tabindex="0" title="Wybierz język"><div class="lg-bg"></div>${fl(cur)}${names(cur)}<em class="lg-c">▾</em></div>
    <div class="lg-l">${LORDER.map(c=>`<div class="lg-i${c===cur?' cur':''}" role="button" tabindex="0" data-lg="${c}"${c===cur?' title="Obecnie wybrany"':''}><div class="lg-bg"><span class="lg-t"${c==='he'?' dir="rtl"':''}>${c===cur?'<u class="lg-k">✓</u>':''}${esc(LSAMPLE[c])}</span></div>${fl(c)}${names(c)}</div>`).join('')}</div></div>`; }
const lgPick=e=>{
  const mb=e.target.closest('.lg-mb');
  if(mb){ e.stopPropagation(); const m=mb.dataset.m; if(S.settings.ui.lang==='zh'&&m) return; if((S.settings.ui.cmode||'')===m) return; S.settings.ui.cmode=m; save(); setTimeout(()=>location.reload(),150); return; }   // jeden tryb dla każdego języka; przy zmianie języka tryb zostaje
  if(e.target.closest('#lgb')){ $('lg').classList.toggle('open'); return; }
  const it=e.target.closest('.lg-i'); if(!it) return; const c=it.dataset.lg;
  if(c===S.settings.ui.lang){ $('lg').classList.remove('open'); return; }
  S.settings.ui.lang=c; save(); setTimeout(()=>location.reload(),150); };
$('set').addEventListener('click',lgPick);
$('set').addEventListener('keydown',e=>{ if((e.key==='Enter'||e.key===' ')&&e.target.matches('#lgb,.lg-i')){ e.preventDefault(); lgPick(e); } });



// ===== src/js/17-app-translate.js =====
// ---------- tło aplikacji: spokojne cząsteczki (wspólne dla wszystkich aplikacji) ----------
const AFXP=Array.from({length:40},(_,i)=>({x:Math.random(),y:Math.random(),r:(1+Math.random()*1.7)*2.4,s:.012+Math.random()*.02,a:.35+Math.random()*.55,k:i%2}));
let afxL=0; var afxIv=0;
// zegar cząsteczek działa tylko, gdy jest otwarte choć jedno okno aplikacji i okno przeglądarki jest widoczne (zatrzymuje się sam, wznawia go otwarcie okna aplikacji)
function afxKick(){ if(!afxIv&&!document.hidden) afxIv=setInterval(afxTick,50); }
document.addEventListener('visibilitychange',afxKick);
function afxTick(){ const cs=document.querySelectorAll('canvas.afx'); if(document.hidden||!cs.length){ clearInterval(afxIv); afxIv=0; return; } const now=performance.now(), dt=(afxL?Math.min(120,now-afxL):0)*(INC?INC_SLOW:1); afxL=now;
  const A=S.settings.afx, still=document.body.classList.contains('na-apps');
  if(!still) AFXP.forEach(p=>{ p.y-=p.s*dt/500; if(p.y<-.05){ p.y=1.05; p.x=Math.random(); } });
  const spF=glowSp(fgRgb,64), spA=glowSp(acc2Rgb,64);
  cs.forEach(cv=>{ const w=cv.closest('.aw'); if(!w) return; const W=cv.clientWidth, H=cv.clientHeight; if(!W||!H) return;
    const v=A.on?(A[w.dataset.app]??50):0, k=v/100, sig=still?W+'|'+H+'|'+k+'|'+fgRgb+'|'+acc2Rgb:null;
    if(still&&cv._sg===sig) return;   // bez ruchu nie ma czego przerysowywać
    cv._sg=sig; if(cv.width!==W) cv.width=W; if(cv.height!==H) cv.height=H;
    const g=cv.getContext('2d'); g.clearRect(0,0,W,H); if(k<=0) return;
    const n=Math.min(AFXP.length,Math.round(6+34*k)), al=.08+.4*k;
    for(let i=0;i<n;i++){ const p=AFXP[i], r=p.r*2.2; g.globalAlpha=p.a*al; g.drawImage(p.k?spA:spF,p.x*W-r,p.y*H-r,2*r,2*r); }
    g.globalAlpha=1; }); }
afxKick();
// ---------- aplikacja: tłumacz (bez logowania i opłat, wymaga internetu) ----------
// Główne źródło: publiczny punkt końcowy tłumacza Google (bez klucza); zapasowe: MyMemory. Zapytania wykonuje proces główny.
const TRL=['af','sq','am','ar','hy','az','eu','be','bn','bs','bg','ca','ceb','zh-CN','zh-TW','co','hr','cs','da','nl','en','eo','et','fi','fr','fy','gl','ka','de','el','gu','ht','ha','haw','iw','hi','hmn','hu','is','ig','id','ga','it','ja','jw','kn','kk','km','rw','ko','ku','ky','lo','la','lv','lt','lb','mk','mg','ms','ml','mt','mi','mr','mn','my','ne','no','ny','or','ps','fa','pl','pt','pa','ro','ru','sm','gd','sr','st','sn','sd','si','sk','sl','so','es','su','sw','sv','tl','tg','ta','tt','te','th','tr','tk','uk','ur','ug','uz','vi','cy','xh','yi','yo','zu'];
const TRFIX={iw:'he',jw:'jv'};   // kody Google -> kody ISO (nazwy języków, MyMemory)
function trChunks(text,MAX){ const out=[], enc=s=>encodeURIComponent(s).length; let cur='';
  const push=s=>{ if(cur&&enc(cur+s)>MAX){ out.push(cur); cur=''; } cur+=s; };
  text.split(/(?<=\n)/).forEach(line=>{ if(enc(line)<=MAX) return push(line);
    (line.match(/[^.!?。！？]*[.!?。！？]+\s*|[^.!?。！？]+$/g)||[line]).forEach(sen=>{ if(enc(sen)<=MAX) return push(sen); for(let i=0;i<sen.length;i+=Math.floor(MAX/9)) push(sen.slice(i,i+Math.floor(MAX/9))); }); });
  if(cur) out.push(cur); return out; }
const trErr=(r,svc)=>{ const m=(r&&r.err)||'net', e=new Error(m); e.svc=svc||/^http /.test(m)||m==='host'; return e; };
async function trGtx(chunk,sl,tl){
  const r=await window.api.httpGet(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(chunk)}`); if(!r||!r.ok) throw trErr(r);
  try{ const j=JSON.parse(r.body); return {text:j[0].map(s=>s[0]||'').join(''),det:j[2]||''}; }catch{ throw trErr(null,true); } }
async function trMym(chunk,sl,tl){
  const f=c=>TRFIX[c]||c, r=await window.api.httpGet(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=${encodeURIComponent((sl==='auto'?'Autodetect':f(sl))+'|'+f(tl))}`); if(!r||!r.ok) throw trErr(r);
  try{ const j=JSON.parse(r.body); if(+j.responseStatus!==200) throw 0; return j.responseData.translatedText; }catch{ throw trErr(null,true); } }
async function trTranslate(text,sl,tl){
  try{ const parts=[]; let det=''; for(const c of trChunks(text,3000)){ const r=await trGtx(c,sl,tl); parts.push(r.text); det=det||r.det; } return {text:parts.join(''),det}; }
  catch(e){ if(!e.svc) throw e;   // błąd samej usługi -> spróbuj zapasowej; brak sieci -> przerwij
    const parts=[]; for(const c of trChunks(text,450)) parts.push(await trMym(c,sl,tl)); return {text:parts.join(''),det:''}; } }
function mountTr(el,w){
  const LC=S.settings.ui.lang, L=IL();
  const dflt={pl:'pl',szl:'pl',en:'en',de:'de',es:'es',fr:'fr',he:'iw',zh:'zh-TW'}[LC]||'en';
  const D=(S.aw.data.tr=S.aw.data.tr||{src:'auto',dst:dflt,text:''});
  if(D.src!=='auto'&&!TRL.includes(D.src)) D.src='auto'; if(!TRL.includes(D.dst)) D.dst=dflt; delete D.key;
  const nm=c=>{ try{ return capF(new Intl.DisplayNames([L],{type:'language'}).of(TRFIX[c]||c)); }catch{ return c; } };
  const opts=(sel,auto)=>(auto?`<option value="auto">${t('Wykryj język')}</option>`:'')+TRL.map(c=>[c,nm(c)]).sort((a,b)=>a[1].localeCompare(b[1],L)).map(([c,n])=>`<option value="${c}"${c===sel?' selected':''}>${esc(n)}</option>`).join('');
  el.innerHTML=`<div class="tr"><div class="tr-off">Brak połączenia z internetem. Tłumacz działa tylko online.</div><div class="tr-top"><select class="tr-sl"></select><button class="tr-sw" title="Zamień języki">⇄</button><select class="tr-dl"></select></div>
    <div class="tr-pn"><div class="tr-p"><textarea class="tr-in" placeholder="Wpisz tekst do przetłumaczenia…" spellcheck="false"></textarea><div class="tr-f"><span class="tr-cn"></span><button class="tr-x" title="Wyczyść">✕</button></div></div>
    <div class="tr-p tr-o"><textarea class="tr-ou" readonly placeholder="Tłumaczenie pojawi się tutaj"></textarea><div class="tr-f"><span class="tr-st"></span><button class="tr-cp" title="Kopiuj wynik">⧉</button></div></div></div></div>`;
  const root=el.firstElementChild, q=s=>root.querySelector(s), sl=q('.tr-sl'), dl=q('.tr-dl'), inn=q('.tr-in'), ou=q('.tr-ou'), cn=q('.tr-cn'), st=q('.tr-st'), off=q('.tr-off');
  let tok=0, tmr=0, det='';
  const fill=()=>{ sl.innerHTML=opts(D.src,true); dl.innerHTML=opts(D.dst,false); };
  const count=()=>{ cn.textContent=[...inn.value].length+' '+t('znaków'); };
  const net=()=>{ off.classList.toggle('on',!navigator.onLine); };
  async function run(){
    count(); D.text=inn.value; saveSoon(); clearTimeout(tmr); const txt=inn.value;
    if(!txt.trim()){ ou.value=''; st.textContent=''; ++tok; return; }
    if(!navigator.onLine){ ++tok; st.textContent=t('Brak połączenia z internetem. Tłumacz działa tylko online.'); return; }
    const my=++tok; st.textContent=t('Tłumaczenie…');
    try{ const r=await trTranslate(txt,D.src,D.dst); if(my!==tok||!el.isConnected) return;
      ou.value=r.text; det=r.det||''; st.textContent=D.src==='auto'&&det?t('Wykryto: {l}').replace('{l}',nm(det)):''; }
    catch(e){ if(my===tok&&el.isConnected) st.textContent=t(e.svc?'Usługa tłumaczenia jest chwilowo niedostępna. Spróbuj ponownie za chwilę.':'Brak połączenia z internetem. Tłumacz działa tylko online.'); } }
  sl.onchange=()=>{ D.src=sl.value; run(); }; dl.onchange=()=>{ D.dst=dl.value; run(); };
  inn.addEventListener('input',()=>{ count(); clearTimeout(tmr); tmr=setTimeout(run,650); });
  inn.addEventListener('keydown',e=>{ if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){ e.preventDefault(); run(); } });
  q('.tr-x').onclick=()=>{ inn.value=''; ou.value=''; run(); inn.focus(); };
  q('.tr-cp').onclick=()=>{ if(!ou.value) return; try{ navigator.clipboard.writeText(ou.value).then(()=>toast(t('Skopiowano'))).catch(()=>{}); }catch{} };
  q('.tr-sw').onclick=()=>{ const s=D.src==='auto'?(TRL.includes(det)?det:'en'):D.src; D.src=D.dst; D.dst=s; inn.value=ou.value; ou.value=''; fill(); run(); };
  const on=()=>{ if(!el.isConnected){ removeEventListener('online',on); removeEventListener('offline',on); return; } net(); if(navigator.onLine&&inn.value.trim()&&!ou.value) run(); };
  addEventListener('online',on); addEventListener('offline',on);
  new ResizeObserver(()=>root.classList.toggle('narrow',el.clientWidth<500)).observe(el);
  fill(); inn.value=D.text||''; count(); net(); if(inn.value.trim()) run();
}
$('set').addEventListener('change',e=>{ const i=e.target;
  if(i.id==='rnd'){ S.settings.ui.round=i.checked; applyUi(); save(); }
  else if(i.id==='asstbtn'){ S.settings.ui.asst=i.checked; applyUi(); if(!i.checked&&S.panel) setPanel(false); save(); }
  else if(i.id==='clbtnon'){ S.settings.ui.clb=i.checked; applyUi(); if(!i.checked) toggleCl(false); save(); }
  else if(i.id==='afxon'){ S.settings.afx.on=i.checked; save(); }
  else if(i.id==='hon'){ S.settings.hist.on=i.checked; save(); }
  else if(i.id==='upauto'){ S.settings.upd.auto=i.checked; save(); updPush(); }
  else if(i.id==='updl'){ S.settings.upd.dl=i.checked; save(); updPush(); }
  else if(i.id==='accadv'){ S.settings.accAdv=i.checked; $('accad').classList.toggle('open',i.checked); save(); }
  else if(i.id==='st5'){ S.settings.ui.step5=i.checked; save(); renderUi(); } });

// ===== src/js/18-app-dice.js =====
// ---------- aplikacja: kości do gry ----------
const DC_T=[3,4,5,6,8,10,12,16,20,24,30,100], DC_MAX=30, DC_FS={3:26,4:21,5:25,6:30,8:25,10:26,12:25,16:23,20:19,24:23,30:21,100:24};
const DC_PIPS={1:[[50,50]],2:[[34,34],[66,66]],3:[[34,34],[50,50],[66,66]],4:[[34,34],[66,34],[34,66],[66,66]],5:[[34,34],[66,34],[50,50],[34,66],[66,66]],6:[[34,31],[66,31],[34,50],[66,50],[34,69],[66,69]]};
function dcRand(n){ const a=new Uint32Array(1), lim=Math.floor(4294967296/n)*n; do{ crypto.getRandomValues(a); }while(a[0]>=lim); return a[0]%n+1; }   // równomiernie, bez przesunięcia modulo
const dcPts=(n,rot,r,cx=50,cy=50)=>Array.from({length:n},(_,i)=>{ const a=(rot+i*360/n)*Math.PI/180; return [cx+r*Math.sin(a),cy-r*Math.cos(a)]; });
const dcSc=(a,k,c)=>a.map(p=>[c[0]+(p[0]-c[0])*k,c[1]+(p[1]-c[1])*k]);
function dcShape(n){   // sylwetki jak na prawdziwych kościach widzianych od frontu
  switch(n){
    case 3: return {o:dcPts(3,180,48,50,43),c:[50,43],k:.58};
    case 4: return {o:dcPts(3,0,50,50,57),c:[50,57],k:.58};
    case 5: return {o:dcPts(5,180,46,50,47),c:[50,47],k:.6};
    case 6: return {o:[[10,10],[90,10],[90,90],[10,90]],c:[50,50],k:.72};
    case 8: return {o:[[50,4],[90,50],[50,96],[10,50]],c:[50,50],k:.6};
    case 10: case 100: return {o:[[50,4],[91,38],[50,96],[9,38]],c:[50,46],k:.6};
    case 12: return {o:dcPts(5,0,47,50,54),c:[50,54],k:.62};
    case 16: return {o:dcPts(8,22.5,47),c:[50,50],k:.62};
    case 20: return {o:dcPts(6,0,47),c:[50,50],k:.6,tri:1};
    case 24: return {o:dcPts(10,0,47),c:[50,50],k:.62};
    default: return {o:dcPts(12,15,47),c:[50,50],k:.64};
  }
}
function dcSvg(n,v,pips){
  const s=dcShape(n), P=a=>a.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ');
  let g=`<polygon class="dco" points="${P(s.o)}"/>`, ins;
  if(s.tri){ const O=s.o; ins=dcPts(3,0,47*s.k);   // D20: środkowy trójkąt i trzy „skrzydła” ścianek
    for(let m=0;m<3;m++) g+=`<polygon class="dcf${m%2}" points="${P([ins[m],O[2*m],O[(2*m+1)%6],O[(2*m+2)%6],ins[(m+1)%3]])}"/>`; }
  else { ins=dcSc(s.o,s.k,s.c); const L=s.o.length; for(let i=0;i<L;i++){ const j=(i+1)%L; g+=`<polygon class="dcf${i%2}" points="${P([s.o[i],s.o[j],ins[j],ins[i]])}"/>`; } }
  g+=`<polygon class="dci" points="${P(ins)}"/>`;
  if(n===6&&pips) (DC_PIPS[v]||[]).forEach(p=>{ g+=`<circle class="dcq" cx="${p[0]}" cy="${p[1]}" r="6.4"/>`; });
  else { const d=String(v).length, fs=DC_FS[n]*(d===1?1:d===2?.84:.66); g+=`<text class="dct" x="${s.c[0]}" y="${s.c[1]}" font-size="${fs.toFixed(1)}">${v}</text>`; }
  return `<svg viewBox="0 0 100 100" class="dcs">${g}</svg>`;
}
function mountDice(el,w){
  const D=(S.aw.data.dice=S.aw.data.dice||{pool:{6:1},mod:0,hist:[]});
  D.pool=D.pool&&typeof D.pool==='object'?D.pool:{6:1}; D.mod=Math.max(-999,Math.min(999,D.mod|0)); D.hist=Array.isArray(D.hist)?D.hist.slice(0,15):[];
  DC_T.forEach(n=>{ D.pool[n]=Math.max(0,Math.min(DC_MAX,D.pool[n]|0)); });
  el.innerHTML=`<div class="dcr"><div class="dcx"><div class="dcsum"><span>Suma</span><b class="dctot">–</b><small class="dcrng"></small></div>
    <div class="dcst"><p class="dch">Wybierz kości i rzuć</p></div><div class="dcfm"></div></div>
    <div class="dcbr"><button class="dcroll">Rzuć kośćmi</button><button class="dcbt dcclr">Wyczyść wybór</button></div>
    <div class="dcl"><span>Wybierz kości</span></div><div class="dcg">${DC_T.map(n=>`<div class="dcc" data-n="${n}"><button class="dcp" title="Dodaj">${dcSvg(n,n,false)}<em></em></button><span>D${n}</span><button class="dcm" title="Usuń">−</button></div>`).join('')}</div>
    <div class="dcmod"><span>Modyfikator</span><button class="dcbt" data-m="-1">−</button><b class="dcmv"></b><button class="dcbt" data-m="1">+</button></div>
    <div class="dcl"><span>Historia rzutów</span><button class="dchc">Wyczyść historię</button></div><ul class="dchs"></ul>
    <p class="hint">Kliknij kość w wyniku, aby rzucić nią ponownie.</p></div>`;
  const q=s=>el.querySelector(s), live=()=>el.isConnected, anim=()=>!document.body.classList.contains('na-apps');
  let cur=[], fm='', rmod=0, busy=0, iv=null;
  const cnt=()=>DC_T.reduce((a,n)=>a+D.pool[n],0), hl=d=>d.n>=6&&d.v===d.n?' mx':(d.n===20&&d.v===1?' mn':''), total=()=>cur.reduce((a,d)=>a+d.v,0)+rmod;
  const label=()=>DC_T.filter(n=>D.pool[n]).map(n=>(D.pool[n]>1?D.pool[n]:'')+'D'+n).join(' + ')+(D.mod?(D.mod>0?' + ':' − ')+Math.abs(D.mod):'');
  function paintPool(n){ const c=q(`.dcc[data-n="${n}"]`); c.classList.toggle('on',D.pool[n]>0); c.querySelector('em').textContent=D.pool[n]||''; }
  function range(){ const c=cnt(), mx=DC_T.reduce((a,n)=>a+D.pool[n]*n,0); q('.dcrng').textContent=c?t('Zakres: {a}–{b}').replace('{a}',c+D.mod).replace('{b}',mx+D.mod):''; q('.dcmv').textContent=D.mod>0?'+'+D.mod:String(D.mod); }
  function histR(){ q('.dchs').innerHTML=D.hist.length?D.hist.map(h=>`<li><b>${h.tot}</b><span>${esc(h.fm)}</span><i>${esc(h.v)}</i></li>`).join(''):'<li class="dce">Brak rzutów</li>'; }
  function stage(){ const st=q('.dcst'), n=cur.length;
    if(!n){ st.innerHTML='<p class="dch">Wybierz kości i rzuć</p>'; return; }
    st.style.setProperty('--ds',(n<=6?72:n<=12?58:n<=20?48:40)+'px'); st.classList.toggle('sh',n<=12);
    st.innerHTML=cur.map((d,i)=>`<button class="dcd" data-i="${i}" title="Rzuć ponownie tą kością">${dcSvg(d.n,d.v,true)}</button>`).join(''); }
  function settle(targets,full){
    const ds=q('.dcst').querySelectorAll('.dcd'); targets.forEach(i=>{ const b=ds[i], d=cur[i]; if(!b) return; b.className='dcd'+hl(d); b.style.animationDelay=''; b.innerHTML=dcSvg(d.n,d.v,true); });
    const tt=q('.dctot'); tt.textContent=total(); q('.dcfm').textContent=fm+' = '+total(); if(anim()){ tt.classList.remove('pop'); void tt.offsetWidth; tt.classList.add('pop'); }
    const rec={fm,tot:total(),v:cur.map(d=>d.v).join(', ')};
    if(full) D.hist.unshift(rec); else if(D.hist.length) D.hist[0]=rec;
    D.hist.length=Math.min(D.hist.length,15); histR(); save(); busy=0; }
  function roll(i){
    if(busy||!live()) return; const full=i===undefined;
    if(full){ const list=[]; DC_T.forEach(n=>{ for(let k=0;k<D.pool[n];k++) list.push(n); });
      if(!list.length) return toast(t('Wybierz co najmniej jedną kość'));
      cur=list.map(n=>({n,v:dcRand(n)})); fm=label(); rmod=D.mod; stage(); }
    else { const d=cur[i]; if(!d) return; d.v=dcRand(d.n); }
    const targets=full?cur.map((_,k)=>k):[i];
    if(!anim()){ settle(targets,full); return; }
    busy=1; const ds=q('.dcst').querySelectorAll('.dcd'), t0=performance.now(), end=targets.map((_,k)=>520+Math.min(k*35,420));
    q('.dctot').textContent='…';
    targets.forEach((i2,k)=>{ const b=ds[i2]; b.classList.add('rl'); b.style.animationDelay=Math.min(k*35,420)+"ms"; });
    clearInterval(iv); iv=setInterval(()=>{
      if(!live()){ clearInterval(iv); return; } const ms=performance.now()-t0; let done=true;
      targets.forEach((i2,k)=>{ const d=cur[i2], b=ds[i2]; if(!b) return; if(ms<end[k]){ done=false; if(d.n!==6||Math.random()<.5) b.innerHTML=dcSvg(d.n,dcRand(d.n),true); } else if(b.dataset.f!=='1'){ b.dataset.f='1'; b.innerHTML=dcSvg(d.n,d.v,true); } });
      if(done){ clearInterval(iv); settle(targets,full); targets.forEach(i2=>{ if(ds[i2]) ds[i2].dataset.f=''; }); }
    },75); }
  function add(n,dv){ if(dv>0&&cnt()>=DC_MAX) return toast(t('Maksymalnie {n} kości naraz').replace('{n}',DC_MAX)); D.pool[n]=Math.max(0,Math.min(DC_MAX,D.pool[n]+dv)); paintPool(n); range(); saveSoon(); }
  el.addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b||!el.contains(b)) return;
    if(b.classList.contains('dcroll')) return roll();
    if(b.classList.contains('dcd')) return roll(+b.dataset.i);
    const ch=b.closest('.dcc'); if(ch&&b.classList.contains('dcp')) return add(+ch.dataset.n,1); if(ch&&b.classList.contains('dcm')) return add(+ch.dataset.n,-1);
    if(b.dataset.m){ D.mod=Math.max(-999,Math.min(999,D.mod+ +b.dataset.m)); range(); saveSoon(); return; }
    if(b.classList.contains('dcclr')){ DC_T.forEach(n=>{ D.pool[n]=0; paintPool(n); }); range(); saveSoon(); return; }
    if(b.classList.contains('dchc')){ D.hist=[]; histR(); save(); } });
  el.addEventListener('contextmenu',e=>{ const ch=e.target.closest('.dcc'); if(ch){ e.preventDefault(); add(+ch.dataset.n,-1); } });
  DC_T.forEach(paintPool); range(); histR();
  el.__dc={roll,get cur(){ return cur; }};
}


// ===== src/js/19-games.js =====
// ---------- gry: wspólne elementy konfiguratora (Saper, Snake) ----------
const gmHsl=(rgb,d,s,l)=>{ const [r,g,b]=rgb.split(',').map(Number).map(v=>v/255), mx=Math.max(r,g,b), mn=Math.min(r,g,b), dd=mx-mn; let h=0; if(dd){ h=mx===r?((g-b)/dd)%6:mx===g?(b-r)/dd+2:(r-g)/dd+4; h*=60; if(h<0) h+=360; } return `hsl(${Math.round((h+d+360)%360)} ${s}% ${l}%)`; };   // kolory pochodne od akcentu motywu
const gmSl=(k,label,min,max,val,step=1)=>`<div class="gms"><span>${label}<b data-o="${k}"></b></span><div class="rg"><i class="tr"></i><i class="fl"></i><input type="range" data-k="${k}" min="${min}" max="${max}" step="${step}" value="${val}"></div></div>`;
const gmTg=(k,label,on)=>`<label class="ck"><input type="checkbox" data-k="${k}"${on?' checked':''}><span class="tg"></span>${label}</label>`;
const gmPaint=root=>root.querySelectorAll('.rg').forEach(g=>{ const i=g.querySelector('input'); g.style.setProperty('--v',(i.value-i.min)/(i.max-i.min)*100); });
const gmRingSvg='<svg viewBox="0 0 64 64" class="gmrs"><circle cx="32" cy="32" r="26" class="gmr0"/><circle cx="32" cy="32" r="26" class="gmr1"/><text x="32" y="33" class="gmrt"></text></svg>';
const gmRing=(root,p,txt,lab)=>{ root.querySelector('.gmr1').style.strokeDasharray=(Math.max(0,Math.min(1,p))*163.4).toFixed(1)+' 163.4'; root.querySelector('.gmrt').textContent=txt; root.querySelector('.gmd').textContent=t(lab); };
const gmDiff=d=>d<.3?'Łatwy':d<.5?'Średni':d<.7?'Trudny':'Ekstremalny';
function gmFrame(cls,inner,panel){ return `<div class="gj ${cls}">${inner}<button class="gjm" title="Ustawienia gry"><i></i></button><div class="gmp"><div class="gmt">Ustawienia gry</div>${panel}</div></div>`; }
const gmRR=(cx,x,y,w,h,r)=>{ cx.beginPath(); if(cx.roundRect) cx.roundRect(x,y,w,h,r); else cx.rect(x,y,w,h); };
const gmAnim=()=>!document.body.classList.contains('na-apps');

// ---------- aplikacja: Saper ----------
const MN_DEF={pre:'easy',w:9,h:9,m:10,cell:32,fit:true,safe:true,chord:true,ques:false,wrap:false,lives:1}, MN_PRE={easy:[9,9,10],mid:[16,16,40],hard:[30,16,99]};
const mnMax=(w,h)=>Math.max(1,Math.floor(w*h*.55));
const mnPerm=(()=>{ const c={}; return n=>c[n]||(c[n]=(()=>{ const a=Array.from({length:n},(_,i)=>i); let s=n*7919+13; for(let i=n-1;i>0;i--){ s=(s*1103515245+12345)&0x7fffffff; const j=s%(i+1); [a[i],a[j]]=[a[j],a[i]]; } return a; })()); })();
function mnNb(w,h,wrap){ const NB=[]; for(let y=0;y<h;y++) for(let x=0;x<w;x++){ const a=[]; for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++){ if(!dx&&!dy) continue; let nx=x+dx, ny=y+dy; if(wrap){ nx=(nx+w)%w; ny=(ny+h)%h; } else if(nx<0||ny<0||nx>=w||ny>=h) continue; const j=ny*w+nx; if(j!==y*w+x&&!a.includes(j)) a.push(j); } NB.push(a); } return NB; }
function mountMine(el,wn){
  const D=(S.aw.data.mine=S.aw.data.mine||{cfg:{},best:{},st:{p:0,w:0}}); D.best=D.best||{}; D.st=D.st||{p:0,w:0};
  const C=D.cfg=Object.assign({},MN_DEF,D.cfg||{});
  const fix=()=>{ C.w=Math.min(40,Math.max(5,C.w|0)); C.h=Math.min(30,Math.max(5,C.h|0)); C.m=Math.min(mnMax(C.w,C.h),Math.max(1,C.m|0)); C.cell=Math.min(56,Math.max(20,C.cell|0)); C.lives=Math.min(5,Math.max(1,C.lives|0)); }; fix();
  const preBtn=(k,l)=>`<button data-p="${k}">${l}</button>`;
  el.innerHTML=gmFrame('mn',`<div class="gmh"><div class="gmi" title="Pozostało min">💣<b class="mnm">0</b></div><button class="gmbt mnf" title="Nowa gra">🙂</button><div class="gmi">⏱<b class="mnt">0</b></div><div class="mnl"></div><button class="gmbt mnfl" title="Tryb flagi">🚩</button></div><div class="gmb"><canvas class="mnv"></canvas></div><div class="gmx"><span class="mnbs"></span></div>`,
    `<div class="gmtop"><canvas class="gmpv"></canvas><div class="gmr">${gmRingSvg}<div class="gmd"></div></div></div>
     <div class="gmseg">${preBtn('easy','Łatwy')}${preBtn('mid','Średni')}${preBtn('hard','Trudny')}${preBtn('custom','Własny')}</div>
     <div class="gmg">Plansza</div>${gmSl('w','Kolumny',5,40,C.w)}${gmSl('h','Wiersze',5,30,C.h)}${gmSl('m','Miny',1,mnMax(C.w,C.h),C.m)}${gmSl('cell','Rozmiar pola',20,56,C.cell,2)}${gmTg('fit','Dopasuj do okna',C.fit)}
     <div class="gmg">Zasady</div>${gmSl('lives','Życia',1,5,C.lives)}${gmTg('safe','Bezpieczny pierwszy klik',C.safe)}${gmTg('chord','Akordy (klik na cyfrę)',C.chord)}${gmTg('ques','Znaki zapytania',C.ques)}${gmTg('wrap','Zawinięta plansza',C.wrap)}
     <button class="gmgo">Zastosuj i zagraj</button><p class="gjhint">Prawy przycisk myszy: flaga. Zmiana rozmiaru planszy lub liczby min zaczyna nową grę po kliknięciu przycisku powyżej.</p>`);
  const root=el.querySelector('.gj'), q=s=>root.querySelector(s), cv=q('.mnv'), cx=cv.getContext('2d'), pn=q('.gmp'), pv=q('.gmpv'), px=pv.getContext('2d');
  let G=null, cs=30, dpr=window.devicePixelRatio||1, hov=-1, down=-1, flagMode=false, raf=0, tmr=null, shake=0, pvRaf=0, ff=getComputedStyle(el).fontFamily;
  const now=()=>performance.now();
  // ----- logika gry -----
  function place(first){ const ban=new Set(); if(first>=0){ ban.add(first); if(C.safe) G.NB[first].forEach(j=>ban.add(j)); }
    let cand=[]; for(let i=0;i<G.n;i++) if(!ban.has(i)) cand.push(i); if(cand.length<G.m){ cand=[]; for(let i=0;i<G.n;i++) if(i!==first) cand.push(i); }
    for(let k=0;k<G.m;k++){ const r=k+Math.floor(Math.random()*(cand.length-k)); [cand[k],cand[r]]=[cand[r],cand[k]]; G.mine[cand[k]]=1; }
    for(let i=0;i<G.n;i++){ let c=0; for(const j of G.NB[i]) c+=G.mine[j]; G.near[i]=c; } G.placed=true; }
  function newGame(){ fix(); clearInterval(tmr); const n=C.w*C.h; G={w:C.w,h:C.h,n,m:C.m,NB:mnNb(C.w,C.h,C.wrap),mine:new Uint8Array(n),near:new Uint8Array(n),st:new Uint8Array(n),boom:new Uint8Array(n),rv:new Float64Array(n),placed:false,opened:0,flags:0,booms:0,lives:C.lives,over:0,t0:0,ms:0,wt:0};
    if(!C.safe) place(-1); layout(); head(); redraw(); }
  function flood(i){ const t=now(), a=gmAnim(), qu=[[i,0]]; G.st[i]=1; G.rv[i]=t; G.opened++;
    for(let k=0;k<qu.length;k++){ const [c,d]=qu[k]; if(G.near[c]) continue; for(const j of G.NB[c]) if(G.st[j]===0||G.st[j]===3){ G.st[j]=1; G.opened++; G.rv[j]=t+(a?(d+1)*22:0); qu.push([j,d+1]); } } }
  function hit(i){ G.st[i]=1; G.boom[i]=1; G.rv[i]=now(); G.booms++; G.lives--; shake=now();
    if(G.lives<=0){ G.over=2; clearInterval(tmr); G.ms=now()-G.t0; D.st.p++; const t=now(), x0=i%G.w, y0=(i/G.w)|0, a=gmAnim();
      for(let j=0;j<G.n;j++) if(G.mine[j]&&G.st[j]===0||G.mine[j]&&G.st[j]===3){ G.st[j]=4; G.rv[j]=t+(a?80+Math.hypot(j%G.w-x0,((j/G.w)|0)-y0)*38:0); } save(); }
    else toast(t('Życie utracone! Zostało: {n}').replace('{n}',G.lives)); }
  function check(){ if(G.over||G.opened!==G.n-G.m) return; G.over=1; clearInterval(tmr); G.ms=now()-G.t0; G.wt=now(); G.flags=G.m-G.booms;
    for(let j=0;j<G.n;j++) if(G.mine[j]&&G.st[j]!==1) G.st[j]=2; D.st.p++; D.st.w++; const k=bestKey(); toast(t('Wygrana! Czas: {t} s').replace('{t}',(G.ms/1000).toFixed(1)));
    if(!D.best[k]||G.ms<D.best[k]){ D.best[k]=Math.round(G.ms); setTimeout(()=>toast(t('Nowy rekord!')),1800); } save(); }
  function open(i){ if(G.over||G.st[i]===1||G.st[i]===2) return; if(!G.placed) place(i); if(!G.t0){ G.t0=now(); tmr=setInterval(tick,200); }
    if(G.mine[i]) hit(i); else flood(i); check(); head(); redraw(); }
  function chord(i){ if(G.over||G.st[i]!==1||!G.near[i]||G.mine[i]) return; let f=0; for(const j of G.NB[i]) if(G.st[j]===2||(G.st[j]===1&&G.boom[j])) f++; if(f!==G.near[i]) return;
    for(const j of G.NB[i]){ if(G.over) break; if(G.st[j]!==0&&G.st[j]!==3) continue; if(G.mine[j]) hit(j); else flood(j); } check(); head(); redraw(); }
  function flag(i){ if(G.over||G.st[i]===1) return; const s=G.st[i]; if(s===0){ G.st[i]=2; G.flags++; } else if(s===2){ G.flags--; G.st[i]=C.ques?3:0; } else G.st[i]=0; head(); redraw(); }
  const bestKey=()=>`${C.w}x${C.h}-${C.m}${C.wrap?'w':''}${C.lives>1?'l'+C.lives:''}`;
  function tick(){ if(!root.isConnected){ clearInterval(tmr); return; } q('.mnt').textContent=G.t0?Math.min(999,Math.floor((now()-G.t0)/1000)):0; }
  function head(){ q('.mnm').textContent=G.m-G.flags-G.booms; q('.mnf').textContent=G.over===1?'😎':G.over===2?'😵':(down>=0?'😮':'🙂');
    q('.mnt').textContent=G.t0?Math.min(999,Math.floor((G.over?G.ms:now()-G.t0)/1000)):0;
    q('.mnl').innerHTML=C.lives>1?Array.from({length:C.lives},(_,k)=>`<i class="${k<G.lives?'':'off'}">♥</i>`).join(''):'';
    const b=D.best[bestKey()]; q('.mnbs').textContent=b?t('Rekord')+': '+(b/1000).toFixed(1)+' s':''; }
  // ----- rysowanie -----
  function layout(){ const b=q('.gmb'), bw=(b.clientWidth||400)-16, bh=(b.clientHeight||400)-16; cs=C.fit?Math.max(12,Math.min(64,Math.floor(Math.min(bw/G.w,bh/G.h)))):C.cell;
    const W=G.w*cs, H=G.h*cs; cv.style.width=W+'px'; cv.style.height=H+'px'; cv.width=Math.round(W*dpr); cv.height=Math.round(H*dpr); }
  const NCK={k:'',v:[]};
  function ncol(n){ if(NCK.k!==accRgb){ NCK.k=accRgb; NCK.v=Array.from({length:9},(_,k)=>gmHsl(accRgb,k*47+20,72,68)); } return NCK.v[n]; }
  function flagIco(x,y,c){ const X=x+c*.5, T=y+c*.2, B=y+c*.8; cx.fillStyle=P.acc; cx.beginPath(); cx.moveTo(X,T); cx.lineTo(X+c*.28,T+c*.17); cx.lineTo(X,T+c*.34); cx.closePath(); cx.fill(); cx.fillStyle=P.fg; cx.fillRect(X-c*.03,T,c*.055,B-T); cx.fillRect(X-c*.2,B-c*.04,c*.4,c*.075); }
  function bomb(x,y,c,hot){ const X=x+c/2, Y=y+c/2, r=c*.2; if(hot){ cx.fillStyle=`rgba(${accRgb},.55)`; cx.beginPath(); cx.arc(X,Y,c*.46,0,6.283); cx.fill(); }
    cx.strokeStyle=P.fg; cx.lineWidth=Math.max(1.2,c*.06); for(let k=0;k<4;k++){ const a=k*Math.PI/4; cx.beginPath(); cx.moveTo(X-Math.cos(a)*r*1.75,Y-Math.sin(a)*r*1.75); cx.lineTo(X+Math.cos(a)*r*1.75,Y+Math.sin(a)*r*1.75); cx.stroke(); }
    cx.fillStyle=P.fg; cx.beginPath(); cx.arc(X,Y,r*1.2,0,6.283); cx.fill(); cx.fillStyle=P.bg; cx.beginPath(); cx.arc(X-r*.4,Y-r*.4,r*.35,0,6.283); cx.fill(); }
  function draw(){ const t=now(), w=G.w; let busy=false; cx.setTransform(dpr,0,0,dpr,0,0); cx.clearRect(0,0,w*cs,G.h*cs);
    if(gmAnim()&&shake&&t-shake<380){ cx.translate(Math.sin((t-shake)*.07)*(1-(t-shake)/380)*cs*.22,0); busy=true; }
    cx.font=`700 ${Math.round(cs*.52)}px ${ff}`; cx.textAlign='center'; cx.textBaseline='middle'; const g=Math.max(1,cs*.05), r=cs*.2;
    for(let i=0;i<G.n;i++){ const x=(i%w)*cs, y=((i/w)|0)*cs; let s=G.st[i], a=1;
      if(s===1||s===4){ const dt=t-G.rv[i]; if(dt<0){ s=0; busy=true; } else if(dt<240){ a=dt/240; busy=true; } }
      if(s===1||s===4){ const k=a<1?.55+.45*(1+2.7*Math.pow(a-1,3)+1.7*Math.pow(a-1,2)):1; cx.save(); cx.translate(x+cs/2,y+cs/2); cx.scale(k,k); cx.translate(-x-cs/2,-y-cs/2); cx.globalAlpha=a;
        cx.fillStyle=G.boom[i]?`rgba(${accRgb},.3)`:'rgba(0,0,0,.27)'; gmRR(cx,x+g,y+g,cs-2*g,cs-2*g,r); cx.fill();
        if(G.mine[i]) bomb(x,y,cs,G.boom[i]); else if(G.near[i]){ cx.fillStyle=ncol(G.near[i]); cx.fillText(G.near[i],x+cs/2,y+cs/2+cs*.03); } cx.restore(); }
      else { const hot=i===hov&&!G.over||i===down; cx.fillStyle=`rgba(${accRgb},${hot?.4:.22})`; gmRR(cx,x+g,y+g,cs-2*g,cs-2*g,r); cx.fill(); cx.strokeStyle=`rgba(${fgRgb},.09)`; cx.lineWidth=1; cx.beginPath(); cx.moveTo(x+r+g,y+g+.5); cx.lineTo(x+cs-r-g,y+g+.5); cx.stroke();
        if(s===2){ flagIco(x,y,cs); if(G.over===2&&!G.mine[i]){ cx.strokeStyle=P.fg; cx.lineWidth=Math.max(1.5,cs*.07); cx.beginPath(); cx.moveTo(x+cs*.22,y+cs*.22); cx.lineTo(x+cs*.78,y+cs*.78); cx.moveTo(x+cs*.78,y+cs*.22); cx.lineTo(x+cs*.22,y+cs*.78); cx.stroke(); } }
        else if(s===3){ cx.fillStyle=P.mut; cx.fillText('?',x+cs/2,y+cs/2+cs*.03); } else if(s===4) bomb(x,y,cs,false); } }
    if(G.over===1&&gmAnim()&&t-G.wt<1500){ busy=true; const fr=(t-G.wt)/1500*(w+G.h+8)-4; for(let i=0;i<G.n;i++){ const al=Math.max(0,1-Math.abs((i%w)+((i/w)|0)-fr)/4.5)*.55; if(al>.02){ cx.fillStyle=`rgba(${acc2Rgb},${al})`; gmRR(cx,(i%w)*cs+g,((i/w)|0)*cs+g,cs-2*g,cs-2*g,r); cx.fill(); } } }
    return busy; }
  const loop=()=>{ raf=0; if(!root.isConnected||!G) return; if(draw()) raf=requestAnimationFrame(loop); };
  const redraw=()=>{ if(!raf) raf=requestAnimationFrame(loop); };
  // ----- mysz -----
  const cellAt=e=>{ const r=cv.getBoundingClientRect(), x=Math.floor((e.clientX-r.left)/cs), y=Math.floor((e.clientY-r.top)/cs); return x<0||y<0||x>=G.w||y>=G.h?-1:y*G.w+x; };
  cv.addEventListener('contextmenu',e=>e.preventDefault());
  cv.addEventListener('pointerdown',e=>{ const i=cellAt(e); if(i<0) return; if(e.button===2){ flag(i); return; } if(e.button===1){ e.preventDefault(); chord(i); return; } if(e.button===0){ down=i; head(); redraw(); } });
  cv.addEventListener('pointerup',e=>{ if(e.button!==0) return; const i=cellAt(e), d=down; down=-1; head(); redraw(); if(i<0||i!==d) return; if(flagMode) flag(i); else if(G.st[i]===1){ if(C.chord) chord(i); } else open(i); });
  cv.addEventListener('pointermove',e=>{ const i=cellAt(e); if(i!==hov){ hov=i; redraw(); } });
  cv.addEventListener('pointerleave',()=>{ hov=-1; down=-1; head(); redraw(); });
  q('.mnf').addEventListener('click',newGame);
  q('.mnfl').addEventListener('click',e=>{ flagMode=!flagMode; e.currentTarget.classList.toggle('on',flagMode); });
  new ResizeObserver(()=>{ if(G){ layout(); redraw(); } }).observe(q('.gmb'));
  // ----- konfigurator z podglądem na żywo -----
  function pvDraw(t=now()){ const W=pv.width, H=pv.height; px.setTransform(1,0,0,1,0,0); px.clearRect(0,0,W,H); const c=Math.max(2,Math.min((W-14*dpr)/C.w,(H-14*dpr)/C.h)), bw=c*C.w, bh=c*C.h, ox=(W-bw)/2, oy=(H-bh)/2, ord=mnPerm(C.w*C.h), mine=new Uint8Array(C.w*C.h);
    for(let k=0;k<C.m;k++) mine[ord[k]]=1; const gp=Math.max(.5,c*.08);
    for(let i=0;i<mine.length;i++){ const x=ox+(i%C.w)*c, y=oy+((i/C.w)|0)*c; px.fillStyle=`rgba(${accRgb},.17)`; px.fillRect(x+gp,y+gp,c-2*gp,c-2*gp);
      if(mine[i]){ const p=.5+.5*Math.sin(t*.004+i*1.7); px.fillStyle=`rgba(${acc2Rgb},${.55+.45*p})`; px.beginPath(); px.arc(x+c/2,y+c/2,c*(.2+.1*p),0,6.283); px.fill(); } }
    if(C.wrap){ px.save(); px.strokeStyle=P.acc; px.lineWidth=2*dpr; px.setLineDash([5*dpr,4*dpr]); px.lineDashOffset=-(t*.02)%(9*dpr); px.shadowColor=P.acc; px.shadowBlur=8*dpr; px.strokeRect(ox-3*dpr,oy-3*dpr,bw+6*dpr,bh+6*dpr); px.restore(); } }
  function pvLoop(t){ pvRaf=0; if(!root.isConnected||!pn.classList.contains('open')) return; pvDraw(t); if(gmAnim()) pvRaf=requestAnimationFrame(pvLoop); }
  function sync(){ const o=(k,v)=>{ const b=pn.querySelector(`[data-o="${k}"]`); if(b) b.textContent=v; }, d=C.m/(C.w*C.h);
    pn.querySelector('[data-k=m]').max=mnMax(C.w,C.h); pn.querySelectorAll('[data-k]').forEach(i=>{ if(i.type==='checkbox') i.checked=!!C[i.dataset.k]; else i.value=C[i.dataset.k]; });
    o('w',C.w); o('h',C.h); o('m',C.m+' · '+Math.round(d*100)+'%'); o('cell',C.cell+' px'); o('lives',C.lives); pn.querySelector('[data-k=cell]').parentElement.parentElement.style.opacity=C.fit?.4:1;
    pn.querySelectorAll('.gmseg button').forEach(b=>b.classList.toggle('on',b.dataset.p===C.pre)); gmPaint(pn);
    const d2=d*(C.wrap?1.12:1)*(1-(C.lives-1)*.06); gmRing(pn,d/.3,Math.round(d*100)+'%',['Łatwy','Średni','Trudny','Ekstremalny'][d2<.14?0:d2<.18?1:d2<.23?2:3]); if(!pvRaf) pvDraw(); }
  q('.gjm').addEventListener('click',()=>{ pn.classList.toggle('open'); if(pn.classList.contains('open')&&!pvRaf){ sync(); pvRaf=requestAnimationFrame(pvLoop); } });
  pn.addEventListener('input',e=>{ const k=e.target.dataset.k; if(!k||e.target.type==='checkbox') return; C[k]=+e.target.value; if(k==='w'||k==='h'||k==='m') C.pre='custom'; fix(); sync(); if(k==='cell'&&G){ layout(); redraw(); } saveSoon(); });
  pn.addEventListener('change',e=>{ const k=e.target.dataset.k; if(!k||e.target.type!=='checkbox') return; C[k]=e.target.checked; if(k==='wrap') C.pre='custom'; sync(); if(k==='fit'&&G){ layout(); redraw(); } saveSoon(); });
  pn.addEventListener('click',e=>{ const b=e.target.closest('.gmseg button'); if(b){ const p=b.dataset.p; C.pre=p; if(p!=='custom'){ [C.w,C.h,C.m]=MN_PRE[p]; } sync(); saveSoon(); return; } if(e.target.closest('.gmgo')){ pn.classList.remove('open'); newGame(); save(); } });
  newGame(); sync();
  el.__mn={ get G(){ return G; }, open, flag, chord, newGame, C };
}

// ---------- aplikacja: Snake ----------
const SN_DEF={w:20,h:16,speed:9,accel:3,len:3,grow:1,apples:2,every:3,life:0,gold:8,poison:6,obs:0,wrap:false,cell:28,fit:true};
const SN_PRE={cl:{w:20,h:16,speed:8,accel:0,len:3,grow:1,apples:1,every:1,life:0,gold:0,poison:0,obs:0,wrap:false},
  fast:{w:24,h:18,speed:16,accel:4,len:3,grow:1,apples:3,every:2,life:12,gold:10,poison:8,obs:0,wrap:false},
  maze:{w:26,h:18,speed:10,accel:2,len:3,grow:1,apples:2,every:3,life:0,gold:8,poison:5,obs:24,wrap:false},
  open:{w:22,h:22,speed:9,accel:2,len:3,grow:1,apples:3,every:2,life:0,gold:12,poison:0,obs:0,wrap:true}};
function snNew(C){ const w=C.w, h=C.h, cy=h>>1, x0=Math.max(C.len+1,w>>2), G={w,h,wrap:C.wrap,snake:[],dir:{x:1,y:0},q:[],apples:[],obs:new Uint8Array(w*h),score:0,grow:0,alive:true,speed:C.speed,sa:0,eaten:0,prev:null,t:0,poison:0};
  for(let i=0;i<C.len;i++) G.snake.push({x:x0-i,y:cy});
  for(let n=C.obs, k=0; n>0&&k<3000; k++){ const x=(Math.random()*w)|0, y=(Math.random()*h)|0; if(Math.abs(y-cy)<=1&&x<x0+9) continue; if(G.obs[y*w+x]) continue; G.obs[y*w+x]=1; n--; }
  snSpawn(G,C); return G; }
function snFree(G,x,y){ if(G.obs[y*G.w+x]) return false; for(const s of G.snake) if(s.x===x&&s.y===y) return false; for(const a of G.apples) if(a.x===x&&a.y===y) return false; return true; }
function snSpawn(G,C){ for(let k=0;k<300;k++){ const x=(Math.random()*G.w)|0, y=(Math.random()*G.h)|0; if(!snFree(G,x,y)) continue; const r=Math.random()*100; let kind=r<C.poison?2:r<C.poison+C.gold?1:0;
    if(kind===2&&!G.apples.some(a=>a.k!==2)) kind=0;   // zawsze musi być co najmniej jedno zdrowe jabłko
    G.apples.push({x,y,k:kind,exp:C.life?G.t+C.life*1000:0}); return true; } return false; }
function snTick(G,C,dt){ G.t+=dt; const n0=G.apples.length; G.apples=G.apples.filter(a=>!a.exp||G.t<a.exp); if(!G.apples.length) snSpawn(G,C);
  G.sa+=dt; if(G.sa>=C.every*1000){ G.sa=0; if(G.apples.length<C.apples) snSpawn(G,C); } return n0; }
function snStep(G,C){ G.prev=G.snake.map(s=>({x:s.x,y:s.y})); const d=G.q.length?G.q.shift():G.dir; G.dir=d; const h=G.snake[0]; let nx=h.x+d.x, ny=h.y+d.y;
  if(G.wrap){ nx=(nx+G.w)%G.w; ny=(ny+G.h)%G.h; } else if(nx<0||ny<0||nx>=G.w||ny>=G.h){ G.alive=false; return 'wall'; }
  if(G.obs[ny*G.w+nx]){ G.alive=false; return 'obs'; }
  const L=G.snake.length-(G.grow>0?0:1); for(let i=0;i<L;i++){ const s=G.snake[i]; if(s.x===nx&&s.y===ny){ G.alive=false; return 'self'; } }
  G.snake.unshift({x:nx,y:ny}); let ate=-1, ai=G.apples.findIndex(a=>a.x===nx&&a.y===ny);
  if(ai>=0){ const a=G.apples.splice(ai,1)[0]; ate=a.k; G.eaten++; if(a.k===0){ G.score+=10; G.grow+=C.grow; } else if(a.k===1){ G.score+=30; G.grow+=C.grow+2; } else { G.score=Math.max(0,G.score-5); G.poison=2; } G.speed=Math.min(30,G.speed*(1+C.accel/100)); }
  if(G.grow>0) G.grow--; else G.snake.pop();
  if(G.poison){ for(let k=0;k<G.poison&&G.snake.length>2;k++) G.snake.pop(); G.poison=0; }
  if(!G.apples.length) snSpawn(G,C);
  return ate>=0?'ate'+ate:''; }
function snAI(G){ const h=G.snake[0], DD=[{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}]; let best=null, bd=1e9;
  for(const d of DD){ if(d.x===-G.dir.x&&d.y===-G.dir.y) continue; let nx=h.x+d.x, ny=h.y+d.y; if(G.wrap){ nx=(nx+G.w)%G.w; ny=(ny+G.h)%G.h; } else if(nx<0||ny<0||nx>=G.w||ny>=G.h) continue;
    if(G.obs[ny*G.w+nx]||G.snake.some((s,i)=>i<G.snake.length-1&&s.x===nx&&s.y===ny)) continue;
    let m=1e9; for(const a of G.apples){ if(a.k===2) continue; let dx=Math.abs(a.x-nx), dy=Math.abs(a.y-ny); if(G.wrap){ dx=Math.min(dx,G.w-dx); dy=Math.min(dy,G.h-dy); } m=Math.min(m,dx+dy); } m+=Math.random()*.4; if(m<bd){ bd=m; best=d; } }
  if(best) G.q=[best]; }
function snBg(G,C,cs,dpr){ const W=G.w*cs, H=G.h*cs, c=document.createElement('canvas'); c.width=Math.round(W*dpr); c.height=Math.round(H*dpr); const x=c.getContext('2d'); x.setTransform(dpr,0,0,dpr,0,0);
  x.fillStyle='rgba(0,0,0,.26)'; gmRR(x,0,0,W,H,Math.min(12,cs*.5)); x.fill();
  for(let j=0;j<G.h;j++) for(let i=0;i<G.w;i++){ if((i+j)&1){ x.fillStyle=`rgba(${accRgb},.05)`; x.fillRect(i*cs,j*cs,cs,cs); } if(G.obs[j*G.w+i]){ x.fillStyle=`rgba(${accRgb},.4)`; gmRR(x,i*cs+cs*.06,j*cs+cs*.06,cs*.88,cs*.88,cs*.2); x.fill(); x.strokeStyle=P.acc; x.lineWidth=Math.max(1,cs*.05); x.stroke(); } }
  x.save(); x.strokeStyle=G.wrap?P.acc2:P.acc; x.lineWidth=G.wrap?Math.max(1.5,cs*.08):Math.max(2,cs*.14); if(G.wrap){ x.setLineDash([cs*.4,cs*.3]); x.shadowColor=P.acc2; x.shadowBlur=cs*.4; } gmRR(x,0,0,W,H,Math.min(12,cs*.5)); x.stroke(); x.restore(); return c; }
function snDraw(cx,G,cs,t,f,dead){
  for(const a of G.apples){ if(a.exp&&a.exp-G.t<1600&&((G.t/140)|0)%2) continue; const X=(a.x+.5)*cs, Y=(a.y+.5)*cs, r=cs*.34*(1+.07*Math.sin(t*.006+a.x*2+a.y));
    if(a.k===0){ cx.fillStyle=P.acc2; cx.beginPath(); cx.arc(X,Y,r,0,6.283); cx.fill(); cx.fillStyle=`rgba(${fgRgb},.55)`; cx.beginPath(); cx.arc(X-r*.35,Y-r*.35,r*.28,0,6.283); cx.fill(); cx.fillStyle=P.acc; cx.beginPath(); cx.ellipse(X+r*.3,Y-r*1.02,r*.34,r*.17,-.6,0,6.283); cx.fill(); }
    else if(a.k===1){ cx.save(); cx.shadowColor=P.fg; cx.shadowBlur=cs*.45; cx.fillStyle=P.fg; cx.beginPath(); cx.arc(X,Y,r,0,6.283); cx.fill(); cx.restore(); cx.strokeStyle=P.acc; cx.lineWidth=Math.max(1.2,cs*.07); cx.beginPath(); cx.arc(X,Y,r*.62,0,6.283); cx.stroke(); }
    else { cx.fillStyle=gmHsl(accRgb,180,52,52); cx.beginPath(); cx.arc(X,Y,r,0,6.283); cx.fill(); cx.strokeStyle=P.bg; cx.lineWidth=Math.max(1.4,cs*.08); cx.beginPath(); cx.moveTo(X-r*.42,Y-r*.42); cx.lineTo(X+r*.42,Y+r*.42); cx.moveTo(X+r*.42,Y-r*.42); cx.lineTo(X-r*.42,Y+r*.42); cx.stroke(); } }
  const L=G.snake.length, A=accRgb.split(',').map(Number), B=acc2Rgb.split(',').map(Number); cx.globalAlpha=dead?.5:1;
  for(let i=L-1;i>=0;i--){ const s=G.snake[i], p=G.prev&&G.prev[i], dx=p?s.x-p.x:0, dy=p?s.y-p.y:0; let x=s.x, y=s.y; if(p&&Math.abs(dx)<=1&&Math.abs(dy)<=1){ x=p.x+dx*f; y=p.y+dy*f; }
    const k=L>1?i/(L-1):0, sz=cs*(i===0?.98:.9-.2*k), X=(x+.5)*cs, Y=(y+.5)*cs; cx.fillStyle=`rgb(${Math.round(A[0]+(B[0]-A[0])*k)},${Math.round(A[1]+(B[1]-A[1])*k)},${Math.round(A[2]+(B[2]-A[2])*k)})`; gmRR(cx,X-sz/2,Y-sz/2,sz,sz,sz*.38); cx.fill(); }
  cx.globalAlpha=1; const h=G.snake[0], hp=G.prev&&G.prev[0]; let hx=h.x, hy=h.y; if(hp&&Math.abs(h.x-hp.x)<=1&&Math.abs(h.y-hp.y)<=1){ hx=hp.x+(h.x-hp.x)*f; hy=hp.y+(h.y-hp.y)*f; }
  const X=(hx+.5)*cs, Y=(hy+.5)*cs, d=G.dir, px=-d.y, py=d.x; for(const sg of [-1,1]){ const ex=X+d.x*cs*.17+px*sg*cs*.2, ey=Y+d.y*cs*.17+py*sg*cs*.2; cx.fillStyle=P.fg; cx.beginPath(); cx.arc(ex,ey,cs*.115,0,6.283); cx.fill(); cx.fillStyle=P.bg; cx.beginPath(); cx.arc(ex+d.x*cs*.04,ey+d.y*cs*.04,cs*.055,0,6.283); cx.fill(); } }

function mountSnake(el,wn){
  const D=(S.aw.data.snake=S.aw.data.snake||{cfg:{},best:{}}); D.best=D.best||{}; const C=D.cfg=Object.assign({},SN_DEF,D.cfg||{});
  const fix=()=>{ C.w=Math.min(50,Math.max(10,C.w|0)); C.h=Math.min(40,Math.max(10,C.h|0)); C.speed=Math.min(30,Math.max(3,C.speed|0)); C.accel=Math.min(10,Math.max(0,C.accel|0)); C.len=Math.min(10,Math.max(2,C.len|0)); C.grow=Math.min(5,Math.max(1,C.grow|0));
    C.apples=Math.min(10,Math.max(1,C.apples|0)); C.every=Math.min(10,Math.max(.5,+C.every||3)); C.life=Math.min(30,Math.max(0,C.life|0)); if(C.life>0&&C.life<3) C.life=3; C.gold=Math.min(40,Math.max(0,C.gold|0)); C.poison=Math.min(40,Math.max(0,C.poison|0));
    C.obs=Math.min(Math.floor(C.w*C.h*.12),Math.max(0,C.obs|0)); C.cell=Math.min(48,Math.max(14,C.cell|0)); }; fix();
  const preBtn=(k,l)=>`<button data-p="${k}">${l}</button>`;
  el.innerHTML=gmFrame('sn',`<div class="gmh"><div class="gmi">🍎<b class="snsc">0</b></div><div class="gmi">🏆<b class="snbs">0</b></div><div class="gmi"><span>Długość</span><b class="snln">0</b></div><button class="gmbt snpz" title="Pauza">⏸</button></div><div class="gmb"><canvas class="mnv"></canvas><div class="gmov"><b></b><span></span><button class="gjbt">Zagraj ponownie</button></div></div><div class="gmx"><span>Strzałki lub WASD: sterowanie, spacja: pauza.</span></div>`,
    `<div class="gmtop"><canvas class="gmpv"></canvas><div class="gmr">${gmRingSvg}<div class="gmd"></div></div></div>
     <div class="gmseg">${preBtn('cl','Klasyczny')}${preBtn('fast','Szybki')}${preBtn('maze','Labirynt')}${preBtn('open','Bez ścian')}</div>
     <div class="gmg">Plansza</div>${gmSl('w','Kolumny',10,50,C.w)}${gmSl('h','Wiersze',10,40,C.h)}${gmSl('obs','Przeszkody',0,Math.floor(C.w*C.h*.12),C.obs)}${gmSl('cell','Rozmiar pola',14,48,C.cell,2)}${gmTg('fit','Dopasuj do okna',C.fit)}${gmTg('wrap','Przenikanie ścian',C.wrap)}
     <div class="gmg">Wąż</div>${gmSl('speed','Szybkość',3,30,C.speed)}${gmSl('accel','Przyspieszanie',0,10,C.accel)}${gmSl('len','Początkowa długość',2,10,C.len)}${gmSl('grow','Wzrost za jabłko',1,5,C.grow)}
     <div class="gmg">Jabłka</div>${gmSl('apples','Jabłka naraz',1,10,C.apples)}${gmSl('every','Nowe jabłko co',.5,10,C.every,.5)}${gmSl('life','Czas życia jabłka',0,30,C.life)}${gmSl('gold','Złote jabłka',0,40,C.gold)}${gmSl('poison','Trujące jabłka',0,40,C.poison)}
     <button class="gmgo">Zastosuj i zagraj</button><p class="gjhint">Złote jabłko: +30 pkt i dłuższy wzrost. Trujące: -5 pkt i skrócenie węża. Zmiany planszy i węża obowiązują od nowej gry.</p>`);
  const root=el.querySelector('.gj'), q=s=>root.querySelector(s), cv=q('.mnv'), cx=cv.getContext('2d'), pn=q('.gmp'), pv=q('.gmpv'), px=pv.getContext('2d'), ov=q('.gmov');
  let G=null, st='ready', cs=24, dpr=window.devicePixelRatio||1, bg=null, raf=0, last=0, acc=0, f=1, pvRaf=0, pvG=null, pvBg=null, pvKey='', pvAcc=0, pvLast=0;
  const now=()=>performance.now(), bestKey=()=>`${C.w}x${C.h}-s${C.speed}${C.wrap?'w':''}-o${C.obs}`;
  const show=(a,b,btn)=>{ ov.classList.toggle('show',!!a); if(a){ ov.querySelector('b').textContent=a; ov.querySelector('span').textContent=b||''; ov.querySelector('button').style.display=btn?'':'none'; } };
  function hud(){ q('.snsc').textContent=G.score; q('.snln').textContent=G.snake.length; const b=D.best[bestKey()]|0; q('.snbs').textContent=Math.max(b,G.score); }
  function layout(){ const b=q('.gmb'), bw=(b.clientWidth||400)-16, bh=(b.clientHeight||400)-16; cs=C.fit?Math.max(10,Math.min(60,Math.floor(Math.min(bw/G.w,bh/G.h)))):C.cell;
    const W=G.w*cs, H=G.h*cs; cv.style.width=W+'px'; cv.style.height=H+'px'; cv.width=Math.round(W*dpr); cv.height=Math.round(H*dpr); bg=snBg(G,C,cs,dpr); }
  function newGame(){ fix(); G=snNew(C); st='ready'; acc=0; f=1; layout(); hud(); show(t('Naciśnij strzałkę, aby zacząć'),'',false); q('.snpz').textContent='⏸'; render(now()); }
  function render(t0){ cx.setTransform(dpr,0,0,dpr,0,0); cx.clearRect(0,0,G.w*cs,G.h*cs); cx.drawImage(bg,0,0,G.w*cs,G.h*cs); snDraw(cx,G,cs,t0,f,!G.alive); }
  function end(why){ st='over'; const k=bestKey(), nb=G.score>(D.best[k]|0); if(nb){ D.best[k]=G.score; save(); } hud(); show(t('Koniec gry'),t('Wynik: {n}').replace('{n}',G.score)+(nb&&G.score>0?' · '+t('Nowy rekord!'):''),true); }
  function frame(t0){ raf=0; if(!root.isConnected) return; const dt=Math.min(100,t0-(last||t0)); last=t0;
    if(st==='run'){ snTick(G,C,dt); acc+=dt; const sm=1000/G.speed; while(acc>=sm&&st==='run'){ acc-=sm; snStep(G,C); if(!G.alive){ end(); break; } hud(); } f=gmAnim()?Math.min(1,acc/sm):1; }
    render(t0); if(st==='run') raf=requestAnimationFrame(frame); }
  const kick=()=>{ if(!raf){ last=0; raf=requestAnimationFrame(frame); } };
  function start(){ if(st==='ready'){ st='run'; show(''); acc=0; kick(); } }
  function pause(){ if(st==='run'){ st='pause'; q('.snpz').textContent='▶'; show(t('Pauza'),t('Naciśnij spację, aby wznowić'),false); render(now()); } else if(st==='pause'){ st='run'; q('.snpz').textContent='⏸'; show(''); kick(); } }
  function turn(d){ if(st==='over') return; if(st==='ready'){ if(d.x===-1) return; G.dir=d; start(); return; } if(st!=='run') return; const ref=G.q.length?G.q[G.q.length-1]:G.dir; if(d.x===-ref.x&&d.y===-ref.y||d.x===ref.x&&d.y===ref.y) return; if(G.q.length<2) G.q.push(d); }
  const KEYS={ArrowUp:{x:0,y:-1},w:{x:0,y:-1},ArrowDown:{x:0,y:1},s:{x:0,y:1},ArrowLeft:{x:-1,y:0},a:{x:-1,y:0},ArrowRight:{x:1,y:0},d:{x:1,y:0}};
  root.tabIndex=-1; root.style.outline='none';
  root.addEventListener('keydown',e=>{ if(e.ctrlKey||e.altKey||e.metaKey) return; const k=e.key.length===1?e.key.toLowerCase():e.key, d=KEYS[k]; if(d){ e.preventDefault(); turn(d); } else if(k===' '||k==='p'){ e.preventDefault(); pause(); } else if(k==='r'){ newGame(); } });
  root.addEventListener('pointerdown',e=>{ if(!e.target.closest('.gmp,.gjm,input,button')) root.focus({preventScroll:true}); });
  let sw=null; cv.addEventListener('pointerdown',e=>{ sw={x:e.clientX,y:e.clientY}; if(st==='pause') pause(); }); cv.addEventListener('pointerup',e=>{ if(!sw) return; const dx=e.clientX-sw.x, dy=e.clientY-sw.y; sw=null; if(Math.max(Math.abs(dx),Math.abs(dy))<24) return; turn(Math.abs(dx)>Math.abs(dy)?{x:Math.sign(dx),y:0}:{x:0,y:Math.sign(dy)}); });
  q('.snpz').addEventListener('click',()=>{ if(st==='ready') return; pause(); root.focus({preventScroll:true}); }); ov.querySelector('button').addEventListener('click',()=>{ newGame(); root.focus({preventScroll:true}); });
  document.addEventListener('visibilitychange',()=>{ if(document.hidden&&st==='run') pause(); });
  new ResizeObserver(()=>{ if(G){ layout(); render(now()); } }).observe(q('.gmb'));
  // ----- konfigurator: podgląd na żywo (autopilot na planszy o wybranych ustawieniach) -----
  function pvReset(){ const key=[C.w,C.h,C.obs,C.wrap,C.len,C.apples,C.gold,C.poison,C.life].join(); if(key===pvKey&&pvG&&pvG.alive) return; pvKey=key; pvG=snNew(C); const W=pv.width, H=pv.height, c=Math.max(2,Math.min((W-10*dpr)/C.w,(H-10*dpr)/C.h)); pvBg=snBg(pvG,C,c,1); pvBg._c=c; }
  function pvDraw(t0){ const W=pv.width, H=pv.height; px.setTransform(1,0,0,1,0,0); px.clearRect(0,0,W,H); pvReset(); const c=pvBg._c; px.translate((W-c*C.w)/2,(H-c*C.h)/2); px.drawImage(pvBg,0,0,c*C.w,c*C.h); snDraw(px,pvG,c,t0,Math.min(1,pvAcc/(1000/Math.max(4,Math.min(20,pvG.speed)))),!pvG.alive); }
  function pvLoop(t0){ pvRaf=0; if(!root.isConnected||!pn.classList.contains('open')) return; const dt=Math.min(100,t0-(pvLast||t0)); pvLast=t0; pvReset(); const sp=Math.max(4,Math.min(20,C.speed)); pvAcc+=dt; snTick(pvG,C,dt);
    while(pvAcc>=1000/sp){ pvAcc-=1000/sp; snAI(pvG); snStep(pvG,C); if(!pvG.alive){ pvKey=''; pvReset(); break; } } pvDraw(t0); if(gmAnim()) pvRaf=requestAnimationFrame(pvLoop); }
  function sync(){ const o=(k,v)=>{ const b=pn.querySelector(`[data-o="${k}"]`); if(b) b.textContent=v; };
    pn.querySelector('[data-k=obs]').max=Math.floor(C.w*C.h*.12); pn.querySelectorAll('[data-k]').forEach(i=>{ if(i.type==='checkbox') i.checked=!!C[i.dataset.k]; else i.value=C[i.dataset.k]; });
    o('w',C.w); o('h',C.h); o('obs',C.obs); o('cell',C.cell+' px'); o('speed',C.speed+'/s'); o('accel',C.accel+'%'); o('len',C.len); o('grow',C.grow); o('apples',C.apples); o('every',C.every+' s'); o('life',C.life?C.life+' s':t('bez limitu')); o('gold',C.gold+'%'); o('poison',C.poison+'%');
    pn.querySelector('[data-k=cell]').parentElement.parentElement.style.opacity=C.fit?.4:1;
    pn.querySelectorAll('.gmseg button').forEach(b=>{ const p=SN_PRE[b.dataset.p]; b.classList.toggle('on',Object.keys(p).every(k=>C[k]===p[k])); }); gmPaint(pn);
    const sc=C.speed/30*.55+(C.wrap?0:.1)+Math.min(.25,C.obs/(C.w*C.h)*2.2)+C.poison/100*.5+C.accel/10*.15; gmRing(pn,C.speed/30,C.speed+'/s',gmDiff(sc)); pvKey=''; if(!pvRaf){ pvReset(); pvDraw(now()); } }
  q('.gjm').addEventListener('click',()=>{ pn.classList.toggle('open'); if(pn.classList.contains('open')&&!pvRaf){ sync(); pvLast=0; pvRaf=requestAnimationFrame(pvLoop); } });
  pn.addEventListener('input',e=>{ const k=e.target.dataset.k; if(!k||e.target.type==='checkbox') return; C[k]=+e.target.value; fix(); sync(); if(k==='cell'&&G){ layout(); render(now()); } saveSoon(); });
  pn.addEventListener('change',e=>{ const k=e.target.dataset.k; if(!k||e.target.type!=='checkbox') return; C[k]=e.target.checked; sync(); if(k==='fit'&&G){ layout(); render(now()); } saveSoon(); });
  pn.addEventListener('click',e=>{ const b=e.target.closest('.gmseg button'); if(b){ Object.assign(C,SN_PRE[b.dataset.p]); sync(); saveSoon(); return; } if(e.target.closest('.gmgo')){ pn.classList.remove('open'); newGame(); save(); root.focus({preventScroll:true}); } });
  newGame(); sync(); root.focus({preventScroll:true});
  el.__sn={ get G(){ return G; }, get st(){ return st; }, turn, pause, newGame, step:()=>snStep(G,C), C };
}


// ===== src/js/20-app-files.js =====
// ---------- aplikacja: zmieniacz formatów (silniki konwersji, bez zewnętrznych bibliotek) ----------
const FCT=new TextEncoder();
const fcU8=(...a)=>{ let n=0; a.forEach(x=>n+=x.length); const o=new Uint8Array(n); let p=0; a.forEach(x=>{ o.set(x,p); p+=x.length; }); return o; };
const fcCrcT=(()=>{ const t=new Uint32Array(256); for(let n=0;n<256;n++){ let c=n; for(let k=0;k<8;k++) c=c&1?0xEDB88320^(c>>>1):c>>>1; t[n]=c>>>0; } return t; })();
const fcCrc=b=>{ let c=-1; for(let i=0;i<b.length;i++) c=fcCrcT[(c^b[i])&255]^(c>>>8); return (~c)>>>0; };
const fcStream=async(b,s)=>new Uint8Array(await new Response(new Blob([b]).stream().pipeThrough(s)).arrayBuffer());
const fcDeflate=b=>fcStream(b,new CompressionStream('deflate-raw')), fcInflate=b=>fcStream(b,new DecompressionStream('deflate-raw'));
const fcGz=b=>fcStream(b,new CompressionStream('gzip')), fcGunzip=b=>fcStream(b,new DecompressionStream('gzip'));
const fcBlobBytes=async b=>new Uint8Array(await b.arrayBuffer());
// --- ZIP ---
async function fcZip(files){
  const parts=[], cen=[]; let off=0; const dt=new Date(), dosT=(dt.getHours()<<11)|(dt.getMinutes()<<5)|(dt.getSeconds()>>1), dosD=((dt.getFullYear()-1980)<<9)|((dt.getMonth()+1)<<5)|dt.getDate();
  for(const f of files){ const nm=FCT.encode(f.name), crc=fcCrc(f.data); let data=f.data, m=0;
    if(!f.store&&data.length>64){ const d=await fcDeflate(data); if(d.length<data.length){ data=d; m=8; } }
    const h=new Uint8Array(30+nm.length), v=new DataView(h.buffer);
    v.setUint32(0,0x04034b50,true); v.setUint16(4,20,true); v.setUint16(6,0x0800,true); v.setUint16(8,m,true); v.setUint16(10,dosT,true); v.setUint16(12,dosD,true); v.setUint32(14,crc,true); v.setUint32(18,data.length,true); v.setUint32(22,f.data.length,true); v.setUint16(26,nm.length,true); h.set(nm,30);
    parts.push(h,data);
    const c=new Uint8Array(46+nm.length), w=new DataView(c.buffer);
    w.setUint32(0,0x02014b50,true); w.setUint16(4,20,true); w.setUint16(6,20,true); w.setUint16(8,0x0800,true); w.setUint16(10,m,true); w.setUint16(12,dosT,true); w.setUint16(14,dosD,true); w.setUint32(16,crc,true); w.setUint32(20,data.length,true); w.setUint32(24,f.data.length,true); w.setUint16(28,nm.length,true); w.setUint32(42,off,true); c.set(nm,46);
    cen.push(c); off+=h.length+data.length; }
  const cs=cen.reduce((a,x)=>a+x.length,0), e=new Uint8Array(22), ev=new DataView(e.buffer);
  ev.setUint32(0,0x06054b50,true); ev.setUint16(8,files.length,true); ev.setUint16(10,files.length,true); ev.setUint32(12,cs,true); ev.setUint32(16,off,true);
  return fcU8(...parts,...cen,e); }
async function fcUnzip(b){
  const dv=new DataView(b.buffer,b.byteOffset,b.byteLength); let e=-1; for(let i=b.length-22;i>=Math.max(0,b.length-66000);i--) if(dv.getUint32(i,true)===0x06054b50){ e=i; break; } if(e<0) throw new Error('zip');
  const n=dv.getUint16(e+10,true); let p=dv.getUint32(e+16,true); const out=[];
  for(let k=0;k<n;k++){ if(dv.getUint32(p,true)!==0x02014b50) throw new Error('zip');
    const m=dv.getUint16(p+10,true), cs=dv.getUint32(p+20,true), nl=dv.getUint16(p+28,true), el=dv.getUint16(p+30,true), cl=dv.getUint16(p+32,true), lo=dv.getUint32(p+42,true), name=new TextDecoder().decode(b.subarray(p+46,p+46+nl));
    p+=46+nl+el+cl; if(name.endsWith('/')) continue;
    const ds=lo+30+dv.getUint16(lo+26,true)+dv.getUint16(lo+28,true), raw=b.subarray(ds,ds+cs); out.push({name,data:m===0?raw.slice():await fcInflate(raw)}); }
  return out; }
// --- TAR ---
function fcTar(files){
  const parts=[], oct=(v,l)=>FCT.encode(v.toString(8).padStart(l-1,'0')+'\0');
  files.forEach(f=>{ const h=new Uint8Array(512); h.set(FCT.encode(f.name).slice(0,100),0); h.set(oct(0o644,8),100); h.set(oct(0,8),108); h.set(oct(0,8),116); h.set(oct(f.data.length,12),124); h.set(oct(Math.floor(Date.now()/1000),12),136);
    h.fill(32,148,156); h[156]=48; h.set(FCT.encode('ustar\0'+'00'),257); let s=0; h.forEach(x=>s+=x); h.set(FCT.encode(s.toString(8).padStart(6,'0')+'\0 '),148);
    parts.push(h,f.data,new Uint8Array((512-f.data.length%512)%512)); });
  parts.push(new Uint8Array(1024)); return fcU8(...parts); }
function fcUntar(b){
  const out=[]; let p=0, ln='';
  while(p+512<=b.length){ const h=b.subarray(p,p+512); if(h.every(x=>x===0)) break;
    const str=(a,l)=>new TextDecoder().decode(h.subarray(a,a+l)).replace(/\0[\s\S]*$/,''); let name=str(0,100); const pre=str(345,155); if(pre) name=pre+'/'+name;
    const size=parseInt(str(124,12).trim()||'0',8), t=String.fromCharCode(h[156]||48); p+=512; const data=b.subarray(p,p+size);
    if(t==='L') ln=new TextDecoder().decode(data).replace(/\0[\s\S]*$/,''); else { if(t==='0'||t==='7') out.push({name:ln||name,data:data.slice()}); ln=''; }
    p+=Math.ceil(size/512)*512; }
  return out; }
// --- GIF (paleta RGB332 + dithering Bayer, przezroczystość) ---
function fcLzw(idx){
  const mb=8, clear=256, eoi=257; let bits=9, next=258, dict=new Map(), out=[], cur=0, cn=0;
  const emit=c=>{ cur|=c<<cn; cn+=bits; while(cn>=8){ out.push(cur&255); cur>>=8; cn-=8; } };
  emit(clear); let w=idx[0];
  for(let i=1;i<idx.length;i++){ const k=idx[i], key=(w<<8)|k, v=dict.get(key); if(v!==undefined){ w=v; continue; }
    emit(w); if(next===4096){ emit(clear); dict.clear(); next=258; bits=9; } else { if(next>=(1<<bits)) bits++; dict.set(key,next++); } w=k; }
  emit(w); emit(eoi); if(cn>0) out.push(cur&255); return out; }
const FCBAY=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
function fcGif(frames,W,H,loop){
  const o=[], w16=v=>o.push(v&255,v>>8&255); [...'GIF89a'].forEach(c=>o.push(c.charCodeAt(0))); w16(W); w16(H); o.push(0xF7,0,0);
  for(let i=0;i<256;i++) o.push(Math.round(((i>>5)&7)*255/7),Math.round(((i>>2)&7)*255/7),Math.round((i&3)*255/3));
  if(frames.length>1){ o.push(0x21,0xFF,11); [...'NETSCAPE2.0'].forEach(c=>o.push(c.charCodeAt(0))); o.push(3,1); w16(loop|0); o.push(0); }
  frames.forEach(f=>{ const px=f.px, idx=new Uint8Array(W*H); let tr=false;
    for(let y=0;y<H;y++) for(let x=0;x<W;x++){ const i=(y*W+x)*4, j=y*W+x; if(px[i+3]<128){ idx[j]=0; tr=true; continue; }
      const t=(FCBAY[(y&3)*4+(x&3)]/16-.47), r=Math.min(255,Math.max(0,px[i]+t*36)), g=Math.min(255,Math.max(0,px[i+1]+t*36)), b=Math.min(255,Math.max(0,px[i+2]+t*85));
      let q=((Math.round(r*7/255)<<5)|(Math.round(g*7/255)<<2)|Math.round(b*3/255)); if(q===0&&f.tr!==false) q=1; idx[j]=q; }
    o.push(0x21,0xF9,4,(tr?0x09:0x04)|(tr?8:0)); w16(Math.max(1,Math.round(f.delay||10))); o.push(0,0);
    o.push(0x2C); w16(0); w16(0); w16(W); w16(H); o.push(0,8);
    const d=fcLzw(idx); for(let i=0;i<d.length;i+=255){ const c=d.slice(i,i+255); o.push(c.length); c.forEach(v=>o.push(v)); } o.push(0); });
  o.push(0x3B); return Uint8Array.from(o); }
// --- TIFF / BMP / PPM / ICO / PDF / SVG ---
function fcTiff(px,W,H){
  const n=W*H*4, entries=10, ifd=8, bps=ifd+2+entries*12+4, data=bps+8, out=new Uint8Array(data+n), v=new DataView(out.buffer);
  out.set([0x49,0x49,42,0],0); v.setUint32(4,8,true); let p=ifd; v.setUint16(p,entries,true); p+=2;
  const E=(tag,type,cnt,val)=>{ v.setUint16(p,tag,true); v.setUint16(p+2,type,true); v.setUint32(p+4,cnt,true); if(type===3&&cnt===1) v.setUint16(p+8,val,true); else v.setUint32(p+8,val,true); p+=12; };
  E(256,4,1,W); E(257,4,1,H); E(258,3,4,bps); E(259,3,1,1); E(262,3,1,2); E(273,4,1,data); E(277,3,1,4); E(278,4,1,H); E(279,4,1,n); E(338,3,1,2);
  for(let i=0;i<4;i++) v.setUint16(bps+i*2,8,true); out.set(px,data); return out; }
function fcBmp(px,W,H){
  const rs=(W*3+3)&~3, size=54+rs*H, o=new Uint8Array(size), v=new DataView(o.buffer); o[0]=66; o[1]=77; v.setUint32(2,size,true); v.setUint32(10,54,true); v.setUint32(14,40,true); v.setInt32(18,W,true); v.setInt32(22,H,true); v.setUint16(26,1,true); v.setUint16(28,24,true); v.setUint32(34,rs*H,true); v.setInt32(38,2835,true); v.setInt32(42,2835,true);
  for(let y=0;y<H;y++){ let q=54+(H-1-y)*rs; for(let x=0;x<W;x++){ const i=(y*W+x)*4; o[q++]=px[i+2]; o[q++]=px[i+1]; o[q++]=px[i]; } } return o; }
function fcPpm(px,W,H){ const h=FCT.encode(`P6\n${W} ${H}\n255\n`), o=new Uint8Array(h.length+W*H*3); o.set(h,0); let q=h.length; for(let i=0;i<W*H;i++){ o[q++]=px[i*4]; o[q++]=px[i*4+1]; o[q++]=px[i*4+2]; } return o; }
function fcIco(pngs){   // pngs:[{s,bytes}]
  const n=pngs.length, hd=6+16*n, o=[new Uint8Array(hd)], v=new DataView(o[0].buffer); v.setUint16(2,1,true); v.setUint16(4,n,true); let off=hd;
  pngs.forEach((p,i)=>{ const e=6+16*i; o[0][e]=p.s>=256?0:p.s; o[0][e+1]=p.s>=256?0:p.s; v.setUint16(e+4,1,true); v.setUint16(e+6,32,true); v.setUint32(e+8,p.bytes.length,true); v.setUint32(e+12,off,true); off+=p.bytes.length; o.push(p.bytes); });
  return fcU8(...o); }
function fcPdfImg(jpg,W,H){
  const wp=(W*.75).toFixed(2), hp=(H*.75).toFixed(2), e=s=>FCT.encode(s), parts=[e('%PDF-1.4\n')], xref=[]; let off=9;
  const add=(...bs)=>{ xref.push(off); const b=fcU8(...bs.map(x=>typeof x==='string'?e(x):x)); parts.push(b); off+=b.length; };
  add('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n'); add('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');
  add(`3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${wp} ${hp}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`);
  add(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${W} /Height ${H} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>\nstream\n`,jpg,'\nendstream\nendobj\n');
  const c=`q ${wp} 0 0 ${hp} 0 0 cm /Im0 Do Q`; add(`5 0 obj\n<< /Length ${c.length} >>\nstream\n${c}\nendstream\nendobj\n`);
  let x='xref\n0 6\n0000000000 65535 f \n'; xref.forEach(o=>x+=String(o).padStart(10,'0')+' 00000 n \n'); x+=`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${off}\n%%EOF`; parts.push(e(x)); return fcU8(...parts); }
const fcB64=b=>{ let s=''; for(let i=0;i<b.length;i+=0x8000) s+=String.fromCharCode.apply(null,b.subarray(i,i+0x8000)); return btoa(s); };
const fcUnB64=s=>Uint8Array.from(atob(s.replace(/\s+/g,'')),c=>c.charCodeAt(0));
const FC_MIME={png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp',gif:'image/gif',bmp:'image/bmp',ico:'image/x-icon',svg:'image/svg+xml',avif:'image/avif',tif:'image/tiff',tiff:'image/tiff',pdf:'application/pdf',wav:'audio/wav',mp3:'audio/mpeg',ogg:'audio/ogg',flac:'audio/flac',m4a:'audio/mp4',aac:'audio/aac',opus:'audio/ogg',webm:'video/webm',mp4:'video/mp4',mkv:'video/x-matroska',mov:'video/quicktime',ogv:'video/ogg',txt:'text/plain',html:'text/html',json:'application/json',csv:'text/csv',xml:'application/xml'};
// --- obrazy: dekodowanie i rysowanie ---
async function fcImgSrc(F){
  const blob=new Blob([F.data],{type:FC_MIME[F.ext]||''});
  if(F.ext==='svg'){ const im=new Image(); im.src=URL.createObjectURL(blob); await im.decode(); return {src:im,W:im.naturalWidth||1024,H:im.naturalHeight||1024}; }
  const bm=await createImageBitmap(blob); return {src:bm,W:bm.width,H:bm.height}; }
function fcCanvas(S,o,opaque){
  let {W,H}=S; const m=+o.maxSide||0; if(m>0&&Math.max(W,H)>m){ const k=m/Math.max(W,H); W=Math.max(1,Math.round(W*k)); H=Math.max(1,Math.round(H*k)); }
  const c=document.createElement('canvas'); c.width=W; c.height=H; const g=c.getContext('2d',{willReadFrequently:true});
  if(opaque){ g.fillStyle=o.bg||'#ffffff'; g.fillRect(0,0,W,H); } g.imageSmoothingQuality='high'; g.drawImage(S.src,0,0,W,H); return c; }
const fcToBlob=(c,mime,q)=>new Promise((res,rej)=>c.toBlob(b=>b&&b.type===mime?res(b):rej(new Error('enc')),mime,q));
// --- dźwięk ---
function fcSniffRate(b){   // częstotliwość próbkowania z nagłówka (żeby dekodowanie nie zmieniało jej na stałą częstotliwość kontekstu)
  const dv=new DataView(b.buffer,b.byteOffset,b.byteLength), tx=(o,l)=>String.fromCharCode(...b.subarray(o,Math.min(b.length,o+l)));
  if(tx(0,4)==='RIFF'&&tx(8,4)==='WAVE'){ let p=12; while(p+8<=b.length){ const id=tx(p,4), sz=dv.getUint32(p+4,true); if(id==='fmt ') return dv.getUint32(p+12,true); p+=8+sz+(sz&1); } }
  if(tx(0,4)==='fLaC') return (b[18]<<12)|(b[19]<<4)|(b[20]>>4);
  if(tx(0,4)==='OggS'){ const s=tx(0,200); if(s.includes('OpusHead')) return 48000; const j=s.indexOf('\x01vorbis'); if(j>=0) return dv.getUint32(j+12,true); }
  let o=0; if(tx(0,3)==='ID3') o=10+(((b[6]&127)<<21)|((b[7]&127)<<14)|((b[8]&127)<<7)|(b[9]&127));
  for(let i=o;i<Math.min(b.length-4,o+8192);i++) if(b[i]===0xFF&&(b[i+1]&0xE0)===0xE0){ const ver=(b[i+1]>>3)&3, sr=(b[i+2]>>2)&3; if(ver!==1&&sr!==3){ const base=[44100,48000,32000][sr]; return ver===3?base:ver===2?base/2:base/4; } }
  for(let i=0;i<b.length-32;i++) if(b[i]===0x6d&&b[i+1]===0x70&&b[i+2]===0x34&&b[i+3]===0x61){ const r=dv.getUint16(i+28); if(r>=8000&&r<=96000) return r; }
  return 0; }
function fcAiffDecode(b){
  const dv=new DataView(b.buffer,b.byteOffset,b.byteLength); let p=12, nc=0, n=0, bits=0, sr=0, data=-1;
  while(p+8<=b.length){ const id=String.fromCharCode(...b.subarray(p,p+4)), sz=dv.getUint32(p+4);
    if(id==='COMM'){ nc=dv.getUint16(p+8); n=dv.getUint32(p+10); bits=dv.getUint16(p+14); const e=dv.getUint16(p+16)&0x7FFF, m=Number(dv.getBigUint64(p+18)); sr=Math.round(m*2**(e-16383-63)); } else if(id==='SSND') data=p+16; p+=8+sz+(sz&1); }
  if(data<0||!nc) throw new Error('aiff'); const buf=new AudioBuffer({length:n,sampleRate:sr,numberOfChannels:nc}), by=bits/8;
  for(let c=0;c<nc;c++){ const ch=buf.getChannelData(c); for(let i=0;i<n;i++){ const o=data+(i*nc+c)*by; ch[i]=bits===16?dv.getInt16(o)/32768:bits===24?((dv.getInt8(o)<<16)|(dv.getUint8(o+1)<<8)|dv.getUint8(o+2))/8388608:bits===8?dv.getInt8(o)/128:dv.getInt32(o)/2147483648; } }
  return buf; }
async function fcDecodeAudio(bytes){
  if(String.fromCharCode(...bytes.subarray(0,4))==='FORM'&&String.fromCharCode(...bytes.subarray(8,12))==='AIFF') return fcAiffDecode(bytes);
  const AC=window.AudioContext||window.webkitAudioContext, sr=fcSniffRate(bytes), c=sr>=8000&&sr<=96000?new AC({sampleRate:sr}):new AC();
  try{ return await c.decodeAudioData(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength)); } finally{ c.close(); } }
async function fcAudioOpts(buf,o){
  const sr=+o.sr||buf.sampleRate, ch=o.ch==='mono'?1:o.ch==='stereo'?2:Math.min(buf.numberOfChannels,2);
  if(sr!==buf.sampleRate||ch!==buf.numberOfChannels){ const oc=new OfflineAudioContext(ch,Math.max(1,Math.ceil(buf.length*sr/buf.sampleRate)),sr), s=oc.createBufferSource(); s.buffer=buf; s.connect(oc.destination); s.start(); buf=await oc.startRendering(); }
  return buf; }
const fcChans=buf=>Array.from({length:buf.numberOfChannels},(_,i)=>buf.getChannelData(i));
function fcWav(buf,bits){
  const ch=fcChans(buf), n=buf.length, nc=ch.length, bps=bits/8, size=44+n*nc*bps, o=new Uint8Array(size), v=new DataView(o.buffer), s=(p,t)=>[...t].forEach((c,i)=>o[p+i]=c.charCodeAt(0));
  s(0,'RIFF'); v.setUint32(4,size-8,true); s(8,'WAVEfmt '); v.setUint32(16,16,true); v.setUint16(20,bits===32?3:1,true); v.setUint16(22,nc,true); v.setUint32(24,buf.sampleRate,true); v.setUint32(28,buf.sampleRate*nc*bps,true); v.setUint16(32,nc*bps,true); v.setUint16(34,bits,true); s(36,'data'); v.setUint32(40,n*nc*bps,true);
  let p=44; for(let i=0;i<n;i++) for(let c=0;c<nc;c++){ const x=Math.max(-1,Math.min(1,ch[c][i]));
    if(bits===16){ v.setInt16(p,Math.round(x<0?x*32768:x*32767),true); p+=2; } else if(bits===24){ const q=Math.round(x<0?x*8388608:x*8388607); o[p]=q&255; o[p+1]=(q>>8)&255; o[p+2]=(q>>16)&255; p+=3; } else { v.setFloat32(p,ch[c][i],true); p+=4; } }
  return o; }
function fcAiff(buf){
  const ch=fcChans(buf), n=buf.length, nc=ch.length, dsz=n*nc*2, size=12+26+16+dsz, o=new Uint8Array(size), v=new DataView(o.buffer), s=(p,t)=>[...t].forEach((c,i)=>o[p+i]=c.charCodeAt(0));
  s(0,'FORM'); v.setUint32(4,size-8); s(8,'AIFF'); s(12,'COMM'); v.setUint32(16,18); v.setUint16(20,nc); v.setUint32(22,n); v.setUint16(26,16);
  const sr=buf.sampleRate, e=Math.floor(Math.log2(sr)), man=BigInt(sr)<<BigInt(63-e); v.setUint16(28,16383+e); v.setBigUint64(30,man);
  s(38,'SSND'); v.setUint32(42,dsz+8); let p=54; for(let i=0;i<n;i++) for(let c=0;c<nc;c++){ const x=Math.max(-1,Math.min(1,ch[c][i])); v.setInt16(p,Math.round(x<0?x*32768:x*32767)); p+=2; }
  return o; }
class FcBits{ constructor(){ this.b=[]; this.cur=0; this.n=0; }
  put(v,len){ while(len>0){ const take=Math.min(8-this.n,len), part=Math.floor(v/2**(len-take))&((1<<take)-1); this.cur=(this.cur<<take)|part; this.n+=take; len-=take; if(this.n===8){ this.b.push(this.cur); this.cur=0; this.n=0; } } }
  zeros(q){ while(q>0){ const take=Math.min(8-this.n,q); this.cur<<=take; this.n+=take; q-=take; if(this.n===8){ this.b.push(this.cur); this.cur=0; this.n=0; } } }
  align(){ if(this.n) this.put(0,8-this.n); } }
const fcCrc8=a=>{ let c=0; for(const x of a){ c^=x; for(let k=0;k<8;k++) c=c&128?((c<<1)^7)&255:(c<<1)&255; } return c; };
const fcCrc16=a=>{ let c=0; for(const x of a){ c^=x<<8; for(let k=0;k<8;k++) c=c&0x8000?((c<<1)^0x8005)&0xFFFF:(c<<1)&0xFFFF; } return c; };
function fcFlacSub(x,bw){
  const n=x.length; let best=0, cost=Infinity, res=null;
  for(let k=0;k<=Math.min(4,n-1);k++){ const r=new Int32Array(n-k); for(let i=k;i<n;i++) r[i-k]=k===0?x[i]:k===1?x[i]-x[i-1]:k===2?x[i]-2*x[i-1]+x[i-2]:k===3?x[i]-3*x[i-1]+3*x[i-2]-x[i-3]:x[i]-4*x[i-1]+6*x[i-2]-4*x[i-3]+x[i-4];
    let s=0; for(let i=0;i<r.length;i++) s+=Math.abs(r[i]); if(s<cost){ cost=s; best=k; res=r; } }
  const m=res.length?cost/res.length:0; let p=0; while(p<14&&2**(p+1)<=m) p++;
  bw.put(0,1); bw.put(8+best,6); bw.put(0,1); for(let i=0;i<best;i++) bw.put(x[i]&0xFFFF,16);
  bw.put(0,2); bw.put(0,4); bw.put(p,4);
  for(let i=0;i<res.length;i++){ const r=res[i], u=r>=0?r*2:-r*2-1; bw.zeros(Math.floor(u/2**p)); bw.put(1,1); if(p) bw.put(u%(2**p),p); } }
function fcFlac(buf){
  const ch=fcChans(buf).slice(0,2), nc=ch.length, n=buf.length, sr=buf.sampleRate, BS=4096;
  const pcm=ch.map(c=>{ const a=new Int32Array(n); for(let i=0;i<n;i++){ const x=Math.max(-1,Math.min(1,c[i])); a[i]=Math.round(x<0?x*32768:x*32767); } return a; });
  const si=new FcBits(); si.put(BS,16); si.put(BS,16); si.put(0,24); si.put(0,24); si.put(sr,20); si.put(nc-1,3); si.put(15,5); si.put(n,36); for(let i=0;i<16;i++) si.put(0,8);
  const parts=[FCT.encode('fLaC'),Uint8Array.from([0x80,0,0,34]),Uint8Array.from(si.b)];
  for(let off=0,fn=0;off<n||fn===0;off+=BS,fn++){ const bs=Math.min(BS,n-off), bw=new FcBits();
    bw.put(0xFFF8,16); bw.put(bs===BS?12:7,4); bw.put(0,4); bw.put(nc-1,4); bw.put(4,3); bw.put(0,1);
    if(fn<128) bw.put(fn,8); else if(fn<0x800){ bw.put(0xC0|(fn>>6),8); bw.put(0x80|(fn&63),8); } else if(fn<0x10000){ bw.put(0xE0|(fn>>12),8); bw.put(0x80|((fn>>6)&63),8); bw.put(0x80|(fn&63),8); } else { bw.put(0xF0|(fn>>18),8); bw.put(0x80|((fn>>12)&63),8); bw.put(0x80|((fn>>6)&63),8); bw.put(0x80|(fn&63),8); }
    if(bs!==BS) bw.put(bs-1,16); bw.put(fcCrc8(bw.b),8);
    pcm.forEach(c=>fcFlacSub(c.subarray(off,off+bs),bw)); bw.align(); const c16=fcCrc16(bw.b); bw.put(c16,16); parts.push(Uint8Array.from(bw.b)); if(n===0) break; }
  return fcU8(...parts); }
function fcRecorder(stream,mimes,onP,dur){
  const mt=mimes.find(m=>MediaRecorder.isTypeSupported(m)); if(!mt) throw new Error('rec'); const rec=new MediaRecorder(stream,{mimeType:mt}), ch=[]; rec.ondataavailable=e=>{ if(e.data.size) ch.push(e.data); };
  const done=new Promise(r=>rec.onstop=r), t0=performance.now(), iv=setInterval(()=>onP&&onP(Math.min(.99,(performance.now()-t0)/1000/dur)),300);
  rec.start(250); return {rec,mt,finish:async()=>{ rec.stop(); await done; clearInterval(iv); return {bytes:await fcBlobBytes(new Blob(ch)),mime:mt}; }}; }
async function fcRecAudio(buf,onP){
  const c=new (window.AudioContext||window.webkitAudioContext)(), d=c.createMediaStreamDestination(), s=c.createBufferSource(); s.buffer=buf; s.connect(d);
  const r=fcRecorder(d.stream,['audio/webm;codecs=opus','audio/webm'],onP,buf.duration), ended=new Promise(x=>s.onended=x); s.start(); await ended; await new Promise(x=>setTimeout(x,250)); const out=await r.finish(); c.close(); return out.bytes; }
// ---------- dokumenty: model bloków {k:'p|h1..h6|li|ol|q|pre|hr', runs:[{t,b,i,u,c,h}]} ----------
const fcX=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,'');
const fcRt=b=>b.runs.map(r=>r.t).join('');
function fcMdBlocks(src){
  const L=src.replace(/\r\n?/g,'\n').split('\n'), out=[]; let i=0;
  const inl=s=>{ const runs=[], re=/(\*\*|__)(.+?)\1|(\*|_)(.+?)\3|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)/g; let p=0, m;
    while((m=re.exec(s))){ if(m.index>p) runs.push({t:s.slice(p,m.index)}); if(m[2]!==undefined) runs.push({t:m[2],b:1}); else if(m[4]!==undefined) runs.push({t:m[4],i:1}); else if(m[5]!==undefined) runs.push({t:m[5],c:1}); else runs.push({t:m[6],h:m[7]}); p=re.lastIndex; }
    if(p<s.length) runs.push({t:s.slice(p)}); return runs; };
  while(i<L.length){ const l=L[i]; let m;
    if(/^```/.test(l)){ const code=[]; i++; while(i<L.length&&!/^```/.test(L[i])) code.push(L[i++]); i++; out.push({k:'pre',runs:[{t:code.join('\n')}]}); continue; }
    if((m=l.match(/^(#{1,6})\s+(.*)$/))){ out.push({k:'h'+m[1].length,runs:inl(m[2])}); i++; continue; }
    if(/^\s*([-*_])(\s*\1){2,}\s*$/.test(l)){ out.push({k:'hr',runs:[]}); i++; continue; }
    if((m=l.match(/^\s*([-*+]|\d+\.)\s+(.*)$/))){ out.push({k:/\d/.test(m[1])?'ol':'li',runs:inl(m[2])}); i++; continue; }
    if((m=l.match(/^>\s?(.*)$/))){ out.push({k:'q',runs:inl(m[1])}); i++; continue; }
    if(!l.trim()){ i++; continue; }
    const para=[l]; i++; while(i<L.length&&L[i].trim()&&!/^(#{1,6}\s|```|\s*([-*+]|\d+\.)\s|>)/.test(L[i])) para.push(L[i++]); out.push({k:'p',runs:inl(para.join(' '))}); }
  return out; }
const fcTxtBlocks=s=>s.replace(/\r\n?/g,'\n').split('\n').filter(l=>l.trim()).map(l=>({k:'p',runs:[{t:l}]}));
function fcHtmlBlocks(html){
  const d=new DOMParser().parseFromString(html,'text/html'), out=[]; d.querySelectorAll('script,style,head,noscript').forEach(x=>x.remove());
  const inl=(n,st,runs)=>{ n.childNodes.forEach(c=>{ if(c.nodeType===3){ const t=c.nodeValue.replace(/\s+/g,' '); if(t) runs.push({t,...st}); } else if(c.nodeType===1){ const tg=c.tagName.toLowerCase();
    if(tg==='br') runs.push({t:'\n'}); else if(/^(b|strong)$/.test(tg)) inl(c,{...st,b:1},runs); else if(/^(i|em)$/.test(tg)) inl(c,{...st,i:1},runs); else if(tg==='u') inl(c,{...st,u:1},runs);
    else if(/^(code|kbd|samp)$/.test(tg)) inl(c,{...st,c:1},runs); else if(tg==='a') inl(c,{...st,h:c.getAttribute('href')||undefined},runs); else inl(c,st,runs); } }); };
  const blk=n=>{ n.childNodes.forEach(c=>{ if(c.nodeType===3){ if(c.nodeValue.trim()) out.push({k:'p',runs:[{t:c.nodeValue.replace(/\s+/g,' ').trim()}]}); return; } if(c.nodeType!==1) return; const tg=c.tagName.toLowerCase();
    if(/^h[1-6]$/.test(tg)){ const r=[]; inl(c,{},r); out.push({k:tg,runs:r}); }
    else if(tg==='p'||tg==='li'||tg==='dt'||tg==='dd'){ const r=[]; inl(c,{},r); out.push({k:tg==='li'?(c.parentElement&&c.parentElement.tagName==='OL'?'ol':'li'):'p',runs:r}); }
    else if(tg==='pre') out.push({k:'pre',runs:[{t:c.textContent}]}); else if(tg==='hr') out.push({k:'hr',runs:[]});
    else if(tg==='blockquote'){ const r=[]; inl(c,{},r); out.push({k:'q',runs:r}); }
    else if(tg==='tr') out.push({k:'p',runs:[{t:[...c.children].map(x=>x.textContent.trim()).join(' | ')}]});
    else if(/^(ul|ol|div|section|article|main|body|table|tbody|thead|header|footer|nav|form|dl|figure)$/.test(tg)) blk(c);
    else { const r=[]; inl(c,{},r); if(r.some(x=>x.t.trim())) out.push({k:'p',runs:r}); } }); };
  blk(d.body); return out.filter(b=>b.k==='hr'||b.runs.some(r=>r.t.trim())); }
async function fcDocxBlocks(bytes){
  const z=await fcUnzip(bytes), f=z.find(x=>x.name==='word/document.xml'); if(!f) throw new Error('docx');
  const x=new DOMParser().parseFromString(new TextDecoder().decode(f.data),'application/xml'), out=[];
  [...x.getElementsByTagName('w:p')].forEach(p=>{ const ps=p.getElementsByTagName('w:pStyle')[0], st=ps?(ps.getAttribute('w:val')||''):'', num=p.getElementsByTagName('w:numPr').length>0, runs=[];
    [...p.getElementsByTagName('w:r')].forEach(r=>{ const rp=r.getElementsByTagName('w:rPr')[0], has=n=>{ const e=rp&&rp.getElementsByTagName(n)[0]; return !!e&&e.getAttribute('w:val')!=='0'&&e.getAttribute('w:val')!=='false'; }; let t='';
      [...r.childNodes].forEach(c=>{ if(c.nodeName==='w:t') t+=c.textContent; else if(c.nodeName==='w:tab') t+='\t'; else if(c.nodeName==='w:br'||c.nodeName==='w:cr') t+='\n'; }); if(t) runs.push({t,b:has('w:b')?1:0,i:has('w:i')?1:0,u:has('w:u')?1:0}); });
    const m=/^(?:Heading|Nagłówek)\s*(\d)$/i.exec(st), k=m?'h'+Math.min(6,+m[1]):/^Title$/i.test(st)?'h1':(num||/List/i.test(st))?'li':'p'; if(runs.length) out.push({k,runs}); });
  return out; }
async function fcOdtBlocks(bytes){
  const z=await fcUnzip(bytes), f=z.find(x=>x.name==='content.xml'); if(!f) throw new Error('odt');
  const x=new DOMParser().parseFromString(new TextDecoder().decode(f.data),'application/xml'), out=[];
  const gather=n=>{ let t=''; n.childNodes.forEach(c=>{ if(c.nodeType===3) t+=c.nodeValue; else if(c.nodeName==='text:tab') t+='\t'; else if(c.nodeName==='text:s') t+=' '.repeat(+c.getAttribute('text:c')||1); else if(c.nodeName==='text:line-break') t+='\n'; else t+=gather(c); }); return t; };
  const walk=(n,li)=>{ n.childNodes.forEach(c=>{ if(c.nodeName==='text:h') out.push({k:'h'+Math.min(6,+c.getAttribute('text:outline-level')||1),runs:[{t:gather(c)}]}); else if(c.nodeName==='text:p'){ const t=gather(c); if(t) out.push({k:li?'li':'p',runs:[{t}]}); } else if(c.nodeType===1) walk(c,li||c.nodeName==='text:list'); }); };
  walk(x.documentElement,false); return out; }
function fcRtfBlocks(s){
  let out='', i=0, depth=0, skip=-1, uc=1; const stack=[];
  while(i<s.length){ const ch=s[i];
    if(ch==='{'){ stack.push(skip); depth++; i++; if(s[i]==='\\'&&s[i+1]==='*') skip=depth; continue; }
    if(ch==='}'){ if(skip===depth) skip=stack[stack.length-1]; skip=stack.pop()===undefined?skip:(skip>=depth?-1:skip); depth--; i++; continue; }
    if(ch==='\\'){ const m=/^\\([a-zA-Z]+)(-?\d+)? ?/.exec(s.slice(i,i+40));
      if(m){ i+=m[0].length; const w=m[1], n=m[2]; if(/^(fonttbl|colortbl|stylesheet|info|pict|header|footer)$/.test(w)&&skip<0) skip=depth;
        else if(skip<0){ if(w==='par'||w==='line') out+='\n'; else if(w==='tab') out+='\t'; else if(w==='u'){ let c=+n; if(c<0) c+=65536; out+=String.fromCharCode(c); i+=uc>0&&s[i]==='?'?1:0; } else if(w==='uc') uc=+n; } continue; }
      const m2=/^\\'([0-9a-fA-F]{2})/.exec(s.slice(i,i+4)); if(m2){ i+=4; if(skip<0) out+=new TextDecoder('windows-1250').decode(Uint8Array.of(parseInt(m2[1],16))); continue; }
      if(s[i+1]==='\n'||s[i+1]==='\r'){ i+=2; if(skip<0) out+='\n'; continue; } if(skip<0) out+=s[i+1]; i+=2; continue; }
    if(ch!=='\n'&&ch!=='\r'&&skip<0) out+=ch; i++; }
  return fcTxtBlocks(out); }
function fcRuns(b,f){ return b.runs.map(r=>f(r)).join(''); }
function fcToTxt(bl){ let n=0, o=''; bl.forEach((b,i)=>{ let t=fcRt(b); if(b.k==='ol') t=(++n)+'. '+t; else { n=0; if(b.k==='li') t='• '+t; else if(b.k==='hr') t='----------'; }
  o+=(i?(/^(li|ol)$/.test(b.k)&&/^(li|ol)$/.test(bl[i-1].k)?'\n':'\n\n'):'')+t; }); return o+'\n'; }
function fcToMd(bl){ let n=0, o=''; bl.forEach((b,i)=>{ const t=fcRuns(b,r=>{ let s=r.t; if(r.c) s='`'+s+'`'; if(r.b) s='**'+s+'**'; if(r.i) s='*'+s+'*'; if(r.h) s='['+s+']('+r.h+')'; return s; }); let l;
  if(/^h[1-6]$/.test(b.k)) l='#'.repeat(+b.k[1])+' '+t; else if(b.k==='li') l='- '+t; else if(b.k==='ol') l=(++n)+'. '+t; else if(b.k==='q') l='> '+t; else if(b.k==='pre') l='```\n'+fcRt(b)+'\n```'; else if(b.k==='hr') l='---'; else l=t; if(b.k!=='ol') n=0;
  o+=(i?(/^(li|ol)$/.test(b.k)&&/^(li|ol)$/.test(bl[i-1].k)?'\n':'\n\n'):'')+l; }); return o+'\n'; }
function fcBody(bl){ let o='', open=''; const close=()=>{ if(open){ o+='</'+open+'>\n'; open=''; } };
  bl.forEach(b=>{ const t=fcRuns(b,r=>{ let s=fcX(r.t).replace(/\n/g,'<br>'); if(r.c) s='<code>'+s+'</code>'; if(r.b) s='<b>'+s+'</b>'; if(r.i) s='<i>'+s+'</i>'; if(r.u) s='<u>'+s+'</u>'; if(r.h) s='<a href="'+fcX(r.h)+'">'+s+'</a>'; return s; });
    if(b.k==='li'||b.k==='ol'){ const tg=b.k==='li'?'ul':'ol'; if(open!==tg){ close(); o+='<'+tg+'>\n'; open=tg; } o+='<li>'+t+'</li>\n'; return; } close();
    if(/^h[1-6]$/.test(b.k)) o+='<'+b.k+'>'+t+'</'+b.k+'>\n'; else if(b.k==='q') o+='<blockquote>'+t+'</blockquote>\n'; else if(b.k==='pre') o+='<pre>'+fcX(fcRt(b))+'</pre>\n'; else if(b.k==='hr') o+='<hr>\n'; else o+='<p>'+t+'</p>\n'; });
  close(); return o; }
const fcHtmlDoc=(bl,title,csp)=>`<!DOCTYPE html>\n<html><head><meta charset="utf-8">${csp?'<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; style-src \'unsafe-inline\'; img-src data:">':''}<title>${fcX(title||'')}</title><style>body{font-family:"Segoe UI",Arial,sans-serif;max-width:800px;margin:40px auto;padding:0 16px;line-height:1.6;color:#222}pre{background:#f4f4f4;padding:10px;overflow:auto}code{background:#f4f4f4;padding:0 3px}blockquote{border-left:3px solid #ccc;margin-left:0;padding-left:12px;color:#555}</style></head><body>\n${fcBody(bl)}</body></html>\n`;
async function fcToDocx(bl){
  const nums=[]; let curNum=0; const ps=bl.map(b=>{ let ppr='', rp='';
    if(b.k!=='ol') curNum=0;
    if(/^h[1-6]$/.test(b.k)) ppr='<w:pPr><w:pStyle w:val="Heading'+b.k[1]+'"/></w:pPr>';
    else if(b.k==='li') ppr='<w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr><w:ind w:left="720" w:hanging="360"/></w:pPr>';
    else if(b.k==='ol'){ if(!curNum){ nums.push(1); curNum=nums.length+1; } ppr='<w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="'+curNum+'"/></w:numPr><w:ind w:left="720" w:hanging="360"/></w:pPr>'; }
    else if(b.k==='q') ppr='<w:pPr><w:ind w:left="720"/></w:pPr>'; else if(b.k==='hr') ppr='<w:pPr><w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="999999"/></w:pBdr></w:pPr>'; else if(b.k==='pre') rp='<w:rFonts w:ascii="Courier New" w:hAnsi="Courier New"/>';
    const runs=b.runs.map(r=>{ const props=rp+(r.c?'<w:rFonts w:ascii="Courier New" w:hAnsi="Courier New"/>':'')+(r.b?'<w:b/>':'')+(r.i?'<w:i/>':'')+(r.u?'<w:u w:val="single"/>':''), parts=r.t.split(/(\n|\t)/).map(x=>x==='\n'?'<w:br/>':x==='\t'?'<w:tab/>':x?'<w:t xml:space="preserve">'+fcX(x)+'</w:t>':'').join('');
      return '<w:r>'+(props?'<w:rPr>'+props+'</w:rPr>':'')+parts+'</w:r>'; }).join('');
    return '<w:p>'+ppr+runs+'</w:p>'; }).join('');
  const NS='xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"', H='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
  const lvl=(fmt,txt)=>`<w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="${fmt}"/><w:lvlText w:val="${txt}"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="720" w:hanging="360"/></w:pPr></w:lvl>`;
  const numbering=H+`<w:numbering ${NS}><w:abstractNum w:abstractNumId="0"><w:multiLevelType w:val="hybridMultilevel"/>${lvl('bullet','•')}</w:abstractNum><w:abstractNum w:abstractNumId="1"><w:multiLevelType w:val="hybridMultilevel"/>${lvl('decimal','%1.')}</w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num>`+nums.map((_,i)=>`<w:num w:numId="${i+2}"><w:abstractNumId w:val="1"/><w:lvlOverride w:ilvl="0"><w:startOverride w:val="1"/></w:lvlOverride></w:num>`).join('')+'</w:numbering>';
  const sizes=[32,28,26,24,22,22], st=[1,2,3,4,5,6].map(i=>`<w:style w:type="paragraph" w:styleId="Heading${i}"><w:name w:val="heading ${i}"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:spacing w:before="240" w:after="80"/><w:outlineLvl w:val="${i-1}"/></w:pPr><w:rPr><w:b/><w:sz w:val="${sizes[i-1]}"/></w:rPr></w:style>`).join('');
  return fcZip([{name:'[Content_Types].xml',data:FCT.encode(H+'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/></Types>')},
    {name:'_rels/.rels',data:FCT.encode(H+'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>')},
    {name:'word/_rels/document.xml.rels',data:FCT.encode(H+'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/></Relationships>')},
    {name:'word/styles.xml',data:FCT.encode(H+`<w:styles ${NS}><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/><w:sz w:val="22"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="264" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>${st}</w:styles>`)},
    {name:'word/numbering.xml',data:FCT.encode(numbering)},
    {name:'word/document.xml',data:FCT.encode(H+`<w:document ${NS}><w:body>${ps}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr></w:body></w:document>`)}]); }
async function fcToOdt(bl){
  let n=0; const st=new Set(), sp=b=>{ const k=(b.b?1:0)|(b.i?2:0)|(b.u?4:0)|(b.c?8:0); if(k) st.add(k); return k; };
  const body=bl.map(b=>{ if(b.k!=='ol') n=0; const pre=b.k==='li'?'• ':b.k==='ol'?(++n)+'. ':'', t=(pre?[{t:pre}]:[]).concat(b.runs).map(r=>{ const k=sp(r), x=fcX(r.t).replace(/\n/g,'<text:line-break/>').replace(/\t/g,'<text:tab/>'); return k?`<text:span text:style-name="F${k}">${x}</text:span>`:x; }).join('');
    if(/^h[1-6]$/.test(b.k)) return `<text:h text:style-name="H${b.k[1]}" text:outline-level="${b.k[1]}">${t}</text:h>`; if(b.k==='hr') return '<text:p>────────────</text:p>'; if(b.k==='q') return `<text:p text:style-name="Q">${t}</text:p>`; return `<text:p>${t}</text:p>`; }).join('');
  const fs=[...st].map(k=>`<style:style style:name="F${k}" style:family="text"><style:text-properties${k&1?' fo:font-weight="bold"':''}${k&2?' fo:font-style="italic"':''}${k&4?' style:text-underline-style="solid" style:text-underline-width="auto" style:text-underline-color="font-color"':''}${k&8?' style:font-name="Courier New"':''}/></style:style>`).join('');
  const hs=[1,2,3,4,5,6].map(i=>`<style:style style:name="H${i}" style:family="paragraph"><style:text-properties fo:font-size="${[20,17,15,13,12,12][i-1]}pt" fo:font-weight="bold"/></style:style>`).join('');
  const content='<?xml version="1.0" encoding="UTF-8"?>\n<office:document-content xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0" xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0" office:version="1.2"><office:automatic-styles>'+fs+hs+'<style:style style:name="Q" style:family="paragraph"><style:paragraph-properties fo:margin-left="1cm"/></style:style></office:automatic-styles><office:body><office:text>'+body+'</office:text></office:body></office:document-content>';
  return fcZip([{name:'mimetype',data:FCT.encode('application/vnd.oasis.opendocument.text'),store:true},{name:'META-INF/manifest.xml',data:FCT.encode('<?xml version="1.0" encoding="UTF-8"?>\n<manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0" manifest:version="1.2"><manifest:file-entry manifest:full-path="/" manifest:media-type="application/vnd.oasis.opendocument.text"/><manifest:file-entry manifest:full-path="content.xml" manifest:media-type="text/xml"/></manifest:manifest>')},{name:'content.xml',data:FCT.encode(content)}]); }
function fcToRtf(bl){
  const esc=s=>{ let o=''; for(const ch of s){ const c=ch.codePointAt(0); if(ch==='\\'||ch==='{'||ch==='}') o+='\\'+ch; else if(ch==='\n') o+='\\line '; else if(ch==='\t') o+='\\tab '; else if(c>126){ if(c>65535){ const h=c-65536; o+='\\u'+(0xD800+(h>>10)-65536)+'?\\u'+(0xDC00+(h&1023)-65536)+'?'; } else o+='\\u'+(c>32767?c-65536:c)+'?'; } else o+=ch; } return o; };
  let n=0; const ps=bl.map(b=>{ if(b.k!=='ol') n=0; const pre=b.k==='li'?'• ':b.k==='ol'?(++n)+'. ':'', hz=/^h[1-6]$/.test(b.k)?[44,36,32,28,24,24][+b.k[1]-1]:0;
    const t=(pre?[{t:pre}]:[]).concat(b.runs).map(r=>(r.c?'\\f1 ':'')+(r.b||hz?'\\b ':'')+(r.i?'\\i ':'')+(r.u?'\\ul ':'')+esc(r.t)+(r.u?'\\ulnone ':'')+(r.i?'\\i0 ':'')+(r.b||hz?'\\b0 ':'')+(r.c?'\\f0 ':'')).join('');
    return '{\\pard'+(b.k==='q'?'\\li720':'')+(hz?'\\fs'+hz:'')+' '+(b.k==='hr'?'──────────':t)+'\\par}'; }).join('\n');
  return FCT.encode('{\\rtf1\\ansi\\ansicpg1250\\deff0\\uc1{\\fonttbl{\\f0 Calibri;}{\\f1 Courier New;}}\\fs22\n'+ps+'\n}'); }
// ---------- dane: tabela {cols,rows} ----------
const fcCell=v=>v!==null&&typeof v==='object'?JSON.stringify(v):v;
function fcTyp(v){ if(typeof v!=='string') return v; if(/^-?(0|[1-9]\d{0,14})(\.\d+)?$/.test(v)) return +v; if(v==='true') return true; if(v==='false') return false; return v; }
function fcJsonTable(j){
  if(!Array.isArray(j)) j=(j&&typeof j==='object')?[j]:[{value:j}];
  if(j.length&&j.every(r=>Array.isArray(r))){ const w=Math.max(...j.map(r=>r.length)), cols=Array.from({length:w},(_,i)=>'col'+(i+1)); return {cols,rows:j.map(r=>cols.map((_,i)=>fcCell(r[i])))}; }
  const cols=[]; j.forEach(r=>{ if(r&&typeof r==='object'&&!Array.isArray(r)) Object.keys(r).forEach(k=>{ if(!cols.includes(k)) cols.push(k); }); else if(!cols.includes('value')) cols.push('value'); });
  return {cols,rows:j.map(r=>cols.map(k=>(r&&typeof r==='object'&&!Array.isArray(r))?fcCell(r[k]):(k==='value'?r:undefined)))}; }
function fcCsvRows(s,d){ const rows=[]; let row=[], f='', q=false; s=s.replace(/^\uFEFF/,'');
  for(let i=0;i<s.length;i++){ const c=s[i]; if(q){ if(c==='"'){ if(s[i+1]==='"'){ f+='"'; i++; } else q=false; } else f+=c; } else if(c==='"'&&f==='') q=true; else if(c===d){ row.push(f); f=''; } else if(c==='\n'||c==='\r'){ if(c==='\r'&&s[i+1]==='\n') i++; row.push(f); f=''; rows.push(row); row=[]; } else f+=c; }
  if(f!==''||row.length){ row.push(f); rows.push(row); } return rows.filter(r=>r.length>1||r[0]!==''); }
function fcCsvTable(s,ext,sep){ const l=s.split(/\r?\n/)[0]||'', d=ext==='tsv'?'\t':(sep&&sep!=='auto'?sep:([',',';','\t','|'].map(c=>[c,l.split(c).length]).sort((a,b)=>b[1]-a[1])[0][0])); const r=fcCsvRows(s,d); if(!r.length) return {cols:[],rows:[]}; return {cols:r[0],rows:r.slice(1)}; }
function fcXmlTable(s){ const x=new DOMParser().parseFromString(s,'application/xml'); if(x.getElementsByTagName('parsererror').length) throw new Error('xml');
  let host=x.documentElement; const kids=n=>[...n.children]; while(kids(host).length===1&&kids(kids(host)[0]).length) host=kids(host)[0];
  const rowsEl=kids(host); const cols=[], rows=rowsEl.map(r=>{ const o={}; [...r.attributes].forEach(a=>o['@'+a.name]=a.value); if(kids(r).length) kids(r).forEach(c=>{ o[c.tagName]=kids(c).length?c.textContent.trim():c.textContent; }); else o[r.tagName]=r.textContent; return o; });
  rows.forEach(o=>Object.keys(o).forEach(k=>{ if(!cols.includes(k)) cols.push(k); })); return {cols,rows:rows.map(o=>cols.map(k=>o[k]))}; }
function fcYamlVal(v){ v=v.trim(); if(v===''||v==='null'||v==='~') return null; if(/^".*"$/.test(v)){ try{ return JSON.parse(v); }catch{ return v.slice(1,-1); } } if(/^'.*'$/.test(v)) return v.slice(1,-1).replace(/''/g,"'"); if(v==='true') return true; if(v==='false') return false; if(/^-?\d+(\.\d+)?$/.test(v)) return +v; return v; }
function fcYamlTable(s){ const items=[]; let cur=null; s.replace(/\r\n?/g,'\n').split('\n').forEach(l=>{ if(!l.trim()||/^\s*#/.test(l)||/^---/.test(l)) return; let m;
  const ky=k=>{ k=k.trim(); if(/^".*"$/.test(k)){ try{ return JSON.parse(k); }catch{} } return k; };
  if((m=l.match(/^-\s+("[^"]*"|[^:]+?):\s*(.*)$/))){ cur={}; items.push(cur); cur[ky(m[1])]=fcYamlVal(m[2]); } else if((m=l.match(/^\s+("[^"]*"|[^:]+?):\s*(.*)$/))&&cur) cur[ky(m[1])]=fcYamlVal(m[2]); else if((m=l.match(/^-\s*(.+)$/))){ items.push({value:fcYamlVal(m[1])}); cur=null; } });
  if(!items.length) throw new Error('yaml'); return fcJsonTable(items); }
function fcHtmlTable(s){ const d=new DOMParser().parseFromString(s,'text/html'), t=d.querySelector('table'); if(!t) throw new Error('table'); const rs=[...t.querySelectorAll('tr')].map(r=>[...r.children].map(c=>c.textContent.trim())); return {cols:rs[0]||[],rows:rs.slice(1)}; }
function fcMdTable(s){ const ls=s.split(/\r?\n/).filter(l=>/\|/.test(l)); if(ls.length<2) throw new Error('md'); const sp=l=>l.trim().replace(/^\||\|$/g,'').split('|').map(x=>x.trim()); const rows=ls.filter(l=>!/^\s*\|?\s*:?-{2,}/.test(l)).map(sp); return {cols:rows[0],rows:rows.slice(1)}; }
const fcColName=i=>{ let s=''; i++; while(i>0){ const m=(i-1)%26; s=String.fromCharCode(65+m)+s; i=Math.floor((i-1)/26); } return s; };
async function fcXlsxTable(bytes){
  const z=await fcUnzip(bytes), get=n=>{ const f=z.find(x=>x.name===n); return f?new TextDecoder().decode(f.data):null; }; const sh=get('xl/worksheets/sheet1.xml')||get((z.find(x=>/^xl\/worksheets\/sheet\d+\.xml$/.test(x.name))||{}).name); if(!sh) throw new Error('xlsx');
  const ss=get('xl/sharedStrings.xml'), strs=ss?[...new DOMParser().parseFromString(ss,'application/xml').getElementsByTagName('si')].map(si=>[...si.getElementsByTagName('t')].map(t=>t.textContent).join('')):[];
  const x=new DOMParser().parseFromString(sh,'application/xml'), rows=[];
  [...x.getElementsByTagName('row')].forEach(r=>{ const row=[]; [...r.getElementsByTagName('c')].forEach(c=>{ const ref=c.getAttribute('r')||'', col=ref.replace(/\d+/g,''); let ci=0; for(const ch of col) ci=ci*26+ch.charCodeAt(0)-64; ci=ci?ci-1:row.length; const t=c.getAttribute('t'), vEl=c.getElementsByTagName('v')[0], v=vEl?vEl.textContent:''; let val;
    if(t==='s') val=strs[+v]; else if(t==='inlineStr') val=[...c.getElementsByTagName('t')].map(q=>q.textContent).join(''); else if(t==='b') val=v==='1'; else if(t==='str') val=v; else val=v===''?undefined:(isNaN(+v)?v:+v); row[ci]=val; }); rows.push(row); });
  const w=Math.max(0,...rows.map(r=>r.length)); const full=rows.map(r=>Array.from({length:w},(_,i)=>r[i])); return {cols:(full[0]||[]).map((c,i)=>c==null?'col'+(i+1):String(c)),rows:full.slice(1)}; }
const fcObjs=(T,typ)=>T.rows.map(r=>{ const o={}; T.cols.forEach((c,i)=>{ const v=r[i]; o[c]=v===undefined?null:(typ?fcTyp(v):v); }); return o; });
const fcTag=s=>{ s=String(s).replace(/[^\p{L}\p{N}_.\-]/gu,'_'); return /^[\p{L}_]/u.test(s)?s:'_'+s; };
function fcDataOut(T,ext,o){
  const typ=!!o.typ, nul=v=>v===undefined||v===null?'':v;
  if(ext==='json') return JSON.stringify(fcObjs(T,typ),null,2)+'\n';
  if(ext==='ndjson') return fcObjs(T,typ).map(x=>JSON.stringify(x)).join('\n')+'\n';
  if(ext==='csv'||ext==='tsv'){ const d=ext==='tsv'?'\t':(o.sep&&o.sep!=='auto'?o.sep:','), q=v=>{ v=String(nul(v)); return (v.includes(d)||/["\r\n]/.test(v))?'"'+v.replace(/"/g,'""')+'"':v; }; return [T.cols,...T.rows].map(r=>T.cols.map((_,i)=>q(r[i])).join(d)).join('\r\n')+'\r\n'; }
  if(ext==='xml') return '<?xml version="1.0" encoding="UTF-8"?>\n<rows>\n'+T.rows.map(r=>'  <row>\n'+T.cols.map((c,i)=>'    <'+fcTag(c)+'>'+fcX(nul(r[i]))+'</'+fcTag(c)+'>\n').join('')+'  </row>\n').join('')+'</rows>\n';
  if(ext==='yaml'){ const y=v=>{ v=typ?fcTyp(v):v; if(v===null||v===undefined||v==='') return 'null'; if(typeof v==='number'||typeof v==='boolean') return String(v); return /^[\w][\w .\-@/]*$/.test(v)&&!/^(true|false|null|~|-?\d.*)$/i.test(v)&&!/\s$/.test(v)?v:JSON.stringify(v); }; return T.rows.map(r=>T.cols.map((c,i)=>(i?'  ':'- ')+(/^[\p{L}\p{N}_\-]+$/u.test(c)?c:JSON.stringify(c))+': '+y(r[i])).join('\n')).join('\n')+'\n'; }
  if(ext==='html') return '<!DOCTYPE html>\n<html><head><meta charset="utf-8"><title>Dane</title><style>table{border-collapse:collapse;font-family:Segoe UI,Arial,sans-serif}td,th{border:1px solid #bbb;padding:4px 10px}th{background:#eee}</style></head><body>\n<table>\n<tr>'+T.cols.map(c=>'<th>'+fcX(c)+'</th>').join('')+'</tr>\n'+T.rows.map(r=>'<tr>'+T.cols.map((_,i)=>'<td>'+fcX(nul(r[i]))+'</td>').join('')+'</tr>\n').join('')+'</table>\n</body></html>\n';
  if(ext==='md'){ const e=v=>String(nul(v)).replace(/\|/g,'\\|').replace(/\n/g,' '); return '| '+T.cols.map(e).join(' | ')+' |\n|'+T.cols.map(()=>' --- |').join('')+'\n'+T.rows.map(r=>'| '+T.cols.map((_,i)=>e(r[i])).join(' | ')+' |').join('\n')+'\n'; }
  if(ext==='sql'){ const q=v=>{ v=typ?fcTyp(v):v; return v===undefined||v===null||v===''?'NULL':typeof v==='number'?String(v):typeof v==='boolean'?(v?'1':'0'):"'"+String(v).replace(/'/g,"''")+"'"; }; return T.rows.map(r=>'INSERT INTO "dane" ('+T.cols.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(', ')+') VALUES ('+T.cols.map((_,i)=>q(r[i])).join(', ')+');').join('\n')+'\n'; }
  throw new Error('fmt'); }
async function fcToXlsx(T,typ){
  const H='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n', cell=(v,r,c)=>{ v=typ?fcTyp(v):v; const ref=fcColName(c)+(r+1); if(v===undefined||v===null||v==='') return ''; if(typeof v==='number') return `<c r="${ref}"><v>${v}</v></c>`; if(typeof v==='boolean') return `<c r="${ref}" t="b"><v>${v?1:0}</v></c>`; return `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${fcX(v)}</t></is></c>`; };
  const all=[T.cols,...T.rows], sheet=H+'<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>'+all.map((r,i)=>'<row r="'+(i+1)+'">'+T.cols.map((_,c)=>i===0?`<c r="${fcColName(c)}1" t="inlineStr"><is><t xml:space="preserve">${fcX(r[c]===undefined?'':r[c])}</t></is></c>`:cell(r[c],i,c)).join('')+'</row>').join('')+'</sheetData></worksheet>';
  return fcZip([{name:'[Content_Types].xml',data:FCT.encode(H+'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>')},
    {name:'_rels/.rels',data:FCT.encode(H+'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>')},
    {name:'xl/workbook.xml',data:FCT.encode(H+'<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Dane" sheetId="1" r:id="rId1"/></sheets></workbook>')},
    {name:'xl/_rels/workbook.xml.rels',data:FCT.encode(H+'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>')},
    {name:'xl/worksheets/sheet1.xml',data:FCT.encode(sheet)}]); }
// ---------- kodowanie tekstu ----------
const FC_SB={cp1250:'windows-1250',iso2:'iso-8859-2',cp1252:'windows-1252',iso15:'iso-8859-15',cp1251:'windows-1251',koi8r:'koi8-r'};
function fcSbEnc(name,s){ const map=new Map(); const d=new TextDecoder(name); for(let i=255;i>=0;i--){ const ch=d.decode(Uint8Array.of(i)); if(ch!=='\uFFFD') map.set(ch,i); } const o=new Uint8Array(s.length*2); let p=0; for(const ch of s){ const v=map.get(ch); o[p++]=v===undefined?63:v; } return o.slice(0,p); }
function fcDecodeText(b,enc){
  if(enc&&enc!=='auto') return new TextDecoder(enc).decode(b);
  if(b[0]===0xEF&&b[1]===0xBB&&b[2]===0xBF) return new TextDecoder('utf-8').decode(b.subarray(3)); if(b[0]===0xFF&&b[1]===0xFE) return new TextDecoder('utf-16le').decode(b.subarray(2)); if(b[0]===0xFE&&b[1]===0xFF) return new TextDecoder('utf-16be').decode(b.subarray(2));
  try{ return new TextDecoder('utf-8',{fatal:true}).decode(b); }catch{ return new TextDecoder(/^(pl|szl)$/.test(S.settings.ui.lang)?'windows-1250':'windows-1252').decode(b); } }
function fcEncodeText(s,t){
  if(t==='utf8') return FCT.encode(s); if(t==='utf8bom') return fcU8(Uint8Array.of(0xEF,0xBB,0xBF),FCT.encode(s));
  if(t==='utf16le'||t==='utf16be'){ const o=new Uint8Array(2+s.length*2), v=new DataView(o.buffer), le=t==='utf16le'; v.setUint16(0,0xFEFF,le); for(let i=0;i<s.length;i++) v.setUint16(2+i*2,s.charCodeAt(i),le); return o; }
  if(t==='ascii'){ const o=[]; for(const ch of s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ł/g,'l').replace(/Ł/g,'L')){ o.push(ch.charCodeAt(0)<128?ch.charCodeAt(0):63); } return Uint8Array.from(o); }
  return fcSbEnc(FC_SB[t],s); }
// ---------- zmieniacz formatów: kategorie, formaty, interfejs ----------
const fcData=async F=>F.data||(F.data=new Uint8Array(await F.file.arrayBuffer()));
const fcBase=n=>n.replace(/\.[^.]+$/,'');
const fcSize=n=>n<1024?n+' B':n<1048576?(n/1024).toFixed(1)+' kB':(n/1048576).toFixed(n<1e8?2:1)+' MB';
const fcPx=c=>c.getContext('2d',{willReadFrequently:true}).getImageData(0,0,c.width,c.height).data;
const fcSeek=(v,t)=>new Promise(r=>{ v.onseeked=()=>r(); v.currentTime=Math.max(0,Math.min(t,(v.duration||t)-.001)); });
function fcVideoEl(F){ return new Promise((res,rej)=>{ const v=document.createElement('video'); v.preload='auto'; v.muted=false; v.src=URL.createObjectURL(new Blob([F.data],{type:FC_MIME[F.ext]||'video/mp4'})); v.onloadedmetadata=()=>res(v); v.onerror=()=>rej(new Error('video')); }); }
// --- obrazy ---
async function fcImgRun(F,o,tg){
  const S=await fcImgSrc({ext:F.ext,data:await fcData(F)}), q=(+o.q||90)/100, png=async c=>fcBlobBytes(await fcToBlob(c,'image/png'));
  switch(tg.id){
    case 'png': return {bytes:await png(fcCanvas(S,o,false)),ext:'png'};
    case 'jpg': return {bytes:await fcBlobBytes(await fcToBlob(fcCanvas(S,o,true),'image/jpeg',q)),ext:'jpg'};
    case 'webp': return {bytes:await fcBlobBytes(await fcToBlob(fcCanvas(S,o,false),'image/webp',q)),ext:'webp'};
    case 'gif': { const c=fcCanvas(S,o,false); return {bytes:fcGif([{px:fcPx(c),delay:0}],c.width,c.height,0),ext:'gif'}; }
    case 'bmp': { const c=fcCanvas(S,o,true); return {bytes:fcBmp(fcPx(c),c.width,c.height),ext:'bmp'}; }
    case 'tiff': { const c=fcCanvas(S,o,false); return {bytes:fcTiff(fcPx(c),c.width,c.height),ext:'tiff'}; }
    case 'ppm': { const c=fcCanvas(S,o,true); return {bytes:fcPpm(fcPx(c),c.width,c.height),ext:'ppm'}; }
    case 'svg': { const c=fcCanvas(S,o,false), b=await png(c); return {bytes:FCT.encode(`<svg xmlns="http://www.w3.org/2000/svg" width="${c.width}" height="${c.height}" viewBox="0 0 ${c.width} ${c.height}"><image width="${c.width}" height="${c.height}" href="data:image/png;base64,${fcB64(b)}"/></svg>\n`),ext:'svg'}; }
    case 'pdf': { const c=fcCanvas(S,o,true), j=await fcBlobBytes(await fcToBlob(c,'image/jpeg',q)); return {bytes:fcPdfImg(j,c.width,c.height),ext:'pdf'}; }
    case 'ico': { const pngs=[]; for(const s of [16,32,48,64,128,256]){ const c=document.createElement('canvas'); c.width=c.height=s; const g=c.getContext('2d'), k=Math.min(s/S.W,s/S.H), w=S.W*k, h=S.H*k; g.imageSmoothingQuality='high'; g.drawImage(S.src,(s-w)/2,(s-h)/2,w,h); pngs.push({s,bytes:await png(c)}); } return {bytes:fcIco(pngs),ext:'ico'}; }
  } throw new Error('fmt'); }
// --- dźwięk ---
async function fcAudioEnc(buf,id,P){
  if(id==='wav') return {bytes:fcWav(buf,16),ext:'wav'}; if(id==='wav24') return {bytes:fcWav(buf,24),ext:'wav'}; if(id==='wav32') return {bytes:fcWav(buf,32),ext:'wav'};
  if(id==='aiff') return {bytes:fcAiff(buf),ext:'aiff'}; if(id==='flac') return {bytes:fcFlac(buf),ext:'flac'}; return {bytes:await fcRecAudio(buf,P),ext:'webm'}; }
async function fcAudioRun(F,o,tg,P){ const buf=await fcAudioOpts(await fcDecodeAudio(await fcData(F)),o); return fcAudioEnc(buf,tg.id==='weba'?'webm':tg.id,P); }
// --- wideo ---
async function fcVideoRun(F,o,tg,P){
  await fcData(F);
  if(/^(wav|flac|weba)$/.test(tg.id)){ const buf=await fcAudioOpts(await fcDecodeAudio(F.data),o); return fcAudioEnc(buf,tg.id==='weba'?'webm':tg.id,P); }
  const v=await fcVideoEl(F);
  if(tg.id==='png'||tg.id==='jpg'){ await fcSeek(v,+o.ft||0); const c=document.createElement('canvas'); c.width=v.videoWidth; c.height=v.videoHeight; const g=c.getContext('2d'); if(tg.id==='jpg'){ g.fillStyle='#fff'; g.fillRect(0,0,c.width,c.height); } g.drawImage(v,0,0);
    return {bytes:await fcBlobBytes(await fcToBlob(c,tg.id==='png'?'image/png':'image/jpeg',(+o.q||90)/100)),ext:tg.id}; }
  if(tg.id==='gif'){ const fps=Math.max(1,Math.min(25,+o.fps||10)), W=Math.max(16,Math.min(1280,+o.gw||480)), H=Math.max(1,Math.round(W*v.videoHeight/v.videoWidth)), n=Math.max(1,Math.min(300,Math.floor((v.duration||1)*fps))), c=document.createElement('canvas'); c.width=W; c.height=H; const g=c.getContext('2d',{willReadFrequently:true}), fr=[];
    for(let i=0;i<n;i++){ await fcSeek(v,i/fps); g.drawImage(v,0,0,W,H); fr.push({px:g.getImageData(0,0,W,H).data.slice(),delay:100/fps,tr:false}); P(i/n); } return {bytes:fcGif(fr,W,H,0),ext:'gif'}; }
  const ctx=new (window.AudioContext||window.webkitAudioContext)(), src=ctx.createMediaElementSource(v), dest=ctx.createMediaStreamDestination(); src.connect(dest);
  const stream=new MediaStream([...v.captureStream().getVideoTracks(),...dest.stream.getAudioTracks()]), mp4=tg.id==='mp4';
  const r=fcRecorder(stream,mp4?['video/mp4;codecs=avc1.42E01E,mp4a.40.2','video/mp4']:['video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'],P,v.duration||1), ended=new Promise(x=>v.onended=x);
  await v.play(); await ended; await new Promise(x=>setTimeout(x,300)); const out=await r.finish(); ctx.close(); return {bytes:out.bytes,ext:mp4?'mp4':'webm'}; }
// --- dokumenty ---
async function fcDocBlocks(F){ const d=await fcData(F), e=F.ext; if(e==='docx') return fcDocxBlocks(d); if(e==='odt') return fcOdtBlocks(d); const s=fcDecodeText(d,'auto');
  return (e==='md'||e==='markdown')?fcMdBlocks(s):(e==='html'||e==='htm')?fcHtmlBlocks(s):e==='rtf'?fcRtfBlocks(s):fcTxtBlocks(s); }
async function fcDocRun(F,o,tg){
  const bl=await fcDocBlocks(F); if(!bl.length) throw new Error('empty'); const ti=fcBase(F.name);
  switch(tg.id){ case 'txt': return {bytes:FCT.encode(fcToTxt(bl)),ext:'txt'}; case 'md': return {bytes:FCT.encode(fcToMd(bl)),ext:'md'}; case 'html': return {bytes:FCT.encode(fcHtmlDoc(bl,ti)),ext:'html'};
    case 'docx': return {bytes:await fcToDocx(bl),ext:'docx'}; case 'odt': return {bytes:await fcToOdt(bl),ext:'odt'}; case 'rtf': return {bytes:fcToRtf(bl),ext:'rtf'};
    case 'pdf': { if(!window.api||!window.api.htmlToPdf) throw new Error('pdf'); return {bytes:new Uint8Array(await window.api.htmlToPdf(fcHtmlDoc(bl,ti,true))),ext:'pdf'}; } }
  throw new Error('fmt'); }
// --- dane ---
async function fcDataRun(F,o,tg){
  const d=await fcData(F), e=F.ext; let T;
  if(e==='xlsx') T=await fcXlsxTable(d); else { const s=fcDecodeText(d,'auto');
    if(e==='json') T=fcJsonTable(JSON.parse(s)); else if(e==='ndjson'||e==='jsonl') T=fcJsonTable(s.split(/\r?\n/).filter(l=>l.trim()).map(l=>JSON.parse(l)));
    else if(e==='csv'||e==='tsv') T=fcCsvTable(s,e,o.sep); else if(e==='xml') T=fcXmlTable(s); else if(e==='yaml'||e==='yml') T=fcYamlTable(s); else if(e==='html'||e==='htm') T=fcHtmlTable(s); else if(e==='md') T=fcMdTable(s); else throw new Error('fmt'); }
  if(tg.id==='xlsx') return {bytes:await fcToXlsx(T,!!o.typ),ext:'xlsx'}; return {bytes:FCT.encode(fcDataOut(T,tg.id,o)),ext:tg.id}; }
// --- archiwa ---
async function fcArchRun(F,o,tg,P,files){
  let ent=[];
  if(files.length===1){ const f=files[0], d=await fcData(f), nm=f.name.toLowerCase();
    if(f.ext==='zip') ent=await fcUnzip(d); else if(f.ext==='tar') ent=fcUntar(d); else if(f.ext==='tgz'||nm.endsWith('.tar.gz')) ent=fcUntar(await fcGunzip(d));
    else if(f.ext==='gz'){ const raw=await fcGunzip(d); ent=[{name:f.name.replace(/\.gz$/i,''),data:raw}]; } else ent=[{name:f.name,data:d}]; }
  else for(const f of files) ent.push({name:f.name,data:await fcData(f)});
  if(!ent.length) throw new Error('empty'); const base=files.length===1?fcBase(files[0].name).replace(/\.tar$/i,''):'archiwum';
  if(tg.id==='zip') return {bytes:await fcZip(ent),ext:'zip',name:base+'.zip'}; if(tg.id==='tar') return {bytes:fcTar(ent),ext:'tar',name:base+'.tar'};
  if(tg.id==='tgz') return {bytes:await fcGz(fcTar(ent)),ext:'tar.gz',name:base+'.tar.gz'};
  if(ent.length!==1) throw new Error('gz'); return {bytes:await fcGz(ent[0].data),ext:'gz',name:ent[0].name+'.gz'}; }
// --- kodowanie ---
async function fcEncRun(F,o,tg){
  const d=await fcData(F), b=fcBase(F.name), hex=a=>[...a].map(x=>x.toString(16).padStart(2,'0')).join('');
  if(tg.id==='b64') return {bytes:FCT.encode(fcB64(d)+'\n'),ext:'txt',name:F.name+'.base64.txt'}; if(tg.id==='hex') return {bytes:FCT.encode(hex(d)+'\n'),ext:'txt',name:F.name+'.hex.txt'};
  if(tg.id==='datauri') return {bytes:FCT.encode('data:'+(FC_MIME[F.ext]||'application/octet-stream')+';base64,'+fcB64(d)+'\n'),ext:'txt',name:F.name+'.datauri.txt'};
  if(tg.id==='unb64'){ const s=new TextDecoder().decode(d).trim().replace(/^data:[^,]*,/,''); return {bytes:fcUnB64(s),ext:'bin',name:b.replace(/\.(base64|b64|hex)$/i,'')+'.bin'}; }
  if(tg.id==='unhex'){ const s=new TextDecoder().decode(d).replace(/[^0-9a-fA-F]/g,''); if(s.length%2) throw new Error('hex'); return {bytes:Uint8Array.from(s.match(/../g)||[],x=>parseInt(x,16)),ext:'bin',name:b.replace(/\.(base64|b64|hex)$/i,'')+'.bin'}; }
  let s=fcDecodeText(d,o.senc); if(o.eol==='lf') s=s.replace(/\r\n?/g,'\n'); else if(o.eol==='crlf') s=s.replace(/\r\n?|\n/g,'\r\n'); return {bytes:fcEncodeText(s,tg.id),ext:'txt',name:b+'.'+(F.ext||'txt')}; }
const FC_OPT={
  q:{l:'Jakość',t:'range',min:10,max:100,def:90}, maxSide:{l:'Maks. rozmiar (px)',t:'num',def:''}, bg:{l:'Tło',t:'color',def:'#ffffff'},
  sr:{l:'Częstotliwość',t:'sel',def:'',c:[['','Jak w oryginale'],['48000','48000 Hz'],['44100','44100 Hz'],['32000','32000 Hz'],['22050','22050 Hz'],['16000','16000 Hz'],['8000','8000 Hz']]},
  ch:{l:'Kanały',t:'sel',def:'keep',c:[['keep','Jak w oryginale'],['mono','Mono'],['stereo','Stereo']]},
  fps:{l:'Klatki/s',t:'range',min:1,max:25,def:10}, gw:{l:'Szerokość (px)',t:'num',def:480}, ft:{l:'Czas klatki (s)',t:'num',def:0},
  sep:{l:'Separator',t:'sel',def:'auto',c:[['auto','Automatycznie'],[',',','],[';',';'],['\t','Tab'],['|','|']]}, typ:{l:'Wykrywaj liczby i wartości logiczne',t:'check',def:true},
  eol:{l:'Końce wierszy',t:'sel',def:'keep',c:[['keep','Jak w oryginale'],['lf','LF'],['crlf','CRLF']]},
  senc:{l:'Kodowanie źródła',t:'sel',def:'auto',c:[['auto','Automatycznie'],['utf-8','UTF-8'],['utf-16le','UTF-16 LE'],['utf-16be','UTF-16 BE'],['windows-1250','Windows-1250'],['iso-8859-2','ISO-8859-2'],['windows-1252','Windows-1252'],['iso-8859-15','ISO-8859-15'],['windows-1251','Windows-1251'],['koi8-r','KOI8-R'],['shift_jis','Shift_JIS'],['gbk','GBK'],['big5','Big5'],['euc-kr','EUC-KR']]}};
const fcT=(id,n,o,x)=>Object.assign({id,n:n||id.toUpperCase(),o:o||[]},x||{});
const FC_CATS=[
 {id:'img',ic:'🖼️',n:'Obrazy',ff:1,in:['png','jpg','jpeg','webp','gif','bmp','ico','svg','avif'],ffin:['tif','tiff','tga','jp2','psd','heic','heif','jxl','pcx','dds','exr','hdr','ppm','pgm','pbm','xbm','xpm'],run:fcImgRun,
   tg:[fcT('png','PNG',['maxSide']),fcT('jpg','JPG',['q','maxSide','bg']),fcT('webp','WEBP',['q','maxSide']),fcT('gif','GIF',['maxSide']),fcT('bmp','BMP',['maxSide','bg']),fcT('ico','ICO'),fcT('tiff','TIFF',['maxSide']),fcT('pdf','PDF',['q','maxSide','bg']),fcT('svg','SVG',['maxSide']),fcT('ppm','PPM',['maxSide','bg']),
     fcT('avif','AVIF',[],{ff:1}),fcT('tga','TGA',[],{ff:1}),fcT('jp2','JP2',[],{ff:1}),fcT('pcx','PCX',[],{ff:1})]},
 {id:'audio',ic:'🎵',n:'Audio',ff:1,in:['mp3','wav','ogg','oga','flac','m4a','aac','opus','webm','weba','aiff','aif'],ffin:['wma','amr','ac3','mka','au','caf','mp2','wv','ape','dts','3gp','ra','mid'],run:fcAudioRun,
   tg:[fcT('wav','WAV 16',['sr','ch']),fcT('wav24','WAV 24',['sr','ch']),fcT('wav32','WAV 32f',['sr','ch']),fcT('aiff','AIFF',['sr','ch']),fcT('flac','FLAC',['sr','ch']),fcT('weba','WEBM',['sr','ch']),
     ...['mp3','m4a','aac','ogg','opus','wma','ac3','mp2','au'].map(e=>fcT(e,e.toUpperCase(),['sr','ch'],{ff:1}))]},
 {id:'video',ic:'🎬',n:'Wideo',ff:1,note:1,in:['mp4','webm','mkv','mov','ogv','m4v'],ffin:['avi','wmv','flv','3gp','ts','mpg','mpeg','vob','m2ts','mts','rm','asf','f4v','divx'],run:fcVideoRun,
   tg:[fcT('webm','WEBM'),fcT('mp4','MP4',[],{ff:1,alt:1}),fcT('gif','GIF',['fps','gw']),fcT('png','PNG ▣',['ft']),fcT('jpg','JPG ▣',['ft','q']),fcT('wav','WAV ♪',['sr','ch']),fcT('flac','FLAC ♪',['sr','ch']),fcT('weba','WEBM ♪',['sr','ch']),
     ...['mkv','avi','mov','flv','wmv','ogv','ts','m4v','mpg'].map(e=>fcT(e,e.toUpperCase(),[],{ff:1})),...['mp3','m4a','aac','ogg','opus'].map(e=>fcT(e,e.toUpperCase()+' ♪',[],{ff:1,ext:e}))]},
 {id:'doc',ic:'📄',n:'Dokumenty',in:['txt','md','markdown','html','htm','docx','odt','rtf'],run:fcDocRun,tg:['txt','md','html','docx','odt','rtf','pdf'].map(e=>fcT(e,e.toUpperCase()))},
 {id:'data',ic:'📊',n:'Dane',in:['json','csv','tsv','ndjson','jsonl','xml','yaml','yml','html','htm','md','xlsx'],run:fcDataRun,tg:[fcT('json','JSON',['typ']),fcT('csv','CSV',['sep','typ']),fcT('tsv','TSV'),fcT('ndjson','NDJSON',['typ']),fcT('xml','XML'),fcT('yaml','YAML',['typ']),fcT('html','HTML'),fcT('md','MD'),fcT('sql','SQL',['typ']),fcT('xlsx','XLSX',['typ'])]},
 {id:'arch',ic:'🗜️',n:'Archiwa',any:1,multi:1,in:['zip','tar','gz','tgz'],run:fcArchRun,tg:[fcT('zip','ZIP'),fcT('tar','TAR'),fcT('tgz','TAR.GZ'),fcT('gz','GZ')]},
 {id:'enc',ic:'🔤',n:'Kodowanie',any:1,in:[],run:fcEncRun,tg:[fcT('b64','Base64'),fcT('hex','Hex'),fcT('datauri','Data URI'),fcT('unb64','Base64 → bin'),fcT('unhex','Hex → bin'),
   ...[['utf8','UTF-8'],['utf8bom','UTF-8 BOM'],['utf16le','UTF-16 LE'],['utf16be','UTF-16 BE'],['cp1250','Windows-1250'],['iso2','ISO-8859-2'],['cp1252','Windows-1252'],['iso15','ISO-8859-15'],['cp1251','Windows-1251'],['koi8r','KOI8-R'],['ascii','ASCII']].map(([i,n])=>fcT(i,n,['senc','eol']))]}];
let FC_FF=null; const FC_PROG={};
function mountFc(el,w){
  const D=(S.aw.data.fc=S.aw.data.fc||{cat:'img',t:{},o:{}}); if(!FC_CATS.find(c=>c.id===D.cat)) D.cat='img'; D.o=D.o||{}; D.t=D.t||{};
  el.innerHTML=`<div class="cvw"><div class="cv fc" tabindex="0"><div class="cv-top"><button class="cv-mn" title="Kategorie">☰</button><b class="cv-cn"></b></div>
    <div class="fc-drop" tabindex="0"><div class="fc-dz"><i>📥</i><span>Upuść plik tutaj lub kliknij, aby wybrać</span></div><div class="fc-fi"><i class="fc-ic"></i><div><b class="fc-fn"></b><small class="fc-fm"></small></div><button class="fc-x" title="Wyczyść">✕</button></div><input type="file" class="fc-in" multiple></div>
    <div class="fc-ffs"></div><div class="fc-h">Konwertuj na:</div><div class="fc-tg"></div><div class="fc-op"></div>
    <div class="fc-nt"></div><button class="fc-go">Konwertuj</button><div class="fc-pb"><i></i></div><div class="fc-st"></div>
    <div class="fc-out"><div class="fc-h">Gotowy plik</div><div class="fc-pv"></div><div class="fc-on"><b class="fc-on1"></b><small class="fc-on2"></small></div><button class="fc-sv">Zapisz plik…</button></div></div>
    <div class="cv-bk"></div><div class="cv-dr"><div class="cv-dh">Kategorie</div><div class="cv-di"></div></div></div>`;
  const wrap=el.firstElementChild, root=wrap.querySelector('.fc'), q=s=>root.querySelector(s), cname=wrap.querySelector('.cv-cn'), cats=wrap.querySelector('.cv-di'), drop=q('.fc-drop'), fin=q('.fc-in'), tgEl=q('.fc-tg'), opEl=q('.fc-op'), st=q('.fc-st'), pb=q('.fc-pb i'), outEl=q('.fc-out'), ffs=q('.fc-ffs'), nt=q('.fc-nt');
  let files=[], res=null, busy=false, myId='fc'+Math.random().toString(36).slice(2);
  const cat=()=>FC_CATS.find(c=>c.id===D.cat), tgt=()=>{ const c=cat(); return c.tg.find(x=>x.id===D.t[c.id])||c.tg[0]; }, ffOK=()=>!!(FC_FF&&FC_FF.ok);
  const say=m=>{ st.textContent=m; }, bar=p=>{ pb.style.width=Math.round(Math.max(0,Math.min(1,p))*100)+'%'; pb.parentElement.classList.toggle('on',p>0&&p<1); };
  const optVal=k=>D.o[k]!==undefined?D.o[k]:FC_OPT[k].def, opts=()=>Object.fromEntries(Object.keys(FC_OPT).map(k=>[k,optVal(k)]));
  function drawCats(){ cats.innerHTML=FC_CATS.map(c=>`<button data-c="${c.id}" class="${c.id===D.cat?'on':''}"><i>${c.ic}</i><span>${t(c.n)}</span></button>`).join(''); cname.textContent=cat().ic+' '+t(cat().n); }
  function drawTg(){ const c=cat(), sel=tgt().id; tgEl.innerHTML=c.tg.map(x=>{ const lock=x.ff&&!ffOK()&&!(x.alt&&window.MediaRecorder&&MediaRecorder.isTypeSupported('video/mp4')); return `<button data-t="${x.id}" class="${x.id===sel?'on':''}${lock?' lock':''}"${lock?' title="Ten format wymaga programu ffmpeg."':''}>${esc(x.n)}${lock?' 🔒':''}</button>`; }).join(''); drawOp(); }
  function drawOp(){ const tg=tgt(); opEl.innerHTML=tg.o.map(k=>{ const d=FC_OPT[k], v=optVal(k);
    if(d.t==='range') return `<label class="fc-o"><span>${t(d.l)}<b>${v}${k==='q'?'%':''}</b></span><input type="range" data-o="${k}" min="${d.min}" max="${d.max}" value="${v}"></label>`;
    if(d.t==='color') return `<label class="fc-o"><span>${t(d.l)}</span><input type="color" data-o="${k}" value="${v}"></label>`;
    if(d.t==='check') return `<label class="ck"><input type="checkbox" data-o="${k}"${v?' checked':''}><span class="tg"></span>${t(d.l)}</label>`;
    if(d.t==='sel') return `<label class="fc-o"><span>${t(d.l)}</span><select data-o="${k}">${d.c.map(([a,b])=>`<option value="${esc(a)}"${a===v?' selected':''}>${t(b)}</option>`).join('')}</select></label>`;
    return `<label class="fc-o"><span>${t(d.l)}</span><input type="number" data-o="${k}" value="${esc(v)}" min="0" placeholder="—"></label>`; }).join('');
    const c=cat(); nt.textContent=c.note?t('Konwersja wideo w przeglądarce trwa tyle, ile samo wideo.'):''; ffs.textContent=c.ff?t(ffOK()?'Wykryto ffmpeg: dostępne są dodatkowe formaty.':'Zainstaluj ffmpeg, aby odblokować więcej formatów (MP3, MP4, MKV…).'):''; ffs.classList.toggle('ok',ffOK()); }
  function drawFile(){ drop.classList.toggle('has',files.length>0); if(!files.length) return; const f=files[0], c=cat();
    q('.fc-ic').textContent=c.ic; q('.fc-fn').textContent=files.length>1?t('Wybrane plików: {n}').replace('{n}',files.length):f.name;
    q('.fc-fm').textContent=fcSize(files.reduce((a,x)=>a+x.size,0))+' · '+t('Wykryty format: {f}').replace('{f}',(f.ext||'?').toUpperCase()); }
  function showRes(){ outEl.classList.toggle('on',!!res); if(!res) return; q('.fc-on1').textContent=res.name; q('.fc-on2').textContent=fcSize(res.size); const pv=q('.fc-pv'); pv.innerHTML='';
    const ext=res.ext.split('.').pop(), url=res.url; if(!url) return; const mk=(tag,at)=>{ const e=document.createElement(tag); Object.assign(e,at); pv.appendChild(e); };
    if(/^(png|jpe?g|webp|gif|bmp|svg|ico)$/.test(ext)) mk('img',{src:url}); else if(/^(wav|webm|mp3|ogg|flac|m4a|aac|opus)$/.test(ext)&&!(res.video)) mk('audio',{src:url,controls:true}); else if(/^(webm|mp4|ogv|mkv|mov)$/.test(ext)) mk('video',{src:url,controls:true}); }
  function reset(){ res=null; showRes(); bar(0); say(''); }
  async function setFiles(list){
    list=[...list]; if(!list.length) return; const c0=cat(); const F=list.map(f=>({name:f.name,ext:(f.name.includes('.')?f.name.split('.').pop():'').toLowerCase(),size:f.size,file:f,path:(window.api&&window.api.filePath)?window.api.filePath(f):''})); const ext=F[0].ext;
    const accepts=c=>c.any||c.in.includes(ext)||(ffOK()&&c.ffin&&c.ffin.includes(ext));
    const prim={md:'doc',markdown:'doc',html:'doc',htm:'doc'}[ext]; if(prim&&!c0.any&&c0.id!==prim){ D.cat=prim; saveSoon(); }   // md/html domyślnie jako dokumenty (jako tabele — po ręcznym wyborze kategorii Dane)
    if(!accepts(cat())){ const o=FC_CATS.find(c=>!c.any&&accepts(c)); if(!o){ say(t('Ten format wejściowy nie jest obsługiwany.')); return; } D.cat=o.id; saveSoon(); }
    files=cat().multi?F:[F[0]]; reset(); drawCats(); drawTg(); drawFile(); }
  function clearFiles(){ files=[]; drop.classList.remove('has'); fin.value=''; reset(); }
  async function go(){
    if(busy) return; if(!files.length){ say(t('Wybierz plik do konwersji.')); return; } const c=cat(), tg=tgt(), F=files[0]; busy=true; res=null; showRes(); bar(.001); say(t('Konwertowanie…')); q('.fc-go').disabled=true;
    try{ const native=c.any||c.in.includes(F.ext), alt=tg.alt&&window.MediaRecorder&&MediaRecorder.isTypeSupported('video/mp4'), canFF=ffOK()&&c.ff&&F.path; let r;
      const ff=async(key,ext,read)=>{ const id=myId; FC_PROG[id]=bar; try{ const x=await window.api.ffRun({id,inPath:F.path,key,ext,read,opts:opts()}); if(!x||!x.ok) throw new Error((x&&x.err)||'ff'); return x; } finally{ delete FC_PROG[id]; } };
      if(tg.ff){ if(canFF){ const x=await ff(tg.id,tg.ext||tg.id); r={tmp:x.tmp,size:x.size,ext:tg.ext||tg.id}; } else if(alt&&native) r=await c.run(F,opts(),tg,bar,files); else throw Object.assign(new Error('ffmpeg'),{ff:1}); }
      else if(native) r=await c.run(F,opts(),tg,bar,files);
      else if(!canFF) throw Object.assign(new Error('ffmpeg'),{ff:1});
      else if(c.id==='img'||c.id==='audio'){ const k=c.id==='img'?'png':'wav', x=await ff(k,k,true); r=await c.run({name:F.name,ext:k,size:x.size,data:new Uint8Array(x.data)},opts(),tg,bar,files); }
      else { const ext=tg.id==='weba'?'webm':tg.id, x=await ff(tg.id,ext); r={tmp:x.tmp,size:x.size,ext}; }
      const name=r.name||fcBase(F.name)+'.'+r.ext; if(r.bytes){ const blob=new Blob([r.bytes],{type:FC_MIME[r.ext]||'application/octet-stream'}); res={name,ext:r.ext,size:r.bytes.length,bytes:r.bytes,url:URL.createObjectURL(blob)}; }
      else res={name,ext:r.ext,size:r.size,tmp:r.tmp,url:'file:///'+String(r.tmp).replace(/\\/g,'/')};
      res.video=c.id==='video'&&!/^(wav|flac|weba|mp3|m4a|aac|ogg|opus)$/.test(tg.id);
      bar(1); say(t('Gotowe.')); showRes(); }
    catch(e){ bar(0); say(e.ff?t('Ten format wymaga programu ffmpeg.'):t('Nie udało się przekonwertować pliku.')+(e&&e.message&&!/^(fmt|enc|rec)$/.test(e.message)?' ('+String(e.message).slice(0,90)+')':'')); }
    busy=false; q('.fc-go').disabled=false; }
  async function save(){ if(!res) return; try{ const p=await window.api.saveOut(res.tmp?{name:res.name,tmp:res.tmp}:{name:res.name,data:res.bytes}); if(p) toast(t('Zapisano:')+' '+String(p).split(/[\\/]/).pop()); }catch{ toast(t('Nie udało się przekonwertować pliku.')); } }
  // zdarzenia
  drop.addEventListener('click',e=>{ if(e.target===fin) return; if(e.target.closest('.fc-x')){ clearFiles(); return; } fin.click(); });
  fin.addEventListener('change',()=>{ if(fin.files.length) setFiles(fin.files); fin.value=''; });
  ['dragenter','dragover'].forEach(ev=>root.addEventListener(ev,e=>{ e.preventDefault(); e.stopPropagation(); drop.classList.add('over'); }));
  ['dragleave','drop'].forEach(ev=>root.addEventListener(ev,e=>{ e.preventDefault(); e.stopPropagation(); if(ev==='dragleave'&&root.contains(e.relatedTarget)) return; drop.classList.remove('over'); if(ev==='drop'&&e.dataTransfer&&e.dataTransfer.files.length) setFiles(e.dataTransfer.files); }));
  tgEl.addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return; D.t[D.cat]=b.dataset.t; saveSoon(); reset(); drawTg(); });
  opEl.addEventListener('input',e=>{ const i=e.target, k=i.dataset.o; if(!k) return; D.o[k]=i.type==='checkbox'?i.checked:i.value; saveSoon(); if(i.type==='range'){ const b=i.closest('label').querySelector('b'); if(b) b.textContent=i.value+(k==='q'?'%':''); } });
  q('.fc-go').onclick=go; q('.fc-sv').onclick=save;
  wrap.addEventListener('click',e=>{
    if(e.target.closest('.cv-mn')){ wrap.classList.toggle('dopen'); return; } if(e.target.closest('.cv-bk')){ wrap.classList.remove('dopen'); return; }
    const b=e.target.closest('.cv-di button'); if(b){ D.cat=b.dataset.c; saveSoon(); wrap.classList.remove('dopen'); if(files.length&&!(cat().any||cat().in.includes(files[0].ext)||(ffOK()&&cat().ffin&&cat().ffin.includes(files[0].ext)))) clearFiles(); else if(!cat().multi) files=files.slice(0,1); reset(); drawCats(); drawTg(); if(files.length) drawFile(); } });
  if(window.api&&window.api.onFfProgress&&!window.__fcProg){ window.__fcProg=1; window.api.onFfProgress(m=>{ const f=FC_PROG[m.id]; if(f) f(m.p); }); }
  drawCats(); drawTg();
  if(FC_FF===null&&window.api&&window.api.ffProbe) window.api.ffProbe().then(r=>{ FC_FF=r||{ok:false}; if(el.isConnected){ drawTg(); } }).catch(()=>{ FC_FF={ok:false}; }); else if(FC_FF===null) FC_FF={ok:false};
}


// ===== src/js/21-dnd.js =====
// ---------- przeciąganie kart i folderów: zmiana kolejności / oderwanie do nowego okna ----------
function flipRun(cfg,fn){
  const c=cfg.container(), old=new Map([...c.querySelectorAll(cfg.sel)].map(x=>[x.dataset.id,x.getBoundingClientRect()]));
  fn();
  c.querySelectorAll(cfg.sel).forEach(x=>{ const o=old.get(x.dataset.id); if(!o||x.dataset.id===cfg.id) return;
    const n=x.getBoundingClientRect(), d=cfg.axis==='x'?o.left-n.left:o.top-n.top; if(!d) return;
    x.style.transition='none'; x.style.transform=cfg.axis==='x'?`translateX(${d}px)`:`translateY(${d}px)`; void x.offsetWidth;
    x.style.transition='transform .22s cubic-bezier(.2,.8,.3,1)'; x.style.transform=''; setTimeout(()=>{ x.style.transition=''; },260); });
}
function startItemDrag(e,cfg){
  if(e.button!==0) return;
  const el0=cfg.item(); if(!el0) return;
  const r0=el0.getBoundingClientRect(), sx=e.clientX, sy=e.clientY, orig=cfg.order();
  let w=Math.max(r0.width,cfg.minW||120), h=r0.height, offX=Math.min(sx-r0.left,w-8), offY=sy-r0.top;
  let started=false, ghost=null, mode='bar', snapUntil=0, over=false, lastEv=null;
  // element przeskoczył do innego paska (np. karta -> przypięte): duch przyjmuje rozmiar i wygląd elementu w nowym miejscu
  const swapGhost=()=>{ const it=cfg.item(); if(!it||!ghost) return; const r=it.getBoundingClientRect(), fx=offX/w;
    w=Math.max(r.width,cfg.minW||40); h=r.height; offX=Math.min(Math.max(8,fx*w),w-8); offY=h/2;
    const ng=it.cloneNode(true); ng.classList.remove('on','ent','rise','sdn','out','drg','gone'); ng.classList.add('gh'); ng.style.width=w+'px'; ng.style.height=h+'px';
    ng.style.left=ghost.style.left; ng.style.top=ghost.style.top; ghost.replaceWith(ng); ghost=ng; };
  const setGone=v=>{ dragGone=v; const it=cfg.item(); if(it) it.classList.toggle('gone',v); };
  const pos=ev=>{
    lastEv=ev;
    if(cfg.retarget&&cfg.retarget(ev)){ if(over&&cfg.xend){ over=false; cfg.xend(); } swapGhost(); mode='bar'; setGone(false); ghost.style.visibility=''; snapUntil=performance.now()+180; }
    const z=cfg.zone().getBoundingClientRect(), rg=cfg.range().getBoundingClientRect();
    const dist=Math.max(z.left-ev.clientX,0,ev.clientX-z.right,z.top-ev.clientY,ev.clientY-z.bottom);
    if(mode==='bar'&&dist>44&&cfg.canDetach()){ mode='free'; setGone(true); snapUntil=performance.now()+180; }
    else if(mode==='free'&&dist<16){ mode='bar'; setGone(false); snapUntil=performance.now()+180; }
    let gx,gy;
    if(mode==='free'){ gx=ev.clientX-offX; gy=ev.clientY-offY; }
    else if(cfg.axis==='x'){ gx=clamp(ev.clientX-offX,rg.left,Math.max(rg.left,rg.right-w)); gy=z.top-5; }   // zablokowana w pionie, lekko uniesiona
    else { gx=rg.left+6; gy=clamp(ev.clientY-offY,rg.top,Math.max(rg.top,rg.bottom-h)); }
    ghost.style.transition=performance.now()<snapUntil?'left .16s,top .16s':'none'; ghost.style.left=gx+'px'; ghost.style.top=gy+'px';
    if(cfg.xmove){ if(mode==='free') cfg.xmove(ev).then(o=>{ over=!!o; if(ghost) ghost.style.visibility=o?'hidden':''; }); else if(over){ over=false; cfg.xend(); ghost.style.visibility=''; } }
    if(mode==='bar'){
      const all=[...cfg.container().querySelectorAll(cfg.sel)], others=all.filter(x=>x.dataset.id!==cfg.id), center=cfg.axis==='x'?gx+w/2:gy+h/2;
      let idx=0; others.forEach(x=>{ const r=x.getBoundingClientRect(); if((cfg.axis==='x'?r.left+r.width/2:r.top+r.height/2)<center) idx++; });
      if(idx!==all.findIndex(x=>x.dataset.id===cfg.id)) flipRun(cfg,()=>cfg.move(cfg.id,idx));
    }
  };
  cfg.poke=()=>{ if(started&&lastEv) pos(lastEv); };
  const mv=ev=>{
    if(!started){ if(Math.hypot(ev.clientX-sx,ev.clientY-sy)<5) return; started=true;
      ghost=el0.cloneNode(true); ghost.classList.remove('on','ent','rise','sdn','out','drg','gone'); ghost.classList.add('gh'); ghost.style.width=w+'px'; ghost.style.height=h+'px';
      document.body.appendChild(ghost); dragId=cfg.id; el0.classList.add('drg'); document.body.classList.add('dragging','dg'); if(cfg.start) cfg.start(); }
    pos(ev); };
  const finish=()=>{ removeEventListener('mousemove',mv); removeEventListener('mouseup',up); document.removeEventListener('keydown',kd,true);
    if(started){ dragId=null; dragGone=false; document.body.classList.remove('dragging','dg'); cfg.rerender(); dragSwallow=true; setTimeout(()=>{ dragSwallow=false; },150); save(); } };
  const up=ev=>{
    if(!started) return finish();
    if(mode==='free'&&cfg.canDetach()){ ghost.remove(); finish(); (cfg.drop?cfg.drop(ev):Promise.resolve(false)).then(ok=>{ if(!ok) cfg.detach(ev); }); return; }
    const it=cfg.item(), rr=it.getBoundingClientRect(), g=ghost; g.style.transition='left .16s,top .16s'; g.style.left=rr.left+'px'; g.style.top=rr.top+'px'; setTimeout(()=>g.remove(),170); finish(); };
  const kd=ev=>{ if(ev.key==='Escape'&&started){ ev.stopPropagation(); mode='bar'; if(cfg.xend) cfg.xend(); if(cfg.cancel) cfg.cancel(); else cfg.setOrder(orig); ghost.remove(); finish(); } };
  addEventListener('mousemove',mv); addEventListener('mouseup',up); document.addEventListener('keydown',kd,true);
}
// strefa, nad którą przeciągana karta „wskakuje” do przypiętych: pasek u góry (także schowany, gdy nie ma przypiętych) albo lewy pasek
function pinZone(){
  if(pinLeft()){ const s=$('side').getBoundingClientRect(), fl=$('fl').getBoundingClientRect(); return {left:s.left,right:Math.max(s.right,s.left+60),top:fl.top,bottom:s.bottom,empty:!$('lpins').children.length}; }
  const p=$('pins').getBoundingClientRect();
  if(p.height>=6) return {left:p.left,right:p.right,top:p.top,bottom:p.bottom+4,empty:false};
  const tr=$('tabrow').getBoundingClientRect(); return {left:tr.left,right:tr.right,top:tr.bottom,bottom:tr.bottom+30,empty:true};
}
const sidePin=()=>$('sidewrap').classList.toggle('pin',!!editing||!!pk||menuOpen||(dragId!==null&&pinLeft()&&!!F().tabs.find(t=>t.id===dragId&&t.pinned)));
function tabDrag(e,id,pinned0){
  let pinned=pinned0, dwell=0, dwT=0;
  const snap=F().tabs.slice(), tab=()=>F().tabs.find(t=>t.id===id);
  const cont=()=>pinned?pinBox():$('tabs'), grp=()=>F().tabs.filter(t=>!!t.pinned===pinned);
  const setGroup=ids=>{ const f=F(), m=new Map(f.tabs.map(t=>[t.id,t])), slots=f.tabs.map((t,i)=>!!t.pinned===pinned?i:-1).filter(i=>i>=0); slots.forEach((sl,k)=>{ f.tabs[sl]=m.get(ids[k]); }); };
  const inR=(ev,r,m=0)=>ev.clientX>=r.left-m&&ev.clientX<=r.right+m&&ev.clientY>=r.top-m&&ev.clientY<=r.bottom+m;
  let cfg;
  const setPinned=v=>{ const t=tab(); if(!t) return; t.pinned=v; pinned=v; dragGone=false; cfg.sel=v?'.pt:not(.out):not(.gp)':'.tab:not(.out)'; cfg.axis=v&&pinLeft()?'y':'x'; cfg.minW=v?40:120; renderTabs(); sidePin(); };
  cfg={id,axis:pinned&&pinLeft()?'y':'x',minW:pinned?40:120,sel:pinned?'.pt:not(.out):not(.gp)':'.tab:not(.out)',container:cont,zone:()=>pinned?(pinLeft()?$('side'):$('pins')):$('tabrow'),range:cont,
    item:()=>cont().querySelector(`[data-id="${id}"]`),order:()=>grp().map(t=>t.id),setOrder:setGroup,
    move:(tid,idx)=>{ const ids=grp().map(t=>t.id).filter(x=>x!==tid); ids.splice(idx,0,tid); setGroup(ids); renderTabs(); },
    // karta nad paskiem przypiętych wskakuje na niego (i odwrotnie: przypięta nad paskiem kart wraca między karty)
    retarget:ev=>{
      const pz=pinZone(), tr=$('tabrow').getBoundingClientRect(); let want=pinned;
      if(!pinned&&inR(ev,pz)){
        if(pz.empty){ const now=performance.now(); if(!dwell) dwell=now; if(now-dwell<170){ clearTimeout(dwT); dwT=setTimeout(()=>cfg.poke&&cfg.poke(),180); return false; } }   // schowany pasek wysuwa się po chwili, nie przy każdym przejściu kursora
        want=true;
      } else if(pinned&&inR(ev,tr)) want=false;
      else if(pinned!==pinned0&&!inR(ev,pinned?pz:tr,24)) want=pinned0;   // wyjechanie poza pasek: karta wraca tam, skąd była
      if(!inR(ev,pz)) dwell=0;
      if(want===pinned) return false;
      setPinned(want); return true;
    },
    cancel:()=>{ const f=F(); f.tabs.splice(0,f.tabs.length,...snap); const t=tab(); if(t) t.pinned=pinned0; pinned=pinned0; renderTabs(); },
    start:sidePin,rerender:()=>{ clearTimeout(dwT); renderTabs(); sidePin(); },canDetach:()=>true,detach:ev=>detachTab(id,ev),
    xmove:ev=>{ try{ return window.api.xdMove({sx:ev.screenX,sy:ev.screenY,zone:dropZone(),tab:tabPayload(id)}).catch(()=>false); }catch{ return Promise.resolve(false); } },
    xend:()=>{ try{ window.api.xdEnd(); }catch{} },
    drop:async ev=>{ try{ const ok=await window.api.xdDrop({sx:ev.screenX,sy:ev.screenY,zone:dropZone(),tab:tabPayload(id)}); if(ok) closeAfterMove(id); return !!ok; }catch{ return false; } }};
  startItemDrag(e,cfg);
}
const dropZone=()=>Math.round(Math.max($('tabrow').getBoundingClientRect().bottom,$('pins').getBoundingClientRect().bottom));   // dół paska kart (i przypiętych) względem okna
const tabPayload=id=>{ const t=F().tabs.find(x=>x.id===id); return t?{url:t.url,title:t.title,icon:t.icon,muted:t.muted}:null; };
function closeAfterMove(id){   // karta trafiła do innego okna: usuń ją tutaj, a jeśli była jedyna – zamknij to okno
  const f=F(), only=S.folders.length===1&&f.tabs.length===1; rmTab(f,id,true);
  if(only) setTimeout(()=>{ try{ window.api.winCtl('close'); }catch{} },80);
}
function xdHandle(m){    // komunikaty o karcie przeciąganej z innego okna nad to okno
  if(m.kind==='end'){ if(xd){ xd=null; renderTabs(); } return; }
  if(!m.tab||dragId!==null) return;
  if(m.kind==='over'){
    let idx=0; $('tabs').querySelectorAll('.tab:not(.xd)').forEach(x=>{ const r=x.getBoundingClientRect(); if(r.left+r.width/2<m.cx) idx++; });
    if(!xd||xd.idx!==idx||xd.tab.url!==m.tab.url) flipRun({id:'__xd',axis:'x',sel:'.tab',container:()=>$('tabs')},()=>{ xd={tab:m.tab,idx}; renderTabs(); });
  } else if(m.kind==='drop'){
    const f=F(), un=f.tabs.filter(t=>!t.pinned), idx=xd?xd.idx:un.length; xd=null;
    const nt={id:uid(),url:m.tab.url,title:m.tab.title,icon:m.tab.icon,muted:m.tab.muted}, before=un[idx];
    f.tabs.splice(before?f.tabs.indexOf(before):f.tabs.length,0,nt); entering.add(nt.id); activate(nt.id);
  }
}
function folderDrag(e,id){
  const setF=ids=>{ const m=new Map(S.folders.map(f=>[f.id,f])); S.folders=ids.map(i=>m.get(i)); };
  startItemDrag(e,{id,axis:'y',sel:'.fd[data-id]:not(.out)',container:()=>$('fl'),zone:()=>$('side'),range:()=>$('fl'),
    item:()=>$('fl').querySelector(`.fd[data-id="${id}"]`),order:()=>S.folders.map(f=>f.id),setOrder:setF,
    move:(fid,idx)=>{ const ids=S.folders.map(f=>f.id).filter(x=>x!==fid); ids.splice(idx,0,fid); setF(ids); renderSide(); },
    rerender:renderSide,canDetach:()=>S.folders.length>1,detach:ev=>detachFolder(id,ev),start:()=>$('sidewrap').classList.add('pin')});
}
function openWindow(folder,ev,ox,oy){
  const st={folders:[folder],cur:folder.id,panel:false,pw:S.pw,closed:[],settings:JSON.parse(JSON.stringify(S.settings)),aw:{open:[],pos:{},links:[],data:{}}};
  st.settings.apps.on=false;    // aplikacje (notatki, historia) zostają w oknie głównym
  try{ window.api.detach({state:st,x:ev.screenX-ox,y:ev.screenY-oy}); return true; }catch{ toast(t('Brak obsługi – podmień main.js i preload.js na nowe.')); return false; }
}
function detachTab(id,ev){
  const f=F(), tb=f.tabs.find(x=>x.id===id); if(!tb) return;
  const nt={...tb}; delete nt.pinned;
  if(openWindow({id:uid(),name:f.name,icon:f.icon||'📁',tabs:[nt],active:nt.id},ev,110,66)) rmTab(f,id,true);
}
function detachFolder(id,ev){
  if(S.folders.length<2) return; const f=S.folders.find(x=>x.id===id); if(!f) return;
  if(!openWindow(JSON.parse(JSON.stringify(f)),ev,26,150)) return;
  S.folders=S.folders.filter(x=>x.id!==id); if(S.cur===id) switchFolder(S.folders[0].id); else { renderSide(); save(); }
}
$('tabs').addEventListener('mousedown',e=>{ const el=e.target.closest('.tab'); if(!el||e.target.dataset.x||el.classList.contains('out')) return; tabDrag(e,el.dataset.id,false); });
for(const el of [$('pinsi'),$('lpins')]) el.addEventListener('mousedown',e=>{ const p=e.target.closest('.pt'); if(p&&!p.classList.contains('out')&&!p.classList.contains('gp')) tabDrag(e,p.dataset.id,true); });   // strony przypięte wszędzie: bez przeciągania (menu pod prawym przyciskiem)
$('fl').addEventListener('mousedown',e=>{ const el=e.target.closest('.fd'); if(!el||!el.dataset.id||e.target.closest('.ems')||el.classList.contains('out')) return; folderDrag(e,el.dataset.id); });
document.addEventListener('click',e=>{ if(dragSwallow){ e.stopPropagation(); e.preventDefault(); } },true);

// ===== ZADANIE 2: ikona na pasku zadań rysowana w kolorach motywu =====

// ===== src/js/22-logo.js =====
// ---------- logo Arkana: ikona aplikacji + krąg arkaniczny (runy, heksagram) ----------
const ARC_RUNES=[[[[0,0],[0,1]],[[0,.6],[.7,1]],[[0,.3],[.7,.7]]],[[[-.6,0],[-.6,1],[.6,.55],[.6,0]]],[[[0,0],[0,1]],[[0,.8],[.7,.55],[0,.3]]],[[[0,0],[0,1]],[[0,1],[.7,.7]],[[0,.65],[.7,.35]]],
  [[[0,0],[0,1],[.7,.78],[0,.5],[.7,0]]],[[[.6,.9],[-.4,.5],[.6,.1]]],[[[-.6,0],[.6,1]],[[-.6,1],[.6,0]]],[[[0,0],[0,1],[.7,.75],[0,.5]]],[[[-.6,0],[-.6,1]],[[.6,0],[.6,1]],[[-.6,.65],[.6,.35]]],
  [[[0,0],[0,1]],[[-.6,.75],[.6,.3]]],[[[0,0],[0,1]]],[[[0,0],[0,1]],[[0,.35],[-.6,.7],[0,1]]],[[[-.1,0],[-.1,1],[.6,.8],[.6,.5],[-.1,.3]]],[[[0,0],[0,1]],[[-.7,1],[0,.55],[.7,1]]],
  [[[-.4,1],[.4,.65],[-.4,.35],[.4,0]]],[[[0,0],[0,1]],[[-.6,.65],[0,1],[.6,.65]]],[[[-.1,0],[-.1,1],[.6,.78],[-.1,.5],[.6,.22],[-.1,0]]],[[[-.6,0],[-.6,1],[0,.55],[.6,1],[.6,0]]],[[[0,0],[0,1],[.6,.75]]],[[[0,.1],[.6,.5],[0,.9],[-.6,.5],[0,.1]]]];
function arcGeom(c,R,n){   // wspólna geometria dla SVG (interfejs) i canvasu (ikona paska zadań i animacji startu)
  const pt=(a,r)=>[c+Math.sin(a)*r, c-Math.cos(a)*r], runes=[];
  for(let k=0;k<n;k++){ const a=k*2*Math.PI/n, tpl=ARC_RUNES[(k*7)%ARC_RUNES.length], r0=R*.79, r1=R*.915, uw=R*.05;
    for(const pl of tpl) runes.push(pl.map(([u,v])=>{ const r=r0+(r1-r0)*v; return [c+Math.sin(a)*r+Math.cos(a)*u*uw, c-Math.cos(a)*r+Math.sin(a)*u*uw]; })); }
  const hex=[0,60].map(o=>[0,1,2].map(k=>pt((o+k*120)*Math.PI/180,R*.64))), rays=[...Array(8)].map((_,k)=>{ const a=k*Math.PI/4, a0=pt(a,R*.17), a1=pt(a,k%2?R*.4:R*.53); return [a0,a1]; });
  const dm=[0,1,2,3].map(k=>{ const a=k*Math.PI/2, p=pt(a,R), d=R*.07, q=pt(a,R+d), w=pt(a,R-d), s=[Math.cos(a)*d,Math.sin(a)*d]; return [q,[p[0]+s[0],p[1]+s[1]],w,[p[0]-s[0],p[1]-s[1]]]; });
  return {runes,hex,rays,dm,R}; }
function arcSvg(full){
  const G=arcGeom(60,57,24), f=v=>v.toFixed(1), P2=a=>a.map(p=>f(p[0])+','+f(p[1])).join(' ');
  const ru=G.runes.map(pl=>'M'+P2(pl).replace(/ /g,'L').replace(/,/g,' ')).join(''), ry=G.rays.map(([a,b])=>`M${f(a[0])} ${f(a[1])}L${f(b[0])} ${f(b[1])}`).join('');
  return `<svg class="arc${full?'':' s'}" viewBox="0 0 120 120" aria-hidden="true"><circle class="a-bg" cx="60" cy="60" r="57"/>`
    +(full?`<g class="arot"><circle class="a-th" cx="60" cy="60" r="53.8"/><path class="a-ru" d="${ru}"/><circle class="a-th" cx="60" cy="60" r="43"/>${G.dm.map(d=>`<polygon class="a-dm" points="${P2(d)}"/>`).join('')}</g>`:`<circle class="a-th" cx="60" cy="60" r="43"/>`)
    +`<g class="arot2">${G.hex.map(h=>`<polygon class="a-hx" points="${P2(h)}"/>`).join('')}</g><circle class="a-in" cx="60" cy="60" r="33"/><path class="a-bu" d="${ry}"/></svg>`; }
function arcInit(){ const b=document.querySelector('#brand .st'); if(b) b.outerHTML=arcSvg(false); const l=$('logo');
  if(l) l.innerHTML=INC?incSparkSvg()+'<div class="incw"><b>Arkana</b>'+incWordSvg()+'</div>':arcSvg(true)+'<b>Arkana</b><span>.</span>'; if(INC) incAlignInit(); arkRotKick(); }
// Obrót kręgów w logo na stronie startowej (zewnętrzny: obrót na 90 s, heksagram: na 140 s w przeciwną stronę). Wcześniej robiła to animacja CSS, przez którą
// całe SVG z poświatą było przerysowywane 60 razy na sekundę (ok. 40% jednego rdzenia procesora). Ruch jest tak wolny, że krok co 50 ms przesuwa runy
// o ok. 0,2 px – wygląd i płynność bez zmian, a pracy 3× mniej. Gdy działa pętla efektów tła (08-panel.js), obrót jest aktualizowany w jej klatkach (30 kl./s). Kąt liczy czas widoczności strony startowej, obrót stoi przy ukrytej stronie startowej,
// zminimalizowanym oknie i wyłączonych animacjach przycisków (body.na-btn – wtedy kręgi wracają do położenia wyjściowego, jak przy animation:none).
var ARK_ROT={t:0,last:0,iv:0};
function arkRotLive(){ return !document.hidden&&typeof home!=='undefined'&&home.style.display!=='none'&&!document.body.classList.contains('na-btn'); }
function arkRotTick(){ if(typeof ARK_ROT==='undefined'||!ARK_ROT) return; const R=ARK_ROT, now=performance.now(), l=$('logo'), a=l&&l.querySelector('.arot'), b=l&&l.querySelector('.arot2');
  if(R.iv&&typeof bgRaf!=='undefined'&&bgRaf){ clearInterval(R.iv); R.iv=0; }   // działa pętla tła: obrót aktualizowany w jej klatkach (bez dodatkowych klatek)
  if(!a||!arkRotLive()){ clearInterval(R.iv); R.iv=0; R.last=0; if(a&&document.body.classList.contains('na-btn')){ R.t=0; a.style.transform=''; if(b) b.style.transform=''; } return; }
  R.t+=R.last?Math.min(250,now-R.last):0; R.last=now;
  a.style.transform=`rotate(${(R.t/90000*360%360).toFixed(3)}deg)`; if(b) b.style.transform=`rotate(${(-R.t/140000*360%360).toFixed(3)}deg)`; }
function arkRotKick(){ if(typeof ARK_ROT==='undefined'||!ARK_ROT||ARK_ROT.iv||!arkRotLive()||(typeof bgRaf!=='undefined'&&bgRaf)) return; arkRotTick(); if(arkRotLive()&&$('logo')&&$('logo').querySelector('.arot')) ARK_ROT.iv=setInterval(arkRotTick,50); }
function drawIcon(){
  const c=document.createElement('canvas'); c.width=c.height=256; const g=c.getContext('2d');
  const bg=g.createLinearGradient(0,0,256,256); bg.addColorStop(0,P.panel2); bg.addColorStop(1,P.bg);
  g.fillStyle=bg; g.beginPath(); g.roundRect(8,8,240,240,58); g.fill(); g.lineWidth=5; g.strokeStyle=P.acc+'99'; g.stroke();
  g.translate(128,128); g.lineCap='round'; g.lineWidth=17; const gr=g.createLinearGradient(-80,-80,80,80); gr.addColorStop(0,P.acc); gr.addColorStop(1,P.acc2);
  g.strokeStyle=gr; g.shadowColor=P.acc; g.shadowBlur=22;
  for(let k=0;k<8;k++){ g.rotate(Math.PI/4); g.beginPath(); g.moveTo(0,-30); g.lineTo(0,k%2?-66:-88); g.stroke(); }
  return c.toDataURL('image/png');
}
// koło alchemiczne z animacji startu: rysowane jednorazowo na osobnym canvasie (z poświatą), potem tylko obracane i blendowane
function bootRing(R){
  const pad=Math.ceil(R*.18), n=Math.ceil(2*(R+pad)), c=document.createElement('canvas'); c.width=c.height=n; const g=c.getContext('2d'), m=n/2, G=arcGeom(m,R,24), lw=Math.max(1.3,R*.012);
  const path=(pts,close)=>{ g.beginPath(); pts.forEach((q,i)=>i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1])); if(close) g.closePath(); }, ring=(r,w,col)=>{ g.lineWidth=w; g.strokeStyle=col; g.beginPath(); g.arc(m,m,r,0,6.2832); g.stroke(); };
  g.lineCap='round'; g.lineJoin='round';
  const rg=g.createRadialGradient(m,m,R*.2,m,m,R*1.12); rg.addColorStop(0,`rgba(${accRgb},0)`); rg.addColorStop(.7,`rgba(${accRgb},.16)`); rg.addColorStop(1,`rgba(${accRgb},0)`); g.fillStyle=rg; g.fillRect(0,0,n,n);
  g.shadowColor=P.acc; g.shadowBlur=R*.07; ring(R,lw*1.6,P.acc2); ring(R*.943,lw*.8,P.acc); ring(R*.755,lw,P.acc);
  g.strokeStyle=P.acc2; g.lineWidth=lw*1.25; for(const pl of G.runes){ path(pl); g.stroke(); }
  g.fillStyle=P.acc2; for(const d of G.dm){ path(d,true); g.fill(); }
  g.strokeStyle=P.acc; g.lineWidth=lw; for(const q of G.hex){ path(q,true); g.stroke(); }
  return c;
}
function sendIcon(){ try{ const on=S.settings.ui.dynicon!==false; window.api.setIcon(on||INC?drawIcon():'',on); }catch{} }   // wyłączona opcja: proces główny sam użyje oryginalnej ikony programu


// ===== src/js/23-changelog.js =====
// ---------- ChangeLog: panel czytający CHANGELOG.txt z folderu aplikacji ----------
// Nagłówek wersji = linia znaków, linia "numer - nazwa", taka sama linia znaków. Znak = oznacza wersję niewydaną, znak * wydaną.
const CL={items:null,err:false,open:new Set(),c:{},busy:false,fail:false};
const clSep=/^([=*])\1{9,}\s*$/, CLT={en:'en',de:'de',es:'es',fr:'fr',he:'iw',zh:'zh-TW'};
const CLL=()=>CLT[S.settings.ui.lang]||'';   // '' = oryginał po polsku (polski, śląski)
const clHash=x=>{ let h=2166136261; for(let i=0;i<x.length;i++){ h^=x.charCodeAt(i); h=Math.imul(h,16777619); } return (h>>>0).toString(36); };
function clParse(text){
  const L=text.replace(/^\uFEFF/,'').replace(/\r/g,'').split('\n'), hd=[];
  for(let i=0;i+2<L.length;i++) if(clSep.test(L[i])&&L[i+1].trim()&&!clSep.test(L[i+1])&&clSep.test(L[i+2])&&L[i][0]===L[i+2][0]){ hd.push({at:i,rel:L[i][0]==='*',title:L[i+1].trim()}); i+=2; }
  return hd.map((h,k)=>{
    const body=L.slice(h.at+3,k+1<hd.length?hd[k+1].at:L.length), m=/^((?:v?\d+(?:\.\d+)*)(?:\s*,\s*v?\d+(?:\.\d+)*)*)\s*(?:[-–—:]\s*)?(.*)$/.exec(h.title), items=[];
    body.forEach(l=>{ if(!l.trim()) return; if(/^- /.test(l)) items.push(l.slice(2).trim()); else if(items.length&&/^\s/.test(l)) items[items.length-1]+=' '+l.trim(); else items.push(l.trim()); });
    const vl=m?m[1].split(/\s*,\s*/):[], v=vl.join(', '), name=m?m[2]:h.title,
      vn=vl.map(x=>x.replace(/^v/i,'').split('.').map(Number)).sort((a,b)=>{ for(let i=0;i<Math.max(a.length,b.length);i++){ const d=(b[i]||0)-(a[i]||0); if(d) return d; } return 0; })[0]||[];
    return {id:'e'+k,k,v,vn,name,rel:h.rel,items,hash:clHash(h.title+'\n'+items.join('\n')),nh:clHash(name)}; })
  .sort((a,b)=>{ for(let i=0;i<Math.max(a.vn.length,b.vn.length);i++){ const d=(b.vn[i]||0)-(a.vn[i]||0); if(d) return d; } return b.k-a.k; });
}
const clGet=k=>{ if(k in CL.c) return CL.c[k]; let v=null; try{ v=JSON.parse(localStorage.getItem(k)); }catch{} return CL.c[k]=v; };
const clPut=(k,v)=>{ CL.c[k]=v; try{ localStorage.setItem(k,JSON.stringify(v)); }catch{ try{ Object.keys(localStorage).filter(x=>x.startsWith('cb-cl')).forEach(x=>localStorage.removeItem(x)); localStorage.setItem(k,JSON.stringify(v)); }catch{} } };
const clName=e=>{ const tl=CLL(); return enc((tl&&clGet('cb-clnm-'+tl+'-'+e.nh))||e.name); };
const clItems=e=>{ const tl=CLL(), c=tl&&clGet('cb-cltr-'+tl+'-'+e.hash); return c&&c.length===e.items.length?c:e.items; };
const clLi=x=>'<li dir="auto">'+esc(enc(x)).replace(/`([^`]+)`/g,'<code>$1</code>')+'</li>';
const clShown=()=>(CL.items||[]).filter(e=>e.rel?S.settings.cl.rel:S.settings.cl.unrel);
function clStatus(){ const el=$('clstat'); if(!el) return; el.textContent=!CLL()?'':CL.busy?t('Tłumaczenie na język interfejsu...'):CL.fail?t('Pokazano oryginał (po polsku), bo tłumaczenie jest niedostępne.'):''; }
function clRender(){
  const el=$('cl'), st=S.settings.cl, old=el.querySelector('.cllist'), top=old?old.scrollTop:0, list=clShown();
  const card=e=>`<div class="clc ${e.rel?'rel':'unrel'}${CL.open.has(e.id)?' open':''}" data-id="${e.id}"><div class="clh" role="button" tabindex="0" aria-expanded="${CL.open.has(e.id)}">${e.v?`<span class="clv">${esc(e.v)}</span>`:''}<span class="cln" dir="auto">${esc(clName(e))}</span><span class="clst">${e.rel?t('Wydana'):t('Niewydana')}</span><i class="clar"><svg viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg></i></div><div class="clb"><div class="cli"><ul>${clItems(e).map(clLi).join('')}</ul></div></div></div>`;
  el.innerHTML=`<div class="sh"><b>ChangeLog</b><button id="clx">x</button></div>
  <div class="clbar"><label class="clchip ${st.rel?'on':''}"><input type="checkbox" data-f="rel" ${st.rel?'checked':''}>Wydane</label><label class="clchip ${st.unrel?'on':''}"><input type="checkbox" data-f="unrel" ${st.unrel?'checked':''}>Niewydane</label><span class="clcnt">${t('Wersji: {n}').replace('{n}',list.length)}</span></div>
  <p class="clstat" id="clstat"></p>
  <div class="cllist">${CL.err?`<p class="clempty">${t('Nie udało się wczytać pliku CHANGELOG.txt z folderu aplikacji.')}</p>`:list.length?list.map(card).join(''):`<p class="clempty">${t('Brak wpisów do pokazania.')}</p>`}</div>`;
  const nl=el.querySelector('.cllist'); if(nl) nl.scrollTop=top; clStatus();
}
async function clBatch(arr,tl){
  try{ const r=await trTranslate(arr.join('\n'),'pl',tl), o=r.text.replace(/\r/g,'').split('\n'); if(o.length===arr.length) return o;
    const res=[]; for(const x of arr){ const q=await trTranslate(x,'pl',tl); res.push(q.text.replace(/\n/g,' ').trim()); } return res; }
  catch{ return null; }
}
async function clTrNames(tl){
  const seen=new Set(), need=CL.items.filter(e=>e.name&&!clGet('cb-clnm-'+tl+'-'+e.nh)&&!seen.has(e.nh)&&seen.add(e.nh));
  if(!need.length) return true;
  const out=await clBatch(need.map(e=>e.name),tl); if(!out) return false;
  need.forEach((e,i)=>out[i]&&clPut('cb-clnm-'+tl+'-'+e.nh,out[i])); return true;
}
async function clTrBody(e,tl){
  const k='cb-cltr-'+tl+'-'+e.hash, c=clGet(k); if(c&&c.length===e.items.length) return true;
  const out=await clBatch(e.items,tl); if(!out) return false; clPut(k,out); return true;
}
function clPaint(e){
  const c=$('cl').querySelector(`.clc[data-id="${e.id}"]`); if(!c) return;
  c.querySelector('.cln').textContent=clName(e); c.querySelector('ul').innerHTML=clItems(e).map(clLi).join('');
}
let clTok=0;
async function clTr(){
  const tl=CLL(), tok=++clTok; CL.fail=false; CL.busy=false; if(!tl||!CL.items) return clStatus();
  CL.busy=true; clStatus(); let ok=await clTrNames(tl); if(tok!==clTok) return;
  CL.items.forEach(clPaint);
  for(const e of CL.items){ if(!CL.open.has(e.id)) continue; if(!(await clTrBody(e,tl))) ok=false; if(tok!==clTok) return; clPaint(e); }
  CL.busy=false; CL.fail=!ok; clStatus();
}
async function clTrOne(e){
  const tl=CLL(); if(!tl) return; CL.busy=true; clStatus(); const ok=await clTrBody(e,tl); CL.busy=false; CL.fail=!ok; clPaint(e); clStatus();
}
async function clLoad(){
  try{ const r=await window.api.changelog(); if(!r||!r.ok) throw 0; CL.items=clParse(r.text); CL.err=false; }catch{ CL.err=true; CL.items=CL.items||[]; }
  clRender(); clTr();
}
function toggleCl(v){
  const el=$('cl'), o=v===undefined?!el.classList.contains('open'):v; if(o===el.classList.contains('open')) return;
  if(o){ toggleSet(false); clRender(); el.classList.add('open'); clLoad(); } else el.classList.remove('open');
  $('clbtn').classList.toggle('on',o);
}
$('clbtn').onclick=()=>toggleCl();
$('cl').addEventListener('click',e=>{
  if(e.target.closest('#clx')) return toggleCl(false);
  const h=e.target.closest('.clh'); if(!h) return;
  const c=h.parentElement, id=c.dataset.id, on=!c.classList.contains('open'); c.classList.toggle('open',on); h.setAttribute('aria-expanded',on);
  on?CL.open.add(id):CL.open.delete(id);
  const en=on&&CL.items.find(x=>x.id===id); if(en) clTrOne(en);
});
$('cl').addEventListener('keydown',e=>{ if((e.key==='Enter'||e.key===' ')&&e.target.classList.contains('clh')){ e.preventDefault(); e.target.click(); } });
$('cl').addEventListener('change',e=>{ const f=e.target.dataset.f; if(!f) return; S.settings.cl[f]=e.target.checked; save(); clRender(); });

// efekt kliknięcia: delikatna fala od miejsca dotknięcia (przyciski u góry, na dole paska i przycisk Arkana)
document.addEventListener('pointerdown',e=>{
  if(e.button||document.body.classList.contains('na-btn')) return;
  const b=e.target.closest&&e.target.closest('#bar button,#wc button,#sb .fd,#nf,#brand'); if(!b) return;
  const r=b.getBoundingClientRect(), z=Math.max(r.width,r.height)*2.2, w=document.createElement('span'), i=document.createElement('i');
  w.className='rpl'; i.style.cssText=`left:${e.clientX-r.left}px;top:${e.clientY-r.top}px;width:${z}px;height:${z}px`; w.append(i); b.append(w); i.onanimationend=()=>w.remove();
},true);


// ===== src/js/24-import.js =====
// ---------- import z innych przeglądarek (importer.js w procesie głównym) ----------
const IMP={list:null,note:'',sel:'',o:{bm:true,hist:true,en:true,ck:true},busy:false,res:null};
const impHue=x=>[...x].reduce((a,c)=>(a*31+c.charCodeAt(0))%360,7);
const impF=(k,m)=>t(k).replace(/\{(\w)\}/g,(_,c)=>m[c]);
function impRender(){
  const el=$('imp'), L=IMP.list, P=(L||[]).find(p=>p.id===IMP.sel), file=IMP.sel==='file', has=k=>file?k==='bookmarks':!P||P.has[k];
  const card=(id,hue,ic,name,sub)=>`<div class="impb${IMP.sel===id?' on':''}" data-id="${esc(id)}"><i class="impi" style="--h:${hue}">${esc(ic)}</i><span><b>${esc(name)}</b><small>${esc(sub)}</small></span><u></u></div>`;
  let body;
  if(IMP.res) body=`<h5 class="impl">Wynik importu</h5><div class="impr">${IMP.res.map(r=>`<p class="${r.ok?'ok':'bad'}">${esc(r.text)}</p>`).join('')}</div><div class="impf"><button id="impx" class="impp">Gotowe</button></div>`;
  else {
    const HK={bm:'bookmarks',hist:'history',en:'engine',ck:'cookies'}, row=(k,lbl)=>`<label class="ck${has(HK[k])?'':' dis'}"><input type="checkbox" data-o="${k}" ${IMP.o[k]&&has(HK[k])?'checked':''} ${has(HK[k])?'':'disabled'}><span class="tg"></span>${lbl}</label>`;
    body=`<p class="hint">Przenieś zakładki, historię i zalogowane sesje. Hasła, rozszerzenia i inne ustawienia innych przeglądarek nie są importowane.</p>
    <h5 class="impl">Znalezione przeglądarki</h5>
    <div class="impls">${L===null?'<p class="hint">Szukam przeglądarek...</p>':(L.map(p=>card(p.id,impHue(p.kind==='firefox'?'ff':p.id.split('|')[0]),p.browser.replace(/^(Google|Microsoft|Mozilla)\s/,'')[0],p.browser,p.profile||'')).join('')+(IMP.note?`<p class="hint warn">${esc(IMP.note)}</p>`:'')+(L.length?'':'<p class="hint">Nie znaleziono przeglądarek. Użyj pliku zakładek (HTML) wyeksportowanego z dowolnej przeglądarki.</p>'))}
    <div class="impb" data-act="folder"><i class="impi" style="--h:30">+</i><span><b>Wskaż folder profilu...</b><small>Gdy Twojej przeglądarki nie ma na liście (np. Opera GX w innej lokalizacji).</small></span><u></u></div>
    <div class="impb${file?' on':''}" data-id="file"><i class="impi" style="--h:200">⌗</i><span><b>Plik zakładek (HTML)</b><small>Eksport z dowolnej przeglądarki, także Safari.</small></span><u></u></div></div>
    ${IMP.sel?`<h5 class="impl">Co przenieść</h5>${row('bm','Zakładki')}${file?'':row('hist','Historia')+row('en','Wyszukiwarka domyślna')+row('ck','Ciasteczka (zalogowane sesje)')}
    <p class="hint">Każdy folder zakładek trafi do osobnego folderu Arkany; strony ładują się dopiero po kliknięciu.</p>
    ${file?'':'<p class="hint warn">Zamknij wybraną przeglądarkę (także w zasobniku systemowym), inaczej jej bazy danych mogą być zablokowane.</p>'}
    ${!file&&IMP.o.ck?'<p class="hint warn">Ciasteczka zawierają dane logowania. Importuj tylko ze swojego profilu.</p>':''}`:''}
    <div class="impf"><button id="impx">Zamknij</button><button id="impgo" class="impp" ${IMP.sel&&!IMP.busy?'':'disabled'}>${IMP.busy?'Importuję...':'Importuj'}</button></div>`;
  }
  el.innerHTML=`<div class="impc"><div class="sh"><b>Import z innej przeglądarki</b><button id="impc" ${IMP.busy?'disabled':''}>x</button></div>${body}</div>`;
}
async function impOpen(){
  IMP.res=null; IMP.busy=false; $('imp').classList.add('open'); impRender();
  if(IMP.list===null){ try{ IMP.list=(await window.api.importDetect())||[]; }catch{ IMP.list=[]; } if(IMP.list.length&&!IMP.sel) IMP.sel=IMP.list[0].id; impRender(); }
}
function impEngine(e){ const se=S.settings.search; if(e.preset&&SE[e.preset]) se.engine=e.preset; else { se.engine='custom'; se.custom=e.url; } save(); return e.preset&&SE[e.preset]?SE[e.preset].n:(e.name||e.url); }
async function impPickFolder(){
  let r; try{ r=await window.api.importFolder(); }catch{ r=null; } if(!r||r.canceled) return;
  IMP.list=IMP.list||[];
  if(!r.ok||!r.list||!r.list.length){ IMP.note=t('W tym folderze nie znaleziono danych przeglądarki.'); impRender(); return; }
  IMP.note=''; for(const p of r.list) if(!IMP.list.some(y=>y.id===p.id)) IMP.list.push(p); IMP.sel=r.list[0].id; impRender();
}
function impClose(){ if(IMP.busy) return; $('imp').classList.remove('open'); }
function impBookmarks(tree,label){
  let pages=0, folders=0;
  const roleName={bar:'Pasek zakładek',other:'Inne zakładki',mobile:'Zakładki mobilne',menu:'Menu zakładek',html:'Zakładki'};
  const put=(name,urls)=>{ if(!urls.length) return; let f=S.folders.find(x=>x.name===name); if(!f){ f={id:uid(),name,icon:'i:folder',tabs:[],active:null}; S.folders.push(f); folders++; }
    const have=new Set(f.tabs.map(x=>x.url)); for(const u of urls) if(!have.has(u.url)){ f.tabs.push({id:uid(),url:u.url,title:u.name||''}); have.add(u.url); pages++; } };
  const walk=(n,path)=>{ put(path,n.children.filter(c=>c.t==='u')); n.children.filter(c=>c.t==='f').forEach(c=>walk(c,path+' / '+c.name)); };
  tree.forEach(r=>walk(r,label+': '+((r.role==='html'&&r.name)?r.name:t(roleName[r.role]||'Zakładki'))));
  renderSide(); save(); return {pages,folders};
}
function impHistory(list){
  const d=histDays(), lim=d?Date.now()-d*864e5:0, have=new Set(HIST.map(x=>x.u+'|'+x.t)); let n=0;
  for(const h of list){ if(h.t<lim||histSkipped(h.u)) continue; const k=h.u+'|'+h.t; if(have.has(k)) continue; have.add(k); HIST.push({i:uid(),t:h.t,u:h.u,ti:h.ti||'',ic:''}); n++; }
  HIST.sort((a,b)=>a.t-b.t); if(n){ histSave(); histDirty(); } return n;
}
async function impRun(){
  if(!IMP.sel||IMP.busy) return; IMP.busy=true; impRender(); const file=IMP.sel==='file', P=(IMP.list||[]).find(p=>p.id===IMP.sel), out=[];
  let r; try{ r=file?await window.api.importHtml():await window.api.importRun(IMP.sel,{bookmarks:IMP.o.bm,history:IMP.o.hist,engine:IMP.o.en,cookies:IMP.o.ck}); }catch(e){ r={ok:false,err:String((e&&e.message)||e)}; }
  IMP.busy=false;
  if(r&&r.canceled){ impRender(); return; }
  const label=file?'HTML':P?P.browser:'', E=(k,e)=>e==='locked'?t('baza jest zablokowana, zamknij przeglądarkę i spróbuj ponownie'):e;
  if(!r||r.ok===false){ out.push({ok:false,text:t('Błąd')+': '+(r&&r.err||'?')}); }
  else {
    const er=r.errors||{};
    if(r.bookmarks){ const b=impBookmarks(r.bookmarks,label); out.push({ok:true,text:b.pages?impF('Zakładki: {n} stron w {m} nowych folderach',{n:b.pages,m:b.folders}):t('Zakładki: brak nowych stron.')}); }
    if(er.bookmarks) out.push({ok:false,text:t('Zakładki')+': '+E('bm',er.bookmarks)});
    if(r.history){ const n=impHistory(r.history); out.push({ok:true,text:n?impF('Historia: dodano {n} wpisów',{n}):t('Historia: brak nowych wpisów.')}); }
    if(er.history) out.push({ok:false,text:t('Historia')+': '+E('h',er.history)});
    if(r.engine) out.push({ok:true,text:impF('Wyszukiwarka: ustawiono {n}',{n:impEngine(r.engine)})});
    else if(IMP.o.en&&!file&&P&&P.has.engine&&!er.engine) out.push({ok:true,text:t('Wyszukiwarka: używasz domyślnej, nic do przeniesienia.')});
    if(er.engine) out.push({ok:false,text:t('Wyszukiwarka')+': '+E('e',er.engine)});
    if(r.cookies){ out.push({ok:true,text:impF('Ciasteczka: zaimportowano {n}, pominięto {s}',{n:r.cookies.imported,s:r.cookies.skipped})}); if(r.cookies.unsupported) out.push({ok:false,text:impF('Część ciasteczek jest chroniona szyfrowaniem aplikacyjnym (nowszy Chrome) i nie da się jej przenieść: {n}.',{n:r.cookies.unsupported})}); }
    if(er.cookies) out.push({ok:false,text:t('Ciasteczka')+': '+E('c',er.cookies)});
    if(!out.length) out.push({ok:false,text:t('Zakładki: brak nowych stron.')});
    if(out.some(x=>x.ok)){ S.settings.imp.hint=false; save(); document.body.classList.add('noimph'); }
  }
  IMP.res=out; impRender();
}
$('imp').addEventListener('click',e=>{
  if(e.target===$('imp')||e.target.closest('#impx,#impc')) return impClose();
  const c=e.target.closest('.impb'); if(c&&!IMP.busy){ if(c.dataset.act==='folder') return impPickFolder(); IMP.sel=c.dataset.id; return impRender(); }
  if(e.target.closest('#impgo')) impRun();
});
$('imp').addEventListener('change',e=>{ const o=e.target.dataset.o; if(o){ IMP.o[o]=e.target.checked; impRender(); } });
document.addEventListener('click',e=>{ if(e.target.closest('#impopen,#imphb')){ if(!$('imp').classList.contains('open')) impOpen(); } else if(e.target.closest('#imphx')){ S.settings.imp.hint=false; save(); document.body.classList.add('noimph'); } });
document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&$('imp').classList.contains('open')) impClose(); });
document.addEventListener('click',e=>{ const b=e.target.closest('#set .seb'); if(b){ S.settings.search.engine=b.dataset.se; save(); renderSet(); } });
document.addEventListener('input',e=>{ if(e.target.id==='secust'){ S.settings.search.custom=e.target.value.trim(); e.target.classList.toggle('bad',!seValid(S.settings.search.custom)); save(); } });
document.body.classList.toggle('noimph',S.settings.imp.hint===false||S.folders.some(f=>f.tabs.length>0&&f.tabs.some(x=>x.url)));


// ===== src/js/25-updates.js =====
// ---------- aktualizacje ----------
const UPD={s:null,cur:'',asked:''};
function updText(s){
  const v=s.version||'';
  switch(s.state){
    case 'checking': return t('Sprawdzanie…');
    case 'none': return t('Masz najnowszą wersję');
    case 'available': return t('Dostępna wersja {v}').replace('{v}',v);
    case 'downloading': return t('Pobieranie wersji {v}: {p}%').replace('{v}',v).replace('{p}',s.percent||0);
    case 'ready': return t('Wersja {v} jest gotowa do instalacji').replace('{v}',v);
    case 'error': return t('Nie udało się sprawdzić aktualizacji');
    case 'unconfigured': return t('Repozytorium aktualizacji nie jest skonfigurowane');
    case 'secondary': return t('Aktualizacjami zajmuje się pierwsza uruchomiona instancja');
    default: return t('Nie sprawdzano jeszcze aktualizacji');
  }
}
function updPaint(){
  const b=$('updbox'); if(!b) return; const s=UPD.s||{state:'idle',current:UPD.cur,packaged:true}, run=s.state==='checking'||s.state==='downloading';
  const btn=(k,l,dis)=>`<button class="gjbt" data-u="${k}"${dis?' disabled':''}>${t(l)}</button>`;
  b.innerHTML=`<div class="ur"><span>${esc(t('Wersja {v}').replace('{v}',s.current||UPD.cur||VERSION.slice(1)))}</span><b>${esc(updText(s))}</b></div>`
    +(s.state==='downloading'?`<div class="upg"><i style="width:${s.percent||0}%"></i></div>`:'')
    +(s.state==='error'&&s.err?`<p class="hint">${esc(s.err==='Brak opublikowanych wydań'?t(s.err):s.err)}</p>`:'')
    +(UPD.s&&s.packaged===false?`<p class="hint">${esc(t('Uruchomiono bez instalatora – nowe wersje pobierzesz ze strony wydania.'))}</p>`:'')
    +`<div class="ubt">${btn('chk','Sprawdź aktualizacje',run)}${s.state==='available'?(s.packaged?btn('dl','Pobierz'):btn('open','Otwórz stronę wydania')):''}${s.state==='ready'?btn('inst','Zainstaluj i uruchom ponownie'):''}</div>`;
}
function updPush(){ if(SEC||!window.api||!window.api.updSet) return; try{ window.api.updSet({auto:S.settings.upd.auto,dl:S.settings.upd.dl}); }catch{} }
async function updAsk(s){
  await new Promise(r=>setTimeout(r,600));
  if(await ask(t('Aktualizacja gotowa'),t('Wersja {v} została pobrana. Zainstalować teraz? Przeglądarka uruchomi się ponownie.').replace('{v}',s.version),t('Zainstaluj i uruchom ponownie'))) window.api.updInstall();
  else toast(t('Zostanie zainstalowana przy zamknięciu przeglądarki'));
}
function updSet(s){ if(!s) return; UPD.s=s; UPD.cur=s.current||UPD.cur; updPaint(); if(s.state==='ready'&&UPD.asked!==s.version){ UPD.asked=s.version; updAsk(s); } }
document.addEventListener('click',e=>{ const b=e.target.closest&&e.target.closest('[data-u]'); if(!b||!$('updbox')||!$('updbox').contains(b)||!window.api) return;
  const k=b.dataset.u; try{ if(k==='chk') window.api.updCheck(); else if(k==='dl') window.api.updDownload(); else if(k==='open') window.api.updOpen(); else if(k==='inst') window.api.updInstall(); }catch{} });
if(!SEC&&window.api&&window.api.onUpd){ try{ window.api.onUpd(updSet); Promise.resolve(window.api.updInfo&&window.api.updInfo()).then(updSet).catch(()=>{}); updPush(); }catch{} }

arcInit();

// ===== src/js/26-start.js =====
// ---------- start ----------
try{ window.api.onXd(xdHandle); }catch{}
cw.addEventListener('dom-ready',()=>injS(cw));
try{ $('wmin').onclick=()=>window.api.winCtl('min'); $('wmax').onclick=()=>window.api.winCtl('max'); $('wcls').onclick=()=>window.api.winCtl('close');
  window.api.onWinState(v=>document.body.classList.toggle('maxd',v)); window.api.winState().then(v=>document.body.classList.toggle('maxd',v)); }catch(e){ console.warn('Zły preload.js',e); }
applySettings();
pwSet(); pushKeys();
setPanel(!!S.panel); if(S.panel) cw.setAttribute('src','https://claude.ai/new');
switchFolder(S.folders.find(f=>f.id===S.cur)?S.cur:S.folders[0].id);
renderBar(); S.aw.open.slice().forEach(id=>openApp(id));
applyLang();
bootGo();

// ===== src/js/27-privacy.js =====
// ---------- prywatność: uprawnienia stron, hasła, blokowanie reklam ----------
S.zoom=S.zoom||{};
const pfmt=(k,m)=>t(k).replace(/\{(\w+)\}/g,(_,c)=>m[c]);
const hostOf=u=>{ try{ return new URL(u).host; }catch{ return u||''; } };
const PERM_NAMES={'media:video':'Kamera','media:audio':'Mikrofon','media:audio+video':'Kamera i mikrofon','media:any':'Kamera lub mikrofon',geolocation:'Lokalizacja',notifications:'Powiadomienia','clipboard-read':'Odczyt schowka','display-capture':'Udostępnianie ekranu',midi:'Urządzenia MIDI',midiSysex:'Urządzenia MIDI','idle-detection':'Wykrywanie bezczynności','window-management':'Zarządzanie oknami','storage-access':'Dostęp do danych strony w innych witrynach','top-level-storage-access':'Dostęp do danych strony w innych witrynach',openExternal:'Otwieranie zewnętrznych aplikacji',fileSystem:'Dostęp do plików'};
const PERM_ICONS={cam:'<path d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/>',mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',geolocation:'<path d="M12 21s-6.5-5.7-6.5-11a6.5 6.5 0 0 1 13 0c0 5.3-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',notifications:'<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20a2 2 0 0 0 4 0"/>','clipboard-read':'<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4h6v3H9z"/>','display-capture':'<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',x:'<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V8a4 4 0 0 1 8 0v2"/>'};
const permIcon=k=>PERM_ICONS[k.startsWith('media:')?(k.includes('video')?'cam':'mic'):k]||PERM_ICONS.x;
const permName=k=>t(PERM_NAMES[k]||k);

// --- okno prośby o uprawnienie (kolejka: jedno okno naraz) ---
const PM={q:[],cur:null};
function pmShow(){
  const el=$('pm'); if(PM.cur||!PM.q.length) return; const r=PM.cur=PM.q.shift();
  el.innerHTML=`<div class="pmc"><div class="pmi"><svg viewBox="0 0 24 24">${permIcon(r.key)}</svg></div><h4>Prośba o uprawnienie</h4><p>${esc(pfmt('{s} chce uzyskać dostęp do:',{s:hostOf(r.origin)}))}</p><p class="pmn">${esc(permName(r.key))}</p><div class="pmb"><button class="pmp" data-a="allow">Zezwól</button><button data-a="once">Tylko tym razem</button><button data-a="deny">Zablokuj</button></div><small>Zezwól i Zablokuj zapamiętują decyzję dla tej strony. Zmienisz ją w Ustawienia → Prywatność.</small></div>`;
  el.classList.add('open');
}
function pmAnswer(a){
  const r=PM.cur; if(!r) return; PM.cur=null; $('pm').classList.remove('open');
  try{ window.api.permAnswer(r.id,a==='allow'||a==='once',a==='allow'||a==='deny'); }catch{}
  setTimeout(pmShow,120);
}
$('pm').addEventListener('click',e=>{ const b=e.target.closest('[data-a]'); if(b) return pmAnswer(b.dataset.a); if(e.target===$('pm')) pmAnswer('close'); });
document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&PM.cur) pmAnswer('close'); });
try{ window.api.onPermAsk(r=>{ PM.q.push(r); pmShow(); }); }catch(e){ console.warn('Zły preload.js (uprawnienia)',e); }

// --- hasła: paski zapisu i wypełniania ---
function pwHide(){ $('pwbar').classList.remove('open'); $('pwbar').innerHTML=''; }
function pwBar(text,btns){
  const b=$('pwbar'); b.innerHTML=`<span class="pwt">${esc(text)}</span>`+btns.map((x,i)=>`<button data-i="${i}"${x.p?' class="pwp"':''}>${esc(x.l)}</button>`).join('')+'<button class="pwx" data-i="x" title="Zamknij">×</button>';
  b.classList.add('open'); b.onclick=e=>{ const k=e.target.closest('button'); if(!k) return; pwHide(); const i=k.dataset.i; if(i!=='x') btns[+i].f(); };
}
async function privGuest(tab,w,e){
  const a=e.args&&e.args[0];
  if(e.channel==='zoom-wheel'){ if(T()===tab) zoomStep(+a); return; }
  if(!S.settings.pw.on||T()!==tab||!a||typeof a.origin!=='string') return;
  let st; try{ st=await window.api.vaultState(a.origin); }catch{ return; } if(!st||!st.available) return;
  if(e.channel==='pw-form'){
    if(!st.entries.length) return;
    pwBar(pfmt('Wypełnić dane logowania w {h}?',{h:hostOf(a.origin)}),st.entries.map(x=>({l:st.entries.length>1?(x.user||t('brak nazwy')):t('Wypełnij'),p:true,f:async()=>{ const c=await window.api.vaultFill(x.id,a.origin); if(c) w.send('pw-fill',c); }})));
  } else if(e.channel==='pw-submit'){
    if(st.never||!a.pass) return; const user=String(a.user||''), same=st.entries.find(x=>x.user===user);
    if(same){ const cur=await window.api.vaultFill(same.id,a.origin); if(cur&&cur.pass===a.pass) return; }
    const h=hostOf(a.origin), who=user||t('brak nazwy');
    pwBar(same?pfmt('Zaktualizować hasło dla {u} w {h}?',{u:who,h}):pfmt('Zapisać hasło dla {u} w {h}?',{u:who,h}),[
      {l:same?t('Aktualizuj'):t('Zapisz'),p:true,f:()=>{ window.api.vaultSave({origin:a.origin,user,pass:a.pass}).then(()=>{ if(setTab==='priv') privRefresh(); }); }},
      ...(same?[]:[{l:t('Nigdy dla tej strony'),f:()=>window.api.vaultNever(a.origin)}])]);
  }
}

// --- zakładka Prywatność w ustawieniach ---
const PRIV={perms:[],logins:[],avail:true,stats:{count:0},rev:null};
async function privRefresh(){
  try{ PRIV.perms=await window.api.permList(); const v=await window.api.vaultList(); PRIV.logins=v.logins; PRIV.avail=v.available; PRIV.stats=await window.api.adblockStats(); }catch{}
  if(setTab==='priv'&&$('set').classList.contains('open')) renderPrivTab(true);
}
function renderPrivTab(noRefresh){
  const sc=$('set').scrollTop, A=S.settings.adblock, P=S.settings.pw;
  const perms=PRIV.perms.length?PRIV.perms.map(p=>`<div class="pvr"><b>${esc(hostOf(p.origin))}</b><div class="pvc">${Object.keys(p.perms).map(k=>`<span class="pvchip ${p.perms[k]}"><i>${p.perms[k]==='allow'?'✓':'✕'}</i>${esc(permName(k))}<button data-pdel="${esc(p.origin)}" data-k="${esc(k)}" title="Usuń decyzję">×</button></span>`).join('')}</div></div>`).join(''):'<p class="hint">Brak zapamiętanych decyzji.</p>';
  const logins=!PRIV.avail?'<p class="hint warn">Szyfrowanie systemowe jest niedostępne. Sejf haseł nie działa.</p>':PRIV.logins.length?PRIV.logins.map(l=>`<div class="pvr"><b>${esc(hostOf(l.origin))}</b><span class="pvu">${esc(l.user||t('brak nazwy'))}${PRIV.rev&&PRIV.rev.id===l.id?` · <code>${esc(PRIV.rev.pass)}</code>`:''}</span><div class="pvb"><button data-vrev="${l.id}">Pokaż</button><button data-vcopy="${l.id}">Kopiuj</button><button data-vdel="${l.id}">Usuń</button></div></div>`).join(''):'<p class="hint">Brak zapisanych haseł.</p>';
  const L=S.settings.login;
  $('set').innerHTML=`<div class="sh"><b>⚙ Ustawienia</b><button id="sx">x</button></div>${tabsHtml()}
  <h5>LOGOWANIE NA STRONACH</h5>
  <label class="ck"><input type="checkbox" id="gfix" ${L.gfix?'checked':''}><span class="tg"></span>Zgodność z logowaniem do konta Google</label>
  <p class="hint">Google blokuje logowanie w przeglądarkach, które nie wyglądają jak Chrome („Ta przeglądarka lub aplikacja może nie być bezpieczna”). Ta opcja dodaje na stronach elementy, które ma Chrome, a których brakuje Arkanie. Wyłącz ją tylko wtedy, gdy przez nią jakaś strona nie działa. Zmiana działa po odświeżeniu strony.</p>
  <label class="ck"><input type="checkbox" id="pkon" ${L.passkeys?'checked':''}><span class="tg"></span>Pozwalaj stronom używać kluczy dostępu (Windows Hello)</label>
  <p class="hint">Gdy ta opcja jest wyłączona, strony nie mogą otworzyć systemowego okna „Zaloguj się przy użyciu klucza dostępu” i proponują logowanie hasłem. Zmiana działa po odświeżeniu strony.</p>
  <h5>BLOKOWANIE REKLAM</h5>
  <label class="ck"><input type="checkbox" id="abon" ${A.on?'checked':''}><span class="tg"></span>Blokuj reklamy i śledzące skrypty</label>
  <p class="hint">Blokuje żądania do znanych sieci reklamowych i trackerów, gdy pochodzą z innej witryny. To proste filtrowanie po domenach: nie usuwa reklam wbudowanych w stronę (np. w YouTube).</p>
  <p class="hint">${esc(pfmt('Zablokowano w tej sesji: {n}',{n:PRIV.stats.count||0}))}</p>
  <h5>UPRAWNIENIA STRON</h5><p class="hint">Strony pytają o dostęp do kamery, mikrofonu, lokalizacji i innych funkcji. Tu zmienisz zapamiętane decyzje.</p>${perms}
  ${PRIV.perms.length?'<div class="br"><button id="pclr">Wyczyść wszystkie</button></div>':''}
  <h5>HASŁA</h5>
  <label class="ck"><input type="checkbox" id="pwon" ${P.on?'checked':''}><span class="tg"></span>Proponuj zapisywanie haseł</label>
  <p class="hint">Hasła są szyfrowane przez system Windows. Chroni to plik przed odczytem z innego konta lub komputera, ale nie przed osobą korzystającą z Twojej sesji.</p>${logins}
  ${PRIV.logins.length?'<div class="br"><button id="vclr">Usuń wszystkie</button></div>':''}`;
  $('set').scrollTop=sc; if(!noRefresh) privRefresh();
}
document.addEventListener('change',e=>{
  if(e.target.id==='abon'){ S.settings.adblock.on=e.target.checked; try{ window.api.adblockSet(e.target.checked); }catch{} save(); }
  else if(e.target.id==='gfix'||e.target.id==='pkon'){ S.settings.login[e.target.id==='gfix'?'gfix':'passkeys']=e.target.checked; try{ window.api.webCfg(S.settings.login); }catch{} save(); }
  else if(e.target.id==='pwon'){ S.settings.pw.on=e.target.checked; save(); if(!e.target.checked) pwHide(); }
});
document.addEventListener('click',async e=>{
  const g=e.target.closest&&e.target.closest('#set [data-pdel],#set [data-vrev],#set [data-vcopy],#set [data-vdel],#set #pclr,#set #vclr'); if(!g) return;
  try{
    if(g.dataset.pdel!==undefined){ PRIV.perms=await window.api.permDel(g.dataset.pdel,g.dataset.k); }
    else if(g.id==='pclr'){ if(await ask('Wyczyścić zapamiętane uprawnienia?','Strony znów będą pytać o dostęp.','Wyczyść')) PRIV.perms=await window.api.permClear(); else return; }
    else if(g.dataset.vrev){ const p=await window.api.vaultReveal(g.dataset.vrev); PRIV.rev=p==null?null:{id:g.dataset.vrev,pass:p}; setTimeout(()=>{ PRIV.rev=null; if(setTab==='priv') renderPrivTab(true); },8000); }
    else if(g.dataset.vcopy){ const p=await window.api.vaultReveal(g.dataset.vcopy); if(p!=null) await navigator.clipboard.writeText(p); return; }
    else if(g.dataset.vdel){ PRIV.logins=(await window.api.vaultDel(g.dataset.vdel)); }
    else if(g.id==='vclr'){ if(await ask('Usunąć wszystkie zapisane hasła?','Tej operacji nie da się cofnąć.','Usuń')) PRIV.logins=await window.api.vaultClear(); else return; }
  }catch{}
  renderPrivTab(true);
});
try{ window.api.adblockSet(S.settings.adblock.on); }catch{}
try{ window.api.webCfg(S.settings.login); }catch{}

// ===== src/js/28-pagetools.js =====
// ---------- narzędzia strony: wyszukiwanie na stronie, zoom, drukowanie, narzędzia deweloperskie ----------
const curView=()=>{ const t=T(); return t&&views[t.id]||null; };
// podpięcie zdarzeń do karty (wywoływane z mkView)
function guestHooks(t,w){
  w.addEventListener('ipc-message',e=>privGuest(t,w,e));
  w.addEventListener('found-in-page',e=>findResult(t,e.result));
  w.addEventListener('dom-ready',()=>zoomApply(t,w));
  w.addEventListener('did-navigate',()=>{ zoomApply(t,w); if(T()===t) pwHide(); });
}
// --- zoom (osobno dla każdej witryny, zapamiętywany) ---
const ZSTEPS=[.25,.33,.5,.67,.75,.8,.9,1,1.1,1.25,1.5,1.75,2,2.5,3,4,5];
const zoomGet=t=>S.zoom[hostOf(t.url)]||1;
function zoomChip(){ const t=T(), z=t?zoomGet(t):1, b=$('zm'); b.style.display=Math.abs(z-1)<.001?'none':''; b.textContent=Math.round(z*100)+'%'; }
function zoomApply(t,w){ try{ w.setZoomFactor(zoomGet(t)); }catch{} if(T()===t) zoomChip(); }
function zoomSet(f){
  const t=T(), w=curView(); if(!t||!w) return; const h=hostOf(t.url); if(!h) return;
  if(Math.abs(f-1)<.001) delete S.zoom[h]; else S.zoom[h]=f;
  zoomApply(t,w); save();
}
function zoomStep(dir){
  const t=T(); if(!t) return; const c=zoomGet(t); let i=ZSTEPS.reduce((b,x,k)=>Math.abs(x-c)<Math.abs(ZSTEPS[b]-c)?k:b,0);
  i=Math.max(0,Math.min(ZSTEPS.length-1,i+(dir>0?1:-1))); zoomSet(ZSTEPS[i]);
}
$('zm').onclick=()=>zoomSet(1);
// --- wyszukiwanie na stronie ---
const FB={w:null,q:''};
function findOpen(){
  const w=curView(); if(!w) return; FB.w=w; const bar=$('fb'); bar.classList.add('open'); const q=$('fbq'); q.focus(); q.select(); if(q.value) w.findInPage(q.value);
}
function findClose(){ const bar=$('fb'); if(!bar.classList.contains('open')) return; bar.classList.remove('open'); try{ if(FB.w) FB.w.stopFindInPage('clearSelection'); }catch{} FB.w=null; $('fbc').textContent=''; }
function findNext(fwd){ const w=FB.w||curView(); const q=$('fbq').value; if(!w||!q) return; try{ w.findInPage(q,{forward:fwd,findNext:true}); }catch{} }
function findResult(t,r){ if(!r||!FB.w||views[t.id]!==FB.w) return; if(r.finalUpdate) $('fbc').textContent=r.matches?pfmt('{a} z {b}',{a:r.activeMatchOrdinal,b:r.matches}):t_('Brak wyników'); }
const t_=k=>t(k);
$('fbq').addEventListener('input',e=>{ const w=FB.w||curView(); if(!w) return; const q=e.target.value; if(!q){ try{ w.stopFindInPage('clearSelection'); }catch{} $('fbc').textContent=''; } else { try{ w.findInPage(q); }catch{} } });
$('fbq').addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); findNext(!e.shiftKey); } else if(e.key==='Escape'){ e.preventDefault(); findClose(); } });
$('fbp').onclick=()=>findNext(false); $('fbn').onclick=()=>findNext(true); $('fbx').onclick=findClose;
// zmiana karty zamyka pasek wyszukiwania i odświeża wskaźnik zoomu
{ const _a=activate; activate=function(id){ findClose(); pwHide(); const r=_a(id); zoomChip(); return r; }; }
// --- skróty ---
Object.assign(ACTS,{
  'find':findOpen,
  'zoom-in':()=>zoomStep(1),'zoom-in-alt':()=>zoomStep(1),'zoom-in-np':()=>zoomStep(1),
  'zoom-out':()=>zoomStep(-1),'zoom-out-np':()=>zoomStep(-1),
  'zoom-reset':()=>zoomSet(1),
  'print':()=>{ const w=curView(); if(w){ try{ w.print(); }catch{} } },
  'devtools':()=>{ const w=curView(); if(w){ try{ w.isDevToolsOpened()?w.closeDevTools():w.openDevTools(); }catch{} } }
});
zoomChip();

// ===== src/js/29-windows.js =====
// ---------- nowe okno, okno incognito i menu przeglądarki ----------
// Okno incognito: karty w osobnej sesji w pamięci (ustala ją proces główny), bez historii i bez zapisu stanu; po zamknięciu
// ostatniego okna incognito ciasteczka i dane stron znikają. Motyw to przyciemniona i wyszarzała wersja kolorów użytkownika.

// ikonka kapelusza i okularów (karty incognito)
function incHatSvg(cls){
  return `<svg class="${cls||'incg'}" viewBox="0 0 24 24" aria-hidden="true"><path class="ih" d="M6.6 10.6 8.1 4.6c.3-1.3 1.3-1.8 2.4-1.3l1.5.7 1.5-.7c1.1-.5 2.1 0 2.4 1.3l1.5 6z"/><path class="ih" d="M1.8 11.6c3-1.7 6.4-2.4 10.2-2.4s7.2.7 10.2 2.4c-3 1.4-6.4 2-10.2 2s-7.2-.6-10.2-2z"/><circle class="ig" cx="7.8" cy="17.6" r="3.3"/><circle class="ig" cx="16.2" cy="17.6" r="3.3"/><path class="ig" d="M11.1 17.2c.6-.6 1.2-.6 1.8 0"/></svg>`;
}
// napis „inCognito” na stronie startowej okna incognito: własne, odręcznie narysowane litery (nie czcionka systemowa) – grube, proste, bez szeryfów
// i zawijasów. Wszystkie krawędzie (góra i dół kresek, boki poprzeczki „t”, końce „C” i ogona „g”) są lekko zaokrąglone tym samym promieniem R,
// żeby litery miały jeden spójny wygląd. Siatka: linia podstawy y=15, małe litery y=3…15, wielkie y=0…15, grubość kreski 3,2.
// „in” jest prawie białe (iw1), „Cognito” wyraźnie szare (iw2); każda litera ma delikatny połysk (gradient w pionie z miękkim uskokiem).
// Litery są ściśnięte: okrągłe zachodzą na siebie (odstępy w tablicy GAP). Na końcu kropka w kolorze motywu (zmienna --incdot).
function incWordSvg(){
  const R=.9, W=3.2, n2=v=>+v.toFixed(2);
  // prostokąt z wybiernie zaokrąglonymi narożnikami [lewy-góra, prawy-góra, prawy-dół, lewy-dół]
  const rr=(x0,y0,x1,y1,[a,b,c,d])=>`<path d="M${n2(x0+a)} ${y0}H${n2(x1-b)}Q${x1} ${y0} ${x1} ${n2(y0+b)}V${n2(y1-c)}Q${x1} ${y1} ${n2(x1-c)} ${y1}H${n2(x0+d)}Q${x0} ${y1} ${x0} ${n2(y1-d)}V${n2(y0+a)}Q${x0} ${y0} ${n2(x0+a)} ${y0}Z"/>`;
  // gruby łuk (pierścień z przerwą) z zaokrąglonymi narożnikami na obu końcach; kąty w radianach (y w dół), od aS do aE
  const arc=(cx,cy,r,aS,aE,f)=>{
    const s=aE>aS?1:-1, Ro=r+W/2, Ri=r-W/2, dO=Math.asin(f/(Ro-f)), dI=Math.asin(f/(Ri+f)), sw=s>0?1:0;
    const P=(a,q)=>`${n2(cx+q*Math.cos(a))} ${n2(cy+q*Math.sin(a))}`, big=Math.abs(aE-aS)-2*dO>Math.PI?1:0;
    return `<path d="M${P(aS,(Ri+f)*Math.cos(dI))}L${P(aS,(Ro-f)*Math.cos(dO))}A${f} ${f} 0 0 ${sw} ${P(aS+s*dO,Ro)}A${Ro} ${Ro} 0 ${big} ${sw} ${P(aE-s*dO,Ro)}A${f} ${f} 0 0 ${sw} ${P(aE,(Ro-f)*Math.cos(dO))}L${P(aE,(Ri+f)*Math.cos(dI))}A${f} ${f} 0 0 ${sw} ${P(aE-s*dI,Ri)}A${Ri} ${Ri} 0 ${big} ${1-sw} ${P(aS+s*dI,Ri)}A${f} ${f} 0 0 ${sw} ${P(aS,(Ri+f)*Math.cos(dI))}Z"/>`;
  };
  const ring=x=>`<circle class="st" cx="${n2(x+6)}" cy="9" r="4.4"/>`, d2r=g=>g*Math.PI/180;
  const L={
    i:{w:3.2,s:x=>rr(x,3,x+W,15,[R,R,R,R])+`<circle cx="${n2(x+1.6)}" cy="-.7" r="2"/>`},
    n:{w:10.8,s:x=>rr(x,3,x+W,15,[R,0,R,R])+rr(x+7.6,8.4,x+10.8,15,[0,0,R,R])+`<path class="st" d="M${n2(x+1.6)} 8.6C${n2(x+1.6)} 5.6 ${n2(x+3.6)} 4.6 ${n2(x+5.7)} 4.6C${n2(x+8.2)} 4.6 ${n2(x+9.2)} 6.2 ${n2(x+9.2)} 8.6"/>`},
    C:{w:13.1,s:x=>arc(x+7.5,7.5,5.9,-d2r(42),-d2r(318),R)},
    o:{w:12,s:ring},
    g:{w:12,s:x=>ring(x)+`<path class="st" d="M${n2(x+10.4)} 9V16.2C${n2(x+10.4)} 18.6 ${n2(x+8.6)} 19.8 ${n2(x+6.2)} 19.8H${n2(x+4.6)}"/>`+rr(x+2.6,18.2,x+4.6,21.4,[R,0,0,R])},
    t:{w:7.2,s:x=>rr(x+2,-1.4,x+5.2,15,[R,R,R,R])+rr(x,3,x+7.2,6.2,[R,R,R,R])}
  };
  // odstępy między sąsiednimi literami: kreski proste ~1, okrągłe litery nachodzą na siebie (wartości ujemne)
  const GAP={'i>n':.9,'n>C':.3,'C>o':-.7,'o>g':-.7,'g>n':.9,'n>i':.9,'i>t':.9,'t>o':-1};
  const word='inCognito'; let x=0, out='';
  [...word].forEach((ch,k)=>{ out+=`<g class="${k<2?'iw1':'iw2'}">${L[ch].s(n2(x))}</g>`; x+=L[ch].w+(k<word.length-1?GAP[ch+'>'+word[k+1]]:0); });
  const gr=(id,st)=>`<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="0" y1="3" x2="0" y2="15">${st.map(([o,c])=>`<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>`;
  const defs=`<defs>${gr('iwg1',[[0,'#ffffff'],[.46,'#f1f1f5'],[.5,'#dedee4'],[1,'#c2c2ca']])}${gr('iwg2',[[0,'#b0b0b7'],[.46,'#9a9aa1'],[.5,'#86868d'],[1,'#6a6a71']])}</defs>`;
  return `<svg class="iw" viewBox="-.5 -3.2 ${n2(x+6.3)} 25.2" role="img" aria-label="Incognito">${defs}${out}<circle class="ip" cx="${n2(x+3.3)}" cy="13.1" r="1.9"/></svg>`;
}
// iskra Arkany w kapeluszu i okularach (strona startowa okna incognito; bez koła alchemicznego)
function incSparkSvg(){
  const c=[60,73], ray=k=>{ const a=k*Math.PI/4, r0=15, r1=k%2?33:45, p=r=>`${(c[0]+Math.sin(a)*r).toFixed(1)} ${(c[1]-Math.cos(a)*r).toFixed(1)}`; return `M${p(r0)}L${p(r1)}`; };
  return `<svg class="incsp" viewBox="0 0 120 120" aria-hidden="true"><g class="isr"><path d="${[...Array(8)].map((_,k)=>ray(k)).join('')}"/></g>`
    +`<path class="ihat" d="M38 45 43 19c.9-4.4 4.4-6.1 8.2-4.4L60 18.6l8.8-4c3.8-1.7 7.3 0 8.2 4.4l5 26z"/><path class="iband" d="M39.4 37.6c13.7 2.4 27.5 2.4 41.2 0l1.4 7.4H38z"/>`
    +`<path class="ihat" d="M16 49C29 42.2 43.5 39 60 39s31 3.2 44 10c-13 5.8-27.5 8.6-44 8.6S29 54.8 16 49z"/>`
    +`<g class="igl"><circle cx="46" cy="70" r="10.5"/><circle cx="74" cy="70" r="10.5"/><path d="M56.5 68.6c2.3-2.4 4.7-2.4 7 0"/></g></svg>`;
}
// wyrównanie pionowe napisu w logo incognito: środek zapisu „Arkana + inCognito” (wg faktycznej tuszu liter, nie ramek) leży na środku iskry w kapeluszu,
// więc napis wystaje nad i pod logo o tyle samo. Mierzone w oknie (czcionka może się zmienić), przeliczane przy zmianie rozmiaru i po załadowaniu czcionek.
function incAlign(){
  const l=$('logo'); if(!l) return; const w=l.querySelector('.incw'), sp=l.querySelector('.incsp'); if(!w||!sp) return;
  const b=w.querySelector('b'), iw=w.querySelector('.iw'); if(!b||!iw) return;
  w.style.setProperty('--incdy','0px');
  const sr=sp.getBoundingClientRect(), ir=iw.getBoundingClientRect(); if(!sr.height||!ir.height) return;
  const k=sr.height/120, hat=sp.querySelector('.ihat'), rays=sp.querySelector('.isr');
  if(!hat||!rays||!hat.getBBox) return; const hb=hat.getBBox(), rb=rays.getBBox();
  const sTop=sr.top+(hb.y-.6)*k, sBot=sr.top+(rb.y+rb.height+3.2)*k;                 // tusz iskry: góra ronda kapelusza, dół najdłuższego promienia z zaokrąglonym końcem
  const pr=document.createElement('i'); pr.style.cssText='display:inline-block;width:0;height:0;vertical-align:baseline'; b.appendChild(pr);
  const base=pr.getBoundingClientRect().bottom; pr.remove();
  const cs=getComputedStyle(b); let asc=.72*parseFloat(cs.fontSize);
  try{ const g=document.createElement('canvas').getContext('2d'); g.font=cs.fontStyle+' '+cs.fontWeight+' '+cs.fontSize+' '+cs.fontFamily; const m=g.measureText('Arkana'); if(m.actualBoundingBoxAscent) asc=m.actualBoundingBoxAscent; }catch{}
  const vk=ir.height/25.2, tTop=base-asc, tBot=ir.top+(21.4+3.2)*vk;                    // tusz napisu: góra „Arkana” (wg czcionki) i dół ogona „g”
  const dy=((sTop+sBot)-(tTop+tBot))/2; w.style.setProperty('--incdy',(Math.round(dy*10)/10)+'px');
}
function incAlignInit(){ const l=$('logo'); if(!l||l.__ia) return; l.__ia=1; incAlign();
  try{ new ResizeObserver(()=>incAlign()).observe(l); }catch{} try{ document.fonts&&document.fonts.ready.then(incAlign); }catch{} window.addEventListener('resize',incAlign); }
function winState(folder){
  const f=folder||{id:uid(),name:t('Folder')+' 1',icon:'📁',tabs:[],active:null};
  if(!f.tabs.length) f.tabs.push({id:uid(),url:'',title:''});
  if(!f.tabs.some(x=>x.id===f.active)) f.active=f.tabs[0].id;
  const st={folders:[f],cur:f.id,panel:false,pw:S.pw,closed:[],zoom:{...(S.zoom||{})},settings:JSON.parse(JSON.stringify(S.settings)),aw:{open:[],pos:{},links:[],data:{}}};
  st.settings.apps.on=false;    // aplikacje (notatki, historia) zostają w oknie głównym
  return st;
}
function newWindow(inc,folder){
  try{ window.api.newWin({state:winState(folder),inc:!!inc}); return true; }catch{ toast(t('Brak obsługi – podmień main.js i preload.js na nowe.')); return false; }
}
// otwiera podane karty (np. kartę lub cały folder) w nowym oknie incognito; w oknie zostają tylko adresy, bez ikon i historii
function openIncognito(list,name,icon){
  const tabs=(list||[]).filter(x=>x&&x.url).map(x=>({id:uid(),url:x.url,title:x.title||'',pinned:!!x.pinned}));
  return newWindow(true,{id:uid(),name:name||t('Incognito'),icon:icon||'📁',tabs,active:null});
}
Object.assign(ACTS,{ 'new-window':()=>newWindow(false), 'incognito':()=>newWindow(true) });

// menu przeglądarki (przycisk ⋮ na górnym pasku)
function browserMenu(){
  const b=$('menub'), r=b.getBoundingClientRect();
  showMenu(r.right-230,r.bottom+4,[
    {l:'Nowa karta',a:'new-tab',f:()=>newTab()},
    {l:'Nowe okno',a:'new-window',f:()=>newWindow(false)},
    {l:'Nowe okno incognito',a:'incognito',f:()=>newWindow(true)},
    'sep',
    {l:T()&&isGp(T().id)?'Odepnij ze wszystkich folderów':'Przypnij we wszystkich folderach',a:'pin-global',off:INC||!T()||!T().url,f:()=>toggleGlobal(T().id)},
    {l:'Historia',a:'history',off:INC,f:()=>toggleHist()},
    {l:'Szukaj na stronie',a:'find',off:!curView(),f:()=>act('find')},
    {l:'Drukuj stronę',a:'print',off:!curView(),f:()=>act('print')},
    'sep',
    {l:'Ustawienia',a:'settings',f:()=>toggleSet(true)}
  ]);
  const m=$('cm'), mr=m.getBoundingClientRect(); m.style.left=Math.max(6,Math.min(r.right-mr.width,innerWidth-mr.width-6))+'px';
}
if(INC) document.title='Arkana Browser – Incognito';
let menuWas=false;   // kliknięcie ⋮ przy otwartym menu zamyka je (mousedown zamyka menu wcześniej niż click)
addEventListener('mousedown',e=>{ menuWas=!!(e.target.closest&&e.target.closest('#menub'))&&$('cm').classList.contains('open'); },true);
$('menub').onclick=()=>{ if(menuWas){ menuWas=false; return; } browserMenu(); };

// ===== src/js/30-tour.js =====
// ---------- poradnik po interfejsie: pokazuje się sam tylko raz (S.tourSeen), potem z Ustawienia → System ----------
// Każdy krok podświetla fragment interfejsu (reszta jest przyciemniona) i pokazuje małe okno z opisem, numerem kroku i przyciskiem „Pomiń poradnik”.
// Kroki, których element jest teraz niewidoczny (np. ukryty panel asystenta, brak przypiętych kart), są pomijane.
const TOUR_STEPS=[
  {h:'Witaj w Arkanie',p:'Ten krótki poradnik pokaże Ci najważniejsze miejsca interfejsu i do czego służą. Możesz go w każdej chwili pominąć.'},
  {sel:['#brand','#back','#fwd','#reload'],h:'Logo i nawigacja',p:'Logo Arkany wraca do strony startowej. Strzałki cofają i przesuwają do przodu historię karty, a przycisk obok odświeża stronę.'},
  {sel:['#url'],h:'Pasek adresu',p:'Wpisz tu adres strony albo pytanie. Adres otworzy się od razu, a tekst zostanie wyszukany wybraną wyszukiwarką.'},
  {sel:['#tabs','#nt'],h:'Karty',p:'Każda strona to osobna karta. Plus dodaje nową kartę, a prawy przycisk myszy na karcie otwiera jej menu. Karty możesz przeciągać, by zmienić ich kolejność.'},
  {sel:['#pins'],h:'Przypięte karty',p:'Tu pojawiają się przypięte karty. Przypinasz je z menu prawego przycisku na karcie – zajmują mało miejsca i są zawsze pod ręką.'},
  {sel:['#fl'],side:'l',h:'Foldery',p:'Foldery to osobne zestawy kart, np. Praca i Prywatne. Kliknij folder, by do niego przejść, a przerywany przycisk na dole dodaje nowy. Prawy przycisk otwiera opcje folderu.'},
  {sel:['#gear'],side:'l',h:'Ustawienia',p:'Tu zmienisz motyw i kolory, wygląd interfejsu, skróty klawiszowe, prywatność i blokowanie reklam oraz język. Stąd też uruchomisz ten poradnik ponownie.'},
  {sel:['#toggle'],side:'l',h:'Panel asystenta',p:'Otwiera boczny panel z asystentem AI obok przeglądanej strony. Zaloguj się w nim raz, a potem zadawaj pytania, nie opuszczając strony.'},
  {sel:['#rl'],side:'r',h:'Aplikacje',p:'Pasek z wbudowanymi programami i grami, takimi jak kalkulator, notatnik, zegar czy konwerter. Otwierają się w pływających oknach, które możesz przesuwać.'},
  {sel:['#hbtn'],side:'r',h:'Historia',p:'Pokazuje listę odwiedzonych stron z wyszukiwarką. Zapisywanie historii i czas jej przechowywania ustawisz w Ustawieniach.'},
  {sel:['#menub'],h:'Menu',p:'Znajdziesz tu nowe okno, okno incognito bez zapisywania historii, szukanie na stronie, drukowanie i skrót do Ustawień.'},
  {h:'To już wszystko',p:'Poradnik możesz uruchomić ponownie w dowolnej chwili: Ustawienia → System → Pokaż poradnik ponownie. Miłego korzystania z Arkany!'}
];
let tourOn=false, tourList=[], tourI=0, tourTm=0, tourEl=null;
// ramka obejmująca widoczne elementy z listy selektorów (null = żaden nie jest widoczny)
function tourRect(sels){
  let r=null;
  for(const s of sels){
    const el=document.querySelector(s); if(!el) continue;
    const b=el.getBoundingClientRect(); if(b.width<2||b.height<2) continue;
    const cs=getComputedStyle(el); if(cs.display==='none'||cs.visibility==='hidden') continue;
    r=r?{l:Math.min(r.l,b.left),t:Math.min(r.t,b.top),r:Math.max(r.r,b.right),b:Math.max(r.b,b.bottom)}:{l:b.left,t:b.top,r:b.right,b:b.bottom};
  }
  return r;
}
function tourBuild(){
  if(tourEl) return tourEl;
  const d=document.createElement('div'); d.id='tour';
  d.innerHTML='<div id="tourh"></div><div id="tourc" role="dialog" aria-live="polite"><h4 id="tourt"></h4><p id="tourp"></p><div class="tn"><button id="tourb" type="button"></button><button id="tourn" type="button" class="ok"></button></div><div class="tf"><span id="tours"></span><button id="tourx" type="button"></button></div></div>';
  document.body.appendChild(d); tourEl=d;
  d.addEventListener('mousedown',e=>e.preventDefault());   // przyciski nie biorą fokusu, więc Enter obsługuje tylko skrót klawiszowy
  d.addEventListener('click',e=>{ const b=e.target.closest&&e.target.closest('button'); if(!b) return; if(b.id==='tourn') tourGo(1); else if(b.id==='tourb') tourGo(-1); else if(b.id==='tourx') tourEnd(); });
  return d;
}
// okno z opisem: najchętniej obok podświetlenia (nie zasłania go), zawsze w całości na ekranie
function tourPlace(r,side){
  const c=$('tourc'), h=$('tourh'), W=innerWidth, H=innerHeight, M=12, G=16, P=6, cw=c.offsetWidth, ch=c.offsetHeight;
  let x,y;
  if(!r){ h.className='c'; h.style.left=(W/2)+'px'; h.style.top=(H/2)+'px'; h.style.width='0px'; h.style.height='0px'; x=(W-cw)/2; y=(H-ch)/2; }
  else {
    h.className=''; h.style.left=(r.l-P)+'px'; h.style.top=(r.t-P)+'px'; h.style.width=(r.r-r.l+2*P)+'px'; h.style.height=(r.b-r.t+2*P)+'px';
    const cand={ b:[r.l,r.b+P+G], a:[r.l,r.t-P-G-ch], r:[r.r+P+G,r.t], l:[r.l-P-G-cw,r.t] };
    const order=side==='l'?['r','b','a','l']:side==='r'?['l','b','a','r']:['b','a','r','l'];
    const clampX=v=>Math.max(M,Math.min(v,W-cw-M)), clampY=v=>Math.max(M,Math.min(v,H-ch-M));
    const hit=(px,py)=>!(px+cw<=r.l-P||px>=r.r+P||py+ch<=r.t-P||py>=r.b+P);
    for(const k of order){ const px=clampX(cand[k][0]), py=clampY(cand[k][1]); if(!hit(px,py)||k===order[order.length-1]){ x=px; y=py; break; } }
  }
  c.style.left=Math.round(x)+'px'; c.style.top=Math.round(y)+'px';
}
function tourShow(i){
  const st=tourList[i], last=i===tourList.length-1; tourI=i; tourBuild();
  $('sidewrap').classList.toggle('tourx',st.side==='l'); $('rwrap').classList.toggle('tourx',st.side==='r');
  const draw=()=>{
    if(!tourOn||tourI!==i) return;
    $('tourt').textContent=t(st.h); $('tourp').textContent=t(st.p);
    $('tours').textContent=t('Krok {n}/{m}').replace('{n}',i+1).replace('{m}',tourList.length);
    $('tourb').textContent=t('Wstecz'); $('tourb').style.visibility=i?'':'hidden';
    $('tourn').textContent=t(last?'Zakończ':'Następny krok'); $('tourx').textContent=t('Pomiń poradnik'); $('tourx').style.visibility=last?'hidden':'';
    tourPlace(st.sel?tourRect(st.sel):null,st.side);
  };
  draw(); clearTimeout(tourTm);
  if(st.side) tourTm=setTimeout(draw,420);   // paski boczne rozwijają się ok. 0,3 s – wtedy poprawiamy położenie podświetlenia
}
function tourGo(d){ const n=tourI+d; if(n<0) return; if(n>=tourList.length) return tourEnd(); tourShow(n); }
function tourKey(e){
  if(!tourOn) return;
  const k=e.key; if(k!=='Escape'&&k!=='Enter'&&k!=='ArrowRight'&&k!=='ArrowLeft') return;
  e.preventDefault(); e.stopImmediatePropagation();
  if(k==='Escape') tourEnd(); else if(k==='ArrowLeft') tourGo(-1); else tourGo(1);
}
const tourResize=()=>{ if(tourOn&&tourList[tourI]) tourShow(tourI); };
function tourStart(manual){
  if(tourOn) return;
  tourOn=true; S.tourSeen=true; save();   // „widziany” zapisujemy od razu, więc przerwany poradnik nie wraca przy kolejnym uruchomieniu
  try{ toggleSet(false); toggleCl(false); closeMenu(); if($('hist').classList.contains('open')) toggleHist(false); }catch{}
  document.addEventListener('keydown',tourKey,true); addEventListener('resize',tourResize);
  tourBuild().classList.add('on');
  setTimeout(()=>{   // po ręcznym uruchomieniu czekamy, aż zamknie się szuflada ustawień
    if(!tourOn) return;
    tourList=TOUR_STEPS.filter(s=>!s.sel||tourRect(s.sel)); tourShow(0);
  },manual?380:60);
}
function tourEnd(){
  if(!tourOn) return;
  tourOn=false; clearTimeout(tourTm);
  document.removeEventListener('keydown',tourKey,true); removeEventListener('resize',tourResize);
  $('sidewrap').classList.remove('tourx'); $('rwrap').classList.remove('tourx');
  if(tourEl) tourEl.classList.remove('on');
}
// przy pierwszym uruchomieniu: po zakończeniu animacji startowej; nie w oknach oderwanych i incognito
function tourAuto(){
  if(SEC||INC||S.tourSeen) return;
  let n=0; const wait=()=>{ if(S.tourSeen||tourOn) return; if($('boot')&&n++<300) return setTimeout(wait,200); setTimeout(()=>{ if(!S.tourSeen) tourStart(false); },500); };
  wait();
}
document.addEventListener('click',e=>{ if(e.target.closest&&e.target.closest('#tourbtn')) tourStart(true); });
tourAuto();

// ===== src/js/31-mousekeys.js =====
// ---------- przyciski myszy przypisane do skrótów: okno przeglądarki (karty obsługuje wv-preload.js, panel asystenta wv-shim.js) ----------
// Środkowy i boczne przyciski myszy (dowolna ich liczba) można przypisać w Ustawienia → Skróty. Lewy i prawy są zablokowane.
// Proces główny sprawdza, czy kliknięta kombinacja jest przypisana, i sam wykonuje skrót; tu tylko zatrzymujemy domyślną reakcję okna na ten klik.
(function mouseKeysHost(){
  if(!(window.api&&window.api.mouseKey)) return;
  const num=b=>b===0?1:b===1?3:b===2?2:b+1;   // 1 lewy, 2 prawy, 3 środkowy, 4 i 5 boczne, 6… kolejne
  let last=null, eat=-1, eatT=0;
  const ask=e=>{
    const now=Date.now(); if(last&&last.b===e.button&&now-last.t<80) return last.hit;   // pointerdown i mousedown to ten sam klik
    let hit=false; try{ hit=!!window.api.mouseKey({n:num(e.button),ctrl:!!e.ctrlKey,alt:!!e.altKey,shift:!!e.shiftKey}); }catch{}
    last={b:e.button,t:now,hit}; return hit;
  };
  const down=e=>{
    if(e.button===0||e.button===2||recAct||tourOn) return;   // nagrywanie skrótu i poradnik same obsługują kliknięcia
    if(ask(e)){ eat=e.button; eatT=Date.now(); e.preventDefault(); e.stopImmediatePropagation(); } else eat=-1;
  };
  const up=e=>{ if(eat===e.button&&Date.now()-eatT<1500){ e.preventDefault(); e.stopImmediatePropagation(); } };
  addEventListener('pointerdown',down,true); addEventListener('mousedown',down,true);
  addEventListener('pointerup',up,true); addEventListener('mouseup',up,true); addEventListener('auxclick',up,true);
})();

// ===== src/js/32-defbrowser.js =====
// ---------- przeglądarka domyślna (Ustawienia → System) ----------
// Windows nie pozwala programowi samemu zostać przeglądarką domyślną: Arkana rejestruje się jako przeglądarka i otwiera Ustawienia Windows,
// w których użytkownik ją wybiera. Status odczytujemy z systemu (proces główny, defaultbrowser.js).
let defBusy=false;
async function defPaint(){
  const el=$('defst'); if(!el) return;
  el.classList.remove('okk'); el.textContent=t('Sprawdzam…');
  let r=null; try{ r=await window.api.defaultBrowser('status'); }catch{}
  const st=$('defst'); if(!st) return;   // w międzyczasie zakładka mogła się zmienić
  const hint=$('defhint'), btn=$('defset');
  if(!r||!r.supported){ st.textContent=t('Ta funkcja nie jest dostępna w tym oknie.'); if(btn) btn.disabled=true; return; }
  st.textContent=r.isDefault?t('Arkana jest teraz przeglądarką domyślną ✓'):t('Arkana nie jest przeglądarką domyślną.'); st.classList.toggle('okk',!!r.isDefault);
  if(hint) hint.textContent=r.win?t('Windows nie pozwala programom samodzielnie zmienić przeglądarki domyślnej. Po kliknięciu Arkana zarejestruje się w systemie jako przeglądarka i otworzą się Ustawienia Windows, w których wybierz Arkana Browser dla HTTP i HTTPS. Po wybraniu linki z innych programów będą otwierać się w Arkanie.'):t('Ustawia Arkanę jako domyślną przeglądarkę w systemie.');
}
async function defSet(){
  if(defBusy) return; defBusy=true;
  try{ const r=await window.api.defaultBrowser('set'); if(r&&r.ok===false) toast(t('Nie udało się zarejestrować Arkany w systemie.')); }catch{ toast(t('Nie udało się zarejestrować Arkany w systemie.')); }
  defBusy=false; defPaint();
}
document.addEventListener('click',e=>{ if(e.target.closest&&e.target.closest('#defset')) defSet(); });
addEventListener('focus',()=>{ if(setTab==='sys'&&$('set').classList.contains('open')) defPaint(); });   // po powrocie z Ustawień Windows odświeżamy status

// ===== src/js/33-pagefx.js =====
// ---------- gradient kolorów: kolor otwartej strony na paskach interfejsu (Ustawienia → Interfejs → Kolory stron → „Gradient kolorów”) ----------
// Całe obramowanie okna (pasek górny z kartami oraz oba paski boczne) jest JEDNYM polem kolorów: od koloru motywu przy krawędzi okna do koloru otwartej
// strony przy zawartości. Pole rysuje element #pgframe pod paskami (maska = góra × lewy bok × prawy bok), dzięki czemu w narożnikach gradienty nie dają
// szwów, a na wewnętrznych krawędziach pasków kolor jest dokładnie taki jak kolor strony. Kolor strony to jeden najczęstszy kolor krawędzi jej zrzutu
// (pagecolor.js); gdy zrzut się nie uda, odczytujemy tło elementów przy krawędziach strony (PG_DOM).
// Zmienna PGF jest „var”, bo applyUi() wywołuje applyPgfx() zanim ten plik się wykona.
var PGF=null;
const pgLum=c=>{ const f=v=>{ v/=255; return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4); }; return .2126*f(c[0])+.7152*f(c[1])+.0722*f(c[2]); };
const pgCon=(a,b)=>{ const x=pgLum(a), y=pgLum(b); return (Math.max(x,y)+.05)/(Math.min(x,y)+.05); };
const pgMixC=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));
// kolor, do którego dochodzą paski: pełny kolor strony, o ile napisy (fg) na nim pozostają czytelne (kontrast ≥ 4,5); inaczej tak daleko od koloru
// panelu w stronę koloru strony, jak pozwala czytelność (jasna strona przy ciemnym motywie nie zamieni pasków w biel)
function pgMix(panel,page,fg){
  if(pgCon(fg,page)>=4.5) return page;
  let lo=0, hi=1; for(let i=0;i<14;i++){ const m=(lo+hi)/2; if(pgCon(fg,pgMixC(panel,page,m))>=4.5) lo=m; else hi=m; }
  return pgMixC(panel,page,lo);
}
// zapasowy odczyt koloru strony z jej DOM: tło elementu w kilku punktach przy krawędziach (przezroczyste = biała domyślna karta)
const PG_DOM="(()=>{try{const W=innerWidth,H=innerHeight,pts=[],m=new Map();for(const f of [.15,.35,.55,.75,.9]){pts.push([3,H*f],[W-4,H*f],[W*f,3]);}"
  +"for(const p of pts){let el=document.elementFromPoint(p[0],p[1]),c=null;while(el&&!c){const k=/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)(?:,\\s*([\\d.]+))?\\)/.exec(getComputedStyle(el).backgroundColor);if(k&&(k[4]===undefined||+k[4]>.5))c=[+k[1],+k[2],+k[3]];else el=el.parentElement;}"
  +"c=c||[255,255,255];const key=c.join(',');m.set(key,(m.get(key)||0)+1);}let b=null,n=0;for(const e of m)if(e[1]>n){n=e[1];b=e[0];}return b?b.split(',').map(Number):null;}catch(e){return null;}})()";
const pgOn=()=>S.settings.ui.pgmode==='gradient';
function pgSet(cols){
  const pa=unhex(P.panel)||[27,24,22], fg=unhex(P.fg)||[245,237,227], bg=unhex(P.bg1||P.bg)||pa; cols=cols||{}; PGF.cols=cols;
  const c=cols.c||cols.t||cols.l||cols.r;
  if(!c&&S.settings.bgs&&S.settings.bgs.length>1){ document.documentElement.style.setProperty('--pgC','transparent'); return; }   // wielokolorowy motyw bez koloru strony (np. ekran startowy): pasek ma przejście motywu, bez jednolitego pola
  document.documentElement.style.setProperty('--pgC',hex(pgMix(pa,Array.isArray(c)?c:bg,fg)));
}
function pgRefresh(){ if(PGF&&pgOn()) pgSet(PGF.cols); }   // po zmianie motywu: ten sam kolor strony, nowe kolory paska
// wymiary pola: wysokość części górnej (pasek, karty, przypięte) oraz szerokość zwiniętych pasków bocznych (--pgLB/--pgRB) – od nich zależy, gdzie gradient
// dochodzi do koloru strony; szerokość chwilowo rozsuniętego panelu (--pgLW/--pgRW) ustawia i animuje CSS (css/app.css), razem z wysuwaniem panelu
function pgLayout(){
  if(!PGF||!pgOn()) return;
  const r=document.documentElement.style, m=$('main').getBoundingClientRect(), l=$('sidewrap').getBoundingClientRect(), rw=$('rwrap'), rr=rw.getBoundingClientRect();
  r.setProperty('--pgTH',Math.max(1,Math.round(m.top))+'px'); r.setProperty('--pgLB',Math.max(1,Math.round(l.width))+'px');
  r.setProperty('--pgRB',Math.max(1,rw.offsetParent===null?1:Math.round(rr.width))+'px');
}
async function pgSample(){
  if(!PGF||PGF.busy||!pgOn()) return; PGF.busy=true;
  try{
    const t=T(), w=t&&views[t.id]; let cols=null;
    if(w&&t.url&&home.style.display==='none'){   // strona startowa: kolor tła interfejsu
      try{ cols=await window.api.pageColors(w.getWebContentsId(),{w:w.clientWidth,h:w.clientHeight}); }catch{}   // rozmiar karty: proces główny zrzuca tylko pasy przy krawędziach
      if(!cols||!cols.c){ try{ const c=await w.executeJavaScript(PG_DOM); if(Array.isArray(c)) cols={c}; }catch{} }
    }
    if(pgOn()) pgSet(cols);
  }catch{}
  PGF.busy=false;
}
function pgSoon(){ if(!PGF||!pgOn()) return; clearTimeout(PGF.tm); PGF.tm=setTimeout(pgSample,320); }
function pgHook(w){ for(const ev of ['did-stop-loading','did-navigate','did-navigate-in-page','dom-ready']) w.addEventListener(ev,pgSoon); }
function applyPgfx(){
  if(!PGF) return;
  const u=S.settings.ui, on=pgOn(), c=document.body.classList;
  if(PGF.mode!==u.pgmode){ const was=PGF.mode; PGF.mode=u.pgmode; if(was!==undefined) for(const k in views) injG(views[k]); }   // tryb „Kolor motywu” (kolorowanie stron Google) włączony/wyłączony na otwartych kartach
  c.toggle('pgb',on);
  if(on&&!$('pgframe')){ const d=document.createElement('div'); d.id='pgframe'; document.body.insertBefore(d,document.body.firstChild); }
  clearInterval(PGF.iv); PGF.iv=0;
  if(on){ pgLayout(); pgSample(); PGF.iv=setInterval(()=>{ if(!document.hidden&&document.hasFocus()) pgSample(); },2500); }   // strona może się przewinąć lub zmienić kolor
}
PGF={busy:false,iv:0,tm:0,cols:{},mode:undefined};
addEventListener('resize',()=>{ pgLayout(); pgSoon(); });
try{ const ro=new ResizeObserver(()=>pgLayout()); for(const id of ['main','sidewrap','rwrap','tabrow','bar']) ro.observe($(id)); }catch{}
applyPgfx();

// ===== src/js/34-fonts.js =====
// ---------- czcionka interfejsu (v48) ----------
// Jedna czcionka dla całego interfejsu Arkany (nie dla stron internetowych). Lista to kilkaset znanych nazw (Windows, macOS, Linux, popularne Google Fonts);
// pokazywane są te, które są zainstalowane w systemie (wykrywanie przez porównanie szerokości tekstu), a dowolną inną można wpisać ręcznie.
// Wartość trafia do zmiennych --uif i --ufs na <html> (CSS ma je jako pierwszy wybór przed domyślnymi czcionkami).
function fontNames(){ return ['Segoe UI','Segoe UI Variable','Segoe UI Semilight','Segoe UI Light','Segoe Print','Segoe Script','Calibri','Calibri Light','Cambria','Candara','Consolas','Constantia','Corbel','Arial','Arial Black','Arial Narrow','Arial Rounded MT Bold','Bahnschrift','Book Antiqua','Bookman Old Style','Century Gothic','Century','Comic Sans MS','Courier New','Ebrima','Franklin Gothic Medium','Franklin Gothic Book','Gabriola','Gadugi','Georgia','Impact','Ink Free','Javanese Text','Leelawadee UI','Lucida Console','Lucida Sans Unicode','Lucida Bright','Lucida Sans','Lucida Fax','Lucida Handwriting','Lucida Calligraphy','Malgun Gothic','Microsoft JhengHei','Microsoft JhengHei UI','Microsoft YaHei','Microsoft YaHei UI','Microsoft Sans Serif','MingLiU','PMingLiU','SimSun','SimHei','KaiTi','FangSong','Mongolian Baiti','MV Boli','Myanmar Text','Nirmala UI','Palatino Linotype','Sitka Text','Sylfaen','Tahoma','Times New Roman','Trebuchet MS','Verdana','Yu Gothic','Yu Gothic UI','Yu Mincho','Rockwell','Rockwell Condensed','Garamond','Gill Sans MT','Goudy Old Style','Haettenschweiler','Harrington','Informal Roman','Jokerman','Kristen ITC','Magneto','Maiandra GD','Mistral','Monotype Corsiva','Niagara Engraved','Old English Text MT','Onyx','Papyrus','Perpetua','Playbill','Pristina','Ravie','Showcard Gothic','Snap ITC','Stencil','Tempus Sans ITC','Tw Cen MT','Vivaldi','Viner Hand ITC','Vladimir Script','Wide Latin','Bradley Hand ITC','Brush Script MT','Calisto MT','Copperplate Gothic Light','Elephant','Engravers MT','Eras ITC','Felix Titling','Footlight MT Light','Forte','Freestyle Script','French Script MT','Gigi','Juice ITC','Bell MT','Baskerville Old Face','Bernard MT Condensed','Berlin Sans FB','Bodoni MT','Britannic Bold','Californian FB','Centaur','Colonna MT','Cooper Black','Curlz MT','Edwardian Script ITC','Gloucester MT Extra Condensed','Imprint MT Shadow','Rage Italic','Script MT Bold','Poor Richard','Parchment','Palace Script MT','Cascadia Code','Cascadia Mono','David','Miriam','Narkisim','Gisha','Aharoni','FrankRuehl','Levenim MT','Rod','Arial Hebrew','Helvetica','Helvetica Neue','Avenir','Avenir Next','Optima','Futura','Menlo','Monaco','Geneva','Didot','Hoefler Text','Baskerville','American Typewriter','Chalkboard','Chalkduster','Marker Felt','Palatino','Gill Sans','SF Pro Text','SF Pro Display','SF Mono','San Francisco','Apple Chancery','Zapfino','Copperplate','Cochin','Charter','Iowan Old Style','Skia','Herculanum','Phosphate','Trattatello','Noteworthy','PingFang TC','PingFang SC','Hiragino Sans','Roboto','Roboto Condensed','Roboto Mono','Roboto Slab','Open Sans','Noto Sans','Noto Serif','Noto Mono','Noto Sans Hebrew','Noto Sans CJK TC','Noto Sans TC','Noto Serif CJK TC','Noto Color Emoji','Lato','Montserrat','Source Sans Pro','Source Sans 3','Source Serif Pro','Source Serif 4','Source Code Pro','Ubuntu','Ubuntu Condensed','Ubuntu Mono','Cantarell','DejaVu Sans','DejaVu Sans Condensed','DejaVu Serif','DejaVu Sans Mono','Liberation Sans','Liberation Serif','Liberation Mono','Fira Sans','Fira Code','Fira Mono','JetBrains Mono','Inter','Poppins','Raleway','Oswald','Merriweather','Playfair Display','PT Sans','PT Serif','PT Mono','Nunito','Nunito Sans','Work Sans','IBM Plex Sans','IBM Plex Serif','IBM Plex Mono','Hack','Droid Sans','Droid Serif','Droid Sans Mono','Lora','Quicksand','Comfortaa','Caveat','Pacifico','Lobster','Dancing Script','Bebas Neue','Anton','Abril Fatface','Josefin Sans','Karla','Mulish','Rubik','Barlow','Manrope','DM Sans','DM Serif Display','Space Grotesk','Space Mono','Libre Baskerville','Crimson Text','EB Garamond','Cormorant Garamond','Arimo','Tinos','Cousine','OpenDyslexic','Atkinson Hyperlegible','Lexend','Exo 2','Titillium Web','Cabin','Asap','Archivo','Kanit','Prompt','Ubuntu Sans','Overpass','Spectral','Vollkorn','Alegreya','Alegreya Sans','Bitter','Arvo','Zilla Slab','Cardo','Libre Franklin','Public Sans','Red Hat Display','Red Hat Text','Sora','Outfit','Plus Jakarta Sans','Urbanist','Figtree','Be Vietnam Pro','Hind','Catamaran','Heebo','Assistant','Rubik Mono One','Fredoka','Baloo 2','Patrick Hand','Indie Flower','Shadows Into Light','Amatic SC','Permanent Marker','Press Start 2P','VT323','Orbitron','Righteous','Bangers','Cinzel','Special Elite','Courier','Monospace','Terminal','Fixedsys','OCR A Extended','Bookshelf Symbol 7','Marlett','MS Gothic','MS Mincho','MS Sans Serif','MS Serif','Small Fonts','System','Tahoma Bold','Trebuchet','Verdana Pro','Aptos','Aptos Display','Aptos Serif','Aptos Mono','Grandview','Seaford','Skeena','Tenorite','Bierstadt','Sagona','Sagona Book']; }
var FNT_GEN=['system-ui','sans-serif','serif','monospace','cursive','fantasy'];
var FNT_OK=null;
function fontHas(n){ try{ const g=(fontHas.c=fontHas.c||document.createElement('canvas')).getContext('2d'), T='mmmmmmmmmmlli1WwÓłŹ', B=['monospace','serif','sans-serif'];
    return B.some(b=>{ g.font='72px '+b; const w0=g.measureText(T).width; g.font='72px "'+n+'",'+b; return g.measureText(T).width!==w0; }); }catch{ return false; } }
function fontsInstalled(){ if(!FNT_OK) FNT_OK=[...new Set(fontNames())].filter(fontHas).sort((a,b)=>a.localeCompare(b)); return FNT_OK; }
function fontCss(f){ if(!f) return ''; return ['system-ui','sans-serif','serif','monospace','cursive','fantasy'].includes(f)?f:'"'+String(f).replace(/["\\;{}<>]/g,'')+'",system-ui,sans-serif'; }
function applyFont(){ const f=(S.settings.ui.font||'').trim(), r=document.documentElement.style, v=fontCss(f);
  if(!v){ r.removeProperty('--uif'); r.removeProperty('--ufs'); } else { r.setProperty('--uif',v); r.setProperty('--ufs',v); }
  try{ if(typeof incAlign==='function') setTimeout(incAlign,60); }catch{} }
function fontItems(q){ q=(q||'').trim().toLowerCase(); const cur=S.settings.ui.font||'';
  const all=[['','Domyślna (Segoe UI)',''],...FNT_GEN.map(g=>[g,g,'systemowa']),...fontsInstalled().map(n=>[n,n,''])];
  return all.filter(([v,l])=>!q||l.toLowerCase().includes(q)).map(([v,l,sm])=>`<button class="fnt-b${cur===v?' on':''}" data-font="${esc(v)}" style="${v?'font-family:'+esc(fontCss(v)):''}"><span>${esc(l)}</span>${sm?`<small>${sm}</small>`:''}</button>`).join('')||'<p class="hint" style="padding:8px">Brak pasujących zainstalowanych czcionek. Możesz wpisać nazwę i użyć jej poniżej.</p>'; }
function fontSection(){ const cur=S.settings.ui.font||'';
  return `<h5>CZCIONKA</h5><p class="hint">Czcionka całego interfejsu Arkany (nie stron internetowych). Lista pokazuje czcionki zainstalowane w systemie, a każdą inną możesz wpisać ręcznie.</p>
  <div class="fnt-r"><input id="fntq" class="sein" placeholder="Szukaj lub wpisz nazwę czcionki…" value="" spellcheck="false"><button id="fntu" class="seb">Użyj</button></div>
  <div class="fnt-l" id="fntl">${fontItems('')}</div><p class="hint"><span>Wybrana czcionka:</span> <b id="fnti">${esc(cur||'Domyślna (Segoe UI)')}</b></p>`; }
function fontPick(v){ S.settings.ui.font=v; applyFont(); save(); const l=$('fntl'); if(l) l.innerHTML=fontItems(($('fntq')||{}).value); const i=$('fnti'); if(i) i.textContent=v||t('Domyślna (Segoe UI)'); }
document.addEventListener('click',e=>{ const t=e.target; if(!t.closest||!t.closest('#set')) return; const b=t.closest('.fnt-b'); if(b){ fontPick(b.dataset.font); return; }
  if(t.id==='fntu'){ const v=(($('fntq')||{}).value||'').trim(); if(v) fontPick(v); } });
document.addEventListener('input',e=>{ if(e.target.id==='fntq'){ const l=$('fntl'); if(l) l.innerHTML=fontItems(e.target.value); } });
document.addEventListener('keydown',e=>{ if(e.target.id==='fntq'&&e.key==='Enter'){ e.preventDefault(); const v=e.target.value.trim(); if(v) fontPick(v); } });

// ===== src/js/35-downloads.js =====
// ---------- pobrane pliki: ikona w górnym pasku, pierścień postępu, okno „Pobrane” (v49) ----------
// Dane wysyła proces główny (downloads.js): zdarzenie dl-evt z jednym rekordem {id,name,path,total,received,state,inc,t}.
// Stany: active (trwa), queued (czeka w kolejce; pobiera się jedno plik naraz), done, cancelled, failed.
var DL=[], DLICO={}, DLOPEN=false, DLSIG='', dlRaf=0, dlBub=0, dlFx=0;
const dlC=2*Math.PI*14.5;
const dlFmt=b=>{ if(!(b>0)) return ''; const u=['B','KB','MB','GB','TB']; let i=0; while(b>=1024&&i<4){ b/=1024; i++; } return (b>=100||i===0?Math.round(b):b.toFixed(1)).toString().replace('.',',')+' '+u[i]; };
const dlPending=()=>DL.filter(r=>r.state==='active'||r.state==='queued');
const dlPct=r=>r.total>0?Math.max(0,Math.min(100,Math.floor(r.received/r.total*100))):-1;
const dlExt=n=>{ const m=/\.([a-z0-9]{1,5})$/i.exec(n||''); return m?m[1].toLowerCase():''; };
function dlRing(){
  const b=$('dlb'); if(!b) return; const p=dlPending(), act=p.find(r=>r.state==='active')||p[0], pc=act?dlPct(act):0;
  b.classList.toggle('dl-act',!!act); b.classList.toggle('dl-ind',!!act&&pc<0);
  b.querySelector('.dlpg').style.strokeDashoffset=(dlC*(1-(pc<0?.28:pc/100))).toFixed(2);
  const bd=b.querySelector('.dlbd'); bd.textContent=p.length>1?String(p.length):''; bd.classList.toggle('on',p.length>1);
  b.title=t('Pobrane')+(act?' – '+(pc>=0?pc+'%':t('Pobieranie')):'');
}
function dlBubble(msg){
  let e=$('dlt'); if(!e){ e=document.createElement('div'); e.id='dlt'; document.body.appendChild(e); e.onclick=()=>{ e.classList.remove('open'); dlToggle(true); }; }
  const r=$('dlb').getBoundingClientRect(); e.style.top=(r.bottom+8)+'px'; e.style.right=Math.max(6,innerWidth-r.right-6)+'px';
  e.innerHTML='<b></b><small></small>'; e.firstChild.textContent=msg; e.lastChild.textContent=t('Kliknij, aby zobaczyć szczegóły');
  e.classList.add('open'); clearTimeout(dlBub); dlBub=setTimeout(()=>e.classList.remove('open'),3600);
}
function dlFx_(cls,ms){ const b=$('dlb'); if(!b) return; b.classList.remove(cls); void b.offsetWidth; b.classList.add(cls); clearTimeout(dlFx); dlFx=setTimeout(()=>b.classList.remove(cls),ms); }
function dlUpsert(r){
  const i=DL.findIndex(x=>x.id===r.id);
  if(i<0){ DL.unshift(r); if(r.state==='active'||r.state==='queued'){ dlFx_('dl-start',1500); if(!DLOPEN) dlBubble((r.state==='queued'?t('Dodano do kolejki'):t('Rozpoczęto pobieranie'))+': '+r.name); } }
  else { const pr=DL[i]; DL[i]=r; if(pr.state!=='done'&&r.state==='done'){ dlFx_('dl-done',1800); } }
  DL.sort((a,b)=>b.t-a.t); dlSched();
}
function dlSched(){ if(dlRaf) return; dlRaf=requestAnimationFrame(()=>{ dlRaf=0; dlRing(); if(DLOPEN) dlRender(); }); }
const FOLD='<svg viewBox="0 0 24 24"><path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>';
function dlRowInner(r){
  const pc=dlPct(r), pend=r.state==='active'||r.state==='queued', ico=DLICO[r.id];
  const sub=r.state==='active'?`<div class="dl-pb"><i style="width:${pc<0?30:pc}%"${pc<0?' class="ind"':''}></i></div><span class="dl-pc">${pc<0?'…':pc+'%'}</span>`
    :r.state==='queued'?`<span class="dl-st">${esc(t('W kolejce'))}</span>`
    :r.state==='done'?`<span class="dl-st">${esc(dlFmt(r.total||r.received))}</span>`
    :`<span class="dl-st er">${esc(t(r.state==='cancelled'?'Anulowano':'Nie udało się pobrać'))}</span>`;
  const act=r.state==='done'?`<button class="dl-fold" data-id="${r.id}" title="${esc(t('Pokaż w folderze'))}">${FOLD}</button>`
    :pend?`<button class="dl-x" data-id="${r.id}" title="${esc(t('Anuluj pobieranie'))}">×</button>`
    :`<button class="dl-x rm" data-id="${r.id}" title="${esc(t('Usuń z listy'))}">×</button>`;
  return `<div class="dl-ic">${ico?`<img src="${ico}" alt="">`:`<span>${esc((dlExt(r.name)||'•').slice(0,4))}</span>`}</div>
    <div class="dl-mn" data-id="${r.id}" title="${esc(r.path||r.name)}"><b>${esc(r.name)}</b><div class="dl-sub">${sub}</div></div>${act}`;
}
function dlRender(){
  const l=document.querySelector('#dlp .dll'); if(!l) return; const list=DL.slice(0,60), sig=list.map(r=>r.id+r.state).join('|');
  if(sig!==DLSIG){ DLSIG=sig;
    l.innerHTML=list.length?list.map(r=>`<div class="dl-it ${r.state}" data-id="${r.id}">${dlRowInner(r)}</div>`).join(''):`<p class="dl-em">${esc(t('Brak pobranych plików'))}</p>`;
    list.forEach(r=>{ if(!DLICO[r.id]&&(r.state==='done'||r.state==='active')&&window.api&&window.api.dlIcon) window.api.dlIcon(r.id).then(u=>{ if(!u) return; DLICO[r.id]=u; const el=l.querySelector(`.dl-it[data-id="${r.id}"] .dl-ic`); if(el) el.innerHTML=`<img src="${u}" alt="">`; }).catch(()=>{}); });
  } else list.forEach(r=>{ if(r.state!=='active') return; const it=l.querySelector(`.dl-it[data-id="${r.id}"]`); if(!it) return; const pc=dlPct(r), bar=it.querySelector('.dl-pb i'), tx=it.querySelector('.dl-pc');
    if(bar){ bar.style.width=(pc<0?30:pc)+'%'; bar.classList.toggle('ind',pc<0); } if(tx) tx.textContent=pc<0?'…':pc+'%'; });
  const c=document.querySelector('#dlp .dlh button'); if(c) c.disabled=!DL.some(r=>r.state!=='active'&&r.state!=='queued');
}
function dlToggle(on){
  let p=$('dlp'); if(!p){ p=document.createElement('div'); p.id='dlp'; p.innerHTML='<div class="dlh"><b>Pobrane</b><button id="dlclr">Wyczyść listę</button></div><div class="dll"></div>'; document.body.appendChild(p);
    p.addEventListener('click',e=>{ const t_=e.target, f=t_.closest('.dl-fold'), x=t_.closest('.dl-x'), m=t_.closest('.dl-mn,.dl-ic');
      if(f) window.api.dlShow(f.dataset.id);
      else if(x){ if(x.classList.contains('rm')){ window.api.dlRemove(x.dataset.id); DL=DL.filter(r=>r.id!==x.dataset.id); dlSched(); } else window.api.dlCancel(x.dataset.id); }
      else if(m){ const id=(m.dataset.id||m.parentNode.dataset.id), r=DL.find(z=>z.id===id); if(r&&r.state==='done') window.api.dlOpen(id); }
      else if(t_.id==='dlclr') window.api.dlClear().then(l=>{ const keep=new Set(l.map(r=>r.id)); DL=DL.filter(r=>keep.has(r.id)||r.state==='active'||r.state==='queued'); DLSIG=''; dlSched(); }).catch(()=>{}); }); }
  DLOPEN=on===undefined?!DLOPEN:on; const b=$('dlb'); if(DLOPEN){ const r=b.getBoundingClientRect(); p.style.top=(r.bottom+6)+'px'; p.style.right=Math.max(6,innerWidth-r.right-6)+'px'; const bb=$('dlt'); if(bb) bb.classList.remove('open'); DLSIG=''; dlRender(); }
  p.classList.toggle('open',DLOPEN); b.classList.toggle('on',DLOPEN);
}
(function(){
  const b=$('dlb'); if(!b||!window.api||!window.api.onDl) { if(b) b.style.display='none'; return; }
  b.onclick=()=>dlToggle();
  window.api.onDl(dlUpsert);
  window.api.dlList().then(l=>{ DL=Array.isArray(l)?l.slice().sort((a,c)=>c.t-a.t):[]; dlSched(); }).catch(()=>{});
  document.addEventListener('mousedown',e=>{ if(DLOPEN&&!e.target.closest('#dlp,#dlb')) dlToggle(false); },true);
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&DLOPEN) dlToggle(false); });
  addEventListener('blur',()=>{ if(DLOPEN) dlToggle(false); });
  addEventListener('resize',()=>{ if(DLOPEN) dlToggle(true); });
})();

// ===== src/js/36-themecolors.js =====
// ---------- kolory motywu i akcentu (v49 / v49.1) ----------
// Motyw: lista 1–4 kolorów (każdy: kolor RGB, nasycenie, jasność). Z nich powstaje przejście (--tg0/1/2), które CSS kładzie na dużych powierzchniach
// z background-attachment:fixed, więc jest ciągłe w całym oknie. Kształt, intensywność, powtórzenia, ruch i przechodzenie w miejscu to szkic (GD):
// widać go (także w ruchu) w podglądzie, a w aplikacji działa po „Zastosuj”. Kolory i korekty uniwersalne działają od razu.
// Akcent: lista 1–4 kolorów, opcjonalne płynne przechodzenie w czasie, własne korekty uniwersalne.
// Uwaga: dane są zwracane przez funkcje (nie stałe modułu), bo applySettings może zawołać ten kod zanim plik się wykona do końca.
function tmShapes(){ return [['h','Poziomo'],['v','Pionowo'],['dl','Ukośnie ↙'],['dr','Ukośnie ↘'],['rad','Od środka'],['full','Pełny ekran']]; }
function tmInts(){ return [['short','Szybkie'],['mid','Średnie'],['long','Długie']]; }
// kierunki ruchu zależne od kształtu: kolory przesuwają się wzdłuż osi przejścia (poziomo = poziome pasy kolorów płynące w dół/w górę itd.)
function tmDirs(){ return {h:[['down','↓ W dół'],['up','↑ W górę']],v:[['right','→ W prawo'],['left','← W lewo']],dl:[['bl','↙ W lewy dół'],['tr','↗ W prawą górę']],dr:[['br','↘ W prawy dół'],['tl','↖ W lewą górę']],rad:[['out','Na zewnątrz'],['in','Do środka']],full:[['up','↑ W górę'],['down','↓ W dół'],['left','← W lewo'],['right','→ W prawo']]}; }
function tmSlideOk(shape,k){ return !!k&&(tmDirs()[shape]||[]).some(x=>x[0]===k); }
function tmSt(){ return tmSt.s||(tmSt.s={raf:0,t0:performance.now(),last:0}); }
function tmMix(a,b,f){ const A=unhex(a)||[0,0,0], B=unhex(b)||[0,0,0]; return hex(A.map((v,i)=>Math.round(v+(B[i]-v)*f))); }
// przechodzenie w miejscu: łączenia stoją, a kolor każdego pasa płynie w kolejny kolor z listy (phase = liczba kroków kolorów)
function tmFade(cols,phase){ const n=cols.length, k=Math.floor(phase), f=phase-k; return cols.map((_,i)=>tmMix(cols[(i+k)%n],cols[(i+k+1)%n],f)); }
// przejście dla listy kolorów. o: {rep: powtórzenia 1–5, slide: kierunek ruchu lub '', u: faza ruchu 0..1 (jeden okres)}
function gradCss(cols,shape,inten,o){
  o=o||{}; const n=cols.length, solid=c=>`linear-gradient(${c},${c})`; if(n<1) return 'none'; if(n<2) return solid(cols[0]);
  const rep=Math.max(1,Math.min(5,Math.round(o.rep)||1)), hd0=({short:.8,mid:.4,long:0})[inten], hd=hd0===undefined?.4:hd0, u=o.u||0;
  if(shape==='full'){   // cały ekran jednym kolorem; kolejne wsuwają się tylko dzięki ruchowi (przechodzenie w miejscu zmienia sam kolor)
    if(!o.slide) return solid(cols[0]);
    const hz=o.slide==='left'||o.slide==='right', un=hz?'vw':'vh', sg=(o.slide==='right'||o.slide==='down')?1:-1, off=sg*u*n*100;
    return `repeating-linear-gradient(${hz?'to right':'to bottom'},${cols.map((c,i)=>`${c} ${(i*100+off).toFixed(2)}${un} ${((i+1)*100+off).toFixed(2)}${un}`).join(',')})`;
  }
  const dir={h:'to bottom',v:'to right',dl:'to bottom left',dr:'to bottom right'}[shape], rad=shape==='rad', st=[];
  const sg={down:1,right:1,bl:1,br:1,out:1,up:-1,left:-1,tr:-1,tl:-1,in:-1}[o.slide]||1, periodic=rep>1||!!o.slide;
  const cut=Array.isArray(o.cut)&&o.cut.length===n-1?o.cut:null;
  if(cut){   // niestandardowy podział: granice kolorów w podanych miejscach (wskazówka koloru = środek przejścia dokładnie na granicy)
    const P=100/rep, off=o.slide?sg*u*P:0, pos=periodic?(x=>(off+x*P).toFixed(3)+'%'):(x=>(x*100).toFixed(2)+'%'), b=[0,...cut,1], sp=[];
    for(let i=0;i<n;i++){ const len=b[i+1]-b[i], c=(b[i]+b[i+1])/2, h=hd*len/2, s0=c-h, e0=c+h;
      if(i===0&&!periodic){ sp.push(`${cols[0]} ${pos(0)}`); if(h>0) sp.push(`${cols[0]} ${pos(e0)}`); }
      else if(i===n-1&&!periodic){ if(h>0) sp.push(`${cols[i]} ${pos(s0)}`); sp.push(`${cols[i]} ${pos(1)}`); }
      else { sp.push(`${cols[i]} ${pos(s0)}`); if(h>0) sp.push(`${cols[i]} ${pos(e0)}`); }
      if(i<n-1) sp.push(pos(b[i+1])); }
    if(periodic){ const f0=(b[0]+b[1])/2-hd*(b[1]-b[0])/2; sp.push(pos(1)); sp.push(`${cols[0]} ${pos(f0+1)}`); }   // okres kończy się tym samym kolorem co zaczyna, więc powtórzenia i ruch nie mają szwu
    const body=sp.join(',');
    return rad?`${periodic?'repeating-':''}radial-gradient(circle farthest-corner at 50% 50%,${body})`:`${periodic?'repeating-':''}linear-gradient(${dir},${body})`;
  }
  if(!periodic){   // jedno przejście od pierwszego do ostatniego koloru
    cols.forEach((c,i)=>{ if(!hd) st.push(`${c} ${(i/(n-1)*100).toFixed(1)}%`); else { const c0=(i+.5)/n*100, h=hd*100/n/2; st.push(`${c} ${(c0-h).toFixed(1)}%`,`${c} ${(c0+h).toFixed(1)}%`); } });
    return rad?`radial-gradient(circle farthest-corner at 50% 50%,${st.join(',')})`:`linear-gradient(${dir},${st.join(',')})`;
  }
  // okresowe (powtórzenia i/lub ruch): okres = 100%/rep długości przejścia, kolor 1 na początku i na końcu okresu, więc ruch nie ma szwu
  const P=100/rep, off=o.slide?sg*u*P:0, pos=x=>(off+x*P).toFixed(3)+'%', w=hd?hd/n/2:0;
  cols.forEach((c,i)=>{ if(!hd) st.push(`${c} ${pos(i/n)}`); else if(i===0) st.push(`${c} ${pos(0)}`,`${c} ${pos(w)}`); else st.push(`${c} ${pos(i/n-w)}`,`${c} ${pos(i/n+w)}`); });
  if(hd) st.push(`${cols[0]} ${pos(1-w)}`); st.push(`${cols[0]} ${pos(1)}`);
  return rad?`repeating-radial-gradient(circle farthest-corner at 50% 50%,${st.join(',')})`:`repeating-linear-gradient(${dir},${st.join(',')})`;
}
// kolory jednego poziomu (tło / panel / panel2) dla podanej listy kolorów – ta sama matematyka co w applySettings (z korektą uniwersalną)
function themeLv(bgs){
  const cl=bgs.map(b=>{ let [h,s,l]=calcBg(effBg(b,S.settings.bgAdj)); if(INC){ s*=.18; l=l>55?l-9:l*.8; } return [h,s,l]; });
  const light=cl.reduce((a,c)=>a+c[2],0)/cl.length>55, dir=light?-1:1;
  const f=dl=>cl.map(([h,s,l])=>hex(hsl2rgb(h,s,clamp(l+dl*dir,0,100)))); f.light=light; return f;
}
const tmEff=b=>dispCol(effBg(b,S.settings.bgAdj));
// jeden kadr przejścia dla koloru poziomu dl, konfiguracji cfg i czasu sec
function tmOne(cols,cfg,sec){ const n=cols.length; if(cfg.fade&&n>1) cols=tmFade(cols,sec/cfg.spd);
  return gradCss(cols,cfg.shape,cfg.int,{rep:cfg.rep,cut:cfg.cut,slide:tmSlideOk(cfg.shape,cfg.slide)?cfg.slide:'',u:n>1?(sec/(n*cfg.spd))%1:0}); }
const tmCfg=()=>{ const s=S.settings; return {shape:s.bgShape,int:s.bgInt,rep:s.bgRep,slide:s.bgSlide,fade:s.bgFade,spd:s.bgSpd,cut:s.bgCut&&s.bgCut.length===s.bgs.length-1?s.bgCut:null}; };
const tmMoves=c=>c.fade||tmSlideOk(c.shape,c.slide);
function tmAccList(){ const s=S.settings; return s.accs.map(h=>effAcc(h,s.accAdj)); }
function tmAccAt(sec){ const L=tmAccList(), n=L.length, ph=sec/S.settings.accSpd, k=Math.floor(ph), f=ph-k, A=L[k%n], B=L[(k+1)%n]; return A.map((v,i)=>Math.round(v+(B[i]-v)*f)); }
function tmSec(){ return (performance.now()-tmSt().t0)/1000; }
// malowanie: przejścia motywu i (przy przechodzeniu w czasie) akcent. Wołane z applySettings oraz z pętli animacji.
// Wydajność (v49.8): kolory poziomów (themeLv) liczymy tylko po zmianie kolorów lub korekty, a zmienne CSS ustawiamy tylko, gdy ich wartość naprawdę się zmieniła
// (np. przy samym przechodzeniu akcentu przejście motywu stoi, więc przeglądarka nie przelicza stylów dużych powierzchni co klatkę).
function tmLv(bs){ const T=tmSt(), k=JSON.stringify(bs)+'|'+JSON.stringify(S.settings.bgAdj); if(T.lk!==k){ const L=themeLv(bs); T.lk=k; T.lv={light:L.light,c:[0,3.7,7.4].map(dl=>L(dl))}; } return T.lv; }
function tmProp(r,k,v){ const T=tmSt(), pv=T.pv||(T.pv={}); if(pv[k]===v) return; pv[k]=v; r.setProperty(k,v); }
function tmPaint(sec,fast){
  const s=S.settings, r=document.documentElement.style, bs=fast&&Array.isArray(s.bgs)&&s.bgs.length?s.bgs:fixBgs();   // fast = klatka animacji: ustawienia są już znormalizowane przez applySettings
  const multi=bs.length>1;
  if(!multi) [0,1,2].forEach(i=>tmProp(r,'--tg'+i,'none'));
  else { const L=tmLv(bs), cfg=tmCfg(); L.c.forEach((cols,i)=>tmProp(r,'--tg'+i,tmOne(cols,cfg,sec))); tmProp(r,'--tgov',L.light?'rgba(0,0,0,.045)':'rgba(255,255,255,.045)'); }
  if(document.body){ document.body.classList.toggle('tgx',multi); if(multi&&!$('tgl')){ const e=document.createElement('div'); e.id='tgl'; document.body.insertBefore(e,document.body.firstChild); } }
  if(s.accFade&&s.accs.length>1) accApply(tmAccAt(sec));
}
function tmPrevCfg(){ const d=gd(); return {shape:d.shape,int:d.int,rep:d.rep,slide:d.slide,fade:d.fade,spd:d.spd,cut:d.cut}; }
function tmPrevCss(sec){ const d=gd(), bs=d.ord.map(i=>S.settings.bgs[i]), L=themeLv(bs), cfg=tmPrevCfg();
  return [0,3.7].map(dl=>bs.length<2?`linear-gradient(${L(dl)[0]},${L(dl)[0]})`:tmOne(L(dl),cfg,sec)); }
function tmPreview(sec){ const g=$('gprev'); if(!g) return; const [m,p]=tmPrevCss(sec); g.style.background=m; g.firstChild.style.background=p; }
function tmNeeds(){ const s=S.settings, app=(s.bgs.length>1&&tmMoves(tmCfg()))||(s.accFade&&s.accs.length>1), prev=!!$('gprev')&&S.settings.bgs.length>1&&tmMoves(tmPrevCfg()); return {app,prev}; }
function tmLoop(ts){ const T=tmSt(); T.raf=0; let nd; try{ nd=tmNeeds(); }catch{ return; } if(!nd.app&&!nd.prev) return;
  if(fr30(T,ts)){ T.last=ts; const sec=tmSec(); if(nd.app) tmPaint(sec,true); if(nd.prev) tmPreview(sec); }
  T.raf=requestAnimationFrame(tmLoop); }
function tmSync(){ try{ const T=tmSt(), sec=tmSec(); tmPaint(sec); const nd=tmNeeds(); if((nd.app||nd.prev)&&!T.raf) T.raf=requestAnimationFrame(tmLoop); }catch{} }
// ----- szkic ustawień przejść (podgląd przed zatwierdzeniem) -----
function gd(){ const s=S.settings; if(!GD_()||GD_().n!==s.bgs.length) GD_(null,{n:s.bgs.length,cut:(s.bgCut&&s.bgCut.length===s.bgs.length-1)?s.bgCut.slice():null,shape:s.bgShape,int:s.bgInt,rep:s.bgRep,slide:tmSlideOk(s.bgShape,s.bgSlide)?s.bgSlide:'',fade:s.bgFade,spd:s.bgSpd,ord:s.bgs.map((_,i)=>i)}); return GD_(); }
function GD_(clear,v){ if(v) GD_.v=v; else if(clear===null) GD_.v=null; return GD_.v; }
const gdDirty=()=>{ const d=gd(), s=S.settings; return d.shape!==s.bgShape||d.int!==s.bgInt||d.rep!==s.bgRep||d.slide!==(tmSlideOk(s.bgShape,s.bgSlide)?s.bgSlide:'')||d.fade!==s.bgFade||d.spd!==s.bgSpd||d.ord.some((v,i)=>v!==i)||JSON.stringify(d.cut)!==JSON.stringify((s.bgCut&&s.bgCut.length===s.bgs.length-1)?s.bgCut:null); };
function gdCommit(){ const d=gd(), s=S.settings; if(!gdDirty()) return; const old=s.bgs, sel=d.ord.indexOf(s.bgSel);
  s.bgs=d.ord.map(i=>old[i]); s.bgSel=Math.max(0,sel); s.bgShape=d.shape; s.bgInt=d.int; s.bgRep=d.rep; s.bgSlide=d.slide; s.bgFade=d.fade; s.bgSpd=d.spd; s.bgCut=(d.cut&&d.cut.length===s.bgs.length-1)?d.cut.slice():[]; GD_(null); }
function gprevHtml(){ const [m,p]=tmPrevCss(tmSec()); return `<div class="gprev" id="gprev" style="background:${m}"><i class="gpl" style="background:${p}"></i></div>`; }
function themeRefresh(){
  tmPreview(tmSec());
  S.settings.bgs.forEach((b,i)=>{ const e=$('set').querySelector(`.tch[data-l="bg"][data-i="${i}"] .tcs`); if(e) e.style.background=tmEff(b); });
  S.settings.accs.forEach((h,i)=>{ const e=$('set').querySelector(`.tch[data-l="ac"][data-i="${i}"] .tcs`); if(e) e.style.background=hex(effAcc(h,S.settings.accAdj)); });
  const d=gd(), bsd=d.ord.map(i=>S.settings.bgs[i]).map(tmEff);
  $('set').querySelectorAll('.gsb[data-gs],.gsb[data-gi]').forEach(e=>{ const i=e.firstChild; if(!i||i.tagName!=='I') return; i.style.background=e.dataset.gs==='full'?fullIco(bsd):gradCss(bsd,e.dataset.gs||d.shape,e.dataset.gi||d.int,{rep:1}); });
}
const fullIco=cs=>`linear-gradient(to right,${cs.map((c,i)=>`${c} ${(i/cs.length*100).toFixed(0)}% ${((i+1)/cs.length*100).toFixed(0)}%`).join(',')})`;
const slG=(k,label,min,max,val,unit)=>`<div class="sr"><span>${label}<b>${val}${unit||''}</b></span><div class="rg" data-k="gs"><i class="tr"></i><i class="fl"></i><input type="range" data-g="${k}" min="${min}" max="${max}" step="1" value="${val}"></div></div>`;
const adjHtml=k=>{ const a=S.settings[k+'Adj'], nm=k==='bg'?'MOTYWU':'AKCENTU';
  return `<h5>KOREKTA WSZYSTKICH KOLORÓW ${nm}</h5><p class="hint">Przesuwa jasność, nasycenie i składowe RGB każdego koloru o podaną wartość (nie ustawia ich na stałe). Gdy któryś kolor dojdzie do granicy zakresu, zostaje na niej.</p>
  ${sl(k+'Adj.bri','Jasność',-100,100,a.bri,'adj')}${sl(k+'Adj.sat','Nasycenie',-100,100,a.sat,'adj')}${sl(k+'Adj.r','R — czerwony',-255,255,a.r,'adj')}${sl(k+'Adj.g','G — zielony',-255,255,a.g,'adj')}${sl(k+'Adj.b','B — niebieski',-255,255,a.b,'adj')}
  <button class="seb" data-adjr="${k}" style="margin-top:6px">Zeruj korektę</button>`; };
function themeColorsHtml(){
  const st=S.settings, d=gd(), bgs=st.bgs, n=bgs.length, b=curBg();
  const rows=d.ord.map((i,pos)=>{ const c=bgs[i], open=i===st.bgSel;
    const body=open?`<div class="tcb"><div class="sw">${SW.map((q,k)=>`<i data-sw="${k}" style="background:${swCol(q)}"></i>`).join('')}</div>
      ${sl('bg.sat','Nasycenie',0,100,b.sat,'sat')}${sl('bg.bri','Jasność',0,100,b.bri,'bri')}
      <label class="ck"><input type="checkbox" id="adv" ${st.adv?'checked':''}><span class="tg"></span>Zaawansowane (panel RGB)</label>
      <div class="ad ${st.adv?'open':''}"><div class="adi"><div id="rgb">${sl('bg.r','R — czerwony',0,255,b.r,'r')}${sl('bg.g','G — zielony',0,255,b.g,'g')}${sl('bg.b','B — niebieski',0,255,b.b,'b')}<input id="hx" value="${hex([b.r,b.g,b.b])}" maxlength="7"><p class="hint">Każdy suwak działa niezależnie. Nasycenie i jasność są korektą nałożoną na kolor z RGB.</p></div></div></div></div>`:'';
    return `<div class="tci${open?' open':''}" data-l="bg" data-i="${i}"><div class="tch" data-l="bg" data-i="${i}" draggable="${n>1}"><span class="tdr" title="Przeciągnij, aby zmienić kolejność">⠿</span><i class="tcs" style="background:${tmEff(c)}"></i><b><span>Kolor</span> ${pos+1}</b><button class="tce" data-l="bg" data-i="${i}" title="Pipeta: wybierz kolor z ekranu">${EYD_ICON}</button><button class="tcx" data-l="bg" data-i="${i}" title="Usuń kolor" ${n<2?'disabled':''}>×</button></div>${body}</div>`; }).join('');
  const bsd=d.ord.map(i=>bgs[i]).map(tmEff), full=d.shape==='full', dirs=tmDirs()[d.shape]||[];
  const multi=n>1?`<h5>PRZEJŚCIA KOLORÓW</h5><p class="hint">Kształt przejścia kolorów (kolejność kolorów na liście to kolejność w aplikacji):</p>
    <div class="gsr">${tmShapes().map(([k,l])=>`<button class="gsb${d.shape===k?' on':''}" data-gs="${k}"><i style="background:${k==='full'?fullIco(bsd):gradCss(bsd,k,d.int,{rep:1})}"></i><span>${l}</span></button>`).join('')}</div>
    ${full?'':`    <p class="hint">Intensywność przejść:</p><div class="gsr g3">${tmInts().map(([k,l])=>`<button class="gsb${d.int===k?' on':''}" data-gi="${k}"><i style="background:${gradCss(bsd,d.shape,k,{rep:1})}"></i><span>${l}</span></button>`).join('')}</div>
    <p class="hint">Szybkie: większość ekranu w jednym z kolorów. Średnie: złoty środek. Długie: prawie każdy punkt to mieszanka dwóch kolorów.</p>
    ${slG('rep','Powtórzenia przejścia',1,5,d.rep,'×')}<p class="hint">Ile razy cała kolejność kolorów powtarza się na obszarze aplikacji (np. 1→2→3→4→1→2→3→4).</p>`}
    <h5>RUCH KOLORÓW</h5><p class="hint">${full?'W trybie pełnego ekranu widać tylko jeden kolor, a pozostałe pokazuje ruch lub przechodzenie.':'Kierunek przesuwania się kolorów:'}</p>
    <div class="gsr gdr"><button class="gsb tx${d.slide?'':' on'}" data-gd=""><span>Wyłączony</span></button>${dirs.map(([k,l])=>`<button class="gsb tx${d.slide===k?' on':''}" data-gd="${k}"><span>${l}</span></button>`).join('')}</div>
    <label class="ck"><input type="checkbox" id="gfade" ${d.fade?'checked':''}><span class="tg"></span>Przechodzenie kolorów w miejscu (łączenia stoją, kolory płyną jeden w drugi)</label>
    ${d.fade||d.slide?slG('spd','Czas przejścia jednego koloru',1,60,d.spd,' s'):''}
    <h5>PODGLĄD</h5>${gprevHtml()}
    ${full?'':`<div class="gsr gdr cutrow"><button class="gsb tx sm${d.cut?'':' on'}" data-gcut="eq"><span>Równy podział</span></button><button class="gsb tx sm${d.cut?' on':''}" data-gcut="edit"><span>Niestandardowy podział…</span></button></div>${d.cut?`<p class="hint"><span>Linie podziału:</span> <b>${d.cut.map(v=>Math.round(v*100)+'%').join(', ')}</b></p>`:''}`}
    <div class="gap${gdDirty()?' open':''}"><button id="gap" class="seb on">Zastosuj</button><button id="gcn" class="seb">Cofnij</button></div>
    <p class="hint">Podgląd pokazuje tło oraz górny i lewy pasek (z ruchem, jeśli jest włączony). Kształt, intensywność, powtórzenia, ruch i czas działają w aplikacji po kliknięciu „Zastosuj”.</p>`:'';
  return `<h5>KOLORY MOTYWU</h5><p class="hint">Do 4 kolorów motywu. Kliknij kolor, aby edytować jego barwę, nasycenie i jasność. Kolejność zmienisz przeciągając ⠿.</p>
    <div class="tcl" id="tcl">${rows}</div>${n<4?'<button id="tcadd" class="seb">+ Dodaj kolor</button>':''}${multi}${adjHtml('bg')}`;
}
function accentHtml(){
  const st=S.settings, n=st.accs.length, cur=accGet(), a=unhex(cur)||[232,130,90];
  const rows=st.accs.map((h,i)=>{ const open=i===st.accSel;
    const body=open?`<div class="tcb"><div class="sw">${AC.map(c=>`<i data-ac="${c}" style="background:${c}"></i>`).join('')}</div>
      <label class="ck"><input type="checkbox" id="accadv" ${st.accAdv?'checked':''}><span class="tg"></span>Zaawansowane (panel RGB)</label>
      <div class="ad ${st.accAdv?'open':''}" id="accad"><div class="adi"><div id="argb">${sla('r','R — czerwony',a[0])+sla('g','G — zielony',a[1])+sla('b','B — niebieski',a[2])}<input id="ahx" value="${cur}" maxlength="7"></div></div></div></div>`:'';
    return `<div class="tci${open?' open':''}" data-l="ac" data-i="${i}"><div class="tch" data-l="ac" data-i="${i}" draggable="${n>1}"><span class="tdr" title="Przeciągnij, aby zmienić kolejność">⠿</span><i class="tcs" style="background:${hex(effAcc(h,st.accAdj))}"></i><b><span>Kolor</span> ${i+1}</b><button class="tce" data-l="ac" data-i="${i}" title="Pipeta: wybierz kolor z ekranu">${EYD_ICON}</button><button class="tcx" data-l="ac" data-i="${i}" title="Usuń kolor" ${n<2?'disabled':''}>×</button></div>${body}</div>`; }).join('');
  return `<h5>KOLOR AKCENTU</h5><p class="hint">Do 4 kolorów akcentu. Bez przechodzenia w czasie akcentem jest pierwszy kolor z listy.</p>
    <div class="tcl">${rows}</div>${n<4?'<button id="acadd" class="seb">+ Dodaj kolor</button>':''}
    ${n>1?`<label class="ck"><input type="checkbox" id="accfade" ${st.accFade?'checked':''}><span class="tg"></span>Przechodzenie kolorów akcentu w czasie</label>
    ${st.accFade?slG('accspd','Czas przejścia jednego koloru',1,120,st.accSpd,' s'):''}`:''}${adjHtml('acc')}`;
}
function themeApply(){ renderSet(); applySettings(); save(); }
// ----- zdarzenia -----
$('set').addEventListener('click',e=>{
  const t=e.target; if(!t.closest) return;
  const pe=t.closest('.tce'); if(pe){ eyedrop(pe.dataset.l,+pe.dataset.i); return; }
  const x=t.closest('.tcx'), h=t.closest('.tch'), gs=t.closest('[data-gs]'), gi=t.closest('[data-gi]'), gdr=t.closest('[data-gd]'), ar=t.closest('[data-adjr]');
  if(x){ if(x.disabled) return; const i=+x.dataset.i, s=S.settings;
    if(x.dataset.l==='ac'){ if(s.accs.length<2) return; s.accs.splice(i,1); if(s.accSel>=i&&s.accSel>0) s.accSel--; s.acc=s.accs[0]; themeApply(); }
    else { gdCommit(); if(s.bgs.length<2) return; s.bgs.splice(i,1); s.bgCut=[]; if(s.bgSel>=i&&s.bgSel>0) s.bgSel--; GD_(null); themeApply(); } }
  else if(h){ const i=+h.dataset.i, k=h.dataset.l==='ac'?'accSel':'bgSel'; if(S.settings[k]===i) return; S.settings[k]=i; renderSet(); }
  else if(t.id==='tcadd'){ gdCommit(); const s=S.settings; if(s.bgs.length>=4) return; const b=curBg(), q=rgb2hsl(b.r,b.g,b.b), nh=(q[0]+60)%360, c=q[1]<8?hsl2rgb(SW[3][0],SW[3][1],SW[3][2]):hsl2rgb(nh,Math.max(q[1],35),q[2]);
    s.bgs.push({r:c[0],g:c[1],b:c[2],hold:q[1]<8?SW[3][0]:nh,sat:50,bri:50}); s.bgSel=s.bgs.length-1; s.bgCut=[]; GD_(null); themeApply(); }
  else if(t.id==='acadd'){ const s=S.settings; if(s.accs.length>=4) return; const q=rgb2hsl(...(unhex(accGet())||[232,130,90])), c=hsl2rgb((q[0]+70)%360,Math.max(q[1],45),Math.min(Math.max(q[2],45),65));
    s.accs.push(hex(c)); s.accSel=s.accs.length-1; themeApply(); }
  else if(gs){ const d=gd(); d.shape=gs.dataset.gs; if(d.slide&&!tmSlideOk(d.shape,d.slide)) d.slide=tmDirs()[d.shape][0][0]; renderSet(); }
  else if(gi){ gd().int=gi.dataset.gi; renderSet(); }
  else if(t.closest('[data-gcut]')){ const k=t.closest('[data-gcut]').dataset.gcut; if(k==='eq'){ gd().cut=null; renderSet(); } else cutOpen(); }
  else if(gdr){ gd().slide=gdr.dataset.gd; renderSet(); }
  else if(ar){ S.settings[ar.dataset.adjr+'Adj']={bri:0,sat:0,r:0,g:0,b:0}; themeApply(); }
  else if(t.id==='gap'){ gdCommit(); themeApply(); }
  else if(t.id==='gcn'){ GD_(null); renderSet(); }
});
$('set').addEventListener('change',e=>{
  if(e.target.id==='gfade'){ gd().fade=e.target.checked; renderSet(); }
  else if(e.target.id==='accfade'){ S.settings.accFade=e.target.checked; themeApply(); }
});
$('set').addEventListener('input',e=>{ const t=e.target, g=t.dataset&&t.dataset.g; if(!g) return; const v=+t.value, b=t.closest('.sr').querySelector('b');
  if(g==='accspd'){ S.settings.accSpd=v; b.textContent=v+' s'; applySettings(); saveSoon(); }
  else { const d=gd(); d[g]=v; b.textContent=g==='rep'?v+'×':v+' s'; const gp=$('set').querySelector('.gap'); if(gp) gp.classList.toggle('open',gdDirty()); tmSync(); }
  paintSliders(); });
// zmiana kolejności kolorów (motyw: szkic do „Zastosuj”; akcent: od razu): przeciągnięcie nagłówka wiersza
(function(){
  let from=null; const clr=()=>$('set').querySelectorAll('.tci').forEach(e=>e.classList.remove('dro-t','dro-b','dragging'));
  $('set').addEventListener('dragstart',e=>{ const h=e.target.closest&&e.target.closest('.tch'); if(!h||h.getAttribute('draggable')!=='true') return; from={l:h.dataset.l,i:+h.dataset.i}; e.dataTransfer.effectAllowed='move'; try{ e.dataTransfer.setData('text/plain',String(from.i)); }catch{} h.parentNode.classList.add('dragging'); });
  $('set').addEventListener('dragover',e=>{ if(!from) return; const r=e.target.closest&&e.target.closest('.tci'); if(!r||r.dataset.l!==from.l) return; e.preventDefault(); e.dataTransfer.dropEffect='move';
    const hd=r.querySelector('.tch').getBoundingClientRect(), top=e.clientY<hd.top+hd.height/2; $('set').querySelectorAll('.tci').forEach(x=>x.classList.remove('dro-t','dro-b')); if(+r.dataset.i!==from.i) r.classList.add(top?'dro-t':'dro-b'); });
  $('set').addEventListener('drop',e=>{ if(!from) return; const r=e.target.closest&&e.target.closest('.tci'); if(!r||r.dataset.l!==from.l) return; e.preventDefault();
    const hd=r.querySelector('.tch').getBoundingClientRect(), top=e.clientY<hd.top+hd.height/2, to=+r.dataset.i, s=S.settings; clr();
    const move=ord=>{ ord.splice(ord.indexOf(from.i),1); let p=ord.indexOf(to); if(!top) p++; ord.splice(p,0,from.i); return ord; };
    if(to!==from.i){ if(from.l==='bg') move(gd().ord); else { const ord=move(s.accs.map((_,i)=>i)); s.accs=ord.map(i=>s.accs[i]); s.accSel=ord.indexOf(s.accSel); s.acc=s.accs[0]; from=null; themeApply(); return; } }
    from=null; renderSet(); });
  $('set').addEventListener('dragend',()=>{ from=null; clr(); });
})();
tmSync();

// ----- edytor niestandardowego podziału: prostokąt o proporcjach okna, linia podąża za kursorem, kliknięcie stawia ją na stałe -----
// Położenie granicy = pozycja wzdłuż przejścia (0–1): poziomo/pionowo to odległość od krawędzi, ukośnie rzut na oś przejścia (CSS „to bottom right/left”), od środka promień/promień do najdalszego rogu.
function cutT(shape,x,y,W,H){
  if(shape==='h') return y/H; if(shape==='v') return x/W;
  if(shape==='dr') return (x*H+y*W)/(2*W*H); if(shape==='dl') return ((W-x)*H+y*W)/(2*W*H);
  return Math.hypot(x-W/2,y-H/2)/Math.hypot(W/2,H/2);
}
function cutLine(shape,t,W,H,cls){   // linia stałej wartości t (izolinia), przycięta do prostokąta
  if(shape==='h') return `<line class="${cls}" x1="0" y1="${t*H}" x2="${W}" y2="${t*H}"/>`;
  if(shape==='v') return `<line class="${cls}" x1="${t*W}" y1="0" x2="${t*W}" y2="${H}"/>`;
  if(shape==='rad') return `<circle class="${cls}" cx="${W/2}" cy="${H/2}" r="${t*Math.hypot(W/2,H/2)}"/>`;
  const pts=[], add=(x,y)=>{ if(x>=-1e-6&&x<=W+1e-6&&y>=-1e-6&&y<=H+1e-6) pts.push([x,y]); };
  if(shape==='dr'){ add(0,2*t*H); add(W,(2*t-1)*H); add(2*t*W,0); add((2*t-1)*W,H); }
  else { add(0,(2*t-1)*H); add(W,2*t*H); add((1-2*t)*W,0); add(2*W*(1-t),H); }
  if(pts.length<2) return ''; let a=pts[0], b=pts[0], dm=-1; for(const p of pts) for(const q of pts){ const d=Math.hypot(p[0]-q[0],p[1]-q[1]); if(d>dm){ dm=d; a=p; b=q; } }
  return `<line class="${cls}" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`;
}
function cutOpen(){
  const d=gd(), n=d.ord.length, shape=d.shape; if(n<2||shape==='full'||$('cutm')) return;
  const need=n-1, W=Math.max(320,innerWidth), H=Math.max(240,innerHeight), bs=d.ord.map(i=>S.settings.bgs[i]), L=themeLv(bs);
  let placed=[], hov=null, rep=d.rep;
  const m=document.createElement('div'); m.id='cutm';
  m.innerHTML=`<div class="cutp"><h4>Niestandardowy podział</h4><p class="hint">Kliknij w prostokącie, aby postawić linię podziału. Linia podąża za kursorem, a podgląd pokazuje wygląd podziału w tym miejscu.</p><p class="hint" id="cuth"></p>
    <div class="sr"><span><span>Powtórzenia przejścia</span> <b id="cutrv"></b></span><div class="rg" data-k="gs"><i class="tr"></i><i class="fl"></i><input type="range" id="cutrep" min="1" max="5" step="1" value="${d.rep}"></div></div>
    <p class="hint">Granica jest ustawiana raz w obrębie jednego przejścia, a linie pokazują jej położenie w każdym powtórzeniu (np. 1/3 przejścia to 1/6 ekranu przy 2 powtórzeniach i 1/9 przy 3).</p>
    <div class="cutw"><div class="cutr" id="cutr"><svg id="cuts" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"></svg></div></div>
    <div class="gap open"><button id="cutu" class="seb">Cofnij</button><button id="cutok" class="seb on">Zatwierdź</button><button id="cutx" class="seb">Anuluj</button></div></div>`;
  document.body.appendChild(m);
  const r=m.querySelector('#cutr'), sv=m.querySelector('#cuts'), hint=m.querySelector('#cuth'), okb=m.querySelector('#cutok'), unb=m.querySelector('#cutu');
  const sc=Math.min(Math.min(innerWidth*.86,1100)/W,(innerHeight*.58)/H); r.style.width=Math.round(W*sc)+'px'; r.style.height=Math.round(H*sc)+'px';
  const lines=(t,cls)=>Array.from({length:rep},(_,k)=>cutLine(shape,(t+k)/rep,W,H,cls)).join('');   // granica w każdym powtórzeniu: (t+k)/rep wzdłuż całego przejścia
  const fill=c=>{ const a=c.slice().sort((p,q)=>p-q); const mx=a.length?a[a.length-1]:0, rem=need-a.length; for(let j=0;j<rem;j++) a.push(mx+(1-mx)*(j+1)/(rem+1)); return a.sort((p,q)=>p-q); };
  const upd=()=>{
    const cur=hov!==null&&placed.length<need?placed.concat([hov]):placed;
    r.style.background=gradCss(L(0),shape,d.int,{cut:fill(cur),rep});
    sv.innerHTML=placed.map(t=>lines(t,'cl')).join('')+(hov!==null&&placed.length<need?lines(hov,'hl'):'');
    const rv=m.querySelector('#cutrv'); rv.textContent=rep+'×'; m.querySelector('#cutrep').parentNode.style.setProperty('--v',(rep-1)/4*100);
    hint.innerHTML=placed.length<need?`<span>Pozostało linii do postawienia:</span> <b>${need-placed.length}</b>`:'<span>Wszystkie linie postawione. Zatwierdź albo cofnij ostatnią.</span>';
    okb.disabled=placed.length<need; okb.style.opacity=okb.disabled?.45:1; unb.disabled=!placed.length; unb.style.opacity=unb.disabled?.45:1; };
  const tAt=e=>{ const b=r.getBoundingClientRect(); const x=Math.min(W,Math.max(0,(e.clientX-b.left)/b.width*W)), y=Math.min(H,Math.max(0,(e.clientY-b.top)/b.height*H)); const raw=Math.min(1,Math.max(0,cutT(shape,x,y,W,H))); return Math.min(.98,Math.max(.02,(raw*rep)%1||0.02)); };   // położenie kursora → ułamek jednego przejścia (przy powtórzeniach tylko jego część ekranu)
  const close=()=>{ document.removeEventListener('keydown',kd,true); m.remove(); };
  const kd=e=>{ if(e.key==='Escape'){ e.stopPropagation(); close(); } };
  document.addEventListener('keydown',kd,true);
  r.addEventListener('mousemove',e=>{ hov=tAt(e); upd(); });
  r.addEventListener('mouseleave',()=>{ hov=null; upd(); });
  r.addEventListener('click',e=>{ if(placed.length<need){ placed.push(tAt(e)); hov=null; upd(); } });
  m.querySelector('#cutrep').addEventListener('input',e=>{ rep=d.rep=+e.target.value; upd(); });
  unb.onclick=()=>{ placed.pop(); upd(); };
  okb.onclick=()=>{ if(placed.length<need) return; d.cut=placed.slice().sort((p,q)=>p-q); close(); renderSet(); };
  m.querySelector('#cutx').onclick=close;
  m.addEventListener('mousedown',e=>{ if(e.target===m) close(); });
  upd();
}

// ===== src/js/37-eyedropper.js =====
// ---------- pipeta: wybór koloru z ekranu (v49.7) ----------
// Panel ustawień się chowa, robimy zrzut okna (oraz osobny zrzut aktywnej strony, żeby na pewno była widoczna), pokazujemy go pod kursorem z lupą, a kliknięcie zwraca kolor piksela.
const EYD_ICON='<svg viewBox="0 0 24 24"><path d="M20.71 5.63l-2.34-2.34a1 1 0 0 0-1.41 0l-3.12 3.12-1.41-1.42-1.42 1.42 1.41 1.41L3 17.25V21h3.75l8.83-8.83 1.41 1.41 1.42-1.41-1.42-1.42 3.12-3.12a1 1 0 0 0 .01-1.41zM5.21 19 5 18.79l8.58-8.58.7.7L6.71 19H5.21z"/></svg>';
const eydImg=url=>new Promise(res=>{ const i=new Image(); i.onload=()=>res(i); i.onerror=()=>res(null); i.src=url; });
async function eydShot(){   // zrzut całego okna + zrzut strony w karcie wklejony w jej prostokąt
  const cap=await window.api.screenCapture(); if(!cap) return null; const base=await eydImg(cap.url); if(!base) return null;
  const cv=document.createElement('canvas'); cv.width=base.naturalWidth; cv.height=base.naturalHeight; const g=cv.getContext('2d'); g.drawImage(base,0,0);
  try{ const t=T(), w=t&&views[t.id]; if(w&&home.style.display==='none'&&window.api.screenCaptureWc){ const r=w.getBoundingClientRect(), pc=await window.api.screenCaptureWc(w.getWebContentsId()), pi=pc&&await eydImg(pc.url);
      if(pi&&r.width>0){ const k=cv.width/innerWidth; g.drawImage(pi,Math.round(r.left*k),Math.round(r.top*k),Math.round(r.width*k),Math.round(r.height*k)); } } }catch{}
  return cv;
}
function pickScreenColor(){
  return new Promise(async res=>{
    if(!window.api||!window.api.screenCapture){ res(null); return; }
    try{ if(typeof DLOPEN!=='undefined'&&DLOPEN) dlToggle(false); }catch{}
    const set=$('set'), was=set.classList.contains('open'); set.classList.remove('open');
    await new Promise(r=>setTimeout(r,380));   // czekamy, aż panel ustawień zjedzie z ekranu
    const cv=await eydShot(), restore=hexv=>{ if(was) set.classList.add('open'); res(hexv||null); };
    if(!cv){ restore(null); return; }
    const g=cv.getContext('2d',{willReadFrequently:true}), o=document.createElement('div'); o.id='eyd';
    o.innerHTML='<div id="eydb"></div><div id="eydl"><canvas width="132" height="132"></canvas><i></i></div><div id="eydh"></div>'; document.body.appendChild(o);
    o.firstChild.textContent=t('Najedź na wybrany kolor i kliknij, aby go skopiować. Esc — anuluj.');
    o.style.backgroundImage='url("'+cv.toDataURL('image/png')+'")';
    const lc=o.querySelector('canvas').getContext('2d'), lens=o.querySelector('#eydl'), lab=o.querySelector('#eydh'); let cur=null;
    const at=e=>{ const k=cv.width/innerWidth, sx=Math.min(cv.width-1,Math.max(0,Math.floor(e.clientX*k))), sy=Math.min(cv.height-1,Math.max(0,Math.floor(e.clientY*k))), d=g.getImageData(sx,sy,1,1).data; return {sx,sy,hex:hex([d[0],d[1],d[2]])}; };
    const move=e=>{ const p=at(e); cur=p.hex; lens.style.display=lab.style.display='block'; lens.style.left=(e.clientX-66)+'px'; lens.style.top=(e.clientY-66)+'px'; lab.style.left=(e.clientX-40)+'px'; lab.style.top=(e.clientY+74)+'px';
      lc.imageSmoothingEnabled=false; lc.clearRect(0,0,132,132); lc.drawImage(cv,p.sx-5,p.sy-5,11,11,0,0,132,132);   // 11×11 pikseli powiększone 12×
      lc.strokeStyle='#000'; lc.lineWidth=3; lc.strokeRect(60,60,12,12); lc.strokeStyle='#fff'; lc.lineWidth=1.5; lc.strokeRect(60,60,12,12);
      lab.textContent=p.hex; lab.style.background=p.hex; const q=unhex(p.hex); lab.style.color=(0.2126*q[0]+0.7152*q[1]+0.0722*q[2])/255>.55?'#000':'#fff'; };
    const done=hv=>{ document.removeEventListener('keydown',kd,true); o.remove(); restore(hv); };
    const kd=e=>{ if(e.key==='Escape'){ e.preventDefault(); e.stopPropagation(); done(null); } };
    document.addEventListener('keydown',kd,true);
    o.addEventListener('mousemove',move); o.addEventListener('click',e=>{ move(e); done(cur); }); o.addEventListener('contextmenu',e=>{ e.preventDefault(); done(null); });
  });
}
// pipeta dla koloru z listy motywu (l='bg') lub akcentu (l='ac'): ustawia RGB, odcień oraz neutralne nasycenie/jasność, wraca do ustawień
async function eyedrop(l,i){
  const s=S.settings; if(l==='ac') s.accSel=i; else s.bgSel=i;
  const h=await pickScreenColor();
  if(h){ const c=unhex(h);
    if(l==='ac'){ accSet(h); }
    else { const b=curBg(); [b.r,b.g,b.b]=c; b.sat=50; b.bri=50; holdHue(); } }
  renderSet(); if(h){ applySettings(); save(); }
}
