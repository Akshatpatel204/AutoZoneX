import { useEffect, useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase-config.js";
import './App.css';

// Static Imports
import Navbar from "./component/Navbar";
import Login from "./pages/Login";
import AIChat from "./component/AIChat"; // Import the AI Chat Component

// Lazy Imports
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

const PageLoader = () => (
  <div className="h-screen w-full bg-black flex items-center justify-center">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#0da6f2]"></div>
  </div>
);

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const isAdminPath = location.pathname.startsWith("/admin");
  const isLoginPage = location.pathname === "/login";
  
  // Logic to show Navbar and AI Chat only on User pages (Home, Compare, Detail)
  const isUserPage = ["/", "/compare"].includes(location.pathname) || location.pathname.startsWith("/detail/");
  const isErrorPage = !isUserPage && !isAdminPath && !isLoginPage;

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
    <div className="min-h-screen bg-black text-white">
      {/* Show Navbar and AI Chat only for logged-in non-admin users on specific pages */}
      {user && !isAdmin && isUserPage && (
        <>
          <Navbar user={user} logout={logout} />
          <AIChat />
        </>
      )}

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* User routes */}
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

          {/* Global Error Route */}
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