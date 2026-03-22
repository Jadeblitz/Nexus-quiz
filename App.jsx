import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { App as CapacitorApp } from '@capacitor/app';
import React, { useState, useEffect, useRef } from 'react';
import HubMenu from './src/components/HubMenu';
import { DifficultySelect, ModeSelect, QuizPlayer, ResultScreen } from './src/components/QuizEngine';
import Leaderboard from './src/components/Leaderboard';
import LoginScreen from './src/components/LoginScreen';
import { 
  Brain, Cpu, Trophy, ArrowRight, RotateCcw, ChevronLeft, Axe, 
  Trophy as SportIcon, Languages, Home, Settings, Volume2, VolumeX, 
  Smartphone, BarChart3, Users, Timer, Zap, Book, BookOpen, Lightbulb, Film, Flame, Share2, LogOut, Mail, Lock
} from 'lucide-react';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// Initialize Firebase (using dummy config since google-services.json handles native, but web needs this)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// ==========================================
// 📚 THE MEGA REPOSITORY (850+ Questions)
// ==========================================
import { rawQuizData } from './data/quizData.jsx';

const quizData = parseData(rawQuizData);

const SUBJECTS = [
  { id: 'science', title: 'Science & Engineering', icon: Brain, color: 'text-blue-400' },
  { id: 'tech', title: 'Tech & Math', icon: Cpu, color: 'text-indigo-400' },
  { id: 'history', title: 'History', icon: BookOpen, color: 'text-amber-600' },
  { id: 'funfact', title: 'Fun Facts', icon: Lightbulb, color: 'text-yellow-400' },
  { id: 'entertainment', title: 'Entertainment', icon: Film, color: 'text-purple-400' },
  { id: 'sports', title: 'Sports', icon: SportIcon, color: 'text-orange-500' },
  { id: 'languages', title: 'Languages', icon: Languages, color: 'text-pink-400' },
  { id: 'lore', title: 'Ordverse', icon: Axe, color: 'text-amber-400', glow: 'drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]' // This gives it the "Golden" base
  // To add the red tint/glow, add this to your icon className:
  // "drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]" 
}

];

const DIFFICULTIES = [
  { id: 'foundational', title: 'Foundational', color: 'text-emerald-400', border: 'border-emerald-500/30' },
  { id: 'intermediate', title: 'Intermediate', color: 'text-blue-400', border: 'border-blue-500/30' },
  { id: 'advanced', title: 'Advanced', color: 'text-rose-400', border: 'border-rose-500/30' }
];

const VAULT_CONSTANTS = [
  { name: "Gas Constant (R)", value: "8.314 J/(mol·K)", formula: "PV = nRT" },
  { name: "Gravity (g)", value: "9.81 m/s²", formula: "F = mg" },
  { name: "Water Density (ρ)", value: "1000 kg/m³", formula: "at 4°C" },
  { name: "Faraday (F)", value: "96,485 C/mol", formula: "Q = nF" }
];

const XP_PER_RANK_STEP = 1250;

export default function App() {
  // --- 📦 CORE STATES ---
  const [gameState, setGameState] = useState('login');
  const [showSettings, setShowSettings] = useState(false);
  const [showVault, setShowVault] = useState(false);
  const [settings, setSettings] = useState({ musicEnabled: true, sfxEnabled: true, hapticsEnabled: true });
  const [stats, setStats] = useState({ totalXp: 0, completed: 0 });
  const [user, setUser] = useState(null);

  // --- 🔐 AUTH STATES ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    FirebaseAuthentication.addListener('authStateChange', (result) => {
      if (result.user) {
        setGameState('subject_select');
      } else {
        setGameState('login');
      }
      setIsLoading(false);
    });

    // Check initial auth state
    FirebaseAuthentication.getCurrentUser().then(async (result) => {
      if (result.user) {
        setUser(result.user);

        // --- 🔥 FIRESTORE PERSISTENCE ---
        const userRef = doc(db, "users", result.user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          const restoredXp = data.score || 0;
          setStats({ totalXp: restoredXp, completed: stats.completed });
        } else {
          // New User
          const rankData = getRank(0);
          await setDoc(userRef, {
            uid: result.user.uid,
            displayName: result.user.displayName || "Unknown Warrior",
            rank: rankData.level,
            score: 0,
            powerLevel: 1
          }, { merge: true });
        }

        setGameState('subject_select');
      }
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  }, []);

  const handleEmailAuth = async () => {
    try {
      setIsLoading(true);
      if (isRegistering) {
        await FirebaseAuthentication.createUserWithEmailAndPassword({ email, password });
      } else {
        await FirebaseAuthentication.signInWithEmailAndPassword({ email, password });
      }
    } catch (error) {
      alert(`Email Auth Failed: ${error.message}`);
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await FirebaseAuthentication.signInWithGoogle();
    } catch (error) {
      alert(`Google Login Failed: ${error.message}`);
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      setIsLoading(true);
      await FirebaseAuthentication.signInWithFacebook();
    } catch (error) {
      alert(`Facebook Login Failed: ${error.message}`);
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await FirebaseAuthentication.signOut();
      setGameState('login');
    } catch (error) {
      alert(`Logout Failed: ${error.message}`);
    }
  };

  // --- 🌟 ANIMATION STATES ---
  const [showRankUp, setShowRankUp] = useState(false);
  const [newRankInfo, setNewRankInfo] = useState({ title: '', level: '' });

  // --- 🔥 STREAK ENGINE ---
  const [streak, setStreak] = useState(0);
  const [showStreakBonus, setShowStreakBonus] = useState(false);

  // --- 🔐 AUTH ENGINE ---
  const handleLogin = async (provider) => {
    try {
      let result;
      if (provider === 'google') {
        result = await FirebaseAuthentication.signInWithGoogle();
      } else if (provider === 'facebook') {
        result = await FirebaseAuthentication.signInWithFacebook();
      } else {
        await handleEmailAuth();
        return;
      }

      const userObj = result.user;
      setUser(userObj);
      setGameState('subject_select');

      // Save to Firestore
      const rankData = getRank(stats.totalXp);
      await setDoc(doc(db, "users", userObj.uid), {
        uid: userObj.uid,
        displayName: userObj.displayName || "Unknown Warrior",
        rank: rankData.level,
        score: stats.totalXp
      }, { merge: true });

    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  useEffect(() => {
    FirebaseAuthentication.getCurrentUser().then(result => {
      if (result.user) {
        setUser(result.user);
      } else {
        setGameState('login');
      }
    });
  }, []);


  // --- 🕹️ GAMEPLAY STATES ---
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimeAttack, setIsTimeAttack] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);

  const bgMusic = useRef(new Audio('/music.mp3'));
  const correctSfx = useRef(new Audio('/correct.mp3'));
  const wrongSfx = useRef(new Audio('/wrong.mp3'));

  useEffect(() => {
    try {
      const s1 = localStorage.getItem(NEXUS_STATS_KEY);
      const s2 = localStorage.getItem(NEXUS_SETTINGS_KEY);
      if (s1) setStats(JSON.parse(s1));
      if (s2) setSettings(JSON.parse(s2));
    } catch (e) {
      console.log("Corrupted save data detected. Resetting.");
      localStorage.removeItem(NEXUS_STATS_KEY);
      localStorage.removeItem(NEXUS_SETTINGS_KEY);
    }
    bgMusic.current.loop = true;
  }, []);

  useEffect(() => {
    if (settings.musicEnabled && gameState !== 'playing') {
      bgMusic.current.play().catch(() => {});
    } else {
      bgMusic.current.pause();
    }
  }, [settings.musicEnabled, gameState]);
  
  useEffect(() => {
    const setupAppStateListener = async () => {
      await CapacitorApp.addListener('appStateChange', ({ isActive }) => {
        if (!isActive) {
          // Screen turned off or app minimized
          bgMusic.current.pause();
        } else {
          // App opened back up
          if (settings.musicEnabled && gameState !== 'playing') {
            bgMusic.current.play().catch(() => {});
          }
        }
      });
    };

    setupAppStateListener();

    return () => {
      CapacitorApp.removeAllListeners();
    };
  }, [settings.musicEnabled, gameState]);

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && isTimeAttack && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      finishQuiz(score);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, isTimeAttack]);

  const startQuiz = (timeMode) => {
    setIsTimeAttack(timeMode);
    setTimeLeft(60);
    setStreak(0);
    setShowStreakBonus(false);
    
    const subjectData = quizData[selectedSubject.id];
    if (!subjectData || !subjectData[selectedDifficulty.id] || subjectData[selectedDifficulty.id].length === 0) {
       alert("No questions available for this level yet!");
       setGameState('subject_select');
       return;
    }

    let pool = subjectData[selectedDifficulty.id];
    const limit = timeMode ? 20 : 10;
    const actualLimit = Math.min(pool.length, limit);

    const randomized = [];
    const usedIndices = new Set();
    while (randomized.length < actualLimit) {
      const idx = Math.floor(Math.random() * pool.length);
      if (!usedIndices.has(idx)) {
        usedIndices.add(idx);
        randomized.push({
          ...pool[idx],
          options: shuffle(pool[idx].options)
        });
      }
    }
    
    setQuestions(randomized);
    setCurrentIndex(0);
    setScore(0);
    setGameState('playing');
  };

  const handleAnswer = async (index, isCorrect) => {
    if (isChecking) return;
    setSelectedAnswerIndex(index);
    setIsChecking(true);

    if (isCorrect) {
      setScore(s => s + 1);
      
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > 0 && newStreak % 5 === 0) {
         setShowStreakBonus(true);
         setTimeout(() => setShowStreakBonus(false), 2000);
         setStats(prev => {
             const updated = { ...prev, totalXp: prev.totalXp + 50 };
             localStorage.setItem(NEXUS_STATS_KEY, JSON.stringify(updated));
             return updated;
         });
      }

      if (settings.sfxEnabled) correctSfx.current.play();
      if (settings.hapticsEnabled) await Haptics.notification({ type: NotificationType.Success });
    } else {
      setStreak(0);
      if (settings.sfxEnabled) wrongSfx.current.play();
      if (settings.hapticsEnabled) await Haptics.impact({ style: ImpactStyle.Heavy });
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(c => c + 1);
        setSelectedAnswerIndex(null);
        setIsChecking(false);
      } else {
        finishQuiz(score + (isCorrect ? 1 : 0));
        setIsChecking(false);
        setSelectedAnswerIndex(null);
      }
    }, isTimeAttack ? 500 : 1200);
  };

  const Modal = ({ title, children, onClose, icon: Icon, iconColor }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl overflow-y-auto max-h-[85vh]">
        <h2 className="text-2xl font-black mb-6 flex items-center">{Icon && <Icon className={`mr-3 ${iconColor}`} />} {title}</h2>
        {children}
        <button onClick={onClose} className="w-full mt-8 py-4 bg-slate-800 rounded-xl font-bold">Close</button>
      </div>
    </div>
  );

  // --- 📲 THE SHARE ENGINE ---
  const handleShare = async () => {
    const rankData = getRank(stats.totalXp);
    const streakMsg = streak >= 5 ? `🔥 Max Streak: ${streak}` : '';
    const shareText = `I just reached ${rankData.title}: ${rankData.level} on NexusQuiz! 🏆\n${streakMsg}\n✨ Total XP: ${stats.totalXp}\n\nCan you beat an Engineering Legend? #NexusQuiz #Ordverse`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: 'NexusQuiz Achievement', text: shareText });
      } catch (err) { console.log("Cancelled"); }
    } else {
      await navigator.clipboard.writeText(shareText);
      alert("Score copied to clipboard!");
    }
  };

  // YOUR PASTE ENDS HERE - THE NEXT LINE SHOULD BE: return (

    // --- 🏁 THE FINISH LINE LOGIC ---

  const saveProgress = async (newXp) => {
    if (user) {
      const rankData = getRank(newXp);
      try {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          rank: rankData.level,
          score: newXp
        }, { merge: true });
      } catch (err) {
        console.error("Sync failed", err);
      }
    }
  };
const finishQuiz = (finalScore) => {
    // 1. Calculate the XP gain (Time Attack gives double!)
    const baseGain = isTimeAttack ? finalScore * 20 : finalScore * 10;
    const oldXp = stats.totalXp;
    const newXp = oldXp + baseGain;

    if (hasRankedUp) {
      setNewRankInfo(newRankData); // Load the Rank Up screen info
      setShowRankUp(true);      // Trigger the gold flash animation
      setTimeout(() => setShowRankUp(false), 4000); // Hide after 4 seconds
    }

    // 3. Save the new progress
    const newStats = { ...stats, totalXp: newXp, completed: stats.completed + 1 };
    setStats(newStats);
    localStorage.setItem(NEXUS_STATS_KEY, JSON.stringify(newStats));
    
    // Auto-Sync to Firestore
    if (user) {
      const rankData = getRank(newXp);
      setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        rank: rankData.level,
        score: newXp
      }, { merge: true }).catch(err => console.error("Sync failed", err));
    }

    // 4. Move to the results screen
    setGameState('results');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 flex flex-col items-center">
      {showSettings && (
        <Modal title="Settings" onClose={() => setShowSettings(false)} icon={Settings} iconColor="text-blue-400">
           <div className="space-y-6">
            {['musicEnabled', 'sfxEnabled', 'hapticsEnabled'].map((key) => (
              <div key={key} className="flex items-center justify-between">
                <span className="capitalize">{key.replace('Enabled', '')}</span>
                <button onClick={() => {
                  const ns = {...settings, [key]: !settings[key]};
                  setSettings(ns);
                  localStorage.setItem(NEXUS_SETTINGS_KEY, JSON.stringify(ns));
                }} className={`w-12 h-6 rounded-full ${settings[key] ? 'bg-blue-500' : 'bg-slate-700'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-all ${settings[key] ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>
            ))}

            <div className="pt-6 mt-6 border-t border-slate-800">
              <button
                onClick={() => {
                  setShowSettings(false);
                  handleLogout();
                }}
                className="w-full py-4 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 rounded-xl font-bold flex items-center justify-center transition-colors border border-rose-500/30"
              >
                <LogOut className="mr-2" size={20} />
                Log Out
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showVault && (
        <Modal title="Formula Vault" onClose={() => setShowVault(false)} icon={Book} iconColor="text-emerald-400">
          <div className="space-y-4 text-left">
            {VAULT_CONSTANTS.map((c, i) => (
              <div key={i} className="p-4 bg-slate-800/40 border border-slate-700 rounded-2xl">
                <p className="text-[10px] text-emerald-400 font-bold uppercase">{c.name}</p>
                <p className="text-lg font-black">{c.value}</p>
                <p className="text-xs text-slate-500 italic mt-1">{c.formula}</p>
              </div>
            ))}
          </div>
        </Modal>
      )}

      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <div className="flex items-center space-x-2" onClick={() => setGameState('subject_select')}>
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg"><Brain className="text-white" size={20} /></div>
          <span className="text-xl font-black italic tracking-tighter">NexusQuiz</span>
        </div>
        <div className="flex space-x-2">
           <button onClick={() => setShowVault(true)} className="p-2 bg-slate-900 rounded-xl border border-slate-800"><Book size={20} className="text-emerald-400"/></button>
           <button onClick={() => setShowSettings(true)} className="p-2 bg-slate-900 rounded-xl border border-slate-800"><Settings size={20}/></button>
        </div>
      </div>


      {gameState === 'login' && <LoginScreen props={{ email, setEmail, password, setPassword, isRegistering, setIsRegistering, handleLogin, setGameState }} />}

      {gameState === 'subject_select' && <HubMenu props={{ stats, getRank, SUBJECTS, setSelectedSubject, setGameState }} />}

      {gameState === 'difficulty_select' && <DifficultySelect props={{ setGameState, selectedSubject, setSelectedDifficulty, DIFFICULTIES }} />}

      {gameState === 'mode_select' && <ModeSelect props={{ setGameState, selectedSubject, selectedDifficulty, startQuiz }} />}

      {gameState === 'playing' && <QuizPlayer props={{ showStreakBonus, streak, isTimeAttack, timeLeft, currentIndex, questions, isChecking, handleAnswer, selectedAnswerIndex }} />}

            {gameState === 'results' && <ResultScreen props={{ score, questions, handleShare, setGameState }} />}

      {gameState === 'leaderboard' && <Leaderboard props={{ setGameState, stats }} />}
            {/* 🌟 CELESTIAL RANK UP OVERLAY */}
      {showRankUp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-amber-500/10 animate-pulse" />
          <div className="relative text-center p-12 rounded-[50px] border-2 border-amber-400/50 bg-slate-900 shadow-[0_0_50px_rgba(251,191,36,0.4)] animate-in zoom-in duration-700">
            <Zap className="mx-auto mb-6 text-amber-400 animate-bounce" size={80} />
            <h2 className="text-sm font-black text-amber-500 uppercase tracking-[0.3em] mb-2 text-center">Evolution Complete</h2>
            <h1 className="text-5xl font-black text-white mb-4 italic text-center">RANK UP!</h1>
            <div className="h-px w-32 bg-amber-400/30 mx-auto mb-6" />
            <p className="text-2xl font-bold text-white mb-1 text-center">{newRankInfo.title}</p>
            <p className="text-lg text-amber-400 italic text-center">{newRankInfo.level}</p>
          </div>
        </div>
      )}

    </div>
  );
}
