import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { JWT } from "next-auth/jwt";
import { SignJWT } from "jose";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";

// Function to generate JWT manually
const generateJWT = async (payload: Record<string, unknown>) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET environment variable");
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("365d")
    .sign(secret);
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: { id: true, name: true, password: true, email: true },
        });

        if (!user) {
          throw new Error("No user found with this email");
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password || ""
        );

        if (!isValidPassword) {
          throw new Error("Incorrect password");
        }

        const jwt = await generateJWT({ id: user.id });

        await prisma.user.update({
          where: { id: user.id },
          data: { token: jwt },
        });

        return { id: user.id, name: user.name || "", email: user.email };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "credentials") return true;

      if (account?.provider === "google" || account?.provider === "github") {
        const email = profile?.email;

        if (!email) throw new Error("No email provided");

        let dbUser = await prisma.user.findUnique({ where: { email } });

        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              name: user.name || "",
              email,
              image: user.image || "",
            },
          });
        }

        user.id = dbUser.id;
        return true;
      }

      return false;
    },

    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          name: user.name,
          picture: user.image,
        };
      }
      return token;
    },

    async session({ session, token }) {
      return {
        ...session,
        user: {
          id: token.id,
          email: token.email,
          name: token.name,
          image: token.picture,
        },
      };
    },
  },

  session: { strategy: "jwt" },

  pages: {
    signIn: "/signin",
  },
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
