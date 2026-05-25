import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import type { NextAuthOptions } from 'next-auth';
import { validateMfaToken } from './mfa';
import { getAdminByEmail } from './db/admin';
import { getSuperAdminByEmail, updateSuperAdmin } from './super-admin/db/super-admin';
import { getOrganizationById } from './super-admin/db/organizations';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || 'your-development-secret-key-change-in-production',
  providers: [
    // Provider Admin login (with MFA)
    CredentialsProvider({
      id: 'admin-credentials',
      name: "Admin Credentials",
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

          const passwordMatch = await bcrypt.compare(credentials.password, admin.passwordHash);
          if (!passwordMatch) return null;

          const mfaValid = await validateMfaToken(admin.id, credentials.mfaToken);
          if (!mfaValid) return null;

          // Check organization status if admin belongs to one
          if (admin.organizationId) {
            const org = await getOrganizationById(admin.organizationId);
            if (!org || org.status !== 'ACTIVE') {
              console.error(`Login denied: org ${admin.organizationId} status is ${org?.status || 'not found'}`);
              return null;
            }
          }

          return {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: 'admin',
            organizationId: admin.organizationId,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    }),
    // Super Admin login (platform level)
    CredentialsProvider({
      id: 'super-admin-credentials',
      name: "Super Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const admin = await getSuperAdminByEmail(credentials.email);
          if (!admin) return null;

          const valid = await bcrypt.compare(credentials.password, admin.passwordHash);
          if (!valid) return null;

          await updateSuperAdmin(admin.id, { lastLoginAt: new Date().toISOString() });

          return {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: 'super_admin',
          };
        } catch (error) {
          console.error('Super admin auth error:', error);
          return null;
        }
      }
    }),
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
        token.organizationId = (user as any).organizationId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        (session.user as any).organizationId = token.organizationId;
      }
      return session;
    }
  }
};
