import { useEffect } from "react";

export default function useDebounce({
  callback,
  delay,
  dependencies,
}: {
  callback: () => void;
  delay: number;
  dependencies: any[];
}) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
