'use server';

// Constants
export const PRIZE_AMOUNT_1 = 10000;
export const PRIZE_AMOUNT_2 = 5000;
export const PRIZE_AMOUNT_3 = 2000;
export const LOTTERY_PRICE = 100;
export const MAX_TICKETS_PER_NUMBER = 50;

// Action codes
export const PURCHASE_LOTTERY = 'L_BUY';
export const WIN_LOTTERY = 'L_WIN';
export const REFUND_LOTTERY = 'L_REFUND';

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