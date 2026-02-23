/**
 * Saved Universities Page Component
 * 
 * Standalone page displaying user's bookmarked/saved universities.
 * (Note: This functionality is also available as a tab in UserProfile.jsx)
 * 
 * Features:
 * - Grid display of saved universities
 * - University cards with images, ratings, and details
 * - Remove from saved (unbookmark) action
 * - Quick navigation to university detail pages
 * - Empty state with call-to-action
 * - Authentication required
 * 
 * Layout:
 * - Responsive grid: 1 col mobile, 2 cols tablet, 3 cols desktop
 * - Each card shows: campus image, logo, name, location, rating, type
 * - Action buttons: View Details, Remove from Saved
 * 
 * Route: /saved-universities (if used standalone)
 * Note: Same functionality exists in UserProfile page as a tab
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaBookmark } from 'react-icons/fa';
import { api } from '../../config/api';

export default function SavedUniversities() {
  const navigate = useNavigate();
  
  // Saved universities state
  const [savedUniversities, setSavedUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch saved universities on component mount
   */
  useEffect(() => {
    fetchSavedUniversities();
  }, []);

  /**
   * Fetch all universities saved/bookmarked by current user
   * Requires authentication - redirects to login if no token
   * Returns full university objects with ratings and details
   */
  const fetchSavedUniversities = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Redirect to login if not authenticated
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(api.users.saved, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSavedUniversities(data.savedUniversities);
      }
    } catch (error) {
      console.error('Error fetching saved universities:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Remove a university from saved list (unbookmark)
   * Optimistically updates UI before server response
   * @param {string} universityId - ID of university to remove
   */
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
        // Optimistically remove from UI
        setSavedUniversities(savedUniversities.filter(uni => uni._id !== universityId));
      }
    } catch (error) {
      console.error('Error removing saved university:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00FF00]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0C10] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#00FF00] mb-2">Saved Universities</h1>
          <p className="text-[#888888]">Universities you've bookmarked for later</p>
        </div>

        {savedUniversities.length === 0 ? (
          <div className="bg-[#121212] border border-[#004F4F] rounded-lg p-12 text-center">
            <FaBookmark className="text-[#888888] text-5xl mx-auto mb-4" />
            <h2 className="text-[#FFFFFF] text-xl mb-2">No saved universities yet</h2>
            <p className="text-[#888888] mb-6">Start exploring and save universities you're interested in</p>
            <button
              onClick={() => navigate('/search')}
              className="bg-[#00FF00] hover:bg-[#00dd00] text-[#0B0C10] px-6 py-3 rounded-lg font-semibold transition"
            >
              Browse Universities
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedUniversities.map((university) => (
              <div
                key={university._id}
                className="bg-[#121212] border border-[#004F4F] rounded-lg overflow-hidden hover:border-[#00FF00] transition group"
              >
                <div
                  className="h-48 bg-cover bg-center cursor-pointer"
                  style={{ backgroundImage: `url(${university.campusImages?.[0] || university.logo})` }}
                  onClick={() => navigate(`/university/${university._id}`)}
                >
                  <div className="h-full bg-gradient-to-b from-black/40 to-black/80 flex items-end p-4">
                    <img
                      src={university.logo}
                      alt={university.name}
                      className="w-12 h-12 rounded-lg border-2 border-white object-cover bg-white"
                    />
                  </div>
                </div>

                <div className="p-4">
                  <h3
                    className="text-[#00FF00] font-semibold text-lg mb-2 cursor-pointer hover:text-[#00dd00] transition"
                    onClick={() => navigate(`/university/${university._id}`)}
                  >
                    {university.name}
                  </h3>
                  
                  <p className="text-[#888888] text-sm mb-3">
                    {university.city && university.state 
                      ? `${university.city}, ${university.state}` 
                      : university.country}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`text-sm ${
                              i < Math.floor(university.ratings?.average || 0)
                                ? 'text-[#00FF00]'
                                : 'text-[#888888]'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[#FFFFFF] text-sm">
                        {university.ratings?.average?.toFixed(1) || '0.0'}
                      </span>
                      <span className="text-[#888888] text-sm">
                        ({university.ratings?.count || 0})
                      </span>
                    </div>

                    {university.type && (
                      <span className="px-2 py-1 bg-[#00FF00]/10 text-[#00FF00] rounded text-xs border border-[#00FF00]/30">
                        {university.type}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/university/${university._id}`)}
                      className="flex-1 bg-[#00FF00] hover:bg-[#00dd00] text-[#0B0C10] px-4 py-2 rounded-lg text-sm font-semibold transition"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleRemoveSaved(university._id)}
                      className="px-4 py-2 bg-[#121212] hover:bg-[#1a1a1a] text-[#FFFFFF] rounded-lg text-sm transition border border-[#004F4F]"
                      title="Remove from saved"
                    >
                      <FaBookmark />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
