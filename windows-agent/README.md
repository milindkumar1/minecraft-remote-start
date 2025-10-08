# Minecraft Server Windows Agent

This is a local Windows agent that allows the web application to remotely trigger your Minecraft server startup script.

## Installation

1. Navigate to the windows-agent directory:
   ```
   cd windows-agent
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure environment variables in `.env`:
   - `BAT_FILE_PATH`: Path to your start_servers.bat file
   - `WINDOWS_AGENT_SECRET`: Shared secret for authentication
   - `PORT`: Port for the agent to run on (default: 8080)

## Usage

### Development
```
npm run dev
```

### Production
```
npm start
```

### Running as a Windows Service (Optional)

For production use, you might want to run this as a Windows service. You can use tools like:
- [node-windows](https://www.npmjs.com/package/node-windows)
- [pm2](https://www.npmjs.com/package/pm2)

## Endpoints

- `GET /health` - Health check (no auth required)
- `GET /status` - Get server status (auth required)
- `POST /start-servers` - Start Minecraft servers (auth required)

## Security

- Uses Bearer token authentication
- CORS configured for specific origins
- Only executes the pre-configured .bat file
- No arbitrary command execution

## Firewall Configuration

If you plan to access this from outside your local network, make sure to:
1. Configure your router's firewall to allow incoming connections on the agent port
2. Use a reverse proxy with HTTPS (recommended)
3. Consider using a VPN for additional security
