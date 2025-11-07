'use client';

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  return (
    <div className="flex items-center justify-center gap-4 ">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="w-18 px-4 rounded bg-transparent hover:scale-105 disabled:opacity-50"
      >
        <img 
        src="/lotteryprev.png"
        alt="Previous" width={40} height={40} className="w-full h-full object-contain"/> 
      </button>

      {/* Dots */}
      <div className="flex gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i + 1)}
            className={`w-4 h-4 rounded-full border-2 ${
              currentPage === i + 1
                ? 'bg-yellow-400 border-yellow-500'
                : 'bg-white border-gray-400'
            }`}
          />
        ))}
      </div>


      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="w-18 px-4 rounded bg-transparent hover:scale-105 disabled:opacity-50"
      >
        <img src="/lotterynext.png" alt="Next" width={40} height={40} className="w-full h-full object-contain"/>
      </button>
    </div>
  );
}

