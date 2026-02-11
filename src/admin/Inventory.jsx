import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { 
  Plus, Search, Info, Fuel, Car, 
  ChevronLeft, ChevronRight, Loader2, X,
  Zap, Gauge, Settings, Shield, Activity, 
  Disc, Map, Landmark
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 1. Car Details Modal (Technical Data & Slider)
const CarDetailsModal = memo(({ car, onClose }) => {
  if (!car) return null;

  const allImages = [
    car.mainImg, 
    car.intImg, 
    car.frontImg, 
    car.rearImg, 
    ...(car.images || [])
  ].filter(Boolean);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-[#16252d] w-full max-w-[450px] rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-white z-20 bg-black/20 backdrop-blur-md p-2 rounded-full transition-colors">
          <X size={20} />
        </button>

        <div className="w-full h-64 bg-[#101c22] shrink-0 relative">
          <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar h-full">
            {allImages.length > 0 ? (
              allImages.map((img, idx) => (
                <div key={idx} className="min-w-full h-full snap-center flex items-center justify-center">
                  <img src={img} alt={`view-${idx}`} className="w-full h-full object-cover" />
                </div>
              ))
            ) : (
              <div className="w-full h-full flex items-center justify-center opacity-20"><Car size={60} /></div>
            )}
          </div>
          {/* <div className="absolute bottom-4 right-6 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-white font-bold tracking-widest border border-white/10">
            {allImages.length} VIEWS • SWIPE
          </div> */}
        </div>

        <div className="p-8 overflow-y-auto no-scrollbar bg-gradient-to-b from-[#16252d] to-[#101c22]">
          <div className="mb-6">
            <span className="text-[10px] font-black text-[#0da6f2] uppercase tracking-[0.3em] mb-1 block">{car.brand}</span>
            <h2 className="text-3xl font-bold text-white tracking-tight">{car.Name}</h2>
          </div>

          <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
            <MarkBadge label="Speed" val={car.speed_mark} color="text-orange-400" />
            <MarkBadge label="Comfort" val={car.comfort_mark} color="text-blue-400" />
            <MarkBadge label="Safety" val={car.safety_mark} color="text-green-400" />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8">
            <SpecBox icon={<Settings size={14} />} label="Engine" value={car.Engine} />
            <SpecBox icon={<Zap size={14} />} label="Horsepower" value={car.Horsepower} />
            <SpecBox icon={<Activity size={14} />} label="Torque" value={car.MaxEngineTorque} />
            <SpecBox icon={<Gauge size={14} />} label="Top Speed" value={car.Speed} />
            <SpecBox icon={<Landmark size={14} />} label="0-60 MPH" value={car.mph} />
            <SpecBox icon={<Fuel size={14} />} label="Fuel" value={car.FuelType} />
            <SpecBox icon={<Map size={14} />} label="Drivetrain" value={car.Drivetrain} />
            <SpecBox icon={<Disc size={14} />} label="Front Brakes" value={car.FrontBrakes} />
            <SpecBox icon={<Disc size={14} />} label="Rear Brakes" value={car.RearBrakes} />
            <SpecBox icon={<Shield size={14} />} label="Transmission" value={car.Transmission} />
          </div>

          <div className="pt-6 border-t border-white/5 flex items-center justify-between">
            <div>
               <span className="text-[9px] uppercase text-slate-500 font-bold tracking-widest">Price Point</span>
               <div className="text-2xl font-black text-[#0da6f2]">₹{car.price}</div>
            </div>
            {car.knowMore && (
                <a href={car.knowMore} target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold hover:bg-white/10 transition-all">
                    External Info
                </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

const MarkBadge = ({ label, val, color }) => (
  <div className="bg-white/5 border border-white/5 px-4 py-2 rounded-2xl shrink-0">
    <div className={`text-lg font-black ${color}`}>{val}/10</div>
    <div className="text-[8px] uppercase font-bold text-slate-500 tracking-tighter">{label}</div>
  </div>
);

const SpecBox = ({ icon, label, value }) => (
  <div className="bg-[#101c22]/50 p-3 rounded-2xl border border-white/5">
    <div className="flex items-center gap-2 text-slate-500 mb-1">
      {icon}
      <span className="text-[8px] uppercase font-bold tracking-widest truncate">{label}</span>
    </div>
    <span className="text-[11px] text-slate-200 font-semibold truncate block">{value || "—"}</span>
  </div>
);

// 2. Memoized CarRow (Precision Alignment)
const CarRow = memo(({ car, onInfoClick }) => {
  const [imgError, setImgError] = useState(false);
  const displayImage = car.mainImg || (car.images && car.images[0]);

  return (
    <div className="bg-[#16252d] p-4 rounded-2xl border border-white/5 flex items-center transition-all mb-3 group hover:border-[#0da6f2]/30">
      {/* Col 1: View (Image) */}
      <div className="w-[15%] flex justify-start">
        <div className="size-11 md:size-14 rounded-xl bg-[#101c22] border border-white/5 overflow-hidden flex items-center justify-center shadow-inner">
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

      {/* Col 2: Model Details */}
      <div className="w-[35%] px-2">
        <h4 className="font-bold text-white text-[13px] md:text-xl truncate">{car.Name}</h4>
      </div>

      {/* Col 3: Brand */}
      <div className="w-[20%] flex justify-center">
        <span className="bg-white/5 px-4 py-1.5 rounded-lg border border-white/5 text-slate-400 text-[11px] font-bold tracking-wide uppercase">
          {car.brand}
        </span>
      </div>

      {/* Col 4: Fuel Profile */}
      <div className="w-[20%] flex items-center justify-center gap-2 text-[#0da6f2]/80">
        <Fuel size={14} />
        <span className="text-xs font-semibold capitalize">{car.FuelType || 'N/A'}</span>
      </div>

      {/* Col 5: Actions */}
      <div className="w-[10%] flex justify-end">
        <button 
          onClick={() => onInfoClick(car)} 
          className="p-2.5 rounded-xl bg-[#0da6f2]/5 text-[#0da6f2] hover:bg-[#0da6f2] hover:text-white transition-all active:scale-95 shadow-lg shadow-black/20"
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
  const [selectedCar, setSelectedCar] = useState(null);
  
  const itemsPerPage = 6; 
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchCars = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_backendapi}/fetch_all_car`);
        const result = await response.json();
        if (isMounted && result["data :- "]) setAllCars(result["data :- "]);
      } catch (err) { console.error(err); } 
      finally { if (isMounted) setLoading(false); }
    };
    fetchCars();
    return () => { isMounted = false; };
  }, []);

  const filteredCars = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return query ? allCars.filter(c => c.Name?.toLowerCase().includes(query) || c.brand?.toLowerCase().includes(query)) : allCars;
  }, [allCars, searchQuery]);

  const { currentCars, totalPages } = useMemo(() => {
    const total = Math.ceil(filteredCars.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    return { currentCars: filteredCars.slice(start, start + itemsPerPage), totalPages: total || 1 };
  }, [filteredCars, currentPage]);

  const handleInfoClick = useCallback((car) => setSelectedCar(car), []);
  const closeModal = useCallback(() => setSelectedCar(null), []);

  if (loading) return <div className="h-[70vh] flex items-center justify-center text-[#0da6f2]"><Loader2 className="animate-spin" size={40} /></div>;

  return (
    <div className="flex flex-col animate-in fade-in duration-500 relative min-h-screen">
      <CarDetailsModal car={selectedCar} onClose={closeModal} />

      {/* Header Search & Add */}
      <div className="flex items-center justify-between gap-4 mb-10">
        <div className="relative flex-1 md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search inventory..." 
            className="w-full bg-[#16252d] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-[#0da6f2]/40 transition-all placeholder:text-slate-600 shadow-inner" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
        <button onClick={() => navigate('/admin/add-car')} className="flex items-center gap-2 bg-[#0da6f2] text-white px-6 py-3.5 rounded-2xl font-bold active:scale-95 transition-all shadow-xl shadow-[#0da6f2]/20 hover:brightness-110">
          <Plus size={18} /> 
          <span className="hidden sm:inline">Add Vehicle</span>
        </button>
      </div>

      {/* COLUMN HEADINGS (Aligned with Row Data) */}
      <div className="flex items-center px-4 mb-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] opacity-50">
        <span className="w-[15%]">View</span>
        <span className="w-[35%]">Model Details</span>
        <span className="w-[20%] text-center">Brand</span>
        <span className="w-[20%] text-center">Fuel Profile</span>
        <span className="w-[10%] text-right">Actions</span>
      </div>

      {/* List container */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        {currentCars.length > 0 ? (
          currentCars.map(car => (
            <CarRow key={car._id} car={car} onInfoClick={handleInfoClick} />
          ))
        ) : (
          <div className="py-20 text-center opacity-30 text-white">
            <Car size={48} className="mx-auto mb-4" />
            <p className="text-sm">No vehicles match your criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {filteredCars.length > itemsPerPage && (
        <div className="py-8 flex items-center justify-center gap-4 mt-auto">
          <button 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(p => p - 1)} 
            className="p-2.5 rounded-xl bg-[#16252d] text-slate-400 disabled:opacity-20 transition-all border border-white/5 hover:border-[#0da6f2]/40"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex items-center gap-2">
             <span className="text-[10px] font-bold text-[#0da6f2] bg-[#0da6f2]/10 px-5 py-2.5 rounded-xl border border-[#0da6f2]/20 tracking-widest">
                PAGE {currentPage} OF {totalPages}
              </span>
          </div>

          <button 
            disabled={currentPage >= totalPages} 
            onClick={() => setCurrentPage(p => p + 1)} 
            className="p-2.5 rounded-lg bg-[#16252d] text-slate-400 disabled:opacity-20 transition-all border border-white/5 hover:border-[#0da6f2]/40"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Inventory;