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

  // Define valid user paths including dynamic detail routes
  const exactUserPaths = ["/", "/compare", "/cars", "/login"];
  const isUserPage = exactUserPaths.includes(location.pathname) || location.pathname.startsWith("/detail/");
  
  // Define admin path detection
  const isAdminPath = location.pathname.startsWith("/admin");
  const isLoginPage = location.pathname === "/login";
  
  // A page is an error page if it's not a recognized user page AND not an admin page
  const isErrorPage = !isUserPage && !isAdminPath;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
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

      {/* NAVBAR VISIBILITY LOGIC:
          1. Must have a user logged in
          2. Must NOT be the login page
          3. Must NOT be an error page
          4. Must NOT be an admin path (this is what you requested)
      */}
      {user && !isLoginPage && !isErrorPage && !isAdminPath && (
        <Navbar user={user} logout={logout} />
      )}

      <Routes>
        {/* User routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={user ? (isAdmin ? <Navigate to="/admin" /> : <Home />) : <Login />} />
        <Route path="/compare" element={user ? (isAdmin ? <Navigate to="/admin" /> : <Compare />) : <Login />} />
        <Route path="/detail/:id" element={user ? (isAdmin ? <Navigate to="/admin" /> : <Detail />) : <Login />} />

        {/* Admin routes */}
        <Route path="/admin" element={user && isAdmin ? <A_home user={user} logout={logout} /> : <Login />}>
          <Route index element={<Dashboard />} /> 
          <Route path="inventory" element={<Inventory />} /> 
          <Route path="add-car" element={<AddCar />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="delete-car" element={<DeleteCar />} />
        </Route>

        {/* Global routes */}
        <Route path="*" element={user ? <Error admin={isAdmin} /> : <Login />} />
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