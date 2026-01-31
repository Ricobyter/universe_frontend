import React from "react";
import { FaImage } from "react-icons/fa6";

export default function GeneralInfoForm({ formData, onChange }) {
  return (
    <div className="flex flex-col gap-6 text-white">
      <h3 className="text-teal-500 text-lg font-bold pb-3 border-b border-gray-800">General Info</h3>
      <div className="flex flex-col gap-2">
        <label htmlFor="uni-name" className="text-sm font-medium text-gray-400">
          University Name <span className="text-red-500">*</span>
        </label>
        <input
          id="uni-name"
          type="text"
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="e.g., Harvard University"
          className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-teal-500"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="uni-logo" className="text-sm font-medium text-gray-400">
          University Logo (Optional)
        </label>
        <div className="flex items-center gap-4">
          <div className="size-16 bg-black border border-gray-700 rounded-lg flex items-center justify-center">
            <span className="text-gray-400"><FaImage /></span>
          </div>
          <input
            id="uni-logo"
            type="file"
            accept="image/*"
            onChange={(e) => onChange('logo', e.target.files[0])}
            className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-600/20 file:text-teal-500 hover:file:bg-teal-600/30 file:cursor-pointer"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="uni-country" className="text-sm font-medium text-gray-400">
            Country <span className="text-red-500">*</span>
          </label>
          <input
            id="uni-country"
            type="text"
            value={formData.country}
            onChange={(e) => onChange('country', e.target.value)}
            placeholder="e.g., United States"
            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-teal-500"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="uni-state" className="text-sm font-medium text-gray-400">
            State / Province <span className="text-red-500">*</span>
          </label>
          <input
            id="uni-state"
            type="text"
            value={formData.state}
            onChange={(e) => onChange('state', e.target.value)}
            placeholder="e.g., Massachusetts"
            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-teal-500"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="uni-established" className="text-sm font-medium text-gray-400">
            Established Year <span className="text-red-500">*</span>
          </label>
          <input
            id="uni-established"
            type="number"
            value={formData.establishedYear}
            onChange={(e) => onChange('establishedYear', e.target.value)}
            placeholder="e.g., 1636"
            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-teal-500"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="uni-type" className="text-sm font-medium text-gray-400">
            Type <span className="text-red-500">*</span>
          </label>
          <select
            id="uni-type"
            value={formData.type}
            onChange={(e) => onChange('type', e.target.value)}
            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-teal-500"
            required
          >
            <option value="">Select Type</option>
            <option value="Public">Public</option>
            <option value="Private">Private</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="uni-website" className="text-sm font-medium text-gray-400">
          Website URL <span className="text-red-500">*</span>
        </label>
        <input
          id="uni-website"
          type="url"
          value={formData.website}
          onChange={(e) => onChange('website', e.target.value)}
          placeholder="https://www.example.com"
          className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-teal-500"
          required
        />
      </div>
    </div>
  );
}
