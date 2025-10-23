import React, { useState, useEffect } from 'react';
import SlotMachine from './SlotMachine';
import { useAuth } from '../App';
import { localBackend } from '../services/localBackend';

const SlotMachinePage: React.FC = () => {
    const { user, setUser } = useAuth();
    
    if (!user) return null;

    const [goldBalance, setGoldBalance] = useState(user.gold);

    useEffect(() => {
        const freshUser = localBackend.getUserById(user.id);
        if (freshUser) setGoldBalance(freshUser.gold);
    }, [user.id]);

    const updateGoldBalance = (newBalance: number) => {
        const updatedUser = { ...user, gold: newBalance };
        localBackend.updateUser(updatedUser);
        setUser(updatedUser);
        setGoldBalance(newBalance);
    };

    const handleSpinEnd = (prize: number) => {
        const newBalance = goldBalance + prize;
        updateGoldBalance(newBalance);
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-white animate-fadeIn">
            <h1 className="text-4xl font-bold text-center mb-8 text-brand-gold tracking-wider">Gemini Slots</h1>
            <div className="flex flex-col items-center">
                <SlotMachine onSpinEnd={handleSpinEnd} goldBalance={goldBalance} setGoldBalance={updateGoldBalance} />
            </div>
        </div>
    );
};

export default SlotMachinePage;
