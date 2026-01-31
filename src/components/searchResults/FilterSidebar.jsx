export default function FilterSidebar({ filters, onFilterChange }) {
  const handleRatingChange = (rating) => {
    onFilterChange({ ...filters, rating });
  };

  const handleTypeChange = (type) => {
    const newTypes = filters.type.includes(type)
      ? filters.type.filter(t => t !== type)
      : [...filters.type, type];
    onFilterChange({ ...filters, type: newTypes });
  };

  const handleReset = () => {
    onFilterChange({ rating: 'any', type: [] });
  };

  return (
    <aside className="col-span-1 lg:sticky lg:top-24 lg:self-start font-inter">
      <div className="flex flex-col gap-4 rounded-md bg-[#121212] border border-[#004F4F] py-6 px-3">
        <h3 className="text-md font-semibold text-[#FFFFFF]">Filter Results</h3>

        {/* Rating Filter */}
        <div className="flex flex-col gap-4 border-t border-[#004F4F] pt-4">
          <p className="text-md font-semibold text-[#FFFFFF]">Rating</p>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              className="form-radio h-5 w-5 border-[#004F4F] bg-[#121212] text-[#00FF00] focus:ring-[#00FF00]"
              name="rating"
              type="radio"
              checked={filters.rating === 'any'}
              onChange={() => handleRatingChange('any')}
              style={{ accentColor: '#00ff00' }}
            />
            <span className="text-xs text-[#888888]">Any Rating</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              className="form-radio h-5 w-5 border-[#004F4F] bg-[#121212] text-[#00FF00] focus:ring-[#00FF00]"
              name="rating"
              type="radio"
              checked={filters.rating === '4'}
              onChange={() => handleRatingChange('4')}
              style={{ accentColor: '#00ff00' }}
            />
            <span className="text-xs text-[#888888]">4 stars &amp; up</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              className="form-radio h-5 w-5 border-[#004F4F] bg-[#121212] text-[#00FF00] focus:ring-[#00FF00]"
              name="rating"
              type="radio"
              checked={filters.rating === '3'}
              onChange={() => handleRatingChange('3')}
              style={{ accentColor: '#00ff00' }}
            />
            <span className="text-xs text-[#888888]">3 stars &amp; up</span>
          </label>
        </div>
        {/* University Type Filter */}
        <div className="flex flex-col gap-4 border-t border-[#004F4F] pt-4">
          <p className="text-md font-semibold text-[#FFFFFF]">University Type</p>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              className="form-checkbox h-3 w-3 rounded border-[#004F4F] bg-[#121212] text-[#00FF00] focus:ring-[#00FF00]"
              type="checkbox"
              checked={filters.type.includes('Public')}
              onChange={() => handleTypeChange('Public')}
              style={{ accentColor: '#00ff00' }}
            />
            <span className="text-xs text-[#888888]">Public</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              className="form-checkbox h-3 w-3 rounded border-[#004F4F] bg-[#121212] text-[#00FF00] focus:ring-[#00FF00]"
              type="checkbox"
              checked={filters.type.includes('Private')}
              onChange={() => handleTypeChange('Private')}
              style={{ accentColor: '#00ff00' }}
            />
            <span className="text-xs text-[#888888]">Private</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              className="form-checkbox h-3 w-3 rounded border-[#004F4F] bg-[#121212] text-[#00FF00] focus:ring-[#00FF00]"
              type="checkbox"
              checked={filters.type.includes('Online')}
              onChange={() => handleTypeChange('Online')}
              style={{ accentColor: '#00ff00' }}
            />
            <span className="text-xs text-[#888888]">Online</span>
          </label>
        </div>
        {/* Action Buttons */}
        <div className="flex flex-col gap-2 border-t border-[#004F4F] pt-6">
          <button 
            onClick={handleReset}
            className="flex h-8 w-full cursor-pointer items-center justify-center overflow-hidden rounded-md border border-[#004F4F] bg-transparent px-4 text-xs font-semibold text-[#888888] hover:text-[#00FF00] hover:border-[#00FF00] transition-colors"
          >
            <span className="truncate">Reset Filters</span>
          </button>
        </div>
      </div>
    </aside>
  );
}