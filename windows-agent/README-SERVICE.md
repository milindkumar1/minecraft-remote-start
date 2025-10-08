# Minecraft Server Agent - Windows Service

This agent runs as a Windows Service to provide 24/7 remote management of your Minecraft servers.

## 🚀 Quick Install

1. **Right-click** `install-service.bat`
2. **Select** "Run as administrator"
3. **Wait** for installation to complete
4. **Done!** The service is now running

## 📋 Service Management

### Install Service
```bash
# Method 1: Use batch file (Recommended)
Right-click install-service.bat → Run as administrator

# Method 2: Command line
node install-service.js
```

### Uninstall Service
```bash
# Method 1: Use batch file (Recommended)
Right-click uninstall-service.bat → Run as administrator

# Method 2: Command line
node uninstall-service.js
```

### Control Service
```bash
# Start service
node manage-service.js start

# Stop service
node manage-service.js stop

# Restart service
node manage-service.js restart

# Check status
node manage-service.js status
```

## 🔧 Windows Services Management

### Using Services Console
1. Press `Win + R`
2. Type `services.msc`
3. Find "Minecraft Server Agent"
4. Right-click for options (Start/Stop/Restart)

### Using Command Line
```cmd
# Start service
sc start "Minecraft Server Agent"

# Stop service
sc stop "Minecraft Server Agent"

# Query status
sc query "Minecraft Server Agent"
```

## 📊 Monitoring

### Event Viewer Logs
1. Press `Win + R`
2. Type `eventvwr.msc`
3. Navigate to: Windows Logs → Application
4. Filter by Source: "Minecraft Server Agent"

### Service Features
- ✅ **Auto-start** on Windows boot
- ✅ **Auto-restart** on crash (up to 3 times)
- ✅ **Runs in background** (no console window)
- ✅ **Works when locked** or logged out
- ✅ **Survives sleep/hibernate** (with proper power settings)

## 🌐 Access

Once installed, the agent is available at:
- **Local:** http://localhost:8080
- **Network:** http://YOUR-PC-IP:8080

## 🛡️ Security Notes

- Service runs with SYSTEM privileges
- Ensure your `.env` file has the correct `WINDOWS_AGENT_SECRET`
- Configure Windows Firewall if accessing remotely
- Consider using HTTPS in production

## 🔧 Troubleshooting

### Service Won't Start
1. Check Event Viewer for error details
2. Verify `.env` file exists and has `WINDOWS_AGENT_SECRET`
3. Ensure port 8080 is available
4. Run `node server.js` manually to test

### Service Crashes
1. Check Event Viewer logs
2. Service will auto-restart (up to 3 times)
3. Fix underlying issue and restart service

### Can't Install/Uninstall
1. Ensure running as Administrator
2. Close any running instances first
3. Check antivirus isn't blocking the operation

## 📁 File Structure

```
windows-agent/
├── server.js              # Main agent server
├── install-service.js     # Service installer
├── uninstall-service.js   # Service uninstaller  
├── manage-service.js      # Service management
├── install-service.bat    # Easy install (Run as Admin)
├── uninstall-service.bat  # Easy uninstall (Run as Admin)
├── .env                   # Environment configuration
├── package.json           # Dependencies
└── README-SERVICE.md      # This file
```

## 🎯 Production Recommendations

1. **Power Settings:** Prevent sleep/hibernate
2. **Network:** Configure static IP or DDNS
3. **Firewall:** Allow port 8080 (if accessing remotely)
4. **Updates:** Keep Node.js and dependencies updated
5. **Monitoring:** Check Event Viewer logs regularly
6. **Backup:** Keep backup of `.env` file

---

**Need help?** Check the Event Viewer logs first, then test by running `node server.js` manually.
