import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export const deductUserPoints = async (userId: string, amount: number) => {
  return await supabase
    .from('point')
    .update({ points: supabase.rpc(`points - ${amount}`) })
    .eq('id', userId);
};

export const refundUserPoints = async (userId: string, amount: number) => {
  return await supabase
    .from('point')
    .update({ points: supabase.rpc(`points + ${amount}`) })
    .eq('id', userId);
};
