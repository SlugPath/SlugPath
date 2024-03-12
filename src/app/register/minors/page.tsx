"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Minors() {
  return (
    <>
      <div>
        <h2 className="mt-8 text-3xl font-bold leading-9 tracking-tight text-gray-900">
          Add any minors
        </h2>
        <div className="h-2" />
        <p className="text-subtext leading-7 max-w-md">
          Add any minors you are thinking of pursuing (don’t worry, you can
          always change these later).
        </p>
      </div>

      <div className="h-12" />

      <div className="h-10" />

      <Link
        href="/planner"
        className={cn(
          false && "cursor-not-allowed opacity-50",
          "bg-primary-500 text-white w-full flex items-center justify-center py-2 rounded-lg transition-opacity",
        )}
        aria-disabled={false === undefined}
      >
        Start Planning
      </Link>
    </>
  );
}
