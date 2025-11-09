"use client";

import * as React from 'react'

type SummaryItem = {
  label: string
  points: number
}

interface SummaryModalProps {
  isOpen: boolean
  onClose: () => void
  onPlayAgain: () => void
  onExit: () => void
  title?: string
  items: SummaryItem[]
}

export default function SummaryModal({
  isOpen,
  onClose,
  onPlayAgain,
  onExit,
  title,
  items,
}: SummaryModalProps) {
  const total = React.useMemo(() => items.reduce((sum, i) => sum + i.points, 0), [items])
  const isWin = total >= 0

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/20" role="dialog" aria-modal="true" aria-label="Round summary">
      <div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl">
        <div className="px-7 py-8 md:px-10 md:py-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center tracking-tight">
            <span className="text-black">You </span>
            <span className={isWin ? 'text-green-600' : 'text-red-600'}>
              {title ?? (isWin ? 'Win!!!' : 'Lose')}
            </span>
          </h2>

          <div className="mt-8 space-y-6">
            {items.map((item) => {
              if (item.points === 0) return null;
              const positive = item.points >= 0
              return (
                <div key={item.label} className="flex items-center justify-between text-lg md:text-xl font-semibold">
                  <span className="text-black">{item.label}</span>
                  <span className={positive ? 'text-green-600' : 'text-red-600'}>
                    {positive ? '+' : ''}{item.points} points
                  </span>
                </div>
              )
            })}

            <div className="flex items-center justify-between pt-2 text-xl md:text-2xl font-extrabold">
              <span className="text-black">Total</span>
              <span className={isWin ? 'text-green-600' : 'text-red-600'}>
                {isWin ? '+' : ''}{total} points
              </span>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              onClick={() => {
                onPlayAgain()
                onClose()
              }}
              className="px-6 md:px-7 py-3 rounded-xl bg-green-500 text-white text-lg font-bold shadow hover:bg-green-600 transition-colors"
            >
              Play again
            </button>

            <button
              onClick={() => {
                onExit()
                onClose()
              }}
              className="px-6 md:px-7 py-3 rounded-xl bg-red-500 text-white text-lg font-bold shadow hover:bg-red-600 transition-colors"
            >
              Exit
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


