import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { quizData, VAULT_CONSTANTS, SUBJECTS, DIFFICULTIES } from '../data/quizData';

export { SUBJECTS, DIFFICULTIES };

export const getRank = (xp, isAdmin) => {
  const RANKS = ["Basic", "Novice", "Adept", "Elite", "Veteran", "Commander", "Knight", "King", "Emperor", "Saint", "Sage", "Primordial", "God"];

  if (xp >= 13 * 3 * 1250) {
      // True God is reserved
      if (isAdmin) {
          return { title: "Rank 14", level: "True God", color: "text-amber-400 font-black" };
      }
      // Non-admins cap at Rank 13 Peak (God)
      return { title: "Rank 13", level: "God (Peak)", color: "text-rose-500" };
  }

  const xpPerSubStep = 1250;
  const stepIndex = Math.floor((xp < 0 ? 0 : xp) / xpPerSubStep);
  // Cap rank at 13 (index 12)
  const rankIndex = Math.min(Math.floor(stepIndex / 3), 12);
  const subLevelIndex = Math.min(stepIndex % 3, 2);
  const subLevels = ["Beginner", "Advanced", "Peak"];

  const rankName = RANKS[rankIndex] || "Basic";
  const subName = subLevels[subLevelIndex] || "Beginner";

  return {
    title: `Rank ${rankIndex + 1}`,
    level: `${rankName} (${subName})`,
    color: rankIndex >= 11 ? "text-rose-500" : rankIndex >= 8 ? "text-purple-400" : "text-blue-400"
  };
};


