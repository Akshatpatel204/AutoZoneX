import React from 'react';
import { useNavigate } from "react-router-dom";
import { Fuel, Zap, Users, PlusCircle, ListPlus, Trash2 } from 'lucide-react';

const StatCard = ({ label, value, icon }) => (
    <div className="bg-[#16252d] p-6 rounded-xl border border-white/5">
        <div className="flex items-center gap-2 mb-2">
            {icon} <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-none">{label}</p>
        </div>
        <h3 className="text-3xl font-bold text-white">{value}</h3>
    </div>
);

const ActionCard = ({ icon, title, desc, accentColor }) => (
    <div className="group relative bg-[#16252d] border border-white/5 rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 cursor-pointer shadow-sm">
        <div className="size-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>{icon}</div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">{desc}</p>
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-auto">
            <div className="h-full transition-all duration-500 w-0 group-hover:w-full" style={{ backgroundColor: accentColor }}></div>
        </div>
    </div>
);

function Dashboard() {
    const navigate = useNavigate();

    return (
        <div className="animate-in fade-in duration-500 ">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard label="Total Petrol Car" value="1,452" icon={<Fuel size={20} className="text-[#0da6f2] mb-3"/>} />
                <StatCard label="Total Diesel Car" value="842" icon={<Fuel size={20} className="text-amber-500 mb-3" />} />
                <StatCard label="Total EV Car" value="248" icon={<Zap size={20} className="text-emerald-400 mb-3" />} />
                <StatCard label="Total Users" value="3,120" icon={<Users size={20} className="text-purple-400 mb-3" />} />
            </div>
            <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 mt-3">
                <div onClick={ ()=> navigate('/admin/add-car')}>
                    <ActionCard icon={<PlusCircle size={36} />} title="Add New Vehicle" desc="Register a new unit." accentColor="#0da6f2" />
                </div>
                <div onClick={ ()=> navigate('/admin/inventory')}>
                    <ActionCard icon={<ListPlus size={36} />} title="View Inventory" desc="Explore vehicle repository." accentColor="#0da6f2" />
                </div>
                <div onClick={ ()=> navigate('/admin/delete-car')}>
                    <ActionCard icon={<Trash2 size={36} />} title="Remove Vehicle" desc="Decommission units." accentColor="#ef4444" />
                </div>
            </div>
        </div>
    )
}

export default Dashboard;