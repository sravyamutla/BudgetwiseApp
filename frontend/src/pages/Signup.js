import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";

function Signup() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSignup = async (e) => {
        e.preventDefault();

        if (name && email && password) {
            try {
                const response = await fetch("http://localhost:8081/api/auth/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username: name, email, password }),
                });

                if (response.ok) {
                    setError("");
                    navigate("/login"); // go to login after signup
                } else {
                    const errorText = await response.text();
                    setError(errorText || "Signup failed");
                }
            } catch (err) {
                setError("Failed to connect to server");
            }
        } else {
            setError("Please fill in all fields");
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">

                {/* Left Side: Branding/Illustration */}
                <div className="signup-left">
                    <div className="signup-left-content">
                        <h1>Budgetwise</h1>
                        <p>Join us and start making smart financial decisions.</p>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="signup-right">
                    <div className="signup-form-container">
                        <div className="signup-header">
                            <h2>Create an Account</h2>
                            <p>Sign up to get started.</p>
                        </div>

                        <form onSubmit={handleSignup} className="signup-form">
                            <div className="input-group">
                                <label>Full Name</label>
                                <div className="input-wrapper">
                                    <span className="input-icon">👤</span>
                                    <input
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Email Address</label>
                                <div className="input-wrapper">
                                    <span className="input-icon">✉️</span>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Password</label>
                                <div className="input-wrapper">
                                    <span className="input-icon">🔒</span>
                                    <input
                                        type="password"
                                        placeholder="Create a password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {error && <div className="error-message">{error}</div>}

                            <button type="submit" className="signup-button">
                                Sign Up
                            </button>
                        </form>

                        <div className="signup-footer">
                            <p>
                                Already have an account? <Link to="/login" className="login-link">Sign In</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
