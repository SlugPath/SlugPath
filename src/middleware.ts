import { withAuth } from "next-auth/middleware";

// NOTE: Middleware only handles authentication, not authorization (e.g. routes
// from login page to dashboard or register page based on user session, but
// /planner vs /register routing happens on page layout redirect)
export default withAuth({
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/",
  },
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
     */
    "/((?!api|_next/static|_next/image|images|favicon.ico).*)",
  ],
};
