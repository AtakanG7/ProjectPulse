// File: pages/subdomains/[username]/projects/[title].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProjectDetails from '../../../components/Users/Projects/ProjectDetails';

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
      <ProjectDetails project={project} isReadOnly={true} />
    </div>
  );
}