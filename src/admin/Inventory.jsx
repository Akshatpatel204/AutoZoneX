import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Info, Fuel, Car, 
  ChevronLeft, ChevronRight, Loader2, 
  Hash 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CarRow = ({ car, onInfoClick }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-[#16252d] p-4 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-[#0da6f2]/30 transition-all mb-3 shadow-sm">
      
      {/* 1st Column: Main Image */}
      <div className="w-[20%] md:w-[10%] flex items-center">
        <div className="size-12 md:size-14 rounded-xl bg-[#101c22] border border-white/5 overflow-hidden flex items-center justify-center shadow-inner">
          {car.image && !imgError ? (
            <img 
              src={car.image} 
              alt="car" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              onError={() => setImgError(true)}
            />
          ) : (
            <Car size={20} className="text-white opacity-40" />
          )}
        </div>
      </div>

      {/* 2nd Column: Name */}
      <div className="flex-1 md:w-[25%] flex flex-col justify-center px-4">
        <h4 className="font-bold text-white text-sm truncate">{car.name}</h4>
        <div className="flex items-center gap-1.5 text-slate-500 text-[9px] font-medium uppercase tracking-tighter">
            <Hash size={10} /> {car._id?.slice(-8)}
        </div>
      </div>

      {/* 3rd Column: Brand (Hidden on Mobile) */}
      <div className="hidden md:flex items-center w-[20%] text-slate-400 text-xs font-semibold">
        <span className="bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
            {car.brand}
        </span>
      </div>

      {/* 4th Column: Fuel (Hidden on Mobile) */}
      <div className="hidden lg:flex items-center gap-2 w-[20%] text-[#0da6f2] opacity-80">
        <Fuel size={16} />
        <span className="text-xs font-medium capitalize">{car.fuelType || 'Petrol'}</span>
      </div>

      {/* 5th Column: Info Button */}
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
};

const Inventory = () => {
  const [allCars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        // Using the remembered backend API environment variable
        const response = await fetch(`${import.meta.env.VITE_backendapi}/fetch_all_car`);
        const result = await response.json();
        
        // Accessing data based on your server-side "data :- " key
        if (result["data :- "]) {
          setAllCars(result["data :- "]);
        }
      } catch (err) {
        console.error("Error fetching from API:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const filteredCars = allCars.filter(car => 
    car.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    car.brand?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const currentCars = filteredCars.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  if (loading) return (
    <div className="h-[80vh] flex items-center justify-center text-[#0da6f2]">
      <Loader2 className="animate-spin" size={40} />
    </div>
  );

  return (
    <div className="h-screen flex flex-col p-4 md:p-6 animate-in fade-in duration-500 relative">
      
      {/* Header section with dynamic layout */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text"
            placeholder="Search inventory..."
            className="w-full bg-[#16252d] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-[#0da6f2]/40 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

      {/* Table headers (Hidden on mobile) */}
      <div className="hidden md:flex items-center justify-between px-6 mb-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] opacity-60">
        <span className="w-[10%]">Image</span>
        <span className="w-[25%] px-4">Model Name</span>
        <span className="w-[20%]">Manufacturer</span>
        <span className="hidden lg:block w-[20%]">Fuel Type</span>
        <span className="w-[15%] text-right">Details</span>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {currentCars.length > 0 ? (
          currentCars.map((car) => (
            <CarRow 
              key={car._id} 
              car={car} 
              onInfoClick={(c) => navigate(`/detail`, { state: { car: c } })} 
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
      <div className="py-6 flex items-center justify-center gap-3">
        <button 
          disabled={currentPage === 1} 
          onClick={() => setCurrentPage(prev => prev - 1)}
          className="p-2 rounded-lg bg-[#16252d] text-slate-400 disabled:opacity-20 hover:text-[#0da6f2] transition-colors border border-white/5"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase bg-[#16252d] px-4 py-2 rounded-lg border border-white/5">
          Page {currentPage} / {totalPages || 1}
        </span>
        <button 
          disabled={currentPage >= totalPages} 
          onClick={() => setCurrentPage(prev => prev + 1)}
          className="p-2 rounded-lg bg-[#16252d] text-slate-400 disabled:opacity-20 hover:text-[#0da6f2] transition-colors border border-white/5"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Inventory;