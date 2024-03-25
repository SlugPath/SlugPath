import { env as envClient } from "@/env/client.mjs";
import { env } from "@/env/server.mjs";
import prisma from "@/lib/prisma";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) throw new Error("user must have an email");

      return true;
    },

    async redirect({ url }) {
      return url;
    },

    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.sub = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub ?? "";

        // QUESTION: Why is default planner id being set here? Should be in user
        // state?
        const userRecord = await prisma.user.findFirst({
          where: {
            id: session.user.id,
          },
          select: {
            defaultPlannerId: true,
            majors: true,
          },
        });

        if (userRecord) {
          session.user.defaultPlannerId = userRecord?.defaultPlannerId;
          session.user.programs = userRecord?.majors;
        }

        session.user.isRecordCreated = userRecord !== null;
        session.user.email = token.email;
        session.user.name = token.name;
      }

      return session;
    },
  },

  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      checks: ["none"],
    }),
  ],
  secret: envClient.NEXTAUTH_SECRET,
};
