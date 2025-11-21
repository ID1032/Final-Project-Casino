'use client';

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
    <div className="p-4">
      <button
        onClick={onBack}
        className="mb-4 text-yellow-500 underline"
      >
        ← Back
      </button>

      {tickets.length === 0 ? (
        <div className="text-center text-gray-500">
          You haven’t purchased any lottery tickets yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {tickets.map(ticket => (
            <div
              key={ticket.id}
              className="bg-yellow-100 p-4 rounded-lg shadow-md"
            >
              <div className="text-xl font-bold text-red-600 text-center">
                {ticket.lotteryNo}
              </div>
              <div className="text-sm text-gray-600 text-center mt-2">
                Bought: {new Date(ticket.buyDate).toLocaleDateString()} | 
                Draw: {new Date(ticket.drawDate).toLocaleDateString()}
              </div>
              <div className="text-sm text-center text-green-700">
                Status: {ticket.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}