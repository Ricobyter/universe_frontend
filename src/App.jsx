
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { RiRobot2Line } from "react-icons/ri";
import { loadUserFromStorage } from "./store/userSlice";
import Header from "./components/base/Header";
import ChatbotSidebar from "./components/dashboard/ChatbotSidebar";
import Discover from "./pages/discover/Discover";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import WriteReviewPage from "./components/review/WriteReview";
import SearchResultsPage from "./pages/searchResults/SearchResultsPage";
import Dashboard from "./pages/dashboard/Dashboard";
import AddUniversity from "./pages/dashboard/AddUniversity";
import BulkAddUniversity from "./pages/dashboard/BulkAddUniversity";
import EditUniversity from "./pages/dashboard/EditUniversity";
import EditUniversitySearch from "./pages/dashboard/EditUniversitySearch";
import Universities from "./pages/dashboard/Universities";
import Users from "./pages/dashboard/Users";
import Reviews from "./pages/dashboard/Reviews";
import UserProfile from "./pages/userProfile/UserProfile";
import UserInfo from "./pages/userProfile/UserInfo";
import UniversityInfo from "./pages/universityInfo/UniversityInfo";
import SavedUniversities from "./pages/userProfile/SavedUniversities";

function AppContent() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Load user from localStorage on app start
  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);
  
  const hideHeaderRoutes = ["/login", "/signup", "/dashboard", "/dashboard/universities", "/dashboard/users", "/dashboard/reviews", "/dashboard/add-university", "/dashboard/bulk-add-university", "/dashboard/edit-university-search"];
  const showHeader = !hideHeaderRoutes.includes(location.pathname) && !location.pathname.startsWith('/dashboard/edit-university/');

  return (
    <>
      {showHeader && <Header onOpenChat={() => setIsChatOpen(true)} />}
      <ChatbotSidebar isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <button
        type="button"
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-full border border-light-green/30 bg-black px-4 py-3 text-light-green shadow-lg shadow-black/40 transition-colors hover:bg-light-green hover:text-black"
        aria-label="Open chatbot"
      >
        <RiRobot2Line className="text-xl" />
        <span className="text-sm font-semibold">Chatbot</span>
      </button>
      <Routes>
        <Route path="/" element={<Discover />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/write-review" element={<WriteReviewPage />} />
        <Route path="/search" element={<SearchResultsPage/>} />
        <Route path="/dashboard" element={<Dashboard onOpenChat={() => setIsChatOpen(true)} />} />
        <Route path="/dashboard/universities" element={<Universities/>} />
        <Route path="/dashboard/users" element={<Users/>} />
        <Route path="/dashboard/reviews" element={<Reviews/>} />
        <Route path="/dashboard/add-university" element={<AddUniversity/>} />
        <Route path="/dashboard/bulk-add-university" element={<BulkAddUniversity/>} />
        <Route path="/dashboard/edit-university-search" element={<EditUniversitySearch/>} />
        <Route path="/dashboard/edit-university/:id" element={<EditUniversity/>} />
        <Route path="/profile" element={<UserProfile/>} />
        <Route path="/user/:id" element={<UserInfo/>} />
        <Route path="/saved-universities" element={<SavedUniversities/>} />
        <Route path="/university/:id" element={<UniversityInfo/>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
