'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import LotteryPanel from './panel-card';

export interface LotteryTicket {
  id: number;
  uID: string;
  lotteryNo: string;
  buyDate: string;
  drawDate?: string;
  status: string;
  amount: number;
}

interface MyLotteryViewProps {
  tickets: LotteryTicket[];
  onBack: () => void;
}


export default function MyLotteryView({onBack}:MyLotteryViewProps) {
  const [tickets, setTickets] = useState<LotteryTicket[]>([]);

  useEffect(() => {
    const supabase = createClient();
    const fetchTickets = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (!user) {
        console.error('User not found');
        return;}

      const { data, error } = await supabase
        .from('User_Lottery')
        .select('*')
        .eq('uID', user.id)
        .order('buyDate', { ascending: false });

      if (error) {
        console.error('Error fetching tickets:', error);
      } else {
        setTickets(data as LotteryTicket[]);
      }
    };
    fetchTickets();
  }, []);

  return (
    <div className='p-4'>
      {tickets.length === 0 ? (
        <div className='text-center text-gray-500'>
          You haven’t purchased any lottery tickets yet.
          <div className='mt-4'>
            <button
              type='button'
              onClick={onBack}
            >
              Go Back
            </button>
          </div>
        </div>
      ) : (
        <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
          {tickets.map(ticket => (
            <LotteryPanel
              key={`${ticket.uID}-${ticket.lotteryNo}-${ticket.buyDate}`}
              data={{
                id: ticket.id,
                numbers: ticket.lotteryNo.split('-').map(Number), // 👈 transform string into array
                available: ticket.amount ?? 1,
              }}
              showAvailable={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
