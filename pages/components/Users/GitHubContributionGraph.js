import React, { useState } from 'react';
import { X } from 'lucide-react';

const GitHubContributionGraph = ({ username }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div 
        className="w-full h-[200px] md:h-auto md:max-h-[400px] cursor-pointer overflow-hidden"
        onClick={openModal}
      >
        <img 
          src={`/api/users/github/contributions/${username}`} 
          alt={`${username}'s GitHub contributions`}
          className="w-full h-full object-cover md:object-contain"
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-screen overflow-auto">
            <div className="flex justify-end p-2">
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-4">
              <img 
                src={`/api/users/github/contributions/${username}`} 
                alt={`${username}'s GitHub contributions`}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GitHubContributionGraph;