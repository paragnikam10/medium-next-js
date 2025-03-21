import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import { JWTPayload, SignJWT } from "jose";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";

const generateJWT = async (payload: JWTPayload) => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || "secret");

  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("365d")
    .sign(secret);

  return jwt;
};

export const authOptions : NextAuthOptions = {
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

        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email,
          },
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
          data: {
            token: jwt,
          },
        });

        return {
          id: user.id,
          name: user.name || "",
          email: credentials.email,
          token: jwt,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account && account.provider === "credentials") {
        return true;
      }
      if (
        account &&
        (account.provider === "google" || account.provider === "github")
      ) {
        console.log("inside signIn callback");
        const email = profile?.email;

        let dbUser = await prisma.user.findUnique({
          where: { email },
        });

        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              name: user.name,
              email: user.email,
              image: user.image,
            },
          });
        }
        user.id = dbUser.id;
        console.log("userid line 124", user.id);
        return true;
      }
      return true;
    },

    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id as string;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      console.log("token line 130", token);
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (session && session.user && token.id) {
        session.user.id = token.id as string;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.picture;
      }
      console.log("session line 146", session);
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/signin",
  },
  debug: true,
} satisfies NextAuthOptions;

export default NextAuth(authOptions);
