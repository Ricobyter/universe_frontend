import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function HeroSection() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <section className="@container text-[#FFFFFF] font-inter py-24 sm:py-36 md:py-36 flex flex-col items-center gap-4 sm:gap-6 px-4 text-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-[#00FF00] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight tracking-[-0.033em]">
          Find Your Perfect University
        </h1>
        <h2 className="text-[#888888] text-xs sm:text-sm font-normal leading-normal">
          Discover authentic reviews from thousands of students worldwide.
        </h2>
      </div>

<div className="w-full max-w-xl flex items-center bg-[#121212] border border-[#004F4F] rounded-full overflow-hidden shadow-md px-2 py-1.5 sm:py-2">
        <div className="px-2 sm:px-4 text-[#888888] flex items-center">
          <FiSearch className="text-base sm:text-lg" />
        </div>
        <input
          type="text"
          placeholder="Enter university name, city, or country..."
          className="w-full bg-transparent text-[#FFFFFF] placeholder-[#888888] py-2 sm:py-3 focus:outline-none text-xs sm:text-sm md:text-base"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button 
          onClick={handleSearch}
          className="ml-2 sm:ml-3 cursor-pointer bg-[#00FF00] text-[#0B0C10] font-semibold px-4 sm:px-6 md:px-8 py-2 sm:py-3 hover:bg-[#00dd00] transition-colors text-xs sm:text-sm rounded-full whitespace-nowrap"
        >
          Search
        </button>
      </div>
    </section>
  );
}
