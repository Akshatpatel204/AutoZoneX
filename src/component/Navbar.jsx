import { NavLink } from "react-router-dom";
import { useState } from "react";
import "../styles/nav.css";

const Navbar = ({ user, logout }) => {
    const [dropDown, setDropDown] = useState(false);

    // This helper function makes the code cleaner and easier to debug
    const toggleMenu = () => {
        setDropDown(prev => !prev);
    };

    return (
        <nav>
            <img src="image/nav_logo.jpg" className="logo" alt="Logo" />
            <ul>
                <li>
                    <NavLink to="/" className={({ isActive }) => isActive ? "active" : "disactive"}>
                        Home
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/cars" className={({ isActive }) => isActive ? "active" : "disactive"}>
                        Cars
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/bikes" className={({ isActive }) => isActive ? "active" : "disactive"}>
                        Bikes
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/compare" className={({ isActive }) => isActive ? "active" : "disactive"}>
                        Compare
                    </NavLink>
                </li>
            </ul>

            {/* FIXED: No backticks, no immediate execution */}
            <img 
                src="image/30 dp profile icon.png" 
                className="user-pic" 
                id="profile_btn" 
                onClick={toggleMenu} 
                alt="Profile"
            />

            {/* Using a simple ternary for the class */}
            <div className={dropDown ? "sub-menu-wrap open-menu" : "sub-menu-wrap"} id="subMenu">
                <div className="sub-menu">
                    <div className="user-info">
                        <img src="image/60 dp profile icon .png" alt="User Profile" />
                        <h3 className="user_name">{user?.displayName || "Hello Guest"}</h3>
                    </div>
                    <hr />
                    <a className="sub-menu-link">
                        <img src="image/mail icon.png" alt="Email" />
                        <p className="user_email">{user?.email}</p>
                    </a>
                    <a className="sub-menu-link">
                        <img src="image/call icon.png" alt="Call" />
                        <p>+91 123456789</p>
                    </a>
                    {/* Logout button - avoid href="logout_btn" as it reloads the app */}
                    <button onClick={logout} className="sub-menu-link" style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
                        <img src="image/logout icon.png" alt="Logout" />
                        <p>Logout</p>
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;