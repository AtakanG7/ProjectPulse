import React from 'react';
import { FaGithub, FaGlobe, FaLink, FaCog } from "react-icons/fa";
import Image from 'next/image';
import GithubContributionGraph from "./GitHubContributionGraph";

const UserHeader = ({ user, isReadOnly }) => {
  if (!user) return null;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg">
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
          <div className="relative mx-auto md:mx-0 mb-4 md:mb-0">
            <img
              src={user.profilePicture || '/img/default-profile.jpg'}
              alt={user.username || 'User'}
              className="w-32 h-32 rounded-full border-4 border-gray-200 shadow-lg"
            />
            
          </div>
          <div className="flex-grow relative">
            <h1 className="text-3xl font-bold text-gray-800 text-center md:text-left mb-2">
            {user.name || user.username || 'No Username'} {user?.creator && <span className="text-sm text-gray-600">(Creator)</span>}
            </h1>
            <p className="text-gray-600 mb-4 text-center md:text-left">
              {user.bio || 'No Bio'}
            </p>
            <div className="flex justify-center md:justify-start space-x-4 mb-4">
              <FaGithub className="text-2xl text-gray-600 hover:text-gray-800 transition-colors" />
              <FaGlobe className="text-2xl text-gray-600 hover:text-gray-800 transition-colors" />
              <FaLink className="text-2xl text-gray-600 hover:text-gray-800 transition-colors" />
              {!isReadOnly && (
                <FaCog className="text-2xl text-blue-600 hover:text-blue-800 transition-colors cursor-pointer" />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 md:p-8">
        <h2 className="text-xl font-semibold text-black mb-4">GitHub Contributions</h2>
        <div className="overflow-x-auto">
          <GithubContributionGraph username={user?.username} />
        </div>
      </div>
    </div>
  );
};

export default UserHeader;