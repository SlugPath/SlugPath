import ScreenSizeWarning from "@components/modals/ScreenSizeWarning";
import NextAuthProvider from "@contexts/NextAuthProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Slug Path",
  description: "A simple course planner for UCSC students",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <NextAuthProvider>
        <ScreenSizeWarning />
        <body className={inter.className}>{children}</body>
      </NextAuthProvider>
    </html>
  );
}
