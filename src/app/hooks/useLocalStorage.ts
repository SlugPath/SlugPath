import { isArray } from "lodash";
import { useEffect, useRef, useState } from "react";

import { SetState } from "../types/Common";

function getInitial<T>(remoteValue: T): T {
  if (isArray(remoteValue)) {
    return [] as T;
  } else if (typeof remoteValue === "object") {
    return {} as T;
  }
  return remoteValue;
}

export default function useLocalStorage<T>(
  key: string,
  remoteValue: T,
): [T, SetState<T>] {
  const isMounted = useRef(false);
  const [value, setValue] = useState<T>(getInitial(remoteValue));

  useEffect(() => {
    const initialize = () => {
      const item = window.localStorage.getItem(key);
      if (item) {
        try {
          setValue(JSON.parse(item) as T);
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
    // Disable this eslint rule because remoteValue might be a nested object
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, JSON.stringify(remoteValue)]);

  useEffect(() => {
    if (isMounted.current) {
      window.localStorage.setItem(key, JSON.stringify(value));
    } else {
      isMounted.current = true;
    }
    // Disable this eslint rule because value might be a nested object
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, JSON.stringify(value)]);

  return [value, setValue];
}
