import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/detail.css';
import { MdOutlineAnalytics } from "react-icons/md";
import { ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Footer from '../component/Footer';

// ✅ Import Swiper React components and styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Detail = () => {
    const { id } = useParams();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImgIndex, setSelectedImgIndex] = useState(null); // ✅ Track if modal is open
    const API_BASE = import.meta.env.VITE_backendapi;

    useEffect(() => {
        let isMounted = true;
        const fetchCarDetails = async () => {
            try {
                const response = await axios.get(`${API_BASE}/fetch_all_car`);
                const allCars = response.data["data :- "];
                const specificCar = allCars.find(c => c._id === id);
                if (isMounted) setCar(specificCar);
            } catch (error) {
                console.error("Error fetching car details:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchCarDetails();
        return () => { isMounted = false; };
    }, [id, API_BASE]);

    const handleKnowMore = useCallback(() => {
        const targetUrl = car?.knowmore || car?.knowMore;
        if (targetUrl) {
            window.open(targetUrl, '_blank', 'noopener,noreferrer');
        }
    }, [car?.knowmore, car?.knowMore]);

    const hasUrl = useMemo(() => !!(car?.knowmore || car?.knowMore), [car?.knowmore, car?.knowMore]);

    if (loading) return (
        <div className="h-screen bg-background-dark flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-primary"></div>
        </div>
    );

    if (!car) return <div className="text-white text-center py-20">Car Not Found</div>;

    return (
        <div className="bg-background-dark text-slate-100 font-sans min-h-screen overflow-x-hidden grid-bg bg-[linear-gradient(to_right,rgba(14,165,233,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(14,165,233,0.05)_1px,transparent_1px)] bg-[size:40px_40px]">
            
            {/* ✅ Image Popup Modal */}
            {selectedImgIndex !== null && (
                <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
                    <button 
                        onClick={() => setSelectedImgIndex(null)}
                        className="absolute top-6 right-6 text-white/50 hover:text-white z-[110] transition-colors"
                    >
                        <X size={40} />
                    </button>

                    <div className="w-full max-w-6xl aspect-video">
                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            initialSlide={selectedImgIndex}
                            navigation
                            pagination={{ clickable: true }}
                            autoplay={{ delay: 3000, disableOnInteraction: false }}
                            loop={true}
                            className="h-full rounded-2xl overflow-hidden"
                        >
                            {car.images?.map((img, index) => (
                                <SwiperSlide key={index}>
                                    <img 
                                        src={img} 
                                        alt="Gallery view" 
                                        className="w-full h-full object-contain bg-black/20"
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            )}

            <main className="max-w-[1600px] mx-auto p-4 md:p-6 space-y-8">
                <div className="space-y-6">
                    {/* Hero Section */}
                    <div className="relative group h-[400px] md:h-[600px] rounded-2xl overflow-hidden glass-panel neon-border">
                        <img
                            alt={car.Name}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 cursor-pointer"
                            src={car.images?.[0]}
                            loading="eager"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/20 to-transparent pointer-events-none"></div>

                        {/* Telemetry HUD */}
                        <div className="absolute top-6 left-6 md:top-12 md:left-12 space-y-3 md:space-y-4 z-10">
                            <div className="glass-panel p-3 md:p-6 border-l-4 border-primary">
                                <p className="text-[8px] md:text-[10px] text-primary uppercase tracking-[0.2em] mb-1 font-bold">Top Speed</p>
                                <p className="text-2xl md:text-6xl font-display font-black text-white neon-text">
                                    {car.Speed?.replace(/[^0-9.]/g, '')} 
                                    <span className="text-xs md:text-xl font-normal opacity-60 ml-1 md:ml-2">KM/H</span>
                                </p>
                            </div>
                            <div className="glass-panel p-3 md:p-6 border-l-4 border-primary">
                                <p className="text-[8px] md:text-[10px] text-primary uppercase tracking-[0.2em] mb-1 font-bold">0-100 Accel</p>
                                <p className="text-2xl md:text-6xl font-display font-black text-white neon-text">
                                    {car.mph?.replace(/[^0-9.]/g, '')} 
                                    <span className="text-xs md:text-xl font-normal opacity-60 ml-1 md:ml-2">S</span>
                                </p>
                            </div>
                        </div>

                        <div className="absolute bottom-6 left-6 md:bottom-8 md:left-12 max-w-xl z-10">
                            <h2 className="font-display text-2xl md:text-5xl font-black text-white uppercase leading-tight mb-2 md:mb-4">
                                {car.brand} {car.Name}
                            </h2>
                        </div>

                        {hasUrl && (
                             <div className="hidden md:block absolute bottom-10 right-10 z-20">
                                <button 
                                    onClick={handleKnowMore}
                                    className="flex items-center gap-3 px-8 py-4 bg-primary hover:bg-white text-white hover:text-black rounded-full font-black uppercase tracking-widest text-xs transition-all duration-300 shadow-[0_10px_30px_rgba(14,165,233,0.4)]"
                                >
                                    Know More <ExternalLink size={16} />
                                </button>
                             </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-8 space-y-8">
                            <div className="glass-panel overflow-hidden border border-white/5">
                                <div className="flex border-b border-white/10 font-display text-[10px] md:text-xs justify-between items-center">
                                    <button className="px-6 py-4 md:px-10 md:py-5 bg-primary/10 border-t-2 border-primary text-primary font-bold uppercase">
                                        Technical Specifications
                                    </button>
                                </div>
                                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                                    <div className="space-y-4 md:space-y-6">
                                        <h4 className="text-[10px] md:text-xs font-display text-primary uppercase tracking-widest font-bold">ENGINE PERFORMANCE</h4>
                                        <div className="space-y-3 md:space-y-4 mt-4">
                                            <SpecRow label="Engine" value={car.Engine} />
                                            <SpecRow label="Max Torque" value={car.MaxEngineTorque} />
                                            <SpecRow label="Horsepower" value={`${car.Horsepower} HP`} />
                                            <SpecRow label="Transmission" value={car.Transmission} />
                                            <SpecRow label="Drivetrain" value={car.Drivetrain} />
                                        </div>
                                    </div>
                                    <div className="space-y-4 md:space-y-6">
                                        <h4 className="text-[10px] md:text-xs font-display text-primary uppercase tracking-widest font-bold">CHASSIS & BRAKING</h4>
                                        <div className="space-y-3 md:space-y-4 mt-4">
                                            <SpecRow label="Fuel Type" value={car.FuelType} />
                                            <SpecRow label="Front Brakes" value={car.FrontBrakes} />
                                            <SpecRow label="Rear Brakes" value={car.RearBrakes} />
                                            <SpecRow label="Price" value={car.price} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Gallery thumbnails */}
                            <div className="glass-panel p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                                {car.images?.map((img, index) => (
                                    <div 
                                        key={index} 
                                        className='border border-gray-800 border-dashed overflow-hidden rounded-2xl aspect-video cursor-zoom-in group'
                                        onClick={() => setSelectedImgIndex(index)} // ✅ Open modal
                                    >
                                        <img
                                            alt={`${car.Name} detail ${index}`}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            src={img}
                                            loading="lazy"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sidebar Analytics */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="glass-panel p-6 md:p-8 border-r-4 border-r-primary">
                                <h3 className="font-display text-base md:text-lg font-bold tracking-widest text-white uppercase mb-8 md:mb-10 flex items-center gap-3">
                                    <MdOutlineAnalytics className="text-primary" /> Analytics
                                </h3>
                                <div className="space-y-8 md:space-y-12 mb-10">
                                    <CircularProgress score={car.speed_mark} label="Speed Score" sub="AERODYNAMIC EFFICIENCY" />
                                    <CircularProgress score={car.comfort_mark} label="Comfort Index" sub="INTERIOR ERGONOMICS" />
                                    <CircularProgress score={car.safety_mark} label="Safety Rating" sub="SYSTEM PROTOCOLS" />
                                </div>

                                {hasUrl && (
                                    <div className="md:hidden pt-6 border-t border-white/10">
                                        <button 
                                            onClick={handleKnowMore}
                                            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-lg shadow-primary/20"
                                        >
                                            View Full Source <ExternalLink size={16} />
                                        </button>
                                        <p className="text-[8px] text-center text-slate-500 mt-3 uppercase tracking-tighter font-bold opacity-50">External Technical Database</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <div className="mt-20 md:mt-40">
                <Footer />
            </div>
        </div>
    );
};

const SpecRow = React.memo(({ label, value }) => (
    <div className="flex justify-between items-center border-b border-white/5 pb-3">
        <span className="text-slate-400 text-xs md:text-sm">{label}</span>
        <span className="text-white text-xs md:text-sm font-mono font-bold text-right pl-4">{value}</span>
    </div>
));

const CircularProgress = React.memo(({ score, label, sub }) => {
    const percentage = useMemo(() => Math.min(Math.max(score * 10, 0), 100), [score]);
    const radius = 30;
    const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);
    const offset = useMemo(() => circumference - (percentage / 100) * circumference, [percentage, circumference]);

    return (
        <div className="flex items-center gap-4 md:gap-6">
            <div className="relative w-16 h-16 md:w-24 md:h-24 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
                    <circle
                        cx="50" cy="50" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent"
                        strokeDasharray={circumference}
                        style={{ strokeDashoffset: offset, transition: 'stroke-dashoffset 1s ease-in-out' }}
                        strokeLinecap="round"
                        className="text-primary"
                    />
                </svg>
                <span className="absolute font-display font-bold text-lg md:text-2xl text-white">{score}</span>
            </div>
            <div>
                <h5 className="text-[10px] md:text-xs font-display text-primary tracking-widest uppercase mb-1">{label}</h5>
                <p className="text-[8px] md:text-[10px] text-slate-500 font-mono leading-tight">{sub}</p>
            </div>
        </div>
    );
});

export default Detail;

