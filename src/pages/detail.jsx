import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/detail.css';
import { MdOutlineAnalytics } from "react-icons/md";
import { ExternalLink } from 'lucide-react';
import Footer from '../component/Footer';

const Detail = () => {
    const { id } = useParams(); 
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_BASE = import.meta.env.VITE_backendapi;

    useEffect(() => {
        const fetchCarDetails = async () => {
            try {
                const response = await axios.get(`${API_BASE}/fetch_all_car`);
                const allCars = response.data["data :- "];
                const specificCar = allCars.find(c => c._id === id);
                setCar(specificCar);
            } catch (error) {
                console.error("Error fetching car details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCarDetails();
    }, [id, API_BASE]);

    // Function to handle opening the URL in a new tab
    const handleKnowMore = () => {
        if (car?.knowmore) {
            window.open(car.knowmore, '_blank', 'noopener,noreferrer');
        }
    };

    if (loading) return (
        <div className="h-screen bg-background-dark flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-primary"></div>
        </div>
    );

    if (!car) return <div className="text-white text-center py-20">Car Not Found</div>;

    return (
        <div className="bg-background-dark text-slate-100 font-sans min-h-screen overflow-x-hidden grid-bg bg-[linear-gradient(to_right,rgba(14,165,233,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(14,165,233,0.05)_1px,transparent_1px)] bg-[size:40px_40px]">
            {/* Navigation */}
            <nav className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-background-dark/90 backdrop-blur-xl sticky top-0 z-50">
                <div className="flex items-center gap-6">
                    <div className="w-10 h-10 bg-white flex items-center justify-center rounded-full p-1">
                        <svg className="w-full h-full text-black" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" fill="none" r="48" stroke="currentColor" strokeWidth="2"></circle>
                            <path d="M50 2 L50 98 M2 50 L98 50" stroke="currentColor" strokeWidth="2"></path>
                            <text fontSize="12" fontWeight="bold" textAnchor="middle" x="50" y="35">{car.brand[0]}</text>
                        </svg>
                    </div>
                    <span className="font-display text-2xl tracking-[0.2em] font-black text-white uppercase">
                        {car.brand} <span className="text-primary italic">{car.Name}</span>
                    </span>
                </div>
            </nav>

            <main className="max-w-[1600px] mx-auto p-6 space-y-8">
                <div className="space-y-6">
                    {/* Hero Section */}
                    <div className="relative group h-[600px] rounded-2xl overflow-hidden glass-panel neon-border">
                        <img
                            alt={car.Name}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            src={car.images[0]}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>

                        {/* Telemetry HUD */}
                        <div className="absolute top-12 left-12 space-y-4 z-10">
                            <div className="glass-panel p-6 border-l-4 border-primary">
                                <p className="text-[10px] text-primary uppercase tracking-[0.3em] mb-1 font-bold">Top Speed</p>
                                <p className="text-6xl font-display font-black text-white neon-text">
                                    {car.Speed.replace(/[^0-9.]/g, '')} 
                                    <span className="text-xl font-normal opacity-60 ml-2">KM/H</span>
                                </p>
                            </div>
                            <div className="glass-panel p-6 border-l-4 border-primary">
                                <p className="text-[10px] text-primary uppercase tracking-[0.3em] mb-1 font-bold">0-100 Acceleration</p>
                                <p className="text-6xl font-display font-black text-white neon-text">
                                    {car.mph.replace(/[^0-9.]/g, '')} 
                                    <span className="text-xl font-normal opacity-60 ml-2">S</span>
                                </p>
                            </div>
                        </div>

                        <div className="absolute bottom-8 left-12 max-w-xl z-10">
                            <h2 className="font-display text-5xl font-black text-white uppercase leading-none mb-4">
                                {car.brand}  {car.Name}
                            </h2>
                            <p className="text-slate-400 font-light leading-relaxed">
                                {car.knowMore}
                            </p>
                        </div>
                    </div>

                    {/* Technical Specs Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-8 space-y-8">
                            <div className="glass-panel overflow-hidden border border-white/5">
                                <div className="flex border-b border-white/10 font-display text-xs justify-between items-center pr-6">
                                    <button className="px-10 py-5 bg-primary/10 border-t-2 border-primary text-primary font-bold uppercase">
                                        Technical Specifications
                                    </button>
                                    
                                    {/* Know More Button */}
                                    {car.knowmore && (
                                        <button 
                                            onClick={handleKnowMore}
                                            className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(14,165,233,0.3)]"
                                        >
                                            Know More <ExternalLink size={14} />
                                        </button>
                                    )}
                                </div>
                                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-6">
                                        <h4 className="text-xs font-display text-primary uppercase tracking-widest font-bold">ENGINE PERFORMANCE</h4>
                                        <div className="space-y-4 mt-4">
                                            <SpecRow label="Engine" value={car.Engine} />
                                            <SpecRow label="Max Torque" value={car.MaxEngineTorque} />
                                            <SpecRow label="Horsepower" value={`${car.Horsepower} HP`} />
                                            <SpecRow label="Transmission" value={car.Transmission} />
                                            <SpecRow label="Drivetrain" value={car.Drivetrain} />
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <h4 className="text-xs font-display text-primary uppercase tracking-widest font-bold">CHASSIS & BRAKING</h4>
                                        <div className="space-y-4 mt-4">
                                            <SpecRow label="Fuel Type" value={car.FuelType} />
                                            <SpecRow label="Front Brakes" value={car.FrontBrakes} />
                                            <SpecRow label="Rear Brakes" value={car.RearBrakes} />
                                            {/* <SpecRow label="Price" value={`$${parseInt(car.price).toLocaleString()}`} /> */}
                                            <SpecRow label="Price" value={car.price} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Dynamic Gallery */}
                            <div className="glass-panel p-8 grid grid-cols-2 gap-8">
                                {car.images.map((img, index) => (
                                    <div key={index} className='border border-gray-800 border-dashed overflow-hidden rounded-2xl aspect-video'>
                                        <img
                                            alt={`${car.Name} detail ${index}`}
                                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                            src={img}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sidebar Analytics */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="glass-panel p-8 border-r-4 border-r-primary">
                                <h3 className="font-display text-lg font-bold tracking-widest text-white uppercase mb-10 flex items-center gap-3">
                                    <MdOutlineAnalytics className="text-primary" /> Analytics
                                </h3>
                                <div className="space-y-12">
                                    <CircularProgress score={car.speed_mark} label="Speed Score" sub="AERODYNAMIC EFFICIENCY" />
                                    <CircularProgress score={car.comfort_mark} label="Comfort Index" sub="INTERIOR ERGONOMICS" />
                                    <CircularProgress score={car.safety_mark} label="Safety Rating" sub="SYSTEM PROTOCOLS" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <div className="mt-40">
                <Footer />
            </div>
        </div>
    );
};

const SpecRow = ({ label, value }) => (
    <div className="flex justify-between items-center border-b border-white/5 pb-3">
        <span className="text-slate-400 text-sm">{label}</span>
        <span className="text-white text-sm font-mono font-bold text-right">{value}</span>
    </div>
);

const CircularProgress = ({ score, label, sub }) => (
    <div className="flex items-center gap-6">
        <div className="relative w-20 h-20 rounded-full flex items-center justify-center border-4 border-white/5">
            <div
                className="absolute inset-0 rounded-full border-4 border-primary shadow-[0_0_10px_#0ea5e9]"
                style={{ clipPath: `conic-gradient(from 0deg, #0ea5e9 ${score * 10}%, transparent 0)` }}
            ></div>
            <span className="font-display font-bold text-2xl text-white">{score}</span>
        </div>
        <div>
            <h5 className="text-xs font-display text-primary tracking-widest uppercase mb-1">{label}</h5>
            <p className="text-[10px] text-slate-500 font-mono">{sub}</p>
        </div>
    </div>
);

export default Detail;