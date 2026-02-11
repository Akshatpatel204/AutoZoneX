import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase-config";
import { Mail, Info, Calendar, Chrome, ChevronLeft, ChevronRight, Loader2, X, Copy, Check, ShieldCheck, User as UserAvatarIcon, Fingerprint, Key, ZoomIn } from 'lucide-react';

// 1. Memoized Modal: Features an Interactive Image Zoom
const UserDetailsModal = memo(({ user, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false); 

  const handleCopy = useCallback(() => {
    if (!user?.uid) return;
    navigator.clipboard.writeText(user.uid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [user?.uid]);

  const formattedDate = useMemo(() => {
    if (!user?.createdAt?.seconds) return "Date N/A";
    return new Date(user.createdAt.seconds * 1000).toLocaleString('en-US', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }, [user?.createdAt]);

  if (!user) return null;

  const isAdmin = user.role?.toLowerCase() === 'admin';
  const roleStyles = isAdmin 
    ? "border-orange-500/30 bg-orange-500/10 text-orange-400" 
    : "border-[#0da6f2]/30 bg-[#0da6f2]/10 text-[#0da6f2]";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#16252d] w-full max-w-[380px] rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden p-8 flex flex-col items-center min-h-[480px]">
        
        {/* Close Modal Button */}
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors z-[70]">
          <X size={22} />
        </button>

        {/* --- Image Zoom Overlay --- */}
        {isZoomed && user.photoURL && !imgError && (
          <div 
            className="absolute inset-0 z-[80] bg-[#101c22] animate-in zoom-in duration-300 flex flex-col"
            onClick={() => setIsZoomed(false)}
          >
            <div className="flex justify-between items-center p-6 border-b border-white/5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Profile View</span>
                <button className="text-white bg-white/5 p-2 rounded-xl"><X size={18} /></button>
            </div>
            <div className="flex-1 flex items-center justify-center p-4">
                <img 
                    src={user.photoURL} 
                    alt={user.name} 
                    className="w-full aspect-square object-cover rounded-[2rem] shadow-2xl border border-white/10" 
                />
            </div>
            <div className="p-8 text-center bg-gradient-to-t from-black/20">
                <p className="text-white font-bold text-lg">{user.name}</p>
                <p className="text-slate-500 text-xs mt-1 italic">Tap anywhere to close</p>
            </div>
          </div>
        )}
        {/* --- End Zoom Overlay --- */}

        <div className="absolute top-6 left-6 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-[9px] font-bold uppercase tracking-wider">
          {formattedDate}
        </div>

        {/* Profile Image with Zoom Trigger */}
        <div 
          onClick={() => !imgError && user.photoURL && setIsZoomed(true)}
          className={`group relative size-28 rounded-full border-4 border-slate-800 bg-[#101c22] mt-8 mb-3 overflow-hidden shadow-2xl flex items-center justify-center ${user.photoURL && !imgError ? 'cursor-zoom-in' : ''}`}
        >
          {user.photoURL && !imgError ? (
            <>
              <img 
                src={user.photoURL} 
                alt="" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={() => setImgError(true)}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <ZoomIn size={24} className="text-white" />
              </div>
            </>
          ) : (
            <UserAvatarIcon size={48} className="text-white opacity-80" />
          )}
        </div>

        <div className="flex items-center gap-1 mb-1">
            <span className="text-slate-500 text-[10px] font-mono opacity-70">
                ID: {user.uid?.slice(0, 14)}...
            </span>
            <button onClick={handleCopy} className="p-1 hover:text-[#0da6f2] transition-colors">
              {copied ? <Check size={11} className="text-green-500" /> : <Copy size={11} />}
            </button>
        </div>

        <h2 className="text-2xl font-bold text-white text-center mb-1 tracking-tight">{user.name}</h2>
        
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${roleStyles} mt-4 mb-10`}>
            <ShieldCheck size={12} />
            <span className="text-[10px] font-bold uppercase tracking-widest">{user.role || 'user'}</span>
        </div>

        <div className="w-full space-y-5 px-2">
            <InfoRow icon={<Mail size={16} />} label="Email Address" value={user.email} />
            <div className="flex items-center gap-4">
                <div className="size-9 rounded-xl bg-white/5 flex items-center justify-center text-slate-400"><Fingerprint size={16} /></div>
                <div className="flex flex-col">
                    <span className="text-[9px] uppercase text-slate-500 font-bold tracking-widest">Auth Method</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm text-slate-200 capitalize">{user.provider} account</span>
                      {user.provider === 'google' ? <Chrome size={12} className="text-[#0da6f2]" /> : <Key size={12} className="text-slate-500" />}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
});

// Helper component for Modal rows
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-4">
    <div className="size-9 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">{icon}</div>
    <div className="flex flex-col truncate">
        <span className="text-[9px] uppercase text-slate-500 font-bold tracking-widest">{label}</span>
        <span className="text-sm text-slate-200 truncate">{value}</span>
    </div>
  </div>
);

// 2. Memoized UserRow
const UserRow = memo(({ user, onInfoClick }) => {
  const [imgError, setImgError] = useState(false);
  
  const truncate = (str, limit) => str?.length > limit ? `${str.substring(0, limit)}...` : str;
  const joinDate = useMemo(() => 
    user.createdAt?.seconds ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'
  , [user.createdAt]);

  return (
    <div className="bg-[#16252d] p-4 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-[#0da6f2]/30 transition-all mb-3 shadow-sm">
      <div className="flex items-center gap-4 w-full md:w-[25%]">
        <div className="size-10 rounded-xl bg-[#101c22] border border-white/5 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
          {user.photoURL && !imgError ? (
              <img 
                src={user.photoURL} 
                alt="" 
                className="w-full h-full object-cover" 
                onError={() => setImgError(true)}
                loading="lazy"
              />
          ) : (
              <UserAvatarIcon size={20} className="text-white opacity-60" />
          )}
        </div>
        <h4 className="font-bold text-white text-sm truncate">
            <span className="md:hidden">{truncate(user.name, 11)}</span>
            <span className="hidden md:block">{truncate(user.name, 15)}</span>
        </h4>
      </div>

      <div className="hidden md:flex items-center gap-2 text-slate-400 text-xs w-[25%] truncate">{user.email}</div>
      <div className="hidden lg:flex items-center justify-center w-[15%] text-[#0da6f2] opacity-70">
          {user.provider === "google" ? <Chrome size={16} /> : <Mail size={16} />}
      </div>
      <div className="hidden md:flex items-center gap-2 text-slate-400 text-xs w-[20%] uppercase font-medium tracking-tighter">
          {joinDate}
      </div>
      <button 
        onClick={() => onInfoClick(user)} 
        className="p-2.5 rounded-xl bg-[#0da6f2]/5 text-[#0da6f2] hover:bg-[#0da6f2] hover:text-white transition-all shadow-lg active:scale-95 shrink-0"
      >
        <Info size={18} />
      </button>
    </div>
  );
});

const Users = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const itemsPerPage = 5;
  const adminUid = import.meta.env.VITE_admin_uid;

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const coll = collection(db, "users");
        const q = query(coll, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        const usersList = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(user => user.uid !== adminUid);
          
        if (isMounted) setAllUsers(usersList);
      } catch (err) { 
        console.error(err); 
      } finally { 
        if (isMounted) setLoading(false); 
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [adminUid]);

  const { currentUsers, totalPages } = useMemo(() => {
    const total = Math.ceil(allUsers.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    return {
      currentUsers: allUsers.slice(start, start + itemsPerPage),
      totalPages: total || 1
    };
  }, [allUsers, currentPage]);

  const handleInfoClick = useCallback((user) => setSelectedUser(user), []);
  const closeModal = useCallback(() => setSelectedUser(null), []);

  if (loading) return (
    <div className="h-[60vh] flex items-center justify-center text-[#0da6f2]">
        <Loader2 className="animate-spin" size={40} />
    </div>
  );

  return (
    <div className="flex flex-col animate-in fade-in duration-500 relative min-h-[500px]">
      <UserDetailsModal user={selectedUser} onClose={closeModal} />

      {allUsers.length > 0 && (
        <div className="hidden md:flex items-center justify-between px-6 mb-6 mt-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest opacity-60">
            <span className="w-[25%]">Profile</span>
            <span className="w-[25%]">Email Address</span>
            <span className="hidden lg:block w-[15%] text-center">Provider</span>
            <span className="w-[20%]">Joined Date</span>
            <span className="w-fit">Actions</span>
        </div>
      )}

      <div className="flex-1">
        {currentUsers.length > 0 ? (
          currentUsers.map((user) => (
            <UserRow key={user.id} user={user} onInfoClick={handleInfoClick} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-4">
             <div className="p-6 bg-white/5 rounded-full border border-white/5">
                <UserAvatarIcon size={40} className="opacity-20" />
             </div>
             <p className="text-sm font-medium tracking-wide">No users found in the system.</p>
          </div>
        )}
      </div>

      {allUsers.length > itemsPerPage && (
        <div className="py-8 flex items-center justify-center gap-3">
          <button 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="p-2 rounded-lg bg-[#16252d] text-slate-400 disabled:opacity-20 hover:text-[#0da6f2] transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#0da6f2] bg-[#0da6f2]/10 px-3 py-1 rounded-md">Page {currentPage}</span>
            <span className="text-xs font-bold text-slate-500/50">of {totalPages}</span>
          </div>

          <button 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="p-2 rounded-lg bg-[#16252d] text-slate-400 disabled:opacity-20 hover:text-[#0da6f2] transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Users;