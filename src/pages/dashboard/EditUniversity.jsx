import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SideNavBar from '../../components/dashboard/SideNavBar';
import GeneralInfoForm from '../../components/dashboard/addUniversity/GeneralInfoForm';
import AdditionalDetailsForm from '../../components/dashboard/addUniversity/AdditionalDetailsForm';
import TagsInput from '../../components/dashboard/addUniversity/TagsInput';
import CampusImageUploader from '../../components/dashboard/addUniversity/CampusImageUploader';
import { api } from '../../config/api';

export default function EditUniversity() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    logo: null,
    country: '',
    state: '',
    establishedYear: '',
    type: '',
    website: '',
    averageFees: '',
    accreditation: '',
    totalStudents: '',
    totalFaculty: '',
    campusArea: '',
    contactEmail: '',
    contactNumber: '',
    description: '',
    emailDomain: '',
    tags: [],
    campusImages: []
  });

  const [existingLogoUrl, setExistingLogoUrl] = useState('');
  const [existingCampusImages, setExistingCampusImages] = useState([]);
  const [removeLogo, setRemoveLogo] = useState(false);
  const [removedCampusImages, setRemovedCampusImages] = useState([]);

  useEffect(() => {
    fetchUniversityData();
  }, [id]);

  const fetchUniversityData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:3000/api/universities/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch university data');
      }

      const data = await response.json();
      
      // Pre-fill form with existing data
      setFormData({
        name: data.name || '',
        logo: null, // Will be set if user uploads new logo
        country: data.country || '',
        state: data.state || '',
        establishedYear: data.establishedYear || '',
        type: data.type || '',
        website: data.website || '',
        averageFees: data.averageFees || '',
        accreditation: data.accreditation || '',
        totalStudents: data.totalStudents || '',
        totalFaculty: data.totalFaculty || '',
        campusArea: data.campusArea || '',
        contactEmail: data.contactEmail || '',
        contactNumber: data.contactNumber || '',
        description: data.description || '',
        emailDomain: data.emailDomain || '',
        tags: data.tags || [],
        campusImages: [] // Will be set if user uploads new images
      });

      setExistingLogoUrl(data.logo || '');
      setExistingCampusImages(data.campusImages || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching university:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      if (!formData.name || !formData.country || !formData.state || 
          !formData.establishedYear || !formData.type || !formData.website) {
        throw new Error('Please fill in all required fields');
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to edit university');
      }

      // Create FormData for file upload
      const data = new FormData();
      
      // Add old image URLs for cleanup if new images are uploaded
      if (formData.logo && existingLogoUrl) {
        data.append('oldLogoUrl', existingLogoUrl);
      }
      if (formData.campusImages.length > 0 && existingCampusImages.length > 0) {
        data.append('oldCampusImages', JSON.stringify(existingCampusImages));
      }
      
      // Mark logo for removal
      if (removeLogo) {
        data.append('removeLogo', 'true');
        data.append('oldLogoUrl', existingLogoUrl);
      }
      
      // Mark campus images for removal
      if (removedCampusImages.length > 0) {
        data.append('removedCampusImages', JSON.stringify(removedCampusImages));
      }
      
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
        } else if (formData[key] !== '' && formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      const response = await fetch(`http://localhost:3000/api/universities/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update university');
      }

      setSuccess('University updated successfully!');
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/dashboard/universities');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/universities');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#0B0C10]">
        <SideNavBar />
        <div className="ml-64 flex-1 p-4 md:p-8">
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00FF00]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0B0C10]">
      <SideNavBar />
      
      <div className="ml-0 md:ml-64 flex-1 p-4 md:p-8 w-full">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#FFFFFF] mb-2">Edit University</h1>
          <p className="text-[#888888] text-sm md:text-base">Update university information</p>
        </div>

        {/* Form */}
        <div className="bg-[#121212] p-8 rounded-xl">
          {error && (
            <div className="mb-6 bg-[#ff4444]/10 border border-[#ff4444] rounded-lg p-4 text-[#ff4444] text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 bg-[#00FF00]/10 border border-[#00FF00] rounded-lg p-4 text-[#00FF00] text-sm">
              {success}
            </div>
          )}

          {/* Show existing logo if available */}
          {existingLogoUrl && !formData.logo && !removeLogo && (
            <div className="mb-6">
              <label className="block text-[#888888] text-sm mb-2">Current Logo</label>
              <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-[#0B0C10] group">
                <img src={existingLogoUrl} alt="Current logo" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setRemoveLogo(true)}
                  className="absolute top-1 right-1 bg-[#ff4444] hover:bg-[#ff4444]/80 text-[#FFFFFF] rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
              <p className="text-xs text-[#888888] mt-2">Upload a new logo to replace this</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
            <GeneralInfoForm formData={formData} onChange={handleInputChange} />
            <AdditionalDetailsForm formData={formData} onChange={handleInputChange} />
            
            <div className="lg:col-span-2 flex flex-col gap-6 pt-6">
              <TagsInput tags={formData.tags} onChange={(tags) => handleInputChange('tags', tags)} />
            </div>

            {/* Show existing campus images */}
            {existingCampusImages.filter(img => !removedCampusImages.includes(img)).length > 0 && (
              <div className="lg:col-span-2">
                <label className="block text-[#888888] text-sm mb-3">Current Campus Images</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {existingCampusImages
                    .filter(img => !removedCampusImages.includes(img))
                    .map((img, index) => (
                      <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-[#0B0C10] group">
                        <img src={img} alt={`Campus ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setRemovedCampusImages(prev => [...prev, img])}
                          className="absolute top-2 right-2 bg-[#ff4444] hover:bg-[#ff4444]/80 text-[#FFFFFF] rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-lg font-bold"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                </div>
                <p className="text-xs text-[#888888]">Upload new images to add to or replace these</p>
              </div>
            )}

            <div className="lg:col-span-2 flex flex-col gap-6">
              <CampusImageUploader 
                images={formData.campusImages} 
                onChange={(images) => handleInputChange('campusImages', images)} 
              />
            </div>

            {/* Action Buttons */}
            <div className="lg:col-span-2 flex justify-center gap-4 pt-8">
              <button
                onClick={handleCancel}
                disabled={submitting}
                className="px-8 py-3 bg-[#121212] hover:bg-[#004F4F] text-[#FFFFFF] rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-[#004F4F]"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Updating...
                  </>
                ) : (
                  'Update University'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
