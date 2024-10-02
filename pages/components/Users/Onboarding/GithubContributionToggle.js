import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import GitHubContributionGraph from '../GitHubContributionGraph';

const GithubContributionToggle = () => {
  const [isOn, setIsOn] = useState(true);
  const router = useRouter();
  const { username } = router.query;

  const toggleSwitch = () => setIsOn(!isOn);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-4xl mx-auto my-8"
    >
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        GitHub Contribution Graph
      </h2>
      <div className="flex flex-col items-center space-y-8">
        <motion.div
          animate={{
            opacity: isOn ? 1 : 0.3,
            filter: isOn ? 'blur(0px)' : 'blur(3px)',
          }}
          transition={{ duration: 0.3 }}
          className="w-full bg-gray-50 p-4 rounded-lg shadow-inner"
        >
          {username && <GitHubContributionGraph username={username} />}
        </motion.div>
        <div className="flex items-center space-x-4">
          <motion.button
            className={`w-16 h-8 flex items-center ${
              isOn ? 'justify-end bg-green-500' : 'justify-start bg-gray-300'
            } rounded-full p-1 cursor-pointer`}
            onClick={toggleSwitch}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              className="w-6 h-6 bg-white rounded-full shadow-md"
              layout
              transition={spring}
            />
          </motion.button>
          <AnimatePresence mode="wait">
            <motion.p
              key={isOn ? 'on' : 'off'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="text-lg font-semibold"
            >
              {isOn ? 'Contributions Visible' : 'Contributions Hidden'}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

const spring = {
  type: "spring",
  stiffness: 700,
  damping: 30
};

export default GithubContributionToggle;