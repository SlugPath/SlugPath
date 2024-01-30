"use client";

import { WarningAmberRounded } from "@mui/icons-material";
import { Typography } from "@mui/joy";
import { useSession } from "next-auth/react";

export default function UnauthenticatedWarning() {
  const { status } = useSession();
  if (status === "authenticated") return null;
  return (
    <Typography
      variant="soft"
      color="warning"
      component="p"
      startDecorator={<WarningAmberRounded color="warning" />}
      justifyContent="center"
      className="py-3 px-6 rounded-b-2xl"
    >
      We recommend logging in with your UCSC email in order to save your data.
    </Typography>
  );
}
