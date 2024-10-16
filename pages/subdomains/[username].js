import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import UserHeader from '../components/Users/UserHeader';
import ProjectsSection from '../components/Users/ProjectsSection';

export default function SubdomainProfile() {
  const router = useRouter();
  const { username } = router.query;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (username) {
      fetchUserData();
    }
  }, [username]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/subdomains/users/${username}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      setUserData(data.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-600">Error: {error}</div>;
  }

  if (!userData) {
    return <div className="text-center mt-8">User not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <UserHeader user={userData} isReadOnly={true} />
      <ProjectsSection projects={userData.projects} isReadOnly={true} />
    </div>
  );
}