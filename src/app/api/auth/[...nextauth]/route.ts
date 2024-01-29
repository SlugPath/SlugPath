import { env as envClient } from "@/env/client.mjs";
import { env } from "@/env/server.mjs";
import prisma from "@/lib/prisma";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  callbacks: {
    async signIn({ user }) {
      await prisma.user.upsert({
        where: {
          id: user.id,
        },
        update: {
          name: user.name,
        },
        create: {
          name: user.name,
          email: user.email,
          id: user.id,
        },
      });
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
        // Put the default planner id of the current user into the session context
        session.user.defaultPlannerId = (
          await prisma.user.findFirst({
            where: {
              id: session.user.id,
            },
            select: {
              defaultPlannerId: true,
            },
          })
        )?.defaultPlannerId;
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
});

export { handler as GET, handler as POST };
