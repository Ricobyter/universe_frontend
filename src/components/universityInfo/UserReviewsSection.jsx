import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaThumbsUp, FaReply } from "react-icons/fa";
import { api } from "../../config/api";

export default function UserReviewsSection({ universityId, darkMode }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("newest");
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [universityId, filter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      let sortBy = 'createdAt';
      let order = 'desc';
      
      if (filter === 'highest') {
        sortBy = 'rating';
        order = 'desc';
      } else if (filter === 'helpful') {
        sortBy = 'helpfulVotes';
        order = 'desc';
      }

      const response = await fetch(
          `${api.reviews.getAll}?university=${universityId}&sortBy=${sortBy}&order=${order}&limit=10`
      );
      
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
        setTotalReviews(data.total || 0);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHelpful = async (reviewId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to mark reviews as helpful');
        return;
      }

      const response = await fetch(
        api.reviews.markHelpful(reviewId),
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Update only the specific review in local state
        setReviews(prevReviews =>
          prevReviews.map(review =>
            review._id === reviewId
              ? { ...review, helpfulVotes: data.helpfulVotes }
              : review
          )
        );
      }
    } catch (error) {
      console.error('Error marking helpful:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  if (loading) {
    return (
      <div className={`rounded-xl p-4 md:p-6 ${
        darkMode ? 'bg-[#111111] border border-[#00573D]/50' : 'bg-white shadow-md'
      }`}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-light-green"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl p-4 md:p-6 ${
      darkMode ? 'bg-[#111111] border border-[#00573D]/50' : 'bg-white shadow-md'
    }`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 md:mb-6">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 md:h-6 bg-light-green rounded-full"></div>
          <h2 className={`text-base md:text-xl font-bold ${darkMode ? 'text-light-green' : 'text-gray-900'}`}>
            User Reviews
          </h2>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={`px-4 py-2 rounded-lg border text-sm ${
            darkMode 
              ? 'bg-[#1a1a1a] border-light-green/30 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="newest">Newest First</option>
          <option value="highest">Highest Rated</option>
          <option value="helpful">Most Helpful</option>
        </select>
      </div>

      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <p className="text-lg mb-2">No reviews yet</p>
            <p className="text-sm">Be the first to share your experience!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              className={`p-5 rounded-lg ${
                darkMode ? 'bg-[#1a1a1a]' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-4">
                {review.isAnonymous || !review.user?._id ? (
                  <div className={`size-10 rounded-full flex items-center justify-center text-white font-bold ${
                    darkMode ? 'bg-light-green/20 text-light-green' : 'bg-green-600'
                  }`}>
                    {review.isAnonymous 
                      ? 'A' 
                      : (review.user?.name || 'U').charAt(0).toUpperCase()
                    }
                  </div>
                ) : (
                  <Link
                    to={`/user/${review.user._id}`}
                    className={`size-10 rounded-full flex items-center justify-center overflow-hidden text-white font-bold ${
                      darkMode ? 'bg-light-green/20 text-light-green' : 'bg-green-600'
                    }`}
                    aria-label={`View ${review.user?.name || 'user'} profile`}
                  >
                    {review.user?.userImageUrl ? (
                      <img
                        src={review.user.userImageUrl}
                        alt={review.user?.name || 'User'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      (review.user?.name || 'U').charAt(0).toUpperCase()
                    )}
                  </Link>
                )}
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {review.isAnonymous ? review.anonymousName : (review.user?.name || 'User')}
                      </h4>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`text-sm ${
                            i < review.rating ? 'text-light-green' : 'text-gray-500'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {review.title && (
                    <h5 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {review.title}
                    </h5>
                  )}

                  <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {review.reviewText}
                  </p>

                  {review.pros && (
                    <div className="mb-2">
                      <span className="text-xs font-semibold text-green-500">Pros: </span>
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {review.pros}
                      </span>
                    </div>
                  )}

                  {review.cons && (
                    <div className="mb-3">
                      <span className="text-xs font-semibold text-red-500">Cons: </span>
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {review.cons}
                      </span>
                    </div>
                  )}

                  {review.tags && review.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {review.tags.map((tag, index) => (
                        <span
                          key={index}
                          className={`text-xs px-2 py-1 rounded-full ${
                            darkMode 
                              ? 'bg-light-green/20 text-light-green' 
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm">
                    <button 
                      onClick={() => handleHelpful(review._id)}
                      className={`flex items-center gap-2 transition ${
                        darkMode ? 'text-gray-400 hover:text-light-green' : 'text-gray-600 hover:text-green-600'
                      }`}
                    >
                      <FaThumbsUp className="text-xs" />
                      <span>Helpful ({review.helpfulVotes || 0})</span>
                    </button>
                    {review.replies && review.replies.length > 0 && (
                      <span className={`flex items-center gap-2 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <FaReply className="text-xs" />
                        <span>{review.replies.length} {review.replies.length === 1 ? 'Reply' : 'Replies'}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {totalReviews > reviews.length && (
        <button className={`mt-6 w-full py-3 rounded-lg font-semibold transition ${
          darkMode 
            ? 'bg-[#1a1a1a] text-light-green border border-light-green/30 hover:bg-[#222]' 
            : 'bg-white text-green-600 border border-green-600 hover:bg-green-50'
        }`}>
          View All {totalReviews.toLocaleString()} Reviews
        </button>
      )}
    </div>
  );
}
