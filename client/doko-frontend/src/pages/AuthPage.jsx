import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/authService";

const AuthPage = () => {
    const [tab, setTab] = useState("login"); // login | signup

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    const [signupData, setSignupData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        location: "",
        userType: "buyer",
    });

    const [error, setError] = useState("");
    const { login, loading } = useAuth();
    const navigate = useNavigate();

    const handleLoginChange = (e) =>
        setLoginData({ ...loginData, [e.target.name]: e.target.value });

    const handleSignupChange = (e) =>
        setSignupData({ ...signupData, [e.target.name]: e.target.value });

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(loginData);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.error || "Login failed!");
        }
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.signup(signupData);
            alert("Account created! Please login");
            setTab("login");
        } catch (err) {
            setError(err.response?.data?.error || "Signup failed!");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white shadow-lg p-8 rounded-xl w-full max-w-md">

                {/* Tabs */}
                <div className="flex mb-6">
                    <button
                        onClick={() => setTab("login")}
                        className={`w-1/2 py-2 font-bold rounded-l-lg ${tab === "login" ? "bg-green-600 text-white" : "bg-gray-200"
                            }`}
                    >
                        LOGIN
                    </button>

                    <button
                        onClick={() => setTab("signup")}
                        className={`w-1/2 py-2 font-bold rounded-r-lg ${tab === "signup" ? "bg-green-600 text-white" : "bg-gray-200"
                            }`}
                    >
                        SIGNUP
                    </button>
                </div>

                {error && <p className="text-red-600 mb-3">{error}</p>}

                {/* Login Form */}
                {tab === "login" && (
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            className="w-full px-3 py-2 border rounded"
                            value={loginData.email}
                            onChange={handleLoginChange}
                            required
                        />
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            className="w-full px-3 py-2 border rounded"
                            value={loginData.password}
                            onChange={handleLoginChange}
                            required
                        />

                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-2 rounded font-bold"
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "LOGIN"}
                        </button>
                    </form>
                )}

                {/* Signup Form */}
                {tab === "signup" && (
                    <form onSubmit={handleSignupSubmit} className="space-y-3">
                        <input
                            name="name"
                            placeholder="Full Name"
                            className="w-full px-3 py-2 border rounded"
                            value={signupData.name}
                            onChange={handleSignupChange}
                            required
                        />
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            className="w-full px-3 py-2 border rounded"
                            value={signupData.email}
                            onChange={handleSignupChange}
                            required
                        />
                        <input
                            name="phone"
                            placeholder="Phone"
                            className="w-full px-3 py-2 border rounded"
                            value={signupData.phone}
                            onChange={handleSignupChange}
                            required
                        />
                        <input
                            name="location"
                            placeholder="Location"
                            className="w-full px-3 py-2 border rounded"
                            value={signupData.location}
                            onChange={handleSignupChange}
                            required
                        />

                        <select
                            name="userType"
                            className="w-full px-3 py-2 border rounded"
                            value={signupData.userType}
                            onChange={handleSignupChange}
                        >
                            <option value="buyer">Buy Products</option>
                            <option value="seller">Sell Products</option>
                        </select>

                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            className="w-full px-3 py-2 border rounded"
                            value={signupData.password}
                            onChange={handleSignupChange}
                            required
                        />

                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-2 rounded font-bold"
                        >
                            CREATE ACCOUNT
                        </button>
                    </form>
                )}

            </div>
        </div>
    );
};

export default AuthPage;
