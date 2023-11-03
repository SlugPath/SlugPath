import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

declare module "next-auth" {
  interface Profile {
    email_verified: boolean;
  }
}

const handler = NextAuth({
  // pages: {
  //   signIn: "/redirect", // Redirect users to "/login" when signing in
  // },
  callbacks: {
    async signIn({ account, profile }) {
      if (account && account.provider === "google") {
        if (profile && profile.email) {
          console.log(profile.email);
          return profile.email_verified && profile.email.endsWith("@ucsc.edu");
        }
      }
      return false; // Do different verification for other providers that don't have `email_verified`
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
