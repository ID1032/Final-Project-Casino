import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';


type HistoryItem = {
  date: string;
  firstPrize: number;
  secondPrize: number;
  thirdPrize: number;
};


export default function HistoryDraw({ onBack }: { onBack: () => void }) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from('Lottery_WinNo')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching history:', error);
      } else {
        const formatted = data.map((item) => ({
          date: new Date(item.date).toLocaleDateString('en-GB'),
          firstPrize: item.firstPrize,
          secondPrize: item.secondPrize,
          thirdPrize: item.thirdPrize,
        }));
        setHistory(formatted);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 py-6 px-4 text-white rounded-xl">
      <h2 className="text-3xl font-bold text-yellow-400">📜 History Draw</h2>

      <table className="w-full max-w-4xl text-center border-collapse">
        <thead>
          <tr className="bg-yellow-500 text-[#525252] font-bold">
            <th className="px-4 py-2 border">Date</th>
            <th className="px-4 py-2 border">Jackpot</th>
            <th className="px-4 py-2 border">2 nd</th>
            <th className="px-4 py-2 border">3 rd</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item, index) => (
            <tr key={index} className="bg-[#3B2A1A] text-white">
              <td className="px-4 py-2 border">{item.date}</td>
              <td className="px-4 py-2 border">{item.firstPrize}</td>
              <td className="px-4 py-2 border">{item.secondPrize}</td>
              <td className="px-4 py-2 border">{item.thirdPrize}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="relative w-full mt-40">
        <button
        onClick={onBack}
        className="absolute right-0 bottom-0 mt-6 px-20 py-3 bg-gradient-to-b from-[#BBBBBB] to-[#525252] text-white font-bold rounded-full shadow hover:scale-105 transition-transform"
      >
        Back
      </button>
      </div>
    </div>
  );
}
