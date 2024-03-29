import { Button } from "@mui/joy";
import Image from "next/image";
import { useEffect } from "react";

export default function ErrorTemplate({
  title,
  error,
  reset,
}: {
  title: string;
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("ErrorTemplate", error.message, error.stack, error.digest);
  }, [error]);

  return (
    <div className="grid h-screen place-items-center">
      <div className="h-96 flex flex-row w-auto max-w-2xl gap-3 place-items-center">
        <Image
          src="/images/slug-icon-error.png"
          width={250}
          height={250}
          alt="Slug Icon"
          className="col-span-1 self-center px-2"
        />
        <div className="pt-6 px-3 col-span-2 flex flex-col items-center gap-2">
          <div className="text-center text-5xl text-bold dark:text-white">
            Uh oh...
          </div>
          <div className="text-center dark:text-white">{title}</div>
          <Button
            variant="soft"
            color="neutral"
            className="w-20"
            onClick={() => reset()}
          >
            Retry
          </Button>
        </div>
      </div>
    </div>
  );
}
