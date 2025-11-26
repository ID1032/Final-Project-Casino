import { createClient } from '@/lib/supabase/client';
import { NextRequest, NextResponse } from 'next/server';
import { deductUserPoints } from '../../../../lib/actions/lottery_back/deductPointsFunction';

export async function POST(request: NextRequest) {
  try {
    //console.log('Received POST /api/lottery/buy');
    const body = await request.json();
    //console.log('Body:', body);
    const { userID, lotteryNo, buyDate, amount, status, drawDate } = body;

    const supabase = createClient();

    // Decrement availability
    const { data: remaining, error: fetchError } = await supabase
      .from('Lottery_Remaining')
      .select('*')
      .eq('lotteryNo', lotteryNo)
      .single();

    if (fetchError || !remaining) {
      return NextResponse.json(
        { success: false, error: 'Lottery not found' },
        { status: 400 }
      );
    }

    if (remaining.remain <= 0) {
      return NextResponse.json(
        { success: false, error: 'Not enough tickets remaining' },
        { status: 400 }
      );
    }

    const pointResult = await deductUserPoints(
      supabase,
      userID,
      amount,
      `Buy lottery ${lotteryNo}`
    );
    if (!pointResult.success) {
      return NextResponse.json(
        { success: false, error: pointResult.message },
        { status: 400 }
      );
    }

    const newAvailable = remaining.remain - 1;

    const { error: updateError } = await supabase
      .from('Lottery_Remaining')
      .update({ remain: newAvailable })
      .eq('lotteryNo', lotteryNo);

    if (updateError) {
      return NextResponse.json(
        { success: false, error: 'Failed to update ticket availability' },
        { status: 500 }
      );
    }

    // Insert ticket
    const { data: ticketData, error: insertError } = await supabase
      .from('User_Lottery')
      .insert([
        {
          uID: userID,
          lotteryNo,
          amount,
          status: status || 'active',
          buyDate: buyDate || new Date().toISOString(),
          drawDate: drawDate || new Date().toISOString(),
        },
      ])
      .select();

    console.log('lotteryNo received:', lotteryNo);

    if (insertError) {
      // Optional: rollback availability if ticket insert fails
      await supabase
        .from('Lottery_Remaining')
        .update({ remain: remaining.remain }) // restore old value
        .eq('lotteryNo', lotteryNo);

      await supabase
        .from('point')
        .insert([
          {
            uuid: userID,
            points: -amount,
            create_at: new Date().toISOString(),
          },
        ]);

      return NextResponse.json(
        { success: false, error: 'Ticket creation failed' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, ticket: ticketData[0], newRemain: newAvailable },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
