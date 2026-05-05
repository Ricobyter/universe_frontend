import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/userSlice";
import { LiaUniversitySolid } from "react-icons/lia";
import { LuLayoutDashboard } from "react-icons/lu";
import { LuUniversity } from "react-icons/lu";
import { MdOutlineRateReview } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { HiUsers } from "react-icons/hi";
import { MdAnalytics } from "react-icons/md";
import { RiRobot2Line } from "react-icons/ri";

export default function SideNavBar({ onOpenChat }) {
  const location = useLocation();
  const user = useSelector(selectCurrentUser);
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 shrink-0 bg-[#0B0C10] p-4 flex flex-col justify-between text-white overflow-y-auto border-r border-[#004F4F]">
      <div className="flex flex-col gap-4">
        <Link to="/" className="flex items-center gap-2 text-white mb-2 hover:opacity-80 transition-opacity">
          <span className="text-[#00FF00] text-2xl"><LiaUniversitySolid /></span>
          <h2 className="text-white font-semibold font-bricolage text-lg">Universe</h2>
          <span className="text-xs bg-[#00FF00] text-[#0B0C10] px-2 py-0.5 rounded-full ml-auto font-semibold">Admin Panel</span>
        </Link>
        
        <div className="flex items-center gap-3 pb-4 border-b border-[#004F4F]">
          <div className="size-10 rounded-full overflow-hidden flex items-center justify-center">
            {user?.userImageUrl ? (
              <img
                src={user.userImageUrl}
                alt={user?.name || 'User'}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-[#00FF00] to-[#004F4F] flex items-center justify-center">
                <span className="text-[#0B0C10] text-lg font-bold">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <h1 className="text-[#FFFFFF] text-sm font-medium leading-normal">
              {user?.name || 'User'}
            </h1>
            <p className="text-[#888888] text-xs font-normal leading-normal">
              {user?.email || 'user@example.com'}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col gap-1">
          <Link 
            to="/dashboard" 
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive('/dashboard') 
                ? 'bg-[#00FF00] text-[#0B0C10]' 
                : 'text-[#888888] hover:bg-[#004F4F]/30 hover:text-[#FFFFFF]'
            }`}
          >
            <LuLayoutDashboard className="text-lg"/>
            <p className="text-sm font-medium leading-normal">Dashboard</p>
          </Link>
          
          <Link 
            to="/dashboard/universities" 
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive('/dashboard/universities') 
                ? 'bg-[#00FF00] text-[#0B0C10]' 
                : 'text-[#888888] hover:bg-[#004F4F]/30 hover:text-[#FFFFFF]'
            }`}
          >
            <LuUniversity className="text-lg"/>
            <p className="text-sm font-medium leading-normal">Universities</p>
          </Link>
          
          <Link 
            to="/dashboard/users" 
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive('/dashboard/users') 
                ? 'bg-[#00FF00] text-[#0B0C10]' 
                : 'text-[#888888] hover:bg-[#004F4F]/30 hover:text-[#FFFFFF]'
            }`}
          >
            <HiUsers className="text-lg"/>
            <p className="text-sm font-medium leading-normal">Users</p>
          </Link>
          
          <Link 
            to="/dashboard/reviews" 
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive('/dashboard/reviews') 
                ? 'bg-[#00FF00] text-[#0B0C10]' 
                : 'text-[#888888] hover:bg-[#004F4F]/30 hover:text-[#FFFFFF]'
            }`}
          >
            <MdOutlineRateReview className="text-lg"/>
            <p className="text-sm font-medium leading-normal">Reviews</p>
          </Link>
          
          {/* <Link 
            to="/dashboard/analytics" 
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive('/dashboard/analytics') 
                ? 'bg-[#00FF00] text-[#0B0C10]' 
                : 'text-[#888888] hover:bg-[#004F4F]/30 hover:text-[#FFFFFF]'
            }`}
          >
            <MdAnalytics className="text-lg"/>
            <p className="text-sm font-medium leading-normal">Analytics</p>
          </Link> */}

          <button
            type="button"
            onClick={onOpenChat}
            className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-[#B8FFB8] bg-[#00FF00]/10 hover:bg-[#00FF00]/20 hover:text-[#FFFFFF] border border-[#00FF00]/20"
          >
            <RiRobot2Line className="text-lg" />
            <p className="text-sm font-medium leading-normal">Chatbot</p>
          </button>
        </div>
      </div>
      
      {/* <div className="flex flex-col gap-1 border-t border-[#004F4F] pt-4">
        <Link 
          to="/dashboard/settings" 
          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            isActive('/dashboard/settings') 
              ? 'bg-[#00FF00] text-[#0B0C10]' 
              : 'text-[#888888] hover:bg-[#004F4F]/30 hover:text-[#FFFFFF]'
          }`}
        >
          <IoMdSettings className="text-lg"/>
          <p className="text-sm font-medium leading-normal">Settings</p>
        </Link>
      </div> */}
    </aside>
  );
}
