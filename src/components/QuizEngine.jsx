import React from 'react';
import { ArrowRight, ChevronLeft, Zap, Flame, Timer, Trophy, Share2 } from 'lucide-react';

export function DifficultySelect({ props }) {
  const { setGameState, selectedSubject, setSelectedDifficulty, DIFFICULTIES } = props;
  return (
    <div className="w-full max-w-sm space-y-4">
      <button onClick={() => setGameState('subject_select')} className="text-slate-500 flex items-center mb-4"><ChevronLeft size={16}/> Back</button>
      <h2 className="text-2xl font-black mb-6 text-center">{selectedSubject.title}</h2>
      {DIFFICULTIES.map(diff => (
        <button key={diff.id} onClick={() => { setSelectedDifficulty(diff); setGameState('mode_select'); }}
          className={`w-full p-6 bg-slate-900 border ${diff.border} rounded-2xl flex items-center justify-between`}>
          <span className={`text-xl font-bold ${diff.color}`}>{diff.title}</span>
          <ArrowRight size={20} className="text-slate-700" />
        </button>
      ))}
    </div>
  );
}

export function ModeSelect({ props }) {
  const { setGameState, selectedSubject, selectedDifficulty, startQuiz } = props;
  return (
    <div className="w-full max-w-sm space-y-4 text-center">
      <button onClick={() => setGameState('difficulty_select')} className="text-slate-500 flex items-center mb-4"><ChevronLeft size={16}/> Back</button>
      <h2 className={`text-2xl font-black ${selectedSubject.color}`}>{selectedSubject.title}</h2>
      <p className="text-slate-500 mb-8 uppercase text-xs font-bold tracking-widest">{selectedDifficulty.title} Level</p>
      <button onClick={() => startQuiz(false)} className="w-full p-5 bg-slate-900 border border-slate-800 rounded-2xl font-bold">Standard Mode (10Q)</button>
      <button onClick={() => startQuiz(true)} className="w-full p-5 bg-orange-500/10 border border-orange-500/40 text-orange-400 rounded-2xl font-bold flex items-center justify-center">
        <Zap size={20} className="mr-2"/> Time Attack (60s)
      </button>
    </div>
  );
}

export function QuizPlayer({ props }) {
  const { showStreakBonus, streak, isTimeAttack, timeLeft, currentIndex, questions, isChecking, handleAnswer, selectedAnswerIndex } = props;
  return (
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
  );
}

export function ResultScreen({ props }) {
  const { score, questions, handleShare, setGameState } = props;
  return (
    <div className="text-center p-10 bg-slate-900 border border-slate-800 rounded-[40px] w-full max-w-sm animate-in zoom-in duration-300 shadow-2xl">
      <Trophy className="mx-auto mb-4 text-amber-400" size={80} />
      <h2 className="text-3xl font-black mb-2 text-white">Quiz Over!</h2>
      <p className="text-6xl font-black my-8 text-white">{score}<span className="text-xl text-slate-700">/{questions.length}</span></p>

      <div className="space-y-3">
        <button onClick={handleShare} className="w-full py-4 bg-emerald-600 rounded-2xl font-black text-lg flex items-center justify-center shadow-lg">
          <Share2 className="mr-2" size={20}/> Share My Score
        </button>
        <button onClick={() => setGameState('subject_select')} className="w-full py-4 bg-blue-600 rounded-2xl font-black text-xl shadow-lg">
          Return to Hub
        </button>
      </div>
    </div>
  );
}
