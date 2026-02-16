import React, { useState, useEffect, useMemo, useCallback, memo, useRef } from 'react';
import { 
  Plus, Search, Info, Fuel, Car, 
  ChevronLeft, ChevronRight, Loader2, X,
  Zap, Gauge, Settings, Shield, Activity, 
  Disc, Map, Landmark, Edit3, Save 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 1. Car Details Modal with Edit Warning & Backend Integration
const CarDetailsModal = memo(({ car, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCar, setEditedCar] = useState(null);
  const [saving, setSaving] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const scrollRef = useRef(null);
  const isUserScrolling = useRef(false);

  useEffect(() => {
    if (car) {
      setEditedCar({ ...car });
      setIsEditing(false);
      setCurrentImgIndex(0);
    }
  }, [car]);

  const allImages = useMemo(() => {
    if (!car) return [];
    return [
      car.mainImg, 
      car.intImg, 
      car.frontImg, 
      car.rearImg, 
      ...(car.images || [])
    ].filter(Boolean);
  }, [car]);

  // Check if data has changed
  const hasChanges = useMemo(() => {
    return JSON.stringify(car) !== JSON.stringify(editedCar);
  }, [car, editedCar]);

  // Handle Closing with Warning
  const handleCloseAttempt = () => {
    if (isEditing && hasChanges) {
      const confirmClose = window.confirm("You have unsaved changes. Do you want to discard them and close?");
      if (!confirmClose) return;
    }
    onClose();
  };

  const handleScroll = (e) => {
    if (isUserScrolling.current) {
        const scrollLeft = e.target.scrollLeft;
        const width = e.target.offsetWidth;
        const newIndex = Math.round(scrollLeft / width);
        if (newIndex !== currentImgIndex) setCurrentImgIndex(newIndex);
    }
  };

  useEffect(() => {
    if (!car || allImages.length <= 1 || isEditing) return;
    const interval = setInterval(() => {
      isUserScrolling.current = false;
      setCurrentImgIndex((prev) => (prev + 1) % allImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [car, allImages, isEditing]);

  useEffect(() => {
    if (scrollRef.current && !isUserScrolling.current) {
      const width = scrollRef.current.offsetWidth;
      scrollRef.current.scrollTo({ left: width * currentImgIndex, behavior: 'smooth' });
    }
  }, [currentImgIndex]);

  if (!car || !editedCar) return null;

  const handleInputChange = (field, value) => {
    setEditedCar(prev => ({ ...prev, [field]: value }));
  };

  // API CONNECTED: Matches your backend update_car/:id route
  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await axios.put(`${import.meta.env.VITE_backendapi}/update_car/${car._id}`, editedCar);
      if (response.status === 200) {
        onUpdate(editedCar);
        setIsEditing(false);
        alert("Vehicle updated successfully!");
      }
    } catch (err) {
      console.error("Save Error:", err);
      alert(err.response?.data?.error || "Failed to update vehicle details.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-[#16252d] w-full max-w-[450px] rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* EDIT/SAVE BUTTON */}
        <button 
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          disabled={saving}
          className="absolute top-6 left-6 text-white z-20 bg-[#0da6f2] p-2.5 rounded-full shadow-lg transition-all hover:scale-110 active:scale-95 disabled:opacity-50"
        >
          {saving ? <Loader2 size={20} className="animate-spin" /> : isEditing ? <Save size={20} /> : <Edit3 size={20} />}
        </button>

        {/* CLOSE BUTTON */}
        <button onClick={handleCloseAttempt} className="absolute top-6 right-6 text-slate-400 hover:text-white z-20 bg-black/20 backdrop-blur-md p-2 rounded-full transition-colors">
          <X size={20} />
        </button>

        {/* IMAGE BANNER */}
        <div className="w-full h-64 bg-[#101c22] shrink-0 relative">
          <div 
            ref={scrollRef} 
            onScroll={handleScroll}
            onPointerDown={() => { isUserScrolling.current = true; }}
            className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar h-full touch-pan-x"
          >
            {allImages.map((img, idx) => (
              <div key={idx} className="min-w-full h-full flex items-center justify-center snap-center">
                <img src={img} alt="" className="w-full h-full object-cover select-none" draggable="false" />
              </div>
            ))}
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-none">
            {allImages.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${currentImgIndex === i ? 'w-6 bg-[#0da6f2]' : 'w-2 bg-white/20'}`} />
            ))}
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="p-6 md:p-8 overflow-y-auto no-scrollbar bg-gradient-to-b from-[#16252d] to-[#101c22]">
          <div className="mb-6">
            {isEditing ? (
              <div className="space-y-2">
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-[10px] text-[#0da6f2] uppercase font-black outline-none focus:border-[#0da6f2]"
                  value={editedCar.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                />
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xl font-bold text-white outline-none focus:border-[#0da6f2]"
                  value={editedCar.Name}
                  onChange={(e) => handleInputChange('Name', e.target.value)}
                />
              </div>
            ) : (
              <>
                <span className="text-[10px] font-black text-[#0da6f2] uppercase tracking-[0.3em] mb-1 block">{car.brand}</span>
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{car.Name}</h2>
              </>
            )}
          </div>

          <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
            <MarkBadge label="Speed" val={editedCar.speed_mark} isEditing={isEditing} onChange={(v) => handleInputChange('speed_mark', v)} color="text-orange-400" />
            <MarkBadge label="Comfort" val={editedCar.comfort_mark} isEditing={isEditing} onChange={(v) => handleInputChange('comfort_mark', v)} color="text-blue-400" />
            <MarkBadge label="Safety" val={editedCar.safety_mark} isEditing={isEditing} onChange={(v) => handleInputChange('safety_mark', v)} color="text-green-400" />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8">
            <SpecBox icon={<Settings size={14} />} label="Engine" value={editedCar.Engine} isEditing={isEditing} onChange={(v) => handleInputChange('Engine', v)} />
            <SpecBox icon={<Zap size={14} />} label="Horsepower" value={editedCar.Horsepower} isEditing={isEditing} onChange={(v) => handleInputChange('Horsepower', v)} />
            <SpecBox icon={<Activity size={14} />} label="Torque" value={editedCar.MaxEngineTorque} isEditing={isEditing} onChange={(v) => handleInputChange('MaxEngineTorque', v)} />
            <SpecBox icon={<Gauge size={14} />} label="Top Speed" value={editedCar.Speed} isEditing={isEditing} onChange={(v) => handleInputChange('Speed', v)} />
            <SpecBox icon={<Landmark size={14} />} label="0-60 MPH" value={editedCar.mph} isEditing={isEditing} onChange={(v) => handleInputChange('mph', v)} />
            <SpecBox icon={<Fuel size={14} />} label="Fuel" value={editedCar.FuelType} isEditing={isEditing} onChange={(v) => handleInputChange('FuelType', v)} />
            <SpecBox icon={<Map size={14} />} label="Drivetrain" value={editedCar.Drivetrain} isEditing={isEditing} onChange={(v) => handleInputChange('Drivetrain', v)} />
            <SpecBox icon={<Disc size={14} />} label="Front Brakes" value={editedCar.FrontBrakes} isEditing={isEditing} onChange={(v) => handleInputChange('FrontBrakes', v)} />
            <SpecBox icon={<Disc size={14} />} label="Rear Brakes" value={editedCar.RearBrakes} isEditing={isEditing} onChange={(v) => handleInputChange('RearBrakes', v)} />
            <SpecBox icon={<Shield size={14} />} label="Transmission" value={editedCar.Transmission} isEditing={isEditing} onChange={(v) => handleInputChange('Transmission', v)} />
          </div>

          <div className="pt-6 border-t border-white/5">
            <span className="text-[9px] uppercase text-slate-500 font-bold tracking-widest">Price Point</span>
            {isEditing ? (
              <input 
               className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xl font-black text-[#0da6f2]"
               value={editedCar.price}
               onChange={(e) => handleInputChange('price', e.target.value)}
              />
            ) : (
              <div className="text-xl md:text-2xl font-black text-[#0da6f2]">₹{car.price}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

// SUBCOMPONENTS
const MarkBadge = ({ label, val, color, isEditing, onChange }) => {
  const handleValChange = (e) => {
    let value = parseInt(e.target.value);
    if (isNaN(value)) value = 1;
    if (value > 10) value = 10;
    if (value < 1) value = 1;
    onChange(value);
  };
  return (
    <div className="bg-white/5 border border-white/5 px-4 py-2 rounded-2xl shrink-0">
      {isEditing ? (
        <input type="number" min="1" max="10" className={`w-12 bg-transparent text-base md:text-lg font-black ${color} outline-none border-b border-[#0da6f2]`} value={val} onChange={handleValChange} />
      ) : (
        <div className={`text-base md:text-lg font-black ${color}`}>{val}/10</div>
      )}
      <div className="text-[8px] uppercase font-bold text-slate-500 tracking-tighter">{label}</div>
    </div>
  );
};

const SpecBox = ({ icon, label, value, isEditing, onChange }) => (
  <div className="bg-[#101c22]/50 p-3 rounded-2xl border border-white/5">
    <div className="flex items-center gap-2 text-slate-500 mb-1">
      {icon}
      <span className="text-[8px] uppercase font-bold tracking-widest truncate">{label}</span>
    </div>
    {isEditing ? (
      <input className="w-full bg-transparent text-[10px] md:text-[11px] text-slate-200 font-semibold outline-none border-b border-[#0da6f2]/30" value={value} onChange={(e) => onChange(e.target.value)} />
    ) : (
      <span className="text-[10px] md:text-[11px] text-slate-200 font-semibold truncate block">{value || "—"}</span>
    )}
  </div>
);

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

  const handleUpdateCar = useCallback((updatedCar) => {
    setAllCars(prev => prev.map(c => c._id === updatedCar._id ? updatedCar : c));
    setSelectedCar(updatedCar);
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

  if (loading) return <div className="h-[70vh] flex items-center justify-center text-[#0da6f2]"><Loader2 className="animate-spin" size={40} /></div>;

  return (
    <div className="flex flex-col animate-in fade-in duration-500 relative min-h-screen px-2 md:px-0">
      <CarDetailsModal car={selectedCar} onClose={() => setSelectedCar(null)} onUpdate={handleUpdateCar} />

      <div className="flex items-center justify-between gap-3 md:gap-4 mb-6 md:mb-10 mt-2">
        <div className="relative flex-1 md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input type="text" placeholder="Search..." className="w-full bg-[#16252d] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-[#0da6f2]/40 shadow-inner" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <button onClick={() => navigate('/admin/add-car')} className="flex items-center justify-center size-[48px] md:size-auto md:px-6 md:py-3.5 bg-[#0da6f2] text-white rounded-2xl font-bold active:scale-95 shadow-xl shadow-[#0da6f2]/20">
          <Plus size={20} /> <span className="hidden md:inline ml-2">Add Vehicle</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {currentCars.map(car => (
          <CarRow key={car._id} car={car} onInfoClick={setSelectedCar} />
        ))}
      </div>

      {filteredCars.length > itemsPerPage && (
        <div className="fixed bottom-6 left-0 right-0 flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-3 bg-[#101c22]/90 backdrop-blur-xl p-2 rounded-2xl border border-white/10 shadow-2xl pointer-events-auto">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 rounded-xl bg-[#16252d] text-slate-400 disabled:opacity-20"><ChevronLeft size={18} /></button>
            <span className="text-[10px] font-bold text-[#0da6f2] px-2 tracking-widest">{currentPage} / {totalPages}</span>
            <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 rounded-xl bg-[#16252d] text-slate-400 disabled:opacity-20"><ChevronRight size={18} /></button>
          </div>
        </div>
      )}
    </div>
  );
};

const CarRow = memo(({ car, onInfoClick }) => {
  const displayImage = car.mainImg || (car.images && car.images[0]);
  return (
    <div className="bg-[#16252d] p-3 md:p-4 rounded-2xl border border-white/5 flex items-center mb-3 group hover:border-[#0da6f2]/30">
      <div className="w-[20%] md:w-[15%]">
        <div className="size-11 md:size-14 rounded-xl bg-[#101c22] border border-white/5 overflow-hidden flex items-center justify-center">
          {displayImage ? <img src={displayImage} className="w-full h-full object-cover" /> : <Car size={18} className="text-white opacity-40" />}
        </div>
      </div>
      <div className="flex-1 px-3">
        <h4 className="font-bold text-white text-sm md:text-xl truncate leading-tight">{car.Name}</h4>
      </div>
      <div className="hidden md:flex w-[20%] justify-center">
        <span className="bg-white/5 px-4 py-1.5 rounded-lg text-slate-400 text-[11px] font-bold uppercase">{car.brand}</span>
      </div>
      <div className="w-[15%] md:w-[10%] flex justify-end">
        <button onClick={() => onInfoClick(car)} className="p-2.5 rounded-xl bg-[#0da6f2]/5 text-[#0da6f2] hover:bg-[#0da6f2] hover:text-white transition-all"><Info size={18} /></button>
      </div>
    </div>
  );
});

export default Inventory;
