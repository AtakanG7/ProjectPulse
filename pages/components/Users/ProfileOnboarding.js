import React, { useState } from 'react';

export default function ProfileOnboarding({ onComplete, username }) {
  const [step, setStep] = useState('initial');
  const [githubProjects, setGithubProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [error, setError] = useState(null);

  const fetchGithubProjects = async () => {
    setStep('fetching');
    setError(null);
    try {
      const response = await fetch(`/api/users/github/projects/${username}`);
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setGithubProjects(data);
      setStep('selecting');
    } catch (err) {
      console.error('Error fetching GitHub projects:', err);
      setError('Failed to fetch GitHub projects. Please try again.');
      setStep('initial');
    }
  };

  const toggleProjectSelection = (project) => {
    setSelectedProjects(prev => 
      prev.some(p => p.githubId === project.githubId)
        ? prev.filter(p => p.githubId !== project.githubId)
        : [...prev, project]
    );
  };

  const handleComplete = async () => {
    setStep('complete');
    setTimeout(() => {
      onComplete(selectedProjects);
    }, 1000);
  };

  if (step === 'initial') {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-4 text-indigo-600">Welcome to Your Profile!</h2>
        <p className="mb-6 text-gray-600">Let's get started by importing your GitHub projects.</p>
        <button
          onClick={fetchGithubProjects}
          className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center mx-auto"
        >
          <span className="mr-2">📂</span> Fetch GitHub Projects
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    );
  }

  if (step === 'fetching') {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <div className="animate-spin text-5xl mb-4">🔄</div>
        <p className="text-gray-600">Fetching your GitHub projects...</p>
      </div>
    );
  }

  if (step === 'selecting') {
    return (
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-4 text-indigo-600">Select Projects to Import</h2>
        <p className="mb-6 text-gray-600">Choose the projects you want to add to your profile:</p>
        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
          {githubProjects.map(project => (
            <div key={project.githubId} className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                id={`project-${project.githubId}`}
                checked={selectedProjects.some(p => p.githubId === project.githubId)}
                onChange={() => toggleProjectSelection(project)}
                className="mr-3 h-5 w-5 text-indigo-600"
              />
              <label htmlFor={`project-${project.githubId}`} className="flex-grow cursor-pointer">
                <div className="font-semibold">{project.title}</div>
                <div className="text-sm text-gray-500">{project.description}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {project.language && <span className="mr-3">🔤 {project.language}</span>}
                  <span className="mr-3">⭐ {project.stargazersCount}</span>
                  <span>🍴 {project.forksCount}</span>
                </div>
              </label>
            </div>
          ))}
        </div>
        <button
          onClick={handleComplete}
          disabled={selectedProjects.length === 0}
          className={`w-full py-3 rounded-md transition-colors ${
            selectedProjects.length > 0
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Import {selectedProjects.length} Selected Project{selectedProjects.length !== 1 ? 's' : ''}
        </button>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <div className="text-green-500 text-6xl mb-4">✅</div>
        <h2 className="text-3xl font-bold mb-4 text-indigo-600">Projects Imported Successfully!</h2>
        <p className="text-gray-600">Your selected projects have been added to your profile.</p>
      </div>
    );
  }

  return null;
}