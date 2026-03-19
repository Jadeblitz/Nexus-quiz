// Add 'Book' to your Lucide imports at the top
import { Brain, Cpu, Trophy, ArrowRight, RotateCcw, CheckCircle2, XCircle, ChevronLeft, Swords, BookOpen, Lightbulb, Film, Trophy as SportIcon, Languages, Home, Settings, Volume2, VolumeX, Smartphone, BarChart3, GraduationCap, Users, Timer, Zap, Book } from 'lucide-react';

// ... [Inside your App component, add this new state]
const [showVault, setShowVault] = useState(false);

const engineeringConstants = [
  { name: "Universal Gas Constant (R)", value: "8.314 J/(mol·K)", formula: "PV = nRT" },
  { name: "Acceleration due to Gravity (g)", value: "9.81 m/s²", formula: "F = mg" },
  { name: "Density of Water (ρ)", value: "1000 kg/m³", formula: "at 4°C" },
  { name: "Boltzmann Constant (k)", value: "1.38 x 10⁻²³ J/K", formula: "S = k ln W" },
  { name: "Faraday's Constant (F)", value: "96,485 C/mol", formula: "Q = nF" },
  { name: "Standard Atmospheric Pressure", value: "101,325 Pa", formula: "1 atm" }
];

// ... [Add this renderer function before your return]
const renderVault = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-xl">
    <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black flex items-center"><Book className="mr-2 text-emerald-400"/> Engineering Vault</h2>
        <button onClick={() => setShowVault(false)} className="text-slate-500 font-bold">X</button>
      </div>
      <div className="space-y-4">
        {engineeringConstants.map((c, i) => (
          <div key={i} className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
            <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest mb-1">{c.name}</p>
            <p className="text-xl font-black text-white">{c.value}</p>
            <p className="text-sm text-slate-500 mt-2 italic">{c.formula}</p>
          </div>
        ))}
      </div>
      <button onClick={() => setShowVault(false)} className="w-full mt-6 py-4 bg-slate-800 rounded-xl font-bold">Back to App</button>
    </div>
  </div>
);

// ... [In your return() / Header section, add the Vault button next to Settings]
<button onClick={() => setShowVault(true)} className="p-2 bg-slate-900 rounded-xl border border-slate-800">
  <Book size={20} className="text-emerald-400" />
</button>

// ... [Add the conditional renderer inside your main div]
{showVault && renderVault()}
