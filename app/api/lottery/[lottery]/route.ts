import { createClient } from '@/lib/supabase/client';
import { NextRequest, NextResponse } from 'next/server';
import { LotteryStatus } from '@/lib/actions/lottery_back';


// PUT: Update lottery ticket status
export async function PUT(request: NextRequest) {
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
