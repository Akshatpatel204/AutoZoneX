import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase-config";
import { Mail, Info, Calendar, Chrome, ChevronLeft, ChevronRight, Loader2, X, Hash, Copy, Check, ShieldCheck, User as UserAvatarIcon, Fingerprint, Key } from 'lucide-react';

const UserDetailsModal = ({ user, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!user) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(user.uid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = user.createdAt?.seconds 
    ? new Date(user.createdAt.seconds * 1000).toLocaleString('en-US', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
      })
    : "Date N/A";

  const isAdmin = user.role?.toLowerCase() === 'admin';
  const roleStyles = isAdmin 
    ? "border-orange-500/30 bg-orange-500/10 text-orange-400" 
    : "border-[#0da6f2]/30 bg-[#0da6f2]/10 text-[#0da6f2]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#16252d] w-full max-w-[380px] h-[520px] rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden p-8 flex flex-col items-center">
        
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
          <X size={22} />
        </button>

        <div className="absolute top-6 left-6 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-[9px] font-bold uppercase tracking-wider">
          {formattedDate}
        </div>

        <div className="size-28 rounded-full border-4 border-slate-800 bg-[#101c22] mt-8 mb-3 overflow-hidden shadow-2xl flex items-center justify-center">
          {user.photoURL && !imgError ? (
            <img 
              src={user.photoURL} 
              alt="profile" 
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
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

        <h2 className="text-2xl font-bold text-white text-center mb-1 tracking-tight">
          {user.name}
        </h2>
        
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${roleStyles} mt-4 mb-10`}>
            <ShieldCheck size={12} />
            <span className="text-[10px] font-bold uppercase tracking-widest">{user.role || 'user'}</span>
        </div>

        <div className="w-full space-y-5 px-2">
            <div className="flex items-center gap-4">
                <div className="size-9 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                    <Mail size={16} />
                </div>
                <div className="flex flex-col truncate">
                    <span className="text-[9px] uppercase text-slate-500 font-bold tracking-widest">Email Address</span>
                    <span className="text-sm text-slate-200 truncate">{user.email}</span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="size-9 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                    <Fingerprint size={16} />
                </div>
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
};

const UserRow = ({ user, onInfoClick }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-[#16252d] p-4 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-[#0da6f2]/30 transition-all mb-3 shadow-sm">
      <div className="flex items-center gap-4 w-full md:w-[25%]">
        <div className="size-10 rounded-xl bg-[#101c22] border border-white/5 overflow-hidden flex items-center justify-center">
          {user.photoURL && !imgError ? (
              <img 
                src={user.photoURL} 
                alt="avatar" 
                className="w-full h-full object-cover" 
                onError={() => setImgError(true)}
              />
          ) : (
              <UserAvatarIcon size={20} className="text-white opacity-60" />
          )}
        </div>
        <h4 className="font-bold text-white text-sm truncate">{user.name}</h4>
      </div>
      <div className="hidden md:flex items-center gap-2 text-slate-400 text-xs w-[25%] truncate">{user.email}</div>
      <div className="hidden lg:flex items-center justify-center w-[15%] text-[#0da6f2] opacity-70">
          {user.provider === "google" ? <Chrome size={16} /> : <Mail size={16} />}
      </div>
      <div className="hidden md:flex items-center gap-2 text-slate-400 text-xs w-[20%] uppercase font-medium tracking-tighter">
          {user.createdAt?.seconds ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
      </div>
      <button onClick={() => onInfoClick(user)} className="p-2.5 rounded-xl bg-[#0da6f2]/5 text-[#0da6f2] hover:bg-[#0da6f2] hover:text-white transition-all shadow-lg active:scale-95">
        <Info size={18} />
      </button>
    </div>
  );
};

const Users = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const itemsPerPage = 8;

  // Get Admin ID from env
  const adminUid = import.meta.env.VITE_admin_uid;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coll = collection(db, "users");
        const q = query(coll, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        // Map data and filter out the admin UID
        const usersList = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(user => user.uid !== adminUid); // EXCLUDE ADMIN
          
        setAllUsers(usersList);
      } catch (err) { 
        console.error(err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchData();
  }, [adminUid]);

  const totalPages = Math.ceil(allUsers.length / itemsPerPage);
  const currentUsers = allUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <div className="h-screen flex items-center justify-center text-[#0da6f2]"><Loader2 className="animate-spin" size={40} /></div>;

  return (
    <div className="h-screen flex flex-col p-4 animate-in fade-in duration-500 relative bg-[#020617]">
      {selectedUser && <UserDetailsModal user={selectedUser} onClose={() => setSelectedUser(null)} />}

      <div className="hidden md:flex items-center justify-between px-6 mb-6 mt-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest opacity-60">
        <span className="w-[25%]">Profile</span>
        <span className="w-[25%]">Email Address</span>
        <span className="hidden lg:block w-[15%] text-center">Provider</span>
        <span className="w-[20%]">Joined Date</span>
        <span className="w-fit">Actions</span>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {currentUsers.length > 0 ? (
          currentUsers.map((user) => (
            <UserRow key={user.id} user={user} onInfoClick={setSelectedUser} />
          ))
        ) : (
          <div className="text-center text-slate-500 mt-20">No users found.</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="py-6 flex items-center justify-center gap-3">
          <button 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="p-2 rounded-lg bg-[#16252d] text-slate-400 disabled:opacity-20 hover:text-[#0da6f2] transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-xs font-bold text-slate-500 tracking-widest uppercase">Page {currentPage} of {totalPages}</span>
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