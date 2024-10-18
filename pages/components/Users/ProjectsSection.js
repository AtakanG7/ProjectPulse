import React from 'react';
import { FaThumbsUp, FaExternalLinkAlt, FaGithub, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Link from 'next/link';

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, [images]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  if (images.length === 0) {
    return (
      <div className="w-full h-64 relative">
        <img
          src="/img/notfound.jpg"
          alt="No image available"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="w-full h-64 relative overflow-hidden">
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Project image ${index + 1}`}
          className={`absolute w-full h-full object-cover transition-opacity duration-500 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute flex justify-between transform -translate-y-1/2 left-2 right-2 top-1/2">
        <button onClick={goToPrevious} className="p-1 bg-white bg-opacity-50">
          <FaChevronLeft className="text-black" size={20} />
        </button>
        <button onClick={goToNext} className="p-1 bg-white bg-opacity-50">
          <FaChevronRight className="text-black" size={20} />
        </button>
      </div>
    </div>
  );
};

const ProjectCard = ({ project, isReadOnly }) => (
  <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/2">
        <ImageCarousel images={project.images || []} />
      </div>
      <div className="flex-grow min-w-0 p-4 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-medium text-gray-900 truncate">
              {project.title}
            </h3>
            <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
              <span className="text-sm text-gray-600 flex items-center">
                <FaThumbsUp size={14} className="mr-1" />
                {project.likesCount}
              </span>
              {project.githubUrl && (
                <a 
                  href={project.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600"
                  aria-label="GitHub Repository"
                >
                  <FaGithub size={16} />
                </a>
              )}
              {project.projectUrl && (
                <a 
                  href={project.projectUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600"
                  aria-label="Project Website"
                >
                  <FaExternalLinkAlt size={16} />
                </a>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center mb-4">
            {project.tags && project.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="inline-flex items-center px-2 py-1 rounded-sm text-xs font-normal bg-gray-100 text-gray-800 mr-2 mb-1">
                {tag}
              </span>
            ))}
            {project.tags && project.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{project.tags.length - 3} more</span>
            )}
          </div>
        </div>
        <Link href={isReadOnly ? `/${project.title}` : `/projects/${project._id}`} className="inline-block">
          <button className="w-full bg-white text-black border border-black py-2 px-4 rounded-sm text-sm font-normal transition-colors duration-200">
            {isReadOnly ? "View project details" : "Read about the project"}
          </button>
        </Link>
      </div>
    </div>
  </div>
);

const ProjectsSection = ({ projects, isReadOnly }) => {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} isReadOnly={isReadOnly} />
        ))}
      </div>
    </div>
  );
};

export default ProjectsSection;