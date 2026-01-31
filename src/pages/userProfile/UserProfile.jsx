import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/base/Header";
import Footer from "../../components/discover/Footer";
import UniversityVerificationModal from "../../components/userProfile/UniversityVerificationModal";
import EditProfileModal from "../../components/userProfile/EditProfileModal";
import { FiEdit2, FiTrash2, FiBookmark } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import { api } from "../../config/api";

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("reviews");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedUniversities, setSavedUniversities] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [userReviews, setUserReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (!token || !userData) {
      navigate("/login");
      return;
    }
    
    setUser(JSON.parse(userData));
    setLoading(false);
    fetchSavedUniversities();
    fetchUserReviews();
  }, [navigate]);

  const fetchUserReviews = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(api.reviews.myReviews, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserReviews(data.reviews || []);
      }
    } catch (error) {
      console.error('Error fetching user reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const fetchSavedUniversities = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(api.users.saved, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSavedUniversities(data.savedUniversities || []);
      }
    } catch (error) {
      console.error('Error fetching saved universities:', error);
    } finally {
      setLoadingSaved(false);
    }
  };

  const handleRemoveSaved = async (universityId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(api.users.removeSaved(universityId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setSavedUniversities(savedUniversities.filter(uni => uni._id !== universityId));
      }
    } catch (error) {
      console.error('Error removing saved university:', error);
    }
  };

  const handleVerificationSuccess = (updatedUser) => {
    setUser(updatedUser);
    // Show success message or notification if needed
  };

  const handleEditProfileSuccess = (updatedUser) => {
    setUser(updatedUser);
    // Show success message or notification if needed
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center">
        <div className="text-[#FFFFFF] text-lg">Loading...</div>
      </div>
    );
  }

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={`text-sm ${
              index < rating ? "text-[#00FF00]" : "text-[#888888]"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0B0C10]">
     
      
      <main className="max-w-7xl mx-auto py-12">
        {/* Profile Header */}
        <div className="bg-[#121212] rounded-2xl border border-[#004F4F] p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#00FF00] to-[#004F4F] flex items-center justify-center">
                  {user?.userImageUrl ? (
                    <img
                      src={user.userImageUrl}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-[#0B0C10] text-5xl font-bold">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  )}
                </div>
                <div className="absolute bottom-2 right-2 w-5 h-5 bg-[#00FF00] rounded-full border-4 border-[#121212]" />
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-[#00FF00] mb-2">{user?.name || "User"}</h1>
                <p className="text-[#888888] mb-4">{user?.email || ""}</p>
                <div className="flex items-center gap-6 text-sm text-[#888888]">
                  <div className="flex items-center gap-2">
                    <span>🏫</span>
                    <span>{user?.University && user.University !== "none" ? user.University : "No university set"}</span>
                    {(!user?.University || user.University === "none") && (
                      <button
                        onClick={() => setIsVerificationModalOpen(true)}
                        className="ml-2 text-[#00FF00] hover:text-[#00dd00] text-xs font-medium underline"
                      >
                        Verify University
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span>👤</span>
                    <span className="capitalize">{user?.role || "user"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Profile Button */}
            <button 
              onClick={() => setIsEditProfileModalOpen(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#00FF00] hover:bg-[#00dd00] text-[#0B0C10] rounded-lg font-medium transition-colors"
            >
              <MdEdit className="text-lg" />
              Edit Profile
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 col-span-1">
            {/* Tabs */}
            <div className="flex items-center gap-1 mb-6 border-b border-[#004F4F]">
              <button
                onClick={() => setActiveTab("reviews")}
                className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors relative ${
                  activeTab === "reviews"
                    ? "text-[#00FF00]"
                    : "text-[#888888] hover:text-[#FFFFFF]"
                }`}
              >
                <span>📝</span>
                My Reviews
                {activeTab === "reviews" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00FF00]" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("saved")}
                className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors relative ${
                  activeTab === "saved"
                    ? "text-[#00FF00]"
                    : "text-[#888888] hover:text-[#FFFFFF]"
                }`}
              >
                <FiBookmark />
                Saved Universities
                {activeTab === "saved" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00FF00]" />
                )}
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "reviews" && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#00FF00] mb-6">My Reviews</h2>
                {loadingReviews ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00FF00] mx-auto"></div>
                  </div>
                ) : userReviews.length === 0 ? (
                  <div className="bg-[#121212] rounded-xl border border-[#004F4F] p-12 text-center">
                    <p className="text-[#888888] mb-4">You haven't written any reviews yet</p>
                    <Link
                      to="/write-review"
                      className="inline-block px-6 py-3 bg-[#00FF00] hover:bg-[#00dd00] text-[#0B0C10] rounded-lg font-semibold transition-colors"
                    >
                      Write Your First Review
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {userReviews.map((review) => (
                      <div
                        key={review._id}
                        className="bg-[#121212] rounded-xl border border-[#004F4F] p-6 hover:border-[#00FF00] transition-colors"
                      >
                        <div className="flex gap-4">
                          {/* University Image */}
                          <img
                            src={review.university?.campusImages?.[0] || review.university?.logo || 'https://images.unsplash.com/photo-1562774053-701939374585?w=400'}
                            alt={review.university?.name}
                            className="w-24 h-24 rounded-lg object-cover"
                          />

                          {/* Review Content */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-[#00FF00] font-semibold text-lg mb-1">
                                  {review.university?.name || 'University'}
                                </h3>
                                <div className="flex items-center gap-3">
                                  {renderStars(review.rating)}
                                  <span className="text-sm text-[#888888]">
                                    Posted on {new Date(review.createdAt).toLocaleDateString('en-US', { 
                                      year: 'numeric', 
                                      month: 'short', 
                                      day: 'numeric' 
                                    })}
                                  </span>
                                </div>
                              </div>
                              <button className="text-[#888888] hover:text-[#FFFFFF] p-2">
                                <BsThreeDotsVertical />
                              </button>
                            </div>
                            <h4 className="text-[#FFFFFF] font-medium text-base mb-2">{review.title}</h4>
                            <p className="text-[#888888] text-sm mb-4 line-clamp-2">{review.reviewText}</p>
                            <div className="flex items-center gap-3">
                              <button className="flex items-center gap-2 px-4 py-2 bg-[#121212] hover:bg-[#1a1a1a] text-[#00FF00] rounded-lg text-sm font-medium transition-colors border border-[#004F4F]">
                                <MdEdit />
                                Edit
                              </button>
                              <button className="flex items-center gap-2 px-4 py-2 bg-[#121212] hover:bg-[#1a1a1a] text-[#888888] hover:text-[#ff4444] rounded-lg text-sm font-medium transition-colors border border-[#004F4F]">
                                <FiTrash2 />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Saved Universities Tab Content */}
            {activeTab === "saved" && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#00FF00] mb-6">Saved Universities</h2>
                {loadingSaved ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00FF00] mx-auto"></div>
                  </div>
                ) : savedUniversities.length === 0 ? (
                  <div className="bg-[#121212] rounded-xl border border-[#004F4F] p-12 text-center">
                    <FiBookmark className="text-[#888888] text-5xl mx-auto mb-4" />
                    <p className="text-[#888888] mb-4">No saved universities yet</p>
                    <Link
                      to="/search"
                      className="inline-block px-6 py-3 bg-[#00FF00] hover:bg-[#00dd00] text-[#0B0C10] rounded-lg font-semibold transition-colors"
                    >
                      Browse Universities
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {savedUniversities.map((uni) => (
                      <div
                        key={uni._id}
                        className="bg-[#121212] rounded-xl border border-[#004F4F] overflow-hidden hover:border-[#00FF00] transition group"
                      >
                        <div
                          className="h-40 bg-cover bg-center cursor-pointer"
                          style={{ backgroundImage: `url(${uni.campusImages?.[0] || uni.logo})` }}
                          onClick={() => navigate(`/university/${uni._id}`)}
                        >
                          <div className="h-full bg-gradient-to-b from-black/40 to-black/80 flex items-end p-4">
                            <img
                              src={uni.logo}
                              alt={uni.name}
                              className="w-12 h-12 rounded-lg border-2 border-white object-cover bg-white"
                            />
                          </div>
                        </div>

                        <div className="p-4">
                          <h3
                            className="text-[#00FF00] font-semibold text-lg mb-2 cursor-pointer hover:text-[#00dd00] transition"
                            onClick={() => navigate(`/university/${uni._id}`)}
                          >
                            {uni.name}
                          </h3>
                          
                          <p className="text-[#888888] text-sm mb-3">
                            {uni.city && uni.state 
                              ? `${uni.city}, ${uni.state}` 
                              : uni.country}
                          </p>

                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              {renderStars(Math.floor(uni.ratings?.average || 0))}
                              <span className="text-[#FFFFFF] text-sm">
                                {uni.ratings?.average?.toFixed(1) || '0.0'}
                              </span>
                              <span className="text-[#888888] text-sm">
                                ({uni.ratings?.count || 0})
                              </span>
                            </div>

                            {uni.type && (
                              <span className="px-2 py-1 bg-[#00FF00]/10 text-[#00FF00] rounded text-xs border border-[#00FF00]/30">
                                {uni.type}
                              </span>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => navigate(`/university/${uni._id}`)}
                              className="flex-1 bg-[#00FF00] hover:bg-[#00dd00] text-[#0B0C10] px-4 py-2 rounded-lg text-sm font-semibold transition"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => handleRemoveSaved(uni._id)}
                              className="px-4 py-2 bg-[#121212] hover:bg-[#1a1a1a] text-[#FFFFFF] rounded-lg text-sm transition border border-[#004F4F]"
                              title="Remove from saved"
                            >
                              <FiBookmark className="fill-current" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          

        </div>
      </main>

      <UniversityVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        onSuccess={handleVerificationSuccess}
      />

      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        user={user}
        onSuccess={handleEditProfileSuccess}
      />

      <Footer />
    </div>
  );
}
