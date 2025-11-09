import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import {
  buyLottery,
  processLottoRound,
  LotteryStatus,
  ProcessResult,
} from '@/lib/actions/lottery_back';

// GET: Fetch lottery info or results
export async function GET(
  request: Request,
  { params }: { params: { lottery: string } }
) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    // Get user's lottery tickets
    if (searchParams.has('userId')) {
      const userId = parseInt(searchParams.get('userId')!);
      const { data, error } = await supabase
        .from('User_Lottery')
        .select('*')
        .eq('uID', userId)
        .order('buyDate', { ascending: false });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      return NextResponse.json(data);
    }

    // Get remaining tickets for a specific number
    if (searchParams.has('lotteryNo')) {
      const lotteryNo = searchParams.get('lotteryNo')!;
      const { data, error } = await supabase
        .from('Lottery_Remaining')
        .select('*')
        .eq('lotteryNo', lotteryNo)
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      return NextResponse.json(data);
    }

    // Get winning numbers for a specific draw date
    if (searchParams.has('drawDate')) {
      const drawDate = searchParams.get('drawDate')!;
      const { data, error } = await supabase
        .from('Lottery_WinNo')
        .select('*')
        .eq('date', drawDate)
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      return NextResponse.json(data);
    }

    // Default: return error if no valid query parameter
    return NextResponse.json(
      { error: 'Missing required query parameters' },
      { status: 400 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST: Buy lottery ticket or process lottery round
export async function POST(
  request: Request,
  { params }: { params: { lottery: string } }
) {
  try {
    const body = await request.json();
    let result: ProcessResult;

    // Buy lottery ticket
    if (params.lottery === 'buy') {
      const { userId, lotteryNo, amount = 1 } = body;

      if (!userId || !lotteryNo) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }

      result = await buyLottery(userId, lotteryNo, amount);
    }
    // Process lottery round
    else if (params.lottery === 'draw') {
      const { drawDate, forceWinNo = null } = body;

      if (!drawDate) {
        return NextResponse.json(
          { error: 'Draw date is required' },
          { status: 400 }
        );
      }

      result = await processLottoRound(drawDate, forceWinNo);
    } else {
      return NextResponse.json({ error: 'Invalid operation' }, { status: 400 });
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.message, details: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: result.message }, { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// PUT: Update lottery ticket status
export async function PUT(
  request: Request,
  { params }: { params: { lottery: string } }
) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { ticketId, status } = body;

    if (!ticketId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses: LotteryStatus[] = [
      'active',
      'won',
      'lost',
      'cancelled',
      'expired',
    ];
    if (!validStatuses.includes(status as LotteryStatus)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Update ticket status
    const { error } = await supabase
      .from('User_Lottery')
      .update({ status })
      .eq('id', ticketId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: 'Ticket status updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE: Not implemented - use PUT with status 'cancelled' instead
export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. Use PUT with status "cancelled" instead.' },
    { status: 405 }
  );
}
