import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { 
  Car, LayoutDashboard, Package, Users, Menu, X, LogOut, User, PlusSquare, FileX, AlertCircle 
} from 'lucide-react';

const A_home = ({ user, logout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // New state for popup
  const profileRef = useRef(null);
  const location = useLocation();

  const getHeaderTitle = () => {
    const path = location.pathname;
    if (path === "/admin" || path === "/admin/") return "Dashboard";
    if (path.includes("inventory")) return "Inventory";
    if (path.includes("add-car")) return "Add Car";
    if (path.includes("users")) return "Users";
    if (path.includes("delete-car")) return "Delete Car Detail";
    return "Admin";
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setIsProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    document.body.style.overflow = (isMobileMenuOpen || showLogoutConfirm) ? 'hidden' : 'unset';
  }, [isMobileMenuOpen, showLogoutConfirm]);

  return (
    <div className="flex h-screen bg-[#0a1114] text-white font-sans overflow-hidden">
      
      {/* --- LOGOUT CONFIRMATION POPUP --- */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowLogoutConfirm(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-[#16252d] border border-white/10 w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="size-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Confirm Logout</h3>
              <p className="text-slate-400 text-sm mb-8">Are you sure you want to sign out? You will need to login again to access the admin panel.</p>
              
              <div className="flex gap-3 w-full">
                <button 
                  className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all border border-white/5 active:scale-95"
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  Cancel
                </button>
                <button 
                  className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-all shadow-lg shadow-red-500/20 active:scale-95"
                  onClick={logout}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="hidden lg:flex w-70 bg-[#101d23] border-r border-white/5 flex-col p-6 gap-8">
        <div className="flex items-center gap-3">
          <div className="bg-[#0da6f2] size-10 rounded-lg flex items-center justify-center shadow-lg shadow-[#0da6f2]/30">
            <Car size={30}/>
          </div>
          <h1 className="text-lg font-bold">AutoAdmin</h1>
        </div>
        <nav className="flex-1 flex flex-col gap-1">
          <SidebarLink to="/admin" icon={<LayoutDashboard size={20}/>} label="Dashboard" end />
          <SidebarLink to="/admin/inventory" icon={<Package size={20}/>} label="Inventory" />
          <SidebarLink to="/admin/add-car" icon={<PlusSquare size={20}/>} label="Add Car" />
          <SidebarLink to="/admin/users" icon={<Users size={20}/>} label="Users" />
          <SidebarLink to="/admin/delete-car" icon={<FileX size={20}/>} label="Delete Car Detail" />
        </nav>
      </aside>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-[#0a1114] flex flex-col p-6 lg:hidden">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Car className="text-[#0da6f2]" size={28}/> 
              <span className="text-lg font-bold">AutoAdmin</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-white/5 rounded-full"><X size={24}/></button>
          </div>
          <nav className="flex flex-col gap-2">
            <MobileLink to="/admin" label="Dashboard" onClick={() => setIsMobileMenuOpen(false)} end />
            <MobileLink to="/admin/inventory" label="Inventory" onClick={() => setIsMobileMenuOpen(false)} />
            <MobileLink to="/admin/add-car" label="Add Car" onClick={() => setIsMobileMenuOpen(false)} />
            <MobileLink to="/admin/users" label="Users" onClick={() => setIsMobileMenuOpen(false)} />
            <MobileLink to="/admin/delete-car" label="Delete Car Detail" onClick={() => setIsMobileMenuOpen(false)} />
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main className="mainContentArea flex-1 flex flex-col overflow-y-auto relative no-scrollbar">
        <header className="h-20 flex-shrink-0 flex items-center justify-between px-6 lg:px-10 border-b border-white/5 bg-[#0a1114]/50 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 -ml-2 hover:bg-white/5 rounded-lg transition-all">
              <Menu size={28} />
            </button>
            <h2 className="text-lg md:text-xl font-bold">{getHeaderTitle()}</h2>
          </div>

          <div className="relative" ref={profileRef}>
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setIsProfileOpen(!isProfileOpen)}>
              <div className="text-right leading-none hidden sm:block">
                <p className="text-sm font-bold group-hover:text-[#0da6f2] transition-colors mt-3">{user?.displayName || "Hello ADMIN"}</p>
              </div>
              <div className={`size-10 rounded-lg bg-zinc-800 border ${isProfileOpen ? 'border-[#0da6f2]' : 'border-white/10'} overflow-hidden transition-all`}>
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="avatar" />
              </div>
            </div>

            {isProfileOpen && (
              <div className="absolute right-0 top-14 w-64 bg-[#16252d] border border-white/10 rounded-2xl shadow-2xl p-4 animate-in zoom-in-95 z-50">
                <div className="flex items-center gap-3 pb-4 mb-3 border-b border-white/5">
                   <div className="size-10 rounded-full bg-[#0da6f2]/20 flex items-center justify-center text-[#0da6f2]"><User size={20}/></div>
                   <div className="min-w-0 font-bold">
                     <p className="text-sm truncate text-white pt-3">{user?.displayName || "Hello ADMIN"}</p>
                   </div>
                </div>
                <div className="p-2 bg-white/5 rounded-lg text-[11px] text-slate-400 truncate mb-2">{user?.email || "No email provided"}</div>
                
                {/* Updated Sign Out button to trigger popup */}
                <button 
                  className="w-full flex items-center gap-2 p-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg font-bold transition-all" 
                  onClick={() => {
                    setShowLogoutConfirm(true);
                    setIsProfileOpen(false);
                  }}
                >
                  <LogOut size={16}/> Sign Out
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

const SidebarLink = ({ to, icon, label, end }) => (
  <NavLink 
    to={to} 
    end={end}
    className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full ${
      isActive ? 'bg-[#0da6f2]/10 text-[#0da6f2] border border-[#0da6f2]/20 font-bold' : 'text-white hover:bg-white/5'
    }`}
  >
    {icon} 
    <span className="text-sm">{label}</span>
  </NavLink>
);

const MobileLink = ({ to, label, onClick, end }) => (
  <NavLink 
    to={to} 
    end={end}
    onClick={onClick}
    className={({ isActive }) => `px-5 py-3.5 rounded-xl text-left font-semibold text-sm transition-all flex items-center justify-between ${
      isActive ? 'bg-[#0da6f2] text-white shadow-lg' : 'bg-white/5 text-slate-300'
    }`}
  >
    {label}
  </NavLink>
);

export default A_home;