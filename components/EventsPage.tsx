import React from 'react';
import { Event } from '../types';

const DUMMY_EVENTS: Event[] = [
    {
        id: 'evt-1',
        title: '신규 가입 환영 보너스!',
        description: '지금 가입하고 500 골드를 즉시 받아가세요! 첫 베팅에 사용하여 승리의 기쁨을 맛보세요.',
        imageUrl: 'https://picsum.photos/seed/evt-1/800/400',
    },
    {
        id: 'evt-2',
        title: 'EPL 빅매치 주간 특별 프로모션',
        description: '이번 주 EPL 빅매치에 베팅하고 승리하면, 당첨금의 10%를 추가 골드로 지급해드립니다.',
        imageUrl: 'https://picsum.photos/seed/evt-2/800/400',
    },
    {
        id: 'evt-3',
        title: '룰렛 & 슬롯 골드 부스트 타임',
        description: '매일 저녁 8시부터 10시까지, 미니게임에서 잭팟 확률이 2배로 증가합니다! 행운의 주인공이 되어보세요.',
        imageUrl: 'https://picsum.photos/seed/evt-3/800/400',
    },
    {
        id: 'evt-4',
        title: '프리미엄 멤버십 30% 할인',
        description: '프리미엄 멤버십으로 업그레이드하고, 모든 경기의 심층 AI 분석을 무제한으로 확인하세요. 기간 한정 30% 할인 혜택!',
        imageUrl: 'https://picsum.photos/seed/evt-4/800/400',
    }
];

const EventCard: React.FC<{ event: Event }> = ({ event }) => (
    <div className="bg-brand-dark-green rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
        <img src={event.imageUrl} alt={event.title} className="w-full h-48 object-cover" />
        <div className="p-6">
            <h3 className="text-xl font-bold text-brand-light-green mb-2">{event.title}</h3>
            <p className="text-gray-300">{event.description}</p>
        </div>
    </div>
);


const EventsPage: React.FC = () => {
    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-white animate-fadeIn">
            <h1 className="text-4xl font-bold text-center mb-8 text-brand-gold tracking-wider">Events & Promotions</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {DUMMY_EVENTS.map(event => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
        </div>
    );
};

export default EventsPage;
