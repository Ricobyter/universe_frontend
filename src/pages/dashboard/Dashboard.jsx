import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SideNavBar from "../../components/dashboard/SideNavBar";
import TopNavBar from "../../components/dashboard/TopNavBar";
import StatsCard from "../../components/dashboard/dashboardStats/StatsCard";
import ReviewsChart from "../../components/dashboard/dashboardStats/ReviewsChart";
import UserGrowthChart from "../../components/dashboard/dashboardStats/UserGrowthChart";
import UniversitiesTable from "../../components/dashboard/dashboardStats/UniversitiesTable";
import ReviewsTable from "../../components/dashboard/dashboardStats/ReviewsTable";
import { LiaUniversitySolid } from "react-icons/lia";
import { api } from "../../config/api";
import { api } from "../../config/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUniversities: 0,
    totalReviews: 0,
    totalUsers: 0,
    averageRating: 0
  });
  const [reviewsData, setReviewsData] = useState([]);
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [recentUniversities, setRecentUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch all data in parallel
      const [statsRes, reviewsRes, userGrowthRes, recentReviewsRes, recentUniversitiesRes] = await Promise.all([
        fetch(api.admin.stats, { headers }),
        fetch(`${api.admin.reviewsOverTime}?months=9`, { headers }),
        fetch(`${api.admin.userGrowth}?months=7`, { headers }),
        fetch(`${api.admin.recentReviews}?limit=10`, { headers }),
        fetch(api.admin.recentUniversities(5), { headers })
      ]);

      // Check if any response failed
      if (!statsRes.ok) {
        const errData = await statsRes.json();
        console.error('Stats API error:', errData);
        throw new Error(`Failed to fetch stats: ${errData.error || statsRes.statusText}`);
      }

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

      setStats(statsData);
      setReviewsData(reviewsChartData);
      setUserGrowthData(userGrowthChartData);
      setRecentReviews(reviewsListData);
      setRecentUniversities(universitiesListData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      approved: 'bg-green-900/30 text-green-400',
      pending: 'bg-yellow-900/30 text-yellow-400',
      rejected: 'bg-red-900/30 text-red-400'
    };
    return statusClasses[status] || statusClasses.pending;
  };

  return (
    <div className="flex min-h-screen w-full bg-[#0A0A0A] font-inter">
      <SideNavBar />
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
                className="mt-4 px-4 py-2 bg-[#00FF00] text-[#0B0C10] rounded-lg hover:bg-[#00dd00] font-medium transition"
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
              <UniversitiesTable universities={recentUniversities} formatDate={formatDate} />

              {/* Recent Reviews */}
              <ReviewsTable reviews={recentReviews} formatDate={formatDate} getStatusBadge={getStatusBadge} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
