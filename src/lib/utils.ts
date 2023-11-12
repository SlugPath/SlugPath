/**
 * Delays execution of a function `callback` by `wait` ms.
 * @param callback a callback to invoke after a delay
 * @param wait delay in milliseconds
 * @returns
 */
export const debounce = <T extends (...args: any[]) => any>(
  callback: T,
  wait: number,
): ((...args: Parameters<T>) => any) => {
  let timeoutId: NodeJS.Timeout | null;

  return (...args: Parameters<T>) => {
    if (timeoutId !== null) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), wait);
  };
};

export const removeTypenames = (value: any) => {
  if (value && typeof value === "object") {
    delete value.__typename; // Remove __typename property if it exists

    Object.values(value).forEach((val) => {
      // Recursively apply to properties and array elements
      if (typeof val === "object" || Array.isArray(val)) {
        removeTypenames(val);
      }
    });
  }
};

export const deepEqual = (val: any, val2: any) => {
  return JSON.stringify(val) == JSON.stringify(val2);
};
