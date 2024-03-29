import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // console.log("req", req);
    const nextUrl = req.nextUrl;
    const token = req.nextauth.token;

    const isAuthed = !!token;
    const isRecordCreated = isAuthed && token?.isUserRecordCreated;

    const isOnLogin = nextUrl.pathname === "/";
    const isOnRegister = nextUrl.pathname.startsWith("/register");
    const isOnPlanner = nextUrl.pathname.startsWith("/planner");

    console.log(`pathname ${nextUrl.pathname}`);
    console.log(`isOnLogin: ${isOnLogin}`);
    console.log(`isAuthed: ${isAuthed}, isRecordCreated: ${isRecordCreated}`);

    if (!isAuthed) {
      if (!isOnLogin) {
        return NextResponse.redirect(new URL("/", nextUrl.origin));
      }

      return;
    }

    if (!isRecordCreated) {
      if (!isOnRegister) {
        return NextResponse.redirect(new URL("/register", nextUrl.origin));
      }

      return;
    }

    if (!isOnPlanner) {
      return NextResponse.redirect(new URL("/planner", nextUrl.origin));
    }

    return;
  },
  {
    pages: {
      signIn: "/",
      signOut: "/",
      error: "/",
    },
  },
  // {
  //   callbacks: {
  //     authorized: ({token}) => token
  //   }
  // }
);

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/", "/register:path*", "/planner:path*"],
};
