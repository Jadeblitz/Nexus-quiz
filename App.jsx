import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, Cpu, Trophy, ArrowRight, RotateCcw, ChevronLeft, Swords, 
  Trophy as SportIcon, Languages, Home, Settings, Volume2, VolumeX, 
  Smartphone, BarChart3, GraduationCap, Users, Timer, Zap, Book 
} from 'lucide-react';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

// ==========================================
// 📚 RAW QUIZ DATA (THE GREAT REPOSITORY)
// ==========================================
const rawQuizData = {
  futa_eng: {
    foundational: [
      ["What does FUTA stand for?", "Federal University of Technology, Akure", "Federal University of Trade, Akure", "First University of Tech, Akure", "Federal Union of Tech, Akure"],
      ["Which law states Energy cannot be created or destroyed?", "First Law of Thermodynamics", "Newton's Second Law", "Ohm's Law", "Hooke's Law"],
      ["What is the standard unit of Pressure?", "Pascal", "Newton", "Watt", "Joule"]
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
  lore: {
    foundational: [["Who is the Prime Creator in the Ordverse?", "Aetherius Dominus", "Supremus Daragvener", "King Kailus", "Valthar Demetrius"]],
    intermediate: [["The Triune Symmetry's third pillar is...", "τὸ ἄγνωστον", "The Vessel", "The Conduit", "The Archon"]],
    advanced: [["Nicholas's Crimson to Brown hair ratio is?", "43:57", "50:50", "60:40", "57:43"]]
  }
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
  { id: 'lore', title: 'Ordverse Lore', icon: Swords, color: 'text-amber-400' }
];

const VAULT_CONSTANTS = [
  { name: "Gas Constant (R)", value: "8.314 J/(mol·K)", formula: "PV = nRT" },
  { name: "Gravity (g)", value: "9.81 m/s²", formula: "F = mg" },
  { name: "Water Density (ρ)", value: "1000 kg/m³", formula: "at 4°C" },
  { name: "Faraday (F)", value: "96,485 C/mol", formula: "Q = nF" },
  { name: "Boltzmann (k)", value: "1.38 x 10⁻²³ J/K", formula: "S = k ln W" }
];

export default function App() {
  const [gameState, setGameState] = useState('subject_select'); 
  const [showSettings, setShowSettings] = useState(false);
  const [showVault, setShowVault] = useState(false);
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
    bgMusic.current.volume = 0.3;
  }, []);

  useEffect(() => {
    if (settings.musicEnabled && gameState !== 'playing') {
      bgMusic.current.play().catch(() => {});
    } else {
      bgMusic.current.pause();
    }
  }, [settings.musicEnabled, gameState]);

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && isTimeAttack && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      finishQuiz(score);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, isTimeAttack]);

  const startQuiz = (diffId, timeMode = false) => {
    setIsTimeAttack(timeMode);
    setTimeLeft(60);
    setSelectedDifficulty(diffId);
    let qList = quizData[selectedSubject.id][diffId];
    const randomized = [...qList].sort(() => Math.random() - 0.5).slice(0, 10).map(q => ({
      ...q, options: [...q.options].sort(() => Math.random() - 0.5)
    }));
    setQuestions(randomized);
    setCurrentIndex(0);
    setScore(0);
    setGameState('playing');
  };

  const finishQuiz = (finalScore) => {
    const xpGain = isTimeAttack ? finalScore * 20 : finalScore * 10;
    const newStats = { totalXp: stats.totalXp + xpGain, completed: stats.completed + 1 };
    setStats(newStats);
    localStorage.setItem('nexus_stats', JSON.stringify(newStats));
    setGameState('results');
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
        finishQuiz(score + (isCorrect ? 1 : 0));
        setIsChecking(false);
        setSelectedAnswerIndex(null);
      }
    }, isTimeAttack ? 500 : 1000);
  };

  const getRank = (xp) => {
    if (xp > 5000) return "Engineering Legend";
    if (xp > 2000) return "Dean's List";
    if (xp > 500) return "FUTA Scholar";
    return "Freshman";
  };

  // --- UI COMPONENTS ---

  const Modal = ({ title, children, onClose, icon: Icon, iconColor }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl overflow-y-auto max-h-[85vh]">
        <h2 className="text-2xl font-black mb-6 flex items-center">
          {Icon && <Icon className={`mr-3 ${iconColor}`} />} {title}
        </h2>
        {children}
        <button onClick={onClose} className="w-full mt-8 py-4 bg-slate-800 rounded-xl font-bold">Close</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 flex flex-col items-center">
      {showSettings && (
        <Modal title="Settings" onClose={() => setShowSettings(false)} icon={Settings} iconColor="text-blue-400">
          <div className="space-y-6">
            {['musicEnabled', 'sfxEnabled', 'hapticsEnabled'].map((key) => (
              <div key={key} className="flex items-center justify-between capitalize">
                <span>{key.replace('Enabled', '')}</span>
                <button onClick={() => {
                  const ns = {...settings, [key]: !settings[key]};
                  setSettings(ns);
                  localStorage.setItem('nexus_settings', JSON.stringify(ns));
                }} className={`w-12 h-6 rounded-full ${settings[key] ? 'bg-blue-500' : 'bg-slate-700'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-all ${settings[key] ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {showVault && (
        <Modal title="Formula Vault" onClose={() => setShowVault(false)} icon={Book} iconColor="text-emerald-400">
          <div className="space-y-4">
            {VAULT_CONSTANTS.map((c, i) => (
              <div key={i} className="p-4 bg-slate-800/40 border border-slate-700 rounded-2xl">
                <p className="text-[10px] text-emerald-400 font-bold uppercase">{c.name}</p>
                <p className="text-lg font-black">{c.value}</p>
                <p className="text-xs text-slate-500 italic mt-1">{c.formula}</p>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* HEADER */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <div className="flex items-center space-x-2" onClick={() => setGameState('subject_select')}>
          <Brain className="text-blue-500" />
          <span className="text-xl font-black italic">NexusQuiz</span>
        </div>
        <div className="flex space-x-2">
           <button onClick={() => setShowVault(true)} className="p-2 bg-slate-900 rounded-xl border border-slate-800"><Book size={20} className="text-emerald-400"/></button>
           <button onClick={() => setGameState('leaderboard')} className="p-2 bg-slate-900 rounded-xl border border-slate-800"><BarChart3 size={20} className="text-purple-400"/></button>
           <button onClick={() => setShowSettings(true)} className="p-2 bg-slate-900 rounded-xl border border-slate-800"><Settings size={20}/></button>
        </div>
      </div>

      {gameState === 'subject_select' && (
        <div className="w-full max-w-2xl space-y-6">
          <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 flex justify-around">
            <div className="text-center"><p className="text-[10px] text-slate-500 uppercase">Your Rank</p><p className="font-bold text-blue-400">{getRank(stats.totalXp)}</p></div>
            <div className="text-center"><p className="text-[10px] text-slate-500 uppercase">Total XP</p><p className="font-bold text-emerald-400">{stats.totalXp}</p></div>
          </div>
          <div className="grid gap-4">
            {SUBJECTS.map(sub => (
              <button key={sub.id} onClick={() => {setSelectedSubject(sub); setGameState('difficulty_select')}}
                className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-4"><sub.icon size={28} className={sub.color} /><span className="text-lg font-bold">{sub.title}</span></div>
                <ArrowRight className="text-slate-700" size={20} />
              </button>
            ))}
          </div>
        </div>
      )}

      {gameState === 'difficulty_select' && (
        <div className="w-full max-w-sm space-y-4 text-center">
           <h2 className="text-2xl font-black mb-6 text-blue-400">{selectedSubject.title}</h2>
           <button onClick={() => startQuiz('foundational', false)} className="w-full p-5 bg-slate-900 border border-slate-800 rounded-2xl font-bold">Standard Mode (10Q)</button>
           <button onClick={() => startQuiz('foundational', true)} className="w-full p-5 bg-orange-500/10 border border-orange-500/40 text-orange-400 rounded-2xl font-bold flex items-center justify-center">
             <Zap size={20} className="mr-2"/> Time Attack (60s)
           </button>
           <button onClick={() => setGameState('subject_select')} className="w-full py-4 text-slate-600 font-bold">Back to Hub</button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="w-full max-w-xl">
          <div className="flex justify-between items-center mb-10">
            <div className="h-2 flex-1 bg-slate-800 rounded-full mr-4 overflow-hidden">
               <div className="h-full bg-blue-500" style={{width: `${(currentIndex/10)*100}%`}} />
            </div>
            {isTimeAttack && <div className="text-orange-400 font-black flex items-center"><Timer size={18} className="mr-1"/>{timeLeft}s</div>}
          </div>
          <h2 className="text-2xl font-bold mb-10 leading-snug">{questions[currentIndex]?.text}</h2>
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
        <div className="text-center p-10 bg-slate-900 border border-slate-800 rounded-[40px] w-full max-w-sm">
          <Trophy className="mx-auto mb-4 text-amber-400" size={80} />
          <h2 className="text-3xl font-black mb-2">Quiz Over!</h2>
          <p className="text-6xl font-black my-8">{score}<span className="text-xl text-slate-700">/10</span></p>
          <button onClick={() => setGameState('subject_select')} className="w-full py-5 bg-blue-600 rounded-2xl font-black text-xl shadow-lg shadow-blue-900/20">Return to Hub</button>
        </div>
      )}

      {gameState === 'leaderboard' && (
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-black mb-8 flex items-center"><Users className="mr-3 text-purple-400" /> Hall of Fame</h2>
          <div className="space-y-3">
            <div className="p-5 bg-blue-500/10 border border-blue-500/40 rounded-3xl flex justify-between items-center">
              <div><p className="font-bold">You (Chemical Engineer)</p><p className="text-xs text-blue-400 italic">{getRank(stats.totalXp)}</p></div>
              <p className="text-2xl font-black text-white">{stats.totalXp} XP</p>
            </div>
            {[{n: "Nichothéos", x: 99999}, {n: "FUTA Dean", x: 15000}, {n: "Akure_Dev", x: 4200}].map((u, i) => (
              <div key={i} className="p-5 bg-slate-900/50 border border-slate-800 rounded-3xl flex justify-between items-center opacity-60">
                <p className="font-bold">{u.n}</p><p className="font-black">{u.x} XP</p>
              </div>
            ))}
          </div>
          <button onClick={() => setGameState('subject_select')} className="w-full mt-10 py-4 font-bold text-slate-500 underline">Back Home</button>
        </div>
      )}
    </div>
  );
}
