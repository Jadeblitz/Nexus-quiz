import React, { useState, useEffect, useRef } from 'react';
import { Brain, Book, Settings, LogOut, Zap, Cloud, Loader2 } from 'lucide-react';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { App as CapacitorApp } from '@capacitor/app';

import { GameProvider, useGame, getRank } from './src/context/GameContext.jsx';
import LoginScreen from './src/components/LoginScreen.jsx';
import HubMenu from './src/components/HubMenu.jsx';
import QuizEngine from './src/components/QuizEngine.jsx';
import Modal from './src/components/Modal.jsx';
import MaintenanceScreen from './src/components/MaintenanceScreen.jsx';
import SettingsModal from './src/components/SettingsModal.jsx';
import VaultModal from './src/components/VaultModal.jsx';
import RankUpOverlay from './src/components/RankUpOverlay.jsx';

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
    maintenanceMode, maintenanceMessage,
    manualSyncToCloud
  } = useGame();

  const [showSettings, setShowSettings] = useState(false);
  const [showVault, setShowVault] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [authError, setAuthError] = useState('');

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
        if (isRegistering && password.length < 6) {
          setAuthError("Password must be at least 6 characters long.");
          return;
        }
        setIsLoading(true);
        if (isRegistering) {
          await FirebaseAuthentication.createUserWithEmailAndPassword({ email, password });
        } else {
          await FirebaseAuthentication.signInWithEmailAndPassword({ email, password });
        }
        return; // Listener handles state
      }

    } catch (error) {
      let errorMessage = "Login failed. Please try again.";
      if (error?.code === 'auth/user-not-found' || error?.message?.includes('auth/user-not-found')) {
        errorMessage = "Email not registered. Please sign up first.";
      } else if (error?.code === 'auth/wrong-password' || error?.message?.includes('auth/wrong-password')) {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error?.code === 'auth/invalid-credential' || error?.message?.includes('auth/invalid-credential')) {
        errorMessage = "Invalid credentials. Please check your email and password.";
      } else if (error?.code === 'auth/invalid-email' || error?.message?.includes('auth/invalid-email')) {
        errorMessage = "Invalid email format.";
      }

      setAuthError(errorMessage);
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
      console.error("Logout failed");
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
        <SettingsModal
          settings={settings}
          setSettings={setSettings}
          user={user}
          stats={stats}
          manualSyncToCloud={manualSyncToCloud}
          handleLogout={handleLogout}
          setShowSettings={setShowSettings}
          NEXUS_SETTINGS_KEY={NEXUS_SETTINGS_KEY}
        />
      )}

      {showVault && (
        <VaultModal VAULT_CONSTANTS={VAULT_CONSTANTS} setShowVault={setShowVault} />
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
      {showRankUp && <RankUpOverlay newRankInfo={newRankInfo} />}

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
