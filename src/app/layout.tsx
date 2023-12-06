import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ScreenSizeWarning from "./components/ScreenSizeWarning";
import { NextAuthProvider } from "./Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UCSC Course Planner",
  description: "A simple and easy to use course planner",
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
