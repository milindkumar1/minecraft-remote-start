# Milind's Minecraft Server - Remote Manager

A secure web application that allows authorized Discord users to remotely trigger a pre-existing .bat file that starts both Velocity and NeoForge servers on a Windows PC. The web app is hosted on Vercel and served under a custom domain.

## Features

- 🔒 **Discord-Only Authentication** - Secure authentication via Discord OAuth
- 🎮 **Server Management** - Start Minecraft servers remotely
- 📊 **Status Monitoring** - View server status (running/stopped)
- 🌐 **Web Interface** - Clean, responsive web dashboard
- 🛡️ **Security First** - No arbitrary command execution, HTTPS only
- ☁️ **Cloud Hosted** - Deployed on Vercel with custom domain
- 👥 **Whitelist Access** - Only authorized Discord users can access

## Architecture

```
User Browser → Vercel (Next.js App) → Windows PC (Local Agent) → .bat file
```

1. User authenticates via web interface
2. Web app sends authenticated request to local Windows agent
3. Windows agent executes the specific .bat file
4. Server status is reported back to the user

## Setup Instructions

### 1. Web Application (Vercel)

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env.local`:
   ```
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-change-this-in-production
   DISCORD_CLIENT_ID=your-discord-client-id
   DISCORD_CLIENT_SECRET=your-discord-client-secret
   DISCORD_ALLOWED_USERS=123456789012345678,987654321098765432
   WINDOWS_AGENT_URL=http://your-pc-ip:8080
   WINDOWS_AGENT_SECRET=shared-secret-between-web-app-and-agent
   ```

4. **Set up Discord OAuth** (required):
   - Follow the [Discord Setup Guide](DISCORD_SETUP.md)
   - Get Discord Client ID and Secret
   - Add trusted users' Discord IDs to whitelist

5. Run locally:
   ```bash
   npm run dev
   ```

6. Deploy to Vercel:
   - Connect your GitHub repository to Vercel
   - Configure environment variables in Vercel dashboard
   - Deploy

### 2. Windows Agent

1. Navigate to the Windows agent directory:
   ```bash
   cd windows-agent
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure `.env` file:
   ```
   PORT=8080
   BAT_FILE_PATH=C:\Users\Milind Kumar\Desktop\start_servers.bat
   WINDOWS_AGENT_SECRET=shared-secret-between-web-app-and-agent
   ALLOWED_ORIGINS=http://localhost:3000,https://mcserver.milindkumar.dev
   ```

4. Run the agent:
   ```bash
   npm start
   ```

### 3. Network Configuration

For external access, you'll need to:
1. Configure your router to forward port 8080 to your Windows PC
2. Use a dynamic DNS service or static IP
3. Consider setting up a reverse proxy with SSL/TLS

## Security Considerations

- ✅ Web app uses HTTPS (handled by Vercel)
- ✅ Authentication required for all actions
- ✅ No arbitrary command execution
- ✅ CORS configured for specific origins
- ✅ Bearer token authentication between web app and agent
- ✅ Environment variables for sensitive configuration

## Environment Variables

### Web Application
- `NEXTAUTH_URL`: URL of your web application
- `NEXTAUTH_SECRET`: Secret for NextAuth.js sessions
- `AUTH_USERNAME`: Username for authentication
- `AUTH_PASSWORD_HASH`: Bcrypt hash of the password
- `WINDOWS_AGENT_URL`: URL of your Windows agent
- `WINDOWS_AGENT_SECRET`: Shared secret for agent authentication

### Windows Agent
- `PORT`: Port for the agent to run on
- `BAT_FILE_PATH`: Full path to your server startup script
- `WINDOWS_AGENT_SECRET`: Shared secret for authentication
- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins

## API Endpoints

### Web Application
- `POST /api/auth/[...nextauth]` - Authentication
- `GET /api/server` - Get server status
- `POST /api/server` - Start servers

### Windows Agent
- `GET /health` - Health check
- `GET /status` - Get server status (auth required)
- `POST /start-servers` - Start servers (auth required)

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Authentication**: NextAuth.js with credentials provider
- **Backend**: Next.js API routes
- **Windows Agent**: Node.js, Express
- **Deployment**: Vercel
- **Security**: bcrypt, CORS, environment variables

## License

MIT License - see LICENSE file for details
