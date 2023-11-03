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
  // callbacks: {
  // async signIn({ account, profile }) {
  //   if (account && account.provider === "google") {
  //     if (profile && profile.email) {
  //       return profile.email_verified && profile.email.endsWith("@ucsc.edu");
  //     }
  //   }
  //   return false // Do different verification for other providers that don't have `email_verified`
  // },
  // async redirect({ url, baseUrl }) {
  //   console.log('url:', url, 'baseUrl:', baseUrl);
  //   // Allows relative callback URLs
  //   if (url.startsWith("/")) return `${baseUrl}${url}`
  //   // // Allows callback URLs on the same origin
  //   else if (new URL(url).origin === baseUrl) return url
  //   return baseUrl
  // }
  // },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      checks: ["none"],
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
    }),
  ],
});

export { handler as GET, handler as POST };
