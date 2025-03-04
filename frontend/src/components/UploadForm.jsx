import { useState } from "react";
import axios from "axios";
import { Check, AlertCircle } from "lucide-react";
import Navbar from "./Navbar";

const UploadForm = () => {
  const [modelUrl, setModelUrl] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!modelUrl) return;

    setIsUploading(true);
    setUploadStatus("idle");

    try {
      await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, modelUrl }),
      });

      setUploadStatus("success");
      setName("");
      setDescription("");
      setModelUrl("");
    } catch (error) {
      console.error("Upload Error:", error);
      setUploadStatus("error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="w-full max-w-md mx-auto p-4 sm:p-6 md:p-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Upload 3D Model</h2>

          {uploadStatus === "success" && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-md flex items-center">
              <Check className="w-5 h-5 mr-2" />
              <span>Model uploaded successfully!</span>
            </div>
          )}

          {uploadStatus === "error" && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>Upload failed. Please try again.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Model Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter model name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                id="description"
                placeholder="Enter model description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
              />
            </div>

            <div>
              <label htmlFor="modelUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Model URL
              </label>
              <input
                id="modelUrl"
                type="url"
                placeholder="Enter model URL (GLB or GLTF)"
                value={modelUrl}
                onChange={(e) => setModelUrl(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <button
              type="submit"
              disabled={isUploading || !modelUrl}
              className={`w-full py-2.5 px-4 rounded-md font-medium text-white ${
                isUploading || !modelUrl
                  ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
              } transition-colors duration-200 flex items-center justify-center`}
            >
              {isUploading ? "Uploading..." : "Upload Model"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadForm;
