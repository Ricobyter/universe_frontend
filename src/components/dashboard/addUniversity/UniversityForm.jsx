import React, { useState } from "react";
import GeneralInfoForm from "./GeneralInfoForm";
import AdditionalDetailsForm from "./AdditionalDetailsForm";
import TagsInput from "./TagsInput";
import CampusImageUploader from "./CampusImageUploader";
import ActionButtons from "./ActionButtons";
import { api } from "../../../config/api";

export default function UniversityForm() {
  const [formData, setFormData] = useState({
    // General Info
    name: "",
    logo: null,
    country: "",
    state: "",
    establishedYear: "",
    type: "",
    website: "",
    // Additional Details
    averageFees: "",
    accreditation: "",
    totalStudents: "",
    totalFaculty: "",
    campusArea: "",
    contactEmail: "",
    contactNumber: "",
    description: "",
    emailDomain: "",
    // Tags
    tags: [],
    // Campus Images
    campusImages: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError("");
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validate required fields
      if (!formData.name || !formData.country || !formData.state || 
          !formData.establishedYear || !formData.type || !formData.website) {
        throw new Error("Please fill in all required fields");
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login to add a university");
      }

      // Create FormData for file upload
      const data = new FormData();
      
      // Append all fields
      Object.keys(formData).forEach(key => {
        if (key === 'logo' && formData[key]) {
          data.append('logo', formData[key]);
        } else if (key === 'campusImages' && formData[key].length > 0) {
          formData[key].forEach(file => {
            data.append('campusImages', file);
          });
        } else if (key === 'tags') {
          data.append('tags', JSON.stringify(formData[key]));
        } else if (formData[key] !== "" && formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      const response = await fetch(api.universities.create, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: data
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to add university");
      }

      setSuccess("University added successfully!");
      // Reset form
      setFormData({
        name: "",
        logo: null,
        country: "",
        state: "",
        establishedYear: "",
        type: "",
        website: "",
        averageFees: "",
        accreditation: "",
        totalStudents: "",
        totalFaculty: "",
        campusArea: "",
        contactEmail: "",
        contactNumber: "",
        description: "",
        emailDomain: "",
        tags: [],
        campusImages: []
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      logo: null,
      country: "",
      state: "",
      establishedYear: "",
      type: "",
      website: "",
      averageFees: "",
      accreditation: "",
      totalStudents: "",
      totalFaculty: "",
      campusArea: "",
      contactEmail: "",
      contactNumber: "",
      description: "",
      tags: [],
      campusImages: []
    });
    setError("");
    setSuccess("");
  };

  return (
    <div className="bg-black p-8 rounded-xl">
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-500 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 bg-green-500/10 border border-green-500/50 rounded-lg p-4 text-green-500 text-sm">
          {success}
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
        <GeneralInfoForm formData={formData} onChange={handleInputChange} />
        <AdditionalDetailsForm formData={formData} onChange={handleInputChange} />
        <div className="lg:col-span-2 flex flex-col gap-6 pt-6">
          <TagsInput tags={formData.tags} onChange={(tags) => handleInputChange('tags', tags)} />
        </div>
        <div className="lg:col-span-2 flex flex-col gap-6">
          <CampusImageUploader 
            images={formData.campusImages} 
            onChange={(images) => handleInputChange('campusImages', images)} 
          />
        </div>
        <div className="lg:col-span-2 flex justify-center gap-4 pt-8">
          <ActionButtons 
            onSubmit={handleSubmit} 
            onReset={handleReset} 
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
