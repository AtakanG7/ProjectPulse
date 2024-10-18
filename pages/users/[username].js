import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import ProfileOnboarding from '../components/Users/ProfileOnboarding';
import UserProfile from '../components/Users/UserProfile';
import Header from '../components/Main/Header';
import OnboardingOffer from '../components/Users/Onboarding/OnboardingOffer';

  /**
   * This component renders the profile page for the currently signed in user.
   * It will display an onboarding sequence if the user has not completed the
   * onboarding process yet.
   * @returns {JSX.Element}
   */
export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetchUserData();
    }
  }, [session]);



  /**
   * Fetches the user data from the backend API.
   * @returns {Promise<void>}
   */
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

/**
 * Handles the completion of onboarding process by saving selected projects.
 * If saving projects is successful, updates the user's project list and completes onboarding.
 * If an error occurs while saving projects, logs the error.
 */
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
      setUser(prevUser => ({
        ...prevUser,
        projects: [...(prevUser.projects || []), ...newProjects.data]
      }));
      setIsOnboardingComplete(true);
      setShowOnboarding(false);
    } catch (error) {
      console.error('Error saving projects:', error);
    }
  };

  /**
   * Handles the start of the onboarding process by setting showOnboarding to true.
   * The onboarding component will be visible when showOnboarding is true.
   */
  const handleStartTour = () => {
    setShowOnboarding(true);
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please sign in to view your profile.</div>;
  }

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        {!isOnboardingComplete && !showOnboarding && (
          <OnboardingOffer username={user?.username} />
        )}
        {showOnboarding ? (
          <ProfileOnboarding onComplete={handleOnboardingComplete} username={user?.username} />
        ) : (
          <UserProfile user={user} />
        )}
      </div>
    </>
  );
}
