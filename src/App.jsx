import Navbar from "./component/Navbar";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Cars from "./pages/Cars";
import Login from "./pages/Login";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase-config.js";
import { useEffect, useState } from "react";
import './App.css';
import Compare from "./pages/Compare.jsx";

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const isLoginPage = location.pathname === "/login";

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 CHECK LOGIN STATUS
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🚪 LOGOUT FUNCTION
  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("userProfile");
      navigate("/login");
    } catch (err) {
      alert("Logout failed");
    }
  };

  if (loading) return null; // or loader

  return (
    <div
      className={`min-h-screen`}
    >
      {/* Navbar only if logged in & not login page */}

      {!isLoginPage && user && <Navbar user={user} logout={logout} />}
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Protected Routes */}
        <Route path="/" element={user ? <Home /> : <Login />} />
        <Route path="/compare" element={user ? <Compare/> : <Login />} />
        <Route path="/cars" element={user ? <Cars /> : <Login />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
