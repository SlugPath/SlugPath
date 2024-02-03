import { useEffect, useRef, useState } from "react";

import { SetState } from "../types/Common";

function isEmptyArray<T>(value: T | T[]): value is T[] {
  return Array.isArray(value) && value.length === 0;
}

export default function useLocalStorage<T>(
  key: string,
  defaultValue: T,
): [T, SetState<T>] {
  const isMounted = useRef(false);
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    const initialize = () => {
      if (!defaultValue || isEmptyArray(defaultValue)) {
        try {
          const item = window.localStorage.getItem(key);
          if (item) {
            setValue(JSON.parse(item));
          }
        } catch (e) {
          console.log(e);
        }
      } else {
        setValue(defaultValue);
      }
    };
    initialize();

    return () => {
      isMounted.current = false;
    };
  }, [key, defaultValue]);

  useEffect(() => {
    if (isMounted.current) {
      window.localStorage.setItem(key, JSON.stringify(value));
    } else {
      isMounted.current = true;
    }
  }, [key, value]);

  return [value, setValue];
}
