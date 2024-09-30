import React from 'react';
import Link from 'next/link';
import { ThumbsUp, ExternalLink, Tag, Calendar } from 'lucide-react';

export default function ProjectsSection({ projects }) {
  if (!projects || projects.length === 0) {
    return <div className="text-center text-gray-500 mt-8">No projects found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div
          key={project._id}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
        >
          {project.imageUrl && (
            <img 
              src={project.imageUrl} 
              alt={project.title} 
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4">
            <Link href={`/projects/${project._id}`}>
              <h3 className="text-xl font-semibold text-indigo-600 hover:text-indigo-800 transition-colors duration-300">
                {project.title}
              </h3>
            </Link>
            <p className="text-gray-600 mt-2 line-clamp-3">{project.description}</p>
            
            <div className="flex flex-wrap gap-2 mt-3">
              {project.tags && project.tags.map((tag, index) => (
                <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  <Tag size={12} className="mr-1" />
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center text-sm text-gray-500 mt-3">
              <Calendar size={14} className="mr-1" />
              <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="flex justify-between items-center mt-4">
              <button className="flex items-center text-blue-500 hover:text-blue-700 transition-colors duration-300">
                <ThumbsUp size={18} className="mr-1" />
                <span>{project.likesCount}</span>
              </button>
              {project.projectUrl && (
                <a 
                  href={project.projectUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-500 hover:text-indigo-700 transition-colors duration-300"
                >
                  <ExternalLink size={18} />
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}