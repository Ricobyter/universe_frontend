import React, { useState, useEffect } from "react";
import { FaStar, FaShare, FaBookmark, FaRegBookmark } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { api } from "../../config/api";

export default function UniversityHeader({ university, darkMode }) {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [savingLoading, setSavingLoading] = useState(false);
  
  // Use first campus image or default
  const headerImage = university.campusImages?.[0] || university.logo || 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200';

  useEffect(() => {
    checkIfSaved();
  }, [university._id]);

  const checkIfSaved = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(api.users.checkSaved(university._id), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setIsSaved(data.isSaved);
      }
    } catch (error) {
      console.error('Error checking saved status:', error);
    }
  };

  const handleToggleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to save universities');
      navigate('/login');
      return;
    }

    setSavingLoading(true);
    try {
      const url = api.users.checkSaved(university._id);
      const method = isSaved ? 'DELETE' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setIsSaved(!isSaved);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update saved status');
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      alert('Failed to update saved status');
    } finally {
      setSavingLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: university.name,
          text: `Check out ${university.name}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pt-6">
      {/* Container with rounded corners */}
      <div className="relative h-[200px] md:h-[280px] rounded-2xl overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${headerImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80"></div>
        </div>

        {/* Content */}
        <div className="relative h-full flex items-end p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full">
            {/* University Logo */}
            <div className={`size-16 md:size-20 rounded-xl overflow-hidden border-2 flex-shrink-0 ${
              darkMode ? 'border-light-green' : 'border-white'
            }`}>
              <img 
                src={university.logo} 
                alt={university.name}
                className="w-full h-full object-cover bg-white"
              />
            </div>

            {/* University Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-white text-xl md:text-3xl font-bold mb-1 md:mb-2 flex items-center gap-2 md:gap-3">
                <span className="truncate">{university.name}</span>
                <span className="text-light-green text-lg md:text-2xl flex-shrink-0">●</span>
              </h1>
              <div className="flex items-center gap-2 text-xs md:text-sm">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar 
                      key={i} 
                      className={`text-xs md:text-sm ${
                        i < Math.floor(university.ratings?.average || 0)
                          ? 'text-light-green' 
                          : 'text-gray-500'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-white">
                  {university.ratings?.average?.toFixed(1) || '0.0'} 
                  ({university.ratings?.count || 0} Reviews)
                </span>
              </div>
            </div>

            {/* Action Buttons - Hidden on mobile, shown on desktop */}
            <div className="hidden md:flex gap-3 flex-shrink-0">
              <button
                onClick={handleToggleSave}
                disabled={savingLoading}
                className={`px-4 lg:px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition ${
                  isSaved
                    ? 'bg-light-green text-black hover:bg-light-green/90'
                    : darkMode 
                      ? 'bg-gray-800 text-white hover:bg-gray-700' 
                      : 'bg-white text-gray-900 hover:bg-gray-100'
                }`}
              >
                {savingLoading ? '...' : isSaved ? <FaBookmark /> : <FaRegBookmark />}
                {isSaved ? 'Saved' : 'Save'}
              </button>
              <button
                onClick={() => navigate('/write-review', { state: { university } })}
                className="bg-light-green text-black px-4 lg:px-6 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-light-green/90 transition whitespace-nowrap"
              >
                ✏️ Write Review
              </button>
              <button
                onClick={handleShare}
                className={`px-4 lg:px-6 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition ${
                  darkMode 
                    ? 'bg-gray-800 text-white hover:bg-gray-700' 
                    : 'bg-white text-gray-900 hover:bg-gray-100'
                }`}
              >
                <FaShare /> Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Action Buttons - Below image on mobile */}
      <div className="flex md:hidden gap-3 mt-4">
        <button
          onClick={handleToggleSave}
          disabled={savingLoading}
          className={`px-4 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition ${
            isSaved
              ? 'bg-light-green text-black hover:bg-light-green/90'
              : darkMode 
                ? 'bg-gray-800 text-white hover:bg-gray-700' 
                : 'bg-white text-gray-900 hover:bg-gray-100'
          }`}
        >
          {savingLoading ? '...' : isSaved ? <FaBookmark /> : <FaRegBookmark />}
        </button>
        <button
          onClick={() => navigate('/write-review', { state: { university } })}
          className="flex-1 bg-light-green text-black px-4 py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:bg-light-green/90 transition"
        >
          ✏️ Write Review
        </button>
        <button
          onClick={handleShare}
          className={`px-4 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition ${
            darkMode 
              ? 'bg-gray-800 text-white hover:bg-gray-700' 
              : 'bg-white text-gray-900 hover:bg-gray-100'
          }`}
        >
          <FaShare />
        </button>
      </div>
    </div>
  );
}
