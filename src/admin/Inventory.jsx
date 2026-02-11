import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { 
  Plus, Search, Info, Fuel, Car, 
  ChevronLeft, ChevronRight, Loader2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 1. Memoized CarRow: Prevents rows from re-rendering when searching/paginating 
// unless their specific car data changes.
const CarRow = memo(({ car, onInfoClick }) => {
  const [imgError, setImgError] = useState(false);
  const displayImage = car.images?.[0];

  return (
    <div className="bg-[#16252d] p-4 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-[#0da6f2]/30 transition-all mb-3 shadow-sm">
      <div className="w-[20%] md:w-[10%] flex items-center">
        <div className="size-12 md:size-14 rounded-xl bg-[#101c22] border border-white/5 overflow-hidden flex items-center justify-center shadow-inner">
          {displayImage && !imgError ? (
            <img 
              src={displayImage} 
              alt="" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <Car size={20} className="text-white opacity-40" />
          )}
        </div>
      </div>

      <div className="flex-1 md:w-[25%] flex flex-col justify-center px-4">
        <h4 className="font-bold text-white text-sm truncate ml-7">{car.Name}</h4>
      </div>

      <div className="hidden md:flex items-center w-[22%] text-slate-400 text-xs font-semibold">
        <span className="bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
            {car.brand}
        </span>
      </div>

      <div className="hidden lg:flex items-center gap-2 w-[33.5%] text-[#0da6f2] opacity-80">
        <Fuel size={16} />
        <span className="text-xs font-medium capitalize">{car.FuelType || 'N/A'}</span>
      </div>

      <div className="w-fit flex items-center justify-end">
        <button 
          onClick={() => onInfoClick(car)} 
          className="p-2.5 rounded-xl bg-[#0da6f2]/5 text-[#0da6f2] hover:bg-[#0da6f2] hover:text-white transition-all shadow-lg active:scale-95"
        >
          <Info size={18} />
        </button>
      </div>
    </div>
  );
});

const Inventory = () => {
  const [allCars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 
  const navigate = useNavigate();

  // 2. Optimized Fetch with Cleanup
  useEffect(() => {
    let isMounted = true;
    const fetchCars = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_backendapi}/fetch_all_car`);
        const result = await response.json();
        
        if (isMounted && result["data :- "]) {
          setAllCars(result["data :- "]);
        }
      } catch (err) {
        console.error("Error fetching from API:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchCars();
    return () => { isMounted = false; };
  }, []);

  // 3. Memoized Search Logic: Only runs when searchQuery or allCars changes
  const filteredCars = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return allCars;
    return allCars.filter(car => 
      car.Name?.toLowerCase().includes(query) ||
      car.brand?.toLowerCase().includes(query)
    );
  }, [allCars, searchQuery]);

  // 4. Memoized Pagination Logic
  const { currentCars, totalPages } = useMemo(() => {
    const total = Math.ceil(filteredCars.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    return {
      currentCars: filteredCars.slice(start, start + itemsPerPage),
      totalPages: total || 1
    };
  }, [filteredCars, currentPage]);

  // Reset to page 1 on search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // 5. Memoized Callbacks
  const handleInfoClick = useCallback((car) => {
    navigate(`/detail`, { state: { car } });
  }, [navigate]);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  if (loading) return (
    <div className="h-[70vh] flex items-center justify-center text-[#0da6f2]">
      <Loader2 className="animate-spin" size={40} />
    </div>
  );

  return (
    <div className="flex flex-col animate-in fade-in duration-500 relative min-h-[600px]">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text"
            placeholder="Search inventory..."
            className="w-full bg-[#16252d] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#0da6f2]/40 transition-all"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        
        <button 
          onClick={() => navigate('/admin/add-car')}
          className="hidden md:flex items-center gap-2 bg-[#0da6f2] hover:bg-[#0da6f2]/90 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-[#0da6f2]/10 active:scale-95 whitespace-nowrap"
        >
          <Plus size={18} />
          Add Vehicle
        </button>
      </div>

      {/* Row Titles */}
      {filteredCars.length > 0 && (
        <div className="hidden md:flex items-center justify-between px-6 mb-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] opacity-60">
          <span className="w-[10%]">Image</span>
          <span className="w-[25%] px-4 text-center">Model Name</span>
          <span className="w-[20%]">Manufacturer</span>
          <span className="hidden lg:block w-[20%]">Fuel Type</span>
          <span className="w-[15%] text-right">Details</span>
        </div>
      )}

      {/* List */}
      <div className="flex-1">
        {currentCars.length > 0 ? (
          currentCars.map((car) => (
            <CarRow 
              key={car._id} 
              car={car} 
              onInfoClick={handleInfoClick} 
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 opacity-30">
            <Car size={48} className="mb-4" />
            <p className="text-white text-sm font-medium">No vehicles found in stock.</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {filteredCars.length > itemsPerPage && (
        <div className="py-8 flex items-center justify-center gap-3 mt-auto">
          <button 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="p-2 rounded-lg bg-[#16252d] text-slate-400 disabled:opacity-20 hover:text-[#0da6f2] transition-colors border border-white/5"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex items-center gap-2">
             <span className="text-[10px] font-bold text-[#0da6f2] tracking-widest uppercase bg-[#0da6f2]/5 px-4 py-2 rounded-lg border border-[#0da6f2]/10">
                Page {currentPage} / {totalPages}
              </span>
          </div>

          <button 
            disabled={currentPage >= totalPages} 
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="p-2 rounded-lg bg-[#16252d] text-slate-400 disabled:opacity-20 hover:text-[#0da6f2] transition-colors border border-white/5"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Inventory;