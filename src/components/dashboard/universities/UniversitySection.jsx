import UniversityCard from './UniversityCard';

export default function UniversitySection({ 
  title, 
  universities, 
  emptyMessage, 
  accentColor = 'teal-500' 
}) {
  return (
    <div className="mb-6 md:mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-1 h-6 bg-${accentColor} rounded-full`}></div>
        <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
      </div>
      
      {universities.length === 0 ? (
        <div className="bg-black border border-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-400">{emptyMessage}</p>
          {title === 'Featured Universities' && (
            <p className="text-gray-500 text-sm mt-2">Click "Manage Featured" to add featured universities</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {universities.map((university) => (
            <UniversityCard key={university._id} university={university} />
          ))}
        </div>
      )}
    </div>
  );
}
