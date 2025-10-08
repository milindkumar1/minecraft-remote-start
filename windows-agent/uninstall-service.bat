@echo off
echo ===============================================
echo   Minecraft Server Agent - Service Uninstaller
echo ===============================================
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ Running as Administrator
    echo.
) else (
    echo ❌ This script requires Administrator privileges!
    echo.
    echo Please:
    echo 1. Right-click this file
    echo 2. Select "Run as administrator"
    echo.
    pause
    exit /b 1
)

echo 🗑️ Uninstalling Minecraft Server Agent service...
echo.

cd /d "%~dp0"
node uninstall-service.js

echo.
echo ===============================================
echo    Uninstallation Complete!
echo ===============================================
echo.
echo The Minecraft Server Agent service has been removed.
echo It will no longer start automatically with Windows.
echo.
echo To reinstall: Run "install-service.bat" as Administrator
echo.
pause
