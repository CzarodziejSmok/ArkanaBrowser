; Dodatkowe kroki instalatora (electron-builder, NSIS).
; Przy odinstalowaniu usuwamy rejestrację Arkany jako przeglądarki (Ustawienia -> System -> Przeglądarka domyślna), żeby w Windows nie został
; wpis wskazujący na nieistniejący program. Przy aktualizacji (stary program odinstalowuje się przed nowym) rejestracja ZOSTAJE.
!macro customUnInstall
  ${ifNot} ${isUpdated}
    DeleteRegKey HKCU "Software\Clients\StartMenuInternet\ArkanaBrowser"
    DeleteRegKey HKCU "Software\Classes\ArkanaBrowserURL"
    DeleteRegKey HKCU "Software\Classes\ArkanaBrowserHTML"
    DeleteRegValue HKCU "Software\RegisteredApplications" "Arkana Browser"
  ${endIf}
!macroend
