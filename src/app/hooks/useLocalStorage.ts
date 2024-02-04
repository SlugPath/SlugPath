import { useEffect, useRef, useState } from "react";

import { SetState } from "../types/Common";

function isArray<T>(value: T | T[]): value is T[] {
  return Array.isArray(value);
}

export default function useLocalStorage<T>(
  key: string,
  remoteValue: T,
): [T, SetState<T>] {
  const isMounted = useRef(false);
  const initial = isArray(remoteValue) ? ([] as T) : ({} as T);
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    const initialize = () => {
      const item = window.localStorage.getItem(key);
      if (item) {
        try {
          setValue(JSON.parse(item));
        } catch (e) {
          console.error(e);
        }
      } else {
        setValue(remoteValue);
      }
    };
    initialize();

    return () => {
      isMounted.current = false;
    };
  }, [key, remoteValue]);

  useEffect(() => {
    if (isMounted.current) {
      window.localStorage.setItem(key, JSON.stringify(value));
    } else {
      isMounted.current = true;
    }
  }, [key, value]);

  return [value, setValue];
}
