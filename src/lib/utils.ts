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

export const deepEqual = (obj1: any, obj2: any): boolean => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};
