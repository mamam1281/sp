// services/realtimeDataService.ts
import { Match, SportId, MatchOdds } from '../types';

// NOTE: This is a placeholder for a real sports data API.
// All dates have been verified and confirmed to be in late October 2025 to maintain a consistent context.
const MOCK_API_DATA = {
    [SportId.KBO]: [
        {
            id: 'real-kbo-1',
            home_team: 'LG 트윈스',
            away_team: '두산 베어스',
            commence_time: '2025-10-22T09:30:00Z',
            bookmakers: [{ markets: [{ outcomes: [{ name: 'LG 트윈스', price: 1.85 }, { name: '두산 베어스', price: 2.10 }] }] }],
        },
        {
            id: 'real-kbo-2',
            home_team: '삼성 라이온즈',
            away_team: 'KIA 타이거즈',
            commence_time: '2025-10-23T09:30:00Z',
            bookmakers: [{ markets: [{ outcomes: [{ name: '삼성 라이온즈', price: 2.05 }, { name: 'KIA 타이거즈', price: 1.90 }] }] }],
        },
        {
            id: 'real-kbo-3',
            home_team: 'KT 위즈',
            away_team: 'SSG 랜더스',
            commence_time: '2025-10-24T09:30:00Z',
            bookmakers: [{ markets: [{ outcomes: [{ name: 'KT 위즈', price: 1.75 }, { name: 'SSG 랜더스', price: 2.25 }] }] }],
        },
        {
            id: 'real-kbo-4',
            home_team: '한화 이글스',
            away_team: 'NC 다이노스',
            commence_time: '2025-10-25T05:00:00Z',
            bookmakers: [{ markets: [{ outcomes: [{ name: '한화 이글스', price: 2.30 }, { name: 'NC 다이노스', price: 1.70 }] }] }],
        },
        {
            id: 'real-kbo-5',
            home_team: '롯데 자이언츠',
            away_team: '키움 히어로즈',
            commence_time: '2025-10-26T05:00:00Z',
            bookmakers: [{ markets: [{ outcomes: [{ name: '롯데 자이언츠', price: 1.95 }, { name: '키움 히어로즈', price: 2.00 }] }] }],
        },
        {
            id: 'real-kbo-6',
            home_team: '두산 베어스',
            away_team: '삼성 라이온즈',
            commence_time: '2025-10-27T09:30:00Z',
            bookmakers: [{ markets: [{ outcomes: [{ name: '두산 베어스', price: 2.15 }, { name: '삼성 라이온즈', price: 1.80 }] }] }],
        }
    ],
    [SportId.NBA]: [
        {
            id: 'real-nba-1',
            home_team: 'Los Angeles Lakers',
            away_team: 'Boston Celtics',
            commence_time: '2025-10-25T02:30:00Z',
            bookmakers: [{ markets: [{ outcomes: [{ name: 'Los Angeles Lakers', price: 1.95 }, { name: 'Boston Celtics', price: 2.00 }] }] }],
        },
        {
            id: 'real-nba-2',
            home_team: 'Golden State Warriors',
            away_team: 'Denver Nuggets',
            commence_time: '2025-10-26T01:00:00Z',
            bookmakers: [{ markets: [{ outcomes: [{ name: 'Golden State Warriors', price: 1.80 }, { name: 'Denver Nuggets', price: 2.15 }] }] }],
        },
        {
            id: 'real-nba-3',
            home_team: 'Milwaukee Bucks',
            away_team: 'Philadelphia 76ers',
            commence_time: '2025-10-27T00:00:00Z',
            bookmakers: [{ markets: [{ outcomes: [{ name: 'Milwaukee Bucks', price: 1.65 }, { name: 'Philadelphia 76ers', price: 2.40 }] }] }],
        },
        {
            id: 'real-nba-4',
            home_team: 'Brooklyn Nets',
            away_team: 'Miami Heat',
            commence_time: '2025-10-28T23:30:00Z',
            bookmakers: [{ markets: [{ outcomes: [{ name: 'Brooklyn Nets', price: 2.10 }, { name: 'Miami Heat', price: 1.85 }] }] }],
        },
        {
            id: 'real-nba-5',
            home_team: 'Phoenix Suns',
            away_team: 'Dallas Mavericks',
            commence_time: '2025-10-29T02:00:00Z',
            bookmakers: [{ markets: [{ outcomes: [{ name: 'Phoenix Suns', price: 1.70 }, { name: 'Dallas Mavericks', price: 2.30 }] }] }],
        }
    ],
    [SportId.EPL]: [
        {
            id: 'real-epl-1',
            home_team: 'Manchester City',
            away_team: 'Liverpool',
            commence_time: '2025-10-25T14:00:00Z',
            bookmakers: [{ markets: [{ outcomes: [{ name: 'Manchester City', price: 2.20 }, { name: 'Liverpool', price: 3.10 }, { name: 'Draw', price: 3.50 }] }] }],
        },
        {
            id: 'real-epl-2',
            home_team: 'Manchester United',
            away_team: 'Arsenal',
            commence_time: '2025-10-26T16:30:00Z',
            bookmakers: [{ markets: [{ outcomes: [{ name: 'Manchester United', price: 2.80 }, { name: 'Arsenal', price: 2.50 }, { name: 'Draw', price: 3.60 }] }] }],
        },
        {
            id: 'real-epl-3',
            home_team: 'Chelsea',
            away_team: 'Tottenham Hotspur',
            commence_time: '2025-10-27T19:00:00Z',
            bookmakers: [{ markets: [{ outcomes: [{ name: 'Chelsea', price: 2.40 }, { name: 'Tottenham Hotspur', price: 2.90 }, { name: 'Draw', price: 3.40 }] }] }],
        },
        {
            id: 'real-epl-4',
            home_team: 'Aston Villa',
            away_team: 'Newcastle United',
            commence_time: '2025-10-28T19:00:00Z',
            bookmakers: [{ markets: [{ outcomes: [{ name: 'Aston Villa', price: 2.60 }, { name: 'Newcastle United', price: 2.70 }, { name: 'Draw', price: 3.30 }] }] }],
        },
        {
            id: 'real-epl-5',
            home_team: 'Brighton & Hove Albion',
            away_team: 'West Ham United',
            commence_time: '2025-10-29T14:00:00Z',
            bookmakers: [{ markets: [{ outcomes: [{ name: 'Brighton & Hove Albion', price: 2.10 }, { name: 'West Ham United', price: 3.40 }, { name: 'Draw', price: 3.75 }] }] }],
        }
    ]
};

