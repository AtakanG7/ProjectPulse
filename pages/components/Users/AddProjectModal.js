import React, { useState } from 'react';
import { FaTimes, FaPlus, FaTag, FaLink, FaImage, FaFolder } from 'react-icons/fa';

export default function AddProjectModal({ isModalOpen, setIsModalOpen, handleAddProject }) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [errors, setErrors] = useState({});

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!title.trim()) newErrors.title = 'Title is required';
      if (!description.trim()) newErrors.description = 'Description is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep()) {
      handleAddProject({
        title,
        description,
        category,
        tags,
        imageUrl,
        projectUrl
      });
      setIsModalOpen(false);
    }
  };

  const handleTagInput = (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
      setTags([...tags, e.target.value.trim()]);
      e.target.value = '';
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center px-4 py-6 sm:p-0">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto">
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Add New Project</h3>
            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
              <FaTimes />
            </button>
          </div>
          <div className="mt-3 flex justify-between">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`w-1/3 h-1 ${step >= i ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4">
          {step === 1 && (
            <div>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full p-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter project title"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`w-full p-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                  rows="3"
                  placeholder="Describe your project"
                ></textarea>
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  <FaFolder className="inline mr-2" />
                  Category
                </label>
                <input
                  id="category"
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border rounded-md border-gray-300"
                  placeholder="e.g., Web Development, Mobile App"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                  <FaTag className="inline mr-2" />
                  Tags
                </label>
                <input
                  id="tags"
                  type="text"
                  onKeyPress={handleTagInput}
                  className="w-full p-2 border rounded-md border-gray-300"
                  placeholder="Add tags and press Enter"
                />
                <div className="flex flex-wrap mt-2">
                  {tags.map((tag, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded flex items-center">
                      {tag}
                      <button type="button" onClick={() => removeTag(index)} className="ml-2 text-blue-800">
                        <FaTimes size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="mb-4">
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  <FaImage className="inline mr-2" />
                  Image URL
                </label>
                <input
                  id="imageUrl"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-2 border rounded-md border-gray-300"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="projectUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  <FaLink className="inline mr-2" />
                  Project URL
                </label>
                <input
                  id="projectUrl"
                  type="url"
                  value={projectUrl}
                  onChange={(e) => setProjectUrl(e.target.value)}
                  className="w-full p-2 border rounded-md border-gray-300"
                  placeholder="https://yourproject.com"
                />
              </div>
            </div>
          )}
        </form>

        <div className="px-6 py-4 bg-gray-50 border-t flex justify-between">
          {step > 1 && (
            <button
              type="button"
              onClick={handlePrevious}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Previous
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              Add Project
            </button>
          )}
        </div>
      </div>
    </div>
  );
}