import ScreenSizeWarning from "@/app/components/modals/ScreenSizeWarning";
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
  const session = await getServerSession();
  if (!session?.user.id) redirect("/");
  return (
    <div className="bg-bg-light dark:bg-bg-dark bg-cover min-h-screen flex flex-col max-h-screen min-w-0">
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
