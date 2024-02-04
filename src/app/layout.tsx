import ScreenSizeWarning from "@components/modals/ScreenSizeWarning";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import BetaWarning from "./components/beta/BetaWarning";
import Navbar from "./components/navbar/Navbar";
import Provider from "./contexts/Provider";
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
      <body className={inter.className}>
        <Provider>
          <ScreenSizeWarning />
          <div className="bg-bg-light dark:bg-bg-dark min-h-screen pb-1">
            <Navbar />
            <BetaWarning />
            {children}
          </div>
        </Provider>
      </body>
    </html>
  );
}
