import React from 'react';
import { FaGithub, FaLinkedin, FaSlidersH, FaGlobe, FaLink } from "react-icons/fa";
import GithubContributionGraph from "./GitHubContributionGraph";
import Link from 'next/link';

const UserHeader = ({ user }) => {
  if (!user) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const stats = [
    { label: 'Projects', value: user?.projects?.length || 0 },
    { label: 'Likes', value: user?.likes || 0 },
    { label: 'Followers', value: user?.followers?.length || 0 }
  ];

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
          <img
            src={user?.profilePicture || 'https://via.placeholder.com/150'}
            alt={user?.username || 'User'}
            className="w-32 h-32 rounded-full border-4 border-black shadow-lg mx-auto md:mx-0 mb-4 md:mb-0"
          />
          <div className="flex-grow">
            <h1 className="text-3xl font-bold text-black text-center md:text-left mb-2">
              {user?.username || 'No Username'}
            </h1>
            <p className="text-gray-800 mb-4 text-center md:text-left">
              {user?.bio || 'No Bio'}
            </p>
            <div className="flex justify-center md:justify-start space-x-4 mb-4">
              {user?.githubLink && (
                <a href={user.githubLink} target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-600 transition-colors" aria-label="GitHub Profile">
                  <FaGithub className="text-2xl" />
                </a>
              )}
              {user?.linkedinUrl && (
                <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-600 transition-colors" aria-label="LinkedIn Profile">
                  <FaLinkedin className="text-2xl" />
                </a>
              )}
              {user?.website && (
                <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-600 transition-colors" aria-label="Personal Website">
                  <FaGlobe className="text-2xl" />
                </a>
              )}
              {user?.officialWebsiteUrl && (
                <a href={user.officialWebsiteUrl} target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-600 transition-colors" aria-label="Official Website">
                  <FaLink className="text-2xl" />
                </a>
              )}
              <Link href="/settings">
                <div className="group relative">
                  <div className="rounded-full">
                    <FaSlidersH 
                      className="text-xl" 
                      aria-label="Settings"
                    />
                  </div>
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-2">
                    Settings
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex justify-center md:justify-end space-x-8 mt-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <h3 className="text-xl font-bold text-black">{stat.value}</h3>
              <p className="text-gray-800">{stat.label}</p>
            </div>
          ))}
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