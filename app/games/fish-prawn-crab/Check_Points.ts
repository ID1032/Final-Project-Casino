import {
  Weight_IF_WIN
} from '@/app/games/fish-prawn-crab/Fish_Prawn_Crab_Config';

export function Sum_points(aUserBet: number[]): number
{
    let iCount: number = 0;
    let Sum_answer: number = 0;
    for(iCount = 0; iCount < 6; iCount++)
    {
        Sum_answer += aUserBet[iCount]*Weight_IF_WIN;
    }

    return Sum_answer;
}

export function Check_points(Sum_answer: number, User_points: number): boolean
{
    if(User_points < Sum_answer)
    {
        return false;
    }
    else
    {
        return true;
    }
}