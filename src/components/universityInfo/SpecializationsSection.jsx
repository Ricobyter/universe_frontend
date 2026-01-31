import React from "react";

export default function SpecializationsSection({ university, darkMode }) {
  if (!university.tags || university.tags.length === 0) {
    return null;
  }

  return (
    <div className={`rounded-xl p-4 md:p-6 ${
      darkMode ? 'bg-[#111111] border border-[#00573D]/50' : 'bg-white shadow-md'
    }`}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 md:h-6 bg-light-green rounded-full"></div>
        <h2 className={`text-base md:text-xl font-bold ${darkMode ? 'text-light-green' : 'text-gray-900'}`}>
          SPECIALIZATIONS
        </h2>
      </div>

      <div className="flex flex-wrap gap-2">
        {university.tags.map((tag, index) => (
          <span
            key={index}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              darkMode 
                ? 'bg-light-green/10 text-light-green border border-light-green/30' 
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
