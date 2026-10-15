@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Bitte zuerst Node.js 22.12 oder neuer installieren.
  pause
  exit /b 1
)
node scripts\serve-build.mjs --open
if errorlevel 1 pause
