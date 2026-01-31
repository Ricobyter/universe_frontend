import { Link } from "react-router-dom";

export default function CTASection() {
  return (
    
    <section className="mt-16 text-[#FFFFFF] flex flex-col items-center px-4 py-10 bg-[#121212] border border-[#004F4F] rounded-xl">
      <div className="flex flex-col gap-2 text-center">
        <h1 className=" text-[32px] font-poppins font-bold max-w-[720px] text-[#00FF00]">
          Share Your Experience
        </h1>
        <p className="text-[#888888] font-normal w-full">
          Help thousands of students make informed decisions by writing a review.
        </p>
      </div>
      <div className="flex justify-center mt-6">
        <Link to="/write-review">
        <button className="cursor-pointer rounded-lg h-10 px-4 bg-[#00FF00] text-[#0B0C10] hover:bg-[#00dd00] text-sm font-bold min-w-[84px] transition">
          Write a Review
        </button>
        </Link>
      </div>
    </section>
  );
}
