import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Trash2, Car, ChevronLeft, ChevronRight, 
  Loader2, AlertTriangle, ShieldAlert 
} from 'lucide-react';
import axios from 'axios';

// 1. High-Fidelity Delete Confirmation Modal
const DeleteConfirmModal = ({ car, onClose, onDelete, loading }) => {
  if (!car) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-[#16252d] w-full max-w-[400px] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden relative">
        
        {/* Warning Icon Header */}
        <div className="flex justify-center pt-10 pb-6">
          <div className="size-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 animate-pulse">
            <AlertTriangle size={40} />
          </div>
        </div>

        {/* Modal Content */}
        <div className="px-8 pb-10 text-center">
          <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">Delete Vehicle?</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Are you sure you want to remove <span className="text-white font-semibold">{car.Name}</span> from the registry? 
            This action is irreversible and all historical data will be archived.
          </p>

          <div className="space-y-3">
            <button 
              onClick={() => onDelete(car._id)}
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-black py-4 rounded-2xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Confirm Delete"}
            </button>
            
            <button 
              onClick={onClose}
              disabled={loading}
              className="w-full bg-white/5 hover:bg-white/10 text-slate-300 font-bold py-4 rounded-2xl transition-all active:scale-95"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Security Footer */}
        <div className="bg-black/20 py-3 flex items-center justify-center gap-2 border-t border-white/5">
          <ShieldAlert size={14} className="text-slate-500" />
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Authenticated Session Required</span>
        </div>
      </div>
    </div>
  );
};

// 2. Main DeleteCar Component
const DeleteCar = () => {
  const [allCars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [targetCar, setTargetCar] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const itemsPerPage = 6;

  // Fetch Data
  const fetchCars = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_backendapi}/fetch_all_car`);
      const result = await response.json();
      if (result["data :- "]) setAllCars(result["data :- "]);
    } catch (err) { 
      console.error("Fetch error:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  // Fix for the scroll-freeze issue
  useEffect(() => {
    if (!targetCar) {
      document.body.style.overflow = 'unset';
    } else {
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [targetCar]);

  // Integrated Delete API Logic
  const handleDelete = async (id) => {
    setIsDeleting(true);
    try {
      const response = await axios.delete(`${import.meta.env.VITE_backendapi}/delete_car/${id}`);
      if (response.status === 200) {
        setAllCars(prev => prev.filter(car => car._id !== id));
        setTargetCar(null);
      }
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || "Could not delete vehicle."));
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredCars = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return query ? allCars.filter(c => 
      c.Name?.toLowerCase().includes(query) || 
      c.brand?.toLowerCase().includes(query)
    ) : allCars;
  }, [allCars, searchQuery]);

  const { currentCars, totalPages } = useMemo(() => {
    const total = Math.ceil(filteredCars.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    return { currentCars: filteredCars.slice(start, start + itemsPerPage), totalPages: total || 1 };
  }, [filteredCars, currentPage]);

  if (loading) return (
    <div className="h-[70vh] flex items-center justify-center text-red-500">
      <Loader2 className="animate-spin" size={40} />
    </div>
  );

  return (
    <div className="flex flex-col animate-in fade-in duration-500 relative min-h-screen px-2 md:px-0">
      
      {/* Pop-up Modal */}
      <DeleteConfirmModal 
        car={targetCar} 
        onClose={() => setTargetCar(null)} 
        onDelete={handleDelete}
        loading={isDeleting}
      />

      {/* Header & Full-Width Search Bar */}
      <div className="flex items-center mb-6 md:mb-10 mt-2">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by model or brand to decommission..." 
            className="w-full bg-[#16252d] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-red-500/40 transition-all shadow-inner" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
      </div>

      {/* Table Headers */}
      <div className="flex items-center px-4 mb-4 text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest opacity-50">
        <span className="w-[20%] md:w-[15%]">Preview</span>
        <span className="flex-1 md:w-[35%] px-3">Vehicle Model</span>
        <span className="hidden md:block w-[20%] text-center">Brand</span>
        <span className="w-[15%] md:w-[10%] text-right">Delete</span>
      </div>

      {/* Car List */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {currentCars.length > 0 ? (
          currentCars.map(car => (
            <div key={car._id} className="bg-[#16252d] p-3 md:p-4 rounded-2xl border border-white/5 flex items-center transition-all mb-3 group hover:border-red-500/30">
              <div className="w-[20%] md:w-[15%]">
                <div className="size-11 md:size-14 rounded-xl bg-[#101c22] border border-white/5 overflow-hidden flex items-center justify-center">
                  {car.mainImg ? (
                    <img src={car.mainImg} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <Car size={18} className="text-white opacity-40" />
                  )}
                </div>
              </div>
              <div className="flex-1 px-3">
                <h4 className="font-bold text-white text-sm md:text-xl truncate leading-tight">{car.Name}</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight md:hidden">{car.brand}</p>
              </div>
              <div className="hidden md:flex w-[20%] justify-center">
                <span className="bg-white/5 px-4 py-1.5 rounded-lg border border-white/5 text-slate-400 text-[11px] font-bold uppercase">
                  {car.brand}
                </span>
              </div>
              <div className="w-[15%] md:w-[10%] flex justify-end">
                <button 
                  onClick={() => setTargetCar(car)} 
                  className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-95 shadow-lg shadow-black/20"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-slate-500 font-bold uppercase tracking-widest text-xs opacity-30">
            No records found
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredCars.length > itemsPerPage && (
        <div className="fixed bottom-6 left-0 right-0 flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-3 bg-[#101c22]/90 backdrop-blur-xl p-2 rounded-2xl border border-white/10 shadow-2xl pointer-events-auto">
            <button 
              disabled={currentPage === 1} 
              onClick={() => {
                setCurrentPage(p => p - 1);
                window.scrollTo(0,0);
              }} 
              className="p-2 rounded-xl bg-[#16252d] text-slate-400 disabled:opacity-20 active:bg-red-500/20 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-[10px] font-bold text-red-500 px-2 tracking-widest">
              {currentPage} / {totalPages}
            </span>
            <button 
              disabled={currentPage >= totalPages} 
              onClick={() => {
                setCurrentPage(p => p + 1);
                window.scrollTo(0,0);
              }} 
              className="p-2 rounded-xl bg-[#16252d] text-slate-400 disabled:opacity-20 active:bg-red-500/20 transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteCar;
