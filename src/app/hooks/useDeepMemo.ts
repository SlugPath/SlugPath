import { deepEqual } from "@/lib/utils";
import { useMemo, useRef } from "react";

/**
 * Wrapper hook around useMemo for use with objects
 * @param factory the initializer function
 * @param deps the dependencies
 * @returns a memoized value
 */
export default function useDeepMemo<T>(factory: () => T, deps: any[]): T {
  const ref = useRef<any[]>([]);

  if (!deepEqual(deps, ref.current)) {
    ref.current = deps;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, ref.current);
}
