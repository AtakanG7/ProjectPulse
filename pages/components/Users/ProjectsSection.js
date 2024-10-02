import React from 'react';
import { ThumbsUp, ExternalLink, Tag, GitHub, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const ProjectCard = ({ project }) => (
  <div className="bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
    <div className="flex items-center p-4">
      {project.imageUrl && (
        <div className="flex-shrink-0 w-16 h-16 mr-4">
          <img 
            src={project.imageUrl} 
            alt={project.title} 
            className="w-full h-full object-cover rounded"
          />
        </div>
      )}
      <div className="flex-grow min-w-0">
        <div className="flex justify-between items-center mb-1">
          <Link href={`/projects/${project._id}`}>
            <h3 className="text-lg font-semibold text-gray-800 hover:text-indigo-600 transition-colors duration-300 truncate">
              {project.title}
            </h3>
          </Link>
          <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
            <span className="text-sm text-gray-500 flex items-center">
              <ThumbsUp size={14} className="mr-1" />
              {project.likesCount}
            </span>
            {project.githubUrl && (
              <a 
                href={project.githubUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700"
                aria-label="GitHub Repository"
              >
                <GitHub size={16} />
              </a>
            )}
            {project.projectUrl && (
              <a 
                href={project.projectUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700"
                aria-label="Project Website"
              >
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-2 line-clamp-1">{project.description}</p>
        <div className="flex flex-wrap items-center">
          {project.tags && project.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 mr-2 mb-1">
              {tag}
            </span>
          ))}
          {project.tags && project.tags.length > 3 && (
            <span className="text-xs text-gray-500">+{project.tags.length - 3} more</span>
          )}
        </div>
      </div>
      <Link href={`/projects/${project._id}`} className="flex-shrink-0 ml-4">
        <ArrowRight className="text-gray-400 hover:text-indigo-600 transition-colors duration-300" />
      </Link>
    </div>
  </div>
);

const ProjectsSection = ({ projects }) => {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Projects</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default ProjectsSection;