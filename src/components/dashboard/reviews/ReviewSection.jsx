import ReviewCard from './ReviewCard';

export default function ReviewSection({ title, reviews, emptyMessage, subtitle }) {
  return (
    <div className="mb-6 md:mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-6 bg-teal-500 rounded-full"></div>
        <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
        {subtitle && <span className="text-xs text-gray-400">{subtitle}</span>}
      </div>
      
      {reviews.length === 0 ? (
        <div className="bg-black border border-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-400">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}
