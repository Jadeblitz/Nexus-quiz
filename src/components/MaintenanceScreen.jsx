import React from 'react';
import { Brain } from 'lucide-react';

const MaintenanceScreen = ({ message }) => (
  <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6">
    <Brain className="text-blue-500 mb-6" size={80} />
    <h1 className="text-3xl font-black mb-4 text-center">System Maintenance</h1>
    <p className="text-slate-400 text-center max-w-md">{message}</p>
  </div>
);

export default MaintenanceScreen;
