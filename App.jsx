import React, { useState, useEffect, useRef } from 'react';
import { Brain, Cpu, Trophy, ArrowRight, RotateCcw, CheckCircle2, XCircle, ChevronLeft, Swords, BookOpen, Lightbulb, Film, Trophy as SportIcon, Languages, Home, Settings, Volume2, VolumeX, Smartphone, BarChart3, GraduationCap, Users, Timer, Zap } from 'lucide-react';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

// ==========================================
// 📚 RAW QUIZ DATA (FULL REPOSITORY)
// ==========================================
const rawQuizData = {
  futa_eng: {
    foundational: [
      ["What does FUTA stand for?", "Federal University of Technology, Akure", "Federal University of Trade, Akure", "First University of Tech, Akure", "Federal Union of Tech, Akure"],
      ["Which law states Energy cannot be created or destroyed?", "First Law of Thermodynamics", "Newton's Second Law", "Ohm's Law", "Hooke's Law"],
      ["What is the standard unit of Force?", "Newton", "Pascal", "Watt", "Joule"]
    ],
    intermediate: [
      ["What is the Reynolds number for laminar flow in a pipe?", "Below 2100", "Above 4000", "Exactly 3000", "Over 10,000"],
      ["What is the chemical formula for Methane?", "CH4", "C2H6", "CO2", "H2O"],
      ["Which device is used to measure fluid flow rate?", "Venturi Meter", "Manometer", "Thermometer", "Hygrometer"]
    ],
    advanced: [
      ["Which equation is used for Batch Reactor design?", "Design Equation", "Bernoulli Equation", "Ergun Equation", "Van der Waals"],
      ["What is the 'No-Slip Condition' in fluid mechanics?", "Velocity at wall is zero", "Pressure at wall is zero", "Flow is frictionless", "Temperature is constant"],
      ["What does a P&ID stand for?", "Piping and Instrumentation Diagram", "Pressure and Intake Design", "Process and Internal Draft", "Power and Information Data"]
    ]
  },
  sports: {
    foundational: [["How many players start a football match per team?", "11", "10", "12", "7"]],
    intermediate: [["Who won the 2023 Ballon d'Or?", "Lionel Messi", "Erling Haaland", "Kylian Mbappe", "Rodri"]],
    advanced: [["Which club did Jose Mourinho win his first UCL with?", "FC Porto", "Chelsea", "Inter Milan", "Real Madrid"]]
  },
  // (Other domains: science, tech, languages, lore - ensure they are included here!)
};

const parseData = (data) => {
  const parsed = {};
  for (const subject in data) {
    parsed[subject] = {};
    for (const difficulty in data[subject]) {
      parsed[subject][difficulty] = data[subject][difficulty].map((q, idx) => ({
        id: `${subject}_${difficulty}_${idx}`,
        text: q[0],
        options: [
          { text: q[1], isCorrect: true },
          { text: q[2], isCorrect: false },
          { text: q[3], isCorrect: false },
          { text: q[4], isCorrect: false }
        ]
      }));
    }
  }
  return parsed;
};

const quizData = parseData(rawQuizData);

const SUBJECTS = [
  { id: 'futa_eng', title: 'FUTA Engineering', icon: GraduationCap, color: 'text-emerald-400' },
  { id: 'sports', title: 'Sports', icon: SportIcon, color: 'text-blue-400' },
  { id: 'lore', title: 'Nichothéos', icon: Swords, color: 'text-amber-400' }
];

