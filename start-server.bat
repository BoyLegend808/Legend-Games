@echo off
title NaijaPlay / Legend Games Server
cd /d "%~dp0"

echo ======================================================
echo  Starting NaijaPlay / Legend Games Localhost Server...
echo ======================================================

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1" -port 8080
pause
