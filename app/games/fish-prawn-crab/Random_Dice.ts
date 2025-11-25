/**
 * Function to generate 3 random dice rolls
 * @returns {number[]} array of 3 numbers representing dice rolls (0-5)
 */
export function Random_Dice(): number[] {
  let aDice: number[] = [];
  let iCounter: number;
  for (iCounter = 0; iCounter < 3; iCounter++) {
    aDice.push(Math.floor(Math.random() * 6) + 0); //0-5
  }
  return aDice;
}
