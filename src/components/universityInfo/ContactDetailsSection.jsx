import React from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

export default function ContactDetailsSection({ university, darkMode }) {
  const contactItems = [
    {
      icon: <FaEnvelope />,
      label: "Email",
      value: university.contactEmail || 'admissions@' + university.website?.replace('https://', '').replace('http://', '').split('/')[0]
    },
    {
      icon: <FaPhone />,
      label: "Phone",
      value: university.contactNumber || '+1 617-495-1000'
    },
    {
      icon: <FaMapMarkerAlt />,
      label: "Location",
      value: `${university.state}, ${university.country}`
    },
  ];

  return (
    <div className={`rounded-xl p-4 md:p-6 ${
      darkMode ? 'bg-[#111111] border border-[#00573D]/50' : 'bg-white shadow-md'
    }`}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-5 md:h-6 bg-light-green rounded-full"></div>
        <h2 className={`text-base md:text-xl font-bold ${darkMode ? 'text-light-green' : 'text-gray-900'}`}>
          CONTACT DETAILS
        </h2>
      </div>

      <div className="space-y-4">
        {contactItems.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${
              darkMode ? 'bg-light-green/10 text-light-green' : 'bg-green-50 text-green-600'
            }`}>
              {item.icon}
            </div>
            <div className="flex-1">
              <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {item.label}
              </p>
              <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {university.website && (
        <a
          href={university.website}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 block w-full text-center bg-light-green text-black font-semibold py-2.5 rounded-lg hover:bg-light-green/90 transition"
        >
          Visit Website
        </a>
      )}
    </div>
  );
}
