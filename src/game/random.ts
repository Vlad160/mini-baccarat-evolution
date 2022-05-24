export function generateRandom(
  min: number,
  max: number,
  exclude: number[] = []
): number {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return exclude.includes(num) ? generateRandom(min, max) : num;
}
