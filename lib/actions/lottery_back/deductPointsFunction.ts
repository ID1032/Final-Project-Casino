'use server';

import { SupabaseClient } from '@supabase/supabase-js';
import { ProcessResult } from '.';
import { UserPoint } from '.';

export async function deductUserPoints(
  supabase: SupabaseClient,
  uuid: string,
  amount: number,
  detail: string
): Promise<ProcessResult> {
  try {
    /// 1. Get current balance
    const { data: pointRows, error: fetchError } = await supabase
      .from('point')
      .select('points')
      .eq('uuid', uuid);

    if (fetchError || !pointRows) {
      return {
        success: false,
        message: 'Failed to fetch point history',
        error: fetchError,
      };
    }

    const currentBalance = pointRows.reduce((sum, row) => sum + row.points, 0);

    if (currentBalance < amount) {
      return {
        success: false,
        message: 'Insufficient points',
      };
    }

    // 2. Insert deduction record
    const { error: insertError } = await supabase
      .from('point')
      .insert([
        {
          uuid,
          points: -amount,
          created_at: new Date().toISOString(),
        },
      ]);

    if (insertError) {
      return {
        success: false,
        message: 'Failed to process payment',
        error: insertError,
      };
    }

    return {
      success: true,
      message: `Successfully deducted ${amount} points to user ${uuid}. New balance: ${newPoints}`,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Unexpected error while processing points',
      error,
    };
  }
}
