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

export default function UniversityInfo() {
  const { id } = useParams();
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        const response = await fetch(api.universities.getById(id));
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch university");
        }

        setUniversity(data);

        // Increment view count
        try {
          await fetch(`http://localhost:3000/api/universities/${id}/view`, {
            method: 'POST'
          });
        } catch (viewErr) {
          // Silently fail if view increment fails
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
