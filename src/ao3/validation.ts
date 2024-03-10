export function isValidAO3DatabaseId(str: string): boolean {
  return /^\d+$/.test(str);
}
