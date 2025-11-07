import { createSupabaseServerClient } from '@/lib/supabase.ts';

/**
 * function to get current point of user from database
 * @param {number} iUserID ID of user
 * @returns current point of user
 */
export async function GET_Point(iUserID: number): Promise<number> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('Customer')
    .select('Point')
    .eq('id', iUserID);
  if (error) throw new Error(`getTotalUsers failed: ${error.message}`);
  if (!data || data.Point == null) throw new Error('getTotalUsers: no data');
  return data.Point as number;
}

/**
 * function to update current point of user in database
 * @param {number} iUserID ID of user
 * @param {number} iCurrent_point current point of user
 */
export async function UPDATE_Point(
  iUserID: number,
  iCurrent_point: number
): Promise<void> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('Customer')
    .update({ Point: iCurrent_point })
    .eq('id', iUserID);
  if (error) throw new Error(`UPDATE_Point failed: ${error.message}`);
  if (!data || data.Point == null) throw new Error('UPDATE_Point: no data');
}
