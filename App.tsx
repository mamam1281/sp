// App.tsx
import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, Navigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { SportId, User, Match, Bet } from './types';
import { localBackend } from './services/localBackend';
import { seedInitialData } from './services/dataSeeder';
import { fetchRealMatches, fetchMatchById } from './services/realtimeDataService';
import { generateMatchSummary, generatePremiumAnalysis } from './services/geminiService';
import { BaseballIcon, BasketballIcon, SoccerIcon, GoldCoinIcon, UserIcon, SpinnerIcon, MenuIcon, XIcon, ArrowUpIcon, ArrowDownIcon } from './components/icons';
import AdminPage from './components/AdminPage';
import EventsPage from './components/EventsPage';
import GamesLobbyPage from './components/GamesLobbyPage';
import RoulettePage from './components/RoulettePage';
import SlotMachinePage from './components/SlotMachinePage';


// --- Seeding Initial Data ---
seedInitialData();

// --- Auth Context ---
interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => User | null;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}
const AuthContext = createContext<AuthContextType>(null!);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(localBackend.getCurrentUser());

  const login = (email: string, pass: string) => {
    const loggedInUser = localBackend.login(email, pass);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const logout = () => {
    localBackend.logout();
    setUser(null);
  };

  useEffect(() => {
    const syncUser = () => {
        const currentUser = localBackend.getCurrentUser();
        if (JSON.stringify(currentUser) !== JSON.stringify(user)) {
            setUser(currentUser);
        }
    };
    window.addEventListener('storage', syncUser);
    syncUser();
    return () => {
        window.removeEventListener('storage', syncUser);
    };
  }, [user]);


  const value = { user, login, logout, setUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

// --- Main App Component ---
const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="bg-brand-black min-h-screen font-sans">
        <Header />
        <main className="pt-20">
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/match/:matchId" element={<MatchDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/games" element={<ProtectedRoute><GamesLobbyPage /></ProtectedRoute>} />
                <Route path="/games/roulette" element={<ProtectedRoute><RoulettePage /></ProtectedRoute>} />
                <Route path="/games/slots" element={<ProtectedRoute><SlotMachinePage /></ProtectedRoute>} />
                <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
            </Routes>
        </main>
      </div>
    </AuthProvider>
  );
};

