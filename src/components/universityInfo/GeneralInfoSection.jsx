import React from "react";

export default function GeneralInfoSection({ university, darkMode }) {
  const infoItems = [
    { label: "COUNTRY", value: university.country },
    { label: "STATE / PROVINCE", value: university.state },
    { label: "EST.", value: university.establishedYear },
    { label: "TYPE", value: university.type },
  ];

  return (
    <div className={`rounded-xl p-4 md:p-6 ${
      darkMode ? 'bg-[#111111] border border-[#00573D]/50' : 'bg-white shadow-md'
    }`}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 md:h-6 bg-light-green rounded-full"></div>
        <h2 className={`text-base md:text-xl font-bold ${darkMode ? 'text-light-green' : 'text-gray-900'}`}>
          GENERAL INFO
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {infoItems.map((item, index) => (
          <div key={index}>
            <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {item.label}
            </p>
            <p className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
