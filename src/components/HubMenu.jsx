import React from 'react';
import { ArrowRight, BarChart3, ChevronLeft, Zap } from 'lucide-react';
import { useGame, getRank, SUBJECTS, DIFFICULTIES } from '../context/GameContext.jsx';

export default function HubMenu() {
  const { user, isAdmin, stats, gameState, setGameState, selectedSubject, setSelectedSubject, selectedDifficulty, setSelectedDifficulty, startQuiz } = useGame();

  const rankInfo = getRank(stats.totalXp, isAdmin);

  return (
    <>
      {gameState === 'subject_select' && (
        <div className="w-full max-w-2xl space-y-6">
          <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 flex justify-around items-center">
            <div className="text-center">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Power Level</p>
              <p className={`font-black text-lg ${getRank(stats.totalXp, user?.isAdmin).color}`}>
                {getRank(stats.totalXp, user?.isAdmin).title}
              </p>
            </div>
            <div className="h-8 w-px bg-slate-800"></div>
            <div className="text-center">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Status</p>
              <p className="font-bold text-white">
                {getRank(stats.totalXp, user?.isAdmin).level}
              </p>
            </div>
            <div className="h-8 w-px bg-slate-800"></div>
            <div className="text-center">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Total XP</p>
              <p className="font-black text-white">{stats.totalXp}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SUBJECTS.map(sub => {
              const Icon = sub.icon;
              return (
                <button key={sub.id} onClick={() => {setSelectedSubject(sub); setGameState('difficulty_select')}}
                  className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between active:scale-95 transition-all">
                  <div className="flex items-center space-x-4">
                    <Icon size={28} className={`${sub.color} ${sub.glow || ''}`} />
                    <span className="text-lg font-bold">{sub.title}</span>
                  </div>
                  <ArrowRight className="text-slate-700" size={20} />
                </button>
              );
            })}
          </div>

          <button onClick={() => setGameState('leaderboard')} className="w-full py-5 bg-blue-600/20 text-blue-400 rounded-2xl font-bold flex items-center justify-center border border-blue-500/30">
            <BarChart3 className="mr-2" size={20}/> View Hall of Fame
          </button>
        </div>
      )}

      {gameState === 'difficulty_select' && (
        <div className="w-full max-w-sm space-y-4">
           <button onClick={() => setGameState('subject_select')} className="text-slate-500 flex items-center mb-4"><ChevronLeft size={16}/> Back</button>
           <h2 className="text-2xl font-black mb-6 text-center">{selectedSubject?.title}</h2>
           {DIFFICULTIES.map(diff => {
             let disabled = false;
             let passesNeeded = 0;
             const subjPasses = stats.passes?.[selectedSubject?.id] || {};

             if (diff.id === 'intermediate') {
                const foundPasses = subjPasses['foundational'] || 0;
                if (foundPasses < 5) {
                   disabled = true;
                   passesNeeded = 5 - foundPasses;
                }
             } else if (diff.id === 'advanced') {
                const interPasses = subjPasses['intermediate'] || 0;
                if (interPasses < 5) {
                   disabled = true;
                   passesNeeded = 5 - interPasses;
                }
             }

             return (
               <button
                 key={diff.id}
                 onClick={() => {
                   if (!disabled) {
                     setSelectedDifficulty(diff);
                     setGameState('mode_select');
                   }
                 }}
                 disabled={disabled}
                 className={`w-full p-6 bg-slate-900 border ${diff.border} rounded-2xl flex items-center justify-between transition-all ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'active:scale-95'}`}
               >
                 <div className="flex flex-col items-start">
                   <span className={`text-xl font-bold ${diff.color}`}>{diff.title}</span>
                   {disabled && (
                     <span className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
                       {passesNeeded} Passes Needed
                     </span>
                   )}
                 </div>
                 {!disabled && <ArrowRight size={20} className="text-slate-700" />}
               </button>
             );
           })}
        </div>
      )}

      {gameState === 'mode_select' && (
        <div className="w-full max-w-sm space-y-4 text-center">
           <button onClick={() => setGameState('difficulty_select')} className="text-slate-500 flex items-center mb-4"><ChevronLeft size={16}/> Back</button>
           <h2 className={`text-2xl font-black ${selectedSubject?.color}`}>{selectedSubject?.title}</h2>
           <p className="text-slate-500 mb-8 uppercase text-xs font-bold tracking-widest">{selectedDifficulty?.title} Level</p>
           <button onClick={() => startQuiz(false)} className="w-full p-5 bg-slate-900 border border-slate-800 rounded-2xl font-bold">Standard Mode (10Q)</button>
           <button onClick={() => startQuiz(true)} className="w-full p-5 bg-orange-500/10 border border-orange-500/40 text-orange-400 rounded-2xl font-bold flex items-center justify-center">
             <Zap size={20} className="mr-2"/> Time Attack (60s)
           </button>
        </div>
      )}
    </>
  );
}
