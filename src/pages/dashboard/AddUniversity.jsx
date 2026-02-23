/**
 * Add University Page Component
 * 
 * Page for adding a new university to the platform.
 * Features:
 * - Form-based university creation
 * - Upload logo and campus images
 * - Enter required and optional details
 * - Quick link to bulk add functionality
 * - Breadcrumb navigation
 * 
 * The actual form logic is encapsulated in the UniversityForm component
 * which handles all the complex state management and API calls.
 * 
 * Authentication:
 * - Requires admin role
 * - Form submission uses JWT token
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import SideNavBar from "../../components/dashboard/SideNavBar";
import TopNavBar from "../../components/dashboard/TopNavBar";
import Breadcrumbs from "../../components/dashboard/Breadcrumbs";
import UniversityForm from "../../components/dashboard/addUniversity/UniversityForm";

export default function AddUniversity() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-[#0B0C10]">
      <SideNavBar />
      <div className="ml-0 md:ml-64 flex-1 p-4 md:p-8 w-full">
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-[#00FF00]">Add New University</h1>
            <button
              onClick={() => navigate("/dashboard/bulk-add-university")}
              className="px-4 py-2 bg-[#00FF00] text-[#0B0C10] rounded-lg hover:bg-[#00dd00] transition text-sm md:text-base font-medium"
            >
              Add in Bulk
            </button>
          </div>
          <p className="text-[#888888] text-sm md:text-base">Fill in the details to add a new university</p>
        </div>
        <UniversityForm />
      </div>
    </div>
  );
}
