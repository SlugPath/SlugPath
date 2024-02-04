import { debounce } from "lodash";
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(debounce(callback, delay), dependencies);
}
