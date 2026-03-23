import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { quizData, VAULT_CONSTANTS, SUBJECTS, DIFFICULTIES } from '../data/quizData';

export { SUBJECTS, DIFFICULTIES };

export const getRank = (xp) => {
  const RANKS = ["Basic", "Advanced Rank", "Elite", "Veteran", "Commander", "Knight", "King", "Emperor", "Saint", "Sage", "Primordial", "Progenitor", "God"];
  if (xp >= 50000) return { title: "Rank 14", level: "True God", color: "text-amber-400 font-black" };

  const xpPerSubStep = 1250;
  const stepIndex = Math.floor(xp / xpPerSubStep);
  const rankIndex = Math.floor(stepIndex / 3);
  const subLevelIndex = stepIndex % 3;
  const subLevels = ["Beginner", "Advanced", "Peak"];

  const rankName = RANKS[rankIndex] || "Basic";
  const subName = subLevels[subLevelIndex] || "Beginner";

  return {
    title: `Rank ${rankIndex + 1}`,
    level: `${rankName} (${subName})`,
    color: rankIndex >= 10 ? "text-rose-500" : rankIndex >= 8 ? "text-purple-400" : "text-blue-400"
  };
};

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ totalXp: 0, completed: 0 });
  const [gameState, setGameState] = useState('login');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [isTimeAttack, setIsTimeAttack] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [streak, setStreak] = useState(0);
  const [showStreakBonus, setShowStreakBonus] = useState(false);
  const [score, setScore] = useState(0);

  const [showRankUp, setShowRankUp] = useState(false);
  const [newRankInfo, setNewRankInfo] = useState({});

  // Settings
  const [settings, setSettings] = useState({
    sfxEnabled: true,
    musicEnabled: false,
    hapticsEnabled: true
  });

  const correctSfx = useRef(typeof Audio !== "undefined" ? new Audio('/correct.mp3') : null);
  const wrongSfx = useRef(typeof Audio !== "undefined" ? new Audio('/wrong.mp3') : null);


  useEffect(() => {
    const handleUserPersistence = async (userObj) => {
      if (!userObj) return;
      try {
        const userDocRef = doc(db, "users", userObj.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setStats({ totalXp: data.score || 0, completed: data.completed || 0 });
        } else {
          await setDoc(userDocRef, {
            uid: userObj.uid,
            displayName: userObj.displayName || "Unknown Warrior",
            rank: "Basic (Beginner)",
            score: 0,
            powerLevel: 1,
            completed: 0
          });
          setStats({ totalXp: 0, completed: 0 });
        }
      } catch (err) {
        console.error("Firebase persistence failed, falling back to Guest state:", err);
        // Fallback to Guest state
        setStats({ totalXp: 0, completed: 0 });
      }
    };

    FirebaseAuthentication.addListener('authStateChange', (result) => {
      if (result.user) {
        setUser(result.user);
        handleUserPersistence(result.user).then(() => {
          setGameState('subject_select');
          setIsLoading(false);
        }).catch(() => {
          setGameState('subject_select');
          setIsLoading(false);
        });
      } else {
        setUser(null);
        setGameState('login');
        setIsLoading(false);
      }
    });

    FirebaseAuthentication.getCurrentUser().then((result) => {
      if (result.user) {
        setUser(result.user);
        handleUserPersistence(result.user).then(() => {
          setGameState('subject_select');
          setIsLoading(false);
        }).catch(() => {
          setGameState('subject_select');
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    }).catch(() => {
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && isTimeAttack && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      finishQuiz(score);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, isTimeAttack]);

  const shuffle = (array) => {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startQuiz = (timeMode) => {
    setIsTimeAttack(timeMode);
    setTimeLeft(60);
    setStreak(0);
    setShowStreakBonus(false);

    const subjectData = quizData[selectedSubject?.id];
    if (!subjectData || !subjectData[selectedDifficulty?.id] || subjectData[selectedDifficulty?.id].length === 0) {
       alert("No questions available for this level yet!");
       setGameState('subject_select');
       return;
    }

    let pool = subjectData[selectedDifficulty.id];
    const limit = timeMode ? 20 : 10;
    const randomized = shuffle(pool).slice(0, Math.min(pool.length, limit)).map(q => ({
      ...q, options: shuffle(q.options)
    }));

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
             localStorage.setItem('nexus_stats', JSON.stringify(updated));
             return updated;
         });
      }

      if (settings.sfxEnabled && correctSfx.current) correctSfx.current.play().catch(()=>{});
      if (settings.hapticsEnabled) await Haptics.notification({ type: NotificationType.Success }).catch(()=>{});
    } else {
      setStreak(0);
      if (settings.sfxEnabled && wrongSfx.current) wrongSfx.current.play().catch(()=>{});
      if (settings.hapticsEnabled) await Haptics.impact({ style: ImpactStyle.Heavy }).catch(()=>{});
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

  const saveProgress = async (newXp, newCompleted) => {
    if (!user) return;
    try {
      const rankData = getRank(newXp);
      const powerLevel = Math.floor(newXp / 100);
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        rank: rankData.level,
        score: newXp,
        powerLevel: powerLevel,
        completed: newCompleted
      }, { merge: true });
    } catch (err) {
      console.error("Sync failed", err);
    }
  };

  const finishQuiz = (finalScore) => {
    const baseGain = isTimeAttack ? finalScore * 20 : finalScore * 10;
    const oldXp = stats.totalXp;
    const newXp = oldXp + baseGain;

    const oldStep = Math.floor(oldXp / 1250);
    const newStep = Math.floor(newXp / 1250);

    if (newStep > oldStep) {
      const rankData = getRank(newXp);
      setNewRankInfo(rankData);
      setShowRankUp(true);
      setTimeout(() => setShowRankUp(false), 4000);
    }

    const newStats = { ...stats, totalXp: newXp, completed: stats.completed + 1 };
    setStats(newStats);
    localStorage.setItem('nexus_stats', JSON.stringify(newStats));

    saveProgress(newXp, newStats.completed);

    setGameState('results');
  };

  const handleShareWrapper = async () => {
    const rankData = getRank(stats.totalXp);
    const { handleShare } = await import('../utils/shareUtils.js');
    await handleShare(rankData, streak, stats.totalXp);
  };

  return (
    <GameContext.Provider value={{
      user, setUser,
      stats, setStats,
      gameState, setGameState, isLoading, setIsLoading,
      isLoading, setIsLoading,
      selectedSubject, setSelectedSubject,
      selectedDifficulty, setSelectedDifficulty,
      questions, setQuestions,
      currentIndex, setCurrentIndex,
      isChecking, setIsChecking,
      selectedAnswerIndex, setSelectedAnswerIndex,
      isTimeAttack, setIsTimeAttack,
      timeLeft, setTimeLeft,
      streak, setStreak,
      showStreakBonus, setShowStreakBonus,
      score, setScore,
      settings, setSettings,
      showRankUp, setShowRankUp,
      newRankInfo, setNewRankInfo,
      startQuiz, handleAnswer, finishQuiz, handleShareWrapper, VAULT_CONSTANTS
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
