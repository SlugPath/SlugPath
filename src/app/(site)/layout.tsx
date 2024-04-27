import ScreenSizeWarning from "@/app/(site)/ScreenSizeWarning";
import { authOptions } from "@/lib/auth";
import BetaWarning from "@components/beta/BetaWarning";
import Navbar from "@components/navbar/Navbar";
import { OpenInNew } from "@mui/icons-material";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (session && !session.user.isRecordCreated) {
    redirect("/register");
  }

  /* 
  FIXME: 
  1. Need to remove 'max-h-screen min-h-screen' from the first div classname 
     for when the user is viewing on a mobile device and has their phone in landscape.
     Something like: ${isMobileView && landscape? '' : 'max-h-screen min-h-screen'}
  2. Also need to hide the feedback button under the same conditions.
*/
  return (
    <div
      className={
        "bg-bg-light dark:bg-bg-dark bg-cover flex flex-col min-w-0 max-h-screen min-h-screen"
      }
    >
      <ScreenSizeWarning />
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
          <OpenInNew sx={{ color: "white", height: "1rem", width: "auto" }} />
        </a>
      </div>
    </div>
  );
}
