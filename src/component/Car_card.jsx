import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const Car_card = ({ car }) => {
  const displayImage = car.images && car.images.length > 0 
    ? car.images[0] 
    : "https://via.placeholder.com/800x600?text=Premium+Vehicle";

  return (
    <div className="group relative h-[450px] w-full rounded-[2.5rem] overflow-hidden border border-white/10 bg-[#0a0a0a] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-pointer">
      
      {/* 1. Background Image Layer (This handles the zoom) */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
        style={{ backgroundImage: `url(${displayImage})` }}
      />

      {/* 2. Overlay Layers */}
      {/* Base Gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-70" />
      
      {/* Blue Tint on Hover (Professional Touch) */}
      <div className="absolute inset-0 bg-[#0da6f2]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* 3. Top Content (Brand) */}
      <div className="absolute top-8 left-8">
        <div className="px-5 py-1.5 bg-black/30 backdrop-blur-xl border border-white/10 rounded-full">
          <span className="text-white text-[10px] font-black uppercase tracking-[0.4em]">
            {car.brand}
          </span>
        </div>
      </div>

      {/* 4. Bottom Content Area */}
      <div className="absolute bottom-0 left-0 right-0 p-10">
        <div className="flex justify-between items-end">
          <div className="flex-1">
            {/* Minimalist Line Decor */}
            <div className="w-12 h-[3px] bg-[#0da6f2] mb-4 transform origin-left transition-transform duration-500 group-hover:scale-x-150" />
            
            <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none mb-2 drop-shadow-lg">
              {car.Name}
            </h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] opacity-0 transform translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
              View Specifications
            </p>
          </div>

          {/* Floating Action Circle */}
          <div className="mb-2 p-5 bg-white text-black rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] transform transition-all duration-500 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-hover:rotate-[360deg]">
            <ArrowUpRight size={24} strokeWidth={3} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Car_card;