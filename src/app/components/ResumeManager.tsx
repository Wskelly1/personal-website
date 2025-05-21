"use client";

import { useState } from "react";

export default function ResumeManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await fetch("/api/resume", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setSuccess("Resume uploaded successfully");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to upload resume");
      }
    } catch (error) {
      setError("An error occurred while uploading the resume");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete the current resume?")) {
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/resume", {
        method: "DELETE",
      });

      if (response.ok) {
        setSuccess("Resume deleted successfully");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete resume");
      }
    } catch (error) {
      setError("An error occurred while deleting the resume");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-xl font-semibold mb-4">Resume Management</h2>
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
          {success}
        </div>
      )}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Upload New Resume</h3>
          <p className="text-gray-600 mb-4">
            Upload a PDF file to replace your current resume. The file will be automatically renamed to resume.pdf.
          </p>
          <div className="flex items-center space-x-4">
            <label className="btn-primary cursor-pointer">
              <span>Choose File</span>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isLoading}
              />
            </label>
            {isLoading && <span className="text-gray-500">Uploading...</span>}
          </div>
        </div>
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-2">Current Resume</h3>
          <div className="flex items-center space-x-4">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              View Current Resume
            </a>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="btn-danger"
            >
              Delete Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 