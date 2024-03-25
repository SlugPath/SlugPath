"use client";

import { Button } from "@mui/joy";
import { signIn } from "next-auth/react";

export default function LoginButton() {
  return (
    <Button
      variant="solid"
      onClick={() => {
        signIn("google");
      }}
      className="text-secondary-100 dark:text-secondary-200 hover:bg-primary-400"
    >
      Login
    </Button>
  );
}
