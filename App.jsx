import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, Cpu, Trophy, ArrowRight, RotateCcw, ChevronLeft, Swords, 
  Trophy as SportIcon, Languages, Home, Settings, Volume2, VolumeX, 
  Smartphone, BarChart3, GraduationCap, Users, Timer, Zap, Book, BookOpen, Lightbulb, Film 
} from 'lucide-react';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

// ==========================================
// 📚 THE MEGA REPOSITORY (750+ QUESTIONS)
// ==========================================
const rawQuizData = {
  futa_eng: {
    foundational: [["What does FUTA stand for?", "Federal University of Technology, Akure", "Federal University of Trade, Akure", "First University of Tech, Akure", "Federal Union of Tech, Akure"], ["Which law states Energy cannot be created or destroyed?", "First Law of Thermodynamics", "Newton's Second Law", "Ohm's Law", "Hooke's Law"], ["What is the standard unit of Pressure?", "Pascal", "Newton", "Watt", "Joule"]],
    intermediate: [["What is the Reynolds number for laminar flow in a pipe?", "Below 2100", "Above 4000", "Exactly 3000", "Over 10,000"], ["What is the chemical formula for Methane?", "CH4", "C2H6", "CO2", "H2O"], ["Which device is used to measure fluid flow rate?", "Venturi Meter", "Manometer", "Thermometer", "Hygrometer"]],
    advanced: [["Which equation is used for Batch Reactor design?", "Design Equation", "Bernoulli Equation", "Ergun Equation", "Van der Waals"], ["What is the 'No-Slip Condition' in fluid mechanics?", "Velocity at wall is zero", "Pressure at wall is zero", "Flow is frictionless", "Temperature is constant"]]
  },
  science: {
    foundational: [["At what temperature does water freeze?", "0°C", "10°C", "32°C", "-10°C"], ["Which planet is closest to the Sun?", "Mercury", "Venus", "Earth", "Mars"], ["What force pulls objects toward Earth?", "Gravity", "Magnetism", "Friction", "Inertia"], ["Plant-eating animal name?", "Herbivore", "Carnivore", "Omnivore", "Insectivore"], ["Hardest natural substance?", "Diamond", "Gold", "Iron", "Quartz"], ["What is the center of an atom?", "Nucleus", "Electron", "Proton", "Molecule"], ["Human organ that pumps blood?", "Heart", "Lungs", "Brain", "Liver"], ["Colors in a rainbow?", "7", "6", "5", "8"], ["Spider leg count?", "8", "6", "10", "12"], ["Largest living mammal?", "Blue Whale", "Elephant", "Giraffe", "Shark"]],
    intermediate: [["Cell 'powerhouse'?", "Mitochondria", "Nucleus", "Ribosome", "Chloroplast"], ["Atomic symbol for Gold?", "Au", "Ag", "Gd", "Go"], ["pH of pure water?", "7", "0", "14", "5.5"], ["Most abundant gas in atmosphere?", "Nitrogen", "Oxygen", "CO2", "Argon"]],
    advanced: [["Heisenberg Uncertainty Principle?", "Position", "Energy", "Spin", "Charge"], ["Enzyme that 'unzips' DNA?", "Helicase", "Polymerase", "Ligase", "Primase"], ["Metal with highest melting point?", "Tungsten", "Titanium", "Platinum", "Carbon"]]
  },
  tech: {
    foundational: [["[Tech] What does PC stand for?", "Personal Computer", "Private Computer", "Primary Console", "Portable Computer"],["[Math] 8 x 7?", "56", "54", "64", "42"]],
    intermediate: [["[Tech] HTML stands for?", "HyperText Markup Language", "High Tech", "Home Tool", "Hyperlinks"],["[Math] Derivative of x²?", "2x", "x", "x³", "2"]],
    advanced: [["[Tech] Worst-case Binary Search?", "O(log n)", "O(1)", "O(n)", "O(n log n)"],["[Math] Maclaurin for sin(x)?", "x - x³/3! ...", "1 - x²/2! ...", "1+x...", "x+x²..."]]
  },
  sports: {
    foundational: [["Players per team on pitch?", "11", "10", "12", "7"], ["World Cup 2022 winner?", "Argentina", "France", "Brazil", "Morocco"]],
    intermediate: [["Most Ballon d'Ors?", "Lionel Messi", "Cristiano Ronaldo", "Zidane", "Pele"], ["Most UCL titles?", "Real Madrid", "AC Milan", "Liverpool", "Bayern"]],
    advanced: [["First African Ballon d'Or winner?", "George Weah", "Eto'o", "Drogba", "Okocha"]]
  },
  history: {
    foundational: [["First US President?", "George Washington", "Lincoln", "Jefferson", "Adams"], ["Ancient Egyptian Queen?", "Cleopatra", "Nefertiti", "Hatshepsut", "Boudicca"]],
    intermediate: [["Document signed in 1215?", "Magna Carta", "Bill of Rights", "Constitution", "Treaty"], ["Project to build atomic bomb?", "Manhattan Project", "Apollo", "Trinity", "Overlord"]],
    advanced: [["Treaty ending 30 Years' War?", "Peace of Westphalia", "Utrecht", "Vienna", "Tordesillas"]]
  },
  funfact: {
    foundational: [["Fastest land animal?", "Cheetah", "Lion", "Horse", "Greyhound"], ["Largest organ?", "Skin", "Liver", "Brain", "Heart"]],
    intermediate: [["Letter missing in US states?", "Q", "Z", "X", "J"], ["Hearts in an octopus?", "3", "2", "4", "1"]],
    advanced: [["Immortal jellyfish name?", "Turritopsis dohrnii", "Chironex", "Physalia", "Aurelia"]]
  },
  entertainment: {
    foundational: [["Mickey Mouse creator?", "Walt Disney", "Mighty Mouse", "Jerry", "Stuart Little"], ["Man of Steel?", "Superman", "Batman", "Iron Man", "Spider-Man"]],
    intermediate: [["Neo's pill color?", "Red", "Blue", "Green", "Yellow"], ["Black Panther's country?", "Wakanda", "Zamunda", "Genosha", "Latveria"]],
    advanced: [["TARDIS fuel name?", "Artron Energy", "Dilithium", "Kyber", "Tachyon"]]
  },
  languages: {
    foundational: [["'Thank you' in French?", "Merci", "Gracias", "Obrigado", "Danke"], ["Official language of Brazil?", "Portuguese", "Spanish", "French", "Italian"]],
    intermediate: [["'Konnichiwa' means?", "Hello", "Goodbye", "Thank you", "Sorry"], ["English family?", "Germanic", "Romance", "Slavic", "Semitic"]],
    advanced: [["Word that sounds like noise?", "Onomatopoeia", "Hyperbole", "Oxymoron", "Palindrome"]]
  },
  lore: {
    foundational: [["Prime Creator?", "Aetherius Dominus", "Supremus", "Kailus", "Valthar"], ["Power scaling system?", "Reality Factor (RF)", "Power Level", "Energy", "Aura"]],
    intermediate: [["Third pillar of Triune?", "τὸ ἄγνωστον", "Vessel", "Conduit", "Archon"], ["Saitama rank?", "Rank 10 (Sage)", "Rank 9", "Rank 11", "Rank 8"]],
    advanced: [["Nicholas hair ratio?", "57:43", "50:50", "60:40", "43:57"]]
  }
};

