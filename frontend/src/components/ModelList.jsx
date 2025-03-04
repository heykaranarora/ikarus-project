"use client"

import { useEffect, useState } from "react";
import ModelViewer from "./ModelViewer";
import Navbar from "./Navbar";

const ModelList = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = () => {
    setLoading(true);
    fetch("http://localhost:5000/api/models")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server responded with status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setModels(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching models:", err);
        setError(err.message);
        setLoading(false);
      });
  };

  const deleteModel = (id) => {
    if (!window.confirm("Are you sure you want to delete this model?")) return;

    fetch(`http://localhost:5000/api/models/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete the model");
        }
        setModels(models.filter((model) => model._id !== id));
      })
      .catch((err) => {
        console.error("Error deleting model:", err);
        alert("Failed to delete the model");
      });
  };

  if (loading) {
    return <p className="text-center text-gray-500 py-12">Loading models...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 py-12">{error}</p>;
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">3D Model Gallery</h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Explore our collection of stunning 3D models
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {models.map((model) => (
              <div
                key={model._id}
                className="bg-white overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-600">
                  <div className="bg-white p-4">
                    <ModelViewer url={model.modelUrl} name={model.name} description={model.description} />
                  </div>
                </div>

                <div className="px-6 py-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{model.name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{model.description}</p>
                </div>

                <div className="px-6 pt-2 pb-6 flex justify-between">
                  <a
                    href={model.modelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                  >
                    View Model
                  </a>
                  <button
                    onClick={() => deleteModel(model._id)}
                    className="px-3 py-1 text-sm font-medium rounded-md text-red-600 bg-red-100 hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelList;