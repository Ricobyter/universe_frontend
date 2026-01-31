import React, { useState, useEffect } from "react";
import { IoStarOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function UniversityCard({ image, name, location, stars, id }) {
  const navigate = useNavigate();
  
  return (
    <div 
      onClick={() => id && navigate(`/university/${id}`)}
      className="flex cursor-pointer flex-col gap-1 sm:gap-2 bg-[#121212] border border-[#004F4F] p-1.5 sm:p-2 rounded-md hover:border-[#00FF00] hover:-translate-y-1 transition-all duration-300 h-full uni-card">
      <div
        className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-md"
        style={{ backgroundImage: `url("${image}")` }}
      ></div>
      <div className="mt-1 sm:mt-2 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-xs sm:text-sm font-medium text-[#00FF00] uni-name line-clamp-1">{name}</p>
          <p className="text-[10px] sm:text-xs font-normal text-[#888888] line-clamp-1">{location}</p>
        </div>
        <div className="flex items-center gap-1 mt-1 sm:mt-2">
          <span className="text-[#00FF00] text-xs">
            <IoStarOutline />
          </span>
          <p className="text-[10px] sm:text-xs text-[#FFFFFF]">{stars} Stars</p>
        </div>
      </div>
    </div>
  );
}

export default function SuggestedForYou() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchSuggestedUniversities();
    }
  }, [userLocation]);

  const getUserLocation = async () => {
    try {
      // Try to get IP-based location from a free API
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.country_name) {
        setUserLocation({
          country: data.country_name,
          state: data.region,
          city: data.city
        });
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to get user location:', error);
      setLoading(false);
    }
  };

  const fetchSuggestedUniversities = async () => {
    try {
      // Try to fetch universities from user's country
      const response = await fetch(`http://localhost:3000/api/universities?country=${encodeURIComponent(userLocation.country)}&limit=4`);
      const data = await response.json();
      
      if (response.ok && data.universities && data.universities.length > 0) {
        setUniversities(data.universities);
      }
    } catch (error) {
      console.error('Failed to fetch suggested universities:', error);
    } finally {
      setLoading(false);
    }
  };

  // Don't render the section if loading or no universities found
  if (loading || universities.length === 0) {
    return null;
  }

  return (
    <section className="pb-8">
      <h2 className="font-poppins text-[#00FF00] text-2xl font-semibold pb-3">
        Suggested For You
      </h2>
      <p className="text-[#888888] text-sm mb-4">Universities in {userLocation.country}</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
        {universities.slice(0, 4).map((uni) => (
          <UniversityCard 
            key={uni._id} 
            id={uni._id}
            name={uni.name}
            location={uni.city && uni.state ? `${uni.city}, ${uni.state}` : uni.country}
            stars={uni.ratings?.average?.toFixed(1) || '0.0'}
            image={uni.campusImages?.[0] || uni.logo}
          />
        ))}
      </div>
    </section>
  );
}
