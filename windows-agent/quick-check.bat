@echo off
echo ===============================================
echo    Quick Service Status Check
echo ===============================================
echo.

echo 🔍 Checking Windows Service Status...
sc query "minecraftserveragent.exe" | findstr "STATE"

echo.
echo 🌐 Testing HTTP Endpoint...
curl -s http://localhost:8080/health >nul 2>&1 && (
    echo ✅ Agent is responding at http://localhost:8080
) || (
    echo ❌ Agent is not responding
    echo.
    echo 🔧 To start the service manually:
    echo    sc start "minecraftserveragent.exe"
    echo.
    echo 🔧 Or use the management script:
    echo    node manage-service.js start
)

echo.
echo 📋 Full service status:
sc query "minecraftserveragent.exe"

echo.
pause
