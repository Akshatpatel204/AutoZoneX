import React from 'react';
import { Search, Filter, Edit, Trash2, Eye } from 'lucide-react';

const Inventory = () => {
  const cars = [
    { id: "V-101", model: "Porsche 911 GT3", brand: "Porsche", type: "Petrol", status: "Available" },
    { id: "V-102", model: "Tesla Model S", brand: "Tesla", type: "EV", status: "Auctioning" },
    { id: "V-103", model: "BMW M4 Comp", brand: "BMW", type: "Petrol", status: "Sold" },
  ];

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 mb-8">
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input className="bg-[#16252d] border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:border-[#0da6f2]" placeholder="Search ID..." />
          </div>
          <button className="bg-[#16252d] p-2 rounded-xl border border-white/5 text-slate-400 hover:text-white transition-colors">
            <Filter size={20}/>
          </button>
        </div>
      </div>

      <div className="bg-[#16252d] border border-white/5 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-slate-400">
            <tr>
              <th className="px-6 py-4">Vehicle ID</th>
              <th className="px-6 py-4">Model & Brand</th>
              <th className="px-6 py-4">Fuel Type</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {cars.map((car) => (
              <tr key={car.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4 font-mono text-sm text-[#0da6f2]">{car.id}</td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-white">{car.model}</p>
                  <p className="text-xs text-slate-500">{car.brand}</p>
                </td>
                <td className="px-6 py-4 text-sm text-slate-300">{car.type}</td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${car.status === 'Available' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    {car.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-white/5 rounded-lg text-[#0da6f2]"><Eye size={16}/></button>
                    <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400"><Edit size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;