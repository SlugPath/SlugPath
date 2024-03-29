"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

export default function LoginGoogleButton() {
  return (
    <button
      className="bg-black flex gap-2 px-6 py-3 rounded-full items-center justify-center mt-8"
      onClick={() => signIn("google", { callbackUrl: "/planner" })}
    >
      <Image
        src="/images/google-logo.png"
        alt="Google logo"
        className="h-5 w-auto"
        width="512"
        height="512"
      />
      <p className="text-white">Continue with Google</p>
    </button>
  );
}
