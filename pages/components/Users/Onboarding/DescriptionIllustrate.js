import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

const DescriptionIllustrate = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { title: "Overview", content: "EcoTrack: AI-powered app for sustainable living. Monitor carbon footprint, get eco-tips, join challenges." },
    { title: "Features", content: ["Carbon tracking", "Personalized tips", "Community challenges", "Smart home integration"] },
    { title: "Tech Stack", content: "React Native, Node.js, MongoDB, TensorFlow" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % tabs.length);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Project Description Guide</h2>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="w-full md:w-1/2 relative">
          <div className="w-full h-64 bg-gray-200 rounded-lg shadow-md overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-300">
            <img 
              src="/img/onboarding.jpeg" 
              alt="Project Screenshot" 
              className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
            />
          </div>
          <div className="absolute -bottom-3 -right-3 bg-white p-2 rounded-full shadow-lg">
            <FaStar className="text-yellow-500 text-xl" />
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-50 rounded-lg p-4"
            >
              <h3 className="text-lg font-semibold mb-2 text-gray-800">{tabs[activeTab].title}</h3>
              {Array.isArray(tabs[activeTab].content) ? (
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {tabs[activeTab].content.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600">{tabs[activeTab].content}</p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DescriptionIllustrate;