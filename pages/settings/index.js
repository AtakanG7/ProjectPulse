import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import countryList from 'country-list';
import Header from '../components/Main/Header';
import UserHeader from '../components/Users/UserHeader';

export default function UserSettingsPage() {
  const { data: session, status } = useSession();
  const [userSettings, setUserSettings] = useState({
    name: '',
    email: '',
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

  const countries = countryList.getData().map(country => ({
    value: country.code,
    label: country.name
  }));

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      try {
        async function fetchData() {
          const response = await fetch(`/api/users/${session.user.username}`);
          const data = await response.json();
          setUserSettings(data.data);
          setIsLoading(false);
        }
        fetchData();
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

  const handleCountryChange = (selectedOption) => {
    setUserSettings((prev) => ({ ...prev, location: selectedOption.label }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (!session?.user?.id) {
        throw new Error('User ID not found');
      }
  
      const response = await fetch(`/api/users/${session.user?.username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...userSettings, username: session.user.username }),
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
          {field.name === 'location' ? (
            <Select
              options={countries}
              value={countries.find(country => country.label === userSettings.location)}
              onChange={handleCountryChange}
              className="mt-1 block w-full"
              classNamePrefix="select"
              style={{ zIndex: '1000 !important'  }}
            />
          ) : (
            <input
              type="text"
              name={field?.name}
              id={field?.name}
              value={userSettings[field?.name]}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              disabled={field?.name === 'username'}
            />
          )}
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
    { name: 'location', label: 'Country' },
  ];

  const webFields = [
    { name: 'website', label: 'Website' },
    { name: 'githubLink', label: 'GitHub Link' },
    { name: 'linkedinUrl', label: 'LinkedIn URL' },
    { name: 'officialWebsiteUrl', label: 'Official Website URL' },
  ];

  if (status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> You need to be authenticated to view this page.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/2">
            <UserHeader user={userSettings} />
          </div>
          <div className="w-full lg:w-1/2">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex-1 py-4 px-6 text-center font-medium ${
                    activeTab === 'profile'
                      ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Profile Settings
                </button>
                <button
                  onClick={() => setActiveTab('web')}
                  className={`flex-1 py-4 px-6 text-center font-medium ${
                    activeTab === 'web'
                      ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Web Page Settings
                </button>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-6">
                  {activeTab === 'profile' ? 'Profile Settings' : 'Web Page Settings'}
                </h2>
                {activeTab === 'profile' && renderForm(profileFields)}
                {activeTab === 'web' && renderForm(webFields)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}