# Claude Browser v31
1. Zainstaluj Node.js (LTS). 2. `npm install`, potem `npm start` (lub plik .bat).
Ustawienia (⚙ na dole paska folderów, Ctrl+,): zakładki Motyw / Interfejs / Aplikacje / Skróty.
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
