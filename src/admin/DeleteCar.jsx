import React from 'react';
import { Trash2, AlertTriangle, Search } from 'lucide-react';

const DeleteCar = () => {
  return (
    <div className="animate-in zoom-in-95 duration-300 max-w-2xl">
      <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-3xl relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
          <Trash2 size={160} className="text-red-500" />
        </div>
        
        <div className="relative z-10">
          <div className="size-12 bg-red-500/20 rounded-xl flex items-center justify-center text-red-500 mb-6">
            <AlertTriangle size={24} />
          </div>
          
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white outline-none focus:border-red-500 transition-colors placeholder:text-slate-600" placeholder="Enter Vehicle VIN or System ID..." />
            </div>
            <button className="w-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white font-bold py-4 rounded-2xl border border-red-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-lg shadow-red-500/5">
              <Trash2 size={20}/> Find and Decommission Record
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteCar;