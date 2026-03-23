import React, { useState, useEffect, useRef } from 'react';
import { Brain, Book, Settings, LogOut, Zap } from 'lucide-react';
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
import { parseData } from './utils.js';
import { getRank } from './quizLogic.js';
import { shuffle } from './shuffle.js';

const quizData = parseData(rawQuizData);

const SUBJECTS = [
  { id: 'science', title: 'Science & Tech', icon: Brain, color: 'text-blue-400' },
  { id: 'tech', title: 'Engineering & Math', icon: Cpu, color: 'text-indigo-400' },
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
const NEXUS_STATS_KEY = 'nexus_stats';
const NEXUS_SETTINGS_KEY = 'nexus_settings';

  const [showSettings, setShowSettings] = useState(false);
  const [showVault, setShowVault] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const bgMusic = useRef(typeof Audio !== "undefined" ? new Audio('/music.mp3') : null);
  if (bgMusic.current) bgMusic.current.loop = true;

  useEffect(() => {
    try {
      const s1 = localStorage.getItem(NEXUS_STATS_KEY);
      const s2 = localStorage.getItem(NEXUS_SETTINGS_KEY);
      if (s1) setStats(JSON.parse(s1));
      if (s2) setSettings(JSON.parse(s2));
    } catch (e) { console.error("Error loading saved data", e); }
  }, []);

  useEffect(() => {
    if (settings.musicEnabled && gameState !== 'playing' && bgMusic.current) {
      bgMusic.current.play().catch(() => {});
    } else if (bgMusic.current) {
      bgMusic.current.pause();
    }
  }, [gameState, settings.musicEnabled]);

  useEffect(() => {
    const setupAppStateListener = async () => {
      await CapacitorApp.addListener('appStateChange', ({ isActive }) => {
        if (!isActive && bgMusic.current) {
          bgMusic.current.pause();
        } else {
          if (settings.musicEnabled && gameState !== 'playing' && bgMusic.current) {
            bgMusic.current.play().catch(() => {});
          }
        }
      });
    };

    setupAppStateListener();

    return () => {
      CapacitorApp.removeAllListeners();
    };
  }, []);

  const handleLogin = async (provider) => {
    try {
      let result;
      if (provider === 'google') {
        result = await FirebaseAuthentication.signInWithGoogle();
      } else if (provider === 'facebook') {
        result = await FirebaseAuthentication.signInWithFacebook();
      } else {
        setIsLoading(true);
        if (isRegistering) {
          await FirebaseAuthentication.createUserWithEmailAndPassword({ email, password });
        } else {
          await FirebaseAuthentication.signInWithEmailAndPassword({ email, password });
        }
        return; // Listener handles state
      }

    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await FirebaseAuthentication.signOut();
      setUser(null);
      setGameState('login');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white"><Brain className="animate-pulse text-blue-500" size={60} /></div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 flex flex-col items-center">
      {gameState !== 'login' && gameState !== 'playing' && gameState !== 'results' && gameState !== 'leaderboard' && (
        <div className="w-full max-w-4xl flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg"><Brain className="text-white" size={20} /></div>
            <span className="text-xl font-black italic tracking-tighter">NexusQuiz</span>
          </div>
          <div className="flex space-x-2">
             <button onClick={() => setShowVault(true)} className="p-2 bg-slate-900 rounded-xl border border-slate-800"><Book size={20} className="text-emerald-400"/></button>
             <button onClick={() => setShowSettings(true)} className="p-2 bg-slate-900 rounded-xl border border-slate-800"><Settings size={20}/></button>
          </div>
        </div>
      )}

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

      {gameState === 'login' && (
        <LoginScreen
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          isRegistering={isRegistering}
          setIsRegistering={setIsRegistering}
          handleLogin={handleLogin}
          setGameState={setGameState}
        />
      )}

      {(gameState === 'subject_select' || gameState === 'difficulty_select' || gameState === 'mode_select' || gameState === 'leaderboard') && (
        <HubMenu />
      )}

      {(gameState === 'playing' || gameState === 'results') && (
        <QuizEngine />
      )}

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

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
