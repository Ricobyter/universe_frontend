import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineRateReview } from 'react-icons/md';
import SideNavBar from '../../components/dashboard/SideNavBar';
import ReviewSection from '../../components/dashboard/reviews/ReviewSection';

export default function Reviews() {
  const navigate = useNavigate();
  const [recentReviews, setRecentReviews] = useState([]);
  const [popularReviews, setPopularReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Fetch recent reviews
      const recentRes = await fetch('http://localhost:3000/api/admin/recent-reviews?limit=6', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const recentData = await recentRes.json();
      setRecentReviews(Array.isArray(recentData) ? recentData : []);

      // Fetch popular reviews (most helpful)
      const popularRes = await fetch('http://localhost:3000/api/admin/popular-reviews?limit=6', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const popularData = await popularRes.json();
      setPopularReviews(Array.isArray(popularData) ? popularData : []);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setLoading(false);
    }
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
          <h1 className="text-2xl md:text-3xl font-bold text-[#FFFFFF] mb-2">Reviews</h1>
          <p className="text-[#888888] text-sm md:text-base">Monitor and manage user reviews</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 md:mb-8">
          <div className="bg-[#121212] p-4 rounded-lg border border-[#004F4F]">
            <div className="flex items-center gap-3">
              <div className="bg-[#00FF00]/20 p-3 rounded-lg">
                <MdOutlineRateReview className="text-2xl text-[#00FF00]" />
              </div>
              <div>
                <p className="text-[#888888] text-sm">Total Reviews</p>
                <p className="text-[#FFFFFF] text-2xl font-bold">
                  {new Set([...recentReviews.map(r => r._id), ...popularReviews.map(r => r._id)]).size}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#121212] p-4 rounded-lg border border-[#004F4F]">
            <div className="flex items-center gap-3">
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <MdOutlineRateReview className="text-2xl text-purple-500" />
              </div>
              <div>
                <p className="text-[#888888] text-sm">Anonymous Reviews</p>
                <p className="text-[#FFFFFF] text-2xl font-bold">
                  {[...recentReviews, ...popularReviews].filter((review, index, self) => 
                    review.isAnonymous && self.findIndex(r => r._id === review._id) === index
                  ).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#121212] p-4 rounded-lg border border-[#004F4F]">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <MdOutlineRateReview className="text-2xl text-blue-500" />
              </div>
              <div>
                <p className="text-[#888888] text-sm">Normal Reviews</p>
                <p className="text-[#FFFFFF] text-2xl font-bold">
                  {[...recentReviews, ...popularReviews].filter((review, index, self) => 
                    !review.isAnonymous && self.findIndex(r => r._id === review._id) === index
                  ).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Most Recent Section */}
        <ReviewSection
          title="Most Recent"
          reviews={recentReviews}
          emptyMessage="No recent reviews"
        />

        {/* Most Popular Section */}
        <ReviewSection
          title="Most Popular"
          reviews={popularReviews}
          emptyMessage="No popular reviews found"
          subtitle="(by helpful votes)"
        />
      </div>
    </div>
  );
}
