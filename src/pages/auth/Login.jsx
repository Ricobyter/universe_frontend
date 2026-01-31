import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/userSlice";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import { IoMdArrowBack } from "react-icons/io";
import { api } from "../../config/api";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleBack = () => {
    // Check if there's a 'from' state (where user came from)
    const from = location.state?.from;
    if (from) {
      navigate(from);
    } else {
      navigate("/");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store in Redux and localStorage
      dispatch(setCredentials({
        user: data.user,
        token: data.token
      }));

      // Redirect to dashboard
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col items-center bg-[#0B0C10] dark:bg-[#0B0C10] overflow-x-hidden font-display">
      
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="absolute top-6 left-6 flex items-center gap-2 text-[#888888] hover:text-[#00FF00] transition-colors group"
      >
        <IoMdArrowBack className="text-xl group-hover:translate-x-[-4px] transition-transform" />
        <span className="text-sm font-medium">Back</span>
      </button>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center w-full px-3 py-20">
        <div className="flex flex-col w-full max-w-[400px] items-center">
          {/* Centered Card Container */}
          <div className="bg-[#121212] border border-[#004F4F] rounded-xl p-8 w-full">
            <div className="flex flex-col items-center space-y-4">
              <h1 className="text-[#FFFFFF] tracking-tight font-bricolage text-2xl font-bold leading-tight text-center">
                Login to Your Account
              </h1>
              {error && (
                <div className="w-full bg-[#ff4444]/10 border border-[#ff4444] rounded-lg p-3 text-[#ff4444] text-sm">
                  {error}
                </div>
              )}
              <form className="w-full space-y-4" onSubmit={handleSubmit}>
                {/* Email */}
                <div className="flex flex-col">
                  <label className="text-[#FFFFFF] text-sm font-medium leading-normal pb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#FFFFFF] focus:outline-0 focus:ring-2 focus:ring-[#00FF00] border border-[#004F4F] bg-[#121212] placeholder:text-[#888888] p-2 text-xs font-normal leading-normal transition-all"
                    id="email"
                    placeholder="Enter your email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Password */}
                <div className="flex flex-col">
                  <label className="text-[#FFFFFF] text-sm font-medium leading-normal pb-2" htmlFor="password">
                    Password
                  </label>
                  <div className="relative flex w-full flex-1 items-stretch">
                    <input
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#FFFFFF] focus:outline-0 focus:ring-2 focus:ring-[#00FF00] border border-[#004F4F] bg-[#121212] placeholder:text-[#888888] p-2 text-xs font-normal leading-normal transition-all pr-12"
                      id="password"
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#888888] hover:text-[#00FF00] transition-colors"
                      onClick={() => setShowPassword((v) => !v)}
                      tabIndex={-1}
                    >
                      <span className="material-symbols-outlined cursor-pointer">
                        {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                      </span>
                    </button>
                  </div>
                </div>

                <button
                  className="flex w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg  py-2 px-4 bg-[#00FF00] text-[#0B0C10] text-base font-semibold leading-normal tracking-[0.015em] hover:brightness-110 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#121212] focus:ring-[#00FF00] disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={loading}
                >
                  <span className="truncate text-sm">{loading ? "Logging in..." : "Login"}</span>
                </button>
              </form>
              {/* Secondary Link & Legal Text */}
              <div className="text-center space-y-4 pt-2">
                <p className="text-sm text-[#888888]">
                  Don't have an account?{" "}
                  <button 
                    type="button"
                    className="font-medium text-[#00FF00] hover:underline" 
                    onClick={() => navigate("/signup")}
                  >
                    Sign Up
                  </button>
                </p>
                <button
                  type="button"
                  className="text-sm text-[#888888] hover:text-[#00FF00] transition-colors"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot Password?
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
