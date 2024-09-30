import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from '../../components/Main/Header';
import DeleteProjectModal from '../../components/Users/DeleteProjectModal';

const ProjectSettingsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    projectUrl: '',
    imageUrl: '',
  });

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
      setProject(data);
      setFormData({
        title: data.title,
        description: data.description,
        category: data.category || '',
        tags: data.tags ? data.tags.join(', ') : '',
        projectUrl: data.projectUrl || '',
        imageUrl: data.imageUrl || '',
      });
    } catch (err) {
      console.error('Error fetching project:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()),
        }),
      });
  
      if (!res.ok) {
        throw new Error(`Failed to update project: ${res.status} ${res.statusText}`);
      }
  
      router.push(`/projects/${id}`);
    } catch (err) {
      console.error('Error updating project:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteProject = async () => {
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error(`Failed to delete project: ${res.status} ${res.statusText}`);
      }
      router.push('/projects'); // Redirect to projects list after deletion
    } catch (err) {
      console.error('Error deleting project:', err);
      setError(err.message);
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  if (!project) {
    return <div className="flex items-center justify-center h-screen">Project not found</div>;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Link href={`/projects/${id}`} className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6 transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Project
          </Link>

          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Edit Project Settings</h1>
              <form onSubmit={handleSubmit} className="space-y-6">
                {Object.entries(formData).map(([key, value]) => (
                  <div key={key}>
                    <label htmlFor={key} className="block text-sm font-medium text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    {key === 'description' ? (
                      <textarea
                        id={key}
                        name={key}
                        rows="4"
                        value={value}
                        onChange={handleInputChange}
                        required={key === 'title' || key === 'description'}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                      />
                    ) : (
                      <input
                        type={key.includes('Url') ? 'url' : 'text'}
                        id={key}
                        name={key}
                        value={value}
                        onChange={handleInputChange}
                        required={key === 'title' || key === 'description'}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                      />
                    )}
                  </div>
                ))}

                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={handleDeleteClick}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Delete Project
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <DeleteProjectModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onDelete={handleDeleteProject}
        projectName={project?.title || ''}
      />
    </>
  );
};

export default ProjectSettingsPage;