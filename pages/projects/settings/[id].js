import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ArrowLeft, Trash, Save, PencilIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import Header from '../../components/Main/Header';
import DeleteProjectModal from '../../components/Users/DeleteProjectModal';
import ProjectImages from '../../components/Users/Projects/ProjectImages';
import toast, { Toaster } from 'react-hot-toast';

const FullScreenEditor = dynamic(() => import('../../components/Main/FullScreenEditor'), { ssr: false });

const ProjectSettingsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    tags: '',
    projectUrl: '',
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
        category: data.category || '',
        tags: data.tags ? data.tags.join(', ') : '',
        projectUrl: data.projectUrl || '',
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
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          description: project.description,
          tags: formData.tags.split(',').map(tag => tag.trim()),
        }),
      });
  
      if (!res.ok) {
        throw new Error(`Failed to update project: ${res.status} ${res.statusText}`);
      }
  
      toast.success('Project updated successfully');
      router.push(`/projects/${id}`);
    } catch (err) {
      console.error('Error updating project:', err);
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEditorSave = useCallback(async (editorData) => {
    setSaving(true);
    try {
      const updatedProject = { ...project, ...editorData };
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProject),
      });
      if (!res.ok) throw new Error('Failed to update project');
      setProject(updatedProject);
      toast.success('Project description saved successfully');
    } catch (err) {
      toast.error('Failed to save project description');
    } finally {
      setSaving(false);
      setShowEditor(false);
    }
  }, [id, project]);

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
      toast.success('Project deleted successfully');
      router.push('/projects');
    } catch (err) {
      console.error('Error deleting project:', err);
      toast.error(err.message);
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handleProjectUpdate = (updatedProject) => {
    setProject((prevProject) => ({
      ...prevProject,
      images: updatedProject.images,
    }));
  }

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
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Toaster position="top-right" />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Link href={`/projects/${id}`} className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors duration-200 mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Project
          </Link>

          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="p-6">
              <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Edit Project Settings</h1>
              
              {showEditor ? (
                <FullScreenEditor
                  initialData={project}
                  onSave={handleEditorSave}
                  onBack={() => setShowEditor(false)}
                  saving={saving}
                />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <ProjectImages
                      projectId={project._id}
                      images={project.images || []}
                      onUpdate={handleProjectUpdate}
                    />
                  </div>

                  <div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {Object.entries(formData).map(([key, value]) => (
                        <div key={key}>
                          <label htmlFor={key} className="block text-sm font-medium text-gray-700 capitalize mb-1">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                          <input
                            type={key.includes('Url') ? 'url' : 'text'}
                            id={key}
                            name={key}
                            value={value}
                            onChange={handleInputChange}
                            required={key === 'title'}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                          />
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => setShowEditor(true)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                      >
                        <PencilIcon className="mr-2 h-4 w-4 inline-block" />
                        <span className="inline-block text-sm font-medium text-gray-700">Edit Project Description</span>
                      </button>

                      <div className="flex justify-between items-center mt-8">
                        <button
                          type="button"
                          onClick={handleDeleteClick}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete Project
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                        >
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
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
    </div>
  );
};

export default ProjectSettingsPage;