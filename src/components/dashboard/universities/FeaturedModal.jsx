import { FiX } from 'react-icons/fi';

export default function FeaturedModal({ 
  isOpen, 
  onClose, 
  universities, 
  searchTerm, 
  onSearchChange, 
  onToggleFeatured 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0A0A0A] border border-gray-800 rounded-lg w-full max-w-3xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h3 className="text-xl font-bold text-white">Manage Featured Universities</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <FiX className="text-2xl" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-800">
          <input
            type="text"
            placeholder="Search universities..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {universities
              .filter(uni => 
                uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                uni.country.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((university) => (
                <div
                  key={university._id}
                  className="flex items-center justify-between p-3 bg-black border border-gray-800 rounded-lg hover:border-teal-600 transition"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="size-12 rounded-lg bg-gray-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {university.logo ? (
                        <img src={university.logo} alt={university.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-teal-500 font-bold">
                          {university.name?.charAt(0) || 'U'}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-semibold truncate">{university.name}</h4>
                      <p className="text-gray-400 text-sm truncate">
                        {university.state}, {university.country}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onToggleFeatured(university._id)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition flex-shrink-0 ml-3 ${
                      university.isFeatured
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {university.isFeatured ? 'Featured' : 'Add Featured'}
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
