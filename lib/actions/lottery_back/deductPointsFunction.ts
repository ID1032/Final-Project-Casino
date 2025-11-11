'use server';

import { SupabaseClient } from '@supabase/supabase-js';
import { ProcessResult } from '.';
import { UserPoint } from '.';

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