export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({ totalXp: 0, completed: 0, passes: {} });
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
  const [sessionXp, setSessionXp] = useState(0);
  const [lastPassesNeeded, setLastPassesNeeded] = useState(0);

  const [recentXpChange, setRecentXpChange] = useState(0);
  const [showXpChange, setShowXpChange] = useState(false);

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
          setIsAdmin(data.isAdmin === true);
          setStats({ totalXp: data.score || 0, completed: data.completed || 0, passes: data.passes || {} });
        } else {
          setIsAdmin(false);
          await setDoc(userDocRef, {
            uid: userObj.uid,
            displayName: userObj.displayName || "Unknown Warrior",
            rank: "Basic (Beginner)",
            score: 0,
            powerLevel: 1,
            completed: 0,
            passes: {}
          });
          setStats({ totalXp: 0, completed: 0, passes: {} });
        }
      } catch (err) {
        console.error("Firebase persistence failed, falling back to Guest state:", err);
        // Fallback to Guest state
        setIsAdmin(false);
        setStats({ totalXp: 0, completed: 0, passes: {} });
      }
    };

    const resolveAuth = (authUser) => {
      setUser(authUser);
      handleUserPersistence(authUser)
        .catch((err) => console.error("Persistence error:", err))
        .finally(() => {
          setGameState('subject_select');
          setIsLoading(false);
        });
    };

    FirebaseAuthentication.addListener('authStateChange', (result) => {
      if (result.user) {
        resolveAuth(result.user);
      } else {
        setUser(null);
        setGameState('login');
        setIsLoading(false);
      }
    });

    FirebaseAuthentication.getCurrentUser().then((result) => {
      if (result.user) {
        resolveAuth(result.user);
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
      finishQuiz(score, sessionXp);
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
    const actualLimit = Math.min(pool.length, limit);
    const poolCopy = [...pool];
    for (let i = 0; i < actualLimit; i++) {
      const j = i + Math.floor(Math.random() * (poolCopy.length - i));
      [poolCopy[i], poolCopy[j]] = [poolCopy[j], poolCopy[i]];
    }
    const randomized = poolCopy.slice(0, actualLimit).map(q => ({
      ...q, options: shuffle(q.options)
    }));

    setQuestions(randomized);
    setCurrentIndex(0);
    setScore(0);
    setSessionXp(0);
    setShowXpChange(false);
    setGameState('playing');
  };

  const updateLocalXP = (xpChange) => {
    setStats(prevStats => {
      let newXp = prevStats.totalXp + xpChange;
      if (newXp < 0) newXp = 0;
      return { ...prevStats, totalXp: newXp };
    });
  };

  const handleAnswer = async (index, isCorrect) => {
    if (isChecking) return;
    setSelectedAnswerIndex(index);
    setIsChecking(true);

    let baseGain = 10;
    if (selectedDifficulty?.id === 'intermediate') {
       if (selectedSubject?.id === 'lore') baseGain = 30;
       else if (selectedSubject?.id === 'tech') baseGain = 20;
       else baseGain = 15;
    } else if (selectedDifficulty?.id === 'advanced') {
       if (selectedSubject?.id === 'lore') baseGain = 50;
       else if (selectedSubject?.id === 'tech') baseGain = 30;
       else baseGain = 20;
    }

    let xpEarnedThisQuestion = 0;
    let newScore = score;
    let currentStreak = streak;

    if (isCorrect) {
      newScore += 1;
      setScore(newScore);

      xpEarnedThisQuestion = baseGain;
      currentStreak += 1;
      setStreak(currentStreak);

      if (currentStreak > 0 && currentStreak % 5 === 0) {
         setShowStreakBonus(true);
         setTimeout(() => setShowStreakBonus(false), 2000);
         xpEarnedThisQuestion += baseGain * 2; // Proportionate bonus
      }

      if (settings.sfxEnabled && correctSfx.current) correctSfx.current.play().catch(()=>{});
      if (settings.hapticsEnabled) await Haptics.notification({ type: NotificationType.Success }).catch(()=>{});
    } else {
      currentStreak = 0;
      setStreak(0);

      if (selectedDifficulty?.id === 'advanced') {
         xpEarnedThisQuestion = -Math.floor(baseGain / 2);
      }

      if (settings.sfxEnabled && wrongSfx.current) wrongSfx.current.play().catch(()=>{});
      if (settings.hapticsEnabled) await Haptics.impact({ style: ImpactStyle.Heavy }).catch(()=>{});
    }

    const updatedSessionXp = sessionXp + xpEarnedThisQuestion;
    setSessionXp(updatedSessionXp);

    updateLocalXP(xpEarnedThisQuestion);

    setRecentXpChange(xpEarnedThisQuestion);
    setShowXpChange(true);

    setTimeout(() => {
      setShowXpChange(false);
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(c => c + 1);
        setSelectedAnswerIndex(null);
        setIsChecking(false);
      } else {
        finishQuiz(newScore, updatedSessionXp);
        setIsChecking(false);
        setSelectedAnswerIndex(null);
      }
    }, isTimeAttack ? 500 : 1200);
  };

  const saveProgress = async (newXp, newCompleted, newPasses) => {
    if (!user) return;
    try {
      const rankData = getRank(newXp, isAdmin);
      const powerLevel = Math.floor(newXp / 100);
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        rank: rankData.level,
        score: newXp,
        powerLevel: powerLevel,
        completed: newCompleted,
        passes: newPasses
      }, { merge: true });
    } catch (err) {
      console.error("Sync failed", err);
    }
  };

  const finishQuiz = (finalScore, finalSessionXp) => {
    let finalXpGain = isTimeAttack ? finalSessionXp * 2 : finalSessionXp;

    // Because updateLocalXP added sessionXp iteratively to totalXp during gameplay,
    // totalXp is currently (oldTotalXp + finalSessionXp).
    // We want the final totalXp to be (oldTotalXp + finalXpGain).
    // So we subtract finalSessionXp from stats.totalXp, then add finalXpGain.
    const oldXp = stats.totalXp - finalSessionXp;
    let newXp = oldXp + finalXpGain;
    if (newXp < 0) newXp = 0;

    const oldStep = Math.floor(oldXp / 1250);
    const newStep = Math.floor(newXp / 1250);

    if (newStep > oldStep) {
      const rankData = getRank(newXp, isAdmin);
      setNewRankInfo(rankData);
      setShowRankUp(true);
      setTimeout(() => setShowRankUp(false), 4000);
    }

    const passThreshold = isTimeAttack ? 14 : 7;
    const isPass = finalScore >= passThreshold;

    const newPasses = JSON.parse(JSON.stringify(stats.passes || {}));
    const subId = selectedSubject?.id;
    const diffId = selectedDifficulty?.id;

    if (subId) {
      if (!newPasses[subId]) {
        newPasses[subId] = {};
      }

      let passesNeededMsg = 0;
      if (isPass) {
        newPasses[subId][diffId] = (newPasses[subId][diffId] || 0) + 1;
      }

      if (diffId === 'foundational' || diffId === 'intermediate') {
         const hasPasses = newPasses[subId][diffId] || 0;
         passesNeededMsg = Math.max(0, 5 - hasPasses);
      }
      setLastPassesNeeded(passesNeededMsg);
    } else {
      setLastPassesNeeded(0);
    }

    const newStats = { ...stats, totalXp: newXp, completed: stats.completed + 1, passes: newPasses };
    setStats(newStats);
    localStorage.setItem('nexus_stats', JSON.stringify(newStats));

    saveProgress(newXp, newStats.completed, newPasses);

    setSessionXp(finalXpGain);
    setGameState('results');
  };

  const handleShareWrapper = async () => {
    const rankData = getRank(stats.totalXp, isAdmin);
    const { handleShare } = await import('../utils/shareUtils.js');
    await handleShare(rankData, streak, stats.totalXp);
  };

  return (
    <GameContext.Provider value={{
      user, setUser, isAdmin, setIsAdmin,
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
      sessionXp, setSessionXp,
      recentXpChange, setRecentXpChange,
      showXpChange, setShowXpChange,
      lastPassesNeeded, setLastPassesNeeded,
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
