import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GitHubContributionGraph = ({ username }) => {
  const [svgContent, setSvgContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const response = await axios.get(`/api/users/github/contributions/${username}`);
        setSvgContent(response.data);
      } catch (err) {
        setError('Failed to fetch GitHub contributions');
        console.error('Error fetching GitHub contributions:', err);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchContributions();
    }
  }, [username]);

  if (loading) return <div>Loading contribution graph...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!svgContent) return null;

  return (
    <div className="mt-4">
      <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
        <div dangerouslySetInnerHTML={{ __html: svgContent }} />
      </div>
    </div>
  );
};

export default GitHubContributionGraph;