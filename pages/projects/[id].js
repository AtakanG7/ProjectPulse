import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaArrowLeft, FaThumbsUp, FaTag, FaLink, FaCalendar, FaUser, FaClock, FaFolderOpen, FaEdit } from 'react-icons/fa';
import Link from 'next/link';
import UserHeader from '../components/Users/UserHeader';

export default function ProjectDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${id}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch project: ${res.status} ${res.statusText}`);
      }
      const { data } = await res.json();
      console.log(data)
      setProject(data);
    } catch (err) {
      console.error('Error fetching project:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-600">Error: {error}</h1>
      </div>
    );
  }

  if (!project) {
    return <div className="container mx-auto px-4 py-8">Project not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 container mx-auto px-4 py-8">
      <UserHeader
        user={project.createdBy}
        isEditing={false}
        editBio=""
        setEditBio={() => {}}
        handleUpdateBio={() => {}}
        setIsEditing={() => {}}
      />

      <Link href={`/users/${project.createdBy?.username}`} className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6">
        <FaArrowLeft className="mr-2" />
        Back to {project.createdBy?.username}'s Profile
      </Link>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden mt-8">
        {project.imageUrl && (
          <div className="h-64 overflow-hidden">
            <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="p-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold text-gray-900">{project.title}</h1>
            <Link href={`/projects/settings/${project._id}`} className="text-indigo-600 hover:text-indigo-800">
              <FaEdit size={24} />
            </Link>
          </div>

          <div className="flex flex-wrap items-center text-sm text-gray-600 mb-6">
            <div className="flex items-center mr-6 mb-2">
              <FaCalendar className="mr-2" />
              <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center mr-6 mb-2">
              <FaClock className="mr-2" />
              <span>Updated: {new Date(project.updatedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center mr-6 mb-2">
              <FaUser className="mr-2" />
              <span>By: {project.createdBy?.username}</span>
              {project.createdBy?.profilePicture && (
                <img
                  src={project.createdBy?.profilePicture}
                  alt={project.createdBy?.username}
                  width={24}
                  height={24}
                  className="ml-2 rounded-full"
                />
              )}
            </div>
            {project.category && (
              <div className="flex items-center mb-2">
                <FaFolderOpen className="mr-2" />
                <span>Category: {project.category}</span>
              </div>
            )}
          </div>

          <p className="text-gray-700 mb-8 leading-relaxed">{project.description}</p>

          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags && project.tags.map((tag, index) => (
              <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                <FaTag className="mr-1" />
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <FaThumbsUp className="text-indigo-600 mr-2" />
              <span className="text-lg font-semibold text-gray-700">{project.likesCount} likes</span>
            </div>
            {project.projectUrl && (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FaLink className="mr-2" />
                View Project
              </a>
            )}
          </div>

          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Project Details</h2>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Project ID</dt>
                <dd className="mt-1 text-sm text-gray-900">{project._id}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Created By</dt>
                <dd className="mt-1 text-sm text-gray-900 flex items-center">
                  {project.createdBy?.username}
                  {project.createdBy?.profilePicture && (
                    <img
                      src={project.createdBy?.profilePicture}
                      alt={project.createdBy?.username}
                      width={20}
                      height={20}
                      className="ml-2 rounded-full"
                    />
                  )}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Category</dt>
                <dd className="mt-1 text-sm text-gray-900">{project.category || 'N/A'}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Total Likes</dt>
                <dd className="mt-1 text-sm text-gray-900">{project.likesCount}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}