import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import UserHeader from '../components/Users/UserHeader';
import ProjectDetails from '../components/Users/Projects/ProjectDetails';
import EditorJSRenderer from '../components/Main/EditorJSRenderer';

export default function ProjectDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');

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
    } catch (err) {
      console.error('Error fetching project:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
    </div>;
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

  const handleProjectUpdate = (updatedProject) => {
    setProject((prevProject) => ({
      ...prevProject,
      images: updatedProject.images,
    }));
  }

  const TabButton = ({ name, icon: Icon, label }) => (
    <button
      className={`flex items-center px-4 py-2 ${activeTab === name ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'} rounded-lg shadow-md transition-colors duration-200`}
      onClick={() => setActiveTab(name)}
    >
      <Icon className="mr-2" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <Link href={`/users/${project.createdBy?.username}`} className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6">
          <FaArrowLeft className="mr-2" />
          Back to {project.createdBy?.username}'s Profile
        </Link>

        <ProjectDetails project={project} handleProjectUpdate={handleProjectUpdate} />
      </div>
    </div>
  );
}