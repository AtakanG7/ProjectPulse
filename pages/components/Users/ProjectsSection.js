export default function ProjectsSection({ projects }) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project._id}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <h3 className="text-xl font-semibold">{project.title}</h3>
            <p className="text-gray-700 mt-2">{project.description}</p>
            <div className="flex justify-between items-center mt-4">
              <button className="flex items-center text-blue-500 hover:text-blue-700">
                👍 <span className="ml-1">Like</span>
              </button>
              <button className="text-red-500 hover:text-red-700">
                Report Issue
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }
  