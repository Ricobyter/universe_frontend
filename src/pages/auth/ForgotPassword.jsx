import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiCheck } from "react-icons/fi";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { api } from "../../config/api";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Enter Email, 2: Enter Code, 3: New Password
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log('📧 Sending reset code to:', api.auth.forgotPassword);
      const response = await fetch(api.auth.forgotPassword, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send reset code");
      }

      setSuccess("Reset code sent to your email!");
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log('🔑 Verifying code at:', api.auth.verifyResetCode);
      const response = await fetch(api.auth.verifyResetCode, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, code })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid code");
      }

      setSuccess("Code verified! Set your new password.");
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      console.log('🔒 Resetting password at:', api.auth.resetPassword);
      const response = await fetch(api.auth.resetPassword, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, code, newPassword: password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setSuccess("Password reset successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setError("");
    setSuccess("");
    if (step === 2) {
      setStep(1);
      setCode("");
    } else if (step === 3) {
      setStep(2);
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col items-center bg-[#0B0C10] dark:bg-[#0B0C10] overflow-x-hidden font-display">
      <main className="flex flex-1 items-center justify-center w-full px-3 py-20">
        <div className="flex flex-col w-full max-w-[400px] items-center">
          <div className="bg-[#121212] border border-[#004F4F] rounded-xl p-8 w-full">
            <div className="flex flex-col items-center space-y-4">
              <h1 className="text-[#FFFFFF] tracking-tight font-bricolage text-2xl font-bold leading-tight text-center">
                {step === 1 && "Forgot Password"}
                {step === 2 && "Verify Code"}
                {step === 3 && "Set New Password"}
              </h1>

              {error && (
                <div className="w-full bg-[#ff4444]/10 border border-[#ff4444] rounded-lg p-3 text-[#ff4444] text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="w-full bg-[#00FF00]/10 border border-[#00FF00] rounded-lg p-3 text-[#00FF00] text-sm">
                  {success}
                </div>
              )}

              {/* Step 1: Enter Email */}
              {step === 1 && (
                <form className="w-full space-y-4" onSubmit={handleSendCode}>
                  <p className="text-[#888888] text-sm text-center">
                    Enter your email address and we'll send you a code to reset your password.
                  </p>
                  <div className="flex flex-col">
                    <label className="text-[#FFFFFF] text-sm font-medium leading-normal pb-2" htmlFor="email">
                      Email Address
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#888888]" />
                      <input
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#FFFFFF] focus:outline-0 focus:ring-2 focus:ring-[#00FF00] border border-[#004F4F] bg-[#121212] placeholder:text-[#888888] p-2 pl-10 text-xs font-normal leading-normal transition-all"
                        id="email"
                        placeholder="Enter your email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button
                    className="flex w-full min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg py-2 px-4 bg-[#00FF00] text-[#0B0C10] text-base font-semibold leading-normal tracking-[0.015em] hover:brightness-110 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#121212] focus:ring-[#00FF00] disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={loading}
                  >
                    <span className="truncate text-sm">
                      {loading ? "Sending..." : "Send Reset Code"}
                    </span>
                  </button>
                </form>
              )}

              {/* Step 2: Enter Code */}
              {step === 2 && (
                <form className="w-full space-y-4" onSubmit={handleVerifyCode}>
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-[#00FF00]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FiMail className="w-8 h-8 text-[#00FF00]" />
                    </div>
                    <p className="text-[#888888] text-sm">
                      We've sent a 6-digit code to
                    </p>
                    <p className="text-[#FFFFFF] font-semibold">{email}</p>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[#FFFFFF] text-sm font-medium leading-normal pb-2" htmlFor="code">
                      Verification Code
                    </label>
                    <input
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#FFFFFF] focus:outline-0 focus:ring-2 focus:ring-[#00FF00] border border-[#004F4F] bg-[#121212] placeholder:text-[#888888] p-2 text-xs font-normal leading-normal transition-all text-center text-2xl tracking-widest"
                      id="code"
                      placeholder="000000"
                      type="text"
                      maxLength={6}
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                      required
                    />
                    <p className="text-[#888888] text-xs mt-2 text-center">
                      Code expires in 10 minutes
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 px-4 py-2 bg-[#121212] hover:bg-[#004F4F] text-[#FFFFFF] rounded-lg font-medium transition border border-[#004F4F]"
                    >
                      Back
                    </button>
                    <button
                      className="flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-lg py-2 px-4 bg-[#00FF00] text-[#0B0C10] text-base font-semibold leading-normal tracking-[0.015em] hover:brightness-110 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#121212] focus:ring-[#00FF00] disabled:opacity-50 disabled:cursor-not-allowed"
                      type="submit"
                      disabled={loading}
                    >
                      <span className="truncate text-sm">
                        {loading ? "Verifying..." : "Verify Code"}
                      </span>
                    </button>
                  </div>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setCode("");
                        setError("");
                        setSuccess("");
                      }}
                      className="text-[#00FF00] hover:underline text-sm font-medium"
                    >
                      Resend Code
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: New Password */}
              {step === 3 && (
                <form className="w-full space-y-4" onSubmit={handleResetPassword}>
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-[#00FF00]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FiCheck className="w-8 h-8 text-[#00FF00]" />
                    </div>
                    <p className="text-[#888888] text-sm">
                      Code verified! Now set your new password.
                    </p>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[#FFFFFF] text-sm font-medium leading-normal pb-2" htmlFor="password">
                      New Password
                    </label>
                    <div className="relative flex w-full flex-1 items-stretch">
                      <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#888888] z-10" />
                      <input
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#FFFFFF] focus:outline-0 focus:ring-2 focus:ring-[#00FF00] border border-[#004F4F] bg-[#121212] placeholder:text-[#888888] p-2 pl-10 pr-12 text-xs font-normal leading-normal transition-all"
                        id="password"
                        placeholder="Enter new password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#888888] hover:text-[#00FF00] transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[#FFFFFF] text-sm font-medium leading-normal pb-2" htmlFor="confirmPassword">
                      Confirm Password
                    </label>
                    <div className="relative flex w-full flex-1 items-stretch">
                      <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#888888] z-10" />
                      <input
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#FFFFFF] focus:outline-0 focus:ring-2 focus:ring-[#00FF00] border border-[#004F4F] bg-[#121212] placeholder:text-[#888888] p-2 pl-10 pr-12 text-xs font-normal leading-normal transition-all"
                        id="confirmPassword"
                        placeholder="Confirm new password"
                        type={showConfirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#888888] hover:text-[#00FF00] transition-colors"
                        onClick={() => setShowConfirm(!showConfirm)}
                        tabIndex={-1}
                      >
                        {showConfirm ? <FaRegEyeSlash /> : <FaRegEye />}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 px-4 py-2 bg-[#121212] hover:bg-[#004F4F] text-[#FFFFFF] rounded-lg font-medium transition border border-[#004F4F]"
                    >
                      Back
                    </button>
                    <button
                      className="flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-lg py-2 px-4 bg-[#00FF00] text-[#0B0C10] text-base font-semibold leading-normal tracking-[0.015em] hover:brightness-110 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#121212] focus:ring-[#00FF00] disabled:opacity-50 disabled:cursor-not-allowed"
                      type="submit"
                      disabled={loading}
                    >
                      <span className="truncate text-sm">
                        {loading ? "Resetting..." : "Reset Password"}
                      </span>
                    </button>
                  </div>
                </form>
              )}

              {/* Back to Login Link */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  className="text-sm text-[#888888] hover:text-[#FFFFFF]"
                  onClick={() => navigate("/login")}
                >
                  ← Back to Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
