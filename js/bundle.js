// PLIK GENEROWANY przez tools/bundle.js z src/js/*.js (rdzeń) - nie edytuj go ręcznie.
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
const LROWS=[["Strona startowa","Home page","Startseite","Página de inicio","Page d’accueil","דף הבית","首頁","Sztartowo zajta"],["Wstecz","Back","Zurück","Atrás","Retour","חזרה","上一頁","Nazod"],["Dalej","Forward","Vor","Adelante","Avancer","קדימה","下一頁","Dalij"],["Odśwież","Reload","Neu laden","Recargar","Actualiser","רענן","重新整理","Ôdświyż"],["Zapytaj asystenta lub wpisz adres…","Ask the assistant or enter an address...","Assistenten fragen oder Adresse eingeben...","Pregunta al asistente o escribe una dirección...","Demandez à l’assistant ou saisissez une adresse...","שאל את העוזר או הקלד כתובת...","詢問助理或輸入網址...","Spytej asystynta abo wpisz adres..."],["Minimalizuj","Minimize","Minimieren","Minimizar","Réduire","מזער","最小化","Zminimalizuj"],["Maksymalizuj","Maximize","Maximieren","Maximizar","Agrandir","הגדל","最大化","Zmaksymalizuj"],["Zamknij","Close","Schließen","Cerrar","Fermer","סגור","關閉","Zawrzij"],["Nowa karta","New tab","Neuer Tab","Nueva pestaña","Nouvel onglet","כרטיסייה חדשה","新分頁","Nowo karta"],["Tutaj dzieje się Magia","This is where the Magic happens","Hier geschieht die Magie","Aquí es donde ocurre la Magia","C’est ici que la Magie opère","כאן קורה הקסם","魔法，就在這裡發生","Tukej sie dzieje Magijo"],["O co chcesz zapytać?","What do you want to ask?","Was möchtest du fragen?","¿Qué quieres preguntar?","Que voulez-vous demander ?","מה תרצה לשאול?","你想問什麼？","Ô co chcesz spytać?"],["Zaloguj się raz, naciśnij Enter, by wysłać","Sign in once, press Enter to send","Einmal anmelden, zum Senden Enter drücken","Inicia sesión una vez y pulsa Intro para enviar","Connectez-vous une fois, Entrée pour envoyer","התחבר פעם אחת, לחץ Enter כדי לשלוח","登入一次後，按 Enter 傳送","Zaloguj sia roz, wciś Enter, coby posłać"],["Zamknij panel","Close panel","Panel schließen","Cerrar panel","Fermer le panneau","סגור לוח","關閉面板","Zawrzij panel"],["Foldery","Folders","Ordner","Carpetas","Dossiers","תיקיות","資料夾","Foldery"],["Nowy folder","New folder","Neuer Ordner","Nueva carpeta","Nouveau dossier","תיקייה חדשה","新資料夾","Nowy folder"],["Usuń folder","Delete folder","Ordner löschen","Eliminar carpeta","Supprimer le dossier","מחק תיקייה","刪除資料夾","Skasuj folder"],["Ustawienia","Settings","Einstellungen","Ajustes","Paramètres","הגדרות","設定","Ustawiynia"],["Panel asystenta","Assistant panel","Assistenten-Panel","Panel del asistente","Panneau de l’assistant","חלונית העוזר","助理面板","Panel asystynta"],["Duplikuj kartę","Duplicate tab","Tab duplizieren","Duplicar pestaña","Dupliquer l’onglet","שכפל כרטיסייה","複製分頁","Zduplikuj karta"],["Odśwież kartę","Reload tab","Tab neu laden","Recargar pestaña","Actualiser l’onglet","רענן כרטיסייה","重新整理分頁","Ôdświyż karta"],["Przypnij kartę","Pin tab","Tab anheften","Fijar pestaña","Épingler l’onglet","הצמד כרטיסייה","釘選分頁","Przipnij karta"],["Odepnij kartę","Unpin tab","Tab lösen","Desfijar pestaña","Désépingler l’onglet","בטל הצמדת כרטיסייה","取消釘選分頁","Ôdpnij karta"],["Wycisz kartę","Mute tab","Tab stummschalten","Silenciar pestaña","Couper le son de l’onglet","השתק כרטיסייה","將分頁靜音","Wycisz karta"],["Włącz dźwięk karty","Unmute tab","Tab-Ton einschalten","Activar sonido de la pestaña","Réactiver le son de l’onglet","בטל השתקת כרטיסייה","取消分頁靜音","Włōncz dźwiyk karty"],["Zamknij kartę","Close tab","Tab schließen","Cerrar pestaña","Fermer l’onglet","סגור כרטיסייה","關閉分頁","Zawrzij karta"],["Przywróć zamkniętą kartę","Reopen closed tab","Geschlossenen Tab wiederherstellen","Reabrir pestaña cerrada","Rouvrir l’onglet fermé","שחזר כרטיסייה שנסגרה","重新開啟已關閉的分頁","Przywrōć zawartõ karta"],["Zamknij wszystkie karty","Close all tabs","Alle Tabs schließen","Cerrar todas las pestañas","Fermer tous les onglets","סגור את כל הכרטיסיות","關閉所有分頁","Zawrzij wszystkie karty"],["Odśwież wszystkie karty","Reload all tabs","Alle Tabs neu laden","Recargar todas las pestañas","Actualiser tous les onglets","רענן את כל הכרטיסיות","重新整理所有分頁","Ôdświyż wszystkie karty"],["Przypnij wszystkie karty","Pin all tabs","Alle Tabs anheften","Fijar todas las pestañas","Épingler tous les onglets","הצמד את כל הכרטיסיות","釘選所有分頁","Przipnij wszystkie karty"],["Odepnij wszystkie karty","Unpin all tabs","Alle Tabs lösen","Desfijar todas las pestañas","Désépingler tous les onglets","בטל הצמדת כל הכרטיסיות","取消釘選所有分頁","Ôdpnij wszystkie karty"],["Wycisz wszystkie karty","Mute all tabs","Alle Tabs stummschalten","Silenciar todas las pestañas","Couper le son de tous les onglets","השתק את כל הכרטיסיות","將所有分頁靜音","Wycisz wszystkie karty"],["Włącz dźwięk wszystkich kart","Unmute all tabs","Ton aller Tabs einschalten","Activar sonido de todas las pestañas","Réactiver le son de tous les onglets","בטל השתקת כל הכרטיסיות","取消所有分頁靜音","Włōncz dźwiyk wszystkich kart"],["Zmień ikonę","Change icon","Symbol ändern","Cambiar icono","Changer l’icône","שנה סמל","變更圖示","Zmiyń ikōna"],["Zmień nazwę","Rename","Umbenennen","Renombrar","Renommer","שנה שם","重新命名","Zmiyń miano"],["Duplikuj folder","Duplicate folder","Ordner duplizieren","Duplicar carpeta","Dupliquer le dossier","שכפל תיקייה","複製資料夾","Zduplikuj folder"],["własna ikona + Enter","custom icon + Enter","eigenes Symbol + Enter","icono propio + Intro","icône perso + Entrée","סמל מותאם + Enter","自訂圖示 + Enter","włosno ikōna + Enter"],["Anuluj","Cancel","Abbrechen","Cancelar","Annuler","ביטול","取消","Anuluj"],["Usuń","Delete","Löschen","Eliminar","Supprimer","מחק","刪除","Skasuj"],["Przywróć","Restore","Wiederherstellen","Restaurar","Restaurer","שחזר","還原","Przywrōć"],["Przypisz tutaj","Assign here","Hier zuweisen","Asignar aquí","Assigner ici","הקצה כאן","在此指派","Przipisz tu"],["Rozumiem","Got it","Verstanden","Entendido","Compris","הבנתי","知道了","Rozumia"],["Usunąć folder „{n}”?","Delete folder “{n}”?","Ordner „{n}“ löschen?","¿Eliminar la carpeta «{n}»?","Supprimer le dossier « {n} » ?","למחוק את התיקייה “{n}”?","要刪除資料夾「{n}」嗎？","Skasować folder „{n}”?"],["Wszystkie karty z tego folderu ({n}) zostaną zamknięte. Tej operacji nie można cofnąć.","All tabs in this folder ({n}) will be closed. This cannot be undone.","Alle Tabs in diesem Ordner ({n}) werden geschlossen. Das lässt sich nicht rückgängig machen.","Se cerrarán todas las pestañas de esta carpeta ({n}). No se puede deshacer.","Tous les onglets de ce dossier ({n}) seront fermés. Cette action est irréversible.","כל הכרטיסיות בתיקייה זו ({n}) ייסגרו. לא ניתן לבטל פעולה זו.","此資料夾中的所有分頁（{n}）都會被關閉，且無法復原。","Wszystkie karty we tym foldrze ({n}) bydōm zawarte. Tego niy idzie cofnōńć."],["Przywrócić ustawienia domyślne?","Restore default settings?","Standardeinstellungen wiederherstellen?","¿Restaurar los ajustes predeterminados?","Rétablir les paramètres par défaut ?","לשחזר את הגדרות ברירת המחדל?","要還原預設設定嗎？","Przywrōcić ustawiynia dômyślne?"],["Wszystkie ustawienia (motyw, interfejs, aplikacje, historia i skróty) wrócą do wartości fabrycznych. Karty i foldery zostaną bez zmian.","All settings (theme, interface, apps, history and shortcuts) will return to factory values. Tabs and folders stay untouched.","Alle Einstellungen (Motiv, Oberfläche, Apps, Verlauf und Kürzel) werden zurückgesetzt. Tabs und Ordner bleiben unverändert.","Todos los ajustes (tema, interfaz, aplicaciones, historial y atajos) volverán a los valores de fábrica. Las pestañas y carpetas no cambian.","Tous les réglages (thème, interface, applications, historique et raccourcis) reviendront aux valeurs d’usine. Onglets et dossiers restent inchangés.","כל ההגדרות (ערכת נושא, ממשק, אפליקציות, היסטוריה וקיצורים) יחזרו לערכי היצרן. הכרטיסיות והתיקיות יישארו ללא שינוי.","所有設定（主題、介面、應用程式、歷史記錄與快速鍵）將恢復為原廠值，分頁與資料夾不會受到影響。","Wszyskie ustawiynia (motyw, interfejs, aplikacyje, historyjŏ i skrōty) wrōcōm do fabrycznych wartości. Karty i foldery ostanōm bez zmian."],["Przywrócić domyślne skróty?","Restore default shortcuts?","Standard-Tastenkürzel wiederherstellen?","¿Restaurar los atajos predeterminados?","Rétablir les raccourcis par défaut ?","לשחזר את קיצורי ברירת המחדל?","要還原預設快速鍵嗎？","Przywrōcić dômyślne skrōty?"],["Wszystkie skróty klawiszowe wrócą do ustawień fabrycznych.","All keyboard shortcuts will return to factory settings.","Alle Tastenkürzel werden zurückgesetzt.","Todos los atajos de teclado volverán a los valores de fábrica.","Tous les raccourcis clavier reviendront aux réglages d’usine.","כל קיצורי המקלדת יחזרו להגדרות היצרן.","所有鍵盤快速鍵都會恢復為原廠設定。","Wszyjske skrōty klawiatury wrōcōm do ustawiyń fabrycznych."],["Ta kombinacja jest zarezerwowana","This combination is reserved","Diese Kombination ist reserviert","Esta combinación está reservada","Cette combinaison est réservée","שילוב זה שמור","此組合鍵已被保留","Ta kombinacyjŏ je zarezerwowano"],["{k} służy do kopiowania, wklejania i cofania w polach tekstowych. Wybierz inną kombinację.","{k} is used for copy, paste and undo in text fields. Choose a different combination.","{k} wird zum Kopieren, Einfügen und Rückgängigmachen in Textfeldern verwendet. Wähle eine andere Kombination.","{k} se usa para copiar, pegar y deshacer en los campos de texto. Elige otra combinación.","{k} sert à copier, coller et annuler dans les champs de texte. Choisissez une autre combinaison.","{k} משמש להעתקה, הדבקה וביטול בשדות טקסט. בחר שילוב אחר.","{k} 用於文字欄位中的複製、貼上與復原，請選擇其他組合。","{k} służy do kopiowaniŏ, wklejaniŏ i cofaniŏ w polach tekstu. Wybier inkszõ kombinacyjõ."],["{k} to AltGr+{x}, czyli polskie znaki. Wybierz inną kombinację.","{k} is AltGr+{x}, which types special characters. Choose a different combination.","{k} ist AltGr+{x} und erzeugt Sonderzeichen. Wähle eine andere Kombination.","{k} es AltGr+{x}, que escribe caracteres especiales. Elige otra combinación.","{k} correspond à AltGr+{x} et produit des caractères spéciaux. Choisissez une autre combinaison.","{k} הוא AltGr+{x}, כלומר תווים מיוחדים. בחר שילוב אחר.","{k} 是 AltGr+{x}，用於輸入特殊字元，請選擇其他組合。","{k} to AltGr+{x}, czyli polske znaki. Wybier inkszõ kombinacyjõ."],["Ten skrót jest już używany","This shortcut is already in use","Dieses Kürzel wird bereits verwendet","Este atajo ya está en uso","Ce raccourci est déjà utilisé","קיצור זה כבר בשימוש","此快速鍵已被使用","Ten skrōt je już używany"],["Kombinacja {k} jest przypisana do opcji „{a}”. Przypisanie jej tutaj usunie ją z tamtej opcji.","The combination {k} is assigned to “{a}”. Assigning it here will remove it from there.","Die Kombination {k} ist „{a}“ zugewiesen. Eine Zuweisung hier entfernt sie dort.","La combinación {k} está asignada a «{a}». Asignarla aquí la quitará de allí.","La combinaison {k} est assignée à « {a} ». L’assigner ici la retirera de là-bas.","השילוב {k} מוקצה ל“{a}”. הקצאתו כאן תסיר אותו משם.","組合鍵 {k} 已指派給「{a}」，在此指派會將它從原功能移除。","Kombinacyjŏ {k} je przipisano do „{a}”. Jak jã tukej przipiszesz, to ôdpadnie stōnd."],["⚙ Ustawienia","⚙ Settings","⚙ Einstellungen","⚙ Ajustes","⚙ Paramètres","⚙ הגדרות","⚙ 設定","⚙ Ustawiynia"],["Motyw","Theme","Design","Tema","Thème","ערכת נושא","主題","Motyw"],["Interfejs","Interface","Oberfläche","Interfaz","Interface","ממשק","介面","Interfejs"],["Skróty","Shortcuts","Kürzel","Atajos","Raccourcis","קיצורים","快速鍵","Skrōty"],["Kolor tła","Background color","Hintergrundfarbe","Color de fondo","Couleur de fond","צבע רקע","背景顏色","Farba tła"],["Nasycenie","Saturation","Sättigung","Saturación","Saturation","רוויה","飽和度","Nasycyniy"],["Jasność","Brightness","Helligkeit","Brillo","Luminosité","בהירות","亮度","Jasność"],["Zaawansowane (panel RGB)","Advanced (RGB panel)","Erweitert (RGB-Regler)","Avanzado (panel RGB)","Avancé (panneau RVB)","מתקדם (לוח RGB)","進階（RGB 面板）","Zaawansowane (panel RGB)"],["R — czerwony","R — red","R — Rot","R — rojo","R — rouge","R — אדום","R — 紅","R — czerwōny"],["G — zielony","G — green","G — Grün","G — verde","V — vert","G — ירוק","G — 綠","G — zielōny"],["B — niebieski","B — blue","B — Blau","B — azul","B — bleu","B — כחול","B — 藍","B — niebieski"],["Każdy suwak działa niezależnie. Nasycenie i jasność są korektą nałożoną na kolor z RGB.","Every slider works independently. Saturation and brightness are corrections applied on top of the RGB color.","Jeder Regler arbeitet unabhängig. Sättigung und Helligkeit sind Korrekturen auf der RGB-Farbe.","Cada control funciona de forma independiente. Saturación y brillo son correcciones sobre el color RGB.","Chaque curseur est indépendant. Saturation et luminosité sont des corrections appliquées à la couleur RVB.","כל מחוון פועל בנפרד. רוויה ובהירות הן תיקון המופעל על צבע ה-RGB.","每個滑桿皆獨立運作。飽和度與亮度是疊加在 RGB 顏色上的修正。","Kożdy suwak robi ôsobno. Nasycyniy i jasność to poprawka na farbie z RGB."],["Kolor akcentu","Accent color","Akzentfarbe","Color de acento","Couleur d’accent","צבע הדגשה","強調色","Farba akcyntu"],["Efekty tła","Background effects","Hintergrundeffekte","Efectos de fondo","Effets d’arrière-plan","אפקטי רקע","背景效果","Efekty tła"],["Wszystkie efekty","All effects","Alle Effekte","Todos los efectos","Tous les effets","כל האפקטים","所有效果","Wszystkie efekty"],["Świecący pył","Glowing dust","Leuchtender Staub","Polvo luminoso","Poussière lumineuse","אבק זוהר","發光塵埃","Świycōncy pył"],["Fale","Waves","Wellen","Olas","Vagues","גלים","波浪","Fale"],["Migoczące gwiazdy","Twinkling stars","Funkelnde Sterne","Estrellas parpadeantes","Étoiles scintillantes","כוכבים נוצצים","閃爍的星星","Migotajōnce gwiozdy"],["Zorza","Aurora","Polarlicht","Aurora","Aurore","זוהר קוטבי","極光","Zorza"],["Deszcz światła","Rain of light","Lichtregen","Lluvia de luz","Pluie de lumière","גשם של אור","光雨","Dyszcz świotła"],["Obraz tła","Background image","Hintergrundbild","Imagen de fondo","Image de fond","תמונת רקע","背景圖片","Ôbrŏz tła"],["Wybierz obraz…","Choose image…","Bild wählen…","Elegir imagen…","Choisir une image…","בחר תמונה…","選擇圖片…","Wybier ôbrŏz…"],["Usuń obraz","Remove image","Bild entfernen","Quitar imagen","Retirer l’image","הסר תמונה","移除圖片","Skasuj ôbrŏz"],["Krycie obrazu","Image opacity","Bilddeckkraft","Opacidad de la imagen","Opacité de l’image","אטימות התמונה","圖片不透明度","Kryciy ôbrŏzu"],["Rozmycie","Blur","Weichzeichnung","Desenfoque","Flou","טשטוש","模糊","Rozmazaniy"],["Przyciemnienie","Dimming","Abdunkelung","Oscurecimiento","Assombrissement","הכהיה","變暗","Przyciymnianiy"],["Nasycenie obrazu","Image saturation","Bildsättigung","Saturación de la imagen","Saturation de l’image","רוויית התמונה","圖片飽和度","Nasycyniy ôbrŏzu"],["Dopasowanie","Fit","Anpassung","Ajuste","Ajustement","התאמה","符合方式","Dopasowaniy"],["Wypełnij","Fill","Füllen","Rellenar","Remplir","מלא","填滿","Wypełnij"],["Dopasuj","Contain","Einpassen","Contener","Contenir","התאם","適應","Dopasuj"],["Konfiguracja","Configuration","Konfiguration","Configuración","Configuration","תצורה","設定檔","Kōnfiguracyjŏ"],["Zapisz do pliku…","Save to file…","In Datei speichern…","Guardar en archivo…","Enregistrer dans un fichier…","שמור לקובץ…","儲存至檔案…","Zapisz do plika…"],["Wczytaj z pliku…","Load from file…","Aus Datei laden…","Cargar desde archivo…","Charger depuis un fichier…","טען מקובץ…","從檔案載入…","Wczytej z plika…"],["Domyślne","Defaults","Standard","Predeterminado","Par défaut","ברירות מחדל","預設值","Dômyślne"],["Anulowano.","Cancelled.","Abgebrochen.","Cancelado.","Annulé.","בוטל.","已取消。","Anulowano."],["Zapisano:","Saved:","Gespeichert:","Guardado:","Enregistré :","נשמר:","已儲存：","Zapisano:"],["Wczytano konfigurację ✓","Configuration loaded ✓","Konfiguration geladen ✓","Configuración cargada ✓","Configuration chargée ✓","התצורה נטענה ✓","已載入設定 ✓","Wczytano kōnfiguracyjõ ✓"],["Nie udało się wczytać pliku konfiguracji.","Could not load the configuration file.","Konfigurationsdatei konnte nicht geladen werden.","No se pudo cargar el archivo de configuración.","Impossible de charger le fichier de configuration.","לא ניתן היה לטעון את קובץ התצורה.","無法載入設定檔。","Niy szło wczytać plika kōnfiguracyji."],["Brak obsługi – podmień main.js i preload.js na nowe.","Not supported – replace main.js and preload.js with the new ones.","Nicht unterstützt – ersetze main.js und preload.js durch die neuen.","No compatible: sustituye main.js y preload.js por los nuevos.","Non pris en charge : remplacez main.js et preload.js par les nouveaux.","לא נתמך – החלף את main.js ו-preload.js בחדשים.","不支援 — 請將 main.js 與 preload.js 換成新版。","Niy ôbsłōgiwane – podmiyń main.js i preload.js na nowe."],["Zapisz konfigurację","Save configuration","Konfiguration speichern","Guardar configuración","Enregistrer la configuration","שמור תצורה","儲存設定","Zapisz kōnfiguracyjõ"],["Wczytaj konfigurację","Load configuration","Konfiguration laden","Cargar configuración","Charger la configuration","טען תצורה","載入設定","Wczytej kōnfiguracyjõ"],["Kliknij skrót i naciśnij nową kombinację (do 4 klawiszy naraz). Wymagany jest Ctrl lub Alt albo klawisz F1–F12. Esc anuluje.","Click a shortcut and press a new combination (up to 4 keys at once). Ctrl or Alt, or an F1–F12 key, is required. Esc cancels.","Klicke auf ein Kürzel und drücke eine neue Kombination (bis zu 4 Tasten gleichzeitig). Ctrl oder Alt oder eine F1–F12-Taste ist erforderlich. Esc bricht ab.","Haz clic en un atajo y pulsa una nueva combinación (hasta 4 teclas a la vez). Se requiere Ctrl o Alt, o una tecla F1–F12. Esc cancela.","Cliquez sur un raccourci et appuyez sur une nouvelle combinaison (jusqu’à 4 touches). Ctrl ou Alt, ou une touche F1–F12, est requis. Échap annule.","לחץ על קיצור והקש שילוב חדש (עד 4 מקשים בו-זמנית). נדרש Ctrl או Alt, או מקש F1–F12. Esc מבטל.","點選快速鍵後按下新的組合（最多同時 4 個按鍵）。必須包含 Ctrl 或 Alt，或使用 F1–F12 鍵。按 Esc 取消。","Kliknij skrōt i wciś nowõ kombinacyjõ (do 4 klawiszy naroz). Trza Ctrl abo Alt, abo klawisz F1–F12. Esc anuluje."],["Karty","Tabs","Tabs","Pestañas","Onglets","כרטיסיות","分頁","Karty"],["Wszystkie karty","All tabs","Alle Tabs","Todas las pestañas","Tous les onglets","כל הכרטיסיות","所有分頁","Wszystkie karty"],["Nawigacja","Navigation","Navigation","Navegación","Navigation","ניווט","導覽","Nawigacyjŏ"],["Przypnij / odepnij kartę","Pin / unpin tab","Tab anheften / lösen","Fijar / desfijar pestaña","Épingler / désépingler l’onglet","הצמד / בטל הצמדת כרטיסייה","釘選／取消釘選分頁","Przipnij / ôdpnij karta"],["Wycisz / włącz dźwięk karty","Mute / unmute tab","Tab stummschalten / Ton an","Silenciar / activar sonido de la pestaña","Couper / réactiver le son de l’onglet","השתק / בטל השתקת כרטיסייה","分頁靜音／取消靜音","Wycisz / włōncz dźwiyk karty"],["Przypnij / odepnij wszystkie","Pin / unpin all","Alle anheften / lösen","Fijar / desfijar todas","Épingler / désépingler tous","הצמד / בטל הצמדת הכל","全部釘選／取消釘選","Przipnij / ôdpnij wszystkie"],["Wycisz / włącz dźwięk wszystkich","Mute / unmute all","Alle stummschalten / Ton an","Silenciar / activar sonido de todas","Couper / réactiver le son de tous","השתק / בטל השתקת הכל","全部靜音／取消靜音","Wycisz / włōncz dźwiyk wszystkich"],["Następna karta","Next tab","Nächster Tab","Pestaña siguiente","Onglet suivant","הכרטיסייה הבאה","下一個分頁","Nastympno karta"],["Poprzednia karta","Previous tab","Vorheriger Tab","Pestaña anterior","Onglet précédent","הכרטיסייה הקודמת","上一個分頁","Piyrwyjszo karta"],["Pasek adresu","Address bar","Adressleiste","Barra de direcciones","Barre d’adresse","שורת כתובת","網址列","Pasek adresu"],["Duplikuj bieżący folder","Duplicate current folder","Aktuellen Ordner duplizieren","Duplicar carpeta actual","Dupliquer le dossier actuel","שכפל את התיקייה הנוכחית","複製目前資料夾","Zduplikuj terŏzniejszy folder"],["Zmień nazwę bieżącego folderu","Rename current folder","Aktuellen Ordner umbenennen","Renombrar carpeta actual","Renommer le dossier actuel","שנה שם של התיקייה הנוכחית","重新命名目前資料夾","Zmiyń miano terŏzniejszego foldra"],["Następny folder","Next folder","Nächster Ordner","Carpeta siguiente","Dossier suivant","התיקייה הבאה","下一個資料夾","Nastympny folder"],["Poprzedni folder","Previous folder","Vorheriger Ordner","Carpeta anterior","Dossier précédent","התיקייה הקודמת","上一個資料夾","Piyrwyjszy folder"],["Narzędzia deweloperskie","Developer tools","Entwicklertools","Herramientas de desarrollo","Outils de développement","כלי פיתוח","開發人員工具","Nŏrzyndzia deweloperske"],["Naciśnij klawisze…","Press keys…","Tasten drücken…","Pulsa las teclas…","Appuyez sur les touches…","הקש על מקשים…","請按下按鍵…","Wciś klawisze…"],["brak","none","keins","ninguno","aucun","אין","無","niy ma"],["Usuń skrót","Remove shortcut","Kürzel entfernen","Quitar atajo","Supprimer le raccourci","הסר קיצור","移除快速鍵","Skasuj skrōt"],["Przywróć domyślne skróty","Restore default shortcuts","Standard-Kürzel wiederherstellen","Restaurar atajos predeterminados","Rétablir les raccourcis par défaut","שחזר קיצורי ברירת מחדל","還原預設快速鍵","Przywrōć dômyślne skrōty"],["Maksymalnie 4 klawisze naraz.","Maximum 4 keys at once.","Höchstens 4 Tasten gleichzeitig.","Máximo 4 teclas a la vez.","4 touches maximum à la fois.","עד 4 מקשים בו-זמנית.","最多同時 4 個按鍵。","Maksymalnie 4 klawisze naroz."],["Skrót musi zawierać klawisz z Ctrl lub Alt (albo F1–F12).","A shortcut must include a key with Ctrl or Alt (or F1–F12).","Ein Kürzel muss eine Taste mit Ctrl oder Alt enthalten (oder F1–F12).","Un atajo debe incluir una tecla con Ctrl o Alt (o F1–F12).","Un raccourci doit comporter une touche avec Ctrl ou Alt (ou F1–F12).","הקיצור חייב לכלול מקש עם Ctrl או Alt (או F1–F12).","快速鍵必須包含 Ctrl 或 Alt（或使用 F1–F12）。","Skrōt musi mieć klawisz z Ctrl abo Alt (abo F1–F12)."],["Przyciski okna","Window buttons","Fensterschaltflächen","Botones de ventana","Boutons de fenêtre","כפתורי חלון","視窗按鈕","Przyciski ôkna"],["Minimalizuj, maksymalizuj, zamknij","Minimize, maximize, close","Minimieren, Maximieren, Schließen","Minimizar, maximizar, cerrar","Réduire, agrandir, fermer","מזער, הגדל, סגור","最小化、最大化、關閉","Zminimalizuj, zmaksymalizuj, zawrzij"],["Przyciski nawigacji","Navigation buttons","Navigationsschaltflächen","Botones de navegación","Boutons de navigation","כפתורי ניווט","導覽按鈕","Przyciski nawigacyji"],["Strzałki, odświeżanie i napis Arkana","Arrows, reload and the Arkana title","Pfeile, Neu laden und der Arkana-Schriftzug","Flechas, recargar y el título Arkana","Flèches, actualisation et titre Arkana","חצים, רענון וכיתוב Arkana","箭頭、重新整理與 Arkana 標題","Strzołki, ôdświyżaniy i napis Arkana"],["Prosty","Simple","Einfach","Sencillo","Simple","פשוט","簡單","Prosty"],["Rozbudowany","Fancy","Aufwendig","Elaborado","Élaboré","מורחב","華麗","Rozbudowany"],["Animacje","Animations","Animationen","Animaciones","Animations","אנימציות","動畫","Animacyje"],["Wyłącz animacje osobno dla każdego miejsca.","Turn animations off separately for each area.","Animationen für jeden Bereich einzeln ausschalten.","Desactiva las animaciones por separado en cada zona.","Désactivez les animations séparément pour chaque zone.","כבה אנימציות בנפרד לכל אזור.","可分別關閉各區域的動畫。","Wyłōncz animacyje ôsobno dlŏ kożdego placu."],["Przyciski","Buttons","Schaltflächen","Botones","Boutons","כפתורים","按鈕","Przyciski"],["Język","Language","Sprache","Idioma","Langue","שפה","語言","Godka"],["Zmiana języka odświeża interfejs.","Changing the language reloads the interface.","Ein Sprachwechsel lädt die Oberfläche neu.","Cambiar el idioma recarga la interfaz.","Changer de langue recharge l’interface.","שינוי השפה מרענן את הממשק.","變更語言會重新載入介面。","Zmiana godki ôdświyży interfejs."],["Praca","Work","Arbeit","Trabajo","Travail","עבודה","工作","Robota"],["Prywatne","Personal","Privat","Personal","Perso","אישי","個人","Prywatne"],["kopia","copy","Kopie","copia","copie","עותק","複本","kopijŏ"],["Folder","Folder","Ordner","Carpeta","Dossier","תיקייה","資料夾","Folder"],["Aplikacje","Apps","Apps","Aplicaciones","Applications","אפליקציות","應用程式","Aplikacyje"],["Pasek aplikacji","App bar","App-Leiste","Barra de aplicaciones","Barre d’applications","סרגל אפליקציות","應用程式列","Pasek aplikacyji"],["Dodane do paska","Added to the bar","Zur Leiste hinzugefügt","Añadidas a la barra","Ajoutées à la barre","נוספו לסרגל","已加入列中","Dodane do paska"],["Dostępne aplikacje","Available apps","Verfügbare Apps","Aplicaciones disponibles","Applications disponibles","אפליקציות זמינות","可用的應用程式","Dostympne aplikacyje"],["Brak aplikacji na pasku.","No apps on the bar.","Keine Apps in der Leiste.","No hay aplicaciones en la barra.","Aucune application dans la barre.","אין אפליקציות בסרגל.","列中沒有應用程式。","Niy ma aplikacyji na pasku."],["Aplikacje możesz dodać w ustawieniach, w sekcji Aplikacje.","You can add apps in Settings, in the Apps section.","Apps kannst du in den Einstellungen im Bereich Apps hinzufügen.","Puedes añadir aplicaciones en Ajustes, en la sección Aplicaciones.","Vous pouvez ajouter des applications dans Paramètres, section Applications.","ניתן להוסיף אפליקציות בהגדרות, בסעיף אפליקציות.","你可以在設定的「應用程式」區塊中新增應用程式。","Aplikacyje idzie dodać w ustawiyniach, w czyńści Aplikacyje."],["Otwórz ustawienia","Open settings","Einstellungen öffnen","Abrir ajustes","Ouvrir les paramètres","פתח הגדרות","開啟設定","Ôtwōrz ustawiynia"],["Kliknij aplikację poniżej, aby ją dodać.","Click an app below to add it.","Klicke unten auf eine App, um sie hinzuzufügen.","Haz clic en una aplicación de abajo para añadirla.","Cliquez sur une application ci-dessous pour l’ajouter.","לחץ על אפליקציה למטה כדי להוסיף אותה.","點選下方的應用程式即可新增。","Kliknij aplikacyjõ na dole, coby jã dodać."],["Wszystkie aplikacje są już na pasku.","All apps are already on the bar.","Alle Apps sind bereits in der Leiste.","Todas las aplicaciones ya están en la barra.","Toutes les applications sont déjà dans la barre.","כל האפליקציות כבר בסרגל.","所有應用程式都已在列中。","Wszystkie aplikacyje już sōm na pasku."],["＋ Dodaj","＋ Add","＋ Hinzufügen","＋ Añadir","＋ Ajouter","＋ הוסף","＋ 新增","＋ Dodej"],["− Usuń","− Remove","− Entfernen","− Quitar","− Retirer","− הסר","− 移除","− Skasuj"],["wkrótce","soon","bald","pronto","bientôt","בקרוב","即將推出","wnet"],["Zamknij aplikację","Close app","App schließen","Cerrar aplicación","Fermer l’application","סגור אפליקציה","關閉應用程式","Zawrzij aplikacyjõ"],["Okno testowe","Test window","Testfenster","Ventana de prueba","Fenêtre de test","חלון בדיקה","測試視窗","Ôkno testowe"],["Puste okno do sprawdzenia logiki aplikacji","Empty window for testing app logic","Leeres Fenster zum Testen der App-Logik","Ventana vacía para probar la lógica","Fenêtre vide pour tester la logique","חלון ריק לבדיקת לוגיקת האפליקציה","用於測試應用程式邏輯的空白視窗","Pusto ôkno do sprawdzaniŏ logiki aplikacyji"],["Kalkulator","Calculator","Taschenrechner","Calculadora","Calculatrice","מחשבון","計算機","Kalkulatōr"],["Kalendarz","Calendar","Kalender","Calendario","Calendrier","לוח שנה","行事曆","Kalyndorz"],["Notatnik","Notepad","Notizblock","Bloc de notas","Bloc-notes","פנקס רשימות","記事本","Zeszyt"],["Zegar","Clock","Uhr","Reloj","Horloge","שעון","時鐘","Zegar"],["Stoper","Stopwatch","Stoppuhr","Cronómetro","Chronomètre","שעון עצר","碼錶","Stoper"],["Lista zadań","To-do list","Aufgabenliste","Lista de tareas","Liste de tâches","רשימת משימות","待辦清單","Lista zadań"],["Konwerter","Converter","Umrechner","Conversor","Convertisseur","ממיר","轉換器","Przelicznik"],["Pogoda","Weather","Wetter","Tiempo","Météo","מזג אוויר","天氣","Pogoda"],["Tłumacz","Translator","Übersetzer","Traductor","Traducteur","מתרגם","翻譯","Przekładacz"],["Odtwarzacz","Player","Player","Reproductor","Lecteur","נגן","播放器","Ôdtwarzacz"],["Naukowy","Scientific","Wissenschaftlich","Científica","Scientifique","מדעי","科學型","Naukowy"],["Historia","History","Verlauf","Historial","Historique","היסטוריה","歷史記錄","Historyjŏ"],["Wyczyść historię","Clear history","Verlauf löschen","Borrar historial","Effacer l’historique","נקה היסטוריה","清除記錄","Wyczyść historyjõ"],["Brak historii obliczeń.","No calculation history.","Kein Berechnungsverlauf.","Sin historial de cálculos.","Aucun historique de calculs.","אין היסטוריית חישובים.","沒有計算記錄。","Niy ma historyji ôbliczyń."],["Błąd","Error","Fehler","Error","Erreur","שגיאה","錯誤","Błōnd"],["Kalkulator prosty i naukowy z historią obliczeń","Simple and scientific calculator with history","Einfacher und wissenschaftlicher Rechner mit Verlauf","Calculadora sencilla y científica con historial","Calculatrice simple et scientifique avec historique","מחשבון פשוט ומדעי עם היסטוריית חישובים","附計算記錄的標準型與科學型計算機","Prosty i naukowy kalkulatōr z historyjōm ôbliczyń"],["Wiele notatek z obsługą emoji","Multiple notes with emoji support","Mehrere Notizen mit Emoji-Unterstützung","Varias notas con compatibilidad de emojis","Plusieurs notes avec prise en charge des emojis","מספר פתקים עם תמיכה באימוג'י","支援表情符號的多則筆記","Moc zapiskōw ze wsparciym emoji"],["Nowa notatka","New note","Neue Notiz","Nueva nota","Nouvelle note","פתק חדש","新增筆記","Nowy zapisek"],["Szukaj w notatkach…","Search notes…","Notizen durchsuchen…","Buscar en notas…","Rechercher dans les notes…","חפש בפתקים…","搜尋筆記…","Szukej we zapiskach…"],["Lista notatek","Notes list","Notizenliste","Lista de notas","Liste des notes","רשימת פתקים","筆記清單","Lista zapiskōw"],["Usuń notatkę","Delete note","Notiz löschen","Eliminar nota","Supprimer la note","מחק פתק","刪除筆記","Skasuj zapisek"],["Zacznij pisać…","Start typing…","Fang an zu schreiben…","Empieza a escribir…","Commencez à écrire…","התחל להקליד…","開始輸入…","Zacznij pisać…"],["Bez tytułu","Untitled","Ohne Titel","Sin título","Sans titre","ללא כותרת","無標題","Bez tytułu"],["znaków","characters","Zeichen","caracteres","caractères","תווים","字元","znakōw"],["Usunąć notatkę?","Delete this note?","Diese Notiz löschen?","¿Eliminar esta nota?","Supprimer cette note ?","למחוק את הפתק?","要刪除這則筆記嗎？","Skasować tyn zapisek?"],["Tej operacji nie można cofnąć.","This cannot be undone.","Das lässt sich nicht rückgängig machen.","No se puede deshacer.","Cette action est irréversible.","לא ניתן לבטל פעולה זו.","此操作無法復原。","Tego niy idzie cofnōńć."],["Blokuj o inne okna","Block against other windows","An anderen Fenstern blockieren","Bloquear contra otras ventanas","Bloquer contre les autres fenêtres","חסום מול חלונות אחרים","與其他視窗碰撞","Zablokuj ô inksze ôkna"],["Scal stykające się okna","Merge touching windows","Berührende Fenster verbinden","Unir ventanas en contacto","Fusionner les fenêtres en contact","מזג חלונות נוגעים","合併相接的視窗","Zlep stykajōnce sia ôkna"],["Oddziel okno od grupy","Detach window from group","Fenster aus Gruppe lösen","Separar ventana del grupo","Détacher la fenêtre du groupe","נתק חלון מהקבוצה","將視窗從群組分離","Ôddziel ôkno ôd grupy"],["Anuluj przesuwanie","Cancel move","Verschieben abbrechen","Cancelar movimiento","Annuler le déplacement","בטל הזזה","取消移動","Anuluj przesuwaniy"],["Anuluj zmianę rozmiaru","Cancel resize","Größenänderung abbrechen","Cancelar cambio de tamaño","Annuler le redimensionnement","בטל שינוי גודל","取消調整大小","Anuluj zmiana miary"],["Okna scalone","Windows merged","Fenster verbunden","Ventanas unidas","Fenêtres fusionnées","החלונות מוזגו","視窗已合併","Ôkna zlepione"],["Okno oddzielone","Window detached","Fenster gelöst","Ventana separada","Fenêtre détachée","החלון נותק","視窗已分離","Ôkno ôddzielōne"],["Brak stykających się okien.","No touching windows.","Keine berührenden Fenster.","No hay ventanas en contacto.","Aucune fenêtre en contact.","אין חלונות נוגעים.","沒有相接的視窗。","Niy ma stykajōncych ôkien."],["Blokuj o okna i krawędzie ekranu","Block against windows and screen edges","An Fenstern und Bildschirmrändern blockieren","Bloquear contra ventanas y bordes de pantalla","Bloquer contre les fenêtres et les bords de l’écran","חסום מול חלונות וקצוות המסך","與視窗及螢幕邊緣碰撞","Zablokuj ô ôkna i krańce ekranu"],["Tarcza","Dial","Zifferblatt","Esfera","Cadran","לוח שעון","錶盤","Tarcza"],["Cyfrowy","Digital","Digital","Digital","Numérique","דיגיטלי","數位","Cyfrowy"],["Bez numerów","No numerals","Ohne Ziffern","Sin números","Sans chiffres","ללא מספרים","無數字","Bez numerōw"],["Format 24-godzinny","24-hour format","24-Stunden-Format","Formato de 24 horas","Format 24 heures","פורמט 24 שעות","24 小時制","Format 24-godzinny"],["Alarmy","Alarms","Wecker","Alarmas","Alarmes","התראות","鬧鐘","Budziki"],["Minutnik","Timer","Timer","Temporizador","Minuteur","טיימר","計時器","Minutnik"],["＋ Nowy alarm","＋ New alarm","＋ Neuer Wecker","＋ Nueva alarma","＋ Nouvelle alarme","＋ התראה חדשה","＋ 新增鬧鐘","＋ Nowy budzik"],["Brak alarmów.","No alarms.","Keine Wecker.","No hay alarmas.","Aucune alarme.","אין התראות.","沒有鬧鐘。","Niy ma budzikōw."],["Godzina","Time","Uhrzeit","Hora","Heure","שעה","時間","Godzina"],["Data","Date","Datum","Fecha","Date","תאריך","日期","Data"],["Powtarzaj","Repeat","Wiederholen","Repetir","Répéter","חזור","重複","Powtŏrzej"],["Bez zaznaczonych dni alarm zadzwoni jednorazowo w wybranym dniu.","With no days selected, the alarm rings once on the chosen date.","Ohne ausgewählte Tage klingelt der Wecker einmalig am gewählten Datum.","Sin días seleccionados, la alarma suena una vez en la fecha elegida.","Sans jour sélectionné, l’alarme sonne une seule fois à la date choisie.","אם לא נבחרו ימים, ההתראה תצלצל פעם אחת בתאריך שנבחר.","未選取任何星期時，鬧鐘只會在所選日期響一次。","Jak niy ma zaznaczōnych dni, budzik zadzwōni roz we wybrany dziyń."],["Notatka","Note","Notiz","Nota","Note","הערה","備註","Zapisek"],["Notatka do alarmu…","Note for the alarm…","Notiz zum Wecker…","Nota para la alarma…","Note pour l’alarme…","הערה להתראה…","鬧鐘備註…","Zapisek do budzika…"],["Dźwięk","Sound","Klang","Sonido","Son","צליל","音效","Dźwiyk"],["Dzwonek","Bell","Glocke","Campana","Cloche","פעמון","鈴聲","Dzwōnek"],["Budzik","Alarm clock","Wecker","Despertador","Réveil","שעון מעורר","鬧鐘音","Budzik"],["Narastający","Rising","Aufsteigend","Ascendente","Montant","עולה","漸強","Rosnōncy"],["Melodia","Melody","Melodie","Melodía","Mélodie","מנגינה","旋律","Melodyjŏ"],["Cichy puls","Soft pulse","Sanfter Puls","Pulso suave","Pulsation douce","פולס רך","輕柔脈動","Cichy puls"],["Odsłuchaj","Preview","Anhören","Escuchar","Écouter","האזן","試聽","Posłychej"],["Zapisz","Save","Speichern","Guardar","Enregistrer","שמור","儲存","Zapisz"],["Edytuj","Edit","Bearbeiten","Editar","Modifier","ערוך","編輯","Edytuj"],["ominięty","missed","verpasst","perdida","manquée","הוחמצה","已錯過","ôminiynty"],["Codziennie","Every day","Täglich","Todos los días","Tous les jours","כל יום","每天","Kożdego dnia"],["Podaj godzinę","Enter a time","Uhrzeit eingeben","Indica la hora","Indiquez l’heure","הזן שעה","請輸入時間","Podej godzina"],["Ten termin już minął","This time has already passed","Dieser Zeitpunkt ist bereits vorbei","Esa hora ya pasó","Cet horaire est déjà passé","הזמן הזה כבר עבר","此時間已過","Ta godzina już przeszła"],["Alarm dodany","Alarm added","Wecker hinzugefügt","Alarma añadida","Alarme ajoutée","ההתראה נוספה","已新增鬧鐘","Budzik dodany"],["Czas minął","Time is up","Die Zeit ist um","Se acabó el tiempo","Le temps est écoulé","הזמן נגמר","時間到","Czas ôminōn"],["Drzemka 5 min","Snooze 5 min","Schlummern 5 Min.","Posponer 5 min","Répéter 5 min","נודניק 5 דק׳","貪睡 5 分鐘","Drzymka 5 min"],["Wyłącz","Dismiss","Ausschalten","Apagar","Arrêter","כבה","關閉","Wyłōncz"],["Start","Start","Start","Iniciar","Démarrer","התחל","開始","Start"],["Pauza","Pause","Pause","Pausa","Pause","השהה","暫停","Pauza"],["Wznów","Resume","Fortsetzen","Reanudar","Reprendre","המשך","繼續","Wznōw"],["Resetuj","Reset","Zurücksetzen","Restablecer","Réinitialiser","אפס","重設","Resetuj"],["Stop","Stop","Stopp","Detener","Arrêter","עצור","停止","Stop"],["Okrążenie","Lap","Runde","Vuelta","Tour","הקפה","分圈","Ôkrōnżyniy"],["Dziś","Today","Heute","Hoy","Aujourd’hui","היום","今天","Dzisiej"],["Brak wydarzeń w tym dniu.","No events on this day.","Keine Termine an diesem Tag.","No hay eventos este día.","Aucun événement ce jour-là.","אין אירועים ביום זה.","這天沒有事件。","Niy ma wydarzyń we tyn dziyń."],["Nowe wydarzenie…","New event…","Neuer Termin…","Nuevo evento…","Nouvel événement…","אירוע חדש…","新增事件…","Nowe wydarzyniy…"],["Dodaj alarm","Add alarm","Wecker hinzufügen","Añadir alarma","Ajouter une alarme","הוסף התראה","新增鬧鐘","Dodej budzik"],["Dodaj","Add","Hinzufügen","Añadir","Ajouter","הוסף","新增","Dodej"],["Zegar, alarmy, minutnik, stoper i kalendarz","Clock, alarms, timer, stopwatch and calendar","Uhr, Wecker, Timer, Stoppuhr und Kalender","Reloj, alarmas, temporizador, cronómetro y calendario","Horloge, alarmes, minuteur, chronomètre et calendrier","שעון, התראות, טיימר, שעון עצר ולוח שנה","時鐘、鬧鐘、計時器、碼錶與行事曆","Zegar, budziki, minutnik, stoper i kalyndorz"],["Konwerter jednostek z rzadkimi jednostkami (np. lata świetlne)","Unit converter with rare units (e.g. light-years)","Einheitenumrechner mit seltenen Einheiten (z. B. Lichtjahre)","Conversor de unidades con unidades poco comunes (p. ej., años luz)","Convertisseur d’unités avec unités rares (p. ex. années-lumière)","ממיר יחידות עם יחידות נדירות (למשל שנות אור)","含罕見單位（如光年）的單位轉換器","Przelicznik jednostek ze rzadkimi jednostkami (np. lata świetlne)"],["Długość","Length","Länge","Longitud","Longueur","אורך","長度","Dugość"],["Waga i masa","Weight and mass","Gewicht und Masse","Peso y masa","Poids et masse","משקל ומסה","重量與質量","Waga i masa"],["Objętość","Volume","Volumen","Volumen","Volume","נפח","體積","Objyntość"],["Czas","Time","Zeit","Tiempo","Temps","זמן","時間","Czas"],["Powierzchnia","Area","Fläche","Superficie","Surface","שטח","面積","Powierzchnia"],["Temperatura","Temperature","Temperatur","Temperatura","Température","טמפרטורה","溫度","Temperatura"],["Prędkość","Speed","Geschwindigkeit","Velocidad","Vitesse","מהירות","速度","Gibkość"],["Dane","Data","Daten","Datos","Données","נתונים","資料","Dane"],["Energia","Energy","Energie","Energía","Énergie","אנרגיה","能量","Energijŏ"],["Ciśnienie","Pressure","Druck","Presión","Pression","לחץ","壓力","Ciśniyniy"],["Zamień jednostki","Swap units","Einheiten tauschen","Intercambiar unidades","Inverser les unités","החלף יחידות","交換單位","Zamiyń jednostki"],["Wszystkie jednostki","All units","Alle Einheiten","Todas las unidades","Toutes les unités","כל היחידות","所有單位","Wszystkie jednostki"],["Szukaj jednostki…","Search units…","Einheit suchen…","Buscar unidad…","Rechercher une unité…","חפש יחידה…","搜尋單位…","Szukej jednostki…"],["Skopiowano","Copied","Kopiert","Copiado","Copié","הועתק","已複製","Skopiowane"],["Kopiuj wynik","Copy result","Ergebnis kopieren","Copiar resultado","Copier le résultat","העתק תוצאה","複製結果","Kopiuj wynik"],["Przeliczasz z:","Converting from:","Umrechnen von:","Convertir de:","Convertir de :","ממיר מ:","轉換自：","Przeliczosz z:"],["Przeliczasz na:","Converting to:","Umrechnen in:","Convertir a:","Convertir en :","ממיר ל:","轉換為：","Przeliczosz na:"],["Waluty","Currencies","Währungen","Divisas","Devises","מטבעות","貨幣","Waluty"],["{a} to w przeliczeniu","{a} equals","{a} entspricht","{a} equivale a","{a} équivaut à","{a} שווה ל","{a} 等於","{a} to we przeliczyniu"],["Aktualizacja: {d}","Updated: {d}","Aktualisiert: {d}","Actualizado: {d}","Mis à jour : {d}","עודכן: {d}","更新時間：{d}","Aktualizacyjŏ: {d}"],["Pobieranie kursów…","Fetching rates…","Kurse werden abgerufen…","Obteniendo tipos de cambio…","Récupération des taux…","מוריד שערים…","正在取得匯率…","Pobiyranie kursōw…"],["Brak kursów. Sprawdź połączenie z internetem.","No rates available. Check your internet connection.","Keine Kurse verfügbar. Prüfe deine Internetverbindung.","Sin tipos de cambio. Comprueba tu conexión a internet.","Aucun taux disponible. Vérifiez votre connexion internet.","אין שערים. בדוק את חיבור האינטרנט.","沒有匯率資料，請檢查網路連線。","Niy ma kursōw. Sprawdź połōnczyniy z internetym."],["Spróbuj ponownie","Try again","Erneut versuchen","Reintentar","Réessayer","נסה שוב","再試一次","Sprōbuj zaś"],["Kursy z pamięci (brak połączenia)","Cached rates (offline)","Gespeicherte Kurse (offline)","Tipos guardados (sin conexión)","Taux en mémoire (hors ligne)","שערים מהזיכרון (אין חיבור)","記憶體中的匯率（離線）","Kursy z pamiynci (niy ma połōnczyniŏ)"],["Kurs stały (wartość ustalona prawnie).","Fixed rate (set by law).","Fester Kurs (gesetzlich festgelegt).","Tipo fijo (establecido por ley).","Taux fixe (fixé par la loi).","שער קבוע (נקבע בחוק).","固定匯率（由法律訂定）。","Kurs stały (ustalōny prawym)."],["Wykres niedostępny dla tej pary walut.","Chart not available for this currency pair.","Diagramm für dieses Währungspaar nicht verfügbar.","Gráfico no disponible para este par de divisas.","Graphique indisponible pour cette paire de devises.","הגרף אינו זמין לזוג מטבעות זה.","此貨幣組合無法顯示圖表。","Wykres niydostympny dlŏ tyj pary walut."],["Nie udało się pobrać wykresu.","Could not load the chart.","Diagramm konnte nicht geladen werden.","No se pudo cargar el gráfico.","Impossible de charger le graphique.","לא ניתן היה לטעון את הגרף.","無法載入圖表。","Niy szło pobrać wykresu."],["1R","1Y","1J","1A","1A","1ש׳","1年","1R"],["5L","5Y","5J","5A","5A","5ש׳","5年","5L"],["Wybierz miesiąc i rok","Choose month and year","Monat und Jahr wählen","Elegir mes y año","Choisir le mois et l’année","בחר חודש ושנה","選擇月份和年份","Wybier miesiōnc i rok"],["Obecnie wybrany","Currently selected","Aktuell ausgewählt","Seleccionado actualmente","Actuellement sélectionné","נבחר כעת","目前選用","Terŏzki ôbrany"],["Wybierz język","Choose language","Sprache wählen","Elegir idioma","Choisir la langue","בחר שפה","選擇語言","Wybier godka"],["Wpisz tekst do przetłumaczenia…","Type text to translate…","Text zum Übersetzen eingeben…","Escribe el texto que quieres traducir…","Saisissez le texte à traduire…","הקלד טקסט לתרגום…","輸入要翻譯的文字…","Wpisz tekst do przekładaniŏ…"],["Tłumaczenie pojawi się tutaj","The translation will appear here","Die Übersetzung erscheint hier","La traducción aparecerá aquí","La traduction apparaîtra ici","התרגום יופיע כאן","翻譯會顯示在這裡","Przekład sia pokŏże tukej"],["Zamień języki","Swap languages","Sprachen tauschen","Intercambiar idiomas","Inverser les langues","החלף שפות","交換語言","Zamiyń godki"],["Tłumaczenie…","Translating…","Übersetze…","Traduciendo…","Traduction…","מתרגם…","翻譯中…","Przekładanie…"],["Wykryto: {l}","Detected: {l}","Erkannt: {l}","Detectado: {l}","Détecté : {l}","זוהתה: {l}","偵測到：{l}","Poznane: {l}"],["Wykryj język","Detect language","Sprache erkennen","Detectar idioma","Détecter la langue","זיהוי שפה","自動偵測語言","Poznej godka"],["Wyczyść","Clear","Löschen","Borrar","Effacer","נקה","清除","Wyczyść"],["Kategorie","Categories","Kategorien","Categorías","Catégories","קטגוריות","類別","Kategoryje"],["Duplikuj notatkę","Duplicate note","Notiz duplizieren","Duplicar nota","Dupliquer la note","שכפל פתק","複製筆記","Zduplikuj zapisek"],["Wygląd aplikacji","App appearance","Aussehen der Apps","Aspecto de las aplicaciones","Apparence des applications","מראה האפליקציות","應用程式外觀","Wyglōd aplikacyji"],["Tło aplikacji","App background","Hintergrund der Apps","Fondo de las aplicaciones","Arrière-plan des applications","רקע האפליקציות","應用程式背景","Tło aplikacyji"],["Okrągłe okna aplikacji 🙃","Round app windows 🙃","Runde App-Fenster 🙃","Ventanas de aplicaciones redondas 🙃","Fenêtres d’applications rondes 🙃","חלונות אפליקציה עגולים 🙃","圓形應用程式視窗 🙃","Kōnde ôkna aplikacyji 🙃"],["Żartobliwa opcja: okna stają się kołami, a pasek tytułu zajmuje górny łuk.","A joke option: windows become circles and the title bar sits on the top arc.","Eine Spaßoption: Fenster werden zu Kreisen, die Titelleiste sitzt am oberen Bogen.","Una opción divertida: las ventanas se vuelven círculos y la barra de título ocupa el arco superior.","Une option pour rire : les fenêtres deviennent des cercles et la barre de titre occupe l’arc supérieur.","אפשרות הומוריסטית: החלונות הופכים לעיגולים ושורת הכותרת יושבת על הקשת העליונה.","趣味選項：視窗變成圓形，標題列位於上方弧線。","Szpas: ôkna sōm kōnde, a pasek tytułu je na gōrnym łuku."],["Spokojne cząsteczki w tle aplikacji","Calm particles in the app background","Ruhige Partikel im App-Hintergrund","Partículas tranquilas en el fondo de las aplicaciones","Particules discrètes en arrière-plan des applications","חלקיקים שקטים ברקע האפליקציות","應用程式背景的柔和粒子","Spokojne czōnstki we tle aplikacyji"],["0% wyłącza efekt w danej aplikacji.","0% turns the effect off in that app.","0 % schaltet den Effekt in dieser App aus.","0 % desactiva el efecto en esa aplicación.","0 % désactive l’effet dans cette application.","0% מכבה את האפקט באפליקציה.","0% 會關閉該應用程式的效果。","0% wyłōnczo efekt we ônyj aplikacyji."],["Brak połączenia z internetem. Tłumacz działa tylko online.","No internet connection. The translator works only online.","Keine Internetverbindung. Der Übersetzer funktioniert nur online.","Sin conexión a internet. El traductor solo funciona en línea.","Pas de connexion internet. Le traducteur ne fonctionne qu’en ligne.","אין חיבור לאינטרנט. המתרגם פועל רק באינטרנט.","沒有網路連線。翻譯功能僅能在線上使用。","Niy ma internetu. Przekładacz robi leda online."],["Usługa tłumaczenia jest chwilowo niedostępna. Spróbuj ponownie za chwilę.","The translation service is temporarily unavailable. Please try again shortly.","Der Übersetzungsdienst ist vorübergehend nicht verfügbar. Bitte versuche es gleich noch einmal.","El servicio de traducción no está disponible temporalmente. Inténtalo de nuevo en un momento.","Le service de traduction est momentanément indisponible. Réessayez dans un instant.","שירות התרגום אינו זמין זמנית. נסה שוב בעוד רגע.","翻譯服務暫時無法使用，請稍後再試。","Usługa przekładaniŏ je na chwila niydostympno. Sprōbuj zaś za chwila."],["Tłumacz tekstów (bez logowania i opłat, wymaga internetu)","Text translator (no sign-in or fees, needs internet)","Textübersetzer (ohne Anmeldung und Kosten, benötigt Internet)","Traductor de textos (sin inicio de sesión ni costes, requiere internet)","Traducteur de texte (sans connexion ni frais, internet requis)","מתרגם טקסט (ללא התחברות ותשלום, דורש אינטרנט)","文字翻譯（無須登入或付費，需連線網路）","Przekładacz tekstu (bez logowanŏ i ôpłat, trza internetu)"],["Zmieniacz formatów","File Format Changer","Formatwandler","Cambiador de formatos","Changeur de formats","מחליף פורמטים","格式轉換器","Zmiyniacz formatōw"],["Konwertuje pliki: obrazy, dźwięk, wideo, dokumenty, dane i archiwa","Converts files: images, audio, video, documents, data and archives","Konvertiert Dateien: Bilder, Audio, Video, Dokumente, Daten und Archive","Convierte archivos: imágenes, audio, vídeo, documentos, datos y archivos comprimidos","Convertit des fichiers : images, audio, vidéo, documents, données et archives","ממיר קבצים: תמונות, שמע, וידאו, מסמכים, נתונים וארכיונים","轉換檔案：圖片、音訊、影片、文件、資料與壓縮檔","Przekształco pliki: ôbrŏzy, dźwiyk, wideo, dokumynty, dane i archiwa"],["Upuść plik tutaj lub kliknij, aby wybrać","Drop a file here or click to choose","Datei hier ablegen oder klicken zum Auswählen","Suelta un archivo aquí o haz clic para elegir","Déposez un fichier ici ou cliquez pour choisir","גרור קובץ לכאן או לחץ לבחירה","將檔案拖曳到這裡，或點選以選擇","Puść plik tukej abo kliknij, coby wybrać"],["Konwertuj na:","Convert to:","Konvertieren in:","Convertir a:","Convertir en :","המר ל:","轉換為：","Przekształć na:"],["Konwertuj","Convert","Konvertieren","Convertir","Convertir","המר","轉換","Przekształć"],["Gotowy plik","Converted file","Fertige Datei","Archivo listo","Fichier prêt","הקובץ מוכן","轉換完成的檔案","Gotowy plik"],["Zapisz plik…","Save file…","Datei speichern…","Guardar archivo…","Enregistrer le fichier…","שמור קובץ…","儲存檔案…","Zapisz plik…"],["Wybierz plik do konwersji.","Choose a file to convert.","Wähle eine Datei zum Konvertieren.","Elige un archivo para convertir.","Choisissez un fichier à convertir.","בחר קובץ להמרה.","請選擇要轉換的檔案。","Wybier plik do przekształcaniŏ."],["Konwertowanie…","Converting…","Konvertiere…","Convirtiendo…","Conversion…","ממיר…","轉換中…","Przekształcanie…"],["Gotowe.","Done.","Fertig.","Listo.","Terminé.","הסתיים.","完成。","Gotowe."],["Nie udało się przekonwertować pliku.","The file could not be converted.","Die Datei konnte nicht konvertiert werden.","No se pudo convertir el archivo.","Impossible de convertir le fichier.","לא ניתן להמיר את הקובץ.","無法轉換此檔案。","Niy szło przekształcić plika."],["Ten format wymaga programu ffmpeg.","This format requires ffmpeg.","Dieses Format benötigt ffmpeg.","Este formato requiere ffmpeg.","Ce format nécessite ffmpeg.","פורמט זה דורש ffmpeg.","此格式需要 ffmpeg。","Tyn format trzebuje programu ffmpeg."],["Wykryto ffmpeg: dostępne są dodatkowe formaty.","ffmpeg found: extra formats are available.","ffmpeg gefunden: zusätzliche Formate verfügbar.","ffmpeg detectado: hay formatos adicionales disponibles.","ffmpeg détecté : formats supplémentaires disponibles.","ffmpeg זוהה: פורמטים נוספים זמינים.","偵測到 ffmpeg：可使用更多格式。","Znejdzōny ffmpeg: dostympne sōm dodatkowe formaty."],["Zainstaluj ffmpeg, aby odblokować więcej formatów (MP3, MP4, MKV…).","Install ffmpeg to unlock more formats (MP3, MP4, MKV…).","Installiere ffmpeg, um weitere Formate freizuschalten (MP3, MP4, MKV…).","Instala ffmpeg para desbloquear más formatos (MP3, MP4, MKV…).","Installez ffmpeg pour débloquer plus de formats (MP3, MP4, MKV…).","התקן את ffmpeg כדי לפתוח פורמטים נוספים (MP3, MP4, MKV…).","安裝 ffmpeg 即可解鎖更多格式（MP3、MP4、MKV…）。","Zainstaluj ffmpeg, coby ôdryglować wiyncyj formatōw (MP3, MP4, MKV…)."],["Konwersja wideo w przeglądarce trwa tyle, ile samo wideo.","Converting video in the browser takes as long as the video itself.","Die Videokonvertierung im Browser dauert so lange wie das Video selbst.","Convertir vídeo en el navegador dura tanto como el propio vídeo.","La conversion vidéo dans le navigateur dure aussi longtemps que la vidéo.","המרת וידאו בדפדפן אורכת כמו הווידאו עצמו.","在瀏覽器中轉換影片所需時間與影片長度相同。","Przekształcaniy wideo we przeglōndarce trwo tela, co samo wideo."],["Ten format wejściowy nie jest obsługiwany.","This input format is not supported.","Dieses Eingabeformat wird nicht unterstützt.","Este formato de entrada no es compatible.","Ce format d’entrée n’est pas pris en charge.","פורמט הקלט אינו נתמך.","不支援此輸入格式。","Tyn format wejściowy niy je ôbsłōgiwany."],["Wybrane plików: {n}","Files selected: {n}","Ausgewählte Dateien: {n}","Archivos seleccionados: {n}","Fichiers sélectionnés : {n}","קבצים שנבחרו: {n}","已選擇檔案：{n}","Wybrane plikōw: {n}"],["Wykryty format: {f}","Detected format: {f}","Erkanntes Format: {f}","Formato detectado: {f}","Format détecté : {f}","פורמט שזוהה: {f}","偵測到的格式：{f}","Poznany format: {f}"],["Obrazy","Images","Bilder","Imágenes","Images","תמונות","圖片","Ôbrŏzy"],["Audio","Audio","Audio","Audio","Audio","שמע","音訊","Audio"],["Wideo","Video","Video","Vídeo","Vidéo","וידאו","影片","Wideo"],["Dokumenty","Documents","Dokumente","Documentos","Documents","מסמכים","文件","Dokumynty"],["Archiwa","Archives","Archive","Archivos comprimidos","Archives","ארכיונים","壓縮檔","Archiwa"],["Kodowanie","Encoding","Kodierung","Codificación","Encodage","קידוד","編碼","Kodowaniy"],["Jakość","Quality","Qualität","Calidad","Qualité","איכות","品質","Jakość"],["Maks. rozmiar (px)","Max size (px)","Max. Größe (px)","Tamaño máx. (px)","Taille max. (px)","גודל מרבי (px)","最大尺寸（px）","Maks. miara (px)"],["Tło","Background","Hintergrund","Fondo","Arrière-plan","רקע","背景","Tło"],["Częstotliwość","Sample rate","Abtastrate","Frecuencia","Fréquence","תדר דגימה","取樣率","Frekwyncyjŏ"],["Kanały","Channels","Kanäle","Canales","Canaux","ערוצים","聲道","Kanały"],["Jak w oryginale","Same as original","Wie im Original","Igual que el original","Comme l’original","כמו במקור","與原檔相同","Jak we ôryginale"],["Mono","Mono","Mono","Mono","Mono","מונו","單聲道","Mono"],["Stereo","Stereo","Stereo","Estéreo","Stéréo","סטריאו","立體聲","Stereo"],["Klatki/s","Frames/s","Bilder/s","Fotogramas/s","Images/s","פריימים/שנ׳","每秒幀數","Klatki/s"],["Szerokość (px)","Width (px)","Breite (px)","Ancho (px)","Largeur (px)","רוחב (px)","寬度（px）","Szyrzka (px)"],["Czas klatki (s)","Frame time (s)","Bildzeit (s)","Tiempo del fotograma (s)","Temps de l’image (s)","זמן הפריים (שנ׳)","影格時間（秒）","Czas klatki (s)"],["Separator","Separator","Trennzeichen","Separador","Séparateur","מפריד","分隔符號","Separator"],["Wykrywaj liczby i wartości logiczne","Detect numbers and booleans","Zahlen und Wahrheitswerte erkennen","Detectar números y booleanos","Détecter nombres et booléens","זהה מספרים וערכים בוליאניים","偵測數字與布林值","Poznowej liczby i wartości logiczne"],["Końce wierszy","Line endings","Zeilenenden","Finales de línea","Fins de ligne","סופי שורות","換行符號","Kōńce wierszy"],["Kodowanie źródła","Source encoding","Quellkodierung","Codificación de origen","Encodage source","קידוד מקור","來源編碼","Kodowaniy źrōdła"],["Automatycznie","Automatic","Automatisch","Automático","Automatique","אוטומטי","自動","Autōmatycznie"],["Dzisiaj","Today","Heute","Hoy","Aujourd’hui","היום","今天","Dzisiej"],["Wczoraj","Yesterday","Gestern","Ayer","Hier","אתמול","昨天","Wczorej"],["Szukaj w historii…","Search history…","Verlauf durchsuchen…","Buscar en el historial…","Rechercher dans l’historique…","חיפוש בהיסטוריה…","搜尋記錄…","Szukej we historyji…"],["Usuń z historii","Remove from history","Aus dem Verlauf entfernen","Eliminar del historial","Supprimer de l’historique","הסר מההיסטוריה","從記錄中移除","Skasuj z historyji"],["Historia jest pusta.","History is empty.","Der Verlauf ist leer.","El historial está vacío.","L’historique est vide.","ההיסטוריה ריקה.","記錄是空的。","Historyja je pusto."],["Brak wyników.","No results.","Keine Ergebnisse.","Sin resultados.","Aucun résultat.","אין תוצאות.","沒有結果。","Niy ma wyników."],["Pokaż więcej","Show more","Mehr anzeigen","Mostrar más","Afficher plus","הצג עוד","顯示更多","Pokoż wiyncyj"],["Zapisuj historię przeglądania","Save browsing history","Browserverlauf speichern","Guardar el historial de navegación","Enregistrer l’historique de navigation","שמור היסטוריית גלישה","儲存瀏覽記錄","Zapisuj historyjõ przeglōndaniŏ"],["Przechowuj historię","Keep history for","Verlauf aufbewahren für","Conservar el historial durante","Conserver l’historique pendant","שמור היסטוריה למשך","記錄保留時間","Trzimej historyjõ przez"],["Dni: {n}","Days: {n}","Tage: {n}","Días: {n}","Jours : {n}","ימים: {n}","天數：{n}","Dni: {n}"],["Bez limitu","No limit","Unbegrenzt","Sin límite","Illimité","ללא הגבלה","不限","Bez limitu"],["np. google.com lub zwierzaki","e.g. google.com or pets","z. B. google.com oder tiere","p. ej. google.com o mascotas","p. ex. google.com ou animaux","לדוגמה: google.com או חיות","例如 google.com 或 寵物","np. google.com abo zwierzyna"],["Starsze wpisy są usuwane automatycznie.","Older entries are removed automatically.","Ältere Einträge werden automatisch gelöscht.","Las entradas más antiguas se eliminan automáticamente.","Les entrées plus anciennes sont supprimées automatiquement.","ערכים ישנים יותר נמחקים אוטומטית.","較舊的項目會自動移除。","Starsze wpisy sōm autōmatycznie kasowane."],["Wpis z kropką, ukośnikiem lub „www” pasuje do całego adresu (np. www.google.com). Samo słowo (np. zwierzaki) pasuje tylko do nazwy strony przed końcówką .com, .pl itd. Pasujące wejścia nie są zapisywane, a istniejące zostają usunięte. Dotyczy to także haseł wyszukiwanych w Google.","An entry with a dot, slash or “www” matches the whole address (e.g. www.google.com). A plain word (e.g. pets) matches only the site name before the .com, .pl etc. ending. Matching visits are not saved, and existing ones are removed. This also applies to terms searched on Google.","Ein Eintrag mit Punkt, Schrägstrich oder „www“ passt auf die gesamte Adresse (z. B. www.google.com). Ein einzelnes Wort (z. B. tiere) passt nur auf den Seitennamen vor der Endung .com, .pl usw. Passende Besuche werden nicht gespeichert, vorhandene werden entfernt. Das gilt auch für bei Google gesuchte Begriffe.","Una entrada con punto, barra o «www» coincide con toda la dirección (p. ej. www.google.com). Una sola palabra (p. ej. mascotas) solo coincide con el nombre del sitio antes de la terminación .com, .pl, etc. Las visitas coincidentes no se guardan y las existentes se eliminan. Esto también se aplica a los términos buscados en Google.","Une entrée contenant un point, une barre oblique ou « www » correspond à l’adresse entière (p. ex. www.google.com). Un simple mot (p. ex. animaux) ne correspond qu’au nom du site avant la terminaison .com, .pl, etc. Les visites correspondantes ne sont pas enregistrées et celles qui existent sont supprimées. Cela s’applique aussi aux termes recherchés sur Google.","ערך עם נקודה, לוכסן או “www” תואם לכתובת כולה (לדוגמה www.google.com). מילה בודדת (לדוגמה חיות) תואמת רק לשם האתר לפני הסיומת .com‏, .pl וכו׳. ביקורים תואמים אינם נשמרים, וקיימים נמחקים. זה חל גם על מונחים שנחפשו בגוגל.","含有句點、斜線或「www」的項目會比對整個網址（例如 www.google.com）。單一詞彙（例如 寵物）只比對網站名稱中 .com、.pl 等結尾之前的部分。符合的造訪不會被儲存，已存在的也會被移除。這也適用於在 Google 搜尋的字詞。","Wpis z kropkōm, ukośnikym abo „www” pasuje do cołkigo adresu (np. www.google.com). Samo słowo (np. zwierzyna) pasuje yno do miana strōny przed ôgōnym .com, .pl itd. Pasujōnce wejściŏ niy sōm zapisywane, a dotychczasowe sōm kasowane. Tyż dotyczy to słōw szukanych we Google."],["Wyczyścić całą historię?","Clear all history?","Gesamten Verlauf löschen?","¿Borrar todo el historial?","Effacer tout l’historique ?","למחוק את כל ההיסטוריה?","要清除所有記錄嗎？","Wyczyścić cołkõ historyjõ?"],["Usunięto wpisów: {n}","Entries removed: {n}","Einträge entfernt: {n}","Entradas eliminadas: {n}","Entrées supprimées : {n}","ערכים שהוסרו: {n}","已移除項目：{n}","Skasowane wpisy: {n}"],["Ustawienia historii","History settings","Verlaufseinstellungen","Ajustes del historial","Paramètres de l’historique","הגדרות היסטוריה","記錄設定","Ustawiynia historyje"],["Strony pomijane","Ignored sites","Ignorierte Seiten","Sitios omitidos","Sites ignorés","אתרים מוחרגים","忽略的網站","Pominiynte strōny"],["Uruchamianie przeglądarki","Browser startup","Browserstart","Inicio del navegador","Démarrage du navigateur","הפעלת הדפדפן","瀏覽器啟動","Uruchamianiy przeglōndarki"],["Wczytywanie karty…","Loading tab…","Tab wird geladen…","Cargando pestaña…","Chargement de l’onglet…","טוען לשונית…","正在載入分頁…","Ładowanie karty…"],["Wczytywanie historii…","Loading history…","Verlauf wird geladen…","Cargando historial…","Chargement de l’historique…","טוען היסטוריה…","正在載入記錄…","Ładowanie historyje…"],["Ładowanie panelu asystenta...","Loading assistant panel...","Assistenten-Panel wird geladen...","Cargando el panel del asistente...","Chargement du panneau de l’assistant...","טוען את חלונית העוזר...","正在載入助理面板...","Ładowanie panela asystynta..."],["Kostki z fizyką: łap, rzucaj i niszcz","Physics cubes: grab, throw and smash","Würfel mit Physik: greifen, werfen, zerstören","Cubos con física: agarra, lanza y destruye","Cubes physiques : attrapez, lancez, détruisez","קוביות עם פיזיקה: תפסו, זרקו והרסו","物理方塊：抓取、投擲、擊碎","Kostki z fizykōm: chyćej, ciepej i niszcz"],["Wynik","Score","Punktzahl","Puntuación","Score","ניקוד","分數","Wynik"],["Rekord","Best","Rekord","Récord","Record","שיא","最高紀錄","Rekord"],["Zniszcz wszystkie","Destroy all","Alle zerstören","Destruir todos","Tout détruire","השמד הכול","全部擊碎","Zniszcz wszyńskie"],["Zeruj wynik","Reset score","Punktzahl zurücksetzen","Reiniciar puntuación","Réinitialiser le score","אפס ניקוד","重設分數","Wyzeruj wynik"],["Grafiki kostek","Cube images","Würfelbilder","Imágenes de los cubos","Images des cubes","תמונות הקוביות","方塊圖片","Grafiki kostek"],["Dodaj zdjęcia","Add pictures","Bilder hinzufügen","Añadir imágenes","Ajouter des images","הוסף תמונות","新增圖片","Dodej zdjyńciŏ"],["Nowe kostki losują jedną z tych grafik.","New cubes pick one of these images at random.","Neue Würfel wählen zufällig eines dieser Bilder.","Los cubos nuevos eligen al azar una de estas imágenes.","Les nouveaux cubes choisissent au hasard l’une de ces images.","קוביות חדשות בוחרות באקראי אחת מהתמונות האלה.","新方塊會隨機選用其中一張圖片。","Nowe kostki losujōm jedna z tych grafik."],["Limit: {n} grafik","Limit: {n} images","Limit: {n} Bilder","Límite: {n} imágenes","Limite : {n} images","מגבלה: {n} תמונות","上限：{n} 張圖片","Limit: {n} grafik"],["Nie można odczytać obrazu.","Could not read the image.","Das Bild konnte nicht gelesen werden.","No se pudo leer la imagen.","Impossible de lire l’image.","לא ניתן לקרוא את התמונה.","無法讀取圖片。","Niy idzie przeczytać ôbrazu."],["Zresetować wynik?","Reset the score?","Punktzahl zurücksetzen?","¿Reiniciar la puntuación?","Réinitialiser le score ?","לאפס את הניקוד?","要重設分數嗎？","Wyzerować wynik?"],["Rekord zostanie zachowany.","The best score will be kept.","Der Rekord bleibt erhalten.","Se conservará el récord.","Le record sera conservé.","השיא יישמר.","最高紀錄會保留。","Rekord ostanie."],["Zeruj","Reset","Zurücksetzen","Reiniciar","Réinitialiser","אפס","重設","Wyzeruj"],["Ustawienia aplikacji","App settings","App-Einstellungen","Ajustes de la aplicación","Paramètres de l’application","הגדרות האפליקציה","應用程式設定","Sztalōnki aplikacyje"],["Dźwięk uruchamiania","Startup sound","Startsound","Sonido de inicio","Son de démarrage","צליל הפעלה","啟動音效","Dźwiyk uruchamianiŏ"],["Dopasowanie zdjęć","Image fit","Bildanpassung","Ajuste de imagen","Ajustement de l’image","התאמת תמונה","圖片配置","Dopasowanie zdjyńć"],["Przytnij","Crop","Zuschneiden","Recortar","Recadrer","חתוך","裁切","Przitnij"],["Rozciągnij","Stretch","Strecken","Estirar","Étirer","מתח","拉伸","Rozciōngnij"],["Kafelek","Tile","Kacheln","Mosaico","Mosaïque","ריצוף","並排","Kafelek"],["Kafelki: {n}×{n}","Tiles: {n}×{n}","Kacheln: {n}×{n}","Mosaicos: {n}×{n}","Mosaïques : {n}×{n}","ריצוף: {n}×{n}","並排：{n}×{n}","Kafelki: {n}×{n}"],["Rozmiar kostek","Cube size","Würfelgröße","Tamaño de los cubos","Taille des cubes","גודל הקוביות","方塊大小","Srogość kostek"],["Kości","Dice","Würfel","Dados","Dés","קוביות","骰子","Kostki"],["Rzuty kośćmi: od D3 do D100, wiele kości naraz","Dice rolls: D3 to D100, many dice at once","Würfeln: von D3 bis D100, mehrere Würfel gleichzeitig","Tirada de dados: de D3 a D100, varios dados a la vez","Lancers de dés : de D3 à D100, plusieurs dés à la fois","הטלת קוביות: מ-D3 עד D100, כמה קוביות בבת אחת","擲骰子：D3 至 D100，可同時擲多顆","Rzuty kostkami: ôd D3 do D100, wiela kostek naroz"],["Rzuć kośćmi","Roll dice","Würfeln","Lanzar dados","Lancer les dés","הטל קוביות","擲骰子","Rzuć kostkami"],["Wybierz kości","Choose dice","Würfel wählen","Elige los dados","Choisir les dés","בחר קוביות","選擇骰子","Wybier kostki"],["Modyfikator","Modifier","Modifikator","Modificador","Modificateur","מקדם","修正值","Modyfikator"],["Suma","Total","Summe","Total","Total","סך הכול","總和","Suma"],["Historia rzutów","Roll history","Wurfverlauf","Historial de tiradas","Historique des lancers","היסטוריית הטלות","擲骰記錄","Historyjo rzutōw"],["Brak rzutów","No rolls yet","Noch keine Würfe","Aún no hay tiradas","Aucun lancer","אין הטלות עדיין","尚無擲骰記錄","Karnych rzutōw"],["Wyczyść wybór","Clear selection","Auswahl löschen","Borrar selección","Effacer la sélection","נקה בחירה","清除選擇","Wyczyść wybōr"],["Rzuć ponownie tą kością","Roll this die again","Diesen Würfel erneut werfen","Volver a lanzar este dado","Relancer ce dé","הטל קובייה זו שוב","重擲這顆骰子","Rzuć zaś tōm kostkōm"],["Wybierz kości i rzuć","Choose dice and roll","Würfel wählen und werfen","Elige dados y lanza","Choisissez des dés et lancez","בחר קוביות והטל","選擇骰子並擲出","Wybier kostki i rzuć"],["Wybierz co najmniej jedną kość","Choose at least one die","Wähle mindestens einen Würfel","Elige al menos un dado","Choisissez au moins un dé","בחר לפחות קובייה אחת","請至少選擇一顆骰子","Wybier przynajmnij jedna kostka"],["Zakres: {a}–{b}","Range: {a}–{b}","Bereich: {a}–{b}","Rango: {a}–{b}","Plage : {a}–{b}","טווח: {a}–{b}","範圍：{a}–{b}","Zakres: {a}–{b}"],["Maksymalnie {n} kości naraz","Up to {n} dice at once","Höchstens {n} Würfel gleichzeitig","Máximo {n} dados a la vez","{n} dés maximum à la fois","עד {n} קוביות בבת אחת","最多同時 {n} 顆骰子","Maksymalnie {n} kostek naroz"],["Kliknij kość w wyniku, aby rzucić nią ponownie.","Click a die in the result to roll it again.","Klicke auf einen Würfel im Ergebnis, um ihn erneut zu werfen.","Haz clic en un dado del resultado para volver a lanzarlo.","Cliquez sur un dé du résultat pour le relancer.","לחץ על קובייה בתוצאה כדי להטיל אותה שוב.","點選結果中的骰子即可重擲該顆。","Klik na kostka w wyniku, coby ônōm rzucić zaś."],["Suwaki","Sliders","Regler","Deslizadores","Curseurs","מחוונים","滑桿","Suwaki"],["Suwaki przesuwają się co 5","Sliders move in steps of 5","Regler springen in 5er-Schritten","Los deslizadores avanzan de 5 en 5","Les curseurs avancent par pas de 5","המחוונים נעים בקפיצות של 5","滑桿以 5 為單位移動","Suwaki sie przesuwajōm ô 5"],["Wszystkie suwaki w ustawieniach zmieniają wartość o 5 zamiast o 1 (np. efekty tła o 5%).","All sliders in settings change by 5 instead of 1 (e.g. background effects by 5%).","Alle Regler in den Einstellungen ändern den Wert um 5 statt um 1 (z. B. Hintergrundeffekte um 5 %).","Todos los deslizadores de los ajustes cambian de 5 en 5 en lugar de 1 en 1 (p. ej., efectos de fondo de 5 %).","Tous les curseurs des réglages changent de 5 au lieu de 1 (p. ex. effets d’arrière-plan de 5 %).","כל המחוונים בהגדרות משתנים ב-5 במקום ב-1 (למשל אפקטי רקע ב-5%).","設定中的所有滑桿每次變動 5 而非 1（例如背景特效每次 5%）。","Wszyjske suwaki w sztelōngach zmieniajōm wartość ô 5 zamiast ô 1 (np. efekty tła ô 5%)."],["Aktualizacje","Updates","Aktualisierungen","Actualizaciones","Mises à jour","עדכונים","更新","Aktualizacyje"],["Wersja {v}","Version {v}","Version {v}","Versión {v}","Version {v}","גרסה {v}","版本 {v}","Wersyjo {v}"],["Sprawdzanie…","Checking…","Wird geprüft …","Comprobando…","Vérification…","בודק…","檢查中…","Sprawdziwanie…"],["Masz najnowszą wersję","You have the latest version","Du hast die neueste Version","Tienes la última versión","Vous avez la dernière version","יש לך את הגרסה העדכנית ביותר","您已使用最新版本","Mosz nojnowsza wersyjo"],["Dostępna wersja {v}","Version {v} is available","Version {v} ist verfügbar","Versión {v} disponible","Version {v} disponible","גרסה {v} זמינה","有可用的 {v} 版","Je dostympno wersyjo {v}"],["Pobieranie wersji {v}: {p}%","Downloading version {v}: {p}%","Version {v} wird heruntergeladen: {p} %","Descargando la versión {v}: {p} %","Téléchargement de la version {v} : {p} %","מוריד גרסה {v}: {p}%","正在下載 {v} 版：{p}%","Pobiyrane wersyje {v}: {p}%"],["Wersja {v} jest gotowa do instalacji","Version {v} is ready to install","Version {v} ist bereit zur Installation","La versión {v} está lista para instalar","La version {v} est prête à être installée","גרסה {v} מוכנה להתקנה","{v} 版已可安裝","Wersyjo {v} je gotowo do instalacyje"],["Nie udało się sprawdzić aktualizacji","Could not check for updates","Aktualisierungen konnten nicht geprüft werden","No se pudo buscar actualizaciones","Impossible de vérifier les mises à jour","לא ניתן היה לבדוק עדכונים","無法檢查更新","Niy szło sprawdzić aktualizacyji"],["Repozytorium aktualizacji nie jest skonfigurowane","The update repository is not configured","Das Update-Repository ist nicht konfiguriert","El repositorio de actualizaciones no está configurado","Le dépôt des mises à jour n’est pas configuré","מאגר העדכונים לא הוגדר","尚未設定更新儲存庫","Repozytorium aktualizacyji niy je skonfigurowane"],["Aktualizacjami zajmuje się pierwsza uruchomiona instancja","Updates are handled by the first running instance","Aktualisierungen übernimmt die zuerst gestartete Instanz","Las actualizaciones las gestiona la primera instancia iniciada","Les mises à jour sont gérées par la première instance lancée","העדכונים מטופלים על ידי המופע הראשון שהופעל","更新由最先啟動的執行個體處理","Aktualizacyjami zajmuje sie piyrszo uruchomiono instancyjo"],["Nie sprawdzano jeszcze aktualizacji","Updates have not been checked yet","Noch nicht nach Aktualisierungen gesucht","Aún no se han buscado actualizaciones","Aucune vérification effectuée","עדיין לא נבדקו עדכונים","尚未檢查更新","Aktualizacyji jeszcze niy sprawdzano"],["Sprawdź aktualizacje","Check for updates","Nach Aktualisierungen suchen","Buscar actualizaciones","Rechercher des mises à jour","בדוק עדכונים","檢查更新","Sprawdź aktualizacyje"],["Pobierz","Download","Herunterladen","Descargar","Télécharger","הורד","下載","Pobier"],["Otwórz stronę wydania","Open the release page","Release-Seite öffnen","Abrir la página de la versión","Ouvrir la page de la version","פתח את דף הגרסה","開啟發行頁面","Ôtwōrz strōna wydanio"],["Zainstaluj i uruchom ponownie","Install and restart","Installieren und neu starten","Instalar y reiniciar","Installer et redémarrer","התקן והפעל מחדש","安裝並重新啟動","Zainstaluj i uruchōm zaś"],["Sprawdzaj aktualizacje automatycznie","Check for updates automatically","Automatisch nach Aktualisierungen suchen","Buscar actualizaciones automáticamente","Rechercher automatiquement les mises à jour","בדוק עדכונים אוטומטית","自動檢查更新","Sprawdziwej aktualizacyje autōmatycznie"],["Pobieraj aktualizacje automatycznie","Download updates automatically","Aktualisierungen automatisch herunterladen","Descargar actualizaciones automáticamente","Télécharger automatiquement les mises à jour","הורד עדכונים אוטומטית","自動下載更新","Pobiyrej aktualizacyje autōmatycznie"],["Aktualizacje pochodzą z oficjalnych wydań projektu na GitHubie. Pobrane pliki są weryfikowane sumą SHA-512, a zainstalowana aktualizacja uruchamia się przy zamknięciu przeglądarki lub od razu na życzenie.","Updates come from the project’s official releases on GitHub. Downloaded files are verified with a SHA-512 checksum, and the update installs when the browser is closed or immediately on request.","Aktualisierungen stammen aus den offiziellen Releases des Projekts auf GitHub. Heruntergeladene Dateien werden per SHA-512-Prüfsumme verifiziert; die Aktualisierung wird beim Schließen des Browsers oder auf Wunsch sofort installiert.","Las actualizaciones proceden de las versiones oficiales del proyecto en GitHub. Los archivos descargados se verifican con una suma SHA-512 y la actualización se instala al cerrar el navegador o de inmediato si lo pides.","Les mises à jour proviennent des versions officielles du projet sur GitHub. Les fichiers téléchargés sont vérifiés par une somme SHA-512 ; la mise à jour s’installe à la fermeture du navigateur ou immédiatement sur demande.","העדכונים מגיעים מהגרסאות הרשמיות של הפרויקט ב-GitHub. הקבצים שהורדו מאומתים בסכום בדיקה SHA-512, והעדכון מותקן עם סגירת הדפדפן או מיד לפי בקשה.","更新來自專案在 GitHub 上的官方發行版。下載的檔案會以 SHA-512 校驗碼驗證，更新會在關閉瀏覽器時安裝，也可立即安裝。","Aktualizacyje sōm ze ôficjalnych wydanij projektu na GitHubie. Pobrane zbiory sōm weryfikowane sumōm SHA-512, a zainstalowano aktualizacyjo sie uruchamiô przi zawarciu przeglōndarki abo ôd razu na życzynie."],["Uruchomiono bez instalatora – nowe wersje pobierzesz ze strony wydania.","Started without the installer – download new versions from the release page.","Ohne Installer gestartet – neue Versionen lädst du von der Release-Seite herunter.","Iniciado sin instalador: descarga las nuevas versiones desde la página de la versión.","Lancé sans installateur : téléchargez les nouvelles versions depuis la page de la version.","הופעל ללא מתקין – הורד גרסאות חדשות מדף הגרסה.","未透過安裝程式啟動：請從發行頁面下載新版本。","Uruchōmiōno bez instalatora – nowe wersyje pobierzesz ze strōny wydanio."],["Aktualizacja gotowa","Update ready","Aktualisierung bereit","Actualización lista","Mise à jour prête","העדכון מוכן","更新已就緒","Aktualizacyjo gotowo"],["Wersja {v} została pobrana. Zainstalować teraz? Przeglądarka uruchomi się ponownie.","Version {v} has been downloaded. Install now? The browser will restart.","Version {v} wurde heruntergeladen. Jetzt installieren? Der Browser wird neu gestartet.","Se ha descargado la versión {v}. ¿Instalar ahora? El navegador se reiniciará.","La version {v} a été téléchargée. Installer maintenant ? Le navigateur va redémarrer.","גרסה {v} הורדה. להתקין עכשיו? הדפדפן יופעל מחדש.","已下載 {v} 版。要立即安裝嗎？瀏覽器將重新啟動。","Wersyjo {v} bōła pobrano. Zainstalować teroz? Przeglōndarka uruchōmi sie zaś."],["Zostanie zainstalowana przy zamknięciu przeglądarki","It will be installed when the browser is closed","Wird beim Schließen des Browsers installiert","Se instalará al cerrar el navegador","Elle sera installée à la fermeture du navigateur","תותקן עם סגירת הדפדפן","將於關閉瀏覽器時安裝","Zainstaluje sie przi zawarciu przeglōndarki"],["Brak opublikowanych wydań","No published releases","Keine veröffentlichten Releases","No hay versiones publicadas","Aucune version publiée","אין גרסאות שפורסמו","尚無已發布的版本","Niy ma ôpublikowanych wydanij"],["Saper","Minesweeper","Minesweeper","Buscaminas","Démineur","שולה מוקשים","踩地雷","Saper"],["Klasyczny Saper: własna plansza, życia i zawinięte krawędzie","Classic Minesweeper: custom board, lives and wrap-around edges","Klassisches Minesweeper: eigenes Spielfeld, Leben und umlaufende Ränder","Buscaminas clásico: tablero propio, vidas y bordes que se conectan","Démineur classique : plateau personnalisé, vies et bords qui se rejoignent","שולה מוקשים קלאסי: לוח מותאם, חיים וקצוות מחוברים","經典踩地雷：自訂棋盤、生命值與環繞邊緣","Klasyczny Saper: ôsobno plansza, żywotki i zawinyte krańce"],["Snake","Snake","Snake","Serpiente","Snake","נחש","貪食蛇","Snake"],["Wąż z jabłkami: plansza, tempo, złote i trujące jabłka oraz przeszkody","Snake with apples: board, pace, golden and poisonous apples and obstacles","Snake mit Äpfeln: Spielfeld, Tempo, goldene und giftige Äpfel, Hindernisse","Serpiente con manzanas: tablero, ritmo, manzanas doradas y venenosas, obstáculos","Snake avec pommes : plateau, rythme, pommes dorées et empoisonnées, obstacles","נחש עם תפוחים: לוח, קצב, תפוחי זהב ורעל ומכשולים","貪食蛇：棋盤、速度、金蘋果、毒蘋果與障礙物","Wōnsz z jabkōma: plansza, tympo, złote i trujōce jabka a bariyry"],["Nowa gra","New game","Neues Spiel","Nueva partida","Nouvelle partie","משחק חדש","新遊戲","Nowo gra"],["Ustawienia gry","Game settings","Spieleinstellungen","Ajustes del juego","Réglages du jeu","הגדרות משחק","遊戲設定","Sztelōngi gry"],["Zastosuj i zagraj","Apply and play","Anwenden und spielen","Aplicar y jugar","Appliquer et jouer","החל ושחק","套用並開始","Zastosuj i zagrej"],["Łatwy","Easy","Leicht","Fácil","Facile","קל","簡單","Latwy"],["Średni","Medium","Mittel","Medio","Moyen","בינוני","中等","Postrzedni"],["Trudny","Hard","Schwer","Difícil","Difficile","קשה","困難","Ciynżki"],["Ekstremalny","Extreme","Extrem","Extremo","Extrême","קיצוני","極限","Ekstremalny"],["Własny","Custom","Eigene","Personalizado","Personnalisé","מותאם","自訂","Włosny"],["Kolumny","Columns","Spalten","Columnas","Colonnes","עמודות","欄","Kolumny"],["Wiersze","Rows","Zeilen","Filas","Lignes","שורות","列","Wiersze"],["Miny","Mines","Minen","Minas","Mines","מוקשים","地雷","Miny"],["Rozmiar pola","Cell size","Feldgröße","Tamaño de casilla","Taille des cases","גודל משבצת","格子大小","Srogość pola"],["Dopasuj do okna","Fit to window","An Fenster anpassen","Ajustar a la ventana","Adapter à la fenêtre","התאם לחלון","配合視窗","Dopasuj do ôkna"],["Życia","Lives","Leben","Vidas","Vies","חיים","生命","Żywotki"],["Bezpieczny pierwszy klik","Safe first click","Sicherer erster Klick","Primer clic seguro","Premier clic sûr","לחיצה ראשונה בטוחה","首次點擊安全","Bezpieczny piyrszy klik"],["Akordy (klik na cyfrę)","Chording (click a number)","Akkord (Klick auf Zahl)","Acordes (clic en un número)","Accords (clic sur un chiffre)","אקורד (לחיצה על מספר)","快速展開（點擊數字）","Akordy (klik na cyfra)"],["Znaki zapytania","Question marks","Fragezeichen","Signos de interrogación","Points d’interrogation","סימני שאלה","問號標記","Znaki pytanio"],["Zawinięta plansza","Wrap-around board","Umlaufendes Spielfeld","Tablero envolvente","Plateau cyclique","לוח מחובר בקצוות","環繞棋盤","Zawinyto plansza"],["Plansza","Board","Spielfeld","Tablero","Plateau","לוח","棋盤","Plansza"],["Zasady","Rules","Regeln","Reglas","Règles","חוקים","規則","Zasady"],["Pozostało min","Mines left","Verbleibende Minen","Minas restantes","Mines restantes","מוקשים שנותרו","剩餘地雷","Zostało min"],["Tryb flagi","Flag mode","Flaggenmodus","Modo bandera","Mode drapeau","מצב דגל","旗標模式","Tryb fanki"],["Życie utracone! Zostało: {n}","Life lost! Left: {n}","Leben verloren! Übrig: {n}","¡Vida perdida! Quedan: {n}","Vie perdue ! Restantes : {n}","איבדת חיים! נותרו: {n}","失去一條生命！剩餘：{n}","Żywotek stracōny! Zostało: {n}"],["Wygrana! Czas: {t} s","You won! Time: {t} s","Gewonnen! Zeit: {t} s","¡Ganaste! Tiempo: {t} s","Gagné ! Temps : {t} s","ניצחת! זמן: {t} שנ׳","獲勝！時間：{t} 秒","Wygrana! Czas: {t} s"],["Nowy rekord!","New record!","Neuer Rekord!","¡Nuevo récord!","Nouveau record !","שיא חדש!","新紀錄！","Nowy rekord!"],["Prawy przycisk myszy: flaga. Zmiana rozmiaru planszy lub liczby min zaczyna nową grę po kliknięciu przycisku powyżej.","Right mouse button: flag. Changes to board size or mine count start a new game when you click the button above.","Rechte Maustaste: Flagge. Änderungen an Feldgröße oder Minenzahl starten ein neues Spiel, sobald du die Schaltfläche oben anklickst.","Botón derecho: bandera. Los cambios de tamaño o de minas empiezan una partida nueva al pulsar el botón de arriba.","Clic droit : drapeau. Les changements de taille ou de mines lancent une nouvelle partie au clic sur le bouton ci-dessus.","לחצן ימני: דגל. שינוי גודל הלוח או מספר המוקשים יתחיל משחק חדש בלחיצה על הכפתור שלמעלה.","按右鍵可插旗。變更棋盤大小或地雷數量後，按上方按鈕即開始新遊戲。","Prawy knefel myszy: fanka. Zmiana srogości planszy abo liczby min zaczyno nowo gra po kliknyńciu knefla wyżyj."],["Klasyczny","Classic","Klassisch","Clásico","Classique","קלאסי","經典","Klasyczny"],["Szybki","Fast","Schnell","Rápido","Rapide","מהיר","快速","Szybki"],["Labirynt","Maze","Labyrinth","Laberinto","Labyrinthe","מבוך","迷宮","Labirynt"],["Bez ścian","No walls","Ohne Wände","Sin paredes","Sans murs","בלי קירות","無牆壁","Bez ściōn"],["Przeszkody","Obstacles","Hindernisse","Obstáculos","Obstacles","מכשולים","障礙物","Bariyry"],["Przenikanie ścian","Pass through walls","Durch Wände gehen","Atravesar paredes","Traverser les murs","מעבר דרך קירות","穿牆","Przechodzynie przez ściany"],["Wąż","Snake","Schlange","Serpiente","Serpent","הנחש","蛇","Wōnsz"],["Szybkość","Speed","Geschwindigkeit","Velocidad","Vitesse","מהירות","速度","Szybkość"],["Przyspieszanie","Acceleration","Beschleunigung","Aceleración","Accélération","האצה","加速","Przyspieszanie"],["Początkowa długość","Starting length","Startlänge","Longitud inicial","Longueur initiale","אורך התחלתי","初始長度","Poczōntkowo dugość"],["Wzrost za jabłko","Growth per apple","Wachstum pro Apfel","Crecimiento por manzana","Croissance par pomme","גדילה לכל תפוח","每顆蘋果的成長","Przyrost za jabko"],["Jabłka","Apples","Äpfel","Manzanas","Pommes","תפוחים","蘋果","Jabka"],["Jabłka naraz","Apples at once","Äpfel gleichzeitig","Manzanas a la vez","Pommes en même temps","תפוחים בו-זמנית","同時蘋果數","Jabka naroz"],["Nowe jabłko co","New apple every","Neuer Apfel alle","Nueva manzana cada","Nouvelle pomme toutes les","תפוח חדש כל","新蘋果間隔","Nowe jabko co"],["Czas życia jabłka","Apple lifetime","Lebensdauer des Apfels","Vida de la manzana","Durée de vie de la pomme","משך חיי התפוח","蘋果存活時間","Czas życio jabka"],["bez limitu","unlimited","unbegrenzt","sin límite","illimité","ללא הגבלה","無限制","bez limitu"],["Złote jabłka","Golden apples","Goldene Äpfel","Manzanas doradas","Pommes dorées","תפוחי זהב","金蘋果","Złote jabka"],["Trujące jabłka","Poisonous apples","Giftige Äpfel","Manzanas venenosas","Pommes empoisonnées","תפוחי רעל","毒蘋果","Trujōce jabka"],["Naciśnij strzałkę, aby zacząć","Press an arrow key to start","Zum Starten eine Pfeiltaste drücken","Pulsa una flecha para empezar","Appuyez sur une flèche pour commencer","לחץ על מקש חץ כדי להתחיל","按方向鍵開始","Naciś strzałka, coby zacząć"],["Naciśnij spację, aby wznowić","Press Space to resume","Zum Fortsetzen Leertaste drücken","Pulsa Espacio para reanudar","Appuyez sur Espace pour reprendre","לחץ רווח כדי להמשיך","按空白鍵繼續","Naciś spacyjo, coby wznowić"],["Koniec gry","Game over","Spiel vorbei","Fin del juego","Partie terminée","המשחק נגמר","遊戲結束","Kōnie gry"],["Zagraj ponownie","Play again","Nochmal spielen","Jugar de nuevo","Rejouer","שחק שוב","再玩一次","Zagrej zaś"],["Wynik: {n}","Score: {n}","Punkte: {n}","Puntos: {n}","Score : {n}","ניקוד: {n}","分數：{n}","Wynik: {n}"],["Strzałki lub WASD: sterowanie, spacja: pauza.","Arrow keys or WASD to steer, Space to pause.","Pfeiltasten oder WASD zum Steuern, Leertaste für Pause.","Flechas o WASD para mover, Espacio para pausar.","Flèches ou WASD pour diriger, Espace pour mettre en pause.","חצים או WASD להיגוי, רווח להשהיה.","方向鍵或 WASD 控制，空白鍵暫停。","Strzałki abo WASD: sterowanie, spacyjo: pauza."],["Złote jabłko: +30 pkt i dłuższy wzrost. Trujące: -5 pkt i skrócenie węża. Zmiany planszy i węża obowiązują od nowej gry.","Golden apple: +30 pts and extra growth. Poisonous: −5 pts and a shorter snake. Board and snake changes apply from a new game.","Goldener Apfel: +30 Punkte und mehr Wachstum. Giftiger: −5 Punkte und kürzere Schlange. Änderungen gelten ab einem neuen Spiel.","Manzana dorada: +30 pts y más crecimiento. Venenosa: −5 pts y serpiente más corta. Los cambios valen desde una partida nueva.","Pomme dorée : +30 pts et croissance accrue. Empoisonnée : −5 pts et serpent raccourci. Les changements s’appliquent dès une nouvelle partie.","תפוח זהב: ‏+30 נק׳ וגדילה נוספת. תפוח רעל: ‏−5 נק׳ והנחש מתקצר. שינויים חלים ממשחק חדש.","金蘋果：+30 分並額外成長。毒蘋果：−5 分並縮短蛇身。變更於新遊戲生效。","Złote jabko: +30 pkt i dłuższy przyrost. Trujōce: −5 pkt i skrōcynie wōnsza. Zmiany planszy i wōnsza ôbowiōnzujōm ôd nowyj gry."],["System","System","System","Sistema","Système","מערכת","系統","Systym"],["Panele boczne","Side panels","Seitenleisten","Paneles laterales","Panneaux latéraux","חלוניות צד","側邊面板","Boczne panele"],["Pokaż przycisk panelu asystenta","Show the assistant panel button","Schaltfläche für das Assistenten-Panel anzeigen","Mostrar el botón del panel del asistente","Afficher le bouton du panneau de l’assistant","הצג את כפתור חלונית העוזר","顯示助理面板按鈕","Pokŏż przycisk panelu asystynta"],["Pokaż przycisk ChangeLog","Show the ChangeLog button","ChangeLog-Schaltfläche anzeigen","Mostrar el botón de ChangeLog","Afficher le bouton ChangeLog","הצג את כפתור ChangeLog","顯示 ChangeLog 按鈕","Pokŏż przycisk ChangeLog"],["Skrót klawiszowy panelu asystenta działa także przy ukrytym przycisku (zakładka Skróty).","The assistant panel shortcut also works when the button is hidden (Shortcuts tab).","Das Tastenkürzel für das Assistenten-Panel funktioniert auch bei ausgeblendeter Schaltfläche (Tab Kürzel).","El atajo del panel del asistente funciona también con el botón oculto (pestaña Atajos).","Le raccourci du panneau de l’assistant fonctionne aussi lorsque le bouton est masqué (onglet Raccourcis).","קיצור המקלדת של חלונית העוזר פועל גם כשהכפתור מוסתר (לשונית קיצורים).","即使隱藏按鈕，助理面板的快速鍵仍可使用（快速鍵分頁）。","Skrōt klawiszowy panelu asystynta dziŏła tyż przi skrytym przycisku (zakładka Skrōty)."],["Animacje aplikacji","App animations","App-Animationen","Animaciones de aplicaciones","Animations des applications","אנימציות אפליקציות","應用程式動畫","Animacyje aplikacyji"],["Okna aplikacji","App windows","App-Fenster","Ventanas de aplicaciones","Fenêtres des applications","חלונות אפליקציות","應用程式視窗","Ôkna aplikacyji"],["Pokaż pasek aplikacji","Show the app bar","App-Leiste anzeigen","Mostrar la barra de aplicaciones","Afficher la barre d’applications","הצג את סרגל האפליקציות","顯示應用程式列","Pokŏż pasek aplikacyji"],["Zapisywanie historii","Saving history","Verlauf speichern","Guardado del historial","Enregistrement de l’historique","שמירת היסטוריה","儲存歷史記錄","Zapisowanie historyje"],["O programie","About","Über das Programm","Acerca de","À propos","אודות","關於","Ô programie"],["Zapis i wczytanie obejmują wszystkie ustawienia, ale nie karty i foldery.","Saving and loading cover all settings, but not tabs and folders.","Speichern und Laden umfassen alle Einstellungen, aber nicht Tabs und Ordner.","Guardar y cargar abarca todos los ajustes, pero no las pestañas ni las carpetas.","L’enregistrement et le chargement couvrent tous les réglages, mais pas les onglets ni les dossiers.","השמירה והטעינה כוללות את כל ההגדרות, אך לא כרטיסיות ותיקיות.","儲存與載入涵蓋所有設定，但不包含分頁與資料夾。","Zapis i wczytanie ôbjimujōm wszyskie ustawiynia, ale niy karty i foldery."],["Wydane","Released","Veröffentlicht","Publicadas","Publiées","שוחררו","已發行","Wydane"],["Niewydane","Unreleased","Unveröffentlicht","Sin publicar","Non publiées","טרם שוחררו","未發行","Niewydane"],["Wydana","Released","Veröffentlicht","Publicada","Publiée","שוחררה","已發行","Wydano"],["Niewydana","Unreleased","Unveröffentlicht","Sin publicar","Non publiée","טרם שוחררה","未發行","Niewydano"],["Wersji: {n}","Versions: {n}","Versionen: {n}","Versiones: {n}","Versions : {n}","גרסאות: {n}","版本數：{n}","Wersyji: {n}"],["Brak wpisów do pokazania.","No entries to show.","Keine Einträge vorhanden.","No hay entradas que mostrar.","Aucune entrée à afficher.","אין רשומות להצגה.","沒有可顯示的項目。","Niy ma wpisōw do pokŏzaniŏ."],["Nie udało się wczytać pliku CHANGELOG.txt z folderu aplikacji.","Could not load CHANGELOG.txt from the app folder.","CHANGELOG.txt konnte nicht aus dem App-Ordner geladen werden.","No se pudo cargar CHANGELOG.txt de la carpeta de la aplicación.","Impossible de charger CHANGELOG.txt depuis le dossier de l’application.","לא ניתן לטעון את CHANGELOG.txt מתיקיית היישום.","無法從應用程式資料夾載入 CHANGELOG.txt。","Niy szło wczytać zbioru CHANGELOG.txt ze folderu aplikacyji."],["Tłumaczenie na język interfejsu...","Translating into the interface language...","Übersetzung in die Oberflächensprache...","Traduciendo al idioma de la interfaz...","Traduction dans la langue de l’interface...","מתרגם לשפת הממשק...","正在翻譯成介面語言...","Tumaczynie na gŏdka interfejsu..."],["Pokazano oryginał (po polsku), bo tłumaczenie jest niedostępne.","Showing the original (Polish) because translation is unavailable.","Das Original (Polnisch) wird angezeigt, da die Übersetzung nicht verfügbar ist.","Se muestra el original (en polaco) porque la traducción no está disponible.","Original (en polonais) affiché, car la traduction est indisponible.","מוצג המקור (בפולנית) כי התרגום אינו זמין.","因無法翻譯，顯示原文（波蘭文）。","Pokŏzane ôryginał (po polsku), bo tumaczynie niy je dostympne."],["Programy","Programs","Programme","Programas","Programmes","תוכנות","程式","Programy"],["Gry","Games","Spiele","Juegos","Jeux","משחקים","遊戲","Gry"],["Tekst zwykły","Plain text","Normaler Text","Texto normal","Texte normal","טקסט רגיל","一般文字","Zwykły tekst"],["Kod Morse’a","Morse code","Morsecode","Código Morse","Code Morse","קוד מורס","摩斯電碼","Kod Morse’a"],["Pismo Braille’a","Braille","Brailleschrift","Braille","Braille","ברייל","點字","Pismo Braille’a"],["Chiński: brak tabeli znaków, tryb niedostępny","Chinese: no character table, mode unavailable","Chinesisch: keine Zeichentabelle, Modus nicht verfügbar","Chino: sin tabla de caracteres, modo no disponible","Chinois : pas de table de caractères, mode indisponible","סינית: אין טבלת תווים, המצב אינו זמין","中文：沒有字元對照表，無法使用此模式","Chińsko gŏdka: niy ma tabele znakōw, tryb niydostympny"],["Morse i Braille zamieniają tekst interfejsu w danym języku na kod (uproszczone tabele, bez skrótów). Dotyczy tylko interfejsu Arkany, nie stron internetowych. Zmiana odświeża aplikację.","Morse and Braille turn the interface text in that language into code (simplified tables, no contractions). It affects only the Arkana interface, not websites. Changing it reloads the app.","Morse und Braille wandeln den Oberflächentext der jeweiligen Sprache in Code um (vereinfachte Tabellen, ohne Kürzungen). Betrifft nur die Arkana-Oberfläche, nicht Websites. Die Änderung lädt die App neu.","Morse y Braille convierten el texto de la interfaz de ese idioma en código (tablas simplificadas, sin abreviaturas). Solo afecta a la interfaz de Arkana, no a los sitios web. El cambio recarga la aplicación.","Morse et Braille convertissent le texte de l’interface dans cette langue en code (tables simplifiées, sans abréviations). Cela ne concerne que l’interface d’Arkana, pas les sites web. Le changement recharge l’application.","מורס וברייל ממירים את טקסט הממשק בשפה הנבחרת לקוד (טבלאות מפושטות, ללא קיצורים). משפיע רק על ממשק Arkana ולא על אתרי אינטרנט. השינוי טוען מחדש את האפליקציה.","摩斯電碼與點字會將該語言的介面文字轉成代碼（簡化對照表，不含縮寫）。僅影響 Arkana 介面，不影響網站。變更後會重新載入應用程式。","Morse i Braille zamiyniajōm tekst interfejsu we danyj gŏdce na kod (uproszczōne tabele, bez skrōtōw). Tyczy sie yno interfejsu Arkany, niy zajtōw internetowych. Zmiana ôdświyżo aplikacyjõ."],["Import z innej przeglądarki","Import from another browser","Import aus einem anderen Browser","Importar desde otro navegador","Importer depuis un autre navigateur","ייבוא מדפדפן אחר","從其他瀏覽器匯入","Import ze inkszyj przeglōndarki"],["Przenieś zakładki, historię, wyszukiwarkę i zalogowane sesje. Hasła, rozszerzenia i inne ustawienia innych przeglądarek nie są importowane.","Move bookmarks, history, search engine and logged-in sessions. Passwords, extensions and other settings of other browsers are not imported.","Übertrage Lesezeichen, Verlauf, Suchmaschine und angemeldete Sitzungen. Passwörter, Erweiterungen und andere Einstellungen anderer Browser werden nicht importiert.","Traslada marcadores, historial, buscador y sesiones iniciadas. No se importan contraseñas, extensiones ni otros ajustes de otros navegadores.","Transférez favoris, historique, moteur de recherche et sessions connectées. Les mots de passe, extensions et autres réglages des autres navigateurs ne sont pas importés.","העבר סימניות, היסטוריה, מנוע חיפוש והתחברויות פעילות. סיסמאות, תוספים והגדרות אחרות של דפדפנים אחרים אינם מיובאים.","轉移書籤、歷史記錄、搜尋引擎與已登入的工作階段。不會匯入其他瀏覽器的密碼、擴充功能與其他設定。","Przenojś zokłodki, historyjõ, szukajkã i zalogowane sesyje. Hasła, rozszerzynia i inksze ustawiynia inkszych przeglōndarek niy sōm importowane."],["Znalezione przeglądarki","Browsers found","Gefundene Browser","Navegadores encontrados","Navigateurs trouvés","דפדפנים שנמצאו","找到的瀏覽器","Znojdzione przeglōndarki"],["Szukam przeglądarek...","Looking for browsers...","Suche nach Browsern...","Buscando navegadores...","Recherche des navigateurs...","מחפש דפדפנים...","正在尋找瀏覽器...","Szukōm przeglōndarek..."],["Nie znaleziono przeglądarek. Użyj pliku zakładek (HTML) wyeksportowanego z dowolnej przeglądarki.","No browsers found. Use a bookmarks file (HTML) exported from any browser.","Keine Browser gefunden. Verwende eine aus einem beliebigen Browser exportierte Lesezeichen-Datei (HTML).","No se encontraron navegadores. Usa un archivo de marcadores (HTML) exportado desde cualquier navegador.","Aucun navigateur trouvé. Utilisez un fichier de favoris (HTML) exporté depuis n’importe quel navigateur.","לא נמצאו דפדפנים. השתמש בקובץ סימניות (HTML) שיוצא מכל דפדפן.","找不到瀏覽器。請使用從任何瀏覽器匯出的書籤檔案（HTML）。","Niy znojdzōno przeglōndarek. Użyj zbioru zokłodek (HTML) wyeksportowanego ze jakiejkolwiek przeglōndarki."],["Plik zakładek (HTML)","Bookmarks file (HTML)","Lesezeichen-Datei (HTML)","Archivo de marcadores (HTML)","Fichier de favoris (HTML)","קובץ סימניות (HTML)","書籤檔案（HTML）","Zbiōr zokłodek (HTML)"],["Eksport z dowolnej przeglądarki, także Safari.","Export from any browser, including Safari.","Export aus jedem Browser, auch Safari.","Exportación de cualquier navegador, incluido Safari.","Export depuis n’importe quel navigateur, y compris Safari.","ייצוא מכל דפדפן, כולל Safari.","可從任何瀏覽器匯出，包括 Safari。","Eksport ze jakiejkolwiek przeglōndarki, tyż Safari."],["Co przenieść","What to transfer","Was übertragen","Qué trasladar","Que transférer","מה להעביר","要轉移的內容","Co przenojś"],["Zakładki","Bookmarks","Lesezeichen","Marcadores","Favoris","סימניות","書籤","Zokłodki"],["Ciasteczka (zalogowane sesje)","Cookies (logged-in sessions)","Cookies (angemeldete Sitzungen)","Cookies (sesiones iniciadas)","Cookies (sessions connectées)","עוגיות (התחברויות פעילות)","Cookie（已登入的工作階段）","Ciasteczka (zalogowane sesyje)"],["Ciasteczka","Cookies","Cookies","Cookies","Cookies","עוגיות","Cookie","Ciasteczka"],["Każdy folder zakładek trafi do osobnego folderu Arkany; strony ładują się dopiero po kliknięciu.","Each bookmark folder goes into its own Arkana folder; pages load only when clicked.","Jeder Lesezeichenordner landet in einem eigenen Arkana-Ordner; Seiten laden erst beim Anklicken.","Cada carpeta de marcadores va a su propia carpeta de Arkana; las páginas se cargan solo al hacer clic.","Chaque dossier de favoris va dans son propre dossier Arkana ; les pages ne se chargent qu’au clic.","כל תיקיית סימניות תועבר לתיקייה נפרדת ב-Arkana; הדפים נטענים רק בלחיצה.","每個書籤資料夾會成為獨立的 Arkana 資料夾；頁面在點擊後才會載入。","Kożdy folder zokłodek trefi do ôsobnego folderu Arkany; zajty ładujōm sie dopiyro po kliknyncio."],["Zamknij wybraną przeglądarkę (także w zasobniku systemowym), inaczej jej bazy danych mogą być zablokowane.","Close the selected browser (also in the system tray), otherwise its databases may be locked.","Schließe den gewählten Browser (auch im Infobereich), sonst sind seine Datenbanken eventuell gesperrt.","Cierra el navegador seleccionado (también en la bandeja del sistema); de lo contrario, sus bases de datos pueden estar bloqueadas.","Fermez le navigateur choisi (aussi dans la zone de notification), sinon ses bases de données peuvent être verrouillées.","סגור את הדפדפן שנבחר (גם במגש המערכת), אחרת מסדי הנתונים שלו עלולים להיות נעולים.","請關閉所選的瀏覽器（包括系統匣中的），否則其資料庫可能被鎖定。","Zawrzij wybranõ przeglōndarkã (tyż w zasobniku systymowym), inaczyj jeji bazy danych sōm możne zablokowane."],["Ciasteczka zawierają dane logowania. Importuj tylko ze swojego profilu.","Cookies contain login data. Import only from your own profile.","Cookies enthalten Anmeldedaten. Importiere nur aus deinem eigenen Profil.","Las cookies contienen datos de inicio de sesión. Importa solo desde tu propio perfil.","Les cookies contiennent des données de connexion. N’importez que depuis votre propre profil.","עוגיות מכילות נתוני התחברות. ייבא רק מהפרופיל שלך.","Cookie 含有登入資料。請僅從您自己的設定檔匯入。","Ciasteczka majōm dane logowanio. Importuj yno ze swojigo profilu."],["Importuj","Import","Importieren","Importar","Importer","ייבא","匯入","Importuj"],["Importuję...","Importing...","Importiere...","Importando...","Importation...","מייבא...","正在匯入...","Importuja..."],["Gotowe","Done","Fertig","Listo","Terminé","סיום","完成","Gotowe"],["Wynik importu","Import result","Importergebnis","Resultado de la importación","Résultat de l’importation","תוצאת הייבוא","匯入結果","Wynik importu"],["Zakładki: {n} stron w {m} nowych folderach","Bookmarks: {n} pages in {m} new folders","Lesezeichen: {n} Seiten in {m} neuen Ordnern","Marcadores: {n} páginas en {m} carpetas nuevas","Favoris : {n} pages dans {m} nouveaux dossiers","סימניות: {n} דפים ב-{m} תיקיות חדשות","書籤：{n} 個頁面，位於 {m} 個新資料夾","Zokłodki: {n} zajtōw we {m} nowych folderach"],["Zakładki: brak nowych stron.","Bookmarks: no new pages.","Lesezeichen: keine neuen Seiten.","Marcadores: no hay páginas nuevas.","Favoris : aucune nouvelle page.","סימניות: אין דפים חדשים.","書籤：沒有新頁面。","Zokłodki: niy ma nowych zajtōw."],["Historia: dodano {n} wpisów","History: {n} entries added","Verlauf: {n} Einträge hinzugefügt","Historial: {n} entradas añadidas","Historique : {n} entrées ajoutées","היסטוריה: נוספו {n} רשומות","歷史記錄：已新增 {n} 筆","Historyjŏ: dodane {n} wpisōw"],["Historia: brak nowych wpisów.","History: no new entries.","Verlauf: keine neuen Einträge.","Historial: no hay entradas nuevas.","Historique : aucune nouvelle entrée.","היסטוריה: אין רשומות חדשות.","歷史記錄：沒有新項目。","Historyjŏ: niy ma nowych wpisōw."],["Ciasteczka: zaimportowano {n}, pominięto {s}","Cookies: {n} imported, {s} skipped","Cookies: {n} importiert, {s} übersprungen","Cookies: {n} importadas, {s} omitidas","Cookies : {n} importés, {s} ignorés","עוגיות: יובאו {n}, דולגו {s}","Cookie：已匯入 {n}，略過 {s}","Ciasteczka: zaimportowane {n}, pominiynte {s}"],["Część ciasteczek jest chroniona szyfrowaniem aplikacyjnym (nowszy Chrome) i nie da się jej przenieść: {n}.","Some cookies are protected by app-bound encryption (newer Chrome) and cannot be transferred: {n}.","Einige Cookies sind durch anwendungsgebundene Verschlüsselung geschützt (neueres Chrome) und lassen sich nicht übertragen: {n}.","Algunas cookies están protegidas con cifrado vinculado a la aplicación (Chrome reciente) y no se pueden trasladar: {n}.","Certains cookies sont protégés par un chiffrement lié à l’application (Chrome récent) et ne peuvent pas être transférés : {n}.","חלק מהעוגיות מוגנות בהצפנה הקשורה ליישום (Chrome חדש) ולא ניתן להעבירן: {n}.","部分 Cookie 受應用程式繫結加密保護（較新的 Chrome），無法轉移：{n}。","Czynść ciasteczek je chrōniōno szyfrowaniym aplikacyjnym (nowszy Chrome) i niy idzie jij przenojś: {n}."],["baza jest zablokowana, zamknij przeglądarkę i spróbuj ponownie","the database is locked, close the browser and try again","Die Datenbank ist gesperrt, schließe den Browser und versuche es erneut","la base de datos está bloqueada; cierra el navegador e inténtalo de nuevo","la base de données est verrouillée, fermez le navigateur et réessayez","מסד הנתונים נעול, סגור את הדפדפן ונסה שוב","資料庫已被鎖定，請關閉瀏覽器後再試一次","baza je zablokowano, zawrzij przeglōndarkã i sprōbuj zasie"],["Przenosisz się z innej przeglądarki? Zaimportuj dane","Switching from another browser? Import your data","Wechselst du von einem anderen Browser? Importiere deine Daten","¿Vienes de otro navegador? Importa tus datos","Vous venez d’un autre navigateur ? Importez vos données","עוברים מדפדפן אחר? ייבאו את הנתונים","從其他瀏覽器轉換？匯入您的資料","Przechodzisz ze inkszyj przeglōndarki? Zaimportuj dane"],["Ukryj","Hide","Ausblenden","Ocultar","Masquer","הסתר","隱藏","Skryj"],["Importuj dane...","Import data...","Daten importieren...","Importar datos...","Importer les données...","ייבוא נתונים...","匯入資料...","Importuj dane..."],["Zakładki, historia i ciasteczka z Chrome, Edge, Firefoksa, Opery, Brave i Vivaldi lub z pliku zakładek.","Bookmarks, history and cookies from Chrome, Edge, Firefox, Opera, Brave and Vivaldi, or from a bookmarks file.","Lesezeichen, Verlauf und Cookies aus Chrome, Edge, Firefox, Opera, Brave und Vivaldi oder aus einer Lesezeichen-Datei.","Marcadores, historial y cookies de Chrome, Edge, Firefox, Opera, Brave y Vivaldi, o de un archivo de marcadores.","Favoris, historique et cookies de Chrome, Edge, Firefox, Opera, Brave et Vivaldi, ou d’un fichier de favoris.","סימניות, היסטוריה ועוגיות מ-Chrome, Edge, Firefox, Opera, Brave ו-Vivaldi, או מקובץ סימניות.","來自 Chrome、Edge、Firefox、Opera、Brave 與 Vivaldi 的書籤、歷史記錄與 Cookie，或來自書籤檔案。","Zokłodki, historyjŏ i ciasteczka ze Chrome, Edge, Firefoksa, Opery, Brave i Vivaldi abo ze zbioru zokłodek."],["Pasek zakładek","Bookmarks bar","Lesezeichenleiste","Barra de marcadores","Barre de favoris","סרגל סימניות","書籤列","Pasek zokłodek"],["Inne zakładki","Other bookmarks","Weitere Lesezeichen","Otros marcadores","Autres favoris","סימניות אחרות","其他書籤","Inksze zokłodki"],["Zakładki mobilne","Mobile bookmarks","Mobile Lesezeichen","Marcadores móviles","Favoris mobiles","סימניות מהנייד","行動書籤","Zokłodki mobilne"],["Menu zakładek","Bookmarks menu","Lesezeichenmenü","Menú de marcadores","Menu des favoris","תפריט סימניות","書籤選單","Menu zokłodek"],["Wyszukiwarka","Search engine","Suchmaschine","Buscador","Moteur de recherche","מנוע חיפוש","搜尋引擎","Szukajka"],["Używana, gdy w pasku adresu wpiszesz tekst zamiast adresu.","Used when you type text instead of an address in the address bar.","Wird verwendet, wenn du in der Adressleiste Text statt einer Adresse eingibst.","Se usa cuando escribes texto en lugar de una dirección en la barra de direcciones.","Utilisé lorsque vous saisissez du texte au lieu d’une adresse dans la barre d’adresse.","בשימוש כשמקלידים בסרגל הכתובות טקסט במקום כתובת.","在網址列輸入文字而非網址時使用。","Używano, jak we pasku adresu wpiszesz tekst zamiast adresu."],["Google (tylko wyniki WWW)","Google (web results only)","Google (nur Web-Ergebnisse)","Google (solo resultados web)","Google (résultats web uniquement)","Google (תוצאות אינטרנט בלבד)","Google（僅網頁結果）","Google (yno wyniki WWW)"],["Własna...","Custom...","Benutzerdefiniert...","Personalizado...","Personnalisé...","מותאם אישית...","自訂...","Włosno..."],["Wpisz adres wyszukiwania z %s w miejscu zapytania.","Enter a search URL with %s in place of the query.","Gib eine Such-URL mit %s anstelle der Suchanfrage ein.","Introduce una dirección de búsqueda con %s en lugar de la consulta.","Saisissez une adresse de recherche avec %s à la place de la requête.","הזן כתובת חיפוש עם %s במקום מילות החיפוש.","輸入搜尋網址，並以 %s 代表查詢內容。","Wpisz adres szukanio ze %s w placu zapytanio."],["Wyszukiwarka domyślna","Default search engine","Standardsuchmaschine","Buscador predeterminado","Moteur de recherche par défaut","מנוע חיפוש ברירת מחדל","預設搜尋引擎","Szukajka sztandardowo"],["Wyszukiwarka: ustawiono {n}","Search engine: set to {n}","Suchmaschine: {n} eingestellt","Buscador: configurado {n}","Moteur de recherche : {n} défini","מנוע חיפוש: הוגדר {n}","搜尋引擎：已設為 {n}","Szukajka: ustawiōno {n}"],["Wyszukiwarka: używasz domyślnej, nic do przeniesienia.","Search engine: you use the default one, nothing to transfer.","Suchmaschine: Du nutzt die Standardeinstellung, nichts zu übertragen.","Buscador: usas el predeterminado, no hay nada que trasladar.","Moteur de recherche : vous utilisez celui par défaut, rien à transférer.","מנוע חיפוש: אתה משתמש בברירת המחדל, אין מה להעביר.","搜尋引擎：您使用的是預設值，沒有需要轉移的內容。","Szukajka: używosz sztandardowyj, niy ma co przenojś."],["Wskaż folder profilu...","Choose profile folder...","Profilordner wählen...","Elegir carpeta del perfil...","Choisir le dossier du profil...","בחר תיקיית פרופיל...","選擇設定檔資料夾...","Wskaż folder profilu..."],["Gdy Twojej przeglądarki nie ma na liście (np. Opera GX w innej lokalizacji).","When your browser is not on the list (e.g. Opera GX in another location).","Wenn dein Browser nicht in der Liste ist (z. B. Opera GX an einem anderen Ort).","Cuando tu navegador no aparece en la lista (p. ej. Opera GX en otra ubicación).","Si votre navigateur ne figure pas dans la liste (p. ex. Opera GX à un autre emplacement).","כשהדפדפן שלך אינו ברשימה (למשל Opera GX במיקום אחר).","當您的瀏覽器不在清單中時（例如位於其他位置的 Opera GX）。","Jak Twojij przeglōndarki niy ma na liście (np. Opera GX we inkszyj lokalizacyji)."],["W tym folderze nie znaleziono danych przeglądarki.","No browser data found in this folder.","In diesem Ordner wurden keine Browserdaten gefunden.","No se encontraron datos de navegador en esta carpeta.","Aucune donnée de navigateur trouvée dans ce dossier.","לא נמצאו נתוני דפדפן בתיקייה זו.","在此資料夾中找不到瀏覽器資料。","We tym folderze niy znojdzōno danych przeglōndarki."],["Inna przeglądarka","Other browser","Anderer Browser","Otro navegador","Autre navigateur","דפדפן אחר","其他瀏覽器","Inksza przeglōndarka"],["Lista zadań (pola do odznaczania)","To-do list (checkboxes)","Aufgabenliste (Kontrollkästchen)","Lista de tareas (casillas)","Liste de tâches (cases à cocher)","רשימת משימות (תיבות סימון)","待辦清單（核取方塊）","Lista zadań (kwadraciki do ôdznaczanio)"],["Dodaj pozycję...","Add item...","Eintrag hinzufügen...","Añadir elemento...","Ajouter un élément...","הוסף פריט...","新增項目...","Dodej pozycyjõ..."],["Usuń pozycję","Delete item","Eintrag löschen","Eliminar elemento","Supprimer l’élément","מחק פריט","刪除項目","Wyciep pozycyjõ"],["Usuń wykonane","Clear completed","Erledigte entfernen","Quitar completadas","Supprimer les terminées","נקה שהושלמו","清除已完成","Wyciep zrobiōne"],["Wykonano {a} z {b}","{a} of {b} done","{a} von {b} erledigt","{a} de {b} hechas","{a} sur {b} terminées","{a} מתוך {b} הושלמו","已完成 {a}/{b}","Zrobiōne {a} ze {b}"],["Prywatność","Privacy","Datenschutz","Privacidad","Confidentialité","פרטיות","隱私","Prywatność"],["Uprawnienia stron","Site permissions","Website-Berechtigungen","Permisos de sitios","Autorisations des sites","הרשאות אתרים","網站權限","Uprawniynia zajtōw"],["Hasła","Passwords","Passwörter","Contraseñas","Mots de passe","סיסמאות","密碼","Hasła"],["Blokowanie reklam","Ad blocking","Werbeblocker","Bloqueo de anuncios","Blocage des publicités","חסימת פרסומות","廣告封鎖","Blokowanie reklam"],["Strony pytają o dostęp do kamery, mikrofonu, lokalizacji i innych funkcji. Tu zmienisz zapamiętane decyzje.","Sites ask for access to the camera, microphone, location and other features. Here you can change remembered decisions.","Websites fragen nach Zugriff auf Kamera, Mikrofon, Standort und weitere Funktionen. Hier änderst du gespeicherte Entscheidungen.","Los sitios piden acceso a la cámara, el micrófono, la ubicación y otras funciones. Aquí puedes cambiar las decisiones guardadas.","Les sites demandent l’accès à la caméra, au micro, à la position et à d’autres fonctions. Vous pouvez modifier ici les décisions enregistrées.","אתרים מבקשים גישה למצלמה, למיקרופון, למיקום ולתכונות נוספות. כאן אפשר לשנות החלטות שנשמרו.","網站會要求使用相機、麥克風、位置與其他功能。您可以在此變更已記住的決定。","Zajty pytajōm ô dostymp do kamery, mikrofōnu, lokalizacyji i inkszych funkcyji. Tukej zmiynisz spamiyntane decyzyje."],["Brak zapamiętanych decyzji.","No remembered decisions.","Keine gespeicherten Entscheidungen.","No hay decisiones guardadas.","Aucune décision enregistrée.","אין החלטות שמורות.","沒有已記住的決定。","Niy ma spamiyntanych decyzyji."],["Wyczyść wszystkie","Clear all","Alle löschen","Borrar todo","Tout effacer","נקה הכול","全部清除","Wyczyść wszyskie"],["Usuń decyzję","Remove decision","Entscheidung entfernen","Quitar decisión","Supprimer la décision","הסר החלטה","移除決定","Wyciep decyzyjõ"],["Wyczyścić zapamiętane uprawnienia?","Clear remembered permissions?","Gespeicherte Berechtigungen löschen?","¿Borrar los permisos guardados?","Effacer les autorisations enregistrées ?","לנקות הרשאות שמורות?","清除已記住的權限？","Wyczyścić spamiyntane uprawniynia?"],["Strony znów będą pytać o dostęp.","Sites will ask for access again.","Websites fragen wieder nach Zugriff.","Los sitios volverán a pedir acceso.","Les sites demanderont à nouveau l’accès.","אתרים יבקשו שוב גישה.","網站將再次要求存取權。","Zajty zasie byndōm pytać ô dostymp."],["Usunąć wszystkie zapisane hasła?","Delete all saved passwords?","Alle gespeicherten Passwörter löschen?","¿Eliminar todas las contraseñas guardadas?","Supprimer tous les mots de passe enregistrés ?","למחוק את כל הסיסמאות השמורות?","刪除所有已儲存的密碼？","Wyciepnōńć wszyskie zapisane hasła?"],["Tej operacji nie da się cofnąć.","This cannot be undone.","Das lässt sich nicht rückgängig machen.","Esta acción no se puede deshacer.","Cette action est irréversible.","לא ניתן לבטל פעולה זו.","此操作無法復原。","Tego niy idzie cofnōńć."],["Usuń wszystkie","Delete all","Alle löschen","Eliminar todo","Tout supprimer","מחק הכול","全部刪除","Wyciep wszyskie"],["Pokaż","Show","Anzeigen","Mostrar","Afficher","הצג","顯示","Pokŏż"],["Kopiuj","Copy","Kopieren","Copiar","Copier","העתק","複製","Kopiuj"],["Aktualizuj","Update","Aktualisieren","Actualizar","Mettre à jour","עדכן","更新","Aktualizuj"],["Nigdy dla tej strony","Never for this site","Nie für diese Website","Nunca para este sitio","Jamais pour ce site","לעולם לא עבור אתר זה","此網站永不儲存","Niy ôd nigdy dlŏ tyj zajty"],["brak nazwy","no name","kein Name","sin nombre","sans nom","ללא שם","無名稱","niy ma miana"],["Prośba o uprawnienie","Permission request","Berechtigungsanfrage","Solicitud de permiso","Demande d’autorisation","בקשת הרשאה","權限要求","Prośba ô uprawniynie"],["{s} chce uzyskać dostęp do:","{s} wants access to:","{s} möchte Zugriff auf:","{s} quiere acceder a:","{s} souhaite accéder à :","‏{s} מבקש גישה אל:","{s} 想要存取：","{s} chce uzyskać dostymp do:"],["Zezwól","Allow","Zulassen","Permitir","Autoriser","אפשר","允許","Zezwōl"],["Tylko tym razem","Only this time","Nur dieses Mal","Solo esta vez","Seulement cette fois","רק הפעם","僅此一次","Yno tym razym"],["Zablokuj","Block","Blockieren","Bloquear","Bloquer","חסום","封鎖","Zablokuj"],["Zezwól i Zablokuj zapamiętują decyzję dla tej strony. Zmienisz ją w Ustawienia → Prywatność.","Allow and Block remember the decision for this site. You can change it in Settings → Privacy.","Zulassen und Blockieren merken sich die Entscheidung für diese Website. Du kannst sie unter Einstellungen → Datenschutz ändern.","Permitir y Bloquear recuerdan la decisión para este sitio. Puedes cambiarla en Ajustes → Privacidad.","Autoriser et Bloquer mémorisent la décision pour ce site. Vous pouvez la modifier dans Paramètres → Confidentialité.","אפשר וחסום זוכרים את ההחלטה עבור אתר זה. ניתן לשנות אותה בהגדרות ← פרטיות.","「允許」與「封鎖」會記住此網站的決定。您可以在設定 → 隱私中變更。","Zezwōl i Zablokuj spamiyntujōm decyzyjõ dlŏ tyj zajty. Zmiynisz jã we Ustawiyniach → Prywatność."],["Kamera","Camera","Kamera","Cámara","Caméra","מצלמה","相機","Kamera"],["Mikrofon","Microphone","Mikrofon","Micrófono","Microphone","מיקרופון","麥克風","Mikrofōn"],["Kamera i mikrofon","Camera and microphone","Kamera und Mikrofon","Cámara y micrófono","Caméra et microphone","מצלמה ומיקרופון","相機與麥克風","Kamera i mikrofōn"],["Kamera lub mikrofon","Camera or microphone","Kamera oder Mikrofon","Cámara o micrófono","Caméra ou microphone","מצלמה או מיקרופון","相機或麥克風","Kamera abo mikrofōn"],["Lokalizacja","Location","Standort","Ubicación","Position","מיקום","位置","Lokalizacyjŏ"],["Powiadomienia","Notifications","Benachrichtigungen","Notificaciones","Notifications","התראות","通知","Powiadomiynia"],["Odczyt schowka","Clipboard access","Zugriff auf die Zwischenablage","Acceso al portapapeles","Accès au presse-papiers","גישה ללוח","讀取剪貼簿","Ôdczyt skłodka"],["Udostępnianie ekranu","Screen sharing","Bildschirmfreigabe","Compartir pantalla","Partage d’écran","שיתוף מסך","螢幕分享","Udostympnianie ekranu"],["Urządzenia MIDI","MIDI devices","MIDI-Geräte","Dispositivos MIDI","Périphériques MIDI","התקני MIDI","MIDI 裝置","Zorzōdzynia MIDI"],["Wykrywanie bezczynności","Idle detection","Inaktivitätserkennung","Detección de inactividad","Détection d’inactivité","זיהוי חוסר פעילות","偵測閒置","Wykrywanie bezczynności"],["Zarządzanie oknami","Window management","Fensterverwaltung","Gestión de ventanas","Gestion des fenêtres","ניהול חלונות","視窗管理","Zarzōndzanie ôknami"],["Dostęp do danych strony w innych witrynach","Access to site data on other sites","Zugriff auf Website-Daten auf anderen Websites","Acceso a datos del sitio en otros sitios","Accès aux données du site sur d’autres sites","גישה לנתוני האתר באתרים אחרים","在其他網站存取此網站的資料","Dostymp do danych zajty na inkszych zajtach"],["Otwieranie zewnętrznych aplikacji","Opening external apps","Externe Apps öffnen","Abrir aplicaciones externas","Ouverture d’applications externes","פתיחת יישומים חיצוניים","開啟外部應用程式","Ôtwiyranie zewnyntrznych aplikacyji"],["Dostęp do plików","File access","Dateizugriff","Acceso a archivos","Accès aux fichiers","גישה לקבצים","檔案存取","Dostymp do zbiorōw"],["Wypełnić dane logowania w {h}?","Fill in login details on {h}?","Anmeldedaten auf {h} ausfüllen?","¿Rellenar los datos de inicio de sesión en {h}?","Remplir les identifiants sur {h} ?","למלא פרטי התחברות ב-{h}?","要在 {h} 填入登入資料嗎？","Wypołnić dane logowanio na {h}?"],["Zapisać hasło dla {u} w {h}?","Save password for {u} on {h}?","Passwort für {u} auf {h} speichern?","¿Guardar la contraseña de {u} en {h}?","Enregistrer le mot de passe de {u} sur {h} ?","לשמור את הסיסמה של {u} ב-{h}?","要儲存 {u} 在 {h} 的密碼嗎？","Zapisać hasło dlŏ {u} na {h}?"],["Zaktualizować hasło dla {u} w {h}?","Update password for {u} on {h}?","Passwort für {u} auf {h} aktualisieren?","¿Actualizar la contraseña de {u} en {h}?","Mettre à jour le mot de passe de {u} sur {h} ?","לעדכן את הסיסמה של {u} ב-{h}?","要更新 {u} 在 {h} 的密碼嗎？","Zaktualizować hasło dlŏ {u} na {h}?"],["Proponuj zapisywanie haseł","Offer to save passwords","Speichern von Passwörtern anbieten","Ofrecer guardar contraseñas","Proposer d’enregistrer les mots de passe","הצע לשמור סיסמאות","提示儲存密碼","Proponuj zapisowanie hasłōw"],["Hasła są szyfrowane przez system Windows. Chroni to plik przed odczytem z innego konta lub komputera, ale nie przed osobą korzystającą z Twojej sesji.","Passwords are encrypted by Windows. This protects the file from being read from another account or computer, but not from someone using your session.","Passwörter werden von Windows verschlüsselt. Das schützt die Datei vor dem Lesen von einem anderen Konto oder Computer, nicht aber vor jemandem, der deine Sitzung nutzt.","Windows cifra las contraseñas. Esto protege el archivo de lecturas desde otra cuenta u otro equipo, pero no de alguien que use tu sesión.","Les mots de passe sont chiffrés par Windows. Cela protège le fichier contre une lecture depuis un autre compte ou ordinateur, mais pas contre une personne utilisant votre session.","הסיסמאות מוצפנות על ידי Windows. זה מגן על הקובץ מקריאה מחשבון או ממחשב אחר, אך לא מפני מי שמשתמש בהפעלה שלך.","密碼由 Windows 加密。這可防止檔案被其他帳戶或電腦讀取，但無法防止使用您工作階段的人。","Hasła sōm szyfrowane bez system Windows. To chrōni zbiōr przed ôdczytym ze inkszego kōnta abo kōmputra, ale niy przed ôsobōm, kero używo Twojij sesyji."],["Szyfrowanie systemowe jest niedostępne. Sejf haseł nie działa.","System encryption is unavailable. The password vault does not work.","Die Systemverschlüsselung ist nicht verfügbar. Der Passwort-Tresor funktioniert nicht.","El cifrado del sistema no está disponible. La caja de contraseñas no funciona.","Le chiffrement du système est indisponible. Le coffre de mots de passe ne fonctionne pas.","הצפנת המערכת אינה זמינה. כספת הסיסמאות אינה פועלת.","系統加密無法使用，密碼保險庫無法運作。","Szyfrowanie systymowe niy je dostympne. Sejf hasłōw niy dziŏła."],["Brak zapisanych haseł.","No saved passwords.","Keine gespeicherten Passwörter.","No hay contraseñas guardadas.","Aucun mot de passe enregistré.","אין סיסמאות שמורות.","沒有已儲存的密碼。","Niy ma zapisanych hasłōw."],["Blokuj reklamy i śledzące skrypty","Block ads and tracking scripts","Werbung und Tracking-Skripte blockieren","Bloquear anuncios y scripts de rastreo","Bloquer les publicités et les scripts de suivi","חסום פרסומות וסקריפטי מעקב","封鎖廣告與追蹤指令碼","Blokuj reklamy i śledzōnce skrypty"],["Blokuje żądania do znanych sieci reklamowych i trackerów, gdy pochodzą z innej witryny. To proste filtrowanie po domenach: nie usuwa reklam wbudowanych w stronę (np. w YouTube).","Blocks requests to known ad networks and trackers when they come from another site. This is simple domain filtering: it does not remove ads built into the page (e.g. on YouTube).","Blockiert Anfragen an bekannte Werbenetzwerke und Tracker, wenn sie von einer anderen Website stammen. Das ist einfaches Domain-Filtern: Es entfernt keine in die Seite eingebaute Werbung (z. B. bei YouTube).","Bloquea las solicitudes a redes publicitarias y rastreadores conocidos cuando proceden de otro sitio. Es un filtrado simple por dominios: no elimina los anuncios integrados en la página (p. ej. en YouTube).","Bloque les requêtes vers des réseaux publicitaires et traqueurs connus lorsqu’elles proviennent d’un autre site. C’est un simple filtrage par domaine : il ne supprime pas les publicités intégrées à la page (p. ex. sur YouTube).","חוסם בקשות לרשתות פרסום ולמעקבים מוכרים כשהן מגיעות מאתר אחר. זהו סינון פשוט לפי דומיינים: הוא אינו מסיר פרסומות המשובצות בדף (למשל ביוטיוב).","封鎖來自其他網站、前往已知廣告網路與追蹤器的要求。這是簡單的網域過濾，不會移除內嵌於頁面的廣告（例如 YouTube）。","Blokuje żōndania do znanych sieci reklamowych i trackerōw, jak ôd inkszyj zajty przichodzōm. To prosty filtr po domynach: niy wycieje reklam wbudowanych we zajta (np. we YouTube)."],["Zablokowano w tej sesji: {n}","Blocked this session: {n}","In dieser Sitzung blockiert: {n}","Bloqueado en esta sesión: {n}","Bloqué pendant cette session : {n}","נחסמו בהפעלה זו: {n}","本次工作階段已封鎖：{n}","Zablokowane w tyj sesyji: {n}"],["Szukaj na stronie...","Find on page...","Auf der Seite suchen...","Buscar en la página...","Rechercher dans la page...","חפש בדף...","在頁面中尋找...","Szukej na zajcie..."],["Poprzednie","Previous","Zurück","Anterior","Précédent","הקודם","上一個","Piyrwsze"],["Następne","Next","Weiter","Siguiente","Suivant","הבא","下一個","Nastympne"],["{a} z {b}","{a} of {b}","{a} von {b}","{a} de {b}","{a} sur {b}","{a} מתוך {b}","{a}/{b}","{a} ze {b}"],["Brak wyników","No results","Keine Ergebnisse","Sin resultados","Aucun résultat","אין תוצאות","沒有結果","Niy ma wynikōw"],["Przywróć powiększenie 100%","Reset zoom to 100%","Zoom auf 100 % zurücksetzen","Restablecer zoom al 100 %","Rétablir le zoom à 100 %","אפס את הזום ל-100%","將縮放重設為 100%","Przywrōć powiynkszynie 100%"],["Strona","Page","Seite","Página","Page","דף","頁面","Zajta"],["Szukaj na stronie","Find on page","Auf der Seite suchen","Buscar en la página","Rechercher dans la page","חפש בדף","在頁面中尋找","Szukej na zajcie"],["Powiększ stronę","Zoom in","Seite vergrößern","Acercar página","Agrandir la page","הגדל דף","放大頁面","Powiynksz zajtã"],["Pomniejsz stronę","Zoom out","Seite verkleinern","Alejar página","Réduire la page","הקטן דף","縮小頁面","Pōmniyjsz zajtã"],["Zresetuj powiększenie","Reset zoom","Zoom zurücksetzen","Restablecer zoom","Réinitialiser le zoom","אפס זום","重設縮放","Zresetuj powiynkszynie"],["Drukuj stronę","Print page","Seite drucken","Imprimir página","Imprimer la page","הדפס דף","列印頁面","Drukuj zajtã"],["Narzędzia deweloperskie strony","Page developer tools","Entwicklertools der Seite","Herramientas de desarrollo de la página","Outils de développement de la page","כלי מפתחים של הדף","頁面開發人員工具","Nŏrzyndzia deweloperske zajty"],["Narzędzia deweloperskie interfejsu","Interface developer tools","Entwicklertools der Oberfläche","Herramientas de desarrollo de la interfaz","Outils de développement de l’interface","כלי מפתחים של הממשק","介面開發人員工具","Nŏrzyndzia deweloperske interfejsu"],["Przypięte karty","Pinned tabs","Angeheftete Tabs","Pestañas fijadas","Onglets épinglés","כרטיסיות נעוצות","釘選的分頁","Przipniynte karty"],["Gdzie wyświetlać przypięte karty. Kartę można przypiąć, przeciągając ją nad wybrany pasek.","Where to show pinned tabs. You can pin a tab by dragging it over the chosen bar.","Wo angeheftete Tabs angezeigt werden. Ein Tab lässt sich anheften, indem man ihn über die gewählte Leiste zieht.","Dónde mostrar las pestañas fijadas. Puedes fijar una pestaña arrastrándola sobre la barra elegida.","Où afficher les onglets épinglés. Vous pouvez épingler un onglet en le faisant glisser sur la barre choisie.","היכן להציג כרטיסיות נעוצות. אפשר לנעוץ כרטיסייה על ידי גרירתה מעל הסרגל שנבחר.","釘選分頁的顯示位置。將分頁拖曳到所選的列上即可釘選。","Kaj pokazować przipniynte karty. Karta idzie przipnōńć, cióngnōnc jã nad wybrany pasek."],["Pasek u góry","Top bar","Leiste oben","Barra superior","Barre du haut","סרגל עליון","頂部列","Pasek na wiyrchu"],["Lewy pasek pod folderami","Left bar below folders","Linke Leiste unter den Ordnern","Barra izquierda bajo las carpetas","Barre de gauche sous les dossiers","הסרגל השמאלי מתחת לתיקיות","左側列（資料夾下方）","Lewy pasek pod folderōma"],["Logowanie na stronach","Signing in to websites","Anmeldung auf Websites","Inicio de sesión en sitios web","Connexion aux sites web","התחברות לאתרים","網站登入","Logowanie na zajtach"],["Zgodność z logowaniem do konta Google","Google account sign-in compatibility","Kompatibilität mit der Google-Kontoanmeldung","Compatibilidad con el inicio de sesión de Google","Compatibilité avec la connexion au compte Google","תאימות להתחברות לחשבון Google","Google 帳戶登入相容性","Zgodność z logowaniym do kōnta Google"],["Google blokuje logowanie w przeglądarkach, które nie wyglądają jak Chrome („Ta przeglądarka lub aplikacja może nie być bezpieczna”). Ta opcja dodaje na stronach elementy, które ma Chrome, a których brakuje Arkanie. Wyłącz ją tylko wtedy, gdy przez nią jakaś strona nie działa. Zmiana działa po odświeżeniu strony.","Google blocks sign-in in browsers that do not look like Chrome (“This browser or app may not be secure”). This option adds to websites the parts that Chrome has and Arkana lacks. Turn it off only if a website stops working because of it. The change applies after reloading the page.","Google blockiert die Anmeldung in Browsern, die nicht wie Chrome aussehen („Dieser Browser oder diese App ist möglicherweise nicht sicher“). Diese Option ergänzt auf Websites die Teile, die Chrome hat und Arkana fehlen. Schalte sie nur aus, wenn eine Website deswegen nicht funktioniert. Die Änderung gilt nach dem Neuladen der Seite.","Google bloquea el inicio de sesión en navegadores que no parecen Chrome («Es posible que este navegador o esta aplicación no sean seguros»). Esta opción añade en los sitios las partes que tiene Chrome y le faltan a Arkana. Desactívala solo si algún sitio deja de funcionar por ella. El cambio se aplica al recargar la página.","Google bloque la connexion dans les navigateurs qui ne ressemblent pas à Chrome (« Ce navigateur ou cette application ne sont peut-être pas sécurisés »). Cette option ajoute aux sites les éléments que Chrome possède et qui manquent à Arkana. Ne la désactivez que si un site ne fonctionne plus à cause d’elle. Le changement s’applique après l’actualisation de la page.","Google חוסמת התחברות בדפדפנים שאינם נראים כמו Chrome („ייתכן שהדפדפן או האפליקציה אינם מאובטחים”). אפשרות זו מוסיפה לאתרים רכיבים שיש ב-Chrome וחסרים ב-Arkana. כבה אותה רק אם אתר כלשהו מפסיק לעבוד בגללה. השינוי חל לאחר רענון הדף.","Google 會封鎖看起來不像 Chrome 的瀏覽器登入（「這個瀏覽器或應用程式可能不安全」）。此選項會在網站上補上 Chrome 具備而 Arkana 缺少的部分。只有在某個網站因此無法運作時才關閉它。變更會在重新整理頁面後生效。","Google blokuje logowanie w przeglōndarkach, kere niy wyglōndajōm jak Chrome („Ta przeglōndarka abo aplikacyjŏ może niy być bezpiecznŏ”). Ta ôpcyjŏ dodŏwŏ na zajtach tyn kōnsek, kery mŏ Chrome, a kerego brakuje Arkanie. Wyłōncz jã ino wtedy, jak bez nia jakŏ zajta niy działŏ. Zmiana działŏ po ôdświyżyniu zajty."],["Pozwalaj stronom używać kluczy dostępu (Windows Hello)","Allow websites to use passkeys (Windows Hello)","Websites die Verwendung von Passkeys erlauben (Windows Hello)","Permitir que los sitios usen llaves de acceso (Windows Hello)","Autoriser les sites à utiliser des clés d’accès (Windows Hello)","לאפשר לאתרים להשתמש במפתחות גישה (Windows Hello)","允許網站使用密碼金鑰（Windows Hello）","Przizwŏlej zajtōm używać kluczy dostympu (Windows Hello)"],["Gdy ta opcja jest wyłączona, strony nie mogą otworzyć systemowego okna „Zaloguj się przy użyciu klucza dostępu” i proponują logowanie hasłem. Zmiana działa po odświeżeniu strony.","When this option is off, websites cannot open the system “Sign in with a passkey” window and offer password sign-in instead. The change applies after reloading the page.","Ist diese Option aus, können Websites das Systemfenster „Mit einem Passkey anmelden“ nicht öffnen und bieten stattdessen die Anmeldung mit Passwort an. Die Änderung gilt nach dem Neuladen der Seite.","Si esta opción está desactivada, los sitios no pueden abrir la ventana del sistema «Iniciar sesión con una llave de acceso» y ofrecen iniciar sesión con contraseña. El cambio se aplica al recargar la página.","Lorsque cette option est désactivée, les sites ne peuvent pas ouvrir la fenêtre système « Se connecter avec une clé d’accès » et proposent la connexion par mot de passe. Le changement s’applique après l’actualisation de la page.","כשאפשרות זו כבויה, אתרים לא יכולים לפתוח את חלון המערכת „היכנס באמצעות מפתח גישה” ומציעים התחברות עם סיסמה. השינוי חל לאחר רענון הדף.","關閉此選項時，網站無法開啟系統的「使用密碼金鑰登入」視窗，而會改為提供密碼登入。變更會在重新整理頁面後生效。","Jak ta ôpcyjŏ je wyłōnczōnŏ, zajty niy poradzōm ôtworzić systymowego ôkna „Zaloguj sie kluczym dostympu” i dajōm logowanie hasłym. Zmiana działŏ po ôdświyżyniu zajty."],["Nowe okno","New window","Neues Fenster","Nueva ventana","Nouvelle fenêtre","חלון חדש","新視窗","Nowe ôkno"],["Nowe okno incognito","New incognito window","Neues Inkognitofenster","Nueva ventana de incógnito","Nouvelle fenêtre de navigation privée","חלון גלישה בסתר חדש","新增無痕式視窗","Nowe ôkno incognito"],["Otwórz kartę w oknie incognito","Open tab in incognito window","Tab in Inkognitofenster öffnen","Abrir pestaña en ventana de incógnito","Ouvrir l’onglet dans une fenêtre de navigation privée","פתח כרטיסייה בחלון גלישה בסתר","在無痕式視窗中開啟分頁","Ôtwōrz kartã w ôknie incognito"],["Otwórz folder w oknie incognito","Open folder in incognito window","Ordner in Inkognitofenster öffnen","Abrir carpeta en ventana de incógnito","Ouvrir le dossier dans une fenêtre de navigation privée","פתח תיקייה בחלון גלישה בסתר","在無痕式視窗中開啟資料夾","Ôtwōrz folder w ôknie incognito"],["Menu","Menu","Menü","Menú","Menu","תפריט","選單","Menu"],["Incognito","Incognito","Inkognito","Incógnito","Incognito","גלישה בסתר","無痕","Incognito"],["Ikona aplikacji","App icon","App-Symbol","Icono de la aplicación","Icône de l’application","סמל האפליקציה","應用程式圖示","Ikōna aplikacyje"],["Ikona aplikacji w kolorach motywu","App icon in theme colours","App-Symbol in Designfarben","Icono de la aplicación con los colores del tema","Icône de l’application aux couleurs du thème","סמל האפליקציה בצבעי ערכת הנושא","應用程式圖示使用主題色彩","Ikōna aplikacyje w farbach motywu"],["Ikona Arkany na pasku zadań (także przypiętej) przyjmuje kolory motywu. Po wyłączeniu wraca oryginalna ikona. Zmiana działa od razu.","The Arkana icon on the taskbar (also when pinned) takes the theme colors. When turned off, the original icon returns. The change takes effect immediately.","Das Arkana-Symbol in der Taskleiste (auch angeheftet) übernimmt die Farben des Designs. Beim Ausschalten kehrt das Originalsymbol zurück. Die Änderung wirkt sofort.","El icono de Arkana en la barra de tareas (también anclado) adopta los colores del tema. Al desactivarlo vuelve el icono original. El cambio se aplica al instante.","L’icône d’Arkana dans la barre des tâches (même épinglée) prend les couleurs du thème. Une fois désactivée, l’icône d’origine revient. Le changement est immédiat.","הסמל של Arkana בשורת המשימות (גם כשהוא מוצמד) מקבל את צבעי ערכת הנושא. בכיבוי חוזר הסמל המקורי. השינוי חל מיד.","工作列上的 Arkana 圖示（包括已釘選的）會採用主題色彩。關閉後會恢復原始圖示。變更會立即生效。","Ikōna Arkany na pasku zadań (tyż przipniyntego) bierze farby motywu. Po wyłōnczyniu wraco ôryginalno ikōna. Zmiana robi richtich."],["Przypnij we wszystkich folderach","Pin in all folders","In allen Ordnern anheften","Fijar en todas las carpetas","Épingler dans tous les dossiers","נעץ בכל התיקיות","在所有資料夾中釘選","Przipnij we wszyjskich folderach"],["Odepnij ze wszystkich folderów","Unpin from all folders","Aus allen Ordnern lösen","Desfijar de todas las carpetas","Désépingler de tous les dossiers","בטל נעיצה מכל התיקיות","從所有資料夾取消釘選","Ôdepnij ze wszyjskich folderōw"],["Przypnij tylko w tym folderze","Pin in this folder only","Nur in diesem Ordner anheften","Fijar solo en esta carpeta","Épingler uniquement dans ce dossier","נעץ רק בתיקייה זו","僅在此資料夾中釘選","Przipnij ino w tym folderze"],["Przypnij / odepnij we wszystkich folderach","Pin / unpin in all folders","In allen Ordnern anheften / lösen","Fijar / desfijar en todas las carpetas","Épingler / désépingler dans tous les dossiers","נעץ / בטל נעיצה בכל התיקיות","在所有資料夾中釘選／取消釘選","Przipnij / ôdepnij we wszyjskich folderach"],["Strona jest teraz przypięta we wszystkich folderach","The page is now pinned in all folders","Die Seite ist jetzt in allen Ordnern angeheftet","La página ya está fijada en todas las carpetas","La page est maintenant épinglée dans tous les dossiers","הדף נעוץ עכשיו בכל התיקיות","此頁面現已在所有資料夾中釘選","Zajta je teraz przipniyntŏ we wszyjskich folderach"],["Krok {n}/{m}","Step {n}/{m}","Schritt {n}/{m}","Paso {n}/{m}","Étape {n}/{m}","שלב {n}/{m}","步驟 {n}/{m}","Krok {n}/{m}"],["Pomiń poradnik","Skip the tour","Einführung überspringen","Omitir la guía","Passer le guide","דלג על המדריך","略過導覽","Pominij poradnik"],["Następny krok","Next","Weiter","Siguiente","Suivant","הבא","下一步","Nastympny krok"],["Zakończ","Finish","Fertig","Finalizar","Terminer","סיום","完成","Zakōńcz"],["Witaj w Arkanie","Welcome to Arkana","Willkommen bei Arkana","Te damos la bienvenida a Arkana","Bienvenue dans Arkana","ברוכים הבאים ל־Arkana","歡迎使用 Arkana","Witej w Arkanie"],["Ten krótki poradnik pokaże Ci najważniejsze miejsca interfejsu i do czego służą. Możesz go w każdej chwili pominąć.","This short tour shows you the most important parts of the interface and what they do. You can skip it at any time.","Diese kurze Einführung zeigt dir die wichtigsten Stellen der Oberfläche und wofür sie da sind. Du kannst sie jederzeit überspringen.","Esta breve guía te muestra las partes más importantes de la interfaz y para qué sirven. Puedes omitirla en cualquier momento.","Ce court guide vous présente les éléments les plus importants de l’interface et leur rôle. Vous pouvez le passer à tout moment.","המדריך הקצר הזה יראה לך את המקומות החשובים בממשק ולמה הם משמשים. אפשר לדלג עליו בכל רגע.","這份簡短的導覽會帶你認識介面中最重要的部分及其用途。你可以隨時略過。","Tyn krōtki poradnik pokŏże ci nojważniejsze mijsca interfejsu i do czego służōm. Możesz go w kożdyj chwili pominōńć."],["Logo i nawigacja","Logo and navigation","Logo und Navigation","Logotipo y navegación","Logo et navigation","לוגו וניווט","標誌與導覽","Logo i nawigacyjŏ"],["Logo Arkany wraca do strony startowej. Strzałki cofają i przesuwają do przodu historię karty, a przycisk obok odświeża stronę.","The Arkana logo takes you back to the start page. The arrows move back and forward in the tab’s history, and the button next to them reloads the page.","Das Arkana-Logo führt zurück zur Startseite. Die Pfeile gehen im Verlauf des Tabs zurück und vor, die Schaltfläche daneben lädt die Seite neu.","El logotipo de Arkana te lleva a la página de inicio. Las flechas retroceden y avanzan en el historial de la pestaña, y el botón contiguo recarga la página.","Le logo d’Arkana ramène à la page d’accueil. Les flèches reculent et avancent dans l’historique de l’onglet, et le bouton voisin actualise la page.","הלוגו של Arkana מחזיר לדף הבית. החיצים עוברים אחורה וקדימה בהיסטוריית הכרטיסייה, והכפתור לידם מרענן את הדף.","Arkana 標誌會帶你回到首頁。箭頭可在分頁的歷史記錄中往前或往後，旁邊的按鈕則會重新整理頁面。","Logo Arkany wraco na sztartowo zajta. Strzołki cofajōm i posuwajōm do przodku historyjo karty, a knefel ôbok ôdświyżo zajta."],["Wpisz tu adres strony albo pytanie. Adres otworzy się od razu, a tekst zostanie wyszukany wybraną wyszukiwarką.","Type a web address or a question here. An address opens right away, and any other text is searched with your chosen search engine.","Gib hier eine Webadresse oder eine Frage ein. Eine Adresse wird sofort geöffnet, anderer Text wird mit der gewählten Suchmaschine gesucht.","Escribe aquí una dirección web o una pregunta. La dirección se abre al instante y cualquier otro texto se busca con el buscador elegido.","Saisissez ici une adresse web ou une question. Une adresse s’ouvre aussitôt, et tout autre texte est recherché avec le moteur choisi.","הקלד כאן כתובת אתר או שאלה. כתובת תיפתח מיד, וכל טקסט אחר יחופש במנוע החיפוש שבחרת.","在這裡輸入網址或問題。網址會立即開啟，其他文字則會用你選擇的搜尋引擎搜尋。","Wpisz tukej adres zajty abo pytanie. Adres sie ôtwiyro richtich, a tekst bydzie szukany wybranōm szukiwarkōm."],["Każda strona to osobna karta. Plus dodaje nową kartę, a prawy przycisk myszy na karcie otwiera jej menu. Karty możesz przeciągać, by zmienić ich kolejność.","Every page is a separate tab. The plus button adds a new tab, and right-clicking a tab opens its menu. You can drag tabs to change their order.","Jede Seite ist ein eigener Tab. Mit dem Plus öffnest du einen neuen Tab, und ein Rechtsklick auf einen Tab öffnet sein Menü. Du kannst Tabs ziehen, um sie neu anzuordnen.","Cada página es una pestaña independiente. El botón más añade una pestaña nueva y el clic derecho sobre una pestaña abre su menú. Puedes arrastrar las pestañas para reordenarlas.","Chaque page est un onglet distinct. Le bouton plus ajoute un onglet et un clic droit sur un onglet ouvre son menu. Vous pouvez faire glisser les onglets pour les réorganiser.","כל דף הוא כרטיסייה נפרדת. כפתור הפלוס מוסיף כרטיסייה חדשה, וקליק ימני על כרטיסייה פותח את התפריט שלה. אפשר לגרור כרטיסיות כדי לשנות את סדרן.","每個網頁都是獨立的分頁。加號按鈕會新增分頁，在分頁上按右鍵可開啟其選單。你也可以拖曳分頁來調整順序。","Kożdo zajta to ôsobno karta. Plusik dodowo nowõ karta, a prawy knefel myszy na karcie ôtwiyro jeji menu. Karty idzie przeciōng, coby zmiynić ich kolyjność."],["Tu pojawiają się przypięte karty. Przypinasz je z menu prawego przycisku na karcie – zajmują mało miejsca i są zawsze pod ręką.","Pinned tabs appear here. Pin one from the right-click menu on a tab – they take little space and are always at hand.","Hier erscheinen angeheftete Tabs. Du heftest sie über das Rechtsklick-Menü eines Tabs an – sie brauchen wenig Platz und sind immer griffbereit.","Aquí aparecen las pestañas fijadas. Las fijas desde el menú del clic derecho de una pestaña: ocupan poco espacio y siempre están a mano.","Les onglets épinglés apparaissent ici. On les épingle depuis le menu du clic droit sur un onglet : ils prennent peu de place et restent toujours à portée de main.","כאן מופיעות כרטיסיות נעוצות. נועצים אותן מתפריט הקליק הימני של כרטיסייה – הן תופסות מעט מקום ותמיד בהישג יד.","釘選的分頁會顯示在這裡。從分頁的右鍵選單即可釘選，它們佔用空間很小，隨時可用。","Tukej sie zjawiajōm przipniynte karty. Przipinosz je z menu prawego kneflika na karcie – zajmujōm mało placu i sōm zawdy pod rynkōm."],["Foldery to osobne zestawy kart, np. Praca i Prywatne. Kliknij folder, by do niego przejść, a przerywany przycisk na dole dodaje nowy. Prawy przycisk otwiera opcje folderu.","Folders are separate sets of tabs, for example Work and Private. Click a folder to switch to it, and the dashed button at the bottom adds a new one. Right-click opens the folder’s options.","Ordner sind getrennte Tab-Gruppen, zum Beispiel Arbeit und Privat. Klicke auf einen Ordner, um zu ihm zu wechseln; die gestrichelte Schaltfläche unten legt einen neuen an. Ein Rechtsklick öffnet die Ordneroptionen.","Las carpetas son conjuntos independientes de pestañas, por ejemplo Trabajo y Privado. Haz clic en una carpeta para cambiar a ella; el botón de borde discontinuo de abajo crea una nueva. El clic derecho abre las opciones de la carpeta.","Les dossiers sont des ensembles d’onglets distincts, par exemple Travail et Privé. Cliquez sur un dossier pour y passer ; le bouton en pointillés en bas en crée un nouveau. Le clic droit ouvre ses options.","תיקיות הן קבוצות נפרדות של כרטיסיות, למשל עבודה ופרטי. לחץ על תיקייה כדי לעבור אליה, והכפתור המקווקו בתחתית מוסיף תיקייה חדשה. קליק ימני פותח את אפשרויות התיקייה.","資料夾是各自獨立的分頁組合，例如「工作」和「私人」。點一下資料夾即可切換，底部的虛線按鈕可新增資料夾，按右鍵則可開啟資料夾選項。","Foldery to ôsobne zestawy kart, np. Robota i Prywatne. Kliknij folder, coby do niego przejś, a przerywany knefel na dole dodowo nowy. Prawy knefel ôtwiyro ôpcyje folderu."],["Tu zmienisz motyw i kolory, wygląd interfejsu, skróty klawiszowe, prywatność i blokowanie reklam oraz język. Stąd też uruchomisz ten poradnik ponownie.","Here you change the theme and colors, the look of the interface, keyboard shortcuts, privacy and ad blocking, and the language. You can also start this tour again from here.","Hier änderst du Design und Farben, das Aussehen der Oberfläche, Tastenkürzel, Datenschutz, Werbeblocker und die Sprache. Von hier aus kannst du diese Einführung auch erneut starten.","Aquí cambias el tema y los colores, el aspecto de la interfaz, los atajos de teclado, la privacidad, el bloqueo de anuncios y el idioma. Desde aquí también puedes volver a iniciar esta guía.","Ici, vous changez le thème et les couleurs, l’aspect de l’interface, les raccourcis clavier, la confidentialité, le blocage des publicités et la langue. Vous pouvez aussi relancer ce guide depuis ici.","כאן משנים את הערכה והצבעים, את מראה הממשק, קיצורי מקלדת, פרטיות, חסימת פרסומות ושפה. מכאן אפשר גם להפעיל את המדריך הזה מחדש.","你可以在這裡更改主題與色彩、介面外觀、鍵盤快速鍵、隱私與廣告封鎖，以及語言。也可以從這裡重新啟動這份導覽。","Tukej zmiyniosz motyw i farby, wyglōnd interfejsu, skrōty klawiszowe, prywatnōść i blokowanie reklōm a tyż godka. Stōnd tyż włōnczysz tyn poradnik zaś."],["Otwiera boczny panel z asystentem AI obok przeglądanej strony. Zaloguj się w nim raz, a potem zadawaj pytania, nie opuszczając strony.","Opens a side panel with the AI assistant next to the page you are viewing. Sign in once, then ask questions without leaving the page.","Öffnet neben der angezeigten Seite ein Seitenpanel mit dem KI-Assistenten. Einmal anmelden, dann Fragen stellen, ohne die Seite zu verlassen.","Abre un panel lateral con el asistente de IA junto a la página que estás viendo. Inicia sesión una vez y luego haz preguntas sin salir de la página.","Ouvre un panneau latéral avec l’assistant IA à côté de la page affichée. Connectez-vous une fois, puis posez vos questions sans quitter la page.","פותח לוח צד עם עוזר הבינה המלאכותית לצד הדף שאתה צופה בו. מתחברים פעם אחת ואז אפשר לשאול שאלות בלי לעזוב את הדף.","在你瀏覽的頁面旁開啟內含 AI 助理的側邊面板。只需登入一次，之後就能在不離開頁面的情況下提問。","Ôtwiyro boczny panel z asystyntym AI ôbok ôglōndanyj zajty. Zalogujesz sie roz, a potym pytosz, niy ôpuszczajōnc zajty."],["Pasek z wbudowanymi programami i grami, takimi jak kalkulator, notatnik, zegar czy konwerter. Otwierają się w pływających oknach, które możesz przesuwać.","A bar with built-in programs and games such as a calculator, notepad, clock and converter. They open in floating windows that you can move around.","Eine Leiste mit eingebauten Programmen und Spielen wie Rechner, Notizblock, Uhr und Umrechner. Sie öffnen sich in schwebenden Fenstern, die du verschieben kannst.","Una barra con programas y juegos integrados, como calculadora, bloc de notas, reloj y conversor. Se abren en ventanas flotantes que puedes mover.","Une barre de programmes et de jeux intégrés, comme la calculatrice, le bloc-notes, l’horloge et le convertisseur. Ils s’ouvrent dans des fenêtres flottantes que vous pouvez déplacer.","סרגל של תוכנות ומשחקים מובנים, כמו מחשבון, פנקס רשימות, שעון וממיר. הם נפתחים בחלונות צפים שאפשר להזיז.","內建程式與遊戲的列，例如計算機、記事本、時鐘和轉換器。它們會在可移動的浮動視窗中開啟。","Pasek z wbudowanymi programami i grami, jak kalkulator, notatnik, zygor abo kōnwerter. Ôtwiyrajōm sie we pływajōncych ôknach, kere idzie przesuwać."],["Pokazuje listę odwiedzonych stron z wyszukiwarką. Zapisywanie historii i czas jej przechowywania ustawisz w Ustawieniach.","Shows the list of visited pages with a search box. You can set whether history is saved and how long it is kept in Settings.","Zeigt die Liste der besuchten Seiten mit Suchfeld. Ob der Verlauf gespeichert wird und wie lange, stellst du in den Einstellungen ein.","Muestra la lista de páginas visitadas con un buscador. En Ajustes puedes elegir si se guarda el historial y durante cuánto tiempo.","Affiche la liste des pages visitées avec un champ de recherche. Dans les paramètres, vous choisissez si l’historique est enregistré et pendant combien de temps.","מציג את רשימת הדפים שנצפו עם חיפוש. בהגדרות אפשר לקבוע אם ההיסטוריה נשמרת ולכמה זמן.","顯示已瀏覽頁面的清單並提供搜尋。是否儲存歷史記錄以及保留多久，可在設定中調整。","Pokazuje lista ôdwiydzōnych zajt z szukiwarkōm. Zapisowanie historyje i czas jeji trzimanio ustawisz w Ustawiyniach."],["Znajdziesz tu nowe okno, okno incognito bez zapisywania historii, szukanie na stronie, drukowanie i skrót do Ustawień.","Here you will find a new window, an incognito window that does not save history, find on page, printing and a shortcut to Settings.","Hier findest du ein neues Fenster, ein Inkognitofenster ohne Verlauf, die Suche auf der Seite, Drucken und eine Verknüpfung zu den Einstellungen.","Aquí encontrarás nueva ventana, ventana de incógnito que no guarda historial, buscar en la página, imprimir y un acceso directo a Ajustes.","Vous y trouverez une nouvelle fenêtre, une fenêtre de navigation privée sans historique, la recherche dans la page, l’impression et un raccourci vers les paramètres.","כאן תמצא חלון חדש, חלון גלישה בסתר שאינו שומר היסטוריה, חיפוש בדף, הדפסה וקיצור להגדרות.","這裡有新視窗、不記錄歷史的無痕式視窗、頁面內搜尋、列印，以及前往設定的捷徑。","Tukej znojdziesz nowe ôkno, ôkno incognito bez zapisowanio historyje, szukanie na zajcie, drukowanie i skrōt do Ustawiyń."],["To już wszystko","That’s everything","Das war alles","Eso es todo","C’est tout","זה הכול","導覽結束","To już wszystko"],["Poradnik możesz uruchomić ponownie w dowolnej chwili: Ustawienia → System → Pokaż poradnik ponownie. Miłego korzystania z Arkany!","You can start this tour again at any time: Settings → System → Show the tour again. Enjoy using Arkana!","Du kannst die Einführung jederzeit erneut starten: Einstellungen → System → Einführung erneut anzeigen. Viel Freude mit Arkana!","Puedes volver a iniciar esta guía en cualquier momento: Ajustes → Sistema → Mostrar la guía de nuevo. ¡Disfruta de Arkana!","Vous pouvez relancer ce guide à tout moment : Paramètres → Système → Afficher à nouveau le guide. Bonne découverte d’Arkana !","אפשר להפעיל את המדריך מחדש בכל רגע: הגדרות ← מערכת ← הצג את המדריך שוב. שימוש נעים ב־Arkana!","你可以隨時重新啟動導覽：設定 → 系統 → 再次顯示導覽。祝你使用愉快！","Poradnik idzie włōnczyć zaś w kożdyj chwili: Ustawiynia → Systym → Pokoż poradnik zaś. Fajnego używanio Arkany!"],["Poradnik","Tour","Einführung","Guía","Guide","מדריך","導覽","Poradnik"],["Krótki przewodnik po najważniejszych miejscach interfejsu. Sam pokazuje się tylko przy pierwszym uruchomieniu.","A short walkthrough of the most important parts of the interface. It shows up by itself only on the first launch.","Ein kurzer Rundgang durch die wichtigsten Stellen der Oberfläche. Er erscheint nur beim ersten Start von selbst.","Un breve recorrido por las partes más importantes de la interfaz. Solo aparece por sí sola en el primer inicio.","Une courte visite des éléments les plus importants de l’interface. Il ne s’affiche de lui-même qu’au premier lancement.","סיור קצר במקומות החשובים בממשק. הוא מופיע מעצמו רק בהפעלה הראשונה.","簡短介紹介面中最重要的部分。只會在第一次啟動時自動出現。","Krōtki przewodnik po nojważniejszych mijscach interfejsu. Sōm sie pokazuje yno przi pierszym sztarcie."],["Pokaż poradnik ponownie","Show the tour again","Einführung erneut anzeigen","Mostrar la guía de nuevo","Afficher à nouveau le guide","הצג את המדריך שוב","再次顯示導覽","Pokoż poradnik zaś"],["Naciśnij klawisze lub przycisk myszy…","Press keys or a mouse button…","Tasten oder Maustaste drücken…","Pulsa teclas o un botón del ratón…","Appuyez sur des touches ou un bouton de souris…","לחץ על מקשים או על כפתור עכבר…","請按下按鍵或滑鼠按鈕…","Naciś klawisze abo knefel myszy…"],["Możesz też przypisać przycisk myszy: środkowy lub dowolny boczny (lewy i prawy są zablokowane, żeby nie zepsuć nawigacji). Przycisk myszy działa sam, bez żadnego klawisza. Jeśli chcesz wariant z klawiszem, przytrzymaj przy kliknięciu Ctrl, Alt lub Shift.","You can also assign a mouse button: the middle one or any side button (left and right are blocked so navigation keeps working). A mouse button works on its own, without any key. For a variant with a key, hold Ctrl, Alt or Shift while clicking.","Du kannst auch eine Maustaste zuweisen: die mittlere oder eine beliebige Seitentaste (links und rechts sind gesperrt, damit die Navigation nicht kaputtgeht). Eine Maustaste funktioniert allein, ohne weitere Taste. Für eine Variante mit Taste halte beim Klicken Strg, Alt oder Umschalt gedrückt.","También puedes asignar un botón del ratón: el central o cualquier botón lateral (el izquierdo y el derecho están bloqueados para no estropear la navegación). Un botón del ratón funciona solo, sin ninguna tecla. Para una variante con tecla, mantén pulsada Ctrl, Alt o Mayús al hacer clic.","Vous pouvez aussi attribuer un bouton de souris : le bouton central ou n’importe quel bouton latéral (le gauche et le droit sont bloqués pour ne pas casser la navigation). Un bouton de souris fonctionne seul, sans aucune touche. Pour une variante avec une touche, maintenez Ctrl, Alt ou Maj en cliquant.","אפשר גם להקצות כפתור עכבר: האמצעי או כל כפתור צד (השמאלי והימני חסומים כדי לא לפגוע בניווט). כפתור עכבר פועל לבדו, בלי מקש נוסף. לגרסה עם מקש, החזק Ctrl, Alt או Shift בזמן הלחיצה.","你也可以指定滑鼠按鈕：中鍵或任何側邊按鈕（左鍵和右鍵已鎖定，以免影響瀏覽操作）。滑鼠按鈕可單獨使用，無需搭配其他按鍵。若要搭配按鍵，請在點擊時按住 Ctrl、Alt 或 Shift。","Idzie tyż przipisać knefel myszy: postrzodkowy abo kery bocny (lewy i prawy sōm zablokowane, coby niy zepsuć nawigacyje). Knefel myszy robi sōm, bez żodnygo klawisza. Jak chcesz wariant z klawiszym, przitrzimej przi kliknyńciu Ctrl, Alt abo Shift."],["Mysz: środkowy","Mouse: middle","Maus: mittlere","Ratón: central","Souris : milieu","עכבר: אמצעי","滑鼠：中鍵","Mysz: postrzodkowy"],["Mysz 4 (wstecz)","Mouse 4 (back)","Maus 4 (zurück)","Ratón 4 (atrás)","Souris 4 (retour)","עכבר 4 (אחורה)","滑鼠 4（上一頁）","Mysz 4 (nazod)"],["Mysz 5 (dalej)","Mouse 5 (forward)","Maus 5 (vor)","Ratón 5 (adelante)","Souris 5 (avancer)","עכבר 5 (קדימה)","滑鼠 5（下一頁）","Mysz 5 (dalij)"],["Mysz {n}","Mouse {n}","Maus {n}","Ratón {n}","Souris {n}","עכבר {n}","滑鼠 {n}","Mysz {n}"],["Lewego i prawego przycisku myszy nie można przypisać do skrótu.","The left and right mouse buttons cannot be assigned to a shortcut.","Die linke und die rechte Maustaste können keinem Kürzel zugewiesen werden.","El botón izquierdo y el derecho del ratón no se pueden asignar a un atajo.","Les boutons gauche et droit de la souris ne peuvent pas être attribués à un raccourci.","אי אפשר להקצות את כפתור העכבר השמאלי והימני לקיצור.","滑鼠左鍵和右鍵無法指定為快速鍵。","Lewego i prawego kneflika myszy niy idzie przipisać do skrōtu."],["Do przycisku myszy można dodać tylko Ctrl, Alt lub Shift.","Only Ctrl, Alt or Shift can be combined with a mouse button.","Mit einer Maustaste lassen sich nur Strg, Alt oder Umschalt kombinieren.","Con un botón del ratón solo se pueden combinar Ctrl, Alt o Mayús.","Seuls Ctrl, Alt ou Maj peuvent être combinés avec un bouton de souris.","אפשר לשלב עם כפתור עכבר רק Ctrl, Alt או Shift.","滑鼠按鈕只能搭配 Ctrl、Alt 或 Shift。","Do kneflika myszy idzie dodać yno Ctrl, Alt abo Shift."],["Przeglądarka domyślna","Default browser","Standardbrowser","Navegador predeterminado","Navigateur par défaut","דפדפן ברירת מחדל","預設瀏覽器","Przeglōndarka domyślno"],["Sprawdzam…","Checking…","Wird geprüft…","Comprobando…","Vérification…","בודק…","檢查中…","Sprawdzōm…"],["Arkana jest teraz przeglądarką domyślną ✓","Arkana is now your default browser ✓","Arkana ist jetzt dein Standardbrowser ✓","Arkana es ahora tu navegador predeterminado ✓","Arkana est maintenant votre navigateur par défaut ✓","Arkana היא עכשיו דפדפן ברירת המחדל שלך ✓","Arkana 現在是你的預設瀏覽器 ✓","Arkana je teraz twoja domyślno przeglōndarka ✓"],["Arkana nie jest przeglądarką domyślną.","Arkana is not your default browser.","Arkana ist nicht dein Standardbrowser.","Arkana no es tu navegador predeterminado.","Arkana n’est pas votre navigateur par défaut.","Arkana אינה דפדפן ברירת המחדל שלך.","Arkana 不是你的預設瀏覽器。","Arkana niy je twoja domyślno przeglōndarka."],["Windows nie pozwala programom samodzielnie zmienić przeglądarki domyślnej. Po kliknięciu Arkana zarejestruje się w systemie jako przeglądarka i otworzą się Ustawienia Windows, w których wybierz Arkana Browser dla HTTP i HTTPS. Po wybraniu linki z innych programów będą otwierać się w Arkanie.","Windows does not let programs change the default browser on their own. After you click, Arkana registers itself as a browser and Windows Settings opens, where you choose Arkana Browser for HTTP and HTTPS. Afterwards, links from other programs will open in Arkana.","Windows erlaubt Programmen nicht, den Standardbrowser selbst zu ändern. Nach dem Klick registriert sich Arkana als Browser und die Windows-Einstellungen öffnen sich; dort wählst du Arkana Browser für HTTP und HTTPS. Danach öffnen sich Links aus anderen Programmen in Arkana.","Windows no permite que los programas cambien por sí mismos el navegador predeterminado. Al hacer clic, Arkana se registra como navegador y se abre la Configuración de Windows, donde eliges Arkana Browser para HTTP y HTTPS. Después, los enlaces de otros programas se abrirán en Arkana.","Windows ne permet pas aux programmes de changer eux-mêmes le navigateur par défaut. Après le clic, Arkana s’enregistre comme navigateur et les Paramètres de Windows s’ouvrent ; choisissez-y Arkana Browser pour HTTP et HTTPS. Ensuite, les liens d’autres programmes s’ouvriront dans Arkana.","Windows לא מאפשר לתוכנות לשנות בעצמן את דפדפן ברירת המחדל. לאחר הלחיצה Arkana תירשם כדפדפן ותיפתח ההגדרות של Windows, שבהן יש לבחור ב־Arkana Browser עבור HTTP ו־HTTPS. לאחר מכן קישורים מתוכנות אחרות ייפתחו ב־Arkana.","Windows 不允許程式自行變更預設瀏覽器。點擊後，Arkana 會在系統中註冊為瀏覽器並開啟 Windows 設定，請在其中為 HTTP 和 HTTPS 選擇 Arkana Browser。之後，其他程式中的連結會在 Arkana 中開啟。","Windows niy dowo programōm samym zmiynić domyślnyj przeglōndarki. Po kliknyńciu Arkana zarejestruje sie w systymie jako przeglōndarka i ôtwiyrajōm sie Ustawiynia Windows, kaj wybier Arkana Browser dlo HTTP i HTTPS. Potym linki z inkszych programōw bydōm sie ôtwiyrać w Arkanie."],["Ustawia Arkanę jako domyślną przeglądarkę w systemie.","Sets Arkana as the default browser in the system.","Legt Arkana als Standardbrowser im System fest.","Establece Arkana como navegador predeterminado del sistema.","Définit Arkana comme navigateur par défaut du système.","מגדיר את Arkana כדפדפן ברירת המחדל במערכת.","將 Arkana 設為系統的預設瀏覽器。","Ustawio Arkano jako domyślno przeglōndarka w systymie."],["Ustaw Arkanę jako domyślną","Make Arkana the default","Arkana als Standard festlegen","Establecer Arkana como predeterminado","Définir Arkana par défaut","הגדר את Arkana כברירת מחדל","將 Arkana 設為預設","Ustow Arkano jako domyślno"],["Nie udało się zarejestrować Arkany w systemie.","Could not register Arkana in the system.","Arkana konnte nicht im System registriert werden.","No se pudo registrar Arkana en el sistema.","Impossible d’enregistrer Arkana dans le système.","לא ניתן היה לרשום את Arkana במערכת.","無法在系統中註冊 Arkana。","Niy szło zarejestrować Arkany w systymie."],["Ta funkcja nie jest dostępna w tym oknie.","This feature is not available in this window.","Diese Funktion ist in diesem Fenster nicht verfügbar.","Esta función no está disponible en esta ventana.","Cette fonction n’est pas disponible dans cette fenêtre.","תכונה זו אינה זמינה בחלון זה.","此視窗無法使用這項功能。","Ta funkcyjo niy je dostympno w tym ôknie."],["Kolory stron","Page colors","Seitenfarben","Colores de las páginas","Couleurs des pages","צבעי דפים","網頁色彩","Farby zajt"],["Kolor motywu","Theme color","Designfarbe","Color del tema","Couleur du thème","צבע ערכת הנושא","主題色彩","Farba motywu"],["Gradient kolorów","Color gradient","Farbverlauf","Degradado de color","Dégradé de couleurs","מעבר צבעים","色彩漸層","Gradiynt farb"],["Wyłączone","Off","Aus","Desactivado","Désactivé","כבוי","關閉","Wyłōnczone"],["Kolor motywu: strony Google (np. wyszukiwarka) przyjmują kolory motywu. Gradient kolorów: Arkana pobiera kolor otwartej strony i płynnie łączy go z kolorem motywu na paskach, tak że granica między interfejsem a stroną znika (na jasnych stronach przejście jest ograniczone, żeby napisy na paskach pozostały czytelne). Wyłączone: strony wyglądają natywnie, a paski mają zwykły kolor motywu.","Theme color: Google pages (such as search) take the theme colors. Color gradient: Arkana reads the color of the open page and blends it smoothly with the theme color on the bars, so the border between the interface and the page disappears (on light pages the blend is limited so the text on the bars stays readable). Off: pages look native and the bars use the plain theme color.","Designfarbe: Google-Seiten (z. B. die Suche) übernehmen die Farben des Designs. Farbverlauf: Arkana liest die Farbe der geöffneten Seite aus und mischt sie fließend mit der Designfarbe in den Leisten, sodass die Grenze zwischen Oberfläche und Seite verschwindet (auf hellen Seiten ist der Übergang begrenzt, damit die Beschriftungen lesbar bleiben). Aus: Seiten sehen original aus, die Leisten haben die normale Designfarbe.","Color del tema: las páginas de Google (por ejemplo, el buscador) adoptan los colores del tema. Degradado de color: Arkana toma el color de la página abierta y lo mezcla suavemente con el color del tema en las barras, de modo que desaparece el límite entre la interfaz y la página (en páginas claras la mezcla se limita para que los textos de las barras sigan siendo legibles). Desactivado: las páginas se ven nativas y las barras usan el color normal del tema.","Couleur du thème : les pages Google (par exemple la recherche) prennent les couleurs du thème. Dégradé de couleurs : Arkana relève la couleur de la page ouverte et la fond en douceur avec celle du thème sur les barres, si bien que la frontière entre l’interface et la page disparaît (sur les pages claires, la transition est limitée pour que les textes des barres restent lisibles). Désactivé : les pages ont leur aspect natif et les barres gardent la couleur normale du thème.","צבע ערכת הנושא: דפי Google (למשל החיפוש) מקבלים את צבעי ערכת הנושא. מעבר צבעים: Arkana קוראת את צבע הדף הפתוח ומשלבת אותו בעדינות עם צבע ערכת הנושא בסרגלים, כך שהגבול בין הממשק לדף נעלם (בדפים בהירים המעבר מוגבל כדי שהכיתוב בסרגלים יישאר קריא). כבוי: הדפים נראים כמו במקור והסרגלים בצבע ערכת הנושא הרגיל.","主題色彩：Google 頁面（例如搜尋）會採用主題色彩。色彩漸層：Arkana 會讀取目前網頁的顏色，並在列上與主題色彩平順混合，讓介面與網頁之間的邊界消失（在淺色網頁上，過渡會受到限制，以確保列上的文字仍清晰可讀）。關閉：網頁維持原本外觀，列使用一般的主題色彩。","Farba motywu: zajty Google (np. szukiwarka) bierōm farby motywu. Gradiynt farb: Arkana bierze farba ôtwartyj zajty i gładko jã łōnczy z farbōm motywu na paskach, tak ize granica miyndzy interfejsym a zajtōm zanikuje (na jasnych zajtach przechōd je ôgraniczōny, coby napisy na paskach były czytelne). Wyłōnczone: zajty wyglōdajōm ôryginalnie, a paski majōm zwykłõ farbã motywu."],["Czcionka","Font","Schriftart","Fuente","Police","גופן","字型","Czcionka"],["Czcionka całego interfejsu Arkany (nie stron internetowych). Lista pokazuje czcionki zainstalowane w systemie, a każdą inną możesz wpisać ręcznie.","The font of the whole Arkana interface (not of websites). The list shows fonts installed on your system; you can type any other font name manually.","Die Schriftart der gesamten Arkana-Oberfläche (nicht von Webseiten). Die Liste zeigt im System installierte Schriftarten; jede andere kannst du manuell eingeben.","La fuente de toda la interfaz de Arkana (no de los sitios web). La lista muestra las fuentes instaladas en el sistema; puedes escribir manualmente cualquier otra.","La police de toute l’interface d’Arkana (pas des sites web). La liste affiche les polices installées sur le système ; vous pouvez saisir manuellement n’importe quelle autre.","הגופן של כל הממשק של Arkana (לא של אתרים). הרשימה מציגה גופנים המותקנים במערכת, ואת כל גופן אחר אפשר להקליד ידנית.","Arkana 整個介面的字型（不含網頁）。清單顯示系統已安裝的字型，其他字型可手動輸入名稱。","Czcionka cołkij ôbsługi Arkany (niy zajtōw internetowych). Lista pokazuje czcionki zainstalowane w systymie, a inkszõ idzie wpisać rynczy."],["Szukaj lub wpisz nazwę czcionki…","Search or type a font name…","Schriftart suchen oder eingeben…","Busca o escribe un nombre de fuente…","Rechercher ou saisir un nom de police…","חפשו או הקלידו שם גופן…","搜尋或輸入字型名稱…","Szukej abo wpisz miano czcionki…"],["Użyj","Use","Verwenden","Usar","Utiliser","השתמש","使用","Użyj"],["Wybrana czcionka:","Selected font:","Gewählte Schriftart:","Fuente seleccionada:","Police sélectionnée :","הגופן שנבחר:","目前字型：","Wybrano czcionka:"],["Domyślna (Segoe UI)","Default (Segoe UI)","Standard (Segoe UI)","Predeterminada (Segoe UI)","Par défaut (Segoe UI)","ברירת מחדל (Segoe UI)","預設（Segoe UI）","Sztandardowo (Segoe UI)"],["systemowa","system","System","del sistema","système","מערכת","系統","systymowa"],["Brak pasujących zainstalowanych czcionek. Możesz wpisać nazwę i użyć jej poniżej.","No matching installed fonts. You can type a name and use it above.","Keine passenden installierten Schriftarten. Du kannst einen Namen eingeben und ihn verwenden.","No hay fuentes instaladas que coincidan. Puedes escribir un nombre y usarlo.","Aucune police installée ne correspond. Vous pouvez saisir un nom et l’utiliser.","אין גופנים מותקנים תואמים. אפשר להקליד שם ולהשתמש בו.","沒有符合的已安裝字型。可輸入名稱後使用。","Niy ma pasujōncych czcionek. Idzie wpisać miano i użyć."],["Importuj / eksportuj","Import / export","Importieren / Exportieren","Importar / exportar","Importer / exporter","ייבוא / ייצוא","匯入／匯出","Importuj / eksportuj"],["Importuj pliki…","Import files…","Dateien importieren…","Importar archivos…","Importer des fichiers…","ייבוא קבצים…","匯入檔案…","Importuj zbiory…"],["Ta notatka jako .txt","This note as .txt","Diese Notiz als .txt","Esta nota como .txt","Cette note en .txt","הערה זו כ-.txt","此筆記存為 .txt","Ta notatka jako .txt"],["Ta notatka jako .md","This note as .md","Diese Notiz als .md","Esta nota como .md","Cette note en .md","הערה זו כ-.md","此筆記存為 .md","Ta notatka jako .md"],["Ta notatka jako .html","This note as .html","Diese Notiz als .html","Esta nota como .html","Cette note en .html","הערה זו כ-.html","此筆記存為 .html","Ta notatka jako .html"],["Wszystkie jako jeden .txt","All as one .txt","Alle als eine .txt","Todas en un solo .txt","Toutes dans un seul .txt","הכול בקובץ .txt אחד","全部存為單一 .txt","Wszystkie we jednym .txt"],["Kopia wszystkich (.json)","Backup of all (.json)","Sicherung aller (.json)","Copia de todas (.json)","Sauvegarde de toutes (.json)","גיבוי של הכול (.json)","全部備份 (.json)","Kopia wszystkich (.json)"],["Zapisano","Saved","Gespeichert","Guardado","Enregistré","נשמר","已儲存","Zapisane"],["Pominięto plik binarny","Skipped binary file","Binärdatei übersprungen","Archivo binario omitido","Fichier binaire ignoré","קובץ בינארי דולג","已略過二進位檔","Pominiynto binarny zbiōr"],["Zaimportowano notatek","Notes imported","Notizen importiert","Notas importadas","Notes importées","הערות שיובאו","已匯入筆記","Zaimportowane notatki"],["Nic nie zaimportowano","Nothing imported","Nichts importiert","No se importó nada","Rien n’a été importé","לא יובא דבר","未匯入任何內容","Nic niy zaimportowano"],["Pobrane","Downloads","Downloads","Descargas","Téléchargements","הורדות","下載","Pobrane"],["Pobieranie","Downloading","Wird heruntergeladen","Descargando","Téléchargement","מוריד","下載中","Pobiyranie"],["Rozpoczęto pobieranie","Download started","Download gestartet","Descarga iniciada","Téléchargement démarré","ההורדה החלה","開始下載","Zaczyno sie pobiyranie"],["Dodano do kolejki","Added to queue","Zur Warteschlange hinzugefügt","Añadido a la cola","Ajouté à la file d’attente","נוסף לתור","已加入佇列","Dodane do kolejki"],["Kliknij, aby zobaczyć szczegóły","Click to see details","Klicken für Details","Haz clic para ver los detalles","Cliquez pour voir les détails","לחצו לפרטים","按一下以查看詳細資料","Kliknij, coby zobaczyć szczegōły"],["Wyczyść listę","Clear list","Liste leeren","Borrar lista","Vider la liste","נקה רשימה","清除清單","Wyczyść listã"],["Brak pobranych plików","No downloaded files","Keine heruntergeladenen Dateien","No hay archivos descargados","Aucun fichier téléchargé","אין קבצים שהורדו","沒有已下載的檔案","Niy ma pobranych zbiorōw"],["W kolejce","Queued","In Warteschlange","En cola","En file d’attente","בתור","佇列中","W kolejce"],["Anulowano","Cancelled","Abgebrochen","Cancelado","Annulé","בוטל","已取消","Pociyrpniynte"],["Nie udało się pobrać","Download failed","Download fehlgeschlagen","Error en la descarga","Échec du téléchargement","ההורדה נכשלה","下載失敗","Niy szło pobrać"],["Pokaż w folderze","Show in folder","Im Ordner anzeigen","Mostrar en la carpeta","Afficher dans le dossier","הצג בתיקייה","在資料夾中顯示","Pokoż we folderze"],["Anuluj pobieranie","Cancel download","Download abbrechen","Cancelar descarga","Annuler le téléchargement","בטל הורדה","取消下載","Pociyrp pobiyranie"],["Usuń z listy","Remove from list","Aus Liste entfernen","Quitar de la lista","Retirer de la liste","הסר מהרשימה","從清單移除","Wyciep z listy"],["Kolory motywu","Theme colors","Designfarben","Colores del tema","Couleurs du thème","צבעי ערכת הנושא","主題顏色","Farby motywu"],["Do 4 kolorów motywu. Kliknij kolor, aby edytować jego barwę, nasycenie i jasność. Kolejność zmienisz przeciągając ⠿.","Up to 4 theme colors. Click a color to edit its hue, saturation and brightness. Drag ⠿ to change the order.","Bis zu 4 Designfarben. Klicke auf eine Farbe, um Farbton, Sättigung und Helligkeit zu bearbeiten. Ziehe ⠿, um die Reihenfolge zu ändern.","Hasta 4 colores del tema. Haz clic en un color para editar su tono, saturación y brillo. Arrastra ⠿ para cambiar el orden.","Jusqu’à 4 couleurs de thème. Cliquez sur une couleur pour modifier sa teinte, sa saturation et sa luminosité. Faites glisser ⠿ pour changer l’ordre.","עד 4 צבעי ערכת נושא. לחצו על צבע כדי לערוך גוון, רוויה ובהירות. גררו ⠿ כדי לשנות סדר.","最多 4 個主題顏色。按一下顏色可編輯色相、飽和度與亮度。拖曳 ⠿ 可變更順序。","Aże 4 farby motywu. Kliknij farba, coby poprawić jeji barwã, nasycynie i jasność. Kolejność zmiyniysz przeciōngajōnc ⠿."],["Kolor","Color","Farbe","Color","Couleur","צבע","顏色","Farba"],["Przeciągnij, aby zmienić kolejność","Drag to change the order","Ziehen, um die Reihenfolge zu ändern","Arrastra para cambiar el orden","Faites glisser pour changer l’ordre","גררו כדי לשנות סדר","拖曳以變更順序","Przeciōng, coby zmiynić kolejność"],["Usuń kolor","Remove color","Farbe entfernen","Quitar color","Supprimer la couleur","הסר צבע","移除顏色","Wyciep farba"],["+ Dodaj kolor","+ Add color","+ Farbe hinzufügen","+ Añadir color","+ Ajouter une couleur","+ הוסף צבע","+ 新增顏色","+ Dodej farba"],["Przejścia kolorów","Color transitions","Farbübergänge","Transiciones de color","Transitions de couleurs","מעברי צבע","顏色漸層","Przechody farb"],["Kształt przejścia kolorów (kolejność kolorów na liście to kolejność w aplikacji):","Shape of the color transition (the order on the list is the order in the app):","Form des Farbübergangs (die Reihenfolge in der Liste ist die Reihenfolge in der App):","Forma de la transición de color (el orden de la lista es el orden en la aplicación):","Forme de la transition (l’ordre de la liste est l’ordre dans l’application) :","צורת מעבר הצבעים (סדר הרשימה הוא הסדר באפליקציה):","顏色漸層的形狀（清單順序即應用程式中的順序）：","Sztalt przechodu farb (kolejność na liście to kolejność w aplikacji):"],["Poziomo","Horizontal","Horizontal","Horizontal","Horizontal","אופקי","水平","Poziōmo"],["Pionowo","Vertical","Vertikal","Vertical","Vertical","אנכי","垂直","Pionowo"],["Ukośnie ↙","Diagonal ↙","Diagonal ↙","Diagonal ↙","Diagonale ↙","אלכסוני ↙","對角 ↙","Ukośnie ↙"],["Ukośnie ↘","Diagonal ↘","Diagonal ↘","Diagonal ↘","Diagonale ↘","אלכסוני ↘","對角 ↘","Ukośnie ↘"],["Od środka","From the center","Von der Mitte","Desde el centro","Depuis le centre","מהמרכז","由中心向外","Ôd środka"],["Intensywność przejść:","Transition intensity:","Intensität der Übergänge:","Intensidad de las transiciones:","Intensité des transitions :","עוצמת המעברים:","漸層強度：","Intensywność przechodōw:"],["Szybkie","Fast","Schnell","Rápidas","Rapides","מהירים","快速","Szybke"],["Średnie","Medium","Mittel","Medias","Moyennes","בינוניים","中等","Postrzednie"],["Długie","Long","Lang","Largas","Longues","ארוכים","長","Długie"],["Szybkie: większość ekranu w jednym z kolorów. Średnie: złoty środek. Długie: prawie każdy punkt to mieszanka dwóch kolorów.","Fast: most of the screen in one of the colors. Medium: the middle ground. Long: almost every point is a mix of two colors.","Schnell: der Großteil des Bildschirms in einer der Farben. Mittel: der goldene Mittelweg. Lang: fast jeder Punkt ist eine Mischung zweier Farben.","Rápidas: la mayor parte de la pantalla en uno de los colores. Medias: el término medio. Largas: casi cada punto es una mezcla de dos colores.","Rapides : la majeure partie de l’écran dans l’une des couleurs. Moyennes : le juste milieu. Longues : presque chaque point est un mélange de deux couleurs.","מהירים: רוב המסך באחד הצבעים. בינוניים: אמצע הדרך. ארוכים: כמעט כל נקודה היא תערובת של שני צבעים.","快速：大部分畫面為其中一種顏色。中等：折衷。長：幾乎每個點都是兩種顏色的混合。","Szybke: wiynkszość ekranu we jednyj z farb. Postrzednie: złoty postrzodek. Długie: prawie kożdy punkt to mieszanina dwōch farb."],["Podgląd","Preview","Vorschau","Vista previa","Aperçu","תצוגה מקדימה","預覽","Podglōnd"],["Zastosuj","Apply","Anwenden","Aplicar","Appliquer","החל","套用","Zastosuj"],["Cofnij","Undo","Zurücksetzen","Deshacer","Annuler","בטל","還原","Cofnij"],["Podgląd pokazuje tło oraz górny i lewy pasek. Kształt, intensywność i kolejność działają w aplikacji po kliknięciu „Zastosuj”.","The preview shows the background and the top and left bars. Shape, intensity and order take effect in the app after you click “Apply”.","Die Vorschau zeigt den Hintergrund sowie die obere und linke Leiste. Form, Intensität und Reihenfolge wirken in der App nach einem Klick auf „Anwenden“.","La vista previa muestra el fondo y las barras superior e izquierda. La forma, la intensidad y el orden se aplican en la aplicación al hacer clic en «Aplicar».","L’aperçu montre l’arrière-plan ainsi que les barres du haut et de gauche. La forme, l’intensité et l’ordre prennent effet dans l’application après un clic sur « Appliquer ».","התצוגה המקדימה מציגה את הרקע ואת הסרגלים העליון והשמאלי. הצורה, העוצמה והסדר ייכנסו לתוקף באפליקציה לאחר לחיצה על ״החל״.","預覽顯示背景以及上方和左側的列。形狀、強度與順序會在按下「套用」後於應用程式中生效。","Podglōnd pokazuje tło i gōrny a lewy posek. Sztalt, intensywność i kolejność robiōm w aplikacji po kliknyńciu „Zastosuj”."],["Pełny ekran","Full screen","Vollbild","Pantalla completa","Plein écran","מסך מלא","全螢幕","Cołki ekran"],["Powtórzenia przejścia","Transition repeats","Wiederholungen des Übergangs","Repeticiones de la transición","Répétitions de la transition","חזרות המעבר","漸層重複次數","Powtōrzynia przechodu"],["Ile razy cała kolejność kolorów powtarza się na obszarze aplikacji (np. 1→2→3→4→1→2→3→4).","How many times the whole color sequence repeats across the app area (e.g. 1→2→3→4→1→2→3→4).","Wie oft sich die gesamte Farbfolge über die App-Fläche wiederholt (z. B. 1→2→3→4→1→2→3→4).","Cuántas veces se repite toda la secuencia de colores en el área de la aplicación (p. ej. 1→2→3→4→1→2→3→4).","Combien de fois toute la séquence de couleurs se répète sur la zone de l’application (p. ex. 1→2→3→4→1→2→3→4).","כמה פעמים כל רצף הצבעים חוזר על פני שטח האפליקציה (למשל 1→2→3→4→1→2→3→4).","整個顏色順序在應用程式區域內重複的次數（例如 1→2→3→4→1→2→3→4）。","Ile razy cołko kolejność farb sie powtarzo na ôbszarze aplikacji (np. 1→2→3→4→1→2→3→4)."],["Ruch kolorów","Color motion","Farbbewegung","Movimiento de los colores","Mouvement des couleurs","תנועת צבעים","顏色移動","Ruch farb"],["W trybie pełnego ekranu widać tylko jeden kolor, a pozostałe pokazuje ruch lub przechodzenie.","In full-screen mode only one color is visible; the others are shown by motion or transitions.","Im Vollbildmodus ist nur eine Farbe sichtbar; die anderen zeigen Bewegung oder Übergänge.","En modo de pantalla completa solo se ve un color; los demás los muestran el movimiento o las transiciones.","En mode plein écran, une seule couleur est visible ; les autres apparaissent grâce au mouvement ou aux transitions.","במצב מסך מלא נראה צבע אחד בלבד; האחרים מוצגים באמצעות תנועה או מעבר.","全螢幕模式只會顯示一種顏色，其他顏色透過移動或漸變呈現。","We trybie cołkigo ekranu widać yno jedna farba, a inksze pokazuje ruch abo przechod."],["Kierunek przesuwania się kolorów:","Direction in which the colors move:","Richtung, in die sich die Farben bewegen:","Dirección en la que se mueven los colores:","Direction de déplacement des couleurs :","כיוון תנועת הצבעים:","顏色移動方向：","Kierōnek przesuwanio sie farb:"],["Wyłączony","Off","Aus","Desactivado","Désactivé","כבוי","關閉","Wyłōnczōny"],["↓ W dół","↓ Down","↓ Nach unten","↓ Hacia abajo","↓ Vers le bas","↓ למטה","↓ 向下","↓ We dōł"],["↑ W górę","↑ Up","↑ Nach oben","↑ Hacia arriba","↑ Vers le haut","↑ למעלה","↑ 向上","↑ Do gōry"],["→ W prawo","→ Right","→ Nach rechts","→ A la derecha","→ Vers la droite","→ ימינה","→ 向右","→ W prawo"],["← W lewo","← Left","← Nach links","← A la izquierda","← Vers la gauche","← שמאלה","← 向左","← W lewo"],["↙ W lewy dół","↙ Down-left","↙ Nach links unten","↙ Abajo a la izquierda","↙ Vers le bas à gauche","↙ שמאלה למטה","↙ 向左下","↙ W lewy dōł"],["↗ W prawą górę","↗ Up-right","↗ Nach rechts oben","↗ Arriba a la derecha","↗ Vers le haut à droite","↗ ימינה למעלה","↗ 向右上","↗ W prawõ gōrã"],["↘ W prawy dół","↘ Down-right","↘ Nach rechts unten","↘ Abajo a la derecha","↘ Vers le bas à droite","↘ ימינה למטה","↘ 向右下","↘ W prawy dōł"],["↖ W lewą górę","↖ Up-left","↖ Nach links oben","↖ Arriba a la izquierda","↖ Vers le haut à gauche","↖ שמאלה למעלה","↖ 向左上","↖ W lewõ gōrã"],["Na zewnątrz","Outward","Nach außen","Hacia fuera","Vers l’extérieur","החוצה","向外","Na zewnōntrz"],["Do środka","Inward","Nach innen","Hacia dentro","Vers l’intérieur","פנימה","向內","Do postrzodka"],["Przechodzenie kolorów w miejscu (łączenia stoją, kolory płyną jeden w drugi)","Color fading in place (the joins stay put, colors flow into one another)","Farbübergang an Ort und Stelle (die Nahtstellen bleiben, die Farben fließen ineinander)","Transición de colores en el sitio (las uniones se quedan, los colores pasan de uno a otro)","Fondu des couleurs sur place (les jonctions restent fixes, les couleurs se fondent l’une dans l’autre)","מעבר צבעים במקום (נקודות החיבור נשארות והצבעים זורמים זה לזה)","原地顏色漸變（交界處不動，顏色逐一變換）","Przechodzynie farb na môjscu (połōnczynia stoją, farby płynōm jedna we drugõ)"],["Czas przejścia jednego koloru","Time for one color to change into the next","Dauer des Übergangs einer Farbe","Tiempo de transición de un color","Durée de transition d’une couleur","זמן המעבר של צבע אחד","單一顏色的轉換時間","Czas przechodu jednyj farby"],["Podgląd pokazuje tło oraz górny i lewy pasek (z ruchem, jeśli jest włączony). Kształt, intensywność, powtórzenia, ruch i czas działają w aplikacji po kliknięciu „Zastosuj”.","The preview shows the background and the top and left bars (with motion, if enabled). Shape, intensity, repeats, motion and time take effect in the app after you click “Apply”.","Die Vorschau zeigt den Hintergrund sowie die obere und linke Leiste (mit Bewegung, falls aktiviert). Form, Intensität, Wiederholungen, Bewegung und Zeit wirken in der App nach einem Klick auf „Anwenden“.","La vista previa muestra el fondo y las barras superior e izquierda (con movimiento, si está activado). La forma, la intensidad, las repeticiones, el movimiento y el tiempo se aplican en la aplicación al hacer clic en «Aplicar».","L’aperçu montre l’arrière-plan ainsi que les barres du haut et de gauche (avec mouvement, s’il est activé). La forme, l’intensité, les répétitions, le mouvement et la durée prennent effet dans l’application après un clic sur « Appliquer ».","התצוגה המקדימה מציגה את הרקע ואת הסרגלים העליון והשמאלי (עם תנועה, אם הופעלה). צורה, עוצמה, חזרות, תנועה וזמן ייכנסו לתוקף באפליקציה לאחר לחיצה על ״החל״.","預覽顯示背景以及上方和左側的列（若已開啟則含移動效果）。形狀、強度、重複次數、移動與時間會在按下「套用」後於應用程式中生效。","Podglōnd pokazuje tło i gōrny a lewy posek (z ruchym, jeli je włōnczōny). Sztalt, intensywność, powtōrzynia, ruch i czas robiōm w aplikacji po kliknyńciu „Zastosuj”."],["Korekta wszystkich kolorów motywu","Adjust all theme colors","Alle Designfarben anpassen","Ajustar todos los colores del tema","Ajuster toutes les couleurs du thème","התאמת כל צבעי ערכת הנושא","調整所有主題顏色","Poprawka wszystkich farb motywu"],["Korekta wszystkich kolorów akcentu","Adjust all accent colors","Alle Akzentfarben anpassen","Ajustar todos los colores de acento","Ajuster toutes les couleurs d’accent","התאמת כל צבעי ההדגשה","調整所有強調色","Poprawka wszystkich farb akcyntu"],["Przesuwa jasność, nasycenie i składowe RGB każdego koloru o podaną wartość (nie ustawia ich na stałe). Gdy któryś kolor dojdzie do granicy zakresu, zostaje na niej.","Shifts the brightness, saturation and RGB components of every color by the given amount (it does not set them to a fixed value). When a color reaches the limit of its range, it stays at that limit.","Verschiebt Helligkeit, Sättigung und RGB-Anteile jeder Farbe um den angegebenen Wert (setzt sie nicht fest). Erreicht eine Farbe die Bereichsgrenze, bleibt sie dort.","Desplaza el brillo, la saturación y los componentes RGB de cada color en el valor indicado (no los fija). Cuando un color llega al límite de su rango, se queda en él.","Décale la luminosité, la saturation et les composantes RVB de chaque couleur de la valeur indiquée (sans les fixer). Lorsqu’une couleur atteint la limite de sa plage, elle y reste.","מזיז את הבהירות, הרוויה ורכיבי ה-RGB של כל צבע בערך שצוין (ולא קובע אותם לערך קבוע). כשצבע מגיע לגבול הטווח שלו, הוא נשאר בו.","對每個顏色的亮度、飽和度與 RGB 成分依指定值位移（並非設為固定值）。當顏色到達範圍極限時，會停在極限值。","Przesuwo jasność, nasycynie i skłodniki RGB kożdyj farby ô podanõ wartość (niy ustawio jich na stołe). Jak jakŏ farba dojdzie do granice zakresu, zostowo na niyj."],["Zeruj korektę","Reset adjustment","Anpassung zurücksetzen","Restablecer ajuste","Réinitialiser l’ajustement","אפס התאמה","重設調整","Zeruj poprawkã"],["Do 4 kolorów akcentu. Bez przechodzenia w czasie akcentem jest pierwszy kolor z listy.","Up to 4 accent colors. Without fading over time, the accent is the first color on the list.","Bis zu 4 Akzentfarben. Ohne zeitlichen Übergang ist die erste Farbe der Liste der Akzent.","Hasta 4 colores de acento. Sin transición en el tiempo, el acento es el primer color de la lista.","Jusqu’à 4 couleurs d’accent. Sans transition dans le temps, l’accent est la première couleur de la liste.","עד 4 צבעי הדגשה. ללא מעבר בזמן, ההדגשה היא הצבע הראשון ברשימה.","最多 4 個強調色。若未啟用隨時間漸變，強調色為清單中的第一個顏色。","Aże 4 farby akcyntu. Bez przechodzynia w czasie akcyntym je piyrszŏ farba z listy."],["Przechodzenie kolorów akcentu w czasie","Fade accent colors over time","Akzentfarben im Zeitverlauf überblenden","Transición de los colores de acento en el tiempo","Fondu des couleurs d’accent dans le temps","מעבר צבעי ההדגשה לאורך זמן","強調色隨時間漸變","Przechodzynie farb akcyntu w czasie"],["Podział kolorów:","Color split:","Farbaufteilung:","División de colores:","Répartition des couleurs :","חלוקת הצבעים:","顏色分段：","Podział farb:"],["Równy podział","Equal split","Gleichmäßige Aufteilung","División igual","Répartition égale","חלוקה שווה","平均分段","Rōwny podział"],["Niestandardowy podział…","Custom split…","Benutzerdefinierte Aufteilung…","División personalizada…","Répartition personnalisée…","חלוקה מותאמת…","自訂分段…","Ôsobny podział…"],["Niestandardowy podział","Custom split","Benutzerdefinierte Aufteilung","División personalizada","Répartition personnalisée","חלוקה מותאמת","自訂分段","Ôsobny podział"],["Linie podziału:","Split lines:","Trennlinien:","Líneas de división:","Lignes de séparation :","קווי חלוקה:","分段線：","Linie podziału:"],["Kliknij w prostokącie, aby postawić linię podziału. Linia podąża za kursorem, a podgląd pokazuje wygląd podziału w tym miejscu.","Click in the rectangle to place a split line. The line follows the cursor and the preview shows how the split would look at that spot.","Klicke in das Rechteck, um eine Trennlinie zu setzen. Die Linie folgt dem Cursor, und die Vorschau zeigt, wie die Aufteilung an dieser Stelle aussähe.","Haz clic en el rectángulo para colocar una línea de división. La línea sigue al cursor y la vista previa muestra cómo quedaría la división en ese punto.","Cliquez dans le rectangle pour placer une ligne de séparation. La ligne suit le curseur et l’aperçu montre l’effet de la répartition à cet endroit.","לחצו בתוך המלבן כדי להציב קו חלוקה. הקו עוקב אחרי הסמן והתצוגה המקדימה מראה איך תיראה החלוקה במקום הזה.","在矩形內按一下即可放置分段線。線會跟隨游標，預覽會顯示在該位置分段的效果。","Kliknij we prostokōncie, coby postawić linia podziału. Linia chodzi za kursorym, a podglōnd pokazuje jak by wyglōdoł podział we tym placu."],["Pozostało linii do postawienia:","Lines left to place:","Noch zu setzende Linien:","Líneas por colocar:","Lignes restant à placer :","קווים שנותר להציב:","尚待放置的線：","Ôstało linii do postawiyniŏ:"],["Wszystkie linie postawione. Zatwierdź albo cofnij ostatnią.","All lines placed. Confirm, or undo the last one.","Alle Linien gesetzt. Bestätige oder mache die letzte rückgängig.","Todas las líneas colocadas. Confirma o deshaz la última.","Toutes les lignes sont placées. Validez ou annulez la dernière.","כל הקווים הוצבו. אשרו או בטלו את האחרון.","所有線都已放置。請確認，或復原最後一條。","Wszyskie linie postawiōne. Zatwierdź abo cofnij ôstatniõ."],["Zatwierdź","Confirm","Bestätigen","Confirmar","Valider","אשר","確認","Zatwierdź"],["Eksportuj…","Export…","Exportieren…","Exportar…","Exporter…","ייצוא…","匯出…","Eksportuj…"],["← Wstecz","← Back","← Zurück","← Atrás","← Retour","← חזרה","← 返回","← Nazod"],["Granica jest ustawiana raz w obrębie jednego przejścia, a linie pokazują jej położenie w każdym powtórzeniu (np. 1/3 przejścia to 1/6 ekranu przy 2 powtórzeniach i 1/9 przy 3).","The split is set once within a single transition, and the lines show its position in every repeat (e.g. 1/3 of the transition is 1/6 of the screen with 2 repeats and 1/9 with 3).","Die Grenze wird einmal innerhalb eines Übergangs gesetzt, und die Linien zeigen ihre Position in jeder Wiederholung (z. B. 1/3 des Übergangs entspricht 1/6 des Bildschirms bei 2 Wiederholungen und 1/9 bei 3).","El límite se fija una vez dentro de una transición y las líneas muestran su posición en cada repetición (p. ej., 1/3 de la transición es 1/6 de la pantalla con 2 repeticiones y 1/9 con 3).","La limite est définie une fois au sein d’une transition, et les lignes montrent sa position dans chaque répétition (p. ex. 1/3 de la transition correspond à 1/6 de l’écran avec 2 répétitions et 1/9 avec 3).","הגבול נקבע פעם אחת בתוך מעבר יחיד, והקווים מראים את מיקומו בכל חזרה (למשל 1/3 מהמעבר הוא 1/6 מהמסך עם 2 חזרות ו-1/9 עם 3).","分段位置只在單一漸層內設定一次，線條會顯示它在每次重複中的位置（例如漸層的 1/3 在重複 2 次時為螢幕的 1/6，重複 3 次時為 1/9）。","Granica sie ustawio raz we jednym przechodzie, a linie pokazujōm jeji plac we kożdym powtōrzyniu (np. 1/3 przechodu to 1/6 ekranu przi 2 powtōrzyniach a 1/9 przi 3)."],["Najedź na wybrany kolor i kliknij, aby go skopiować. Esc — anuluj.","Hover over the color you want and click to copy it. Esc — cancel.","Fahre über die gewünschte Farbe und klicke, um sie zu übernehmen. Esc — abbrechen.","Pasa el cursor sobre el color que quieras y haz clic para copiarlo. Esc — cancelar.","Survolez la couleur voulue et cliquez pour la copier. Échap — annuler.","רחפו מעל הצבע הרצוי ולחצו כדי להעתיק אותו. Esc — ביטול.","將游標移到想要的顏色上並按一下即可複製。Esc — 取消。","Najydź na wybranõ farbã i kliknij, coby jã skopiować. Esc — pociyrp."],["Pipeta: wybierz kolor z ekranu","Eyedropper: pick a color from the screen","Pipette: Farbe vom Bildschirm wählen","Cuentagotas: elegir un color de la pantalla","Pipette : choisir une couleur à l’écran","טפטפת: בחירת צבע מהמסך","滴管：從螢幕選取顏色","Pipeta: ôbier farbã z ekranu"],["Dodaj czcionkę z pliku…", "Add font from file…", "Schriftart aus Datei hinzufügen…", "Añadir fuente desde un archivo…", "Ajouter une police depuis un fichier…", "הוספת גופן מקובץ…", "從檔案新增字型…", "Dodaj czcionkę z pliku…"],["Odśwież listę", "Refresh list", "Liste aktualisieren", "Actualizar lista", "Actualiser la liste", "רענון הרשימה", "重新整理清單", "Odśwież listę"],["dodana", "added", "hinzugefügt", "añadida", "ajoutée", "נוסף", "已新增", "dodana"],["Usuń czcionkę z Arkany", "Remove font from Arkana", "Schriftart aus Arkana entfernen", "Quitar la fuente de Arkana", "Retirer la police d’Arkana", "הסרת הגופן מ־Arkana", "從 Arkana 移除字型", "Usuń czcionkę z Arkany"],["Wczytywanie czcionek…", "Loading fonts…", "Schriftarten werden geladen…", "Cargando fuentes…", "Chargement des polices…", "טוען גופנים…", "正在載入字型…", "Wczytywanie czcionek…"],["Dodano czcionek: {n}", "Fonts added: {n}", "Hinzugefügte Schriftarten: {n}", "Fuentes añadidas: {n}", "Polices ajoutées : {n}", "גופנים שנוספו: {n}", "已新增字型：{n}", "Dodano czcionek: {n}"],["Pominięto: {n}", "Skipped: {n}", "Übersprungen: {n}", "Omitidas: {n}", "Ignorées : {n}", "דולגו: {n}", "已略過：{n}", "Pominięto: {n}"],["Nie dodano czcionek (nieobsługiwany lub już dodany plik).", "No fonts added (unsupported file or already added).", "Keine Schriftarten hinzugefügt (nicht unterstützte oder bereits hinzugefügte Datei).", "No se añadió ninguna fuente (archivo no compatible o ya añadido).", "Aucune police ajoutée (fichier non pris en charge ou déjà ajouté).", "לא נוספו גופנים (קובץ לא נתמך או שכבר נוסף).", "未新增字型（檔案不支援或已新增）。", "Nie dodano czcionek (nieobsługiwany lub już dodany plik)."],["Dodana czcionka jest kopiowana do folderu danych Arkany i działa tylko w Arkanie (nie instaluje się w systemie Windows). Obsługiwane pliki: TTF, OTF, TTC, WOFF i WOFF2. Czcionkę zainstalowaną w systemie w trakcie pracy pokaże „Odśwież listę”.", "An added font is copied to Arkana’s data folder and works only in Arkana (it is not installed in Windows). Supported files: TTF, OTF, TTC, WOFF and WOFF2. A font installed in the system while Arkana is running will appear after “Refresh list”.", "Eine hinzugefügte Schriftart wird in den Datenordner von Arkana kopiert und funktioniert nur in Arkana (sie wird nicht in Windows installiert). Unterstützte Dateien: TTF, OTF, TTC, WOFF und WOFF2. Eine im System installierte Schriftart erscheint nach „Liste aktualisieren“.", "Una fuente añadida se copia a la carpeta de datos de Arkana y solo funciona en Arkana (no se instala en Windows). Archivos compatibles: TTF, OTF, TTC, WOFF y WOFF2. Una fuente instalada en el sistema con Arkana abierta aparecerá tras «Actualizar lista».", "Une police ajoutée est copiée dans le dossier de données d’Arkana et ne fonctionne que dans Arkana (elle n’est pas installée dans Windows). Fichiers pris en charge : TTF, OTF, TTC, WOFF et WOFF2. Une police installée dans le système pendant l’utilisation apparaîtra après « Actualiser la liste ».", "גופן שנוסף מועתק לתיקיית הנתונים של Arkana ופועל רק ב־Arkana (הוא לא מותקן ב־Windows). קבצים נתמכים: TTF, OTF, TTC, WOFF ו־WOFF2. גופן שהותקן במערכת בזמן העבודה יופיע לאחר „רענון הרשימה”.", "新增的字型會複製到 Arkana 的資料夾，只在 Arkana 中有效（不會安裝到 Windows）。支援的檔案：TTF、OTF、TTC、WOFF 與 WOFF2。在執行期間安裝到系統的字型會在「重新整理清單」後出現。", "Dodana czcionka jest kopiowana do folderu danych Arkany i działa tylko w Arkanie (nie instaluje się w systemie Windows). Obsługiwane pliki: TTF, OTF, TTC, WOFF i WOFF2. Czcionkę zainstalowaną w systemie w trakcie pracy pokaże „Odśwież listę”."],["MODUŁY", "MODULES", "MODULE", "MÓDULOS", "MODULES", "מודולים", "模組", "MODUŁY"],["Panel aplikacji i gry", "App panel and games", "App-Leiste und Spiele", "Panel de aplicaciones y juegos", "Panneau d’applications et jeux", "לוח יישומים ומשחקים", "應用程式面板與遊戲", "Panel aplikacji i gry"],["Kalkulator, notatnik, zegar, konwertery, zmieniacz formatów, tłumacz, gry i pływające okna. Wyłączony moduł nie jest ładowany przy starcie: nie zajmuje pamięci i nie działa w tle. Włączenie działa od razu, a pełna oszczędność po wyłączeniu następuje po ponownym uruchomieniu.", "Calculator, notes, clock, converters, file converter, translator, games and floating windows. A disabled module is not loaded at startup: it uses no memory and does nothing in the background. Enabling takes effect immediately; full savings after disabling apply after a restart.", "Rechner, Notizen, Uhr, Umrechner, Dateikonverter, Übersetzer, Spiele und schwebende Fenster. Ein deaktiviertes Modul wird beim Start nicht geladen: Es belegt keinen Speicher und läuft nicht im Hintergrund. Das Aktivieren wirkt sofort, die volle Einsparung nach dem Deaktivieren nach einem Neustart.", "Calculadora, notas, reloj, conversores, conversor de archivos, traductor, juegos y ventanas flotantes. Un módulo desactivado no se carga al iniciar: no usa memoria ni hace nada en segundo plano. Activarlo surte efecto al instante; el ahorro completo tras desactivarlo se aplica al reiniciar.", "Calculatrice, notes, horloge, convertisseurs, convertisseur de fichiers, traducteur, jeux et fenêtres flottantes. Un module désactivé n’est pas chargé au démarrage : il n’utilise pas de mémoire et ne fait rien en arrière-plan. L’activation est immédiate ; l’économie complète après désactivation s’applique au redémarrage.", "מחשבון, פנקס, שעון, ממירים, ממיר קבצים, מתרגם, משחקים וחלונות צפים. מודול כבוי לא נטען בהפעלה: הוא לא תופס זיכרון ולא פועל ברקע. הפעלה נכנסת לתוקף מיד, והחיסכון המלא לאחר כיבוי מתבצע אחרי הפעלה מחדש.", "計算機、記事本、時鐘、換算器、檔案格式轉換、翻譯、遊戲與浮動視窗。停用的模組不會在啟動時載入：不佔用記憶體，也不在背景執行。啟用會立即生效；停用後的完整節省需重新啟動。", "Kalkulator, notatnik, zegar, konwertery, zmieniacz formatów, tłumacz, gry i pływające okna. Wyłączony moduł nie jest ładowany przy starcie: nie zajmuje pamięci i nie działa w tle. Włączenie działa od razu, a pełna oszczędność po wyłączeniu następuje po ponownym uruchomieniu."],["Wczytywanie aplikacji…", "Loading apps…", "Apps werden geladen…", "Cargando aplicaciones…", "Chargement des applications…", "טוען יישומים…", "正在載入應用程式…", "Wczytywanie aplikacji…"],["Nie udało się wczytać modułu aplikacji.", "The apps module could not be loaded.", "Das App-Modul konnte nicht geladen werden.", "No se pudo cargar el módulo de aplicaciones.", "Le module d’applications n’a pas pu être chargé.", "לא ניתן לטעון את מודול היישומים.", "無法載入應用程式模組。", "Nie udało się wczytać modułu aplikacji."],["Moduł aplikacji jest wyłączony. Włącz go w ustawieniach (Moduły), aby korzystać z aplikacji i gier.", "The apps module is turned off. Turn it on in Settings (Modules) to use apps and games.", "Das App-Modul ist ausgeschaltet. Schalte es in den Einstellungen (Module) ein, um Apps und Spiele zu nutzen.", "El módulo de aplicaciones está desactivado. Actívalo en Ajustes (Módulos) para usar aplicaciones y juegos.", "Le module d’applications est désactivé. Activez-le dans les paramètres (Modules) pour utiliser les applications et les jeux.", "מודול היישומים כבוי. הפעילו אותו בהגדרות (מודולים) כדי להשתמש ביישומים ובמשחקים.", "應用程式模組已關閉。請在設定（模組）中開啟，以使用應用程式與遊戲。", "Moduł aplikacji jest wyłączony. Włącz go w ustawieniach (Moduły), aby korzystać z aplikacji i gier."]];
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
// v49.9: wywołania są szeregowane (w._gq) i stan („włączone?”) jest czytany dopiero w chwili wykonania. Wcześniej dwa wywołania blisko siebie (dom-ready, zmiana ustawień,
// zmiana trybu) wstawiały CSS dwa razy, a klucz pierwszego ginął – takiego stylu nie dało się już usunąć i „Wyłączone” nie wyłączało kolorowania.
function injG(w){ try{ if(!isG(w.getURL())) return;
  w._gq=(w._gq||Promise.resolve()).then(async()=>{
    const on=S.settings.ui.pgmode==='theme';
    if(w._ck){ const k=w._ck; w._ck=null; try{ await w.removeInsertedCSS(k); }catch{} }
    if(on){ try{ w._ck=await w.insertCSS(gcss()); }catch{} }
    try{ await w.executeJavaScript(`(${gpage.toString()})(${JSON.stringify({bg:P.gbg,panel:P.gpanel,line:P.gline,on})})`); }catch{}
  }).catch(()=>{}); }catch{} }


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
$('set').addEventListener('change',e=>{ if(e.target.id==='appson'){ const ad=$('appsad'); if(ad) ad.classList.toggle('open',e.target.checked); appsSet(e.target.checked); } if(e.target.dataset.an){ S.settings.ui.anim[e.target.dataset.an]=e.target.checked; applyUi(); save(); }
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
  <h5>MODUŁY</h5>
  <label class="ck"><input type="checkbox" id="appson" ${S.settings.apps.on?'checked':''}><span class="tg"></span>Panel aplikacji i gry</label>
  <p class="hint">Kalkulator, notatnik, zegar, konwertery, zmieniacz formatów, tłumacz, gry i pływające okna. Wyłączony moduł nie jest ładowany przy starcie: nie zajmuje pamięci i nie działa w tle. Włączenie działa od razu, a pełna oszczędność po wyłączeniu następuje po ponownym uruchomieniu.</p>
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


// ===== src/js/25-modules.js =====
// ---------- moduły opcjonalne (v49.9) ----------
// Panel aplikacji i gry (pliki src/js/10–15 i 17–20, składane do js/apps.js) jest modułem: ładuje się dopiero wtedy, gdy jest włączony (Ustawienia → Aplikacje albo
// Ustawienia → System → Moduły; to ten sam przełącznik S.settings.apps.on). Wyłączony moduł nie jest wczytywany przy starcie: nie zajmuje pamięci, nie ma pętli ani
// nasłuchiwaczy w tle i nie dodaje niczego do interfejsu. Włączenie wczytuje go od razu; wyłączenie zamyka okna aplikacji i ukrywa pasek, a pełna oszczędność
// (kod nie jest wczytywany) następuje po ponownym uruchomieniu. Okna oderwane i incognito mają apps.on=false (aplikacje zostają w oknie głównym), więc go nie wczytują.
// Funkcje renderBar, renderApps, toggleAdd i openApp są tu zaślepkami; js/apps.js po wczytaniu zastępuje je właściwymi (ta sama nazwa funkcji w skrypcie globalnym).
let toastT;
function toast(m){ const e=$('toast'); e.textContent=m; e.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(()=>e.classList.remove('show'),2300); }
const MOD={apps:{state:0,file:'js/apps.js',q:[]}};   // state: 0 = niewczytany, 1 = wczytywanie, 2 = gotowy, −1 = błąd
function modLoad(name,cb){
  const m=MOD[name]; if(!m){ if(cb) cb(false); return; }
  if(m.state===2){ if(cb) cb(true); return; }
  if(cb) m.q.push(cb);
  if(m.state===1) return; m.state=1;
  const fin=ok=>{ m.state=ok?2:-1; m.q.splice(0).forEach(f=>{ try{ f(ok); }catch(e){ console.warn(e); } }); };
  try{ const s=document.createElement('script'); s.src=m.file;
    s.onload=()=>{ try{ if(name==='apps'&&typeof appsInit==='function') appsInit(); }catch(e){ console.warn('moduł aplikacji',e); } fin(true); };
    s.onerror=()=>fin(false); document.head.appendChild(s); }catch{ fin(false); }
}
const appsOn=()=>!!(S.settings.apps&&S.settings.apps.on);
function appsBoot(){ renderBar(); if(appsOn()) modLoad('apps'); }
function appsRefreshTab(){ try{ if(typeof setTab!=='undefined'&&(setTab==='apps'||setTab==='sys')&&$('set')&&$('set').classList.contains('open')) renderSet(); }catch{} }
function appsSet(on){
  S.settings.apps.on=!!on; save();
  if(!on){ if(MOD.apps.state===2){ try{ [...document.querySelectorAll('.aw')].forEach(w=>closeApp(w.dataset.app)); }catch{} } renderBar(); return; }
  renderBar();
  modLoad('apps',ok=>{ if(!ok){ toast(t('Nie udało się wczytać modułu aplikacji.')); return; } renderBar(); appsRefreshTab(); });
}
function renderBar(){ document.body.classList.toggle('noapps',!appsOn()||MOD.apps.state!==2); const r=$('rl'); if(r&&MOD.apps.state!==2) r.innerHTML=''; }
function toggleAdd(){}
function openApp(){ toast(t('Moduł aplikacji jest wyłączony. Włącz go w ustawieniach (Moduły), aby korzystać z aplikacji i gier.')); }
function renderApps(){
  const on=appsOn(), st=MOD.apps.state;
  $('set').innerHTML=`<div class="sh"><b>⚙ Ustawienia</b><button id="sx">×</button></div>${tabsHtml()}
  <h5>PASEK APLIKACJI</h5>
  <label class="ck"><input type="checkbox" id="appson" ${on?'checked':''}><span class="tg"></span>Pokaż pasek aplikacji</label>
  <p class="hint">${esc(on?(st===-1?t('Nie udało się wczytać modułu aplikacji.'):t('Wczytywanie aplikacji…')):t('Moduł aplikacji jest wyłączony. Włącz go w ustawieniach (Moduły), aby korzystać z aplikacji i gier.'))}</p>`;
}

// ===== src/js/25-shared.js =====
// ---------- wspólne dla rdzenia i modułu aplikacji (v49.9) ----------
// Te funkcje leżały w plikach aplikacji (14 i 17), ale używa ich też rdzeń (lista języków, tłumaczenie listy zmian), a rdzeń musi działać bez modułu aplikacji.
const capF=s=>s.charAt(0).toUpperCase()+s.slice(1);
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
appsBoot();   // pasek aplikacji i okna z poprzedniej sesji pojawiają się po wczytaniu modułu aplikacji (25-modules.js), jeśli jest włączony
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
// v49.9: zrzut (capturePage) ukrytej lub zasłoniętej karty potrafi nigdy się nie zakończyć; wcześniej PGF.busy zostawało wtedy „true” na stałe i gradient przestawał się
// aktualizować do końca sesji. Teraz każdy odczyt ma limit czasu, a po limicie próbujemy zapasowego odczytu z DOM strony.
const pgTO=(p,ms)=>new Promise(res=>{ let done=false; const tm=setTimeout(()=>{ if(!done){ done=true; res(null); } },ms); Promise.resolve(p).then(v=>{ if(!done){ done=true; clearTimeout(tm); res(v); } },()=>{ if(!done){ done=true; clearTimeout(tm); res(null); } }); });
async function pgSample(){
  if(!PGF||!pgOn()) return;
  if(PGF.busy&&Date.now()-PGF.bt<4000) return; PGF.busy=true; PGF.bt=Date.now();
  try{
    const t=T(), w=t&&views[t.id]; let cols=null;
    if(w&&t.url&&home.style.display==='none'){   // strona startowa: kolor tła interfejsu
      try{ cols=await pgTO(window.api.pageColors(w.getWebContentsId(),{w:w.clientWidth,h:w.clientHeight}),1800); }catch{}   // rozmiar karty: proces główny zrzuca tylko pasy przy krawędziach
      if(!cols||!cols.c){ try{ const c=await pgTO(w.executeJavaScript(PG_DOM),1500); if(Array.isArray(c)) cols={c}; }catch{} }
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
  c.toggle('pgb',on); c.toggle('pgoff',u.pgmode==='off');   // „Wyłączone”: także puste tło pod stroną jest natywne (białe), a nie w kolorze motywu
  if(on&&!$('pgframe')){ const d=document.createElement('div'); d.id='pgframe'; document.body.insertBefore(d,document.body.firstChild); }
  clearInterval(PGF.iv); PGF.iv=0;
  if(on){ pgLayout(); pgSample(); PGF.iv=setInterval(()=>{ if(!document.hidden) pgSample(); },2500); }   // strona może się przewinąć lub zmienić kolor (bez warunku hasFocus: gdy fokus jest w stronie <webview>, dokument okna zwraca false i odświeżanie nigdy nie ruszało)
}
PGF={busy:false,bt:0,iv:0,tm:0,cols:{},mode:undefined};
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
// v49.9: lista czcionek systemu pochodzi z plików czcionek (proces główny, fonts.js), a nie z wbudowanej listy znanych nazw: Windows (C:\Windows\Fonts i czcionki
// zainstalowane tylko dla użytkownika), macOS, Linux. Wbudowana lista z wykrywaniem po szerokości tekstu zostaje jako zapas (gdy odczyt się nie uda).
// Czcionki dodane do samej Arkany (plik TTF/OTF/TTC/WOFF/WOFF2 z dysku) są kopiowane do folderu danych i rejestrowane tu przez FontFace; nie instalują się w systemie.
var FNT_SYS=null, FNT_USER=[], FNT_BUSY=false, FNT_REG=new Map(), FNT_MSG='';
function fontUserLoad(){ const A=window.api; if(!A||!A.fontsRead||typeof FontFace==='undefined') return;
  const ids=new Set(FNT_USER.map(f=>f.id));
  for(const [id,face] of [...FNT_REG]) if(!ids.has(id)){ try{ document.fonts.delete(face); }catch{} FNT_REG.delete(id); }   // usunięte z Arkany: wyrejestruj
  for(const f of FNT_USER){ if(FNT_REG.has(f.id)) continue; FNT_REG.set(f.id,null);
    Promise.resolve(A.fontsRead(f.id)).then(b=>{ if(!b) throw 0; const face=new FontFace(f.family,b); return face.load().then(()=>{ document.fonts.add(face); FNT_REG.set(f.id,face); fontRefresh(); }); }).catch(()=>{ FNT_REG.delete(f.id); }); } }
function fontsLoad(mode){ const A=window.api; if(!A||!A.fontsList||FNT_BUSY) return; FNT_BUSY=true; fontRefresh();
  Promise.resolve(A.fontsList(mode)).catch(()=>null).then(r=>{ FNT_BUSY=false;
    if(r){ if(Array.isArray(r.sys)&&r.sys.length){ FNT_SYS=r.sys; } FNT_USER=Array.isArray(r.user)?r.user:[]; FNT_OK=null; fontUserLoad(); }
    fontRefresh(); }); }
function fontRefresh(){ const l=$('fntl'); if(l) l.innerHTML=fontItems(($('fntq')||{}).value); const i=$('fnti'); if(i) i.textContent=S.settings.ui.font||t('Domyślna (Segoe UI)'); const m=$('fntm'); if(m) m.textContent=FNT_BUSY?t('Wczytywanie czcionek…'):FNT_MSG; }
function fontHas(n){ try{ const g=(fontHas.c=fontHas.c||document.createElement('canvas')).getContext('2d'), T='mmmmmmmmmmlli1WwÓłŹ', B=['monospace','serif','sans-serif'];
    return B.some(b=>{ g.font='72px '+b; const w0=g.measureText(T).width; g.font='72px "'+n+'",'+b; return g.measureText(T).width!==w0; }); }catch{ return false; } }
function fontsInstalled(){ if(!FNT_OK){ const base=FNT_SYS&&FNT_SYS.length?FNT_SYS:[...new Set(fontNames())].filter(fontHas), seen=new Set(), out=[];
    for(const n of base){ const k=String(n).toLowerCase(); if(!seen.has(k)){ seen.add(k); out.push(n); } }
    FNT_OK=out.sort((a,b)=>a.localeCompare(b)); } return FNT_OK; }
function fontCss(f){ if(!f) return ''; return ['system-ui','sans-serif','serif','monospace','cursive','fantasy'].includes(f)?f:'"'+String(f).replace(/["\\;{}<>]/g,'')+'",system-ui,sans-serif'; }
function applyFont(){ const f=(S.settings.ui.font||'').trim(), r=document.documentElement.style, v=fontCss(f);
  if(!v){ r.removeProperty('--uif'); r.removeProperty('--ufs'); } else { r.setProperty('--uif',v); r.setProperty('--ufs',v); }
  try{ if(typeof incAlign==='function') setTimeout(incAlign,60); }catch{} }
function fontItems(q){ q=(q||'').trim().toLowerCase(); const cur=S.settings.ui.font||'';
  const uf=FNT_USER.map(f=>[f.family,f.family,'dodana',f.id]), un=new Set(FNT_USER.map(f=>f.family.toLowerCase()));
  const all=[['','Domyślna (Segoe UI)',''],...FNT_GEN.map(g=>[g,g,'systemowa']),...uf,...fontsInstalled().filter(n=>!un.has(n.toLowerCase())).map(n=>[n,n,''])];
  return all.filter(([v,l])=>!q||l.toLowerCase().includes(q)).map(([v,l,sm,id])=>{
    const b=`<button class="fnt-b${cur===v?' on':''}" data-font="${esc(v)}" style="${v?'font-family:'+esc(fontCss(v)):''}"><span>${esc(l)}</span>${sm?`<small>${sm}</small>`:''}</button>`;
    return id?`<div class="fnt-w">${b}<button class="fnt-x" data-fid="${esc(id)}" title="Usuń czcionkę z Arkany">×</button></div>`:b; }).join('')||'<p class="hint" style="padding:8px">Brak pasujących zainstalowanych czcionek. Możesz wpisać nazwę i użyć jej poniżej.</p>'; }
function fontSection(){ const cur=S.settings.ui.font||''; if(!FNT_SYS&&!FNT_BUSY) setTimeout(()=>fontsLoad(''),0);   // lista systemu jest wczytywana przy pierwszym otwarciu sekcji
  return `<h5>CZCIONKA</h5><p class="hint">Czcionka całego interfejsu Arkany (nie stron internetowych). Lista pokazuje czcionki zainstalowane w systemie, a każdą inną możesz wpisać ręcznie.</p>
  <div class="fnt-r"><input id="fntq" class="sein" placeholder="Szukaj lub wpisz nazwę czcionki…" value="" spellcheck="false"><button id="fntu" class="seb">Użyj</button></div>
  <div class="fnt-r"><button id="fnta" class="seb">Dodaj czcionkę z pliku…</button><button id="fntr" class="seb">Odśwież listę</button></div>
  <p class="hint" id="fntm">${FNT_BUSY?t('Wczytywanie czcionek…'):esc(FNT_MSG)}</p>
  <div class="fnt-l" id="fntl">${fontItems('')}</div>
  <p class="hint">Dodana czcionka jest kopiowana do folderu danych Arkany i działa tylko w Arkanie (nie instaluje się w systemie Windows). Obsługiwane pliki: TTF, OTF, TTC, WOFF i WOFF2. Czcionkę zainstalowaną w systemie w trakcie pracy pokaże „Odśwież listę”.</p><p class="hint"><span>Wybrana czcionka:</span> <b id="fnti">${esc(cur||'Domyślna (Segoe UI)')}</b></p>`; }
function fontPick(v){ S.settings.ui.font=v; applyFont(); save(); fontRefresh(); }
document.addEventListener('click',e=>{ const t=e.target; if(!t.closest||!t.closest('#set')) return; const b=t.closest('.fnt-b'); if(b){ fontPick(b.dataset.font); return; }
  if(t.id==='fntu'){ const v=(($('fntq')||{}).value||'').trim(); if(v) fontPick(v); return; }
  if(t.id==='fntr'){ FNT_MSG=''; FNT_OK=null; fontsLoad('refresh'); return; }
  if(t.id==='fnta'){ if(!window.api||!window.api.fontsAdd) return; FNT_MSG='';
    Promise.resolve(window.api.fontsAdd()).catch(()=>null).then(r=>{ const a=r&&r.added?r.added.length:0, s=r&&r.skipped?r.skipped.length:0;
      FNT_MSG=a?t('Dodano czcionek: {n}').replace('{n}',a)+(s?' · '+t('Pominięto: {n}').replace('{n}',s):''):(s?t('Nie dodano czcionek (nieobsługiwany lub już dodany plik).'):'');
      FNT_OK=null; fontsLoad('user'); }); return; }
  const x=t.closest('.fnt-x'); if(x){ const id=x.dataset.fid, f=FNT_USER.find(q=>q.id===id); if(!window.api||!window.api.fontsRemove) return;
    Promise.resolve(window.api.fontsRemove(id)).catch(()=>false).then(()=>{ if(f&&S.settings.ui.font===f.family){ S.settings.ui.font=''; applyFont(); save(); } FNT_MSG=''; FNT_OK=null; fontsLoad('user'); }); } });
document.addEventListener('input',e=>{ if(e.target.id==='fntq'){ const l=$('fntl'); if(l) l.innerHTML=fontItems(e.target.value); } });
document.addEventListener('keydown',e=>{ if(e.target.id==='fntq'&&e.key==='Enter'){ e.preventDefault(); const v=e.target.value.trim(); if(v) fontPick(v); } });
try{ setTimeout(()=>fontsLoad('user'),300); }catch{}   // dodane czcionki muszą być zarejestrowane już na starcie (może być z nich wybrana czcionka interfejsu)

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
