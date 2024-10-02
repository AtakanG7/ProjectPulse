import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { FaGlobe, FaCopy, FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toLower } from 'lodash';

const PersonalizedURLDisplay = () => {
  const router = useRouter();
  const { username } = router.query;
  const personalizedURL = `${toLower(username)}.sprojects.live`;
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`https://${personalizedURL}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const endTour = () => {
    router.push(`/users/${username}`);
  };

  return (
    <div className="flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.4 }}
        className="bg-white rounded-lg shadow-lg p-6 max-w-xl w-full"
      >
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-center mb-4"
        >
          <FaGlobe className="text-2xl text-blue-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-800">Your Showcase URL</h2>
        </motion.div>
        
        <motion.div 
          className="bg-gray-100 rounded-md p-3 mb-4 relative"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <p className="text-lg font-mono text-center text-gray-900 break-all">
            https://<span className="text-blue-600 font-medium">{personalizedURL}</span>
          </p>
          <motion.button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 focus:outline-none"
            onClick={copyToClipboard}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {copied ? <FaCheck className="text-green-500" /> : <FaCopy />}
          </motion.button>
        </motion.div>
        
        <motion.p 
          className="text-center text-gray-600 mb-4 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          Share this URL to showcase your projects in read-only mode.
        </motion.p>

        <motion.div
          className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-md"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <h3 className="font-medium text-blue-800 mb-1">Pro Tip:</h3>
          <p className="text-blue-700 text-sm">
            Add this URL to your resume or portfolio for easy access to your projects.
          </p>
        </motion.div>

        {/* End Tour Button */}
        <motion.button
          className="mt-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          onClick={endTour}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          End Tour
        </motion.button>
      </motion.div>
    </div>
  );
};

export default PersonalizedURLDisplay;
