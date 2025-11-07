import {
  Weight_IF_WIN,
  Weight_FOR_BET,
} from '@/app/games/fish-prawn-crab/Fish_Prawn_Crab_Config';
/**
 * Function to check betting results based on dice rolls and user bets and reurns total bet amount
 * @param {number[]} tDice array of 3 dice rolls from Random_Dice
 * @param {number[]} aUserBet array of user bets
 * @returns array of total bet amounts for each number (0-5) and index 6 for total amount
 */

export function Check_Betting_Results(
  tDice: number[],
  aUserBet: number[]
): number[] {
  let iCounter: number = 0;
  let aResult: number[] = [0, 0, 0, 0, 0, 0, 0];
  let iCounterDice: number = 0;
  tDice.sort();
  for (iCounter = 0; iCounter < 6; iCounter++) {
    if (iCounter < tDice[iCounterDice]) {
      aResult[iCounter] = aUserBet[iCounter] * Weight_FOR_BET;
    } else if (iCounter == tDice[iCounterDice]) {
      aResult[iCounter] = aUserBet[iCounter] * Weight_IF_WIN;
      iCounterDice = iCounterDice + 1;
    }
    aResult[6] = aResult[6] + aResult[iCounter];
  }
  return aResult;
}
