import React from "react";

export default function DescriptionSection({ university, darkMode }) {
  return (
    <div className={`rounded-xl p-4 md:p-6 ${
      darkMode ? 'bg-[#111111] border border-[#00573D]/50' : 'bg-white shadow-md'
    }`}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 md:h-6 bg-light-green rounded-full"></div>
        <h2 className={`text-base md:text-xl font-bold ${darkMode ? 'text-light-green' : 'text-gray-900'}`}>
          DESCRIPTION
        </h2>
      </div>

      <p className={`text-base leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {university.description || `${university.name} is a ${university.type.toLowerCase()} research university located in ${university.state}, ${university.country}. Established in ${university.establishedYear}, it has been a prestigious institution of higher learning.`}
      </p>
    </div>
  );
}
