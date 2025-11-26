import { createClient } from "@/lib/supabase/client";

export async function getWeeklyAward(): Promise<number[][]> {
  const today = new Date();
  const oneWeekAgo = new Date();
  const supabase = createClient();
  oneWeekAgo.setDate(today.getDate() - 7);

  // Get latest award
  const { data, error } = await supabase
    .from("Lottery_WinNo")
    .select("*")
    .order("date", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching award:", error);
  }

  // If exists and within 7 days → reuse
  if (data && new Date(data.date) > oneWeekAgo) {
    return [
      String(data.firstPrize).split("").map(Number),
      String(data.secondPrize).split("").map(Number),
      String(data.thirdPrize).split("").map(Number),
    ];
  }

  // Otherwise generate new
  const newAward = [
    Array.from({ length: 3 }, () => Math.floor(Math.random() * 10)),
    Array.from({ length: 3 }, () => Math.floor(Math.random() * 10)),
    Array.from({ length: 3 }, () => Math.floor(Math.random() * 10)),
  ];

  await supabase.from("Lottery_WinNo").insert([
    {
      date: today.toISOString().split("T")[0],
      firstPrize: parseInt(newAward[0].join("")),
      secondPrize: parseInt(newAward[1].join("")),
      thirdPrize: parseInt(newAward[2].join("")),
    },
  ]);

  return newAward;
}
