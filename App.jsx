import React, { useState, useEffect, useRef } from 'react';
import { Brain, Book, Settings, LogOut, Zap, Cloud, Loader2 } from 'lucide-react';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { App as CapacitorApp } from '@capacitor/app';

import { GameProvider, useGame, getRank } from './src/context/GameContext.jsx';
import LoginScreen from './src/components/LoginScreen.jsx';
import HubMenu from './src/components/HubMenu.jsx';
import QuizEngine from './src/components/QuizEngine.jsx';

const Modal = ({ title, children, onClose, icon: Icon, iconColor }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
    <div className="w-full max-w-sm bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl overflow-y-auto max-h-[85vh]">
      <h2 className="text-2xl font-black mb-6 flex items-center">{Icon && <Icon className={`mr-3 ${iconColor}`} />} {title}</h2>
      {children}
      <button onClick={onClose} className="w-full mt-8 py-4 bg-slate-800 rounded-xl font-bold">Close</button>
    </div>
  </div>
);

const MaintenanceScreen = ({ message }) => (
  <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6">
    <Brain className="text-blue-500 mb-6" size={80} />
    <h1 className="text-3xl font-black mb-4 text-center">System Maintenance</h1>
    <p className="text-slate-400 text-center max-w-md">{message}</p>
  </div>
);

function AppContent() {
  const {
    user, setUser,
    isAdmin,
    stats, setStats,
    gameState, setGameState,
    isLoading, setIsLoading,
    settings, setSettings,
    showRankUp, newRankInfo,
    VAULT_CONSTANTS,
    maintenanceMode, maintenanceMessage
  } = useGame();

  const [showSettings, setShowSettings] = useState(false);
  const [showVault, setShowVault] = useState(false);

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
<<<<<<< feat/manual-auth-error-fix-11776493011005056587
  const [authError, setAuthError] = useState('');
=======
  const [authError, setAuthError] = useState("");
>>>>>>> main

  const bgMusic = useRef(typeof Audio !== "undefined" ? new Audio('/music.mp3') : null);
  if (bgMusic.current) bgMusic.current.loop = true;

  const NEXUS_STATS_KEY = 'nexus_stats';
  const GUEST_STATS_KEY = 'guest_nexus_stats';
  const NEXUS_SETTINGS_KEY = 'nexus_settings';

  useEffect(() => {
    try {
      const s1 = localStorage.getItem(NEXUS_STATS_KEY) || localStorage.getItem(GUEST_STATS_KEY);
      const s2 = localStorage.getItem(NEXUS_SETTINGS_KEY);
      if (s1) setStats(JSON.parse(s1));
      if (s2) setSettings(JSON.parse(s2));
    } catch (e) {
      console.log("Corrupted save data detected. Resetting.");
      localStorage.removeItem(NEXUS_STATS_KEY);
      localStorage.removeItem(GUEST_STATS_KEY);
      localStorage.removeItem(NEXUS_SETTINGS_KEY);
      console.error("Error loading saved data", e);
    }
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
      setAuthError('');
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
<<<<<<< feat/manual-auth-error-fix-11776493011005056587

      let errorMessage = "Login failed. Please try again.";
      if (error.code === 'auth/user-not-found') {
        errorMessage = "Email not registered. Please sign up first.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = "Invalid credentials. Please check your email and password.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Invalid email format.";
      }

      setAuthError(errorMessage);
=======
      let errMsg = "Login failed. Please try again.";
      if (error?.message?.includes('auth/user-not-found') || error?.code === 'auth/user-not-found') {
        errMsg = "Email not registered. Please sign up first.";
      } else if (error?.message?.includes('auth/wrong-password') || error?.code === 'auth/wrong-password') {
        errMsg = "Incorrect password. Please try again.";
      }
      setAuthError(errMsg);
>>>>>>> main
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await FirebaseAuthentication.signOut();
      setStats({ totalXp: 0, completed: 0, passes: {} });
      localStorage.removeItem(NEXUS_STATS_KEY);
      localStorage.removeItem(GUEST_STATS_KEY);
      setUser(null);
      setGameState('login');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white"><Brain className="animate-pulse text-blue-500" size={60} /></div>;
  }

  if (maintenanceMode && !isAdmin) {
    return <MaintenanceScreen message={maintenanceMessage} />;
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
                onClick={async () => {
                  setIsSyncing(true);
                  setSyncMessage('');
                  const success = await manualSyncToCloud();
                  if (success) {
                    const rankData = getRank(stats.totalXp, user?.isAdmin);
                    setSyncMessage(`Sync Successful. Your Rank ${rankData.level} status is now secure.`);
                  } else {
                    setSyncMessage('Local progress is not newer than cloud, or sync failed.');
                  }
                  setIsSyncing(false);
                  setTimeout(() => setSyncMessage(''), 4000);
                }}
                disabled={!user || isSyncing}
                title={!user ? "Login required to sync to cloud." : ""}
                className={`w-full py-4 mb-4 rounded-xl font-bold flex items-center justify-center transition-colors border ${
                  !user
                    ? 'bg-slate-800/50 text-slate-500 border-slate-700 cursor-not-allowed'
                    : 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/30'
                }`}
              >
                {isSyncing ? <Loader2 className="mr-2 animate-spin" size={20} /> : <Cloud className="mr-2" size={20} />}
                {isSyncing ? 'Syncing...' : 'Sync Progress to Cloud'}
              </button>
              {syncMessage && (
                <p className={`text-sm text-center mb-4 ${syncMessage.includes('Successful') ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {syncMessage}
                </p>
              )}

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
        <LoginScreen authError={authError} setAuthError={setAuthError}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          isRegistering={isRegistering}
          setIsRegistering={setIsRegistering}
          handleLogin={handleLogin}
          setGameState={setGameState}
          authError={authError}
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