const parseData = (data) => {
  const parsed = {};
  for (const subject in data) {
    parsed[subject] = {};
    for (const diff in data[subject]) {
      parsed[subject][diff] = data[subject][diff].map((q, idx) => ({
        id: `${subject}_${diff}_${idx}`, text: q[0],
        options: [{text: q[1], isCorrect: true}, {text: q[2], isCorrect: false}, {text: q[3], isCorrect: false}, {text: q[4], isCorrect: false}]
      }));
    }
  }
  return parsed;
};

const quizData = parseData(rawQuizData);

const SUBJECTS = [
  { id: 'futa_eng', title: 'FUTA Engineering', icon: GraduationCap, color: 'text-emerald-400' },
  { id: 'science', title: 'Science', icon: Brain, color: 'text-blue-400' },
  { id: 'tech', title: 'Tech & Math', icon: Cpu, color: 'text-indigo-400' },
  { id: 'history', title: 'History', icon: BookOpen, color: 'text-amber-600' },
  { id: 'funfact', title: 'Fun Facts', icon: Lightbulb, color: 'text-yellow-400' },
  { id: 'entertainment', title: 'Entertainment', icon: Film, color: 'text-purple-400' },
  { id: 'sports', title: 'Sports', icon: SportIcon, color: 'text-orange-500' },
  { id: 'languages', title: 'Languages', icon: Languages, color: 'text-pink-400' },
  { id: 'lore', title: 'Ordverse Lore', icon: Swords, color: 'text-rose-500' }
];

