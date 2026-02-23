/**
 * User Info Page Component (Public Profile View)
 * 
 * Displays public profile information for any user.
 * Different from UserProfile.jsx - this is the public-facing view.
 * 
 * Features:
 * - View any user's public profile by user ID
 * - Display basic user information (name, university, join date)
 * - Show all non-anonymous reviews by the user
 * - Review count and statistics
 * - Links to reviewed universities
 * 
 * Route: /user/:id
 * 
 * Data Loading:
 * - User profile data from /api/users/:id
 * - User's reviews from /api/reviews/user/:id
 * - Only shows non-anonymous reviews (respects privacy)
 * 
 * Differences from UserProfile:
 * - UserProfile.jsx: Own profile with edit capabilities
 * - UserInfo.jsx: Public view of any user's profile (read-only)
 */

import React, { useEffect, useState } from "react";
import { api } from "../../config/api";
import { Link, useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";

export default function UserInfo() {
  // Get user ID from URL parameter
  const { id } = useParams();
  
  // User data state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  /**
   * Fetch user profile data
   * Public endpoint - no authentication required
   * Re-fetches when URL parameter (user ID) changes
   */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(api.users.getById(id));
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch user");
        }

        setUser(data.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  /**
   * Fetch reviews written by this user
   * Public endpoint - shows only non-anonymous reviews
   * Anonymous reviews are filtered out to respect privacy
   */
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const response = await fetch(
          api.reviews.getByUser(id)
        );
        const data = await response.json();

        if (response.ok) {
          setReviews(data.reviews || []);
        }
      } catch (err) {
        console.error("Error fetching user reviews:", err);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  /**
   * Format date to readable string (e.g., "Jan 15, 2024")
   * @param {string} dateString - ISO date string
   * @returns Formatted date string
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  /**
   * Render star rating visualization
   * @param {number} rating - Rating value (0-5)
   * @returns Star icons with filled/empty states
   */
  const renderStars = (rating) => (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <FaStar
          key={i}
          className={`text-xs ${i < rating ? "text-[#00FF00]" : "text-[#888888]"}`}
        />
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00FF00]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center">
        <div className="text-[#ff4444] text-lg">{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center">
        <div className="text-[#888888] text-lg">User not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#FFFFFF]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-[#121212] border border-[#004F4F] rounded-2xl p-6 md:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="size-20 rounded-full bg-[#00FF00]/10 flex items-center justify-center overflow-hidden">
              {user.userImageUrl ? (
                <img
                  src={user.userImageUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[#00FF00] text-2xl font-bold">
                  {(user.name || "U").charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1 text-[#00FF00]">{user.name}</h1>
              <p className="text-[#888888] text-sm mb-2">
                {user.University && user.University !== "none" ? user.University : "University not specified"}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-[#888888]">
                <span>Joined {formatDate(user.createdAt)}</span>
                <span>{user.reviewCount || 0} reviews</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#00FF00]">Reviews</h2>
          <p className="text-[#888888] text-sm">Recent reviews by this user</p>
        </div>

        {reviewsLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00FF00]"></div>
          </div>
        ) : reviews.filter(review => !review.isAnonymous).length === 0 ? (
          <div className="bg-[#121212] border border-[#004F4F] rounded-xl p-8 text-center text-[#888888]">
            No public reviews found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.filter(review => !review.isAnonymous).map((review) => (
              <div
                key={review._id}
                className="bg-[#121212] border border-[#004F4F] rounded-xl p-5 hover:border-[#00FF00] transition"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-[#FFFFFF] font-semibold text-base mb-1">
                      {review.title || "Review"}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-[#888888]">
                      {renderStars(review.rating)}
                      <span>{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                  {review.university?._id && (
                    <Link
                      to={`/university/${review.university._id}`}
                      className="text-xs text-[#00FF00] hover:text-[#00dd00]"
                    >
                      {review.university?.name || "University"}
                    </Link>
                  )}
                </div>
                <p className="text-sm text-[#FFFFFF] line-clamp-3">
                  {review.reviewText}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
