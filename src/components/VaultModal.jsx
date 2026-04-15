import React from 'react';
import { Book } from 'lucide-react';
import Modal from './Modal.jsx';

const VaultModal = ({ VAULT_CONSTANTS, setShowVault }) => (
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
);

export default VaultModal;
