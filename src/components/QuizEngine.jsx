import React from 'react';
import { Flame, Timer, Trophy, Share2, Users } from 'lucide-react';
import { useGame, getRank } from '../context/GameContext.jsx';

export default function QuizEngine() {
  const {
    stats, gameState, setGameState,
    isTimeAttack, timeLeft,
    streak, showStreakBonus,
    score, questions, currentIndex, isChecking, selectedAnswerIndex, handleAnswer, handleShareWrapper
  } = useGame();

  return (
    <>
      {gameState === 'playing' && (
        <div className="w-full max-w-xl relative">
          {showStreakBonus && (
             <div className="absolute top-[-40px] left-1/2 transform -translate-x-1/2 text-orange-400 font-black flex items-center bg-orange-500/20 px-4 py-2 rounded-full border border-orange-500/50 animate-bounce">
               <Flame className="mr-2" size={20}/> +50 XP STREAK!
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

          <div className="grid gap-3">
            {questions[currentIndex]?.options.map((opt, i) => (
              <button key={i} disabled={isChecking} onClick={() => handleAnswer(i, opt.isCorrect)}
                className={`p-5 rounded-2xl border text-left transition-all font-medium ${isChecking ? (opt.isCorrect ? 'bg-emerald-500/20 border-emerald-500' : i === selectedAnswerIndex ? 'bg-rose-500/20 border-rose-500' : 'opacity-20') : 'bg-slate-900 border-slate-800'}`}>
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {gameState === 'results' && (
        <div className="text-center p-10 bg-slate-900 border border-slate-800 rounded-[40px] w-full max-w-sm animate-in zoom-in duration-300 shadow-2xl">
          <Trophy className="mx-auto mb-4 text-amber-400" size={80} />
          <h2 className="text-3xl font-black mb-2 text-white">Quiz Over!</h2>
          <p className="text-6xl font-black my-8 text-white">{score}<span className="text-xl text-slate-700">/{questions.length}</span></p>

          <div className="space-y-3">
            <button onClick={handleShareWrapper} className="w-full py-4 bg-emerald-600 rounded-2xl font-black text-lg flex items-center justify-center shadow-lg">
              <Share2 className="mr-2" size={20}/> Share My Score
            </button>
            <button onClick={() => setGameState('subject_select')} className="w-full py-4 bg-blue-600 rounded-2xl font-black text-xl shadow-lg">
              Return to Hub
            </button>
          </div>
        </div>
      )}

      {gameState === 'leaderboard' && (
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-black mb-8 flex items-center"><Users className="mr-3 text-purple-400" /> Hall of Fame</h2>
          <div className="space-y-3">
            <div className="p-5 bg-blue-500/10 border border-blue-500/40 rounded-3xl flex justify-between items-center text-left">
              <div><p className="font-bold">You</p><p className="text-xs text-blue-400 italic">Level {Math.floor(stats.totalXp/100)}</p></div>
              <p className="text-2xl font-black text-white">{stats.totalXp} XP</p>
            </div>
            {[{n: "Nichothéos", x: 99999}, {n: "Daragvener", x: 25000}, {n: "Thril_ler", x: 12000}].map((u, i) => (
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
