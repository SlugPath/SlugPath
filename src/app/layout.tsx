import ScreenSizeWarning from "@components/modals/ScreenSizeWarning";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import BetaWarning from "./components/beta/BetaWarning";
import Navbar from "./components/navbar/Navbar";
import Provider from "./contexts/Providers";
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
    <html lang="en" className="overflow-hidden h-full">
      <body className={`h-full overflow-auto ${inter.className}`}>
        <Provider>
          <ScreenSizeWarning />
          <div className="bg-blue-200 dark:bg-bg-dark bg-cover min-h-screen border-green-500 border-2 flex flex-col max-h-screen min-w-0">
            <Navbar />
            <BetaWarning />
            {children}
          </div>
        </Provider>
      </body>
    </html>
  );
}
