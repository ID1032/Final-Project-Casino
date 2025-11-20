'use server';

import { SupabaseClient } from '@supabase/supabase-js';
import { ProcessResult } from '.';
import { MAX_TICKETS_PER_NUMBER } from '.';

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
