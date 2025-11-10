'use server';

import { createClient } from '@/lib/supabase/server';
import { SupabaseClient } from '@supabase/supabase-js';

// Constants
export const PRIZE_AMOUNT_1 = 10000;
export const PRIZE_AMOUNT_2 = 5000;
export const PRIZE_AMOUNT_3 = 2000;
export const LOTTERY_PRICE = 100;
export const MAX_TICKETS_PER_NUMBER = 50;

// Action codes
export const PURCHASE_LOTTERY = 'L_BUY';
export const WIN_LOTTERY = 'L_WIN';
export const REFUND_LOTTERY = 'L_REFUND';

// Types
export interface WinningNumber {
  date: string;
  firstPrize: string;
  secondPrize: string;
  thirdPrize: string;
}

export interface WinningTicket {
  uID: number;
  lotteryNo: string;
  buyDate: string;
  amount: number;
}

export interface ProcessResult {
  success: boolean;
  message: string;
  error?: unknown;
}

export interface UserPoint {
  uID: number;
  dateTime: string;
  amount: number;
  detail: string;
}

export interface RemainingTicket {
  lotteryNo: string;
  remaining: number;
}

export interface LotteryWinNo extends WinningNumber {
  id?: string;
}

// สถานะที่เป็นไปได้ของล็อตเตอรี่
export type LotteryStatus =
  | 'active' // ตั๋วที่เพิ่งซื้อ รอการออกรางวัล
  | 'won' // ถูกรางวัล และจ่ายเงินรางวัลแล้ว
  | 'lost' // ไม่ถูกรางวัล
  | 'cancelled' // ยกเลิกการซื้อ
  | 'expired'; // หมดอายุ/ผ่านวันออกรางวัลแล้ว

export interface UserLottery extends WinningTicket {
  id?: string;
  drawDate?: string;
  status?: LotteryStatus; // ใช้ type ที่กำหนดไว้
}

// Utility functions
export async function addPointsToUser(
  supabase: SupabaseClient,
  uID: number,
  amount: number,
  detail: string
): Promise<ProcessResult> {
  try {
    // 1. First, record the transaction in User_Point
    const userPoint: UserPoint = {
      uID: uID,
      dateTime: new Date().toISOString(),
      amount: amount,
      detail: detail,
    };

    const { error: pointError } = await supabase
      .from('User_Point')
      .insert([userPoint]);

    if (pointError) {
      return {
        success: false,
        message: 'Failed to record points in User_Point table.',
        error: pointError,
      };
    }

    // 2. Then, update the Customer's total points
    // First get the current points
    const { data: customerData, error: customerError } = await supabase
      .from('Customer')
      .select('Point')
      .eq('id', uID)
      .single();

    if (customerError) {
      return {
        success: false,
        message: 'Failed to fetch customer points',
        error: customerError,
      };
    }

    const currentPoints = customerData?.Point || 0;
    const newPoints = currentPoints + amount;

    // Update the Customer's points
    const { error: updateError } = await supabase
      .from('Customer')
      .update({ Point: newPoints })
      .eq('id', uID);

    if (updateError) {
      // If Customer update fails, we should log this but the transaction was already recorded
      // console.error('Failed to update Customer points:', updateError);
      return {
        success: false,
        message: 'Failed to update customer total points',
        error: updateError,
      };
    }

    return {
      success: true,
      message: `Successfully credited ${amount} points to user ${uID}. New balance: ${newPoints}`,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Unexpected error while processing points',
      error,
    };
  }
}

export async function deductUserPoints(
  supabase: SupabaseClient,
  uID: number,
  amount: number,
  detail: string
): Promise<ProcessResult> {
  try {
    // 1. First, record the transaction in User_Point
    const deductPoint: UserPoint = {
      uID: uID,
      dateTime: new Date().toISOString(),
      amount: amount,
      detail: detail,
    };

    const { error: pointError } = await supabase
      .from('User_Point')
      .insert([deductPoint]);

    if (pointError) {
      return {
        success: false,
        message: 'Insufficient points or failed to process payment',
        error: pointError,
      };
    }

    // 2. Then, update the Customer's total points
    // First get the current points
    const { data: customerData, error: customerError } = await supabase
      .from('Customer')
      .select('Point')
      .eq('id', uID)
      .single();

    if (customerError) {
      return {
        success: false,
        message: 'Failed to fetch customer points',
        error: customerError,
      };
    }

    const currentPoints = customerData?.Point || 0;
    const newPoints = currentPoints - amount;

    // Update the Customer's points
    const { error: updateError } = await supabase
      .from('Customer')
      .update({ Point: newPoints })
      .eq('id', uID);

    if (updateError) {
      // If Customer update fails, we should log this but the transaction was already recorded
      // console.error('Failed to update Customer points:', updateError);
      return {
        success: false,
        message: 'Failed to update customer total points',
        error: updateError,
      };
    }

    return {
      success: true,
      message: `Successfully deducted ${amount} points to user ${uID}. New balance: ${newPoints}`,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Unexpected error while processing points',
      error,
    };
  }
}

// Main lottery functions
export async function generateWinningNumbers(
  supabase: SupabaseClient,
  drawDateId: string,
  forceWinNo: string | null
): Promise<WinningNumber> {
  const winNo = forceWinNo
    ? forceWinNo.padStart(2, '0')
    : Math.floor(Math.random() * 100)
        .toString()
        .padStart(2, '0');

  const winNoMinor1 = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, '0');
  const winNoMinor2 = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, '0');

  const winRecord: WinningNumber = {
    date: drawDateId,
    firstPrize: winNo,
    secondPrize: winNoMinor1,
    thirdPrize: winNoMinor2,
  };

  const { error } = await supabase.from('Lottery_WinNo').insert([winRecord]);

  if (error) {
    throw new Error('Failed to record winning numbers.');
  }

  return winRecord;
}

async function processWinnings(
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

export async function restoreRemainingTickets(
  supabase: SupabaseClient
): Promise<ProcessResult> {
  try {
    // Reset all lottery numbers to have 100 remaining tickets
    const { error } = await supabase
      .from('Lottery_Remaining')
      .update({ remaining: MAX_TICKETS_PER_NUMBER }) // รีเซ็ตให้มีตั๋วเหลือ 100 ใบทุกเลข
      .gt('lotteryNo', '000')
      .lt('lotteryNo', '1000');

    if (error) {
      return {
        success: false,
        message: 'Failed to restore remaining tickets',
        error,
      };
    }

    return {
      success: true,
      message: 'Successfully restored remaining tickets for all numbers',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Unexpected error while restoring tickets',
      error,
    };
  }
}

export async function processLottoRound(
  drawDateId: string,
  forceWinNo: string | null = null
): Promise<ProcessResult> {
  try {
    const supabase = await createClient();

    // Restore remaining tickets for the new draw
    const restoreResult = await restoreRemainingTickets(supabase);
    if (!restoreResult.success) {
      throw new Error(
        'Failed to restore remaining tickets: ' + restoreResult.message
      );
    }

    const winRecord = await generateWinningNumbers(
      supabase,
      drawDateId,
      forceWinNo
    );
    await processWinnings(supabase, winRecord);

    return {
      success: true,
      message: `Lotto Round ${drawDateId} Finished Successfully`,
    };
  } catch (error) {
    return {
      success: false,
      message: `Lotto Round ${drawDateId} Failed: ${error}`,
    };
  }
}

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
