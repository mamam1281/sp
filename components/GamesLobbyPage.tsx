import React from 'react';
import { Link } from 'react-router-dom';
import { RouletteIcon, SlotMachineIcon } from './icons';

const GamesLobbyPage: React.FC = () => {
    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-white animate-fadeIn">
            <h1 className="text-4xl font-bold text-center mb-8 sm:mb-12 text-brand-gold tracking-wider">Mini Games</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <GameCard
                    title="Fortune Roulette"
                    description="휠을 돌려 행운을 시험하고 엄청난 골드 잭팟을 터뜨리세요!"
                    link="/games/roulette"
                    icon={<RouletteIcon className="w-20 h-20 sm:w-24 sm:h-24 text-brand-gold" />}
                    color="red"
                />
                <GameCard
                    title="Gemini Slots"
                    description="심볼을 맞추고 짜릿한 승리를 경험하세요! 잭팟이 당신을 기다립니다."
                    link="/games/slots"
                    icon={<SlotMachineIcon className="w-20 h-20 sm:w-24 sm:h-24 text-brand-gold" />}
                    color="green"
                />
            </div>
        </div>
    );
}

interface GameCardProps {
    title: string;
    description: string;
    link: string;
    icon: React.ReactNode;
    color: 'red' | 'green';
}

const GameCard: React.FC<GameCardProps> = ({ title, description, link, icon, color }) => {
    const baseBg = color === 'red' ? 'from-brand-red/80' : 'from-brand-green/80';
    const hoverShadow = color === 'red' ? 'hover:shadow-[0_0_30px_#FE0D0D]' : 'hover:shadow-[0_0_30px_#B2DD38]';
    
    return (
        <Link to={link} className={`block p-6 sm:p-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 bg-gradient-to-br ${baseBg} to-brand-black/80 border-2 border-brand-white/10 ${hoverShadow}`}>
            <div className="flex flex-col items-center text-center">
                {icon}
                <h2 className="text-2xl sm:text-3xl font-bold mt-4 text-white">{title}</h2>
                <p className="mt-2 text-gray-300 text-sm sm:text-base">{description}</p>
            </div>
        </Link>
    );
};

export default GamesLobbyPage;
