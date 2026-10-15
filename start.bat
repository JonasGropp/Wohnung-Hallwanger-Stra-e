@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js wurde nicht gefunden.
  echo Bitte Node.js 22.12 oder neuer von https://nodejs.org installieren.
  echo Danach dieses Fenster schliessen und start.bat erneut starten.
  pause
  exit /b 1
)
node -e "const [a,b]=process.versions.node.split('.').map(Number); process.exit((a===22 ? b>=12 : a>22) ? 0 : 1)"
if errorlevel 1 (
  echo Die Node.js-Version ist zu alt. Bitte Node.js 22.12 oder neuer installieren.
  pause
  exit /b 1
)
if not exist node_modules\vite\bin\vite.js (
  echo Erstinstallation der Pakete. Hierfuer ist einmalig Internet erforderlich.
  call npm ci --no-audit --no-fund
  if errorlevel 1 (
    echo Die Installation ist fehlgeschlagen. Bitte Internetverbindung und npm-Ausgabe pruefen.
    pause
    exit /b 1
  )
)
echo Wohnungsplaner startet unter http://localhost:5173
echo Dieses Fenster offen lassen. Beenden mit Strg+C.
call npm run dev -- --open http://localhost:5173
if errorlevel 1 (
  echo Start fehlgeschlagen. Falls Port 5173 belegt ist, den anderen Server zuerst beenden.
  pause
  exit /b 1
)
