# Deployment Guide

## Prerequisites

1. **Windows PC Setup**:
   - Node.js installed
   - Your `start_servers.bat` file ready
   - Network access configured (port forwarding if needed)

2. **Vercel Account**: 
   - Sign up at [vercel.com](https://vercel.com)
   - Connect your GitHub account

## Step 1: Prepare Environment Variables

### Set up Discord OAuth (Recommended)
1. **Follow the Discord Setup Guide**: See [DISCORD_SETUP.md](DISCORD_SETUP.md)
2. **Get your Discord User ID**: Enable Developer Mode in Discord, right-click your profile, "Copy User ID"

### Generate Password Hash (Fallback Authentication)
```bash
node scripts/generate-password-hash.js
```
Enter your desired password and copy the generated hash.

### Web Application Environment Variables
Create these in your Vercel dashboard under your project settings:

```
NEXTAUTH_URL=https://mcserver.milindkumar.dev
NEXTAUTH_SECRET=your-super-secret-key-32-chars-long
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret
DISCORD_ALLOWED_USERS=123456789012345678,987654321098765432
AUTH_USERNAME=admin
AUTH_PASSWORD_HASH=your-bcrypt-hash-from-step-above
WINDOWS_AGENT_URL=http://your-pc-external-ip:8080
WINDOWS_AGENT_SECRET=shared-secret-between-web-app-and-agent
```

## Step 2: Deploy to Vercel

1. **Connect Repository**:
   - Go to Vercel dashboard
   - Click "New Project"
   - Connect your GitHub repository
   - Select this project

2. **Configure Build Settings**:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Set Environment Variables**:
   - Add all the environment variables from Step 1
   - Make sure to use your actual values

4. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete

## Step 3: Configure Custom Domain

1. **In Vercel Dashboard**:
   - Go to your project settings
   - Click "Domains"
   - Add your custom domain: `mcserver.milindkumar.dev`

2. **DNS Configuration**:
   - Add a CNAME record pointing to `cname.vercel-dns.com`
   - Or add A records pointing to Vercel's IP addresses

## Step 4: Set Up Windows Agent

1. **Install Dependencies**:
   ```bash
   cd windows-agent
   npm install
   ```

2. **Configure Environment**:
   Edit `windows-agent/.env`:
   ```
   PORT=8080
   BAT_FILE_PATH=C:\Users\Milind Kumar\Desktop\start_servers.bat
   WINDOWS_AGENT_SECRET=shared-secret-between-web-app-and-agent
   ALLOWED_ORIGINS=https://mcserver.milindkumar.dev
   ```

3. **Run Agent**:
   ```bash
   npm start
   ```

4. **Run as Windows Service** (Optional):
   ```bash
   npm install -g pm2
   pm2 start server.js --name minecraft-agent
   pm2 startup
   pm2 save
   ```

## Step 5: Network Configuration

1. **Router Configuration**:
   - Forward port 8080 to your Windows PC
   - Note your external IP address

2. **Dynamic DNS** (if you don't have static IP):
   - Set up a service like DuckDNS or No-IP
   - Update WINDOWS_AGENT_URL accordingly

3. **Firewall**:
   - Allow port 8080 through Windows Firewall
   - Allow port 8080 through your router

## Step 6: Test the Setup

1. **Access Web App**:
   - Go to `https://mcserver.milindkumar.dev`
   - Sign in with your credentials

2. **Test Server Status**:
   - Click "Refresh Status"
   - Should connect to your Windows agent

3. **Test Server Start**:
   - Click "Start Minecraft Servers"
   - Check if your .bat file executes

## Security Considerations

- Change all default passwords and secrets
- Use strong, unique passwords
- Consider setting up a VPN for additional security
- Regularly update your dependencies
- Monitor access logs

## Troubleshooting

### Web App Issues
- Check Vercel function logs
- Verify environment variables are set correctly
- Ensure custom domain is properly configured

### Windows Agent Issues
- Check if port 8080 is accessible from outside
- Verify .bat file path is correct
- Check Windows Agent logs for errors
- Test agent health endpoint: `http://your-ip:8080/health`

### Connection Issues
- Verify firewall settings
- Check router port forwarding
- Confirm external IP address
- Test with curl: `curl -H "Authorization: Bearer your-secret" http://your-ip:8080/status`

## Maintenance

### Updating the Application
1. Push changes to GitHub
2. Vercel will automatically redeploy
3. Update Windows agent if needed

### Monitoring
- Check Vercel analytics for usage
- Monitor Windows agent logs
- Set up uptime monitoring if desired
