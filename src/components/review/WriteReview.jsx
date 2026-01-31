import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectToken, selectIsAuthenticated } from "../../store/userSlice";
import { IoIosStarOutline } from "react-icons/io";
import { FaStar } from "react-icons/fa6";
import { api } from "../../config/api";

const ratingCategories = [
  { key: "academics", label: "Academics" },
  { key: "facilities", label: "Facilities" },
  { key: "faculty", label: "Faculty" },
  { key: "placement", label: "Placements" },
  { key: "campusLife", label: "Campus Life" },
];

const tagOptions = [
  "Great Faculty",
  "Good Placements",
  "Campus Life",
  "Research Opportunities",
  "Value for Money",
  "Infrastructure",
  "Sports & Activities",
  "Food Quality",
  "Library Resources",
  "Industry Exposure",
  "Cultural Events",
  "International Exposure",
];

function StarRow({ value, onChange }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((num) => {
        const filled = num <= (hover || value);
        return (
          <button
            key={num}
            type="button"
            onMouseEnter={() => setHover(num)}
            onMouseLeave={() => setHover(0)}
            onFocus={() => setHover(num)}
            onBlur={() => setHover(0)}
            onClick={() => onChange(num)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onChange(num);
              }
            }}
            aria-label={`Set ${num} star${num > 1 ? "s" : ""}`}
            aria-pressed={filled}
            className={`p-1 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors ${
              filled ? "text-light-green" : "text-light-green"
            }`}
          >
            {filled ? (
              <FaStar className="w-2 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4" />
            ) : (
              <IoIosStarOutline className="w-2 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4" />
            )}
          </button>
        );
      })}
    </div>
  );
}

