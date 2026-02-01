import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    onAuthStateChanged,
    updateProfile,
} from "firebase/auth";
import { auth } from "../firebase-config";

// 🔷 LOGO
import logo from "../assets/react.svg";

const Login = () => {
    const navigate = useNavigate();
    const provider = new GoogleAuthProvider();

    const [mode, setMode] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // 🔐 Auto redirect
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if (user) navigate("/");
        });
        return () => unsub();
    }, [navigate]);

    // 🔵 Google Login
    const googleLogin = async () => {
        try {
            await signInWithPopup(auth, provider);
            navigate("/");
        } catch (err) {
            alert(err.message);
        }
    };

    // 🟢 Signup
    const signup = async (e) => {
        e.preventDefault();
        if (!name || !email || !password) return alert("All fields required");

        const res = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(res.user, { displayName: name });
        navigate("/");
    };

    // 🔵 Login
    const login = async (e) => {
        e.preventDefault();
        if (!email || !password) return alert("All fields required");

        await signInWithEmailAndPassword(auth, email, password);
        navigate("/");
    };

    // 🔴 Forgot Password
    const forgotPassword = async () => {
        if (!email) return alert("Enter email first");
        await sendPasswordResetEmail(auth, email);
        alert("Password reset email sent");
    };

    return (
        <div className="min-h-screen flex bg-[#0b0f1a] text-white">
            {/* LEFT – BRAND / IMAGE */}
            <div className="hidden lg:flex w-1/2 relative">
                <img
                    src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738"
                    alt="AutoZoneX Car"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/70 to-black/30 p-16 flex flex-col justify-between">
                    {/* LOGO */}
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="AutoZoneX" className="h-10 w-auto" />
                        <span className="text-xl font-extrabold tracking-wide">
                            AUTOZONEX
                        </span>
                    </div>

                    {/* TEXT */}
                    <div className="max-w-lg space-y-4">
                        <h1 className="text-5xl font-black leading-tight">
                            Precision Reviews.
                            <br />
                            Premium Performance.
                        </h1>
                        <p className="text-gray-300 text-lg">
                            Join the elite community of automotive enthusiasts. Access
                            exclusive insights, deep-dive reviews, and premium services.
                        </p>
                    </div>

                    {/* FOOTER */}
                    <div className="text-sm text-gray-400 flex gap-6">
                        <span>© 2024 AutoZoneX Inc.</span>
                        <span className="cursor-pointer hover:text-white">Privacy</span>
                        <span className="cursor-pointer hover:text-white">Terms</span>
                    </div>
                </div>
            </div>

            {/* RIGHT – AUTH CARD */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md bg-[#0f1629]/90 backdrop-blur-2xl rounded-2xl p-8 sm:p-10 shadow-[0_0_60px_rgba(37,106,244,0.15)] space-y-8">
                    {/* MOBILE LOGO */}
                    <div className="lg:hidden flex justify-center">
                        <img src={logo} alt="AutoZoneX" className="h-10" />
                    </div>

                    {/* HEADER */}
                    <div className="space-y-2 text-center lg:text-left">
                        <h2 className="text-3xl font-bold">Welcome Back</h2>
                        <p className="text-gray-400">
                            Enter your credentials to access your garage.
                        </p>
                    </div>

                    {/* TOGGLE */}
                    <div className="flex bg-[#1a2340] rounded-xl p-1">
                        <button
                            onClick={() => setMode("login")}
                            className={`flex-1 py-2 rounded-lg font-semibold transition ${mode === "login"
                                ? "bg-[#0f1629] text-white shadow"
                                : "text-gray-400"
                                }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setMode("signup")}
                            className={`flex-1 py-2 rounded-lg font-semibold transition ${mode === "signup"
                                ? "bg-[#0f1629] text-white shadow"
                                : "text-gray-400"
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* FORM */}
                    <form
                        onSubmit={mode === "login" ? login : signup}
                        className="space-y-5"
                    >
                        {mode === "signup" && (
                            <input
                                className="w-full h-12 px-4 rounded-xl bg-[#1a2340] focus:outline-none focus:ring-2 focus:ring-blue-600"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        )}

                        <input
                            className="w-full h-12 px-4 rounded-xl bg-[#1a2340] focus:outline-none focus:ring-2 focus:ring-blue-600"
                            placeholder="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <input
                            className="w-full h-12 px-4 rounded-xl bg-[#1a2340] focus:outline-none focus:ring-2 focus:ring-blue-600"
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {mode === "login" && (
                            <div className="flex justify-between items-center text-sm text-gray-400">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" />
                                    Keep me signed in
                                </label>
                                <span
                                    onClick={forgotPassword}
                                    className="text-blue-400 cursor-pointer hover:underline"
                                >
                                    Forgot password?
                                </span>
                            </div>
                        )}

                        <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-bold transition">
                            {mode === "login" ? "Sign In →" : "Create Account"}
                        </button>
                    </form>

                    {/* SOCIAL */}
                    <div className="space-y-4">
                        <div className="text-center text-xs text-gray-500">
                            OR CONTINUE WITH
                        </div>
                        <button
                            onClick={googleLogin}
                            className="border border-gray-600 py-3 rounded-xl hover:bg-white/5 transition w-full"
                        >
                            Google
                        </button>
                    </div>

                    {/* TERMS */}
                    <p className="text-xs text-gray-500 text-center">
                        By continuing, you agree to AutoZoneX’s{" "}
                        <span className="text-blue-400 cursor-pointer">Terms</span> and{" "}
                        <span className="text-blue-400 cursor-pointer">Privacy Policy</span>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
