import React from 'react'
import '../styles/detail.css';
import { MdOutlineAnalytics } from "react-icons/md";
import Footer from '../component/Footer';

// 1. Capitalized the component name (detail -> Detail)
const Detail = () => {
    return (
        <div className="bg-background-dark text-slate-100 font-sans min-h-screen overflow-x-hidden grid-bg bg-[linear-gradient(to_right,rgba(14,165,233,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(14,165,233,0.05)_1px,transparent_1px)] bg-[size:40px_40px]">
            {/* Navigation */}
            <nav className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-background-dark/90 backdrop-blur-xl sticky top-0 z-50">
                <div className="flex items-center gap-6">
                    <div className="w-10 h-10 bg-white flex items-center justify-center rounded-full p-1">
                        <svg className="w-full h-full text-black" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" fill="none" r="48" stroke="currentColor" strokeWidth="2"></circle>
                            <path d="M50 2 L50 98 M2 50 L98 50" stroke="currentColor" strokeWidth="2"></path>
                            <text fontSize="12" fontWeight="bold" textAnchor="middle" x="50" y="35">M</text>
                        </svg>
                    </div>
                    <span className="font-display text-2xl tracking-[0.2em] font-black text-white uppercase">
                        VANTAGE <span className="text-primary italic">M5 CS</span>
                    </span>
                </div>

                {/* <div className="flex items-center gap-10 font-display text-xs tracking-widest">
                    <a className="text-primary hover:text-accent transition-colors border-b-2 border-primary pb-1" href="#">TECH_SPECS</a>
                    <a className="text-slate-400 hover:text-white transition-colors" href="#">GALLERY</a>
                    <div className="h-8 w-[110px]  mx-2"></div>

                </div> */}
            </nav>

            <main className="max-w-[1600px] mx-auto p-6 space-y-8">
                <div className="space-y-6">
                    {/* Hero Section */}
                    <div className="relative group h-[600px] rounded-2xl overflow-hidden glass-panel neon-border">
                        <img
                            alt="Vantage M5 CS Main Exterior"
                            className="w-full h-full object-cover"
                            src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1600"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>

                        {/* Telemetry HUD */}
                        <div className="absolute top-12 left-12 space-y-4 z-10 sm:mb-5">
                            <div className="glass-panel p-6 border-l-4 border-primary">
                                <p className="text-[10px] text-primary uppercase tracking-[0.3em] mb-1 font-bold">Maximum Velocity</p>
                                <p className="text-6xl font-display font-black text-white neon-text">
                                    305 <span className="text-xl font-normal opacity-60">KM/H</span>
                                </p>
                            </div>
                            <div className="glass-panel p-6 border-l-4 border-primary ">
                                <p className="text-[10px] text-primary uppercase tracking-[0.3em] mb-1 font-bold">Static To Peak</p>
                                <p className="text-6xl font-display font-black text-white neon-text">
                                    2.9 <span className="text-xl font-normal opacity-60">S</span>
                                </p>
                            </div>
                        </div>

                        <div className="absolute bottom-8 left-12 max-w-xl z-10">
                            <h2 className="font-display text-5xl font-black text-white uppercase leading-none mb-4">
                                Uncompromising<br />Precision
                            </h2>
                            <p className="text-slate-400 font-light leading-relaxed">
                                The most powerful vehicle in our history. A limited edition masterpiece engineered
                                for those who demand ultimate control and unparalleled performance.
                            </p>
                        </div>
                    </div>

                    {/* Technical Specs Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-8 space-y-8">
                            <div className="glass-panel overflow-hidden border border-white/5">
                                <div className="flex border-b border-white/10 font-display text-xs ">
                                    <button className="px-10 py-5 bg-primary/10 border-t-2 border-primary text-primary  font-bold uppercase">
                                        Technical Specifications
                                    </button>
                                </div>
                                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-6">
                                        <h4 className="text-xs font-display text-primary uppercase tracking-widest font-bold">ENGINE PERFORMANCE</h4>
                                        <div className="space-y-4 mt-4">
                                            <SpecRow label="Engine" value="M TwinPower Turbo 4.4L V8" />
                                            <SpecRow label="Max Torque" value="750 Nm" />
                                            <SpecRow label="Horsepower" value="627 HP" />
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <h4 className="text-xs font-display text-primary uppercase tracking-widest font-bold">CHASSIS & BRAKING</h4>
                                        <div className="space-y-4 mt-4">
                                            <SpecRow label="Front Brakes" value="Carbon ceramic discs" />
                                            <SpecRow label="Rear Brakes" value="Carbon ceramic discs" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/*    Div for Images */}
                            <div className="glass-panel overflow-hidden flex flex-wrap flex-col ">
                                <div className="p-8 grid grid-cols-2 md:grid-cols-2  gap-8 md:max:h-5">
                                    {/* image cards */}
                                    <div className='border border-gray-800 border-1 border-dashed overflow-hidden rounded-2xl '>
                                        <img
                                            alt="Vantage M5 CS Interior"
                                            className="w-full h-full object-cover rounded-lg"
                                            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800"
                                        />
                                    </div>
                                    <div className='border border-gray-800 border-1 border-dashed overflow-hidden rounded-2xl'>
                                        <img
                                            alt="Vantage M5 CS Interior"
                                            className="w-full h-full object-cover rounded-lg"
                                            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800"
                                        />
                                    </div>
                                    <div className='border border-gray-800 border-1 border-dashed overflow-hidden rounded-2xl'>
                                        <img
                                            alt="Vantage M5 CS Interior"
                                            className="w-full h-full object-cover rounded-lg"
                                            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800"
                                        />
                                    </div>
                                    <div className='border border-gray-800 border-1 border-dashed overflow-hidden rounded-2xl'>
                                        <img
                                            alt="Vantage M5 CS Interior"
                                            className="w-full h-full object-cover rounded-lg"
                                            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800"
                                        />
                                    </div>

                                </div>
                            </div>
                        </div>


                        {/* Sidebar Analytics */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="glass-panel p-8 border-r-4 border-r-primary">
                                <h3 className="font-display text-lg font-bold tracking-widest text-white uppercase mb-10 flex items-center gap-3">
                                    {/* <span className="w-2 h-2 bg-primary rounded-full"> */}
                                    <MdOutlineAnalytics className="text-primary" />
                                    {/* </span> */}
                                    Analytics
                                </h3>
                                <div className="space-y-12">
                                    <CircularProgress score="9.9" label="Velocity Score" sub="STABILITY AT 300+ KM/H" />
                                    <CircularProgress score="9.8" label="Comfort Index" sub="ERGO-CARBON BUCKETS" />
                                    <CircularProgress score="9.8" label="Comfort Index" sub="ERGO-CARBON BUCKETS" />
                                </div>
                            </div>
                            <div class="glass-panel p-4 ">
                                <h4 class="font-display text-[10px] tracking-[0.3em] text-slate-500 uppercase mb-4">System Telemetry
                                </h4>
                                <div class="grid grid-cols-2 gap-3">
                                    <div class="p-3 h-20 border border-white/5 bg-black/40 rounded">
                                        <p class="text-[9px] text-slate-500 uppercase">Oil Temp</p>
                                        <p class="text-primary font-mono text-sm">98°C</p>
                                    </div>
                                    <div class="p-3 h-20 border border-white/5 bg-black/40 rounded">
                                        <p class="text-[9px] text-slate-500 uppercase">Tire PSI</p>
                                        <p class="text-primary font-mono text-sm">34.2</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
            <div className="mt-40">

            <Footer  />
            </div>
            {/* <footer className="mt-20 border-t border-white/10 p-12 bg-black/40"> */}
                {/* <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <span className="font-display text-lg tracking-[0.3em] text-white uppercase">Vantage Automotive</span>
                    <div className="flex gap-8 font-display text-[9px] tracking-[0.2em] text-slate-500 uppercase">
                        <a className="hover:text-primary transition-colors" href="#">Technical Lab</a>
                        <a className="hover:text-primary transition-colors" href="#">Fleet Protocols</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <p className="font-mono text-[10px] text-slate-600 uppercase">SYSTEMS_ACTIVE_2026</p>
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#0ea5e9]"></div>
                    </div>
                </div> */}
            {/* </footer> */}
        </div>
    );
};

// 2. These helper components must be defined OUTSIDE of the Detail function body
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
                style={{ clipPath: 'polygon(50% 50%, -100% -100%, 200% -100%, 200% 200%, -100% 200%)' }}
            ></div>
            <span className="font-display font-bold text-2xl text-white">{score}</span>
        </div>
        <div>
            <h5 className="text-xs font-display text-primary tracking-widest uppercase mb-1">{label}</h5>
            <p className="text-[10px] text-slate-500 font-mono">{sub}</p>
        </div>
    </div>
);

export default Detail; // 3. Updated export name