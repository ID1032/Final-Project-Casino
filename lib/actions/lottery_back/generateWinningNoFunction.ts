'use server';

import { SupabaseClient } from '@supabase/supabase-js';
import { WinningNumber } from '.';

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
