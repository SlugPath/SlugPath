import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Providers from "./contexts/Providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Slug Path",
  description: "A simple course planner for UCSC students",
  metadataBase: new URL("https://slugpath.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="overflow-hidden h-full">
      <link rel="icon" href="/icon.svg" type="image/svg" sizes="any" />
      <body className={`h-full overflow-auto ${inter.className}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
