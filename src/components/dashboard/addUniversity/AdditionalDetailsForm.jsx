import React from "react";

export default function AdditionalDetailsForm({ formData, onChange }) {
  return (
    <div className="flex flex-col gap-6 text-white">
      <h3 className="text-teal-500 text-lg font-bold pb-3 border-b border-gray-800">Additional Details (Optional)</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="avg-fees" className="text-sm font-medium text-gray-400">
            Average Fees (USD)
          </label>
          <input
            id="avg-fees"
            type="number"
            value={formData.averageFees}
            onChange={(e) => onChange('averageFees', e.target.value)}
            placeholder="e.g., 50000"
            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-teal-500"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="accreditation" className="text-sm font-medium text-gray-400">
            Accreditation
          </label>
          <input
            id="accreditation"
            type="text"
            value={formData.accreditation}
            onChange={(e) => onChange('accreditation', e.target.value)}
            placeholder="e.g., NECHE"
            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="total-students" className="text-sm font-medium text-gray-400">
            Total Students
          </label>
          <input
            id="total-students"
            type="number"
            value={formData.totalStudents}
            onChange={(e) => onChange('totalStudents', e.target.value)}
            placeholder="20000"
            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-teal-500"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="total-faculty" className="text-sm font-medium text-gray-400">
            Total Faculty
          </label>
          <input
            id="total-faculty"
            type="number"
            value={formData.totalFaculty}
            onChange={(e) => onChange('totalFaculty', e.target.value)}
            placeholder="2000"
            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-teal-500"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="campus-area" className="text-sm font-medium text-gray-400">
            Campus Area (acres)
          </label>
          <input
            id="campus-area"
            type="number"
            value={formData.campusArea}
            onChange={(e) => onChange('campusArea', e.target.value)}
            placeholder="5000"
            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="contact-email" className="text-sm font-medium text-gray-400">
            Contact Email
          </label>
          <input
            id="contact-email"
            type="email"
            value={formData.contactEmail}
            onChange={(e) => onChange('contactEmail', e.target.value)}
            placeholder="contact@example.com"
            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-teal-500"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="contact-number" className="text-sm font-medium text-gray-400">
            Contact Number
          </label>
          <input
            id="contact-number"
            type="tel"
            value={formData.contactNumber}
            onChange={(e) => onChange('contactNumber', e.target.value)}
            placeholder="+1 123 456 7890"
            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email-domain" className="text-sm font-medium text-gray-400">
          Email Domain
        </label>
        <input
          id="email-domain"
          type="text"
          value={formData.emailDomain}
          onChange={(e) => onChange('emailDomain', e.target.value)}
          placeholder="e.g., example.edu"
          className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-teal-500"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="uni-description" className="text-sm font-medium text-gray-400">
          Description
        </label>
        <textarea
          id="uni-description"
          rows={4}
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Briefly describe the university..."
          className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 resize-none"
        />
      </div>
    </div>
  );
}
