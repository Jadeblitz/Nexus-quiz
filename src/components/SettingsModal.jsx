import React, { useState } from 'react';
import { Settings, LogOut, Cloud, Loader2 } from 'lucide-react';
import Modal from './Modal.jsx';
import { getRank } from '../context/GameContext.jsx';

const SettingsModal = ({
  settings,
  setSettings,
  user,
  stats,
  manualSyncToCloud,
  handleLogout,
  setShowSettings,
  NEXUS_SETTINGS_KEY
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  return (
    <Modal title="Settings" onClose={() => setShowSettings(false)} icon={Settings} iconColor="text-blue-400">
      <div className="space-y-6">
        {['musicEnabled', 'sfxEnabled', 'hapticsEnabled'].map((key) => (
          <div key={key} className="flex items-center justify-between">
            <span className="capitalize">{key.replace('Enabled', '')}</span>
            <button onClick={() => {
              const ns = {...settings, [key]: !settings[key]};
              setSettings(ns);
              localStorage.setItem(NEXUS_SETTINGS_KEY, JSON.stringify(ns));
            }} className={`w-12 h-6 rounded-full ${settings[key] ? 'bg-blue-500' : 'bg-slate-700'}`}>
              <div className={`w-4 h-4 bg-white rounded-full transition-all ${settings[key] ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
        ))}

        <div className="pt-6 mt-6 border-t border-slate-800">
          <button
            onClick={async () => {
              setIsSyncing(true);
              setSyncMessage('');
              const success = await manualSyncToCloud();
              if (success) {
                const rankData = getRank(stats.totalXp, user?.isAdmin);
                setSyncMessage(`Sync Successful. Your Rank ${rankData.level} status is now secure.`);
              } else {
                setSyncMessage('Local progress is not newer than cloud, or sync failed.');
              }
              setIsSyncing(false);
              setTimeout(() => setSyncMessage(''), 4000);
            }}
            disabled={!user || isSyncing}
            title={!user ? "Login required to sync to cloud." : ""}
            className={`w-full py-4 mb-4 rounded-xl font-bold flex items-center justify-center transition-colors border ${
              !user
                ? 'bg-slate-800/50 text-slate-500 border-slate-700 cursor-not-allowed'
                : 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/30'
            }`}
          >
            {isSyncing ? <Loader2 className="mr-2 animate-spin" size={20} /> : <Cloud className="mr-2" size={20} />}
            {isSyncing ? 'Syncing...' : 'Sync Progress to Cloud'}
          </button>
          {syncMessage && (
            <p className={`text-sm text-center mb-4 ${syncMessage.includes('Successful') ? 'text-emerald-400' : 'text-rose-400'}`}>
              {syncMessage}
            </p>
          )}

          <button
            onClick={() => {
              setShowSettings(false);
              handleLogout();
            }}
            className="w-full py-4 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 rounded-xl font-bold flex items-center justify-center transition-colors border border-rose-500/30"
          >
            <LogOut className="mr-2" size={20} />
            Log Out
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;
