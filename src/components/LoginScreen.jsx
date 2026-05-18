import React from 'react';
import { Brain } from 'lucide-react';

export default function LoginScreen({ authError, setAuthError, email, setEmail, password, setPassword, isRegistering, setIsRegistering, handleLogin, setGameState, loginError }) {
  return (
    <div className="w-full max-w-sm space-y-6 text-center animate-in zoom-in duration-300">
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-3xl inline-block mb-4 shadow-[0_0_30px_rgba(59,130,246,0.5)]">
        <Brain className="text-white" size={60} />
      </div>
      <h1 className="text-4xl font-black italic tracking-tighter mb-2">NexusQuiz</h1>
      <p className="text-slate-400 mb-8">Prove your knowledge across the Ordverse.</p>

      {loginError && (
        <p className="text-rose-500 font-bold mb-4">{loginError}</p>
      )}

      <div className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if(setAuthError) setAuthError(""); }}
          className="w-full p-4 bg-slate-800 text-white rounded-2xl outline-none border border-slate-700 focus:border-blue-500 transition-colors"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); if(setAuthError) setAuthError(""); }}
          className="w-full p-4 bg-slate-800 text-white rounded-2xl outline-none border border-slate-700 focus:border-blue-500 transition-colors"
        />

        {authError && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded-xl text-sm mb-4">
            {authError}
            {authError.includes('Email not registered') && (
               <button onClick={() => { setIsRegistering(true); if(setAuthError) setAuthError(''); }} className="block w-full mt-2 py-2 bg-red-500/30 text-white rounded-lg font-bold hover:bg-red-500/50 transition">
                 Create Account
               </button>
            )}
          </div>
        )}
        <button onClick={() => handleLogin('email')} className="w-full p-4 bg-slate-800 text-white border border-slate-700 rounded-2xl font-bold flex items-center justify-center hover:bg-slate-700 transition-colors">
          {isRegistering ? "Sign Up" : "Login"}
        </button>
        <button onClick={() => setGameState('subject_select')} className="w-full p-4 bg-slate-700 text-white rounded-2xl font-bold flex items-center justify-center hover:bg-slate-600 transition-colors">
          Play as Guest
        </button>
        <button onClick={() => setIsRegistering(!isRegistering)} className="w-full p-4 text-slate-400 font-bold hover:text-white transition-colors">
          {isRegistering ? "Already have an account? Login" : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
}