export default function WriteReviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = useSelector(selectToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [searchQuery, setSearchQuery] = useState("");
  const [universities, setUniversities] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [reviewTitle, setReviewTitle] = useState("");
  const [ratings, setRatings] = useState({
    academics: 0,
    facilities: 0,
    faculty: 0,
    placement: 0,
    campusLife: 0,
  });
  const [overallRating, setOverallRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const dropdownRef = useRef(null);
  const charLimit = 1000;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/write-review' } });
    }
  }, [isAuthenticated, navigate]);

  // Fetch universities on component mount
  useEffect(() => {
    fetchUniversities();
  }, []);

  // Check if university was passed via navigation state
  useEffect(() => {
    if (location.state?.university) {
      const passedUniversity = location.state.university;
      setSelectedUniversity(passedUniversity);
      setSearchQuery(passedUniversity.name);
    }
  }, [location.state]);

  // Filter universities as user types
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = universities.filter(uni =>
        uni.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUniversities(filtered);
      setShowDropdown(true);
    } else {
      setFilteredUniversities([]);
      setShowDropdown(false);
    }
  }, [searchQuery, universities]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate overall rating when detailed ratings change
  useEffect(() => {
    const ratingValues = Object.values(ratings).filter(r => r > 0);
    if (ratingValues.length > 0) {
      const avg = ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length;
      setOverallRating(Math.round(avg * 10) / 10);
    } else {
      setOverallRating(0);
    }
  }, [ratings]);

  const fetchUniversities = async () => {
    try {
      const response = await fetch(api.universities.getAll);
      if (response.ok) {
        const data = await response.json();
        setUniversities(data.universities || []);
      }
    } catch (error) {
      console.error('Error fetching universities:', error);
    }
  };

  const handleUniversitySelect = (university) => {
    setSelectedUniversity(university);
    setSearchQuery(university.name);
    setShowDropdown(false);
  };

  const handleRatingChange = (cat, value) => {
    setRatings((prev) => ({ ...prev, [cat]: value }));
  };

  const handleTagClick = (tag) => {
    setSelectedTags((current) =>
      current.includes(tag)
        ? current.filter((t) => t !== tag)
        : [...current, tag]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!selectedUniversity) {
      setError("Please select a university");
      return;
    }
    if (!reviewTitle.trim()) {
      setError("Please enter a review title");
      return;
    }
    if (overallRating === 0) {
      setError("Please provide at least one rating");
      return;
    }
    if (!reviewText.trim()) {
      setError("Please write your review");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          university: selectedUniversity._id,
          rating: overallRating,
          title: reviewTitle,
          reviewText,
          pros: pros.trim() || undefined,
          cons: cons.trim() || undefined,
          tags: selectedTags,
          isAnonymous,
          detailedRatings: ratings
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      setSuccess("Review submitted successfully!");
      setTimeout(() => {
        navigate(`/university/${selectedUniversity._id}`);
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="relative font-inter flex min-h-screen w-full flex-col bg-[#0B0C10] dark:bg-[#0B0C10] font-display text-[#FFFFFF]">
      {/* Main Content */}
      <main className="flex flex-1 justify-center py-10 sm:py-16">
        <div className="w-full max-w-3xl px-4">
          <div className="flex flex-col gap-10">
              <div className="flex min-w-72 flex-col gap-3 text-center">
              <p className="text-[#FFFFFF] text-lg font-semibold font-bricolage leading-tight tracking-[-0.033em]">
                Share Your Experience
              </p>
              <p className="text-[#00FF00] text-sm font-normal leading-normal">
                Help others make informed decisions by sharing your honest
                feedback.
              </p>
            </div>
            <form
              className="flex flex-col gap-6 rounded-xl border border-[#004F4F] bg-[#121212] p-6 md:p-8"
              onSubmit={handleSubmit}
            >
              {/* Error/Success Messages */}
              {error && (
                <div className="bg-[#ff4444]/10 border border-[#ff4444] rounded-lg p-3 text-[#ff4444] text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-[#00FF00]/10 border border-[#00FF00] rounded-lg p-3 text-[#00FF00] text-sm">
                  {success}
                </div>
              )}

              {/* University Search and Title */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex flex-col col-span-1 min-w-40 flex-1 relative" ref={dropdownRef}>
                  <p className="text-[#FFFFFF] text-sm font-semibold leading-normal pb-2">
                    Select University *
                  </p>
                  <input
                    type="text"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#FFFFFF] focus:outline-0 focus:ring-2 focus:ring-[#00FF00] border border-[#004F4F] bg-[#121212] focus:border-[#00FF00] h-14 placeholder:text-[#888888] px-4 py-3 text-sm font-normal leading-normal"
                    placeholder="Start typing university name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery && setShowDropdown(true)}
                  />
                  {showDropdown && filteredUniversities.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-[#121212] border border-[#004F4F] rounded-lg shadow-lg z-10">
                      {filteredUniversities.map((uni) => (
                        <div
                          key={uni._id}
                          className="px-4 py-3 hover:bg-[#004F4F]/30 cursor-pointer text-[#FFFFFF] text-sm border-b border-[#004F4F] last:border-b-0"
                          onClick={() => handleUniversitySelect(uni)}
                        >
                          <div className="font-medium">{uni.name}</div>
                          <div className="text-xs text-[#888888]">{uni.state}, {uni.country}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {showDropdown && searchQuery && filteredUniversities.length === 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#121212] border border-[#004F4F] rounded-lg shadow-lg z-10 px-4 py-3 text-[#888888] text-sm">
                      No universities found
                    </div>
                  )}
                </div>
                <label className="flex flex-col col-span-1 min-w-40 flex-1">
                  <p className="text-[#FFFFFF] text-sm font-semibold leading-normal pb-2">
                    Review Title *
                  </p>
                  <input
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#FFFFFF] focus:outline-0 focus:ring-2 focus:ring-[#00FF00] border border-[#004F4F] bg-[#121212] focus:border-[#00FF00] h-14 placeholder:text-[#888888] px-4 py-3 text-sm font-normal leading-normal"
                    placeholder="e.g., 'Great Professors, but limited social life'"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                  />
                </label>
              </div>

              {/* Overall Rating */}
              <div className="flex flex-col gap-2">
                <h3 className="text-[#FFFFFF] text-sm font-semibold leading-tight tracking-[-0.015em]">
                  Overall Rating {overallRating > 0 && `(${overallRating}/5)`}
                </h3>
                <div className="flex items-center gap-2">
                  <StarRow
                    value={overallRating}
                    onChange={(v) => setOverallRating(v)}
                  />
                  {overallRating > 0 && (
                    <span className="text-sm text-[#888888]">
                      {overallRating === 1 && "Poor"}
                      {overallRating === 2 && "Fair"}
                      {overallRating === 3 && "Good"}
                      {overallRating === 4 && "Very Good"}
                      {overallRating === 5 && "Excellent"}
                    </span>
                  )}
                </div>
              </div>

              {/* Detailed Ratings */}
              <div className="flex flex-col gap-4">
                <h3 className="text-[#FFFFFF] text-sm font-semibold leading-tight tracking-[-0.015em]">
                  Detailed Ratings (Optional)
                </h3>
                <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                  {ratingCategories.map(({ key, label }) => (
                    <div
                      className="flex items-center justify-between"
                      key={key}
                    >
                      <p className="text-sm text-[#FFFFFF]">{label}</p>
                      <StarRow
                        value={ratings[key]}
                        onChange={(v) => handleRatingChange(key, v)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-[#FFFFFF] text-sm font-semibold leading-normal"
                  htmlFor="review-text"
                >
                  Your Review *
                </label>
                <textarea
                  className="form-textarea w-full resize-y rounded-lg text-[#FFFFFF] focus:outline-0 focus:ring-2 focus:ring-[#00FF00] border border-[#004F4F] bg-[#121212] focus:border-[#00FF00] placeholder:text-[#888888] px-4 py-3 text-sm font-normal leading-normal"
                  id="review-text"
                  placeholder="Share the pros, cons, and your overall experience..."
                  rows={8}
                  maxLength={charLimit}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                ></textarea>
                <p className="text-xs text-[#888888] text-right">
                  {reviewText.length}/{charLimit} characters
                </p>
              </div>

              {/* Pros and Cons */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-[#FFFFFF] text-sm font-semibold leading-normal" htmlFor="pros">
                    Pros (Optional)
                  </label>
                  <textarea
                    className="form-textarea w-full resize-y rounded-lg text-[#FFFFFF] focus:outline-0 focus:ring-2 focus:ring-[#00FF00] border border-[#004F4F] bg-[#121212] focus:border-[#00FF00] placeholder:text-[#888888] px-4 py-3 text-sm font-normal leading-normal"
                    id="pros"
                    placeholder="What did you like the most?"
                    rows={4}
                    value={pros}
                    onChange={(e) => setPros(e.target.value)}
                  ></textarea>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[#FFFFFF] text-sm font-semibold leading-normal" htmlFor="cons">
                    Cons (Optional)
                  </label>
                  <textarea
                    className="form-textarea w-full resize-y rounded-lg text-[#FFFFFF] focus:outline-0 focus:ring-2 focus:ring-[#00FF00] border border-[#004F4F] bg-[#121212] focus:border-[#00FF00] placeholder:text-[#888888] px-4 py-3 text-sm font-normal leading-normal"
                    id="cons"
                    placeholder="What could be improved?"
                    rows={4}
                    value={cons}
                    onChange={(e) => setCons(e.target.value)}
                  ></textarea>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-col gap-3">
                <h3 className="text-[#FFFFFF] text-sm font-semibold leading-normal">
                  Add Tags (Optional)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tagOptions.map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-colors
                        ${
                          selectedTags.includes(tag)
                            ? "border-[#00FF00] bg-[#00FF00] text-[#0B0C10]"
                            : "border-[#004F4F] text-[#FFFFFF] hover:bg-[#00FF00]/20"
                        }`}
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Anonymous Option */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded border-[#004F4F] bg-[#121212] text-[#00FF00] focus:ring-2 focus:ring-[#00FF00]"
                />
                <label htmlFor="anonymous" className="text-[#FFFFFF] text-sm cursor-pointer">
                  Post anonymously
                </label>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  className="flex w-full sm:w-auto min-w-[120px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg py-2 px-4 bg-transparent text-[#00FF00] text-sm font-bold leading-normal tracking-[0.015em] border-2 border-[#004F4F] hover:bg-[#004F4F]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  <span className="truncate">Cancel</span>
                </button>
                <button
                  type="submit"
                  className="flex w-full sm:w-auto min-w-[120px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg py-2 px-4 bg-[#00FF00] text-[#0B0C10] text-sm font-bold leading-normal tracking-[0.015em] hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  <span className="truncate">{loading ? 'Submitting...' : 'Submit Review'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
