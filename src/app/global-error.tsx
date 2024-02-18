"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    console.error("GlobalError", error.message, error.stack, error.digest);
  }, [error]);
  return (
    <html>
      <body>
        <main className="grid h-screen place-items-center bg-gray-100">
          <div className="h-96 flex flex-row w-auto max-w-2xl gap-3 place-items-center">
            <div className="pt-6 px-3 col-span-2 flex flex-col gap-2">
              <div className="text-center text-5xl text-bold">
                Application Error
              </div>
              <div className="text-center">
                We could not load the application. Please try again later.
              </div>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
