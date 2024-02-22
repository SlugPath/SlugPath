"use client";

import ErrorTemplate from "@components/error/ErrorTemplate";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorTemplate
      title="Couldn't load application."
      error={error}
      reset={reset}
    />
  );
}
