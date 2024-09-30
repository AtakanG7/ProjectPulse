import React, { useState, useEffect } from 'react';

const DeleteProjectModal = ({ isOpen, onClose, onDelete, projectName }) => {
  const [inputValue, setInputValue] = useState('');
  const [isDeleteEnabled, setIsDeleteEnabled] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setInputValue('');
      setIsDeleteEnabled(false);
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setIsDeleteEnabled(value === projectName);
  };

  const handleDelete = () => {
    if (isDeleteEnabled) {
      onDelete();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white p-5 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Delete Project</h2>
        <p className="mb-4 text-gray-700">
          Are you sure you want to delete this project? This action cannot be undone. Please type the project name <strong>"{projectName}"</strong> to confirm.
        </p>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type project name here"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
        />
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={!isDeleteEnabled}
            className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
              isDeleteEnabled
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-red-300 text-gray-100 cursor-not-allowed'
            }`}
          >
            Delete Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProjectModal;