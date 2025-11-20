'use server';

import { createClient } from '@/lib/supabase/server';
import { ProcessResult } from '.';
import { generateWinningNumbers } from './generateWinningNoFunction';
import { processWinnings } from './processWinningsFunction';
import { restoreRemainingTickets } from './restoreRemainingTickets';

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
