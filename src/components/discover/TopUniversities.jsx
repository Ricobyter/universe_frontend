import { FaStar } from "react-icons/fa";
import { IoStarOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const universities = [
  {
    name: "Stanford University",
    location: "Stanford, USA",
    stars: 4.8,
    image: "https://www.pexels.com/photo/building-in-city-against-sky-256490/",
  },
  {
    name: "Massachusetts Institute of Technology",
    location: "Cambridge, USA",
    stars: 4.9,
    image: "https://www.pexels.com/photo/building-in-city-against-sky-256490/",
  },
  {
    name: "Harvard University",
    location: "Cambridge, USA",
    stars: 4.7,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHvDR9Jgbhkq89XkuE79w3PV2Jb7DMIW3XGA&s",
  },
  {
    name: "University of Cambridge",
    location: "Cambridge, UK",
    stars: 4.6,
    image: "https://www.pexels.com/photo/building-in-city-against-sky-256490/",
  },
];

function UniversityCard({ image, name, location, stars, id }) {
  const navigate = useNavigate();
  
  return (
    <div 
      onClick={() => id && navigate(`/university/${id}`)}
      className="flex cursor-pointer flex-col gap-2 bg-[#121212] border border-[#004F4F] p-2 rounded-md hover:border-[#00FF00] hover:-translate-y-1 transition-all duration-300 h-full uni-card">
      <div
        className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-md"
        style={{ backgroundImage: `url("${image}")` }}
      ></div>
      <div className="mt-2 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-sm font-medium text-[#00FF00] uni-name">{name}</p>
          <p className="text-xs font-normal text-[#888888]">{location}</p>
        </div>
        <div className="flex items-center gap-1 mt-2">
          <span className="text-[#00FF00] text-xs">
            <IoStarOutline />
          </span>
          <p className="text-xs text-[#FFFFFF]">{stars} Stars</p>
        </div>
      </div>
    </div>
  );
}

export default function TopUniversities() {
  return (
    <section>
      <h2 className="font-poppins text-[#00FF00] text-2xl font-semibold  pb-3 pt-5">
        Top Rated Universities
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 ">
        {universities.map((u) => (
          <UniversityCard key={u.name} {...u} />
        ))}
      </div>
    </section>
  );
}
