import React, { useState, useEffect, useRef } from 'react';

// Props interface, similar to Roulette
interface SlotMachineProps {
  onSpinEnd: (prize: number) => void;
  goldBalance: number;
  setGoldBalance: React.Dispatch<React.SetStateAction<number>>;
}

// Configuration
const spinCost = 10;
const symbols = ['🍒', '🍋', '🍊', '🍉', '⭐', '💎', '💰'];
const reelCount = 3;
const symbolHeight = 80; // height of one symbol in pixels

// Payouts: key is symbol index, value is multiplier for 3-of-a-kind
const payouts: { [key: number]: number } = {
  0: 5,   // 🍒
  1: 10,  // 🍋
  2: 15,  // 🍊
  3: 20,  // 🍉
  4: 50,  // ⭐
  5: 100, // 💎
  6: 250, // 💰
};

const SlotMachine: React.FC<SlotMachineProps> = ({ onSpinEnd, goldBalance, setGoldBalance }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [winnings, setWinnings] = useState<number | null>(null);
  const reelRefs = useRef<(HTMLDivElement | null)[]>([]);
  // We add many symbols to each reel for a continuous visual effect during spin.
  const visualReels = Array(reelCount).fill([...Array(10)].flatMap(() => symbols));

  const handleSpin = () => {
    if (isSpinning || goldBalance < spinCost) {
      if (goldBalance < spinCost) alert('골드가 부족합니다!');
      return;
    }

    setGoldBalance(prev => prev - spinCost);
    setIsSpinning(true);
    setWinnings(null);

    const finalSymbolsIndexes: number[] = [];
    
    visualReels.forEach((_, i) => {
      const targetIndex = Math.floor(Math.random() * symbols.length);
      finalSymbolsIndexes.push(targetIndex);

      const reel = reelRefs.current[i];
      if (reel) {
        const fullSpins = 10;
        const targetPosition = targetIndex * symbolHeight;
        const totalSymbolCount = visualReels[i].length;
        const basePosition = (fullSpins - 1) * symbols.length * symbolHeight;
        
        const finalPosition = basePosition + targetPosition;
        
        reel.style.transition = 'none';
        reel.style.transform = `translateY(0px)`;
        
        // Force reflow
        reel.offsetHeight;

        reel.style.transition = `transform ${4000 + i * 500}ms cubic-bezier(0.33, 1, 0.68, 1)`;
        reel.style.transform = `translateY(-${finalPosition}px)`;
      }
    });

    setTimeout(() => {
      setIsSpinning(false);
      
      const middleRowSymbolIndex = finalSymbolsIndexes[0];
      const isWin = finalSymbolsIndexes.every(s => s === middleRowSymbolIndex);
      
      let prize = 0;
      if (isWin) {
        prize = (payouts[middleRowSymbolIndex] || 0); // Simplified payout for demo
        setWinnings(prize);
        onSpinEnd(prize);
      } else {
        setWinnings(0);
        onSpinEnd(0);
      }
      
      visualReels.forEach((_, i) => {
          const reel = reelRefs.current[i];
          if(reel) {
              reel.style.transition = 'none';
              const targetPosition = finalSymbolsIndexes[i] * symbolHeight;
              reel.style.transform = `translateY(-${targetPosition}px)`;
          }
      });

    }, 4000 + (reelCount - 1) * 500);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-8 space-y-8 bg-brand-dark-green rounded-xl shadow-2xl border-4 border-brand-gold w-full max-w-xs sm:max-w-sm">
      <div className="flex justify-center space-x-2 p-4 bg-brand-black rounded-lg border-2 border-brand-light-green overflow-hidden h-[120px] relative w-full">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-brand-red/50 transform -translate-y-1/2 z-20 border-t border-b border-brand-red"></div>

        {visualReels.map((reelSymbols, i) => (
          <div key={i} className="w-1/3 h-full overflow-hidden">
            <div
              ref={el => { reelRefs.current[i] = el; }}
              className="flex flex-col"
            >
              {reelSymbols.map((symbol, j) => (
                <div key={j} className="flex items-center justify-center text-4xl sm:text-5xl h-[80px] flex-shrink-0">
                  {symbol}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="h-10 text-2xl font-bold text-brand-gold">
        {winnings !== null && !isSpinning && (
          <span className="animate-prize-pulse">{winnings > 0 ? `🎉 ${winnings}G 획득! 🎉` : '아쉽네요!'}</span>
        )}
      </div>

      <button
        onClick={handleSpin}
        disabled={isSpinning || goldBalance < spinCost}
        className="px-8 py-4 bg-brand-red text-white font-bold text-xl rounded-lg shadow-lg hover:bg-red-500 transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed transform hover:scale-105 active:scale-100 ring-2 ring-brand-red/50 hover:shadow-[0_0_20px_#EF4444]"
      >
        {isSpinning ? 'SPINNING...' : `SPIN (${spinCost}G)`}
      </button>
    </div>
  );
};

export default SlotMachine;