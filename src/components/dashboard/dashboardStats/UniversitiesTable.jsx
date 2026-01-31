import { FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function UniversitiesTable({ universities, formatDate }) {
  return (
    <div className="bg-black rounded-xl border border-gray-800 overflow-hidden mb-8">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-white text-xl font-semibold">Recently Added Universities</h2>
        <p className="text-gray-400 text-sm">Latest universities added to the platform.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#0A0A0A]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                University
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Established
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Date Added
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {universities.length > 0 ? (
              universities.map((university) => (
                <tr key={university._id} className="hover:bg-[#0A0A0A] transition-colors">
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-3">
                      <img 
                        src={university.logo || 'https://via.placeholder.com/40'} 
                        alt={university.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <span className="text-white font-medium">{university.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {university.state}, {university.country}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {university.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {university.establishedYear}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-white">
                        {university.ratings.average > 0 
                          ? university.ratings.average.toFixed(1) 
                          : 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {formatDate(university.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white">
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white">
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-red-400">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-400">
                  No universities added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
