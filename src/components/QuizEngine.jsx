import React from 'react';
import { Flame, Timer, Users } from 'lucide-react';
import { useGame } from '../context/GameContext.jsx';
import QuizResults from './QuizResults.jsx';
import { calculateBaseGain } from '../utils/quizLogic.js';

export default function QuizEngine() {
  const {
    user, stats, gameState, setGameState,
    isTimeAttack, timeLeft,
    streak, showStreakBonus,
    score, questions, currentIndex, isChecking, selectedAnswerIndex, handleAnswer, finishQuiz, handleShareWrapper,
    sessionXp, recentXpChange, showXpChange, lastPassesNeeded, selectedSubject, selectedDifficulty
  } = useGame();

  const [floatXp, setFloatXp] = React.useState(null);

  const localHandleAnswer = (i, isCorrect) => {
    const baseGain = calculateBaseGain(selectedDifficulty, selectedSubject);

    let xpChange = 0;
    if (isCorrect) {
       xpChange = isTimeAttack ? baseGain * 2 : baseGain;
       setFloatXp({ val: `+${xpChange} XP`, color: selectedSubject?.id === 'lore' ? 'text-[#FBBF24]' : 'text-emerald-400' });
    } else if (selectedDifficulty?.id === 'advanced') {
       xpChange = -Math.floor(baseGain / 2);
       setFloatXp({ val: `${xpChange} XP`, color: selectedSubject?.id === 'lore' ? 'text-[#6A0DAD]' : 'text-rose-500' });
    }

    if (xpChange !== 0 || isCorrect) {
      setTimeout(() => setFloatXp(null), 1000);
    }

    Promise.resolve(handleAnswer(i, isCorrect)).then(() => {
        if (currentIndex === questions.length - 1) {
            let finalScore = score + (isCorrect ? 1 : 0);
            let finalSessionXp = sessionXp + xpChange;
            if (isCorrect && streak > 0 && (streak + 1) % 5 === 0) {
               finalSessionXp += baseGain * 2;
            }
            // Add a small delay for UI animation, but not the long default one.
            setTimeout(() => {
                finishQuiz(finalScore, finalSessionXp);
            }, 500);
        }
    });
  };

  return (
    <>
      {gameState === 'playing' && (
        <div className="w-full max-w-xl relative">
          {showStreakBonus && (
             <div className="absolute top-[-40px] left-1/2 transform -translate-x-1/2 text-orange-400 font-black flex items-center bg-orange-500/20 px-4 py-2 rounded-full border border-orange-500/50 animate-bounce z-10">
               <Flame className="mr-2" size={20}/> +50 XP STREAK!
             </div>
          )}
          {floatXp && (
             <div className={`absolute top-[-40px] right-0 ${floatXp.color} font-black text-xl animate-out fade-out slide-out-to-top-4 duration-1000 z-10`}>
               {floatXp.val}
             </div>
          )}

          {showXpChange && (
             <div key={currentIndex} className={`absolute top-[-20px] right-0 font-black text-xl animate-in fade-in slide-in-from-bottom-2 duration-300 z-10 ${
                recentXpChange >= 0
                  ? (selectedSubject?.id === 'lore' ? 'text-[#FBBF24]' : 'text-emerald-400')
                  : (selectedSubject?.id === 'lore' ? 'text-[#6A0DAD]' : 'text-rose-500')
             }`}>
               {recentXpChange >= 0 ? '+' : ''}{recentXpChange} XP
             </div>
          )}

          <div className="flex justify-between items-center mb-10">
            <div className="h-2 flex-1 bg-slate-800 rounded-full mr-4 overflow-hidden">
               <div className="h-full bg-blue-500 transition-all duration-300" style={{width: `${(currentIndex/questions.length)*100}%`}} />
            </div>

            <div className="flex items-center space-x-4">
              {streak > 2 && <div className="text-orange-500 font-black flex items-center"><Flame size={16} className="mr-1"/> {streak}</div>}
              {isTimeAttack && <div className="text-orange-400 font-black flex items-center"><Timer size={18} className="mr-1"/>{timeLeft}s</div>}
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-10 text-center leading-snug">{questions[currentIndex]?.text}</h2>

          <div className="grid gap-3 relative z-20">
            {questions[currentIndex]?.options.map((opt, i) => (
              <button key={i} disabled={isChecking} onClick={() => localHandleAnswer(i, opt.isCorrect)}
                className={`p-5 rounded-2xl border text-left transition-all font-medium ${isChecking ? (opt.isCorrect ? 'bg-emerald-500/20 border-emerald-500' : i === selectedAnswerIndex ? 'bg-rose-500/20 border-rose-500' : 'opacity-20') : 'bg-slate-900 border-slate-800'}`}>
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {gameState === 'results' && (
        <QuizResults
          isTimeAttack={isTimeAttack}
          questions={questions}
          score={score}
          sessionXp={sessionXp}
          selectedSubject={selectedSubject}
          lastPassesNeeded={lastPassesNeeded}
          handleShareWrapper={handleShareWrapper}
          setGameState={setGameState}
        />
      )}

      {gameState === 'leaderboard' && (
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-black mb-8 flex items-center"><Users className="mr-3 text-purple-400" /> Hall of Fame</h2>
          <div className="space-y-3">
            <div className="p-5 bg-blue-500/10 border border-blue-500/40 rounded-3xl flex justify-between items-center text-left">
              <div><p className="font-bold">{user?.displayName || "Unknown Warrior"}</p><p className="text-xs text-blue-400 italic">Level {Math.floor(stats.totalXp/100)}</p></div>
              <p className="text-2xl font-black text-white">{stats.totalXp} XP</p>
            </div>
            {LEADERBOARD_DATA.map((u, i) => (
              <div key={i} className="p-5 bg-slate-900/50 border border-slate-800 rounded-3xl flex justify-between items-center opacity-60 text-left">
                <p className="font-bold">{u.n}</p><p className="font-black">{u.x} XP</p>
              </div>
            ))}
          </div>
          <button onClick={() => setGameState('subject_select')} className="w-full mt-10 py-4 font-bold text-slate-500 underline">Back Home</button>
        </div>
      )}
    </>
  );
}
