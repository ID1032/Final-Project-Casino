'use server';

import { createClient } from '@/lib/supabase/server';
import { UserLottery } from '.';
import { UserPoint } from '.';
import { ProcessResult } from '.';
import { LOTTERY_PRICE, PURCHASE_LOTTERY, REFUND_LOTTERY } from '.';
import { deductUserPoints } from './deductPointsFunction';

export async function buyLottery(
  uID: number,
  lotteryNo: string,
  amount: number = 1
): Promise<ProcessResult> {
  try {
    const supabase = await createClient();

    // Validate lottery number format (3 digits)
    if (!/^\d{3}$/.test(lotteryNo)) {
      return {
        success: false,
        message: 'Lottery number must be exactly 3 digits',
      };
    }

    // Determine draw date based on weekly schedule (draw every Sunday at 12:00)
    const now = new Date();

    // Restrict purchases to Monday-Saturday (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const todayDay = now.getDay();
    if (todayDay === 0) {
      return {
        success: false,
        message:
          'Purchases are only allowed Monday through Saturday. Draws occur Sunday at 12:00.',
      };
    }

    // Calculate next Sunday
    const daysUntilSunday = (7 - todayDay) % 7; // if today is Sunday this would be 0, but we already blocked Sunday
    const drawDate = new Date(now);
    drawDate.setDate(now.getDate() + daysUntilSunday);
    drawDate.setHours(12, 0, 0, 0); // set draw time to 12:00 (noon)

    // Format dates for DB
    const buyDateIso = now.toISOString();
    const drawDateIso = drawDate.toISOString();

    // Check remaining tickets
    const { data: remainingData, error: remainingError } = await supabase
      .from('Lottery_Remaining')
      .select('remain')
      .eq('lotteryNo', lotteryNo)
      .single();

    if (remainingError || !remainingData) {
      return {
        success: false,
        message: 'This lottery number is not available for purchase',
      };
    }

    if (remainingData.remain < amount) {
      return {
        success: false,
        message: `Only ${remainingData.remain} tickets remaining for number ${lotteryNo}`,
      };
    }

    // First deduct points (multiply price by amount)
    await deductUserPoints(
      supabase,
      uID,
      LOTTERY_PRICE * amount,
      PURCHASE_LOTTERY
    );

    // Then create lottery ticket
    const ticket: UserLottery = {
      uID: uID,
      lotteryNo: lotteryNo,
      buyDate: buyDateIso,
      drawDate: drawDateIso,
      amount: amount,
      status: 'active',
    };

    const { error: ticketError } = await supabase
      .from('User_Lottery')
      .insert([ticket]);

    if (ticketError) {
      // If ticket creation fails, attempt to refund points
      const refundPoint: UserPoint = {
        uID: uID,
        dateTime: new Date().toISOString(),
        amount: LOTTERY_PRICE * amount,
        detail: REFUND_LOTTERY,
      };

      await supabase.from('User_Point').insert([refundPoint]);

      return {
        success: false,
        message: 'Failed to create lottery ticket',
        error: ticketError,
      };
    }

    // Update remaining tickets
    const { error: updateError } = await supabase
      .from('Lottery_Remaining')
      .update({ remain: remainingData.remain - amount })
      .eq('lotteryNo', lotteryNo);

    if (updateError) {
      // Log the error but don't fail the transaction since ticket was created
      console.error('Failed to update remaining tickets:', updateError);
    }

    return {
      success: true,
      message: `Successfully purchased lottery number ${lotteryNo} for draw date ${drawDate.toLocaleDateString()}`,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Unexpected error during purchase',
      error,
    };
  }
}
