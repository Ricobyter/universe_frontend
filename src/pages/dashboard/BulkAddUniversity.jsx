/**
 * Bulk Add University Page Component
 * 
 * Page for adding multiple universities at once via Excel upload.
 * Features:
 * - Excel file upload (.xlsx, .xls)
 * - Template download functionality
 * - File validation and parsing
 * - Batch processing with success/error tracking
 * - Progress feedback during upload
 * - Detailed results showing successes and failures
 * 
 * Workflow:
 * 1. User downloads template
 * 2. Fills in university data in Excel
 * 3. Uploads filled template
 * 4. System processes and validates each row
 * 5. Shows results with success/error counts
 * 
 * Uses XLSX library for Excel file parsing
 * 
 * Authentication:
 * - Requires admin role
 * - Uses JWT token for API requests
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SideNavBar from "../../components/dashboard/SideNavBar";
import * as XLSX from "xlsx";
import { api } from "../../config/api";

export default function BulkAddUniversity() {
  const navigate = useNavigate();
  
  // File and upload state
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  // Results after upload
  const [results, setResults] = useState(null);
  
  // Error messages
  const [error, setError] = useState("");

  /**
   * Handle file selection and validation
   * Only accepts Excel files (.xlsx, .xls)
   */
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type is Excel
      if (
        selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        selectedFile.type === "application/vnd.ms-excel"
      ) {
        setFile(selectedFile);
        setError("");
      } else {
        setError("Please upload a valid Excel file (.xlsx or .xls)");
        setFile(null);
      }
    }
  };

  /**
   * Generate and download template Excel file
   * Provides example data and all required/optional fields
   */
  const downloadTemplate = () => {
    // Create template with example data
    const template = [
      {
        name: "Example University",
        country: "United States",
        state: "California",
        establishedYear: 1891,
        type: "Private",
        website: "https://example.edu",
        averageFees: 50000,
        accreditation: "WASC",
        totalStudents: 15000,
        totalFaculty: 2000,
        campusArea: 8180,
        contactEmail: "info@example.edu",
        contactNumber: "+1-650-123-4567",
        description: "A leading university...",
        emailDomain: "example.edu",
        tags: "Engineering,Computer Science,Business"
      }
    ];

    // Convert to Excel and trigger download
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Universities");
    XLSX.writeFile(wb, "university_template.xlsx");
  };

  /**
   * Handle file upload and processing
   * Parses Excel file, validates data, and sends to backend
   */
  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setUploading(true);
    setError("");
    setResults(null);

    try {
      // Read and parse Excel file
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Validate file has data
      if (jsonData.length === 0) {
        setError("The Excel file is empty");
        setUploading(false);
        return;
      }

      // Process each row into university object
      // Only include fields that have values
      const universities = jsonData.map((row) => {
        const university = {
          // Required fields
          name: row.name,
          country: row.country,
          state: row.state,
          establishedYear: row.establishedYear,
          type: row.type,
          website: row.website,
        };

        // Optional fields - only add if they exist in the Excel file
        if (row.averageFees) university.averageFees = Number(row.averageFees);
        if (row.accreditation) university.accreditation = row.accreditation;
        if (row.totalStudents) university.totalStudents = Number(row.totalStudents);
        if (row.totalFaculty) university.totalFaculty = Number(row.totalFaculty);
        if (row.campusArea) university.campusArea = Number(row.campusArea);
        if (row.contactEmail) university.contactEmail = row.contactEmail;
        if (row.contactNumber) university.contactNumber = row.contactNumber;
        if (row.description) university.description = row.description;
        if (row.emailDomain) university.emailDomain = row.emailDomain;
        if (row.tags) {
          university.tags = typeof row.tags === 'string' 
            ? row.tags.split(',').map(tag => tag.trim())
            : row.tags;
        }

        return university;
      });

      // Send to backend
      const token = localStorage.getItem("token");
      const response = await fetch(api.universities.bulk, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ universities }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to upload universities");
      }

      setResults(result);
      setFile(null);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to process file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0B0C10]">
      <SideNavBar />
      <div className="ml-0 md:ml-64 flex-1 p-4 md:p-8 w-full">
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-[#00FF00]">
              Bulk Add Universities
            </h1>
            <button
              onClick={() => navigate("/dashboard/add-university")}
              className="px-4 py-2 bg-[#121212] text-[#FFFFFF] rounded-lg hover:bg-[#1a1a1a] transition text-sm border border-[#004F4F]"
            >
              Add Single University
            </button>
          </div>
          <p className="text-[#888888] text-sm md:text-base">
            Upload an Excel file to add multiple universities at once
          </p>
        </div>

        <div className="max-w-4xl">
          {/* Instructions */}
          <div className="bg-[#121212] border border-[#004F4F] rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-[#00FF00] mb-4">Instructions</h2>
            <ol className="list-decimal list-inside space-y-2 text-[#FFFFFF] text-sm">
              <li>Download the template Excel file</li>
              <li>Fill in the university details (required fields: name, country, state, establishedYear, type, website)</li>
              <li>Optional fields can be left empty if not available</li>
              <li>Upload the completed file</li>
              <li>Review the results and check for any errors</li>
            </ol>
            <button
              onClick={downloadTemplate}
              className="mt-4 px-4 py-2 bg-[#00FF00] text-[#0B0C10] rounded-lg hover:bg-[#00dd00] transition text-sm font-medium"
            >
              Download Template
            </button>
          </div>

          {/* Upload Section */}
          <div className="bg-[#121212] border border-[#004F4F] rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-[#00FF00] mb-4">Upload File</h2>
            
            <div className="mb-4">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-[#004F4F] border-dashed rounded-lg cursor-pointer bg-[#121212] hover:bg-[#1a1a1a] transition"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-10 h-10 mb-3 text-[#888888]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-[#888888]">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-[#888888]">Excel files (.xlsx, .xls)</p>
                  {file && (
                    <p className="mt-2 text-sm text-[#00FF00] font-medium">{file.name}</p>
                  )}
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-[#1a0000] border border-[#ff0000] rounded-lg text-[#ff4444] text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full px-6 py-3 bg-[#00FF00] text-[#0B0C10] rounded-lg hover:bg-[#00dd00] transition disabled:bg-[#888888] disabled:cursor-not-allowed font-medium"
            >
              {uploading ? "Uploading..." : "Upload Universities"}
            </button>
          </div>

          {/* Results */}
          {results && (
            <div className="bg-[#121212] border border-[#004F4F] rounded-xl p-6">
              <h2 className="text-xl font-semibold text-[#00FF00] mb-4">Upload Results</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-[#1a1a1a] border border-[#004F4F] rounded-lg p-4">
                  <p className="text-[#888888] text-sm mb-1">Total Processed</p>
                  <p className="text-2xl font-bold text-[#FFFFFF]">{results.total || 0}</p>
                </div>
                <div className="bg-[#001a00] border border-[#00FF00] rounded-lg p-4">
                  <p className="text-[#888888] text-sm mb-1">Successfully Added</p>
                  <p className="text-2xl font-bold text-[#00FF00]">{results.successful || 0}</p>
                </div>
                <div className="bg-[#1a0000] border border-[#ff0000] rounded-lg p-4">
                  <p className="text-[#888888] text-sm mb-1">Failed</p>
                  <p className="text-2xl font-bold text-[#ff4444]">{results.failed || 0}</p>
                </div>
              </div>

              {results.errors && results.errors.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-[#00FF00] mb-3">Errors</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {results.errors.map((err, index) => (
                      <div
                        key={index}
                        className="bg-[#1a0000] border border-[#ff0000] rounded-lg p-3 text-sm"
                      >
                        <p className="text-[#ff4444] font-medium mb-1">
                          Row {err.row}: {err.name || "Unknown"}
                        </p>
                        <p className="text-[#888888]">{err.error}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.successful > 0 && (
                <div className="mt-4">
                  <button
                    onClick={() => navigate("/dashboard/universities")}
                    className="px-4 py-2 bg-[#00FF00] text-[#0B0C10] rounded-lg hover:bg-[#00dd00] transition text-sm font-medium"
                  >
                    View Universities
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
