@echo off
echo ===============================================
echo    Minecraft Server Agent - Service Installer
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

echo 📦 Installing Minecraft Server Agent as Windows Service...
echo.

cd /d "%~dp0"
node install-service.js

echo.
echo ===============================================
echo    Installation Complete!
echo ===============================================
echo.
echo The Minecraft Server Agent is now installed as a Windows Service.
echo It will automatically start when Windows boots up.
echo.
echo 🌐 Agent URL: http://localhost:8080
echo 📊 View in Services: Press Win+R, type "services.msc"
echo 📝 View logs: Event Viewer ^> Windows Logs ^> Application
echo.
echo To uninstall: Run "uninstall-service.bat" as Administrator
echo.
pause
