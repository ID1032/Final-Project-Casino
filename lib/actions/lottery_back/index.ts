'use server';

// Constants
import {
  PRIZE_AMOUNT_1,
  PRIZE_AMOUNT_2,
  PRIZE_AMOUNT_3,
  LOTTERY_PRICE
} from "@/lib/constants/lottery";

export async function getPrizeAmount(rank: number) {
  switch (rank) {
    case 1: return PRIZE_AMOUNT_1;
    case 2: return PRIZE_AMOUNT_2;
    case 3: return PRIZE_AMOUNT_3;
    default: return 0;
  }
}




// Action codes


// Types
export interface WinningNumber {
  date: string;
  firstPrize: string;
  secondPrize: string;
  thirdPrize: string;
}

export interface WinningTicket {
  uID: number;
  lotteryNo: string;
  buyDate: string;
  amount: number;
}

export interface ProcessResult {
  success: boolean;
  message: string;
  error?: unknown;
}

export interface UserPoint {
  uID: number;
  dateTime: string;
  amount: number;
  detail: string;
}

export interface RemainingTicket {
  lotteryNo: string;
  remaining: number;
}

export interface LotteryWinNo extends WinningNumber {
  id?: string;
}

// สถานะที่เป็นไปได้ของล็อตเตอรี่
export type LotteryStatus =
  | 'active' // ตั๋วที่เพิ่งซื้อ รอการออกรางวัล
  | 'won' // ถูกรางวัล และจ่ายเงินรางวัลแล้ว
  | 'lost' // ไม่ถูกรางวัล
  | 'cancelled' // ยกเลิกการซื้อ
  | 'expired'; // หมดอายุ/ผ่านวันออกรางวัลแล้ว

export interface UserLottery extends WinningTicket {
  id?: string;
  drawDate?: string;
  status?: LotteryStatus; // ใช้ type ที่กำหนดไว้
}