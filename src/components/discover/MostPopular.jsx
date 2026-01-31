import React, { useState, useEffect } from "react";
import { IoStarOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function UniversityCard({ image, name, location, stars, id, views }) {
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
        <div className="flex items-center justify-between mt-1 sm:mt-2">
          <div className="flex items-center gap-1">
            <span className="text-[#00FF00] text-xs">
              <IoStarOutline />
            </span>
            <p className="text-[10px] sm:text-xs text-[#FFFFFF]">{stars} Stars</p>
          </div>
          {views !== undefined && (
            <p className="text-[10px] sm:text-xs text-[#888888]">{views.toLocaleString()} views</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MostPopular() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularUniversities = async () => {
      try {
        const response = await fetch(`${api.universities.getAll}?limit=4&sortBy=views&order=desc`);
        const data = await response.json();
        
        console.log('Most Popular Response:', data);
        
        if (response.ok) {
          setUniversities(data.universities || []);
        }
      } catch (error) {
        console.error('Failed to fetch popular universities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularUniversities();
  }, []);

  if (loading) {
    return (
      <section className="py-8">
        <h2 className="font-poppins text-[#00FF00] text-2xl font-semibold pb-3">
          Most Popular Universities
        </h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00FF00] mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-5">
      <h2 className="font-poppins text-[#00FF00] text-2xl font-semibold pb-3">
        Most Popular Universities
      </h2>
      {universities.length === 0 ? (
        <p className="text-[#888888] text-center py-8">No popular universities found</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {universities.slice(0, 4).map((uni) => (
            <UniversityCard 
              key={uni._id} 
              id={uni._id}
              name={uni.name}
              location={uni.city && uni.state ? `${uni.city}, ${uni.state}` : uni.country}
              stars={uni.ratings?.average?.toFixed(1) || '0.0'}
              image={uni.campusImages?.[0] || uni.logo}
              views={uni.views || 0}
            />
          ))}
        </div>
      )}
    </section>
  );
}
