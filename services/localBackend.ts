// services/localBackend.ts
import { User, Match, Bet } from '../types';

const USERS_KEY = 'gemini-sports-users';
const MATCHES_KEY = 'gemini-sports-matches';
const BETS_KEY = 'gemini-sports-bets';
const CURRENT_USER_KEY = 'gemini-sports-current-user';
const ANALYSIS_CACHE_KEY = 'gemini-sports-analysis-cache';


const seedDefaultUsers = (): User[] => {
    return [
        { id: 'user-1', email: 'user@test.com', password: 'password123', name: '일반사용자', gold: 1000, isAdmin: false, isPremium: false },
        { id: 'user-2', email: 'premium@test.com', password: 'password123', name: '프리미엄사용자', gold: 5000, isAdmin: false, isPremium: true },
        { id: 'user-3', email: 'admin@test.com', password: 'password123', name: '관리자', gold: 99999, isAdmin: true, isPremium: true },
    ];
};

class LocalBackend {
    constructor() {
        this.init();
    }

    private init() {
        if (!localStorage.getItem(USERS_KEY)) {
            this.resetData();
        }
    }

    public resetData() {
        localStorage.setItem(USERS_KEY, JSON.stringify(seedDefaultUsers()));
        localStorage.removeItem(MATCHES_KEY);
        localStorage.removeItem(BETS_KEY);
        localStorage.removeItem(CURRENT_USER_KEY);
        localStorage.removeItem(ANALYSIS_CACHE_KEY);
    }
    
    // --- User Management ---
    public getAllUsers(): User[] {
        const users = localStorage.getItem(USERS_KEY);
        return users ? JSON.parse(users) : [];
    }

    private saveAllUsers(users: User[]) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    public getUserById(userId: string): User | undefined {
        return this.getAllUsers().find(u => u.id === userId);
    }

    public addUser(user: Omit<User, 'id'>): User {
        const users = this.getAllUsers();
        const newUser: User = { ...user, id: `user-${Date.now()}` };
        users.push(newUser);
        this.saveAllUsers(users);
        return newUser;
    }

    public updateUser(updatedUser: User) {
        let users = this.getAllUsers();
        users = users.map(user => (user.id === updatedUser.id ? updatedUser : user));
        this.saveAllUsers(users);
    }
    
    public deleteUser(userId: string) {
        let users = this.getAllUsers();
        users = users.filter(user => user.id !== userId);
        this.saveAllUsers(users);
    }

    public login(email: string, password?: string): User | null {
        const users = this.getAllUsers();
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            localStorage.setItem(CURRENT_USER_KEY, user.id);
            return user;
        }
        return null;
    }

    public logout() {
        localStorage.removeItem(CURRENT_USER_KEY);
    }

    public getCurrentUser(): User | null {
        const currentUserId = localStorage.getItem(CURRENT_USER_KEY);
        if (currentUserId) {
            return this.getUserById(currentUserId) || null;
        }
        return null;
    }

    // --- Match Management ---
    public getAllMatches(): Match[] {
        const matches = localStorage.getItem(MATCHES_KEY);
        return matches ? JSON.parse(matches) : [];
    }

    private saveAllMatches(matches: Match[]) {
        localStorage.setItem(MATCHES_KEY, JSON.stringify(matches));
    }

    public getMatchById(matchId: string): Match | undefined {
        return this.getAllMatches().find(m => m.id === matchId);
    }

    public updateMatch(updatedMatch: Match) {
        let matches = this.getAllMatches();
        const existingIndex = matches.findIndex(m => m.id === updatedMatch.id);
        if (existingIndex > -1) {
            matches[existingIndex] = updatedMatch;
        } else {
            matches.push(updatedMatch);
        }
        this.saveAllMatches(matches);
    }

    // --- Bet Management ---
    public getAllBets(): Bet[] {
        const allBets = localStorage.getItem(BETS_KEY);
        return allBets ? JSON.parse(allBets) : [];
    }
    
    public getBetsByUserId(userId: string): Bet[] {
        const allBets = this.getAllBets();
        return allBets.filter(b => b.userId === userId);
    }

    public placeBet(bet: Bet) {
        const allBets = this.getAllBets();
        allBets.push(bet);
        localStorage.setItem(BETS_KEY, JSON.stringify(allBets));
    }
    
    public updateBet(updatedBet: Bet) {
        let bets = this.getAllBets();
        bets = bets.map(b => b.id === updatedBet.id ? updatedBet : b);
        localStorage.setItem(BETS_KEY, JSON.stringify(bets));
    }

    public deleteBet(betId: string) {
        let bets = this.getAllBets();
        bets = bets.filter(b => b.id !== betId);
        localStorage.setItem(BETS_KEY, JSON.stringify(bets));
    }


    // --- Analysis Cache Management ---
    private getAnalysisCache(): Record<string, { summary?: string; premiumAnalysis?: string }> {
        const cache = localStorage.getItem(ANALYSIS_CACHE_KEY);
        return cache ? JSON.parse(cache) : {};
    }

    private saveAnalysisCache(cache: Record<string, any>) {
        localStorage.setItem(ANALYSIS_CACHE_KEY, JSON.stringify(cache));
    }

    public getAnalysis(matchId: string): { summary?: string; premiumAnalysis?: string } | null {
        const cache = this.getAnalysisCache();
        return cache[matchId] || null;
    }

    public saveAnalysis(matchId: string, analysis: { summary?: string; premiumAnalysis?: string }) {
        const cache = this.getAnalysisCache();
        // Merge new analysis with existing analysis for the same match
        cache[matchId] = { ...(cache[matchId] || {}), ...analysis };
        this.saveAnalysisCache(cache);
    }
}

export const localBackend = new LocalBackend();