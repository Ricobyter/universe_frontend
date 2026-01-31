import { FaStar } from 'react-icons/fa';

export default function UniversityCard({ university }) {
  return (
    <div className="bg-black p-4 rounded-lg border border-gray-800 hover:border-teal-600 transition-all">
      <div className="flex items-start gap-3">
        <div className="size-14 md:size-16 rounded-lg bg-gray-800 flex items-center justify-center overflow-hidden flex-shrink-0">
          {university.logo ? (
            <img src={university.logo} alt={university.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-teal-500 text-xl font-bold">
              {university.name?.charAt(0) || 'U'}
            </span>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm md:text-base mb-1 truncate">
            {university.name}
          </h3>
          <p className="text-gray-400 text-xs md:text-sm mb-2 truncate">
            {university.city && university.state 
              ? `${university.city}, ${university.state}` 
              : university.country || 'Location not specified'}
          </p>
          
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <FaStar className="text-yellow-500" />
              <span className="text-white font-medium">
                {university.ratings?.average?.toFixed(1) || '0.0'}
              </span>
              <span className="text-gray-400">
                ({university.ratings?.count || 0})
              </span>
            </div>
            
            {university.type && (
              <span className="px-2 py-0.5 bg-teal-600/20 text-teal-500 rounded text-xs">
                {university.type}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
