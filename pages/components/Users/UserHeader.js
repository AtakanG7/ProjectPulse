import React from 'react';
import { FaGithub, FaGlobe } from "react-icons/fa";
import { Settings } from "lucide-react";
import Link from 'next/link';
import GithubContributionGraph from "./GitHubContributionGraph";

const UserHeader = ({ user, isReadOnly }) => {
  if (!user) return null;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg mb-5">
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start md:space-x-8">
          <div className="relative mx-auto md:mx-0 mb-4 md:mb-0 flex-shrink-0">
            <div className="w-32 h-32 relative">
              <div className="absolute inset-0">
                <div className="w-full h-full rounded-full border-4 border-gray-200 shadow-lg overflow-hidden">
                  <img
                    src={user.profilePicture || '/img/default-profile.jpg'}
                    alt={user.username || 'User'}
                    className="w-full h-full object-cover"
                    style={{
                      aspectRatio: '1/1',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex-grow relative">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 text-center md:text-left mb-2">
                {user.name || user.username || 'No Username'} {user?.creator && <span className="text-sm text-gray-600">(Creator)</span>}
              </h1>
              <p className="text-gray-600 mb-4 text-center md:text-left">
                {user.bio || 'No Bio'}
              </p>
              <div className="flex justify-center md:justify-start space-x-4">
                {user.githubLink && (
                  <a href={user.githubLink} target="_blank" rel="noopener noreferrer">
                    <FaGithub className="text-2xl text-gray-600" />
                  </a>
                )}
                {user.website && (
                  <a href={user.website} target="_blank" rel="noopener noreferrer">
                    <FaGlobe className="text-2xl text-gray-600" />
                  </a>
                )}
                {!isReadOnly && (
                  <Link href="/settings">
                    <Settings className="w-6 h-6 text-gray-600" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4 space-x-8">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800">{user.projects?.length || 0}</h3>
            <p className="text-sm text-gray-600">Projects</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800">{user.likes || 0}</h3>
            <p className="text-sm text-gray-600">Likes</p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800">{user.followers?.length || 0}</h3>
            <p className="text-sm text-gray-600">Followers</p>
          </div>
        </div>
      </div>
      <div className="bg-white px-2 sm:px-4 md:px-8 pb-6">
        <h2 className="text-xl font-semibold text-black mb-4">GitHub Contributions</h2>
        <div className="overflow-x-auto">
          <GithubContributionGraph username={user?.username} />
        </div>
      </div>
    </div>
  );
};

export default UserHeader;