import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import ProfileOnboarding from '../components/Users/ProfileOnboarding';
import UserProfile from '../components/Users/UserProfile';
import Header from '../components/Main/Header';
export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/users/${session.user.username}`);
      if (!response.ok) throw new Error('Failed to fetch user data');
      const userData = await response.json();
      setUser(userData.data);
      setIsOnboardingComplete(!!userData.data.projects?.length);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleOnboardingComplete = async (selectedProjects) => {
    try {
      const response = await fetch(`/api/projects/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projects: selectedProjects }),
      });

      if (!response.ok) throw new Error('Failed to save projects');

      const newProjects = await response.json();
      setProjects((prevProjects) => [...prevProjects, ...newProjects.data]);
      setIsOnboardingComplete(true);
    } catch (error) {
      console.error('Error saving projects:', error);
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please sign in to view your profile.</div>;
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <UserProfile user={user} />
        {!isOnboardingComplete && (
          <ProfileOnboarding onComplete={handleOnboardingComplete} username={user?.username} />
        )}
      </div>
    </>
  );
}
