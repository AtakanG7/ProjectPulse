import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import UserHeader from '../components/Users/UserHeader';
import ProjectsSection from '../components/Users/ProjectsSection';

  /**
   * Page component for a subdomain profile page.
   * It fetches the user data from the API and renders a user header and projects section.
   * If the user data is not found, it renders a "User not found" message.
   * If there is an error fetching the user data, it renders an error message.
   * @returns {JSX.Element} The rendered page component.
   */
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

  /**
   * Fetches the user data from the backend API by making a GET request to /api/subdomains/users/:username.
   * If the response is not OK, it throws an error.
   * If the response is OK, it sets the user data state to the user data returned from the API.
   * If there is an error, it logs the error and sets the error state to the error message.
   * Finally, it sets the loading state to false.
   */
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