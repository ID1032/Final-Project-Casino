export function generateAwardNumbers(): number[][] {
  return Array.from({ length: 3 }, () =>
    Array.from({ length: 3 }, () => Math.floor(Math.random() * 10))
  );
}
