import { useNavigate } from "react-router-dom";

// Single university card component
export default function UniversityCard({ university }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border-color bg-background-secondary p-5 transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-lg font-bold leading-tight text-text-primary">{university.name}</h3>
          <p className="text-sm font-normal leading-normal text-text-secondary">{university.location}</p>
          <div className="mt-1 flex items-center gap-1">
            <Stars stars={university.stars} />
            <span className="ml-1.5 text-sm font-medium text-text-secondary">{university.rating}</span>
          </div>
        </div>
        <div
          className="h-16 w-16 shrink-0 rounded-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url("${university.logo}")` }}
          data-alt={`${university.name} logo`}
        ></div>
      </div>
      <button 
        onClick={() => navigate(`/university/${university._id || university.id}`)}
        className="flex h-10 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-primary/50 bg-primary/20 px-4 text-sm font-bold text-primary transition-colors hover:bg-primary/30">
        <span className="truncate">View Details</span>
      </button>
    </div>
  );
}