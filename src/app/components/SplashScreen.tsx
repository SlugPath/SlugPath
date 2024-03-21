"use client";

import { LinearProgress } from "@mui/joy";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCountUp } from "use-count-up";

export default function SplashScreen() {
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    setLoading(queryClient.isFetching() > 0);
  }, [setLoading, queryClient]);

  const { value } = useCountUp({
    isCounting: true,
    duration: 5,
    easing: "linear",
    start: 0,
    end: 90,
    onComplete: () => ({
      shouldRepeat: true,
      delay: 2,
    }),
  });
  if (!loading) return <> </>;

  return (
    <div className="flex flex-col justify-center items-center h-screen dark:bg-bg-dark">
      <div className="text-center">
        <h1 className="text-4xl font-semibold dark:text-white pl-6">
          Slug Path
        </h1>
        <Image
          src="/images/slug-icon.png"
          width={250}
          height={250}
          alt="Slug Icon"
          className="col-span-1 self-center px-2"
        />
        <LinearProgress
          determinate
          variant="plain"
          size="lg"
          value={Number(value)}
          thickness={22}
          sx={{
            "--LinearProgress-radius": "20px",
          }}
        >
          <h1 className="text-sm font-bold mix-blend-multiply">
            LOADING... {`${Math.round(Number(value!))}%`}{" "}
          </h1>
        </LinearProgress>
      </div>
    </div>
  );
}
