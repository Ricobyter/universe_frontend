import React, { useEffect, useState } from "react";
import { api } from "../../config/api";

export default function SimilarInstitutionsSection({ university, darkMode }) {
  const [similarUniversities, setSimilarUniversities] = useState([]);

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        const response = await fetch(
          `${api.universities.getAll}?country=${university.country}&type=${university.type}&limit=3`
        );
        const data = await response.json();
        
        // Filter out current university
        const filtered = data.universities.filter(u => u._id !== university._id).slice(0, 3);
        setSimilarUniversities(filtered);
      } catch (err) {
        console.error('Error fetching similar universities:', err);
      }
    };

    fetchSimilar();
  }, [university]);

  if (similarUniversities.length === 0) {
    return null;
  }

  return (
    <div className={`rounded-xl p-4 md:p-6 ${
      darkMode ? 'bg-[#111111] border border-[#00573D]/50' : 'bg-white shadow-md'
    }`}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 md:h-6 bg-light-green rounded-full"></div>
        <h2 className={`text-base md:text-xl font-bold ${darkMode ? 'text-light-green' : 'text-gray-900'}`}>
          SIMILAR INSTITUTIONS
        </h2>
      </div>

      <div className="space-y-3">
        {similarUniversities.map((uni, index) => (
          <a
            key={index}
            href={`/university/${uni._id}`}
            className={`flex items-center gap-3 p-3 rounded-lg transition ${
              darkMode 
                ? 'hover:bg-[#1a1a1a] border border-transparent hover:border-light-green/30' 
                : 'hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <div className={`size-12 rounded-lg overflow-hidden flex-shrink-0 ${
              darkMode ? 'border border-light-green/30' : 'border border-gray-200'
            }`}>
              <img 
                src={uni.logo} 
                alt={uni.name}
                className="w-full h-full object-cover bg-white"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-sm truncate ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {uni.name}
              </p>
              <p className={`text-xs truncate ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {uni.state}, {uni.country}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
