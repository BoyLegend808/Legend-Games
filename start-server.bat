@echo off
title NaijaPlay / Legend Games Server
cd /d "%~dp0"

echo ======================================================
echo  Starting NaijaPlay / Legend Games Localhost Server...
echo ======================================================

echo Launching browser at http://localhost:8080/home/home.html ...
start "" "http://localhost:8080/home/home.html"

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
