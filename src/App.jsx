
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUserFromStorage } from "./store/userSlice";
import Header from "./components/base/Header";
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
  
  // Load user from localStorage on app start
  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, [dispatch]);
  
  const hideHeaderRoutes = ["/login", "/signup", "/dashboard", "/dashboard/universities", "/dashboard/users", "/dashboard/reviews", "/dashboard/add-university", "/dashboard/bulk-add-university", "/dashboard/edit-university-search"];
  const showHeader = !hideHeaderRoutes.includes(location.pathname) && !location.pathname.startsWith('/dashboard/edit-university/');

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<Discover />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/write-review" element={<WriteReviewPage />} />
        <Route path="/search" element={<SearchResultsPage/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
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
