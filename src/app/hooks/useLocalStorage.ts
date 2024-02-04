import { useEffect, useRef, useState } from "react";

import { SetState } from "../types/Common";

function isEmpty(value: any) {
  if (!value) return true;
  if (value.length === 0) return true;
  return false;
}

export default function useLocalStorage<T>(
  key: string,
  remoteValue: T,
  defaultValue: T,
): [T, SetState<T>] {
  const isMounted = useRef(false);
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    const setRemoteValue = () => {
      if (!isEmpty(remoteValue)) setValue(remoteValue);
    };
    const initialize = () => {
      const item = window.localStorage.getItem(key);
      if (item) {
        try {
          const val = JSON.parse(item);
          if (!isEmpty(val)) {
            setValue(val);
          } else {
            setRemoteValue();
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        setRemoteValue();
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
