import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    onAuthStateChanged,
    updateProfile
} from "firebase/auth";
import { auth } from "../firebase-config.js";
import "../styles/Login.css";

const Login = () => {
    const navigate = useNavigate();
    const provider = new GoogleAuthProvider();

    const [isSignup, setIsSignup] = useState(true);

    const [sName, setSName] = useState("");
    const [sEmail, setSEmail] = useState("");
    const [sPassword, setSPassword] = useState("");

    const [lEmail, setLEmail] = useState("");
    const [lPassword, setLPassword] = useState("");

    // 🔐 Auto redirect if logged in
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) navigate("/");
        });
    }, []);

    // 🔵 Google Login
    const googleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            localStorage.setItem("userProfile", JSON.stringify(result.user));
            navigate("/");
        } catch (err) {
            alert(err.message);
        }
    };

    // 🟢 Signup
    const signup = async (e) => {
        e.preventDefault();
        if (!sName || !sEmail || !sPassword) return alert("All fields required");

        try {
            const result = await createUserWithEmailAndPassword(auth, sEmail, sPassword);
            await updateProfile(result.user, { displayName: sName });
            navigate("/");
        } catch (err) {
            alert(err.message);
        }
    };

    // 🔵 Login
    const login = async (e) => {
        e.preventDefault();
        if (!lEmail || !lPassword) return alert("All fields required");

        try {
            await signInWithEmailAndPassword(auth, lEmail, lPassword);
            navigate("/");
        } catch (err) {
            alert(err.message);
        }
    };

    // 🔴 Forgot Password
    const forgotPassword = async () => {
        if (!lEmail) return alert("Enter email first");
        await sendPasswordResetEmail(auth, lEmail);
        alert("Password reset email sent");
    };

    return (
        <>
            <div className="bg-image"></div>

            <div className={`container ${isSignup ? "active" : ""}`}>

                {/* SIGN UP */}
                <div className="form-container sign-up">
                    <form onSubmit={signup}>
                        <h1 style={{ color: "black" }}>Create Account</h1>

                        <div className="social-icons">
                            <a
                                href="3#"
                                className="icons google-btn"
                                onClick={(e) => {
                                    e.preventDefault();
                                    googleLogin();
                                }}
                            >
                                <i className="bx bxl-google"></i>
                            </a>
                        </div>

                        <input placeholder="Name" value={sName} onChange={e => setSName(e.target.value)} style={{ color: "black" }} />
                        <input type="email" placeholder="Email" value={sEmail} onChange={e => setSEmail(e.target.value)} style={{ color: "black" }} />
                        <input type="password" placeholder="Password" value={sPassword} onChange={e => setSPassword(e.target.value)} style={{ color: "black" }} />

                        <button>Sign Up</button>
                    </form>
                </div>

                {/* SIGN IN */}
                <div className="form-container sign-in">
                    <form onSubmit={login}>
                        <h1>Sign In</h1>

                        <div className="social-icons">
                            <a
                                href="3#"
                                className="icons google-btn"
                                onClick={(e) => {
                                    e.preventDefault();
                                    googleLogin();
                                }}
                            >
                                <i className="bx bxl-google"></i>
                            </a>
                        </div>


                        <input type="email" placeholder="Email" value={lEmail} onChange={e => setLEmail(e.target.value)} style={{ color: "black" }} />
                        <input type="password" placeholder="Password" value={lPassword} onChange={e => setLPassword(e.target.value)} style={{ color: "black" }} />

                        <span onClick={forgotPassword} className="link" style={{ cursor: "pointer" }}>Forgot Password</span>
                        <button>Sign In</button>
                    </form>
                </div>

                {/* TOGGLE */}
                <div className="toggle-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <h1>Welcome To AutoZoneX</h1>
                            <button onClick={() => setIsSignup(false)}>Sign In</button>
                        </div>
                        <div className="toggle-panel toggle-right">
                            <h1>Hii car enthusiast</h1>
                            <button onClick={() => setIsSignup(true)}>Sign Up</button>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
};

export default Login;
