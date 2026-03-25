// Re-apply the economy since it was wiped in the checkout
const fs = require('fs');

let gameContext = fs.readFileSync('src/context/GameContext.jsx', 'utf8');

// 1. States & Persistence
gameContext = gameContext.replace(/const \[stats, setStats\] = useState\(\{ totalXp: 0, completed: 0 \}\);/, 'const [stats, setStats] = useState({ totalXp: 0, completed: 0, passes: {} });');
gameContext = gameContext.replace(/const \[score, setScore\] = useState\(0\);/, 'const [score, setScore] = useState(0);\n  const [sessionXp, setSessionXp] = useState(0);\n  const [lastPassesNeeded, setLastPassesNeeded] = useState(0);');
gameContext = gameContext.replace(/score, setScore,/, 'score, setScore,\n      sessionXp, setSessionXp,\n      lastPassesNeeded, setLastPassesNeeded,');

gameContext = gameContext.replace(/setStats\(\{ totalXp: data\.score \|\| 0, completed: data\.completed \|\| 0 \}\);/g, 'setStats({ totalXp: data.score || 0, completed: data.completed || 0, passes: data.passes || {} });');
gameContext = gameContext.replace(/setStats\(\{ totalXp: 0, completed: 0 \}\);/g, 'setStats({ totalXp: 0, completed: 0, passes: {} });');

gameContext = gameContext.replace(/completed: 0\s*\}\);/, 'completed: 0,\n            passes: {}\n          });');

gameContext = gameContext.replace(/const saveProgress = async \(newXp, newCompleted\) => \{/, 'const saveProgress = async (newXp, newCompleted, newPasses) => {');
gameContext = gameContext.replace(/completed: newCompleted\s*\}, \{ merge: true \}\);/, 'completed: newCompleted,\n        passes: newPasses\n      }, { merge: true });');

gameContext = gameContext.replace(/setScore\(0\);\n    setGameState\('playing'\);/, 'setScore(0);\n    setSessionXp(0);\n    setGameState(\'playing\');');

// 2. handleAnswer
const haRegex = /const handleAnswer = async \(index, isCorrect\) => \{([\s\S]*?)isTimeAttack \? 500 : 1200\);\n  \};/;
const newHa = `const handleAnswer = async (index, isCorrect) => {
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

    setTimeout(() => {
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
  };`;
gameContext = gameContext.replace(haRegex, newHa);

gameContext = gameContext.replace(/finishQuiz\(score\);/, 'finishQuiz(score, sessionXp);');

// 3. finishQuiz
const fqRegex = /const finishQuiz = \(finalScore\) => \{([\s\S]*?)setGameState\('results'\);\n  \};/;
const newFq = `const finishQuiz = (finalScore, finalSessionXp) => {
    let finalXpGain = isTimeAttack ? finalSessionXp * 2 : finalSessionXp;

    const oldXp = stats.totalXp;
    let newXp = oldXp + finalXpGain;
    if (newXp < 0) newXp = 0;

    const oldStep = Math.floor(oldXp / 1250);
    const newStep = Math.floor(newXp / 1250);

    if (newStep > oldStep) {
      const rankData = getRank(newXp, user?.uid);
      setNewRankInfo(rankData);
      setShowRankUp(true);
      setTimeout(() => setShowRankUp(false), 4000);
    }

    const passThreshold = isTimeAttack ? 14 : 7;
    const isPass = finalScore >= passThreshold;
    const passKey = \`\${selectedSubject?.id}_\${selectedDifficulty?.id}\`;
    const newPasses = { ...(stats.passes || {}) };

    let passesNeededMsg = 0;
    if (isPass) {
      newPasses[passKey] = (newPasses[passKey] || 0) + 1;
    }

    if (selectedDifficulty?.id === 'foundational') {
       const hasPasses = newPasses[passKey] || 0;
       passesNeededMsg = Math.max(0, 5 - hasPasses);
    } else if (selectedDifficulty?.id === 'intermediate') {
       const hasPasses = newPasses[passKey] || 0;
       passesNeededMsg = Math.max(0, 5 - hasPasses);
    }
    setLastPassesNeeded(passesNeededMsg);

    const newStats = { ...stats, totalXp: newXp, completed: stats.completed + 1, passes: newPasses };
    setStats(newStats);
    localStorage.setItem('nexus_stats', JSON.stringify(newStats));

    saveProgress(newXp, newStats.completed, newPasses);

    setSessionXp(finalXpGain);
    setGameState('results');
  };`;
gameContext = gameContext.replace(fqRegex, newFq);

fs.writeFileSync('src/context/GameContext.jsx', gameContext);
