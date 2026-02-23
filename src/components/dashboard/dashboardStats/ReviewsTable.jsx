import { FiTrash2 } from 'react-icons/fi';

export default function ReviewsTable({ reviews, formatDate, getStatusBadge, onDelete }) {
  return (
    <div className="bg-black rounded-xl border border-gray-800 overflow-hidden">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-white text-xl font-semibold">Recent Reviews</h2>
        <p className="text-gray-400 text-sm">Latest reviews submitted by users.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#0A0A0A]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                University
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <tr key={review._id} className="hover:bg-[#0A0A0A] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {review.university?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {review.isAnonymous ? 'Anonymous' : (review.user?.name || 'N/A')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-white">{review.rating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">
                    {review.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {formatDate(review.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span 
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(review.status)}`}
                    >
                      {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => onDelete(review._id, review.title)}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-red-400"
                        title="Delete review"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-400">
                  No reviews submitted yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
