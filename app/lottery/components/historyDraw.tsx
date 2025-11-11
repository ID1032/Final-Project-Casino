type HistoryItem = {
  date: string;
  jackpot: string;
  second: string;
  third: string;
};

const mockHistory: HistoryItem[] = [
  { date: '01/11/2025', jackpot: '325', second: '229', third: '444' },
  { date: '02/11/2025', jackpot: '789', second: '310', third: '149' },
  { date: '03/11/2025', jackpot: 'xxx', second: 'xxx', third: 'xxx' },
  { date: '04/11/2025', jackpot: 'xxx', second: 'xxx', third: 'xxx' },
  { date: '05/11/2025', jackpot: 'xxx', second: 'xxx', third: 'xxx' },
  { date: '06/11/2025', jackpot: 'xxx', second: 'xxx', third: 'xxx' },
  { date: '07/11/2025', jackpot: 'xxx', second: 'xxx', third: 'xxx' },
  { date: '08/11/2025', jackpot: 'xxx', second: 'xxx', third: 'xxx' },
  { date: '09/11/2025', jackpot: 'xxx', second: 'xxx', third: 'xxx' },
  { date: '10/11/2025', jackpot: 'xxx', second: 'xxx', third: 'xxx' },
];

export default function HistoryDraw({ onBack }: { onBack: () => void }) {
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
          {mockHistory.map((item, index) => (
            <tr key={index} className="bg-[#3B2A1A] text-white">
              <td className="px-4 py-2 border">{item.date}</td>
              <td className="px-4 py-2 border">{item.jackpot}</td>
              <td className="px-4 py-2 border">{item.second}</td>
              <td className="px-4 py-2 border">{item.third}</td>
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
