import React, { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate } from "react-router-dom";
import { collection, query, where, getCountFromServer } from "firebase/firestore";
import { db } from "../firebase-config";
import { Fuel, Zap, Users, PlusCircle, ListPlus, Trash2, Loader2 } from 'lucide-react';
import axios from 'axios';

// 1. Memoized StatCard: Only re-renders if value or loading state changes
const StatCard = memo(({ label, value, icon, loading }) => (
    <div className="bg-[#16252d] p-6 rounded-xl border border-white/5 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
            {icon} 
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-none">{label}</p>
        </div>
        {loading ? (
            <Loader2 size={20} className="animate-spin text-[#0da6f2] mt-2" />
        ) : (
            <h3 className="text-3xl font-bold text-white">{value}</h3>
        )}
    </div>
));

// 2. Memoized ActionCard: Static component that should never re-render
const ActionCard = memo(({ icon, title, desc, accentColor, onClick }) => (
    <div 
        onClick={onClick}
        className="group relative bg-[#16252d] border border-white/5 rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 cursor-pointer shadow-sm"
    >
        <div className="size-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>{icon}</div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">{desc}</p>
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-auto">
            <div className="h-full transition-all duration-500 w-0 group-hover:w-full" style={{ backgroundColor: accentColor }}></div>
        </div>
    </div>
));

function Dashboard() {
    const navigate = useNavigate();
    const [counts, setCounts] = useState({
        petrol: 0,
        diesel: 0,
        ev: 0,
        users: 0
    });
    const [loading, setLoading] = useState(true);

    const adminId = import.meta.env.VITE_admin_uid; 
    const API_BASE = import.meta.env.VITE_backendapi;

    useEffect(() => {
        let isMounted = true; // Optimization: Prevent state updates on unmounted component
        
        const fetchAllStats = async () => {
            setLoading(true);
            try {
                // Fetch stats in parallel
                const userColl = collection(db, "users");
                const userQ = query(userColl, where("uid", "!=", adminId));
                
                const [userSnapshot, petrolRes, dieselRes, evRes] = await Promise.all([
                    getCountFromServer(userQ),
                    axios.get(`${API_BASE}/api/cars/filter?fuel=Petrol`),
                    axios.get(`${API_BASE}/api/cars/filter?fuel=Diesel`),
                    axios.get(`${API_BASE}/api/cars/filter?fuel=Electric`)
                ]);

                if (isMounted) {
                    setCounts({
                        users: userSnapshot.data().count,
                        petrol: petrolRes.data["data :- "].length,
                        diesel: dieselRes.data["data :- "].length,
                        ev: evRes.data["data :- "].length,
                    });
                }
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchAllStats();
        return () => { isMounted = false; }; // Cleanup
    }, [adminId, API_BASE]);

    // 3. Memoized navigation handlers
    const goTo = useCallback((path) => () => navigate(path), [navigate]);

    return (
        <div className="animate-in fade-in duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard 
                    label="Total Petrol Car" 
                    value={counts.petrol} 
                    loading={loading}
                    icon={<Fuel size={20} className="text-[#0da6f2] mb-3"/>} 
                />
                <StatCard 
                    label="Total Diesel Car" 
                    value={counts.diesel} 
                    loading={loading}
                    icon={<Fuel size={20} className="text-amber-500 mb-3" />} 
                />
                <StatCard 
                    label="Total EV Car" 
                    value={counts.ev} 
                    loading={loading}
                    icon={<Zap size={20} className="text-emerald-400 mb-3" />} 
                />
                <StatCard 
                    label="Total Users" 
                    value={counts.users} 
                    loading={loading}
                    icon={<Users size={20} className="text-purple-400 mb-3" />} 
                />
            </div>

            <h2 className="text-xl font-bold text-white mb-6 px-1">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 mt-3">
                <ActionCard 
                    onClick={goTo('/admin/add-car')}
                    icon={<PlusCircle size={36} />} 
                    title="Add New Vehicle" 
                    desc="Register a new unit." 
                    accentColor="#0da6f2" 
                />
                <ActionCard 
                    onClick={goTo('/admin/inventory')}
                    icon={<ListPlus size={36} />} 
                    title="View Inventory" 
                    desc="Explore vehicle repository." 
                    accentColor="#0da6f2" 
                />
                <ActionCard 
                    onClick={goTo('/admin/delete-car')}
                    icon={<Trash2 size={36} />} 
                    title="Remove Vehicle" 
                    desc="Decommission units." 
                    accentColor="#ef4444" 
                />
            </div>
        </div>
    );
}

export default Dashboard;