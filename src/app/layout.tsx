import ScreenSizeWarning from "@components/modals/ScreenSizeWarning";
import { OpenInNew } from "@mui/icons-material";
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
          <div className="bg-blue-200 dark:bg-bg-dark bg-cover min-h-screen pb-1">
            <Navbar />
            <BetaWarning />
            {children}
            <div>
              <a
                target="_blank"
                href="https://forms.gle/g6jsmGj2r2SCipwC6"
                className="group fixed bottom-0 right-20 px-5 py-2 bg-rose-400 text-white text-sm font-semibold tracking-wider rounded-t-md flex items-center gap-1 hover:bg-rose-500"
              >
                Feedback
                <OpenInNew
                  sx={{ color: "white", height: "1rem", width: "auto" }}
                />
              </a>
            </div>
          </div>
        </Provider>
      </body>
    </html>
  );
}
