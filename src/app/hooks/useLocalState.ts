import { useEffect, useState } from "react";

/**
 * A custom hook that fetches and updates the contents of a variable via local storage
 *
 * @param key key in local storage
 * @param initialValue initial value of the stateful variable
 * @returns the variable and a function to update the variable with
 */
export default function useLocalState<T>(
  key: string,
  initialValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(initialValue);

  useEffect(() => {
    const initialize = (key: string) => {
      try {
        const item = window.localStorage.getItem(key);
        if (item && item !== null) return JSON.parse(item);
        window.localStorage.setItem(key, JSON.stringify(initialValue));
        return initialValue;
      } catch (e) {
        console.error(e);
        return initialValue;
      }
    };

    setState(initialize(key));
    // Only want to reload from local if key changes and on mount. If initial value is dynamic like uuidv4(),
    // this will run forever, so initialValue is ommitted from deps array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [state, setState];
}
