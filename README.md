# Arkana Browser v39
1. Zainstaluj Node.js (LTS). 2. `npm install`, potem `npm start` (lub plik .bat).
Ustawienia (⚙ na dole paska folderów, Ctrl+,): zakładki Motyw / Interfejs / Aplikacje / Historia / Skróty / System (opcje jednej funkcji zebrane pod nagłówkami). Import z innych przeglądarek (Ustawienia → System): zakładki, historia, wyszukiwarka domyślna i ciasteczka z Chrome, Edge, Opery, Brave, Vivaldi i Firefoksa (Windows; przeglądarka musi być zamknięta) lub z pliku zakładek HTML. Przycisk ChangeLog (ikona notatki) pokazuje historię wersji z pliku CHANGELOG.txt: nagłówek z liniami = to wersja niewydana, z liniami * wydana.
Interfejs: styl przycisków okna i nawigacji, wyłączanie animacji, język (PL/EN/DE/ES/FR/HE/ZH-TW/ŚL).
Aplikacje: prawy pasek (rozwija się po najechaniu), dodawanie w Ustawienia -> Aplikacje. Dostępne: Kalkulator, Notatnik, Zegar (zegar w 3 stylach, alarmy, minutnik, stoper, kalendarz), Tłumacz (bez logowania i opłat, wymaga internetu), Zmieniacz formatów (pliki: obrazy, audio, wideo, dokumenty, dane, archiwa, kodowania; z ffmpeg w PATH lub obok programu odblokowuje MP3/MP4/MKV i inne), Konwerter jednostek (z walutami: kursy pobierane z internetu, zapamiętywane na wypadek braku sieci).
Alarmy i minutnik działają, gdy przeglądarka jest uruchomiona (także przy zamkniętej aplikacji Zegar); po alarmie okno Zegara otwiera się samo i wychodzi na wierzch.
Okna aplikacji: przytrzymaj okno -> Shift blokuje o inne okna, M scala stykające się okna, U oddziela, Esc anuluje.
Karty i foldery: przeciągnij, by zmienić kolejność; wyciągnij poza pasek i puść, by otworzyć w nowym oknie. Ikona: icon.ico (skrót: Właściwości -> Zmień ikonę).

## v30
- Zorza: pełna rozdzielczość (koniec kratkowania z v29) i miękkie zanikanie przy bocznych krawędziach.
- Ustawienia → Motyw: panel RGB + HEX także dla koloru akcentu.
- Ustawienia → Interfejs: opcja „Suwaki przesuwają się co 5”.
- Nowa aplikacja Kości (D3–D100, wiele kości naraz, modyfikator, historia, pojedynczy ponowny rzut).

## v31
- Instalator (NSIS, `electron-builder`) i automatyczne aktualizacje z GitHub Releases (`updater.js`, `electron-updater`).
- Budowanie i publikacja wydań przez GitHub Actions (`.github/workflows/release.yml`). Instrukcja: `INSTRUKCJA-GITHUB.md`.
- Ustawienia → Interfejs → AKTUALIZACJE: wersja, status, ręczne sprawdzanie, pobieranie i instalacja.

## v32
- Nowe aplikacje: Saper (preset, własna plansza, życia, zawinięte krawędzie, konfigurator z podglądem i miernikiem trudności) oraz Snake (plansza, tempo, jabłka złote i trujące, przeszkody, przenikanie ścian, konfigurator z podglądem autopilota).
- `check-release.js` (`npm run check`): kontrola zgodności wersji, pakowania, składni i tłumaczeń przed każdym wydaniem; uruchamiana też w GitHub Actions.
- Zmiana nazwy na **Arkana Browser**: nowy napis, podtytuł strony startowej („This is where the Magic happens” i tłumaczenia), logo łączące ikonę aplikacji z motywem arkanicznym (runy, heksagram) w lewym górnym rogu i na stronie startowej. Ikona aplikacji (pasek zadań, animacja startu) pozostaje bez zmian.
- Dane użytkownika przenoszą się automatycznie z `%APPDATA%\claude-browser` do `%APPDATA%\arkana-browser`.

## v32.0.1
- Ikona aplikacji (pasek zadań i animacja startu) wraca do pierwotnego wyglądu.
- Animacja startu: przy uderzeniu ikony w tło pojawia się na chwilę świecące koło alchemiczne, które kręci się w przeciwną stronę niż ikona, szybko zwalnia i gaśnie, zanim ikona ruszy w lewo.

## Struktura projektu (od v39)
- `src/js/NN-*.js` to źródła aplikacji (numer = kolejność ładowania). **Edytuj tylko te pliki.** `tools/bundle.js` składa je w `js/bundle.js`, który ładuje `index.html`; plik generuje się sam przy `npm start`, `npm run dist`, `npm run release`, `npm run check` i w GitHub Actions (nie trafia do repozytorium: jest w `.gitignore`).
- `css/app.css` to style, `js/preboot.js` mały skrypt startowy, `wv-preload.js` skrypt wstrzykiwany do kart (hasła, zoom kółkiem).
- Proces główny: `main.js`, `permissions.js` (zgody stron), `vault.js` (sejf haseł), `adblock.js` (blokowanie reklam), `importer.js` (import z innych przeglądarek), `updater.js`.
- `npm test` uruchamia testy jednostkowe z katalogu `tests/` (bez dodatkowych pakietów). `index.html` ma politykę CSP: bez skryptów wbudowanych i bez `onclick=` w kodzie HTML.
