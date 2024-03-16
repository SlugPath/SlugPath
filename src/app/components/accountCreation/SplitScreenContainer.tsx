import { HelpOutline } from "@mui/icons-material";

import { Logo } from "../Logo";

interface SplitScreenContainerProps {
  children: React.ReactNode;
}

export default function SplitScreenContainer({
  children,
}: SplitScreenContainerProps) {
  return (
    <div className="flex min-h-full flex-1">
      <div className="flex flex-col min-h-full justify-between lg:w-auto w-full">
        <div className="flex justify-between items-center w-full min-h-20 py-5 px-8">
          <Logo className="h-12 w-auto" />
          <HelpOutline className="h-6 w-6" />
        </div>
        <div className="flex flex-1 flex-col justify-between px-4 sm:py-12 sm:px-6 lg:px-20 min-w-0">
          {children}
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover p-2"
          src="/images/ucsc.jpg"
          alt=""
        />
      </div>
    </div>
  );
}