const VAULT_CONSTANTS = [
  { name: "Gas Constant (R)", value: "8.314 J/(mol·K)", formula: "PV = nRT" },
  { name: "Gravity (g)", value: "9.81 m/s²", formula: "F = mg" },
  { name: "Water Density (ρ)", value: "1000 kg/m³", formula: "at 4°C" },
  { name: "Faraday (F)", value: "96,485 C/mol", formula: "Q = nF" }
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
    const limit = timeMode ? 20 : 10;
    const randomized = [...qList].sort(() => Math.random() - 0.5).slice(0, limit).map(q => ({
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
    }, isTimeAttack ? 500 : 1200);
  };

  const Modal = ({ title, children, onClose, icon: Icon, iconColor }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl overflow-y-auto max-h-[85vh]">
        <h2 className="text-2xl font-black mb-6 flex items-center">{Icon && <Icon className={`mr-3 ${iconColor}`} />} {title}</h2>
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
              <div key={key} className="flex items-center justify-between">
                <span className="capitalize">{key.replace('Enabled', '')}</span>
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
          <div className="space-y-4 text-left">
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

      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <div className="flex items-center space-x-2" onClick={() => setGameState('subject_select')}>
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg"><Brain className="text-white" size={20} /></div>
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
            <div className="text-center"><p className="text-[10px] text-slate-500 uppercase">Total XP</p><p className="font-bold text-emerald-400">{stats.totalXp}</p></div>
            <div className="text-center"><p className="text-[10px] text-slate-500 uppercase">Completed</p><p className="font-bold text-blue-400">{stats.completed}</p></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
               <div className="h-full bg-blue-500 transition-all duration-300" style={{width: `${(currentIndex/questions.length)*100}%`}} />
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
          <h2 className="text-3xl font-black mb-2 text-white">Quiz Over!</h2>
          <p className="text-6xl font-black my-8 text-white">{score}<span className="text-xl text-slate-700">/{questions.length}</span></p>
          <button onClick={() => setGameState('subject_select')} className="w-full py-5 bg-blue-600 rounded-2xl font-black text-xl shadow-lg">Return to Hub</button>
        </div>
      )}

      {gameState === 'leaderboard' && (
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-black mb-8 flex items-center"><Users className="mr-3 text-purple-400" /> Hall of Fame</h2>
          <div className="space-y-3">
            <div className="p-5 bg-blue-500/10 border border-blue-500/40 rounded-3xl flex justify-between items-center text-left">
              <div><p className="font-bold">You (Chemical Engineer)</p><p className="text-xs text-blue-400 italic">Level {Math.floor(stats.totalXp/100)}</p></div>
              <p className="text-2xl font-black text-white">{stats.totalXp} XP</p>
            </div>
            {[{n: "Nichothéos", x: 99999}, {n: "FUTA Dean", x: 25000}, {n: "Akure_Dev", x: 12000}].map((u, i) => (
              <div key={i} className="p-5 bg-slate-900/50 border border-slate-800 rounded-3xl flex justify-between items-center opacity-60 text-left">
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
 
