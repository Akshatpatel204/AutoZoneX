import React, { useState, useEffect } from "react";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import {
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    onAuthStateChanged,
    updateProfile,
} from "firebase/auth";
import { auth, db } from "../firebase-config";

// const HERO_BG = "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1920";
const HERO_BG = "https://lh3.googleusercontent.com/aida-public/AB6AXuDFPK48vmTx1lHj0n4NCF6j_cTK6iL91jM9oco2vW2Ty33O4nbtmvNNFXuT1yZN6DCV3jd9iAGmvJ2uXMj6XRWokZCloNMvyD-Cx-KhHMprsPytkwfx6HuI3X0Pta1VLJgErOCF6rkxJb9oYDEJ2rvD6UfmTSaUhKITmtdM3C9B9jfefi5eVMr3kpq4trTdHqxC8Vcdpya7zezsssHdKxJH6fn4bCU5PxlR_wykwqpxAzhVk3E8rmjDoqCjpjidBE0drE9-ayhTYKgy";


const Login = () => {
    const navigate = useNavigate();
    const provider = new GoogleAuthProvider();

    const [isSignup, setIsSignup] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const [sName, setSName] = useState("");
    const [sEmail, setSEmail] = useState("");
    const [sPassword, setSPassword] = useState("");

    const [lEmail, setLEmail] = useState("");
    const [lPassword, setLPassword] = useState("");

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if (user) navigate("/");
            setSName("");
            setSEmail("");
            setSPassword("");
            setLEmail("");
            setLPassword("");
        });
        return () => unsub();
    }, [navigate]);

    useEffect(() => {
        setSName("");
        setSEmail("");
        setSPassword("");
        setLEmail("");
        setLPassword("");
    }, [isSignup]);

    const googleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            // 🔥 Save only if user does NOT already exist
            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    uid: user.uid,
                    name: user.displayName || "Google User",
                    email: user.email,
                    photoURL: user.photoURL || "",
                    provider: "google",
                    role: "user",
                    createdAt: serverTimestamp()
                });
            }

            // 🔐 Admin check
            if (user.uid === import.meta.env.VITE_admin_uid) {
                navigate("/admin/home");
            } else {
                navigate("/");
            }

        } catch (err) {
            alert(err.message);
        }
    };


    const signup = async (e) => {
        e.preventDefault();
        if (!sName || !sEmail || !sPassword) return alert("All fields required");
        try {
            const res = await createUserWithEmailAndPassword(auth, sEmail, sPassword);
            await updateProfile(res.user, { displayName: sName });

            // 🔥 Save user to Firestore
            await setDoc(doc(db, "users", res.user.uid), {
                uid: res.user.uid,
                name: sName,
                email: sEmail,
                provider: email,
                role: "user", // 👈 default role
                createdAt: new Date()
            });

            navigate("/");
        } catch (err) {
            alert(err.message);
        }
    };

    const login = async (e) => {
        e.preventDefault();
        if (!lEmail || !lPassword) return alert("All fields required");

        try {
            const res = await signInWithEmailAndPassword(auth, lEmail, lPassword);

            // Check if the UID matches your Admin UID
            if (res.user.uid === import.meta.env.VITE_admin_uid) {
                navigate("/admin/home"); // Redirect to Admin Panel
            } else {
                navigate("/"); // Redirect to User Home
            }
        } catch (err) {
            alert(err.message);
        }
    };

    const forgotPassword = async () => {
        if (!lEmail) return alert("Enter email first");
        await sendPasswordResetEmail(auth, lEmail);
        alert("Password reset email sent");
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 font-[Inter] text-white">

            {/* LEFT HERO */}
            <div
                className="relative hidden lg:flex flex-col justify-between p-5"
                style={{
                    backgroundImage: `linear-gradient(to right, rgba(2,6,23,.9), rgba(2,6,23,.6)), url(${HERO_BG})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="flex items-center gap-2 text-lg font-bold mt-5">
                    <span className="material-symbols-outlined text-primary text-4xl">speed</span>
                    <span style={{ fontFamily: "Orbitron" }}>AUTOZONEX</span>
                </div>

                <div className="max-w-xl  flex flex-wrap pl-3" style={{ fontFamily: " Inter,sans-serif" }}>
                    <span className=" font-[5000] leading-tight text-6xl" style={{ fontFamily: " 'Inter',sans-serif" }} >
                        Precision<br /> Reviews.
                        <br />
                        <span className="text-blue-500 italic" style={{ fontFamily: " 'Inter',sans-serif" }}>Premium<br /> Performance.</span>
                    </span>
                    <p className="mt-6  text-slate-300" style={{ fontFamily: " 'Inter',sans-serif" }}>
                        Join the elite community of automotive enthusiasts.
                        Access exclusive insights, deep-dive reviews, and premium services.
                    </p>
                </div>

                <div className="flex gap-6 text-sm text-slate-400">
                    <span>© 2024 AutoZoneX Inc.</span>
                    <Link href="#">Privacy</Link>
                    <Link href="#">Terms</Link>
                </div>
            </div>

            {/* RIGHT FORM */}
            <div className="flex items-center justify-center bg-[#020617] px-6">
                <div className="w-full max-w-md space-y-7">

                    <div>
                        <h2 className="text-3xl font-semibold" style={{ fontFamily: " 'Inter',sans-serif" }}>
                            {isSignup ? "Create an Account" : "Welcome Back"}
                        </h2>
                        <p className="mt-2 text-slate-400" >
                            {isSignup
                                ? "Join the ultimate destination for automotive data."
                                : "Enter your credentials to access your garage."}
                        </p>
                    </div>

                    {/* TOGGLE */}
                    <div className="flex rounded-lg bg-slate-800 p-1 mb-3">
                        <button
                            onClick={() => {
                                setIsSignup(false);
                            }}
                            className={`flex-1 py-2 rounded-md text-sm ${!isSignup ? "bg-slate-900" : "text-slate-400"
                                }`}
                            style={{ fontFamily: " 'Inter',sans-serif" }}

                        >
                            Login
                        </button>
                        <button
                            onClick={() => {
                                setIsSignup(true);
                            }}
                            className={`flex-1 py-2 rounded-md text-sm ${isSignup ? "bg-slate-900" : "text-slate-400"
                                }`}
                            style={{ fontFamily: " 'Inter',sans-serif" }}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* FORM */}
                    <form
                        onSubmit={isSignup ? signup : login}
                        className="space-y-5"
                    >
                        {isSignup && (
                            <div className="mt-3">
                                <label className="block mb-1 text-sm">Username</label>
                                <input
                                    value={sName}
                                    onChange={(e) => setSName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700"
                                    placeholder="johndoe_99"
                                />
                            </div>
                        )}

                        <div className="mt-3">
                            <label className="block mb-1 text-sm">Email Address</label>
                            <input
                                type="email"
                                value={isSignup ? sEmail : lEmail}
                                onChange={(e) =>
                                    isSignup ? setSEmail(e.target.value) : setLEmail(e.target.value)
                                }
                                className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700"
                                placeholder="name@example.com"
                            />
                        </div>

                        <div className="mt-3">
                            <label className="block mb-1 text-sm">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={isSignup ? sPassword : lPassword}
                                    onChange={(e) =>
                                        isSignup
                                            ? setSPassword(e.target.value)
                                            : setLPassword(e.target.value)
                                    }
                                    className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 "
                                    placeholder="*******"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 "
                                >
                                    👁
                                </button>
                            </div>
                        </div>

                        {!isSignup && (
                            <div className="text-right">
                                <button
                                    type="button"
                                    onClick={forgotPassword}
                                    className="text-sm text-blue-400 hover:underline mt-3"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        <button className={`w-full py-3 bg-blue-600 rounded-lg font-semibold mt-3 ${isSignup ? 'mt-3' : ''}`}>
                            {isSignup ? "Create Account →" : "Sign In →"}
                        </button>
                    </form>

                    <div className="flex items-center gap-3 text-slate-500 text-sm mt-4">
                        <div className="flex-1 h-px bg-slate-700" />
                        OR CONTINUE WITH
                        <div className="flex-1 h-px bg-slate-700" />
                    </div>

                    {/* GOOGLE */}
                    <button
                        onClick={googleLogin}
                        className="w-full flex items-center justify-center gap-3 py-3 border border-slate-700 rounded-lg mt-4"
                    >
                        <img
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            alt="Google"
                            className="w-5 h-5"
                        />
                        Google
                    </button>

                    <p className="text-center text-sm text-slate-400 mt-3">
                        {isSignup ? (
                            <>
                                Already have an account?{" "}
                                <button onClick={() => {
                                    setIsSignup(false);
                                }} className="text-blue-400">
                                    Sign In
                                </button>
                            </>
                        ) : (
                            <>
                                Don’t have an account?{" "}
                                <button onClick={() => {
                                    setIsSignup(true);
                                }} className="text-blue-400">
                                    Sign Up
                                </button>
                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