export default function App() {
  const [gameState, setGameState] = useState('subject_select'); 
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({ musicEnabled: true, sfxEnabled: true, hapticsEnabled: true });
  const [stats, setStats] = useState({ totalXp: 0, completed: 0 });

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimeAttack, setIsTimeAttack] = useState(false);
  
  const [isChecking, setIsChecking] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);

  const bgMusic = useRef(new Audio('/music.mp3'));
  const correctSfx = useRef(new Audio('/correct.mp3'));
  const wrongSfx = useRef(new Audio('/wrong.mp3'));

  useEffect(() => {
    const s1 = localStorage.getItem('nexus_stats');
    const s2 = localStorage.getItem('nexus_settings');
    if (s1) setStats(JSON.parse(s1));
    if (s2) setSettings(JSON.parse(s2));
    bgMusic.current.loop = true;
  }, []);

  // Timer Logic
  useEffect(() => {
    let timer;
    if (gameState === 'playing' && isTimeAttack && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setGameState('results');
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, isTimeAttack]);

  const startQuiz = (diffId, timeMode = false) => {
    setIsTimeAttack(timeMode);
    setTimeLeft(60);
    setSelectedDifficulty(diffId);
    let qList = quizData[selectedSubject.id][diffId];
    const randomized = [...qList].sort(() => Math.random() - 0.5).map(q => ({
      ...q, options: [...q.options].sort(() => Math.random() - 0.5)
    }));
    setQuestions(randomized);
    setCurrentIndex(0);
    setScore(0);
    setGameState('playing');
  };

  const saveResults = (finalScore) => {
    const xpGain = isTimeAttack ? finalScore * 20 : finalScore * 10;
    const newStats = { totalXp: stats.totalXp + xpGain, completed: stats.completed + 1 };
    setStats(newStats);
    localStorage.setItem('nexus_stats', JSON.stringify(newStats));
  };

  const handleAnswer = async (index, isCorrect) => {
    if (isChecking) return;
    setSelectedAnswerIndex(index);
    setIsChecking(true);

    if (isCorrect) {
      setScore(s => s + 1);
      if (settings.sfxEnabled) correctSfx.current.play();
      if (settings.hapticsEnabled) await Haptics.notification({ type: NotificationType.Success });
    } else {
      if (settings.sfxEnabled) wrongSfx.current.play();
      if (settings.hapticsEnabled) await Haptics.impact({ style: ImpactStyle.Heavy });
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(c => c + 1);
        setSelectedAnswerIndex(null);
        setIsChecking(false);
      } else {
        saveResults(score + (isCorrect ? 1 : 0));
        setGameState('results');
      }
    }, 600); // Faster transition for Time Attack feel
  };

  // --- UI SCREENS ---

  const renderHome = () => (
    <div className="w-full max-w-2xl space-y-6">
      <div className="flex justify-around bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
        <div className="text-center"><p className="text-xs text-slate-500 uppercase">Rank</p><p className="text-xl font-bold text-blue-400">Freshman</p></div>
        <div className="text-center"><p className="text-xs text-slate-500 uppercase">XP</p><p className="text-xl font-bold text-emerald-400">{stats.totalXp}</p></div>
      </div>
      
      <div className="grid gap-4">
        {SUBJECTS.map(sub => (
          <button key={sub.id} onClick={() => {setSelectedSubject(sub); setGameState('difficulty_select')}}
            className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between hover:border-blue-500 transition-all">
            <div className="flex items-center space-x-4">
              <sub.icon size={32} className={sub.color} />
              <span className="text-xl font-bold">{sub.title}</span>
            </div>
            <ArrowRight className="text-slate-600" />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 flex flex-col items-center">
      {/* HEADER */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <div className="flex items-center space-x-2" onClick={() => setGameState('subject_select')}>
          <Brain className="text-blue-500" />
          <span className="text-xl font-black">NexusQuiz</span>
        </div>
        <div className="flex space-x-2">
           <button onClick={() => setGameState('leaderboard')} className="p-2 bg-slate-900 rounded-xl border border-slate-800"><BarChart3 size={20} /></button>
           <button onClick={() => setShowSettings(true)} className="p-2 bg-slate-900 rounded-xl border border-slate-800"><Settings size={20} /></button>
        </div>
      </div>

      {gameState === 'subject_select' && renderHome()}

      {gameState === 'difficulty_select' && (
        <div className="w-full max-w-md space-y-4">
           <h2 className="text-2xl font-bold mb-4">{selectedSubject.title}</h2>
           <button onClick={() => startQuiz('foundational', false)} className="w-full p-5 bg-slate-900 border border-slate-800 rounded-xl font-bold">Standard Mode</button>
           <button onClick={() => startQuiz('foundational', true)} className="w-full p-5 bg-orange-500/10 border border-orange-500/50 text-orange-400 rounded-xl font-bold flex items-center justify-center">
             <Zap className="mr-2" size={18}/> Time Attack (60s)
           </button>
           <button onClick={() => setGameState('subject_select')} className="w-full py-4 text-slate-500">Cancel</button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="w-full max-w-xl">
          <div className="flex justify-between items-center mb-6">
            <span className="px-3 py-1 bg-slate-800 rounded-full text-xs uppercase font-bold tracking-tighter">Q {currentIndex+1}/10</span>
            {isTimeAttack && <div className="flex items-center text-orange-400 font-black text-xl"><Timer className="mr-2"/> {timeLeft}s</div>}
          </div>
          <h2 className="text-2xl font-bold mb-8 leading-tight">{questions[currentIndex]?.text}</h2>
          <div className="grid gap-3">
            {questions[currentIndex]?.options.map((opt, i) => (
              <button key={i} disabled={isChecking} onClick={() => handleAnswer(i, opt.isCorrect)}
                className={`p-5 rounded-2xl border text-left transition-all ${isChecking ? (opt.isCorrect ? 'bg-emerald-500/20 border-emerald-500' : i === selectedAnswerIndex ? 'bg-rose-500/20 border-rose-500' : 'opacity-30') : 'bg-slate-900 border-slate-800'}`}>
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {gameState === 'results' && (
        <div className="text-center w-full max-w-sm">
          <Trophy className="mx-auto mb-4 text-amber-400" size={64} />
          <h2 className="text-4xl font-black mb-2">Well Done!</h2>
          <p className="text-slate-500 mb-8">{isTimeAttack ? 'Time Attack Bonus Applied' : 'Standard Session Complete'}</p>
          <div className="text-6xl font-black mb-10">{score}<span className="text-2xl text-slate-600">/10</span></div>
          <button onClick={() => setGameState('subject_select')} className="w-full py-5 bg-blue-600 rounded-2xl font-bold text-lg">Back to Hub</button>
        </div>
      )}
    </div>
  );
}
