import React from 'react';
import { Users } from 'lucide-react';

export default function Leaderboard({ props }) {
  const { setGameState, stats } = props;
  return (
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
  );
}
