"use client";

import * as React from 'react'
import Image from 'next/image'

interface DiceResultModalProps {
  isOpen: boolean
  dice: string[]
  onClose: () => void
  onSummary: () => void
}

// Map English labels used internally to Thai filenames that exist in /public
const englishToThaiFilename: Record<string, string> = {
  Chicken: 'ไก่.png',
  Crab: 'ปู.png',
  Fish: 'ปลา.png',
  Tiger: 'เสือ.png',
  Shrimp: 'กุ้ง.png',
  Calabash: 'น้ำเต้า.png',
}

export default function DiceResultModal({ isOpen, dice, onClose, onSummary }: DiceResultModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[55] flex items-center justify-center p-4 bg-black/50" role="dialog" aria-modal="true" aria-label="Dice roll result">
      <div className="w-full max-w-3xl rounded-3xl bg-rose-100 shadow-2xl">
        <div className="px-6 md:px-10 py-8 md:py-10">
          <h2 className="text-center text-3xl md:text-4xl font-semibold italic text-black">Dice roll result</h2>

          <div className="mt-8 grid grid-cols-1 gap-6 md:gap-8">
            <div className="flex items-center justify-center">
              <ResultImage srcPath={`/${englishToThaiFilename[dice[0]] ?? ''}`} alt={dice[0]} size={220} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              <div className="flex items-center justify-center">
                <ResultImage srcPath={`/${englishToThaiFilename[dice[1]] ?? ''}`} alt={dice[1]} size={220} />
              </div>
              <div className="flex items-center justify-center">
                <ResultImage srcPath={`/${englishToThaiFilename[dice[2]] ?? ''}`} alt={dice[2]} size={220} />
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={onSummary}
              className="px-5 py-2 rounded-xl bg-blue-700 text-white font-semibold shadow hover:bg-blue-800"
            >
              Summary
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ResultImage({ srcPath, alt, size }: { srcPath: string; alt?: string; size: number }) {
  return (
    <div className="rounded-2xl bg-white shadow-md p-3" style={{ width: size + 20, height: size + 20 }}>
      <div className="relative w-full h-full">
        {/* Fallback to empty div if image missing to avoid layout shift */}
        {srcPath ? (
          <Image src={srcPath} alt={alt ?? ''} fill className="object-contain rounded-xl" sizes={`${size}px`} />
        ) : (
          <div />
        )}
      </div>
    </div>
  )
}


