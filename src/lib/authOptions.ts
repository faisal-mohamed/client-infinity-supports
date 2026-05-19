import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import type { NextAuthOptions } from 'next-auth';
import { validateMfaToken } from './mfa';
import { getAdminByEmail } from './db/admin';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || 'your-development-secret-key-change-in-production',
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        mfaToken: { label: "MFA Token", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.mfaToken) return null;

        try {
          const admin = await getAdminByEmail(credentials.email);
          if (!admin) return null;

          const passwordMatch = await bcrypt.compare(
            credentials.password,
            admin.passwordHash
          );
          if (!passwordMatch) return null;

          // Validate the one-time MFA token
          const mfaValid = await validateMfaToken(admin.id, credentials.mfaToken);
          if (!mfaValid) return null;

          return {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: 'admin'
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
    signOut: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  }
};
