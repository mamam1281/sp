// types.ts
export enum SportId {
  KBO = 'korea-baseball-organization',
  NBA = 'national-basketball-association',
  EPL = 'english-premier-league',
}

export interface MatchOdds {
  home: number;
  away: number;
  draw?: number;
}

export interface Match {
  id: string;
  sportId: SportId;
  date: string; // ISO string
  homeTeam: string;
  awayTeam: string;
  schedule: string;
  homeTeamLogo: string;
  awayTeamLogo: string;
  odds: MatchOdds;
  summary: string;
  playerAnalysis?: string;
  resultAnalysis?: string;
  premiumAnalysis?: string;
}

export interface Bet {
  id: string;
  userId: string;
  matchId: string;
  /** The team name or 'Draw' */
  prediction: string;
  amount: number;
  /** The odds at the time of placing the bet */
  odds: number;
  /** Potential payout */
  payout: number;
  /** 'pending', 'won', 'lost' */
  status: 'pending' | 'won' | 'lost';
  timestamp: number;
}

export interface User {
  id: string;
  email: string; // Changed from name for login
  password?: string; // For authentication
  name: string; // Display name
  gold: number;
  isAdmin: boolean;
  isPremium: boolean;
}

export interface Event {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
}