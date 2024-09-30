import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Header from '../components/Main/Header';

export default function UserSettingsPage() {
  const { data: session, status } = useSession();
  const [userSettings, setUserSettings] = useState({
    name: '',
    email: '',
    username: '',
    profilePicture: '',
    bio: '',
    location: '',
    website: '',
    githubLink: '',
    linkedinUrl: '',
    officialWebsiteUrl: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      try {
        setUserSettings({
          name: session.user.name || '',
          email: session.user.email || '',
          username: session.user.username || '',
          profilePicture: session.user.image || '',
          bio: session.user.bio || '',
          location: session.user.location || '',
          website: session.user.website || '',
          githubLink: session.user.githubLink || '',
          linkedinUrl: session.user.linkedinUrl || '',
          officialWebsiteUrl: session.user.officialWebsiteUrl || '',
        });
        setIsLoading(false);
      } catch (err) {
        console.error('Error setting user settings:', err);
        setError('Failed to load user settings.');
      }
    } else if (status === 'unauthenticated') {
      setError('You need to be authenticated to view this page.');
      setIsLoading(false);
    }
  }, [status, session]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (!session?.user?.id) {
        throw new Error('User ID not found');
      }
  
      const response = await fetch(`/api/users?id=${session.user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userSettings),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update user settings');
      }
  
      const data = await response.json();
      setIsLoading(false);
    } catch (err) {
      console.error('Error updating user settings:', err);
      setError(err.message || 'Failed to update settings. Please try again.');
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (error) return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    </div>
  );

  const renderForm = (fields) => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {fields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
          <input
            type="text"
            name={field.name}
            id={field.name}
            value={userSettings[field.name]}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
      ))}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {isLoading ? 'Saving...' : 'Save Settings'}
      </button>
    </form>
  );

  const profileFields = [
    { name: 'name', label: 'Name' },
    { name: 'email', label: 'Email' },
    { name: 'username', label: 'Username' },
    { name: 'profilePicture', label: 'Profile Picture URL' },
    { name: 'bio', label: 'Bio' },
    { name: 'location', label: 'Location' },
  ];

  const webFields = [
    { name: 'website', label: 'Website' },
    { name: 'githubLink', label: 'GitHub Link' },
    { name: 'linkedinUrl', label: 'LinkedIn URL' },
    { name: 'officialWebsiteUrl', label: 'Official Website URL' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-col md:flex-row justify-center mt-5">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg overflow-hidden">
            <aside className="md:w-64 bg-gray-50 p-4">
              <nav>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left py-2 px-4 rounded-md mb-2 ${
                    activeTab === 'profile'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Profile Settings
                </button>
                <button
                  onClick={() => setActiveTab('web')}
                  className={`w-full text-left py-2 px-4 rounded-md ${
                    activeTab === 'web'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Web Page Settings
                </button>
              </nav>
            </aside>
            <main className="flex-1 p-6">
              <h2 className="text-2xl font-semibold mb-6">
                {activeTab === 'profile' ? 'Profile Settings' : 'Web Page Settings'}
              </h2>
              {activeTab === 'profile' && renderForm(profileFields)}
              {activeTab === 'web' && renderForm(webFields)}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}