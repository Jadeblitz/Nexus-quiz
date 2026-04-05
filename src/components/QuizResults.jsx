import React from 'react';
import { Trophy, Share2 } from 'lucide-react';

export default function QuizResults({
  isTimeAttack,
  questions,
  score,
  sessionXp,
  selectedSubject,
  lastPassesNeeded,
  handleShareWrapper,
  setGameState
}) {
  const passThreshold = isTimeAttack ? 14 : 7;
  const totalQ = questions.length;
  const percentage = (score / totalQ) * 100;

  let gradeText = "Failed";
  let gradeColor = "text-rose-500";
  if (percentage >= 70) {
     gradeText = "Pass";
     gradeColor = "text-emerald-400";
  } else if (percentage >= 50) {
     gradeText = "Average";
     gradeColor = "text-yellow-400";
  } else if (percentage >= 30) {
     gradeText = "Fair";
     gradeColor = "text-orange-400";
  }

  let xpColor = sessionXp >= 0 ? "text-emerald-400" : "text-rose-500";
  if (selectedSubject?.id === 'lore') {
     xpColor = sessionXp >= 0 ? "text-[#FBBF24]" : "text-[#6A0DAD]";
  }

  return (
    <div className="text-center p-10 bg-slate-900 border border-slate-800 rounded-[40px] w-full max-w-sm animate-in zoom-in duration-300 shadow-2xl">
      <Trophy className="mx-auto mb-4 text-amber-400" size={80} />
      <h2 className="text-3xl font-black mb-2 text-white">Quiz Over!</h2>
      <p className="text-6xl font-black mt-4 mb-2 text-white">{score}<span className="text-xl text-slate-700">/{totalQ}</span></p>

      <div className="mb-6 space-y-1">
         <p className={`text-3xl font-black uppercase tracking-widest ${gradeColor}`}>{gradeText}</p>
         <p className={`text-2xl font-bold ${xpColor}`}>{sessionXp > 0 ? '+' : ''}{sessionXp} XP</p>
         {lastPassesNeeded > 0 && percentage >= 70 && <p className="text-sm font-bold text-blue-400 mt-2">Need {lastPassesNeeded} more Pass(es) to unlock next difficulty!</p>}
         {lastPassesNeeded === 0 && percentage >= 70 && <p className="text-sm font-bold text-emerald-400 mt-2">Difficulty Mastered!</p>}
      </div>

      <div className="space-y-3">
        <button onClick={handleShareWrapper} className="w-full py-4 bg-emerald-600 rounded-2xl font-black text-lg flex items-center justify-center shadow-lg">
          <Share2 className="mr-2" size={20}/> Share My Score
        </button>
        <button onClick={() => setGameState('subject_select')} className="w-full py-4 bg-blue-600 rounded-2xl font-black text-xl shadow-lg">
          Return to Hub
        </button>
      </div>
    </div>
  );
}
