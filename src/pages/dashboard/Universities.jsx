import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEdit2, FiPlus } from 'react-icons/fi';
import { MdFeaturedPlayList } from 'react-icons/md';
import SideNavBar from '../../components/dashboard/SideNavBar';
import UniversitySection from '../../components/dashboard/universities/UniversitySection';
import FeaturedModal from '../../components/dashboard/universities/FeaturedModal';
import UniversityCard from '../../components/dashboard/universities/UniversityCard';

export default function Universities() {
  const navigate = useNavigate();
  const [recentUniversities, setRecentUniversities] = useState([]);
  const [popularUniversities, setPopularUniversities] = useState([]);
  const [featuredUniversities, setFeaturedUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFeaturedModal, setShowFeaturedModal] = useState(false);
  const [allUniversities, setAllUniversities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Fetch featured universities
      const featuredRes = await fetch('http://localhost:3000/api/admin/featured-universities', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const featuredData = await featuredRes.json();
      setFeaturedUniversities(Array.isArray(featuredData) ? featuredData : []);

      // Fetch recent universities
      const recentRes = await fetch('http://localhost:3000/api/admin/recent-universities?limit=6', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const recentData = await recentRes.json();
      setRecentUniversities(Array.isArray(recentData) ? recentData : []);

      // Fetch popular universities (sorted by rating)
      const popularRes = await fetch(`${api.universities.getAll}?sortBy=rating&order=desc&limit=6`);
      const popularData = await popularRes.json();
      setPopularUniversities(popularData.universities || []);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching universities:', error);
      setLoading(false);
    }
  };

  const fetchAllUniversities = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${api.universities.getAll}?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setAllUniversities(data.universities || []);
    } catch (error) {
      console.error('Error fetching all universities:', error);
    }
  };

  const toggleFeaturedStatus = async (universityId) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Toggling featured for university:', universityId);
      console.log('Token:', token ? 'exists' : 'missing');
      
      const response = await fetch(`http://localhost:3000/api/admin/universities/${universityId}/toggle-featured`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Toggle response:', data);
        
        // Update allUniversities state immediately
        setAllUniversities(prevUniversities =>
          prevUniversities.map(uni =>
            uni._id === universityId
              ? { ...uni, isFeatured: data.university.isFeatured }
              : uni
          )
        );
        
        // Refresh featured universities list
        fetchUniversities();
      } else {
        const error = await response.json();
        console.error('Failed to toggle featured status:', error);
        alert(`Error: ${error.error || 'Failed to update featured status'}`);
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
      console.error('Error details:', error.message);
      alert(`Failed to update featured status: ${error.message}`);
    }
  };

  const openFeaturedModal = () => {
    fetchAllUniversities();
    setShowFeaturedModal(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#0A0A0A]">
        <SideNavBar />
        <div className="ml-64 flex-1 p-4 md:p-8">
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0A0A0A]">
      <SideNavBar />
      
      <div className="ml-0 md:ml-64 flex-1 p-4 md:p-8 w-full">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Universities</h1>
          <p className="text-gray-400 text-sm md:text-base">Manage university listings and information</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
          <Link
            to="/dashboard/add-university"
            className="flex items-center justify-center gap-3 bg-[#00FF00] hover:bg-[#00dd00] text-[#0B0C10] px-4 md:px-6 py-3 md:py-4 rounded-lg font-semibold transition-colors"
          >
            <FiPlus className="text-xl" />
            <span className="text-sm md:text-base">Add University</span>
          </Link>
          
          <button
            onClick={openFeaturedModal}
            className="flex items-center justify-center gap-3 bg-purple-600 hover:bg-purple-700 text-white px-4 md:px-6 py-3 md:py-4 rounded-lg font-semibold transition-colors"
          >
            <MdFeaturedPlayList className="text-xl" />
            <span className="text-sm md:text-base">Manage Featured</span>
          </button>
          
          <button
            onClick={() => navigate('/dashboard/edit-university-search')}
            className="flex items-center justify-center gap-3 bg-[#121212] border border-[#00FF00] hover:bg-[#00FF00]/10 text-[#00FF00] px-4 md:px-6 py-3 md:py-4 rounded-lg font-semibold transition-colors"
          >
            <FiEdit2 className="text-xl" />
            <span className="text-sm md:text-base">Edit University</span>
          </button>
        </div>

        {/* Featured Universities Section */}
        <UniversitySection
          title="Featured Universities"
          universities={featuredUniversities}
          emptyMessage="No universities are featured currently"
          accentColor="purple-500"
        />

        {/* Recently Added Section */}
        <UniversitySection
          title="Recently Added"
          universities={recentUniversities}
          emptyMessage="No universities added yet"
        />

        {/* Most Popular Section */}
        <UniversitySection
          title="Most Popular"
          universities={popularUniversities}
          emptyMessage="No popular universities found"
        />
      </div>

      {/* Featured Universities Modal */}
      <FeaturedModal
        isOpen={showFeaturedModal}
        onClose={() => setShowFeaturedModal(false)}
        universities={allUniversities}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onToggleFeatured={toggleFeaturedStatus}
      />
    </div>
  );
}