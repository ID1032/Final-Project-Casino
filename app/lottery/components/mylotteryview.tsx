'use client';

import LotteryPanel from './panel-card';

export interface LotteryTicket {
  id: number;
  uID: number;
  lotteryNo: string;
  buyDate: string;
  drawDate: string;
  status: string;
  amount: number;
}

interface MyLotteryViewProps {
  tickets: LotteryTicket[];
  onBack: () => void;
}

export default function MyLotteryView({ tickets, onBack }: MyLotteryViewProps) {
  return (
    <div className='p-4'>
      {tickets.length === 0 ? (
        <div className='text-center text-gray-500'>
          You haven’t purchased any lottery tickets yet.
        </div>
      ) : (
        <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
          {tickets.map(ticket => (
            <LotteryPanel
              key={ticket.id}
              data={{
                id: ticket.id,
                numbers: ticket.lotteryNo.split('-').map(Number),
                available: ticket.amount,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
