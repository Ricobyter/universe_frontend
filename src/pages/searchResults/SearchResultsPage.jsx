import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import FilterSidebar from "../../components/searchResults/FilterSidebar";
import { FaChevronRight, FaChevronLeft, FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

// Stars component renders stars according to rating
function Stars({ rating }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <span className="flex items-center gap-1">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={`full-${i}`} className="text-[#00FF00]" size={16} />
      ))}
      {hasHalfStar && <FaStarHalfAlt className="text-[#00FF00]" size={16} />}
      {[...Array(emptyStars)].map((_, i) => (
        <FaRegStar key={`empty-${i}`} className="text-[#00FF00]" size={16} />
      ))}
    </span>
  );
}

// Sort and results header
function ResultsHeader({ searchTerm, totalResults, sortBy, onSortChange }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-4 font-inter">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold leading-tight tracking-tight font-bricolage text-[#FFFFFF]">
          {searchTerm ? `Search Results for '${searchTerm}'` : 'All Universities'}
        </h1>
        <p className="text-sm font-inter text-[#888888]">Showing {totalResults} results</p>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm text-[#888888]" htmlFor="sort-by">
          Sort by:
        </label>
        <select
          className="form-select h-8 rounded-lg cursor-pointer border-[#004F4F] bg-[#121212] text-sm text-[#FFFFFF] focus:border-[#00FF00] focus:ring-[#00FF00] px-2"
          id="sort-by"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="relevance">Relevance</option>
          <option value="rating-desc">Rating (High to Low)</option>
          <option value="rating-asc">Rating (Low to High)</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
        </select>
      </div>
    </div>
  );
}

// Single university card component
function UniversityCard({ university }) {
  const navigate = useNavigate();
  
  const handleViewDetails = () => {
    navigate(`/university/${university._id}`);
  };

  const averageRating = university.averageRating || 0;
  
  return (
    <div className="flex flex-col cursor-pointer gap-4 rounded-xl border border-[#004F4F] bg-[#121212] p-5 transition-all duration-300 hover:border-[#00FF00] hover:shadow-2xl hover:shadow-[#00FF00]/10">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-lg font-bold leading-tight text-[#FFFFFF]">{university.name}</h3>
          <p className="text-sm font-normal leading-normal text-[#888888]">
            {university.state}, {university.country}
          </p>
          <div className="mt-1 flex items-center gap-1">
            <Stars rating={averageRating} />
            <span className="ml-1.5 text-sm font-medium text-[#888888]">
              {averageRating > 0 ? averageRating.toFixed(1) : 'No ratings'}
            </span>
          </div>
        </div>
        {university.logoUrl && (
          <div
            className="h-16 w-16 shrink-0 rounded-full bg-cover bg-center bg-no-repeat border border-[#004F4F]"
            style={{ backgroundImage: `url("${university.logoUrl}")` }}
          ></div>
        )}
      </div>
      <button 
        onClick={handleViewDetails}
        className="flex h-10 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-[#00FF00] px-4 text-sm font-semibold text-[#0B0C10] transition-colors hover:brightness-110"
      >
        <span className="truncate">View Details</span>
      </button>
    </div>
  );
}



// Results grid component
function ResultsGrid({ universities }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {universities.map((uni) => (
        <UniversityCard key={uni.name} university={uni} />
      ))}
    </div>
  );
}

// Pagination component
function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center border-t border-[#004F4F] pt-8">
      <nav className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#004F4F] text-[#888888] transition-colors hover:bg-[#121212] hover:text-[#FFFFFF] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaChevronLeft />
        </button>
        {getPageNumbers().map((page, idx) => (
          page === '...' ? (
            <span key={`ellipsis-${idx}`} className="text-[#888888]">...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-bold transition-colors ${
                currentPage === page
                  ? 'border-[#00FF00] bg-[#00FF00]/20 text-[#00FF00]'
                  : 'border-[#004F4F] text-[#888888] hover:bg-[#121212] hover:text-[#FFFFFF]'
              }`}
            >
              {page}
            </button>
          )
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#004F4F] text-[#888888] transition-colors hover:bg-[#121212] hover:text-[#FFFFFF] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaChevronRight />
        </button>
      </nav>
    </div>
  );
}

// Main Page Component
export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchQuery = searchParams.get('q') || '';
  
  const [universities, setUniversities] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    rating: 'any',
    type: []
  });
  const itemsPerPage = 10;

  // Fetch universities
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${api.universities.getAll}?limit=1000`);
        const data = await response.json();
        setUniversities(data.universities || []);
      } catch (error) {
        console.error('Error fetching universities:', error);
        setUniversities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUniversities();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let results = [...universities];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(uni => 
        uni.name.toLowerCase().includes(query) ||
        uni.country.toLowerCase().includes(query) ||
        uni.state.toLowerCase().includes(query)
      );
    }

    // Rating filter
    if (filters.rating !== 'any') {
      const minRating = parseFloat(filters.rating);
      results = results.filter(uni => (uni.averageRating || 0) >= minRating);
    }

    // Type filter
    if (filters.type.length > 0) {
      results = results.filter(uni => filters.type.includes(uni.type));
    }

    // Sorting
    switch (sortBy) {
      case 'rating-desc':
        results.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      case 'rating-asc':
        results.sort((a, b) => (a.averageRating || 0) - (b.averageRating || 0));
        break;
      case 'name-asc':
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        results.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Relevance - keep as is
        break;
    }

    setFilteredUniversities(results);
    setCurrentPage(1);
  }, [universities, searchQuery, filters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredUniversities.length / itemsPerPage);
  const paginatedUniversities = filteredUniversities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="relative flex min-h-screen w-full flex-col bg-[#0B0C10] text-[#FFFFFF] font-display items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#00FF00]"></div>
        <p className="mt-4 text-[#888888]">Loading universities...</p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#0B0C10] text-[#FFFFFF] font-display">
      <main className="mx-auto w-full max-w-[1200px] flex-1 py-8 px-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <FilterSidebar filters={filters} onFilterChange={setFilters} />
          <div className="col-span-1 lg:col-span-3 flex flex-col gap-6">
            <ResultsHeader 
              searchTerm={searchQuery} 
              totalResults={filteredUniversities.length}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
            {paginatedUniversities.length > 0 ? (
              <>
                <ResultsGrid universities={paginatedUniversities} />
                {totalPages > 1 && (
                  <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-[#888888] text-lg">No universities found matching your criteria.</p>
                <p className="text-[#888888] text-sm mt-2">Try adjusting your filters or search query.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
