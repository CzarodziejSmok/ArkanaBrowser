// ---------- języki interfejsu ----------
const LANGS={pl:'Polski',en:'English',de:'Deutsch',es:'Español',fr:'Français',he:'עברית',zh:'繁體中文',szl:'Ślōnski'};
const ILOC={szl:'pl',zh:'zh-TW'}, IL=()=>ILOC[S.settings.ui.lang]||S.settings.ui.lang;   // kod ustawień -> język formatowania dat/liczb (Intl)