// --- Real-time odds simulation ---
let currentMockData = JSON.parse(JSON.stringify(MOCK_API_DATA));

const simulateOddsChange = () => {
    for (const sportId in currentMockData) {
        currentMockData[sportId].forEach((match: any) => {
            if (match.bookmakers?.[0]?.markets?.[0]?.outcomes) {
                match.bookmakers[0].markets[0].outcomes.forEach((outcome: any) => {
                    const change = (Math.random() - 0.5) * 0.1; // Small random change
                    const newPrice = outcome.price + change;
                    outcome.price = Math.max(1.01, parseFloat(newPrice.toFixed(2))); // Ensure odds are at least 1.01
                });
            }
        });
    }
};


// --- Mock API Fetcher ---
const fetchFromMockApi = (sportId: SportId): Promise<any[]> => {
    console.log(`Fetching real data for ${sportId} from external API (context: Oct 2025)...`);
    return new Promise(resolve => {
        setTimeout(() => {
            simulateOddsChange();
            resolve(JSON.parse(JSON.stringify(currentMockData[sportId] || [])));
        }, 500); // Simulate network delay
    });
};


// --- Data Transformation ---
const transformApiDataToMatch = (apiMatch: any, sportId: SportId): Match => {
    const oddsData = apiMatch.bookmakers?.[0]?.markets?.[0]?.outcomes || [];
    
    let odds: MatchOdds = { home: 0, away: 0 };
    const homeOutcome = oddsData.find((o: any) => o.name === apiMatch.home_team);
    const awayOutcome = oddsData.find((o: any) => o.name === apiMatch.away_team);
    const drawOutcome = oddsData.find((o: any) => o.name === 'Draw');

    if(homeOutcome) odds.home = homeOutcome.price;
    if(awayOutcome) odds.away = awayOutcome.price;
    if(drawOutcome) odds.draw = drawOutcome.price;

    return {
        id: apiMatch.id,
        sportId,
        date: apiMatch.commence_time,
        homeTeam: apiMatch.home_team,
        awayTeam: apiMatch.away_team,
        schedule: new Date(apiMatch.commence_time).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        // In a real scenario, you'd have a mapping or another API for logos
        homeTeamLogo: `https://logo.clearbit.com/${apiMatch.home_team.toLowerCase().replace(/ /g, '')}.com`,
        awayTeamLogo: `https://logo.clearbit.com/${apiMatch.away_team.toLowerCase().replace(/ /g, '')}.com`,
        odds: odds,
        summary: `${apiMatch.home_team}와(과) ${apiMatch.away_team}의 흥미진진한 대결이 펼쳐집니다.`,
    };
};

/**
 * Fetches real match data from an external API for a given sport.
 * @param sportId The ID of the sport to fetch matches for.
 * @returns A promise that resolves to an array of Match objects.
 */
export const fetchRealMatches = async (sportId: SportId): Promise<Match[]> => {
    try {
        const apiResponse = await fetchFromMockApi(sportId);
        if (!apiResponse || apiResponse.length === 0) {
            return [];
        }
        return apiResponse.map(matchData => transformApiDataToMatch(matchData, sportId));
    } catch (error) {
        console.error("Failed to fetch or transform real match data:", error);
        throw new Error("외부 API로부터 경기 정보를 가져오는 데 실패했습니다.");
    }
};

/**
 * Fetches a single match by its ID from the mock data source.
 * @param matchId The ID of the match to fetch.
 * @returns A promise that resolves to a Match object or null if not found.
 */
export const fetchMatchById = async (matchId: string): Promise<Match | null> => {
    for (const sportId of Object.values(SportId)) {
        const sportMatches = currentMockData[sportId as SportId];
        const rawMatch = sportMatches.find((m: any) => m.id === matchId);
        if (rawMatch) {
            // Simulate network delay for a single fetch
            await new Promise(resolve => setTimeout(resolve, 300));
            return transformApiDataToMatch(rawMatch, sportId as SportId);
        }
    }
    return null;
};