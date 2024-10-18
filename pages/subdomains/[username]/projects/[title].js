// File: pages/subdomains/[username]/projects/[title].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProjectDetails from '../../../components/Users/Projects/ProjectDetails';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
/**
 * A page that displays a project from a subdomain.
 *
 * This page fetches the project data from the API and renders the project
 * details using the `ProjectDetails` component. If the project is not found,
 * it displays a "Not found" message. If the project is loading, it displays a
 * "Loading..." message.
 *
 * @param {string} username The username of the project owner
 * @param {string} title The title of the project
 */
export default function SubdomainProjectShowcase() {
  const router = useRouter();
  const { username, title } = router.query;
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (username && title) {
      fetchProjectData();
    }
  }, [username, title]);

  const fetchProjectData = async () => {
    try {
      const response = await fetch(`/api/subdomains/projects/${username}/${encodeURIComponent(title)}`);
      if (!response.ok) throw new Error('Failed to fetch project data');
      const data = await response.json();
      setProject(data?.project);
    } catch (error) {
      console.error('Error fetching project data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href={`/`} className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6">
        <FaArrowLeft className="mr-2" />
        Back to {project.createdBy?.username}'s Profile
      </Link>

      <ProjectDetails project={project} isReadOnly={true} />
    </div>
  );
}