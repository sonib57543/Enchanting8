import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Vendor Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid email or password");
        }
        
        // --- 1. Admin Database Authentication Check ---
        const dbAdmin = await prisma.admin.findFirst({
          where: { email: credentials.email }
        });

        if (dbAdmin) {
          const isValidAdmin = await bcrypt.compare(credentials.password, dbAdmin.password);
          if (!isValidAdmin) {
            throw new Error("Invalid admin credentials");
          }
          return {
            id: dbAdmin.id,
            email: dbAdmin.email,
            name: dbAdmin.name || "System Admin",
            role: "admin",
          };
        }

        // --- 1.5. Admin Fallback (.env) Authentication ---
        const isAdminEmail = credentials.email === process.env.ADMIN_EMAIL;
        const isAdminPassword = credentials.password === process.env.ADMIN_PASSWORD;
        
        if (isAdminEmail) {
          if (!isAdminPassword) {
            throw new Error("Invalid credentials");
          }
          return {
            id: "admin-system-id",
            email: credentials.email,
            name: "Enchanting8 Admin",
            role: "admin",
          };
        }

        // --- 2. Vendor Authentication Check ---
        const vendor = await prisma.vendor.findFirst({
          where: { email: credentials.email }
        });
        
        if (!vendor) {
          throw new Error("User not found");
        }

        if (!vendor.isActive) {
          throw new Error("Your account has been deactivated by an administrator. Please contact support.");
        }

        if (vendor.status === "REJECTED") {
          throw new Error("Your application to join Enchanting8 has unfortunately been rejected.");
        }
        
        const isValid = await bcrypt.compare(credentials.password, vendor.password);
        if (!isValid) {
          throw new Error("Invalid credentials");
        }
        
        return {
          id: vendor.id,
          email: vendor.email,
          name: vendor.businessName,
          role: "vendor",
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "development-secret-123",
  pages: {
    signIn: "/vendor",
  }
};
