import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";

const handler = NextAuth({
  callbacks: {
    async signIn({ user }) {
      const res = await prisma.user.upsert({
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
      console.log(`Upserted user: ${JSON.stringify(res)}`);
      return true;
    },

    async redirect({ url }) {
      return url;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.id = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      checks: ["none"],
    }),
  ],
  secret: process.env.SECRET,
});

export { handler as GET, handler as POST };
