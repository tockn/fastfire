export const unique = <T>(arr: Array<T>): Array<T> => {
  return Array.from(new Set(arr));
};
