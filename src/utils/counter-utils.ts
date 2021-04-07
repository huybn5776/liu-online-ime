export function getCounter(initialValue = 0): { current: () => number; next: () => number } {
  let current = initialValue;
  return {
    current: () => current,
    next: () => {
      current += 1;
      return current;
    },
  };
}
