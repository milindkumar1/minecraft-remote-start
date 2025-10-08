# Discord OAuth Setup Guide

## Step 1: Create Discord Application

1. **Go to Discord Developer Portal**:
   - Visit [https://discord.com/developers/applications](https://discord.com/developers/applications)
   - Sign in with your Discord account

2. **Create New Application**:
   - Click "New Application"
   - Name it "Minecraft Server Manager" (or whatever you prefer)
   - Click "Create"

3. **Configure OAuth2**:
   - Go to "OAuth2" → "General" in the sidebar
   - Add redirect URI: `https://mcserver.milindkumar.dev/api/auth/callback/discord`
   - For local development also add: `http://localhost:3000/api/auth/callback/discord`
   - Save changes

4. **Get Client Credentials**:
   - Copy the "Client ID"
   - Click "Reset Secret" and copy the "Client Secret"
   - **Keep these secure!**

## Step 2: Get Discord User IDs

To get someone's Discord User ID:

1. **Enable Developer Mode**:
   - Discord Settings → Advanced → Developer Mode (ON)

2. **Get User ID**:
   - Right-click on a user's profile/message
   - Click "Copy User ID"
   - The ID will be a long number like `123456789012345678`

## Step 3: Configure Environment Variables

Add these to your `.env.local` (development) and Vercel environment variables (production):

```env
DISCORD_CLIENT_ID=your-client-id-from-step-1
DISCORD_CLIENT_SECRET=your-client-secret-from-step-1
DISCORD_ALLOWED_USERS=123456789012345678,987654321098765432
```

### Multiple Users
Separate multiple Discord User IDs with commas:
```env
DISCORD_ALLOWED_USERS=user1_id,user2_id,user3_id
```

## Step 4: Test the Setup

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Visit the sign-in page**:
   - Go to `http://localhost:3000/auth/signin`
   - You should see "Continue with Discord" button

3. **Test Discord login**:
   - Click the Discord button
   - Authorize the application
   - You should be redirected back and signed in

## Step 5: Production Deployment

1. **Update Vercel Environment Variables**:
   ```
   DISCORD_CLIENT_ID=your-actual-client-id
   DISCORD_CLIENT_SECRET=your-actual-client-secret
   DISCORD_ALLOWED_USERS=comma-separated-user-ids
   ```

2. **Update Discord OAuth Redirect URI**:
   - Make sure `https://mcserver.milindkumar.dev/api/auth/callback/discord` is added

## Security Notes

- **Client Secret**: Never expose this in client-side code
- **User IDs**: Only users in the `DISCORD_ALLOWED_USERS` list can access the app
- **Permissions**: The app only requests basic Discord profile information
- **Fallback**: Credentials authentication still works as backup

## Managing Access

### Adding Users:
1. Get their Discord User ID
2. Add it to `DISCORD_ALLOWED_USERS` environment variable
3. Redeploy (for production)

### Removing Users:
1. Remove their ID from `DISCORD_ALLOWED_USERS`
2. Redeploy (for production)

### Checking User IDs:
You can see login attempts in your application logs, including unauthorized attempts with their Discord ID and username.

## Troubleshooting

### "Invalid redirect_uri" Error:
- Check that your redirect URI in Discord matches exactly
- Make sure you're using the right domain (localhost vs production)

### "User not authorized" Error:
- Verify the user's Discord ID is in `DISCORD_ALLOWED_USERS`
- Check that environment variables are set correctly

### OAuth not working:
- Verify `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET` are correct
- Check Discord application is properly configured
- Ensure redirect URIs are set up correctly
