'use server';
import { SupabaseClient } from '@supabase/supabase-js';
import { INITIAL_POINTS,LOTTERY_PRICE } from '@/lib/constants/lottery';

export async function deductUserPoints(
  supabase: SupabaseClient,
  userID: string,
  amount: number
): Promise<{ success: boolean; message?: string }> {
  try {
    const { data: pointRow, error } = await supabase
      .from('point')
      .select('points')
      .eq('id', userID)
      .maybeSingle();

    if (error) throw error;

    let currentPoints = pointRow?.points ?? INITIAL_POINTS;

    if (!pointRow) {
      const { data: newRow } = await supabase
        .from('point')
        .insert({ id: userID, points: INITIAL_POINTS })
        .select()
        .maybeSingle();
      currentPoints = newRow?.points ?? INITIAL_POINTS;
    }

    if (currentPoints < LOTTERY_PRICE) {
      return { success: false, message: 'Not enough points' };
    }

    const newPoints = currentPoints - LOTTERY_PRICE;

    const { error: updateError } = await supabase
      .from('point')
      .update({ points: newPoints })
      .eq('id', userID);

    if (updateError) throw updateError;

    return { success: true };
  } catch (err) {
    console.error('Deduct error:', err);
    return { success: false, message: 'Deduction failed' };
  }
}
