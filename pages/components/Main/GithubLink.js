import React, { useState, useRef } from 'react';
import { Github, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import { div } from 'framer-motion/client';

const URLPreviewBox = ({ username, onSignIn }) => {
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);

  const isRegistered = !!username;
  const placeholderUsername = "your_github_username";
  const displayUsername = username || placeholderUsername;
  const fullUrl = `${displayUsername}.sprojects.live`;

  const handleCopy = () => {
    if (inputRef.current) {
      inputRef.current.select();
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div> 
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="backdrop-filter backdrop-blur-lg rounded-lg p-4 sm:p-6 mb-8 w-full max-w-md mx-auto"
      >
        <div className="flex items-center mb-4 relative">
          <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            ref={inputRef}
            type="text"
            readOnly
            value={fullUrl}
            className={`flex-grow ${isRegistered ? 'bg-white' : 'bg-gray-100'} text-gray-700 rounded-l-md py-2 pl-10 pr-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {isRegistered && (
            <button
              onClick={handleCopy}
              className="bg-gray-200 text-gray-700 py-2 px-4 rounded-r-md border border-l-0 border-gray-300 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
          )}
        </div>
        {isRegistered ? (
          <p className="text-sm text-gray-600 text-center">
            Your projects page is live! Click the button to copy the URL.
          </p>
        ) : (
          <p className="text-sm text-gray-600 text-center">
            <a 
              onClick={onSignIn} 
              className="text-blue-500 hover:text-blue-700 cursor-pointer font-medium transition-colors duration-300"
            >
              Sign in
            </a> 
            {" "}
            with GitHub to claim your unique project showcase URL!
          </p>
        )}
      </motion.div>
    </div> 
  );
};

export default URLPreviewBox;