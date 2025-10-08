import { NextAuthOptions } from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'

// Whitelist of Discord user IDs allowed to access the system
const ALLOWED_DISCORD_USERS = process.env.DISCORD_ALLOWED_USERS?.split(',') || []

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/auth/signin'
  },
  callbacks: {
    async signIn({ user, account }) {
      // For Discord OAuth, check if user is in the whitelist
      if (account?.provider === 'discord') {
        if (!ALLOWED_DISCORD_USERS.includes(user.id)) {
          console.log(`Unauthorized Discord login attempt: ${user.id} (${user.name})`)
          return false
        }
        console.log(`Authorized Discord login: ${user.id} (${user.name})`)
        return true
      }
      
      return false // Only allow Discord authentication
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.username = user.username || user.name || 'Unknown'
        token.provider = account?.provider
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.username = token.username as string
        session.user.provider = token.provider as string
      }
      return session
    }
  }
}
