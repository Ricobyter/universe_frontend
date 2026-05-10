/**
 * Admin Dashboard Page Component
 * 
 * Central admin dashboard that displays key metrics and analytics:
 * - Platform statistics (universities, reviews, users, ratings)
 * - Charts for reviews over time and user growth trends
 * - Recent universities and reviews tables
 * - Parallel data fetching for optimal performance
 * 
 * Features:
 * - JWT authentication required
 * - Multiple data visualizations
 * - Real-time statistics
 * - Responsive layout with side navigation
 */

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SideNavBar from "../../components/dashboard/SideNavBar";
import TopNavBar from "../../components/dashboard/TopNavBar";
import StatsCard from "../../components/dashboard/dashboardStats/StatsCard";
import ReviewsChart from "../../components/dashboard/dashboardStats/ReviewsChart";
import UserGrowthChart from "../../components/dashboard/dashboardStats/UserGrowthChart";
import UniversitiesTable from "../../components/dashboard/dashboardStats/UniversitiesTable";
import ReviewsTable from "../../components/dashboard/dashboardStats/ReviewsTable";
import { LiaUniversitySolid } from "react-icons/lia";
import { api } from "../../config/api";

export default function Dashboard({ onOpenChat }) {
  const navigate = useNavigate();
  
  // Platform statistics state
  const [stats, setStats] = useState({
    totalUniversities: 0,
    totalReviews: 0,
    totalUsers: 0,
    averageRating: 0
  });
  
  // Chart data states
  const [_reviewsData, _setReviewsData] = useState([]);
  const [_userGrowthData, _setUserGrowthData] = useState([]);
  
  // Recent data states
  const [recentReviews, setRecentReviews] = useState([]);
  const [recentUniversities, setRecentUniversities] = useState([]);
  // UI state management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  /**
   * Fetch all dashboard data from multiple endpoints in parallel
   * Uses Promise.all for optimal performance
   * Includes fallback handling for failed requests
   */
  const fetchDashboardData = async () => {
    try {
      // Get JWT token for authenticated requests
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch all data in parallel for better performance
      // This reduces total loading time compared to sequential fetches
      const [statsRes, reviewsRes, userGrowthRes, recentReviewsRes, recentUniversitiesRes] = await Promise.all([
        fetch(api.admin.stats, { headers }),
        fetch(`${api.admin.reviewsOverTime}?months=9`, { headers }),
        fetch(`${api.admin.userGrowth}?months=7`, { headers }),
        fetch(`${api.admin.recentReviews}?limit=10`, { headers }),
        fetch(api.admin.recentUniversities(5), { headers })
      ]);

      // Check if main stats request failed (required data)
      if (!statsRes.ok) {
        const errData = await statsRes.json();
        console.error('Stats API error:', errData);
        throw new Error(`Failed to fetch stats: ${errData.error || statsRes.statusText}`);
      }

      // Parse response data, with fallbacks for optional charts/lists
      const statsData = await statsRes.json();
      const reviewsChartData = reviewsRes.ok ? await reviewsRes.json() : [];
      const userGrowthChartData = userGrowthRes.ok ? await userGrowthRes.json() : [];
      const reviewsListData = recentReviewsRes.ok ? await recentReviewsRes.json() : [];
      const universitiesListData = recentUniversitiesRes.ok ? await recentUniversitiesRes.json() : [];

      console.log('Dashboard Data:', {
        stats: statsData,
        reviewsChart: reviewsChartData,
        userGrowth: userGrowthChartData,
        recentReviews: reviewsListData,
        recentUniversities: universitiesListData
      });

      // Update all state with fetched data
      setStats(statsData);
      _setReviewsData(reviewsChartData);
      _setUserGrowthData(userGrowthChartData);
      setRecentReviews(reviewsListData);
      setRecentUniversities(universitiesListData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  /**
   * Format date string to readable format
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date (e.g., "Jan 15, 2024")
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  /**
   * Get appropriate CSS classes for status badge
   * @param {string} status - Review status (approved, pending, rejected)
   * @returns {string} Tailwind CSS classes
   */
  const getStatusBadge = (status) => {
    const statusClasses = {
      approved: 'bg-green-900/30 text-green-400',
      pending: 'bg-yellow-900/30 text-yellow-400',
      rejected: 'bg-red-900/30 text-red-400'
    };
    return statusClasses[status] || statusClasses.pending;
  };

  /**
   * Handle viewing a university
   * Navigates to the university info page
   * @param {string} id - University ID
   */
  const handleViewUniversity = (id) => {
    navigate(`/university/${id}`);
  };

  /**
   * Handle editing a university
   * Navigates to the edit university page
   * @param {string} id - University ID
   */
  const handleEditUniversity = (id) => {
    navigate(`/dashboard/edit-university/${id}`);
  };

  /**
   * Handle deleting a university
   * Shows confirmation dialog before deleting
   * @param {string} id - University ID
   * @param {string} name - University name for confirmation message
   */
  const handleDeleteUniversity = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(api.universities.delete(id), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete university');
      }

      // Remove from local state
      setRecentUniversities(recentUniversities.filter(uni => uni._id !== id));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalUniversities: prev.totalUniversities - 1
      }));

      alert('University deleted successfully');
    } catch (error) {
      console.error('Error deleting university:', error);
      alert(error.message || 'Failed to delete university');
    }
  };

  /**
   * Handle deleting a review
   * Shows confirmation dialog before deleting
   * @param {string} id - Review ID
   * @param {string} title - Review title for confirmation message
   */
  const handleDeleteReview = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete the review "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(api.reviews.delete(id), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete review');
      }

      // Remove from local state
      setRecentReviews(recentReviews.filter(review => review._id !== id));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalReviews: prev.totalReviews - 1
      }));

      alert('Review deleted successfully');
    } catch (error) {
      console.error('Error deleting review:', error);
      alert(error.message || 'Failed to delete review');
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#0A0A0A] font-inter">
      <SideNavBar onOpenChat={onOpenChat} />
      <main className="flex-1 overflow-y-auto ml-64 bg-[#0A0A0A]">


        <div className="p-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-400">Loading dashboard data...</div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="text-red-400 mb-2">Error loading dashboard</div>
              <div className="text-gray-400 text-sm">{error}</div>
              <button 
                onClick={fetchDashboardData}
                className="mt-4 px-4 py-2 bg-[#00FF00] text-dark-black rounded-lg hover:bg-[#00dd00] font-medium transition"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                  title="Total Universities"
                  value={stats.totalUniversities.toLocaleString()}
                  subtitle="Active institutions"
                />
                <StatsCard
                  title="Total Reviews"
                  value={stats.totalReviews.toLocaleString()}
                  subtitle="User submissions"
                />
                <StatsCard
                  title="Total Users"
                  value={stats.totalUsers.toLocaleString()}
                  subtitle="Registered accounts"
                />
                <StatsCard
                  title="Average Rating"
                  value={<>{stats.averageRating}<span className="text-2xl text-gray-400">/5</span></>}
                  subtitle="Platform average"
                />
              </div>

              {/* Charts Section */}
              {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <ReviewsChart data={reviewsData} />
                <UserGrowthChart data={userGrowthData} />
              </div> */}

              {/* Recently Added Universities */}
              <UniversitiesTable 
                universities={recentUniversities} 
                formatDate={formatDate}
                onView={handleViewUniversity}
                onEdit={handleEditUniversity}
                onDelete={handleDeleteUniversity}
              />

              {/* Recent Reviews */}
              <ReviewsTable 
                reviews={recentReviews} 
                formatDate={formatDate} 
                getStatusBadge={getStatusBadge}
                onDelete={handleDeleteReview}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
