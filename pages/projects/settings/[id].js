import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Header from '../../components/Main/Header';
import DeleteProjectModal from '../../components/Users/DeleteProjectModal';
import ProjectImages from '../../components/Users/Projects/ProjectImages';
import EditorJSRenderer from '../../components/Main/EditorJSRenderer';
import toast, { Toaster } from 'react-hot-toast';
import { FiAlertTriangle, FiLink, FiTag, FiFolder, FiArrowLeft } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { parse } from 'path';

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
  const [activeTab, setActiveTab] = useState('details');
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    tags: '',
    projectUrl: '',
  });

  useEffect(() => {
    if (id) fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${id}`);
      if (!res.ok) throw new Error(`Failed to fetch project: ${res.status} ${res.statusText}`);
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
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          description: project.description,
          tags: formData.tags.split(',').map(tag => tag.trim()),
        }),
      });
      if (!res.ok) throw new Error(`Failed to update project: ${res.status} ${res.statusText}`);
      toast.success('Project updated successfully');
      router.push(`/projects/${id}`);
    } catch (err) {
      console.error('Error updating project:', err);
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEditorSave = async (editorData) => {
    setSaving(true);
    try {
      const updatedProject = { ...project, description: JSON.stringify(editorData) };
      console.log(updatedProject);
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProject),
      });
      if (!res.ok) throw new Error('Failed to update project');
      setProject(updatedProject);
      toast.success('Project description saved successfully');
    } catch (err) {
      console.error('Error saving project description:', err);
      toast.error('Failed to save project description');
    } finally {
      setSaving(false);
      setShowEditor(false);
    }
  };

  const handleDeleteClick = () => setIsDeleteModalOpen(true);
  const handleCloseDeleteModal = () => setIsDeleteModalOpen(false);

  const handleDeleteProject = async () => {
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Failed to delete project: ${res.status} ${res.statusText}`);
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

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (error) return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-red-50 text-red-700 px-4 py-3 rounded-md" role="alert">
        <strong className="font-medium">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    </div>
  );

  const TabButton = ({ name, label }) => (
    <button
      className={`w-full text-left px-4 py-2 rounded-l-lg font-medium transition-colors duration-200 ${
        activeTab === name 
          ? 'bg-white text-blue-600 shadow-md' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
      onClick={() => setActiveTab(name)}
    >
      {label}
    </button>
  );

  const parseData = (data) => {
    try {
      if (typeof data === 'string') {
        const parsed = JSON.parse(data);
        return parsed.blocks ? parsed : JSON.parse(parsed);
      }
      return data;
    } catch (err) {
      return [];
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Toaster position="top-right" />
      <main className="max-w-7xl mx-auto py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-6 sm:mb-10">{project?.title} Project Settings</h1>
        
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            <nav className="sm:w-1/4 bg-gray-50 p-4 sm:py-6 space-y-2">
              <TabButton name="details" label="Details" />
              <TabButton name="images" label="Images" />
              <TabButton name="description" label="Description" />
              <TabButton name="danger" label="Danger Zone" />
            </nav>

            <div className="flex-1 p-4 sm:p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Project Details</h2>

              {activeTab === 'details' && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {Object.entries(formData).map(([key, value]) => (
                    <div key={key} className="flex items-center">
                      {key === 'projectUrl' && <FiLink className="mr-2 text-gray-400" />}
                      {key === 'category' && <FiFolder className="mr-2 text-gray-400" />}
                      {key === 'tags' && <FiTag className="mr-2 text-gray-400" />}
                      <div className="flex-1">
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  ))}
                  <div>
                    <button
                      type="submit"
                      className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              )}

              {activeTab === 'images' && (
                <ProjectImages
                  projectId={project?._id}
                  images={project?.images || []}
                  onUpdate={handleProjectUpdate}
                />
              )}

              {activeTab === 'description' && (
                <div>
                  {project.description ? (
                    <EditorJSRenderer data={(project?.description)} />
                  ) : (
                    <p>No description available.</p>
                  )}
                  <button
                    onClick={() => setShowEditor(true)}
                    className="mt-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    Edit Description
                  </button>
                </div>
              )}

              {activeTab === 'danger' && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                  <div className="flex items-center mb-4">
                    <FiAlertTriangle className="text-red-400 mr-2" size={24} />
                    <h3 className="text-lg font-medium text-red-800">Danger Zone</h3>
                  </div>
                  <p className="text-red-700 mb-4">Deleting a project is irreversible. Please be certain.</p>
                  <button
                    onClick={handleDeleteClick}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                  >
                    Delete Project
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {showEditor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-white z-50 overflow-auto"
          >
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{project.title}</h2>
                  <p className="text-lg text-gray-600 mt-2">Project Description Editor</p>
                </div>
                <button
                  onClick={() => setShowEditor(false)}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <FiArrowLeft className="mr-2" />
                  Back to Settings
                </button>
              </div>
              <FullScreenEditor
                initialData={parseData(project.description)}
                onSave={handleEditorSave}
                projectId={project?._id}
                saving={saving}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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