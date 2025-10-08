@echo off
echo ===============================================
echo    Minecraft Server Agent - Service Status
echo ===============================================
echo.

cd /d "%~dp0"
node manage-service.js status

echo.
echo 🌐 Testing HTTP endpoint...
curl -s http://localhost:8080/health 2>nul && (
    echo ✅ Agent is responding to HTTP requests
) || (
    echo ❌ Agent is not responding to HTTP requests
)

echo.
echo ===============================================
echo    Service Management Commands
echo ===============================================
echo.
echo • Start:   node manage-service.js start
echo • Stop:    node manage-service.js stop  
echo • Restart: node manage-service.js restart
echo.
pause
