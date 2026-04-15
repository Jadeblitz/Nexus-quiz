import React from 'react';
import { Zap } from 'lucide-react';

const RankUpOverlay = ({ newRankInfo }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 animate-in fade-in duration-500">
    <div className="absolute inset-0 bg-amber-500/10 animate-pulse" />
    <div className="relative text-center p-12 rounded-[50px] border-2 border-amber-400/50 bg-slate-900 shadow-[0_0_50px_rgba(251,191,36,0.4)] animate-in zoom-in duration-700">
      <Zap className="mx-auto mb-6 text-amber-400 animate-bounce" size={80} />
      <h2 className="text-sm font-black text-amber-500 uppercase tracking-[0.3em] mb-2 text-center">Evolution Complete</h2>
      <h1 className="text-5xl font-black text-white mb-4 italic text-center">RANK UP!</h1>
      <div className="h-px w-32 bg-amber-400/30 mx-auto mb-6" />
      <p className="text-2xl font-bold text-white mb-1 text-center">{newRankInfo.title}</p>
      <p className="text-lg text-amber-400 italic text-center">{newRankInfo.level}</p>
    </div>
  </div>
);

export default RankUpOverlay;
