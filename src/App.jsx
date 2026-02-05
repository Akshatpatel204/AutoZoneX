import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase-config.js";
import './App.css';
import Navbar from "./component/Navbar";
import Home from "./pages/Home";
import Cars from "./pages/Cars";
import Login from "./pages/Login";
import Compare from "./pages/Compare.jsx";
import Error from "./pages/Error.jsx";

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Define your valid paths
  const validPaths = ["/", "/compare", "/cars", "/login"];
  
  // 2. Determine if we are on a "Not Found" / Error page
  const isErrorPage = !validPaths.includes(location.pathname);
  const isLoginPage = location.pathname === "/login";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("userProfile");
      navigate("/login");
    } catch (err) {
      alert("Logout failed");
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen">
      {/* 3. Updated Logic: Hide if login page OR if it's an undefined (error) route */}
      {!isLoginPage && !isErrorPage && user && <Navbar user={user} logout={logout} />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={user ? <Home /> : <Login />} />
        <Route path="/compare" element={user ? <Compare /> : <Login />} />
        <Route path="/cars" element={user ? <Cars /> : <Login />} />
        <Route path="*" element={user ? <Error /> : <Login />} />
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
