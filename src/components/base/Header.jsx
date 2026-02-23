import { LiaUniversitySolid } from "react-icons/lia";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser, selectIsAuthenticated, logout } from "../../store/userSlice";

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
    setShowDropdown(false);
    navigate("/");
  };

  return (
  <div className="bg-black w-full flex items-center justify-center">
      <div className="flex bg-black text-white w-7xl font-inter items-center justify-between whitespace-nowrap border-b border-dark-green px-2   py-3">
        <div className="flex items-center gap-2 text-text-light">
          <div className="text-2xl  text-light-green flex items-center">
            <Link to="/">
              <LiaUniversitySolid />
            </Link>
            {/* SVG Logo */}
          </div>
          <h2 className="text-text-light font-bricolage text-xl font-bold leading-tight tracking-[-0.015em]">
            <Link to="/">Universe</Link>
          </h2>
        </div>
        <div className="hidden md:flex flex-1 justify-end gap-6 text-xs text-gray-500">
          <div className="flex items-center ">

            <Link
              className="text-text-muted hover:text-primary transition-colors text-xs  leading-normal"
                to="/write-review"
            >
              Write a Review
            </Link>
          </div>
          
          {isAuthenticated ? (
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                {user?.userImageUrl ? (
                  <img 
                    src={user.userImageUrl} 
                    alt={user.name || "User"} 
                    className="w-8 h-8 rounded-full object-cover border border-gray-600"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white font-semibold text-xs">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1C1C1C] border border-white/20 rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-white/10">
                    <p className="text-white text-sm font-medium">{user?.name}</p>
                    <p className="text-gray-400 text-xs">{user?.role}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    View Profile
                  </Link>
                  <Link
                    to="/saved-universities"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    Saved Universities
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2 text-xs">
              <button className="flex cursor-pointer text-white bg-dark-green items-center justify-center overflow-hidden rounded-sm font-semibold py-1 px-3 bg-card-dark text-text-light hover:bg-opacity-80 transition-colors ">
                <span className="truncate">
                  <Link to="/login">Log In</Link>
                </span>
              </button>
              <button className="flex  cursor-pointer bg-light-green text-black items-center justify-center overflow-hidden rounded-sm py-1 font-semibold px-3  text-background-dark hover:bg-opacity-90 transition-colors ">
                <span className="truncate">
                  <Link to="/signup">Sign Up</Link>
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