// --- Layout Components ---
const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        navigate('/');
    };
    
    const closeMenu = () => setIsMenuOpen(false);

    const navLinks = (
        <>
            <NavLink to="/" onClick={closeMenu}>Home</NavLink>
            <NavLink to="/games" onClick={closeMenu}>Games</NavLink>
            <NavLink to="/events" onClick={closeMenu}>Events</NavLink>
            {user && <NavLink to="/profile" onClick={closeMenu}>Profile</NavLink>}
            {user?.isAdmin && <NavLink to="/admin" onClick={closeMenu}>Admin</NavLink>}
        </>
    );

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-brand-background/80 backdrop-blur-md shadow-lg border-b border-brand-light-green/20">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <Link to="/" onClick={closeMenu} className="text-2xl font-bold text-brand-gold tracking-wider">
                        GEMINI SPORTS
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-6">
                        {navLinks}
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                         {user ? (
                            <>
                                <div className="flex items-center space-x-2 bg-brand-black p-2 rounded-lg border border-gray-700">
                                    <GoldCoinIcon className="w-6 h-6 text-brand-premium-gold" />
                                    <span className="font-semibold text-white">{user.gold.toLocaleString()}</span>
                                    <UserIcon className="w-6 h-6 text-gray-400 ml-2" />
                                    <span className="font-semibold text-white">{user.name}</span>
                                </div>
                                <button onClick={handleLogout} className="px-4 py-2 bg-brand-red text-white font-semibold rounded-md hover:bg-red-700 transition">Logout</button>
                            </>
                        ) : (
                            <Link to="/login" className="px-4 py-2 bg-brand-green text-black font-semibold rounded-md hover:bg-brand-light-green transition">Login</Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-white">
                            {isMenuOpen ? <XIcon className="w-8 h-8"/> : <MenuIcon className="w-8 h-8"/>}
                        </button>
                    </div>
                </div>
            </nav>
            
            {/* Mobile Menu */}
            {isMenuOpen && (
                 <div className="md:hidden absolute top-20 left-0 w-full bg-brand-background shadow-lg animate-fadeIn">
                    <div className="flex flex-col space-y-4 p-6">
                        {navLinks}
                        <div className="border-t border-gray-700 pt-4">
                        {user ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between bg-brand-black p-3 rounded-lg border border-gray-700">
                                    <div className="flex items-center space-x-2">
                                        <UserIcon className="w-6 h-6 text-gray-400" />
                                        <span className="font-semibold text-white">{user.name}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <GoldCoinIcon className="w-6 h-6 text-brand-premium-gold" />
                                        <span className="font-semibold text-white">{user.gold.toLocaleString()}</span>
                                    </div>
                                </div>
                                <button onClick={handleLogout} className="w-full px-4 py-3 bg-brand-red text-white font-semibold rounded-md hover:bg-red-700 transition">Logout</button>
                            </div>
                        ) : (
                            <Link to="/login" onClick={closeMenu} className="block w-full text-center px-4 py-3 bg-brand-green text-black font-semibold rounded-md hover:bg-brand-light-green transition">Login</Link>
                        )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

const NavLink: React.FC<{ to: string; children: React.ReactNode; onClick?: () => void }> = ({ to, children, onClick }) => {
    const location = useLocation();
    const isActive = location.pathname === to || (to === '/games' && location.pathname.startsWith('/games'));
    return (
        <Link to={to} onClick={onClick} className={`block py-2 text-lg font-medium transition ${isActive ? 'text-brand-light-green' : 'text-gray-300 hover:text-white'}`}>
            {children}
        </Link>
    );
}

// --- Page Components ---

const HomePage: React.FC = () => {
    const [selectedSport, setSelectedSport] = useState<SportId>(SportId.KBO);
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const prevMatchesRef = useRef<Match[]>([]);

    useEffect(() => {
        const loadMatches = async () => {
            setLoading(true);
            const fetchedMatches = await fetchRealMatches(selectedSport);
            setMatches(fetchedMatches);
            setLoading(false);
        };
        loadMatches();

        const pollInterval = setInterval(async () => {
             const updatedMatches = await fetchRealMatches(selectedSport);
             setMatches(updatedMatches);
        }, 15000); // Poll for updates every 15 seconds

        return () => clearInterval(pollInterval);
    }, [selectedSport]);

    useEffect(() => {
        // After each render, update the ref to store the current matches for the next comparison
        prevMatchesRef.current = matches;
    }, [matches]);

    const SportButton: React.FC<{ sportId: SportId, icon: React.ReactNode, name: string }> = ({ sportId, icon, name }) => (
        <button
            onClick={() => setSelectedSport(sportId)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg transition-colors duration-300 ${selectedSport === sportId ? 'bg-brand-dark-green text-brand-light-green' : 'bg-brand-black text-gray-400 hover:bg-gray-800'}`}
        >
            {icon}
            <span className="font-semibold">{name}</span>
        </button>
    );
    
    return (
        <div className="container mx-auto p-4 text-white">
            <div className="flex border-b-2 border-brand-dark-green">
                <SportButton sportId={SportId.KBO} icon={<BaseballIcon className="w-5 h-5"/>} name="KBO" />
                <SportButton sportId={SportId.NBA} icon={<BasketballIcon className="w-5 h-5"/>} name="NBA" />
                <SportButton sportId={SportId.EPL} icon={<SoccerIcon className="w-5 h-5"/>} name="EPL" />
            </div>
            <div className="bg-brand-dark-green p-4 rounded-b-lg">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <SpinnerIcon className="w-12 h-12 text-brand-light-green"/>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {matches.map(match => {
                            const prevMatch = prevMatchesRef.current.find(p => p.id === match.id);
                            return <MatchCard key={match.id} match={match} prevMatch={prevMatch} />
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

const OddsDisplay: React.FC<{ currentOdd?: number, prevOdd?: number }> = ({ currentOdd, prevOdd }) => {
    const [highlight, setHighlight] = useState('');

    useEffect(() => {
        if (prevOdd === undefined || currentOdd === undefined || prevOdd === currentOdd) {
            setHighlight('');
            return;
        }

        if (currentOdd > prevOdd) {
            setHighlight('bg-green-500/30');
        } else {
            setHighlight('bg-red-500/30');
        }

        const timer = setTimeout(() => setHighlight(''), 1500); // Highlight lasts 1.5s
        return () => clearTimeout(timer);
    }, [currentOdd, prevOdd]);

    const getChangeIcon = () => {
        if (prevOdd === undefined || currentOdd === undefined || prevOdd === currentOdd) return null;
        if (currentOdd > prevOdd) return <ArrowUpIcon className="w-4 h-4 text-green-400" />;
        return <ArrowDownIcon className="w-4 h-4 text-red-400" />;
    };

    if (currentOdd === undefined) return null;

    return (
        <div className={`flex items-center justify-center space-x-1 p-1 rounded-md transition-colors duration-500 ${highlight}`}>
            {getChangeIcon()}
            <span className="text-brand-gold font-semibold">{currentOdd.toFixed(2)}</span>
        </div>
    );
};


const MatchCard: React.FC<{ match: Match, prevMatch?: Match }> = ({ match, prevMatch }) => {
    const navigate = useNavigate();
    return (
        <div onClick={() => navigate(`/match/${match.id}`)} className="bg-brand-black rounded-lg shadow-lg hover:shadow-brand-light-green/20 hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden">
            <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">{new Date(match.date).toLocaleDateString('ko-KR')} {match.schedule}</span>
                </div>
                <div className="flex items-center justify-between space-x-4 my-4">
                    <div className="flex-1 flex flex-col items-center text-center">
                        <img src={match.homeTeamLogo} alt={match.homeTeam} className="w-16 h-16 object-contain mb-2 bg-white rounded-full p-1"/>
                        <span className="font-bold text-lg">{match.homeTeam}</span>
                        <OddsDisplay currentOdd={match.odds.home} prevOdd={prevMatch?.odds.home} />
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="text-2xl font-bold text-gray-500">VS</div>
                        {match.odds.draw && (
                             <div className="mt-2 text-center">
                                <span className="text-xs text-gray-400">Draw</span>
                                <OddsDisplay currentOdd={match.odds.draw} prevOdd={prevMatch?.odds.draw} />
                            </div>
                        )}
                    </div>
                     <div className="flex-1 flex flex-col items-center text-center">
                        <img src={match.awayTeamLogo} alt={match.awayTeam} className="w-16 h-16 object-contain mb-2 bg-white rounded-full p-1"/>
                        <span className="font-bold text-lg">{match.awayTeam}</span>
                         <OddsDisplay currentOdd={match.odds.away} prevOdd={prevMatch?.odds.away} />
                    </div>
                </div>
                <p className="text-sm text-gray-300 h-10 overflow-hidden line-clamp-2">{match.summary}</p>
            </div>
        </div>
    );
}

const MatchDetailPage: React.FC = () => {
    const { matchId } = useParams<{ matchId: string }>();
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const [match, setMatch] = useState<Match | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [premiumAnalysis, setPremiumAnalysis] = useState<string>('');
    const [isGeneratingPremium, setIsGeneratingPremium] = useState(false);

    const [betAmount, setBetAmount] = useState<string>('');
    const [selectedPrediction, setSelectedPrediction] = useState<{ name: string; odds: number } | null>(null);

    useEffect(() => {
        if (!matchId) {
            setError("Match ID is missing.");
            setLoading(false);
            return;
        }

        const loadMatchData = async () => {
            try {
                setLoading(true);
                const fetchedMatch = await fetchMatchById(matchId);
                if (!fetchedMatch) {
                    setError("Match not found.");
                    return;
                }
                
                const cachedAnalysis = localBackend.getAnalysis(matchId);
                if (cachedAnalysis?.summary) {
                    fetchedMatch.summary = cachedAnalysis.summary;
                } else {
                    const generatedSummary = await generateMatchSummary(fetchedMatch);
                    fetchedMatch.summary = generatedSummary;
                    localBackend.saveAnalysis(matchId, { summary: generatedSummary });
                }

                if (cachedAnalysis?.premiumAnalysis) {
                    setPremiumAnalysis(cachedAnalysis.premiumAnalysis);
                }

                setMatch(fetchedMatch);

            } catch (err) {
                setError("Failed to load match details.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadMatchData();
    }, [matchId]);

    const handleGeneratePremium = async () => {
        if (!match || !user?.isPremium) return;
        setIsGeneratingPremium(true);
        try {
            const analysis = await generatePremiumAnalysis(match);
            setPremiumAnalysis(analysis);
            localBackend.saveAnalysis(match.id, { premiumAnalysis: analysis });
        } catch (err) {
            setPremiumAnalysis("프리미엄 분석을 생성하는 데 실패했습니다. 잠시 후 다시 시도해주세요.");
        } finally {
            setIsGeneratingPremium(false);
        }
    };
    
    const handleUpgradeToPremium = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (user.gold < 1000) {
            alert("프리미엄 업그레이드에 필요한 골드가 부족합니다 (1,000G 필요).");
            return;
        }
        const updatedUser = { ...user, isPremium: true, gold: user.gold - 1000 };
        localBackend.updateUser(updatedUser);
        setUser(updatedUser);
        alert('프리미엄 멤버십으로 업그레이드되었습니다! 1,000 골드가 차감되었습니다.');
    };

    const potentialPayout = selectedPrediction && parseFloat(betAmount) > 0
        ? (parseFloat(betAmount) * selectedPrediction.odds).toFixed(0)
        : '0';

    const handlePlaceBet = () => {
        if (!user || !selectedPrediction || !match) {
            alert('베팅을 하려면 로그인 후 항목을 선택해야 합니다.');
            if (!user) navigate('/login');
            return;
        }
        const amount = parseFloat(betAmount);
        if (isNaN(amount) || amount <= 0) {
            alert('올바른 베팅 금액을 입력해주세요.');
            return;
        }
        if (amount > user.gold) {
            alert('보유 골드가 부족합니다.');
            return;
        }

        const newBet: Bet = {
            id: `bet-${Date.now()}-${match.id}`,
            userId: user.id,
            matchId: match.id,
            prediction: selectedPrediction.name,
            amount: amount,
            odds: selectedPrediction.odds,
            payout: parseFloat(potentialPayout),
            status: 'pending',
            timestamp: Date.now(),
        };
        localBackend.placeBet(newBet);
        
        const newBalance = user.gold - amount;
        const updatedUser = { ...user, gold: newBalance };
        localBackend.updateUser(updatedUser);
        setUser(updatedUser);

        alert(`베팅이 완료되었습니다! ${selectedPrediction.name}에 ${amount.toLocaleString()}G를 베팅했습니다. 예상 당첨금: ${potentialPayout}G`);
        setBetAmount('');
        setSelectedPrediction(null);
    };
    
    if (loading) return <div className="flex justify-center items-center h-96"><SpinnerIcon className="w-16 h-16 text-brand-light-green"/></div>;
    if (error) return <div className="text-center text-red-500 p-8">{error}</div>;
    if (!match) return <div className="text-center text-gray-400 p-8">Match data could not be loaded.</div>;

    const bettingOptions = [
        { name: match.homeTeam, odds: match.odds.home, label: '홈 승' },
        ...(match.odds.draw ? [{ name: 'Draw', odds: match.odds.draw, label: '무승부' }] : []),
        { name: match.awayTeam, odds: match.odds.away, label: '원정 승' },
    ];

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-white animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Match Info & Analysis */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Match Header */}
                    <div className="bg-brand-dark-green p-6 rounded-xl shadow-2xl">
                        <p className="text-center text-gray-400 mb-4">{new Date(match.date).toLocaleString('ko-KR')}</p>
                        <div className="flex items-center justify-around">
                            <div className="flex-1 text-center">
                                <img src={match.homeTeamLogo} alt={match.homeTeam} className="w-24 h-24 mx-auto object-contain mb-2 bg-white rounded-full p-2"/>
                                <h2 className="text-2xl font-bold">{match.homeTeam}</h2>
                            </div>
                            <div className="text-4xl font-extrabold text-gray-500 px-4">VS</div>
                            <div className="flex-1 text-center">
                                <img src={match.awayTeamLogo} alt={match.awayTeam} className="w-24 h-24 mx-auto object-contain mb-2 bg-white rounded-full p-2"/>
                                <h2 className="text-2xl font-bold">{match.awayTeam}</h2>
                            </div>
                        </div>
                    </div>
                    
                    {/* Basic AI Analysis */}
                    <div className="bg-brand-dark-green p-6 rounded-xl shadow-xl">
                        <h3 className="text-xl font-bold text-brand-light-green mb-3 border-b-2 border-brand-light-green/20 pb-2">🤖 AI 경기 요약 분석</h3>
                        <p className="text-gray-300 leading-relaxed">{match.summary}</p>
                    </div>

                    {/* Premium AI Analysis */}
                    <div className="bg-brand-dark-green p-6 rounded-xl shadow-xl">
                        <h3 className="text-xl font-bold text-brand-premium-gold mb-3 border-b-2 border-brand-premium-gold/20 pb-2">👑 프리미엄 심층 분석</h3>
                        {!user ? (
                             <div className="text-center p-6 bg-brand-black rounded-lg">
                                <p className="text-gray-300 mb-4">로그인하고 프리미엄 분석을 확인하세요.</p>
                                <Link to="/login" className="px-6 py-2 bg-brand-green text-black font-bold rounded-md hover:bg-brand-light-green transition">로그인</Link>
                            </div>
                        ) : user.isPremium ? (
                            premiumAnalysis ? (
                                <div className="prose prose-invert max-w-none text-gray-300">
                                     <ReactMarkdown>{premiumAnalysis}</ReactMarkdown>
                                </div>
                            ) : (
                                <button onClick={handleGeneratePremium} disabled={isGeneratingPremium} className="w-full py-3 bg-brand-premium-gold text-black font-bold rounded-md hover:bg-yellow-300 transition flex items-center justify-center disabled:bg-gray-600">
                                    {isGeneratingPremium ? <SpinnerIcon className="w-6 h-6 mr-2" /> : null}
                                    {isGeneratingPremium ? '분석 생성 중...' : '최신 심층 분석 보기'}
                                </button>
                            )
                        ) : (
                            <div className="text-center p-8 bg-brand-black rounded-lg border-2 border-dashed border-brand-premium-gold">
                                <h4 className="text-2xl font-bold text-brand-premium-gold mb-2">프리미엄 전용 콘텐츠</h4>
                                <p className="text-gray-300 mb-4">전문가 수준의 심층 전술 분석을 확인하고 승률을 높여보세요.</p>
                                <button onClick={handleUpgradeToPremium} className="px-6 py-3 bg-brand-premium-gold text-black font-bold rounded-md hover:bg-yellow-300 transition shadow-[0_0_15px_rgba(255,215,0,0.5)]">
                                    1,000G로 프리미엄 업그레이드
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Betting Slip */}
                <div className="lg:col-span-1">
                    <div className="bg-brand-dark-green p-6 rounded-xl shadow-2xl sticky top-24">
                        <h3 className="text-2xl font-bold text-center mb-4 text-brand-light-green">Place Bet</h3>
                        
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            {bettingOptions.map(opt => (
                                <button key={opt.name} onClick={() => setSelectedPrediction({ name: opt.name, odds: opt.odds })} className={`p-2 rounded-md text-center transition ${selectedPrediction?.name === opt.name ? 'bg-brand-gold text-black ring-2 ring-yellow-300' : 'bg-brand-black hover:bg-gray-800'}`}>
                                    <span className="font-semibold text-sm">{opt.label}</span>
                                    <span className="block font-bold text-lg">{opt.odds.toFixed(2)}</span>
                                </button>
                            ))}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-400 mb-1">Bet Amount (G)</label>
                            <input 
                                type="number"
                                value={betAmount}
                                onChange={e => setBetAmount(e.target.value)}
                                placeholder="e.g., 100"
                                className="w-full p-3 bg-brand-black rounded-md border border-gray-600 focus:border-brand-green focus:outline-none text-white text-lg font-semibold"
                            />
                        </div>

                        <div className="p-4 bg-brand-black rounded-md mb-6 text-center">
                            <p className="text-gray-400">Potential Payout</p>
                            <p className="text-2xl font-bold text-brand-gold">{parseInt(potentialPayout).toLocaleString()} G</p>
                        </div>
                        
                        <button 
                            onClick={handlePlaceBet}
                            disabled={!selectedPrediction || !betAmount || parseFloat(betAmount) <= 0 || (user && parseFloat(betAmount) > user.gold)}
                            className="w-full py-4 bg-brand-green text-black font-bold text-lg rounded-md hover:bg-brand-light-green transition disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            Place Bet
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('user@test.com');
    const [password, setPassword] = useState('password123');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const user = login(email, password);
        if (user) {
            navigate('/');
        } else {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="flex justify-center items-center pt-16 px-4">
            <form onSubmit={handleSubmit} className="w-full max-w-sm p-8 bg-brand-dark-green rounded-lg shadow-xl text-white">
                <h2 className="text-3xl font-bold text-center mb-6 text-brand-light-green">Login</h2>
                {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-md mb-4">{error}</p>}
                 <div className="mb-4">
                    <label className="block mb-2">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 bg-brand-black rounded-md border border-gray-600 focus:border-brand-green focus:outline-none"/>
                </div>
                 <div className="mb-6">
                    <label className="block mb-2">Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 bg-brand-black rounded-md border border-gray-600 focus:border-brand-green focus:outline-none"/>
                </div>
                <button type="submit" className="w-full py-3 bg-brand-green text-black font-bold text-lg rounded-md hover:bg-brand-light-green transition">Login</button>
                 <div className="mt-4 text-center text-sm text-gray-400">
                    <p>Use default accounts:</p>
                    <p>user@test.com / premium@test.com / admin@test.com</p>
                    <p>(Password: password123)</p>
                </div>
            </form>
        </div>
    );
}

const ProfilePage: React.FC = () => {
    const { user } = useAuth();
    const [myBets, setMyBets] = useState<Bet[]>([]);
    const [betMatches, setBetMatches] = useState<Map<string, Match>>(new Map());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const loadData = async () => {
                setLoading(true);
                const bets = localBackend.getBetsByUserId(user.id);
                setMyBets(bets.sort((a, b) => b.timestamp - a.timestamp));

                const matchDetailsMap = new Map<string, Match>();
                for (const bet of bets) {
                    if (!matchDetailsMap.has(bet.matchId)) {
                        const match = await fetchMatchById(bet.matchId);
                        if (match) {
                            matchDetailsMap.set(bet.matchId, match);
                        }
                    }
                }
                setBetMatches(matchDetailsMap);
                setLoading(false);
            };
            loadData();
        }
    }, [user]);

    if (!user) return null;

    const getStatusColor = (status: 'pending' | 'won' | 'lost') => {
        switch (status) {
            case 'pending': return 'bg-yellow-500/20 text-yellow-400';
            case 'won': return 'bg-green-500/20 text-green-400';
            case 'lost': return 'bg-red-500/20 text-red-400';
        }
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-white animate-fadeIn">
            <h1 className="text-4xl font-bold mb-8 text-brand-gold tracking-wider">My Profile</h1>
            
            <div className="bg-brand-dark-green p-6 rounded-xl shadow-2xl mb-8">
                <div className="flex flex-col sm:flex-row items-center sm:space-x-6">
                    <UserIcon className="w-20 h-20 text-gray-400 mb-4 sm:mb-0" />
                    <div>
                        <h2 className="text-3xl font-bold">{user.name}</h2>
                        <p className="text-gray-400">{user.email}</p>
                        <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-2">
                                <GoldCoinIcon className="w-6 h-6 text-brand-premium-gold" />
                                <span className="text-xl font-semibold">{user.gold.toLocaleString()} G</span>
                            </div>
                             {user.isPremium && <span className="px-3 py-1 text-sm font-bold text-black bg-brand-premium-gold rounded-full">PREMIUM</span>}
                        </div>
                    </div>
                </div>
            </div>

            <h2 className="text-3xl font-bold mb-4 text-brand-light-green">My Bet History</h2>

            {loading ? (
                 <div className="flex justify-center items-center h-48"><SpinnerIcon className="w-12 h-12 text-brand-light-green"/></div>
            ) : myBets.length === 0 ? (
                <div className="text-center py-12 bg-brand-dark-green rounded-lg">
                    <p className="text-gray-400 text-lg">아직 베팅 내역이 없습니다.</p>
                    <Link to="/" className="mt-4 inline-block px-6 py-2 bg-brand-green text-black font-bold rounded-md hover:bg-brand-light-green transition">
                        경기 보러가기
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {myBets.map(bet => {
                        const match = betMatches.get(bet.matchId);
                        return (
                            <div key={bet.id} className="bg-brand-dark-green p-4 rounded-lg shadow-lg">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                    <div className="flex-1 mb-4 sm:mb-0">
                                        {match ? (
                                            <p className="font-bold text-lg">{match.homeTeam} vs {match.awayTeam}</p>
                                        ) : (
                                            <p className="font-bold text-lg">Match ID: {bet.matchId}</p>
                                        )}
                                        <p className="text-sm text-gray-400">{new Date(bet.timestamp).toLocaleString('ko-KR')}</p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="text-center">
                                            <p className="text-xs text-gray-400">Prediction</p>
                                            <p className="font-semibold">{bet.prediction}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-gray-400">Amount</p>
                                            <p className="font-semibold text-brand-gold">{bet.amount.toLocaleString()} G</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-gray-400">Payout</p>
                                            <p className="font-semibold text-brand-gold">{bet.payout.toLocaleString()} G</p>
                                        </div>
                                        <div className={`px-3 py-1 text-sm font-bold rounded-full ${getStatusColor(bet.status)}`}>
                                            {bet.status.toUpperCase()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// --- Route Protection ---
// Fix: Replaced JSX.Element with React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

// Fix: Replaced JSX.Element with React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
const AdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const { user } = useAuth();
    if (!user || !user.isAdmin) {
        return <Navigate to="/" replace />;
    }
    return children;
};


export default App;