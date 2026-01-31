import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/userSlice";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import { api } from "../../config/api";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
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
      

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center w-full px-3 py-20">
        <div className="flex flex-col w-full max-w-[400px] items-center">
          {/* Centered Card Container */}
          <div className="bg-[#121212] border border-[#004F4F] rounded-xl p-8 w-full">
            <div className="flex flex-col items-center space-y-4">
              <h1 className="text-[#FFFFFF] tracking-tight font-bricolage text-2xl font-bold leading-tight text-center">
                Create Your Account
              </h1>
              {error && (
                <div className="w-full bg-[#ff4444]/10 border border-[#ff4444] rounded-lg p-3 text-[#ff4444] text-sm">
                  {error}
                </div>
              )}
              <form className="w-full space-y-4" onSubmit={handleSubmit}>
                {/* Name */}
                <div className="flex flex-col">
                  <label className="text-[#FFFFFF] text-sm font-medium leading-normal pb-2" htmlFor="name">
                    Name
                  </label>
                  <input
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#FFFFFF] focus:outline-0 focus:ring-2 focus:ring-[#00FF00] border border-[#004F4F] bg-[#121212] placeholder:text-[#888888] p-2 text-xs font-normal leading-normal transition-all"
                    id="name"
                    placeholder="Enter your name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                {/* Email */}
                <div className="flex flex-col">
                  <label className="text-[#FFFFFF] text-sm font-medium leading-normal pb-2" htmlFor="email">
                    Email Address
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
                      placeholder="Create a password"
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
                {/* Confirm Password */}
                <div className="flex flex-col">
                  <label className="text-[#FFFFFF] text-sm font-medium leading-normal pb-2" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <div className="relative flex w-full flex-1 items-stretch">
                    <input
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#FFFFFF] focus:outline-0 focus:ring-2 focus:ring-[#00FF00] border border-[#004F4F] bg-[#121212] placeholder:text-[#888888] p-2 text-xs font-normal leading-normal transition-all pr-12"
                      id="confirmPassword"
                      placeholder="Confirm your password"
                      type={showConfirm ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#888888] hover:text-[#00FF00] transition-colors"
                      onClick={() => setShowConfirm((v) => !v)}
                      tabIndex={-1}
                    >
                      <span className="material-symbols-outlined cursor-pointer">
                        {showConfirm ? <FaRegEyeSlash /> : <FaRegEye />}
                      </span>
                    </button>
                  </div>
                </div>
                <button
                  className="flex w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg  py-2 px-4 bg-[#00FF00] text-[#0B0C10] text-base font-semibold leading-normal tracking-[0.015em] hover:brightness-110 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#121212] focus:ring-[#00FF00] disabled:opacity-50 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={loading}
                >
                  <span className="truncate text-sm">{loading ? "Creating Account..." : "Sign Up"}</span>
                </button>
              </form>
              {/* Secondary Link & Legal Text */}
              <div className="text-center space-y-4 pt-2">
                <p className="text-sm text-[#888888]">
                  Already have an account?{" "}
                  <button 
                    type="button"
                    className="font-medium text-[#00FF00] hover:underline" 
                    onClick={() => navigate("/login")}
                  >
                    Log In
                  </button>
                </p>
                <button
                  type="button"
                  className="text-sm text-[#888888] hover:text-[#00FF00] transition-colors"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot Password?
                </button>
                <p className="text-xs text-[#888888] leading-relaxed">
                  By creating an account, you agree to our{" "}
                  <a className="underline hover:text-[#FFFFFF]" href="#">Terms of Service</a> and{" "}
                  <a className="underline hover:text-[#FFFFFF]" href="#">Privacy Policy</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
