import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiEdit2 } from 'react-icons/fi';
import { MdLocationOn } from 'react-icons/md';
import SideNavBar from '../../components/dashboard/SideNavBar';

export default function EditUniversitySearch() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [universities, setUniversities] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    fetchUniversities();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = universities.filter(uni =>
        uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        uni.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        uni.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUniversities(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredUniversities([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, universities]);

  const fetchUniversities = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:3000/api/universities?limit=1000', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setUniversities(data.universities || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching universities:', error);
      setLoading(false);
    }
  };

  const handleUniversityClick = (universityId) => {
    navigate(`/dashboard/edit-university/${universityId}`);
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
          <p className="text-[#888888] text-sm md:text-base">Search for a university to edit its information</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888888] text-xl" />
              <input
                type="text"
                placeholder="Search by university name, state, or country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => searchTerm.trim() && setShowSuggestions(true)}
                className="w-full bg-[#121212] border border-[#004F4F] rounded-lg pl-12 pr-4 py-4 text-[#FFFFFF] placeholder-[#888888] focus:outline-none focus:border-[#00FF00] transition-colors"
              />
            </div>

            {/* Autocomplete Suggestions */}
            {showSuggestions && filteredUniversities.length > 0 && (
              <div className="absolute w-full mt-2 bg-[#121212] border border-[#004F4F] rounded-lg shadow-2xl max-h-96 overflow-y-auto z-50">
                {filteredUniversities.map((uni) => (
                  <button
                    key={uni._id}
                    onClick={() => handleUniversityClick(uni._id)}
                    className="w-full px-4 py-4 flex items-start gap-4 hover:bg-[#004F4F]/30 transition-colors border-b border-[#004F4F] last:border-b-0 text-left">
                    {/* University Logo */}
                    <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-[#0B0C10]">
                      {uni.logoUrl ? (
                        <img
                          src={uni.logoUrl}
                          alt={uni.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#888888] text-2xl font-bold">
                          {uni.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* University Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[#FFFFFF] font-semibold text-lg mb-1 truncate">
                        {uni.name}
                      </h3>
                      <div className="flex items-center gap-2 text-[#888888] text-sm">
                        <MdLocationOn className="flex-shrink-0" />
                        <span className="truncate">{uni.state}, {uni.country}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs text-[#888888]">
                        <span>{uni.type}</span>
                        <span>•</span>
                        <span>Est. {uni.establishedYear}</span>
                      </div>
                    </div>

                    {/* Edit Icon */}
                    <div className="flex-shrink-0 text-[#00FF00]">
                      <FiEdit2 className="text-xl" />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* No Results */}
            {showSuggestions && searchTerm.trim() && filteredUniversities.length === 0 && (
              <div className="absolute w-full mt-2 bg-[#121212] border border-[#004F4F] rounded-lg shadow-2xl p-8 text-center z-50">
                <p className="text-[#888888]">No universities found matching "{searchTerm}"</p>
              </div>
            )}
          </div>

          {/* Instructions */}
          {!searchTerm.trim() && (
            <div className="mt-8 text-center">
              <div className="inline-block p-6 bg-[#121212] rounded-lg border border-[#004F4F]">
                <FiSearch className="text-4xl text-[#888888] mx-auto mb-3" />
                <p className="text-[#888888]">Start typing to search for universities</p>
                <p className="text-[#888888] text-sm mt-2">Total universities: {universities.length}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
