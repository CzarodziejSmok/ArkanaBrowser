# Instalator i automatyczne aktualizacje – instrukcja krok po kroku

Jak to działa: kod trzymasz w repozytorium na GitHubie. Gdy utworzysz wydanie (tag np. `v32.0.0`), GitHub **sam zbuduje instalator**
(`Claude-Browser-Setup.exe`) i dołączy go do wydania razem z plikiem `latest.yml` (zawiera wersję i sumę SHA-512).
Zainstalowana przeglądarka co kilka godzin pobiera `latest.yml`, porównuje wersję, a jeśli jest nowsza, pobiera instalator,
sprawdza sumę SHA-512 i instaluje przy zamknięciu programu (albo od razu, gdy klikniesz „Zainstaluj i uruchom ponownie”).
Nic nie budujesz u siebie, więc nie obciążasz dysku C.

## 1. Konto i repozytorium (jednorazowo)
1. Załóż konto na github.com (jeśli go nie masz).
2. Kliknij **+ → New repository**. Nazwa: `claude-browser` (może być inna). **Widoczność: Public** (publiczne repozytorium
   jest konieczne, żeby inni mogli pobierać bez logowania i żeby aktualizacje działały bez tokenu).
3. W `package.json` zamień w dwóch miejscach `TWOJ-LOGIN-GITHUB` na swój login GitHub (`author` oraz `build.publish[0].owner`).
   Jeśli nazwa repozytorium jest inna niż `claude-browser`, zmień też `build.publish[0].repo`.

## 2. Wgranie plików
**Najprościej – GitHub Desktop** (desktop.github.com): zaloguj się, *File → Add local repository* wskaż folder projektu
(albo *Clone* swojego pustego repozytorium i skopiuj do niego pliki), wpisz opis i kliknij **Commit to main**, potem **Push origin**.
Folder `.github` jest ukryty/zaczyna się od kropki – GitHub Desktop wgra go poprawnie.

**Bez instalowania czegokolwiek:** na stronie repozytorium *Add file → Upload files*, przeciągnij wszystkie pliki
(bez `node_modules`). Jeśli folder `.github` się nie wgrał, kliknij *Add file → Create new file*, w polu nazwy wpisz
`.github/workflows/release.yml` (ukośniki utworzą foldery) i wklej zawartość pliku `release.yml` z paczki.

## 3. Uprawnienia dla Actions (jednorazowo)
*Settings → Actions → General → Workflow permissions* → zaznacz **Read and write permissions** → Save.

## 4. Pierwsze wydanie i każde następne
1. W `package.json` ustaw nową wersję (np. `"version": "32.0.0"`) i wgraj zmianę (commit + push).
   Numer musi być **większy** od poprzedniego – inaczej aktualizacja się nie pojawi.
2. Na stronie repozytorium: **Releases → Draft a new release → Choose a tag**, wpisz `v32.0.0` (taki sam numer jak w `package.json`,
   z literą `v` na początku) → *Create new tag on publish* → tytuł np. „Claude Browser v32” → **Publish release**.
3. W zakładce **Actions** zobaczysz zadanie „Wydanie”. Po ok. 5–10 minutach (zielony znaczek) w wydaniu pojawią się pliki:
   `Claude-Browser-Setup.exe`, `Claude-Browser-Setup.exe.blockmap`, `latest.yml`. Dopiero wtedy aktualizacja jest dostępna.
   (Gdy zadanie zrobi się czerwone, otwórz je i przeczytaj komunikat – najczęściej zła wersja/tag albo nieustawione uprawnienia.)

## 5. Co przekazać innym
- Strona pobierania: `https://github.com/TWOJ-LOGIN/claude-browser/releases/latest`
- Bezpośredni link do instalatora (zawsze najnowszy): `https://github.com/TWOJ-LOGIN/claude-browser/releases/latest/download/Claude-Browser-Setup.exe`

## 6. Ostrzeżenie Windows SmartScreen
Instalator nie jest podpisany certyfikatem, więc Windows pokaże „Nieznany wydawca” (*Więcej informacji → Uruchom mimo to*).
To nie wpływa na działanie aktualizacji. Certyfikat podpisujący kosztuje; dla projektów open source istnieją darmowe programy
(np. SignPath Foundation) albo płatny Azure Trusted Signing.

## 7. Dane użytkownika i wiele instancji
- Dane (ustawienia, historia, notatki) leżą w `%APPDATA%\claude-browser` – tak samo jak przy uruchamianiu przez `npm start`/.bat,
  więc po zainstalowaniu nic nie przepada.
- Aktualizacjami zajmuje się tylko pierwsza uruchomiona instancja. Przy instalacji aktualizacji zamknij pozostałe okna/instancje.
- ffmpeg (opcjonalny) wystarczy położyć w folderze instalacji (`%LOCALAPPDATA%\Programs\Claude Browser`) jako `ffmpeg.exe`.

## 8. Test bez publikowania
Lokalnie (wymaga ok. 1 GB wolnego miejsca): `npm install`, potem `npm run dist` – instalator pojawi się w folderze `dist`.
