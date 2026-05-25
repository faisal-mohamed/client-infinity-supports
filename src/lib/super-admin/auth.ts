/**
 * Super Admin Authentication — NextAuth Configuration
 * Completely separate auth flow from provider admin
 */

import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import type { NextAuthOptions } from 'next-auth';
import { getSuperAdminByEmail, updateSuperAdmin } from './db/super-admin';
import { createAuditLog } from './db/audit';
import { nowISO } from '../dynamodb-utils';
export const superAdminAuthOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: 'super-admin-credentials',
      name: 'Super Admin',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;

        const admin = await getSuperAdminByEmail(credentials.email);
        if (!admin) return null;

        const valid = await bcrypt.compare(credentials.password, admin.passwordHash);
        if (!valid) return null;

        // Update last login
        await updateSuperAdmin(admin.id, { lastLoginAt: nowISO() });

        // Audit log
        const forwarded = req?.headers?.['x-forwarded-for'];
        const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded || 'unknown';
        await createAuditLog({
          actorId: admin.id,
          actorEmail: admin.email,
          category: 'AUTH',
          action: 'super_admin.login',
          ipAddress: ip,
          userAgent: req?.headers?.['user-agent'] || undefined,
        });

        return {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: 'super_admin',
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60, // 8 hours (stricter than provider admin)
  },
  pages: {
    signIn: '/super-admin/login',
    error: '/super-admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
};
