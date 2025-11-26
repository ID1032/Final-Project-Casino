import { createClient } from '@/lib/supabase/client';
import { NextResponse,NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const supabase = createClient();
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
        const message = error?.message ?? 'Unknown error';
        return NextResponse.json({ error: message }, { status: 400 });
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


  const { data, error } = await supabase
    .from('Lottery_Remaining')
    .select('id, lotteryNo, remain');

   if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

   return NextResponse.json(
    { success: true, data },
    { status: 200 }
  );
}
