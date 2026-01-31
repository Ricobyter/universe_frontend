import React from "react";

export default function AdditionalDetailsSection({ university, darkMode }) {
  const details = [
    { label: "AVG FEES", value: university.averageFees ? `$${university.averageFees.toLocaleString()}/yr` : 'N/A' },
    { label: "ACCREDITATION", value: university.accreditation || 'N/A' },
    { label: "FACULTY", value: university.totalFaculty ? `${university.totalFaculty.toLocaleString()}+` : 'N/A' },
    { label: "STUDENTS", value: university.totalStudents ? `${university.totalStudents.toLocaleString()}+` : 'N/A' },
    { label: "CAMPUS SIZE", value: university.campusArea ? `${university.campusArea.toLocaleString()} Acres` : 'N/A' },
  ];

  return (
    <div className={`rounded-xl p-4 md:p-6 ${
      darkMode ? 'bg-[#111111] border border-[#00573D]/50' : 'bg-white shadow-md'
    }`}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 md:h-6 bg-light-green rounded-full"></div>
        <h2 className={`text-base md:text-xl font-bold ${darkMode ? 'text-light-green' : 'text-gray-900'}`}>
          ADDITIONAL DETAILS
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
        {details.map((detail, index) => (
          <div key={index}>
            <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {detail.label}
            </p>
            <p className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {detail.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
