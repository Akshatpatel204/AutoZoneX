import { NavLink } from "react-router-dom";
import { useState } from "react";

const Navbar = ({ user, logout , admin }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
        if (isMobileNavOpen) setIsMobileNavOpen(false);
    };

    const toggleMobileNav = () => {
        setIsMobileNavOpen(!isMobileNavOpen);
        if (isProfileOpen) setIsProfileOpen(false);
    };

    // Helper for Route Links: Vertical center, no underline
    const navLinkClass = ({ isActive }) => 
        `flex items-center justify-center h-full no-underline transition-colors text-sm md:text-[15px] ${
            isActive ? "text-primary font-bold no-underline" : "text-white hover:text-gray-400 no-underline"
        } ${admin ? 'hidden' : 'block'}`;

    return (
        <nav className="bg-[#242424] px-6 md:px-[10%] h-14 flex items-center justify-between relative text-white shadow-md">
            
            {/* 1. LEFT: Hamburger (Mobile) */}
            <div className="flex md:hidden flex-1 items-center h-full">
                <button 
                    onClick={toggleMobileNav} 
                    className="text-2xl focus:outline-none cursor-pointer flex items-center h-full bg-transparent border-none text-white"
                >
                    <span className="material-symbols-outlined">
                        {isMobileNavOpen ? 'close' : 'menu'}
                    </span>
                </button>
            </div>

            {/* 2. LOGO: Centered on Mobile */}
            <div className="flex justify-center md:justify-start items-center gap-2 h-full">
                <span className="material-symbols-outlined text-primary text-xl md:text-2xl">speed</span>
                <span style={{ fontFamily: "Orbitron" }} className="text-white font-bold text-base md:text-lg tracking-wider">
                    AUTOZONEX
                </span>
            </div>

            {/* 3. ROUTES: Medium Height Mobile Menu */}
            <ul className={`
                ${isMobileNavOpen ? "flex" : "hidden"} 
                md:flex md:flex-1 md:justify-end items-center list-none h-auto md:h-full
                absolute md:static top-14 left-0 w-full md:w-auto 
                bg-[#242424] md:bg-transparent flex-col md:flex-row 
                z-40 py-4 md:py-0 border-t border-gray-700 md:border-0 md:pr-8 
                shadow-2xl md:shadow-none
            `}>
                <li className="flex items-center justify-center my-2 md:my-0 md:mx-4 md:h-full w-full md:w-auto pt-3">
                    <NavLink to="/" className={navLinkClass} onClick={() => setIsMobileNavOpen(false)}>
                        Home
                    </NavLink>
                </li>
                <li className="flex items-center justify-center my-2 md:my-0 md:mx-4 md:h-full w-full md:w-auto pt-3">
                    <NavLink to="/compare" className={navLinkClass} onClick={() => setIsMobileNavOpen(false)}>
                        Compare
                    </NavLink>
                </li>
            </ul>

            {/* 4. RIGHT: Profile Icon */}
            <div className="flex flex-1 md:flex-none justify-end items-center h-full">
                <img 
                    src={user?.photoURL || "/image/profile_icon_30.png"} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full cursor-pointer hover:ring-2 ring-primary transition-all object-cover block" 
                    onClick={toggleProfile}
                />
            </div>

            {/* PROFILE DROPDOWN: Name, Email, Phone, Logout */}
            <div className={`absolute top-full right-4 md:right-[10%] w-72 md:w-80 z-50 overflow-hidden transition-all duration-400 ease-in-out ${isProfileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"}`}>
                <div className="bg-white text-[#525252] mt-1 p-4 rounded-lg shadow-2xl">
                    
                    {/* User Header: Profile Image & Name */}
                    <div className="flex items-center mb-1">
                        <img src={user?.photoURL || "/image/profile_icon_60.png"} className="w-11 h-11 rounded-full mr-4 object-cover " alt="User" />
                        <div className="overflow-hidden">
                            <h3 className="font-bold text-base leading-tight truncate m-0">
                                {user?.displayName || "Hello Guest"}
                            </h3>
                            <p className="text-[10px] text-gray-400 m-0 uppercase tracking-tighter">Account Member</p>
                        </div>
                    </div>

                    <hr className="border-0 h-[1px] bg-gray-100 my-3" />

                    {/* Email Info */}
                    <div className="flex items-center mb-3 p-1">
                        <img src="/image/mail icon.png" className="w-7 bg-gray-50 p-1.5 rounded-full mr-3 " alt="Email" />
                        <p className="text-sm text-gray-600 m-0 truncate no-underline">{user?.email || "No email provided"}</p>
                    </div>

                    {/* Phone Info */}
                    <div className="flex items-center mb-3 p-1">
                        <img src="/image/call icon.png" className="w-7 bg-gray-50 p-1.5 rounded-full mr-3" alt="Phone" />
                        <p className="text-sm text-gray-600 m-0 no-underline">+91 123456789</p>
                    </div>

                    {/* <hr className="border-0 h-[1px] bg-gray-100 my-3" /> */}

                    {/* Logout Button */}
                    <button 
                        onClick={logout} 
                        className="group flex items-center w-full hover:bg-red-50 p-1 rounded-md transition-all text-left cursor-pointer border-none bg-transparent"
                    >
                        <img src="/image/logout icon.png" className="w-8 bg-gray-100 p-2 rounded-full mr-3 group-hover:bg-red-100" alt="Logout" />
                        <p className="flex-1 text-sm font-medium text-red-600 m-0 no-underline">Logout</p>
                        <span className="text-red-600 group-hover:translate-x-1 transition-transform">&gt;</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;