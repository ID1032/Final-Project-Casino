'use server';

import { SupabaseClient } from '@supabase/supabase-js';
import { PRIZE_AMOUNT_1, PRIZE_AMOUNT_2, PRIZE_AMOUNT_3, WIN_LOTTERY } from '.';
import { WinningNumber, WinningTicket } from '.';
import { addPointsToUser } from './addPointsFunction';

export async function processWinnings(
  supabase: SupabaseClient,
  winRecord: WinningNumber
) {
  const drawDate = new Date(winRecord.date);
  const mainWinningNumbers = [
    winRecord.firstPrize,
    winRecord.secondPrize,
    winRecord.thirdPrize,
  ];

  const { data: winningTickets, error: ticketsError } = await supabase
    .from('User_Lottery')
    .select('uID, lotteryNo, buyDate, amount')
    .eq('drawDate', drawDate.toISOString())
    .in('lotteryNo', mainWinningNumbers);

  if (ticketsError) {
    throw new Error('Failed to search for winning tickets.');
  }

  for (const userTicket of winningTickets as WinningTicket[]) {
    let prizeAmount = 0;

    if (userTicket.lotteryNo === winRecord.firstPrize) {
      prizeAmount = PRIZE_AMOUNT_1;
    } else if (userTicket.lotteryNo === winRecord.secondPrize) {
      prizeAmount = PRIZE_AMOUNT_2;
    } else if (userTicket.lotteryNo === winRecord.thirdPrize) {
      prizeAmount = PRIZE_AMOUNT_3;
    }

    if (prizeAmount > 0) {
      // จ่ายรางวัล
      await addPointsToUser(
        supabase,
        userTicket.uID,
        prizeAmount * userTicket.amount,
        WIN_LOTTERY
      );

      // อัพเดทสถานะว่าถูกรางวัล
      await supabase
        .from('User_Lottery')
        .update({ status: 'won' })
        .eq('uID', userTicket.uID)
        .eq('lotteryNo', userTicket.lotteryNo)
        .eq('buyDate', userTicket.buyDate);
    } else {
      // อัพเดทสถานะว่าไม่ถูกรางวัล
      await supabase
        .from('User_Lottery')
        .update({ status: 'lost' })
        .eq('uID', userTicket.uID)
        .eq('lotteryNo', userTicket.lotteryNo)
        .eq('buyDate', userTicket.buyDate);
    }
  }
}
