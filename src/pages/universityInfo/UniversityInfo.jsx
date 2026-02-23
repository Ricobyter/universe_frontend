/**
 * University Info Page Component
 * 
 * Comprehensive university details page.
 * Displays all information about a single university.
 * 
 * Features:
 * - University header with logo and basic info
 * - General information section
 * - Additional details (fees, faculty, etc.)
 * - Specializations/programs
 * - Contact details
 * - Description
 * - Similar institutions recommendations
 * - User reviews section
 * - Theme toggle (dark/light mode)
 * - View count tracking
 * 
 * Layout:
 * - 3-column grid on large screens
 * - Main content in left 2 columns
 * - Sidebar in right column
 * - Responsive stacking on smaller screens
 * 
 * Data Flow:
 * - Fetches university data on mount
 * - Increments view count
 * - URL parameter determines which university to show
 */

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import UniversityHeader from "../../components/universityInfo/UniversityHeader";
import GeneralInfoSection from "../../components/universityInfo/GeneralInfoSection";
import AdditionalDetailsSection from "../../components/universityInfo/AdditionalDetailsSection";
import SpecializationsSection from "../../components/universityInfo/SpecializationsSection";
import ContactDetailsSection from "../../components/universityInfo/ContactDetailsSection";
import DescriptionSection from "../../components/universityInfo/DescriptionSection";
import SimilarInstitutionsSection from "../../components/universityInfo/SimilarInstitutionsSection";
import UserReviewsSection from "../../components/universityInfo/UserReviewsSection";
import { api } from "../../config/api";

export default function UniversityInfo() {
  // Get university ID from URL
  const { id } = useParams();
  
  // University data state
  const [university, setUniversity] = useState(null);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  /**
   * Fetch university data and track view
   * Runs when component mounts or ID changes
   */
  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        // Fetch university details
        const response = await fetch(api.universities.getById(id));
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch university");
        }

        setUniversity(data);

        // Increment view count - fire and forget
        // Silently fails if analytics endpoint is down
        try {
          await fetch(api.universities.recordView(id), {
            method: 'POST'
          });
        } catch (viewErr) {
          // Don't break user experience if view tracking fails
          console.error('Failed to increment view:', viewErr);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversity();
  }, [id]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-[#0B0C10]' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#00FF00] mx-auto"></div>
          <p className={`mt-4 ${darkMode ? 'text-[#FFFFFF]' : 'text-gray-900'}`}>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-[#0B0C10]' : 'bg-gray-50'}`}>
        <div className="text-center">
          <p className="text-[#ff4444] text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (!university) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-[#0B0C10]' : 'bg-gray-50'}`}>
        <div className="text-center">
          <p className={darkMode ? 'text-[#FFFFFF]' : 'text-gray-900'}>University not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#0B0C10]' : 'bg-gray-50'}`}>
      {/* Theme Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`fixed top-20 right-4 z-50 p-2 md:p-3 rounded-full shadow-lg ${
          darkMode ? 'bg-[#121212] text-[#00FF00] border border-[#004F4F]' : 'bg-white text-gray-900'
        }`}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>

      <UniversityHeader university={university} darkMode={darkMode} />
      
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <GeneralInfoSection university={university} darkMode={darkMode} />
            <AdditionalDetailsSection university={university} darkMode={darkMode} />
            <SpecializationsSection university={university} darkMode={darkMode} />
            <DescriptionSection university={university} darkMode={darkMode} />
            <UserReviewsSection universityId={id} darkMode={darkMode} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-4 md:space-y-6">
            <ContactDetailsSection university={university} darkMode={darkMode} />
            <SimilarInstitutionsSection university={university} darkMode={darkMode} />
          </div>
        </div>
      </div>
    </div>
  );
}
