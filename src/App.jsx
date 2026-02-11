import { useEffect, useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase-config.js";
import './App.css';

// 1. Static Imports (Keep these for the initial load)
import Navbar from "./component/Navbar";
import Login from "./pages/Login";

// 2. Lazy Imports (Load only when needed)
const Home = lazy(() => import("./pages/Home"));
const Compare = lazy(() => import("./pages/Compare.jsx"));
const Detail = lazy(() => import("./pages/detail.jsx"));
const Error = lazy(() => import("./pages/Error.jsx"));

// Admin Lazy Imports
const A_home = lazy(() => import("./admin/A_home.jsx"));
const Dashboard = lazy(() => import("./admin/Dashboard"));
const Inventory = lazy(() => import("./admin/Inventory"));
const AddCar = lazy(() => import("./admin/AddCar"));
const UsersPage = lazy(() => import("./admin/Users"));
const DeleteCar = lazy(() => import("./admin/DeleteCar"));

// A simple loading component for Suspense
const PageLoader = () => (
  <div className="h-screen w-full bg-black flex items-center justify-center">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
  </div>
);

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Optimization: Memoize path checks to avoid recalculation on every minor trigger
  const isAdminPath = location.pathname.startsWith("/admin");
  const isLoginPage = location.pathname === "/login";
  const isUserPage = ["/", "/compare", "/cars"].includes(location.pathname) || location.pathname.startsWith("/detail/");
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

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen">
      {user && !isLoginPage && !isErrorPage && !isAdminPath && (
        <Navbar user={user} logout={logout} />
      )}

      {/* 3. Wrap Routes in Suspense to handle Lazy Loading */}
      <Suspense fallback={<PageLoader />}>
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
      </Suspense>
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