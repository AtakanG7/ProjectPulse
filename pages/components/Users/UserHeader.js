import React from 'react';
import { FaGithub, FaLinkedin, FaGlobe, FaLink, FaCog } from "react-icons/fa";
import Link from 'next/link';
import GithubContributionGraph from "./GitHubContributionGraph";

const UserHeader = ({ user, isReadOnly }) => {
  if (!user) return null;

  const stats = [
    { label: 'Projects', value: user.projects?.length || 0 },
    { label: 'Likes', value: user.likes || 0 },
    { label: 'Followers', value: user.followers?.length || 0 }
  ];

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg">
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
          <img
            src={user.profilePicture || '/img/default-profile.jpg'}
            alt={user.username || 'User'}
            className="w-32 h-32 rounded-full border-4 border-gray-200 shadow-lg mx-auto md:mx-0 mb-4 md:mb-0"
          />
          <div className="flex-grow">
            <h1 className="text-3xl font-bold text-gray-800 text-center md:text-left mb-2">
              {user.name || user.username || 'No Username'}
            </h1>
            <p className="text-gray-600 mb-4 text-center md:text-left">
              {user.bio || 'No Bio'}
            </p>
            <div className="flex justify-center md:justify-start space-x-4 mb-4">
              {user.githubLink && (
                <a href={user.githubLink} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800 transition-colors">
                  <FaGithub className="text-2xl" />
                </a>
              )}
              {user.linkedinUrl && (
                <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800 transition-colors">
                  <FaLinkedin className="text-2xl" />
                </a>
              )}
              {user.website && (
                <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800 transition-colors">
                  <FaGlobe className="text-2xl" />
                </a>
              )}
              {user.officialWebsiteUrl && (
                <a href={user.officialWebsiteUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800 transition-colors">
                  <FaLink className="text-2xl" />
                </a>
              )}
              {!isReadOnly && (
                <Link href="/settings">
                  <span className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer">
                    <FaCog className="text-2xl" />
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-center md:justify-end space-x-8 mt-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <h3 className="text-xl font-bold text-gray-800">{stat.value}</h3>
              <p className="text-gray-600">{stat.label}</p>
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