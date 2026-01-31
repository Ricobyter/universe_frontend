import { FaStar, FaThumbsUp } from 'react-icons/fa';

export default function ReviewCard({ review }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-black p-4 rounded-lg border border-gray-800 hover:border-teal-600 transition-all">
      <div className="flex items-start gap-3 mb-3">
        <div className="size-10 md:size-12 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0">
          <span className="text-teal-500 font-bold text-sm md:text-base">
            {review.isAnonymous 
              ? 'A' 
              : (review.user?.name || 'U').charAt(0).toUpperCase()
            }
          </span>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-sm md:text-base mb-1 truncate">
                {review.isAnonymous ? review.anonymousName : (review.user?.name || 'User')}
              </h3>
              <p className="text-gray-400 text-xs md:text-sm truncate">
                {review.university?.name || 'University'}
              </p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`text-xs md:text-sm ${
                    i < review.rating ? 'text-yellow-500' : 'text-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          {review.title && (
            <h4 className="text-white font-medium text-sm mb-2 line-clamp-1">
              {review.title}
            </h4>
          )}

          {review.reviewText && (
            <p className="text-gray-300 text-xs md:text-sm mb-3 line-clamp-2">
              {review.reviewText}
            </p>
          )}

          {review.tags && review.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {review.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-500"
                >
                  {tag}
                </span>
              ))}
              {review.tags.length > 3 && (
                <span className="text-xs text-gray-400">
                  +{review.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-gray-400">
                <FaThumbsUp className="text-xs" />
                <span>{review.helpfulVotes || 0}</span>
              </span>
              {review.status && (
                <span className={`px-2 py-0.5 rounded text-xs ${
                  review.status === 'approved' 
                    ? 'bg-green-500/20 text-green-500'
                    : review.status === 'pending'
                    ? 'bg-yellow-500/20 text-yellow-500'
                    : 'bg-red-500/20 text-red-500'
                }`}>
                  {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                </span>
              )}
            </div>
            <span className="text-gray-400">{formatDate(review.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
