// components/icons.tsx
import React from 'react';

export const BaseballIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-4.24-4.24c.7-.7 1.58-1.21 2.53-1.52l-2.05-2.05c-.31.95-.82 1.83-1.52 2.53l1.04 1.04zm8.48 0l1.04-1.04c-.7-.7-1.21-1.58-1.52-2.53l-2.05 2.05c.95.31 1.83.82 2.53 1.52zM8.81 8.81c.95-.31 1.83-.82 2.53-1.52l1.41 1.41-2.53 2.53-1.41-1.41zm6.38 0l-1.41 1.41 2.53 2.53 1.41-1.41c-.7-.7-1.21-1.58-1.53-2.53z"/>
  </svg>
);

export const BasketballIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM5.12 7.12c2.43 2.43 2.43 6.39 0 8.82-1.17-1.17-1.88-2.79-1.88-4.41s.71-3.24 1.88-4.41zm13.76 0c1.17 1.17 1.88 2.79 1.88 4.41s-.71 3.24-1.88 4.41c-2.43-2.43-2.43-6.39 0-8.82zM12 4c-1.62 0-3.14.71-4.24 1.88 2.43 2.43 2.43 6.39 0 8.82C8.86 15.8 10.38 16.5 12 16.5s3.14-.7 4.24-1.8c-2.43-2.43-2.43-6.39 0-8.82C15.14 4.71 13.62 4 12 4z"/>
  </svg>
);

export const SoccerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2.5-3.5h5l-1-2h-3l-1 2zm-1.85-3.09L9.24 12l-1.59 1.59L6.5 12l2.15-2.15 1.5 1.5zm6.7 0l1.5-1.5L17.5 12l-1.15 1.41-1.59-1.59L16.35 12l-1.59-1.59zM12 6.5l1.5 1.5h-3L12 6.5z"/>
  </svg>
);

export const GoldCoinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
  </svg>
);

export const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

export const SpinnerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

export const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

export const XIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const RouletteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM9.53 5.322a.75.75 0 00-1.06 1.06l2.923 2.922-.32.32a.75.75 0 101.06 1.06l.32-.32 2.923 2.922a.75.75 0 101.06-1.06l-2.922-2.923.32-.32a.75.75 0 00-1.06-1.06l-.32.32L9.53 5.322zM12 16.5a4.5 4.5 0 100-9 4.5 4.5 0 000 9z" clipRule="evenodd" />
    </svg>
);

export const SlotMachineIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12.75 2.25A3.75 3.75 0 009 6v1.128c0 .265.11.52.293.707l3.5 3.5-3.5 3.5a1.001 1.001 0 00-.293.707V18a3.75 3.75 0 003.75 3.75h.563c.27 0 .532-.11.716-.294l3.5-3.5-3.5-3.5c-.182-.187-.293-.442-.293-.708V6a3.75 3.75 0 00-3.75-3.75H12.75zM4.5 2.25A3.75 3.75 0 00.75 6v1.128c0 .265.11.52.293.707l3.5 3.5-3.5 3.5a1.001 1.001 0 00-.293.707V18a3.75 3.75 0 003.75 3.75h.563c.27 0 .532-.11.716-.294l3.5-3.5-3.5-3.5a1.001 1.001 0 00-.293-.708V6A3.75 3.75 0 004.5 2.25H4.5z" />
    </svg>
);

export const ArrowUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.03 9.83a.75.75 0 01-1.06-1.06l5.25-5.25a.75.75 0 011.06 0l5.25 5.25a.75.75 0 11-1.06 1.06L10.75 5.612V16.25a.75.75 0 01-.75.75z" clipRule="evenodd" />
  </svg>
);

export const ArrowDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l4.22-4.22a.75.75 0 111.06 1.06l-5.25 5.25a.75.75 0 01-1.06 0l-5.25-5.25a.75.75 0 111.06-1.06l4.22 4.22V3.75A.75.75 0 0110 3z" clipRule="evenodd" />
  </svg>
);