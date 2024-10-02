import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import ProfileOnboarding from '../ProfileOnboarding';

const GithubImport = () => {
  const router = useRouter();
  const { username } = router.query;
  const [importStatus, setImportStatus] = useState('idle'); // 'idle', 'importing', 'completed', 'error'

  const handleOnboardingComplete = async (selectedProjects) => {
    setImportStatus('importing');
    try {
      const response = await fetch(`/api/projects/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projects: selectedProjects }),
      });

      if (!response.ok) throw new Error('Failed to save projects');
      
      setImportStatus('completed');
    } catch (error) {
      console.error('Error saving projects:', error);
      setImportStatus('error');
    }
  };

  return (
    <div className="bg-white flex flex-col justify-center items-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <FaGithub className="mr-3" /> Import Your GitHub Projects
        </h1>
        
        <AnimatePresence mode="wait">
          {importStatus === 'importing' && (
            <motion.div
              key="importing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-gray-600 mb-4"
            >
              Importing your projects...
            </motion.div>
          )}
          
          {importStatus === 'completed' && (
            <motion.div
              key="completed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-green-600 mb-4"
            >
              Projects imported successfully! You can continue with the onboarding process.
            </motion.div>
          )}
          
          {importStatus === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-red-600 mb-4"
            >
              An error occurred while importing projects. Please try again.
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4">
          <ProfileOnboarding username={username} onComplete={handleOnboardingComplete} />
        </div>
      </motion.div>
    </div>
  );
};

export default GithubImport;