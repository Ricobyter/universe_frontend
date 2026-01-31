import React, { useState, useEffect } from "react";
import { FiX, FiSearch, FiMail, FiCheck } from "react-icons/fi";
import { api } from "../../config/api";

export default function UniversityVerificationModal({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState(1); // 1: Select University, 2: Enter Email, 3: Enter Code
  const [universities, setUniversities] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sentEmail, setSentEmail] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchUniversities();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = universities.filter(uni =>
        uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.state.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUniversities(filtered);
    } else {
      setFilteredUniversities(universities);
    }
  }, [searchQuery, universities]);

  const fetchUniversities = async () => {
    try {
      const response = await fetch(`${api.universities.getAll}?limit=100`);
      if (response.ok) {
        const data = await response.json();
        setUniversities(data.universities || []);
        setFilteredUniversities(data.universities || []);
      }
    } catch (error) {
      console.error('Error fetching universities:', error);
    }
  };

  const handleUniversitySelect = (university) => {
    setSelectedUniversity(university);
    setStep(2);
    setError("");
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(api.verification.sendCode, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          universityId: selectedUniversity._id,
          email
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code');
      }

      setSentEmail(email);
      setStep(3);
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
      const token = localStorage.getItem('token');
      const response = await fetch(api.verification.verifyCode, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          universityId: selectedUniversity._id,
          code
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify code');
      }

      // Update user in localStorage
      const currentUser = JSON.parse(localStorage.getItem('user'));
      const updatedUser = { ...currentUser, University: data.user.University };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      onSuccess(data.user);
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setSelectedUniversity(null);
    setEmail("");
    setCode("");
    setError("");
    setSearchQuery("");
    setSentEmail("");
    onClose();
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setSelectedUniversity(null);
      setEmail("");
    } else if (step === 3) {
      setStep(2);
      setCode("");
    }
    setError("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">
            {step === 1 && "Select Your University"}
            {step === 2 && "Verify Your Email"}
            {step === 3 && "Enter Verification Code"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Select University */}
          {step === 1 && (
            <div>
              <div className="mb-4">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search universities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredUniversities.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No universities found</p>
                ) : (
                  filteredUniversities.map((uni) => (
                    <div
                      key={uni._id}
                      onClick={() => handleUniversitySelect(uni)}
                      className="flex items-center gap-4 p-4 bg-gray-800 hover:bg-gray-750 rounded-lg cursor-pointer transition"
                    >
                      <img
                        src={uni.logo}
                        alt={uni.name}
                        className="w-12 h-12 rounded-lg object-cover bg-white"
                      />
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">{uni.name}</h3>
                        <p className="text-gray-400 text-sm">
                          {uni.state}, {uni.country}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Step 2: Enter Email */}
          {step === 2 && (
            <div>
              <div className="mb-6 p-4 bg-gray-800 rounded-lg flex items-center gap-4">
                <img
                  src={selectedUniversity.logo}
                  alt={selectedUniversity.name}
                  className="w-16 h-16 rounded-lg object-cover bg-white"
                />
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    {selectedUniversity.name}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {selectedUniversity.state}, {selectedUniversity.country}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSendCode}>
                <div className="mb-6">
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    University Email Address
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={`your.email@${selectedUniversity.emailDomain || 'university.edu'}`}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-black border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <p className="text-gray-500 text-xs mt-2">
                    Enter your official university email address
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition"
                  >
                    {loading ? "Sending..." : "Send Verification Code"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 3: Enter Code */}
          {step === 3 && (
            <div>
              <div className="mb-6 text-center">
                <div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiMail className="w-8 h-8 text-teal-500" />
                </div>
                <p className="text-gray-300 mb-2">
                  We've sent a verification code to
                </p>
                <p className="text-white font-semibold">{sentEmail}</p>
              </div>

              <form onSubmit={handleVerifyCode}>
                <div className="mb-6">
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    required
                    className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white text-center text-2xl tracking-widest placeholder-gray-400 focus:outline-none focus:border-teal-500"
                  />
                  <p className="text-gray-500 text-xs mt-2 text-center">
                    Code expires in 10 minutes
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      "Verifying..."
                    ) : (
                      <>
                        <FiCheck className="w-5 h-5" />
                        Verify & Confirm
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    setStep(2);
                    setCode("");
                    setError("");
                  }}
                  className="text-teal-500 hover:text-teal-400 text-sm font-medium"
                >
                  Resend Code
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
