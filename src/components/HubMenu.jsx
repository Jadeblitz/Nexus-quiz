import React from 'react';
import { ArrowRight, BarChart3 } from 'lucide-react';

export default function HubMenu({ props }) {
  const { stats, getRank, SUBJECTS, setSelectedSubject, setGameState } = props;
  return (
    <div className="w-full max-w-2xl space-y-6">
      {/* --- 👑 Power Hierarchy Header --- */}
      <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 flex justify-around items-center">
        <div className="text-center">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">Power Level</p>
          <p className={`font-black text-lg ${getRank(stats.totalXp).color}`}>
            {getRank(stats.totalXp).title}
          </p>
        </div>
        <div className="h-8 w-px bg-slate-800"></div>
        <div className="text-center">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">Status</p>
          <p className="font-bold text-white">
            {getRank(stats.totalXp).level}
          </p>
        </div>
        <div className="h-8 w-px bg-slate-800"></div>
        <div className="text-center">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">Total XP</p>
          <p className="font-bold text-emerald-400">{stats.totalXp}</p>
        </div>
      </div>

      {/* --- 📚 Subjects Grid --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SUBJECTS.map(sub => {
          const Icon = sub.icon;
          return (
            <button key={sub.id} onClick={() => { setSelectedSubject(sub); setGameState('difficulty_select'); }}
              className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between active:scale-95 transition-all">
              <div className="flex items-center space-x-4">
                <Icon size={28} className={`${sub.color} ${sub.glow || ''}`} />
                <span className="text-lg font-bold">{sub.title}</span>
              </div>
              <ArrowRight className="text-slate-700" size={20} />
            </button>
          )
        })}
      </div>

      <button onClick={() => setGameState('leaderboard')} className="w-full py-5 bg-blue-600/20 text-blue-400 rounded-2xl font-bold flex items-center justify-center border border-blue-500/30">
        <BarChart3 className="mr-2" size={20}/> View Hall of Fame
      </button>
    </div>
  );
}
