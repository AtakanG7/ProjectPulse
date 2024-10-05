import React, { useState } from 'react';
import { FaTimes, FaUpload, FaTrashAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

const ProjectImages = ({ projectId, images, onUpdate }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const showNotification = (message, type = 'success') => {
    if (type === 'success') {
      toast.success(message);
    } else if (type === 'error') {
      toast.error(message);
    } else {
      toast(message);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showNotification('File size exceeds 5MB limit', 'error');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('projectId', projectId);

    try {
      const response = await fetch('/api/projects/images', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        onUpdate(data.project);
        showNotification('Image uploaded successfully');
      } else {
        throw new Error(data.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      showNotification(error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpdate = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showNotification('File size exceeds 5MB limit', 'error');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('projectId', projectId);
    formData.append('oldImageUrl', images[selectedImageIndex]);

    try {
      const response = await fetch('/api/projects/images', {
        method: 'PATCH',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        onUpdate(data.project);
        setIsModalOpen(false);
        showNotification('Image updated successfully');
      } else {
        throw new Error(data.message || 'Failed to update image');
      }
    } catch (error) {
      console.error('Error updating image:', error);
      showNotification(error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageDelete = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/projects/images', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId, imageUrl: images[selectedImageIndex] }),
      });
      const data = await response.json();
      if (response.ok) {
        onUpdate(data.project);
        setIsModalOpen(false);
        showNotification('Image deleted successfully');
      } else {
        throw new Error(data.message || 'Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      showNotification(error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateImage = (direction) => {
    const newIndex = (selectedImageIndex + direction + images?.length) % images?.length;
    setSelectedImageIndex(newIndex);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-semibold mb-8 text-gray-900 tracking-wide">Project Gallery</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {images?.map((image, index) => (
          <div
            key={index}
            className="relative group aspect-square bg-gray-100 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => {
              setSelectedImageIndex(index);
              setIsModalOpen(true);
            }}
          >
            <img
              src={image}
              alt={`Project image ${index + 1}`}
              className="w-full h-full object-cover transition-transform transform group-hover:scale-105 duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center">
              <p className="text-white text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium">View</p>
            </div>
          </div>
        ))}

        {images?.length < 3 && (
          <div className="relative flex items-center justify-center aspect-square bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors duration-300">
            <label className="cursor-pointer flex flex-col items-center justify-center h-full w-full text-center">
              <input
                type="file"
                className="hidden"
                onChange={handleImageUpload}
                accept="image/*"
                disabled={isLoading}
              />
              <FaUpload className="w-12 h-12 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Upload Image</p>
            </label>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full mx-4 overflow-hidden">
            <div className="relative h-96">
              <img
                src={images[selectedImageIndex]}
                alt={`Project image ${selectedImageIndex + 1}`}
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => navigateImage(-1)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all duration-200"
              >
                <FaChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
              <button
                onClick={() => navigateImage(1)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 p-2 rounded-full shadow-md hover:bg-opacity-100 transition-all duration-200"
              >
                <FaChevronRight className="w-6 h-6 text-gray-800" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Image Options</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>
              <div className="flex justify-between space-x-4">
                <button
                  onClick={handleImageDelete}
                  className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300"
                  disabled={isLoading}
                >
                  <FaTrashAlt className="w-5 h-5 mr-2" />
                  Delete
                </button>
                <label className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer transition-colors duration-300">
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageUpdate}
                    accept="image/*"
                    disabled={isLoading}
                  />
                  <FaUpload className="w-5 h-5 mr-2" />
                  Update
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-70"></div>
        </div>
      )}
    </div>
  );
};

export default ProjectImages;