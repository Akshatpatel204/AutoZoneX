import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase-config.js";
import './App.css';
import Navbar from "./component/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Compare from "./pages/Compare.jsx";
import Error from "./pages/Error.jsx";
import A_home from "./admin/A_home.jsx";
import Detail from "./pages/detail.jsx";

// Import Admin Sub-pages
import Dashboard from "./admin/Dashboard";
import Inventory from "./admin/Inventory";
import AddCar from "./admin/AddCar";
import UsersPage from "./admin/Users";
import DeleteCar from "./admin/DeleteCar";

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // 1. Define your valid paths for users
  // const validPaths = ["/", "/compare", "/cars", "/login", "/detail", "/admin", "/admin/inventory", "/admin/add-car", "/admin/users", "/admin/delete-car"];
  const user_validPaths = ["/", "/compare", "/cars", "/login", "/detail"];
  const admin_validPaths = ["/admin", "/admin/inventory", "/admin/add-car", "/admin/users", "/admin/delete-car"];



  // 2. Determine if we are on a "Not Found" / Error page
  const isErrorPage = !user_validPaths.includes(location.pathname);
  const isLoginPage = location.pathname === "/login";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Check if the current user's UID matches the admin UID
        setIsAdmin(currentUser.uid === import.meta.env.VITE_admin_uid);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
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
        {/* User rpotes */}
        <Route path="/login" element={<Login />} />
       <Route path="/" element={user ? (isAdmin ? <Navigate to="/admin" /> : <Home />) : <Login />} />
        <Route path="/compare" element={user ? (isAdmin ? <Navigate to="/admin" /> : <Compare />) : <Login />} />
        <Route path="/detail" element={user ? (isAdmin ? <Navigate to="/admin" /> : <Detail />) : <Login />} />

        {/* Admin routes */}
        <Route path="/admin" element={user && isAdmin ? <A_home user={user} logout={logout} /> : <Login />}>
          <Route index element={<Dashboard />} /> {/* Default: /admin */}
          <Route path="inventory" element={<Inventory />} /> {/* /admin/inventory */}
          <Route path="add-car" element={<AddCar />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="delete-car" element={<DeleteCar />} />
        </Route>

        {/* Global routes */}
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
