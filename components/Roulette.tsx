import React, { useState, useMemo } from 'react';

interface RouletteProps {
  onSpinEnd: (prize: number) => void;
  goldBalance: number;
  setGoldBalance: React.Dispatch<React.SetStateAction<number>>;
}

const prizes = [10, 200, 10, 50, 100, 20, 0, 50];
const spinCost = 10;
const segmentCount = prizes.length;
const segmentDegrees = 360 / segmentCount;
const wheelSize = 400;
const center = wheelSize / 2;
const radius = wheelSize / 2 - 10; // padding

const getPrizeStyle = (prize: number): { bg: string; text: string } => {
    if (prize === 0) return { bg: 'fill-gray-800', text: 'fill-gray-400' };
    if (prize >= 200) return { bg: 'fill-brand-gold', text: 'fill-black' };
    if (prize >= 100) return { bg: 'fill-brand-red', text: 'fill-white' };
    if (prize >= 50) return { bg: 'fill-brand-green', text: 'fill-black' };
    return { bg: 'fill-brand-dark-green', text: 'fill-brand-light-green' };
};

const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
};

const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M", start.x, start.y, 
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    "L", x, y,
    "L", start.x, start.y,
    "Z"
  ].join(" ");
};

const Roulette: React.FC<RouletteProps> = ({ onSpinEnd, goldBalance, setGoldBalance }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winningPrizeIndex, setWinningPrizeIndex] = useState<number | null>(null);

  const wheelSegments = useMemo(() => prizes.map((prize, index) => {
      const startAngle = index * segmentDegrees;
      const endAngle = startAngle + segmentDegrees;
      const pathData = describeArc(center, center, radius, startAngle, endAngle);
      
      const midAngle = startAngle + segmentDegrees / 2;
      const textPosition = polarToCartesian(center, center, radius * 0.65, midAngle);
      const style = getPrizeStyle(prize);

      return {
          prize,
          index,
          pathData,
          textPosition,
          midAngle,
          style,
      };
  }), []);


  const handleSpin = () => {
    if (isSpinning || goldBalance < spinCost) {
      if (goldBalance < spinCost) alert('골드가 부족합니다!');
      return;
    }

    setGoldBalance(prev => prev - spinCost);
    setIsSpinning(true);
    setWinningPrizeIndex(null);

    const prizeIndex = Math.floor(Math.random() * segmentCount);
    const prize = prizes[prizeIndex];
    
    const fullSpins = 8 + Math.floor(Math.random() * 4);
    const angleToMiddle = prizeIndex * segmentDegrees + (segmentDegrees / 2);
    const jitter = (Math.random() - 0.5) * (segmentDegrees * 0.8);
    const targetAngle = angleToMiddle + jitter;
    const finalRotation = (fullSpins * 360) - targetAngle;

    setRotation(finalRotation);
    setWinningPrizeIndex(prizeIndex);

    setTimeout(() => {
      setIsSpinning(false);
      onSpinEnd(prize);
    }, 6000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-8 space-y-8">
      <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center">
        {/* Pointer */}
        <svg className="absolute top-0 w-12 h-16 z-10 drop-shadow-lg" viewBox="0 0 48 64" style={{ transform: 'translateY(-20px)' }}>
            <path d="M24 0 C12 0 0 12 0 24 C0 32 8 48 24 64 C40 48 48 32 48 24 C48 12 36 0 24 0 Z" className="fill-brand-gold" stroke="#000" strokeWidth="2"/>
            <circle cx="24" cy="24" r="10" className="fill-brand-dark-green"/>
        </svg>

        {/* Wheel */}
        <div 
          className="w-full h-full"
          style={{ 
            transform: `rotate(${rotation}deg)`,
            transition: 'transform 6000ms cubic-bezier(0.2, 0.8, 0.2, 1)' 
          }}
        >
          <svg viewBox={`0 0 ${wheelSize} ${wheelSize}`} className="w-full h-full drop-shadow-2xl">
              <g>
                {wheelSegments.map(segment => (
                  <g 
                    key={segment.index} 
                    className={!isSpinning && winningPrizeIndex === segment.index ? 'animate-prize-pulse' : ''}
                  >
                    <path 
                      d={segment.pathData} 
                      className={segment.style.bg}
                      stroke="#000"
                      strokeWidth="3"
                    />
                    <text
                      x={segment.textPosition.x}
                      y={segment.textPosition.y}
                      transform={`rotate(${segment.midAngle}, ${segment.textPosition.x}, ${segment.textPosition.y})`}
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      className={`text-xl sm:text-2xl font-bold pointer-events-none ${segment.style.text}`}
                    >
                      {segment.prize > 0 ? `${segment.prize}G` : '꽝'}
                    </text>
                  </g>
                ))}
              </g>
              {/* Center Hub */}
              <circle cx={center} cy={center} r="40" className="fill-brand-black" stroke="#FEFF00" strokeWidth="4"/>
              <circle cx={center} cy={center} r="20" className="fill-brand-dark-green" stroke="#FEFF00" strokeWidth="2"/>
          </svg>
        </div>
      </div>
      <button
        onClick={handleSpin}
        disabled={isSpinning || goldBalance < spinCost}
        className="px-8 py-4 bg-brand-green text-black font-bold text-xl rounded-lg shadow-lg hover:bg-brand-light-green transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed transform hover:scale-105 active:scale-100 ring-2 ring-brand-green/50 hover:shadow-[0_0_20px_#B2DD38]"
      >
        {isSpinning ? 'SPINNING...' : `SPIN (${spinCost}G)`}
      </button>
    </div>
  );
};

export default Roulette;