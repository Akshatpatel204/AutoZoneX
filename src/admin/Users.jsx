import React from 'react';
import { UserPlus, MoreVertical, Mail } from 'lucide-react';

const UserCard = ({ name, email, role }) => (
  <div className="bg-[#16252d] p-5 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-[#0da6f2]/30 transition-all shadow-sm">
    <div className="flex items-center gap-4">
      <div className="size-12 rounded-xl bg-gradient-to-br from-[#0da6f2]/20 to-transparent flex items-center justify-center border border-white/5 text-[#0da6f2] overflow-hidden">
        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} alt="avatar" />
      </div>
      <div>
        <h4 className="font-bold text-white text-sm">{name}</h4>
        <div className="flex items-center gap-2 text-slate-500 text-xs mt-1">
          <Mail size={12}/> {email}
        </div>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <div className="hidden md:block">
        <span className="text-[10px] font-bold text-[#0da6f2] bg-[#0da6f2]/10 px-2 py-1 rounded-full uppercase tracking-tighter">
          {role}
        </span>
      </div>
      <button className="text-slate-600 hover:text-white transition-colors p-1">
        <MoreVertical size={18}/>
      </button>
    </div>
  </div>
);

const Users = () => {
  return (
    <div className="animate-in fade-in duration-500">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <UserCard name="Johnathan Wick" email="wick.j@autoadmin.com" role="Super Admin" />
        <UserCard name="Sarah Connor" email="sarah.c@autoadmin.com" role="Editor" />
        <UserCard name="Bruce Wayne" email="wayne@gotham.com" role="Customer" />
        <UserCard name="Diana Prince" email="diana@themyscira.io" role="Support" />
      </div>
    </div>
  );
};

export default Users;