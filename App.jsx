// ... (Keep your imports at the top)

const SUBJECTS = [
  { id: 'futa_eng', title: 'FUTA Engineering', icon: GraduationCap, color: 'text-emerald-400' },
  { id: 'science', title: 'General Science', icon: Brain, color: 'text-blue-400' },
  { id: 'tech', title: 'Tech & Math', icon: Cpu, color: 'text-indigo-400' },
  { id: 'sports', title: 'Sports', icon: SportIcon, color: 'text-orange-400' },
  { id: 'languages', title: 'Languages', icon: Languages, color: 'text-pink-400' },
  { id: 'lore', title: 'Jadeblitz Ordverse Lore', icon: Swords, color: 'text-amber-400' }
];

// Inside your startQuiz function, find this line:
const randomized = [...qList].sort(() => Math.random() - 0.5).slice(0, 10)...

// CHANGE IT TO THIS (to make sure you get 10 questions, not 1):
const count = isTimeAttack ? 20 : 10; // More questions for time attack!
const randomized = [...qList].sort(() => Math.random() - 0.5).slice(0, count).map(q => ({
  ...q, options: [...q.options].sort(() => Math.random() - 0.5)
}));
