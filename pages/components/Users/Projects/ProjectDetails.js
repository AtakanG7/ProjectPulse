import React, { useState } from 'react';
import { FaThumbsUp, FaTag, FaLink, FaCalendar, FaUser, FaClock, FaFolderOpen, FaEdit, FaImage, FaInfoCircle } from 'react-icons/fa';
import Link from 'next/link';
import ProjectImages from './ProjectImages';
import EditorJSRenderer from '../../Main/EditorJSRenderer';

export default function ProjectDetails({ project, handleProjectUpdate }) {
  const [activeTab, setActiveTab] = useState('description');

  const TabButton = ({ name, icon: Icon, label }) => (
    <button
      className={`flex items-center px-4 py-2 ${activeTab === name ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'} rounded-t-lg transition-colors duration-200`}
      onClick={() => setActiveTab(name)}
    >
      <Icon className="mr-2" />
      {label}
    </button>
  );

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-8">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold text-gray-900">{project?.title}</h1>
            <Link href={`/projects/settings/${project?._id}`} className="text-indigo-600 hover:text-indigo-800">
              <FaEdit size={24} />
            </Link>
          </div>
          {project?.projectUrl && (
            <a
              href={project?.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-dark-600 bg-white hover:bg-dark-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <FaLink className="mr-2" />
              See project
            </a>
          )}
        </div>

        {/* Meta Information */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center text-sm text-gray-600">
            <FaCalendar className="mr-2" />
            <span>Created: {new Date(project?.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FaClock className="mr-2" />
            <span>Updated: {new Date(project?.updatedAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FaUser className="mr-2" />
            <span>By: {project?.createdBy?.username}</span>
            {project?.createdBy?.profilePicture && (
              <img
                src={project?.createdBy?.profilePicture}
                alt={project?.createdBy?.username}
                width={24}
                height={24}
                className="ml-2 rounded-full"
              />
            )}
          </div>
          {project?.category && (
            <div className="flex items-center text-sm text-gray-600">
              <FaFolderOpen className="mr-2" />
              <span>Category: {project?.category}</span>
            </div>
          )}
        </div>

        {/* Likes */}
        <div className="flex items-center mb-8">
          <FaThumbsUp className="text-indigo-600 mr-2" />
          <span className="text-lg font-semibold text-gray-700">{project?.likesCount} likes</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {project?.tags && project?.tags.map((tag, index) => (
            <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
              <FaTag className="mr-1" />
              {tag}
            </span>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-4 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <TabButton name="description" icon={FaEdit} label="Description" />
            <TabButton name="images" icon={FaImage} label="Images" />
            <TabButton name="details" icon={FaInfoCircle} label="Details" />
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'description' && (
            <div className="text-gray-700 leading-relaxed">
              <EditorJSRenderer data={project?.description} />
            </div>
          )}

          {activeTab === 'images' && (
            <ProjectImages
              projectId={project?._id}
              images={project?.images || []}
              onUpdate={handleProjectUpdate}
            />
          )}

          {activeTab === 'details' && (
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Project ID</dt>
                <dd className="mt-1 text-sm text-gray-900">{project?._id}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Created By</dt>
                <dd className="mt-1 text-sm text-gray-900 flex items-center">
                  {project?.createdBy?.username}
                  {project?.createdBy?.profilePicture && (
                    <img
                      src={project?.createdBy?.profilePicture}
                      alt={project?.createdBy?.username}
                      width={20}
                      height={20}
                      className="ml-2 rounded-full"
                    />
                  )}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Category</dt>
                <dd className="mt-1 text-sm text-gray-900">{project?.category || 'N/A'}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Total Likes</dt>
                <dd className="mt-1 text-sm text-gray-900">{project?.likesCount}</dd>
              </div>
            </dl>
          )}
        </div>
      </div>
    </div>
  );
}