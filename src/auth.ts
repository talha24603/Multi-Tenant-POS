import NextAuth, { AuthError, NextAuthConfig } from "next-auth"
import CredentialProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import prisma from "./prismaClient"
import { compare } from "bcryptjs"

// Validate required environment variables
if (!process.env.AUTH_SECRET) {
  console.error("AUTH_SECRET environment variable is missing")
  // Don't throw in production, just log the error
  if (process.env.NODE_ENV === 'development') {
    throw new Error("AUTH_SECRET environment variable is required")
  }
}

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is missing")
  if (process.env.NODE_ENV === 'development') {
    throw new Error("DATABASE_URL environment variable is required")
  }
}

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.warn("Google OAuth credentials not found. Google sign-in will be disabled.")
}

export const authOptions: NextAuthConfig = {
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        allowDangerousEmailAccountLinking: true,
      })
    ] : []),
    CredentialProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials: any) => {
        try {
          const user = await prisma.user.findUnique({ where: { email: credentials.email } })
          if (!user) throw new Error("invalid email or password")
          const isMatch = await compare(credentials.password, user.password || "")
          if (!isMatch) throw new Error("incorrect password")
          if (!user.isVerified) throw new Error("Account not verified. Please verify your email before logging in.")
          return {  
            id: user.id,           
            name: user.name || "", 
            email: user.email, 
            isVerified: user.isVerified, 
            stripeCustomerId: user.stripeCustomerId,
          }
        } catch (error) {
          console.error("Auth error:", error)
          throw error
        }
      },
    }),
  ],

  secret: process.env.AUTH_SECRET,
  debug: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/sign-in" },

  callbacks: {
    signIn: async ({ user, account }) => {
      if (account?.provider === "google") {
        try {
          const existing = await prisma.user.findUnique({ where: { email: user.email! } })
          if (!existing) {
            await prisma.user.create({
              data: { 
                 name: user.name!, email: user.email!, isVerified: true, provider: "google", password: ""
              },
            })
          }
          return true
        } catch {
          throw new AuthError("Error while creating user")
        }
      }
      return true  // allow credentials sign-in
    },
    async jwt({ token, user }) {
      // Initial sign-in: `user` is present
        if (user) {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email! },
            include: { 
              tenants: {
                include: {
                  tenant: true
                }
              }
            },
          });
      
          if (dbUser) {
            token.id = dbUser.id;
            token.name = dbUser.name;
            token.email = dbUser.email;
            token.isVerified = dbUser.isVerified;
            token.stripeCustomerId = dbUser.stripeCustomerId;
      
            // Check if user is superAdmin (temporary workaround until Prisma client is regenerated)
            const isSuperAdmin = dbUser.email === "superadmin@gmail.com";
            
            console.log("🔍 Auth Debug:", {
              email: dbUser.email,
              isSuperAdmin,
              tenants: dbUser.tenants.length
            });
            
            if (isSuperAdmin) {
              token.role = "superAdmin";
              token.tenantId = null;
              token.tenantName = null;
              console.log("✅ Setting superAdmin role for:", dbUser.email);
            } else {
              // If user has multiple tenants, pick the first or let user choose later
              const tenantUser = dbUser.tenants[0];
              token.role = tenantUser?.role || null;
              token.tenantId = tenantUser?.tenantId || null;
              token.tenantName = tenantUser?.tenant?.name || null;
            }
          }
        }
        return token;
    },
    session: async ({ session, token }) => {
      session.user = {
        id: token.id as string,
        name: token.name as string,
        email: token.email as string,
        role: token.role as string,
        tenantId: token.tenantId as string,
        tenantName: token.tenantName as string,
        isVerified: token.isVerified as boolean,  
        stripeCustomerId: token.stripeCustomerId as string | null,
        emailVerified: null,
      }
      
      return session
    },
  },
}

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions)
