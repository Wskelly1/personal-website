import { NextAuthOptions, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { JWT } from 'next-auth/jwt';
import dbConnect from '@/lib/db';
import AdminConfig from '@/models/AdminConfig';

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin Access',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials');
          throw new Error('Please enter both email and password');
        }

        try {
          console.log('Connecting to database...');
          await dbConnect();
          console.log('Database connected successfully');
          
          // Get admin configuration from database
          console.log('Fetching admin config...');
          const adminConfig = await AdminConfig.findOne({ key: 'credentials' });
          console.log('Current admin config:', adminConfig ? 'Found' : 'Not found');
          
          if (!adminConfig) {
            throw new Error('Admin account not configured');
          }

          console.log('Attempting login with email:', credentials.email);
          console.log('Stored admin email:', adminConfig.email);
          
          // Verify credentials
          if (credentials.email === adminConfig.email) {
            console.log('Email matched, verifying password...');
            const isValidPassword = await bcrypt.compare(
              credentials.password,
              adminConfig.passwordHash
            );

            console.log('Password verification result:', isValidPassword);

            if (isValidPassword) {
              return {
                id: '1',
                email: adminConfig.email,
                name: 'Admin',
                role: 'admin'
              };
            }
          }

          throw new Error('Invalid email or password');
        } catch (error) {
          console.error('Auth error:', error);
          throw error;
        }
      }
    })
  ],
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = 'admin';
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true
}; 