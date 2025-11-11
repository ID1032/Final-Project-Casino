import { useEffect, useState } from "react";

interface AnimatedDigitProps {
  finalDigit: number;
  delay?: number;
}

export default function AnimatedDigit({ finalDigit, delay = 0 }: AnimatedDigitProps) {
  const [digit, setDigit] = useState(0);

  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      setDigit(Math.floor(Math.random() * 10));
      count++;
      if (count > 15) {
        clearInterval(interval);
        setDigit(finalDigit);
      }
    }, 50 + delay);
    return () => clearInterval(interval);
  }, [finalDigit, delay]);

  return (
    <span className="inline-block text-3xl font-bold text-yellow-300 mx-1">
      {digit}
    </span>
  );
}
