import React, { useState } from 'react';
import { FaGlobe, FaGithub, FaImage, FaPen, FaTrophy, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import GithubContributionToggle from '../../components/Users/Onboarding/GithubContributionToggle';
import GithubImport from '../../components/Users/Onboarding/GithubImport';
import DescriptionIllustrate from '../../components/Users/Onboarding/DescriptionIllustrate.js';
import LeaderBoard from '../../components/Users/Onboarding/LeaderBoard.js';
import PersonalizedURLInfo from '../../components/Users/Onboarding/PersonalizedURLInfo.js';

const OnboardingPage = () => {
  const [activeSection, setActiveSection] = useState(0);

  const sections = [
    {
      title: "GitHub Integration",
      icon: <FaGithub />,
      component: <GithubContributionToggle />
    },
    {
      title: "Import Projects",
      icon: <FaGithub />,
      component: <GithubImport />
    },
    {
      title: "Project Visuals",
      icon: <FaImage />,
      component: <ProjectImageUpload />
    },
    {
      title: "Project Description",
      icon: <FaPen />,
      component: <DescriptionIllustrate />
    },
    {
      title: "Leaderboard",
      icon: <FaTrophy />,
      component: <LeaderBoard />
    },
    {
      title: "Your Showcase URL",
      icon: <FaGlobe />,
      component: <PersonalizedURLInfo/>
    }
  ];

  const nextSection = () => {
    setActiveSection((prev) => (prev + 1) % sections.length);
  };

  const prevSection = () => {
    setActiveSection((prev) => (prev - 1 + sections.length) % sections.length);
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-8">
        Customize Your Project Showcase
      </h1>

      <nav className="flex justify-center mb-8 overflow-x-auto pb-2">
        {sections.map((section, index) => (
          <button
            key={index}
            className={`flex flex-col items-center p-2 mx-2 rounded-lg ${
              activeSection === index ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}
            onClick={() => setActiveSection(index)}
          >
            <div className={`text-xl mb-1 ${activeSection === index ? 'text-blue-600' : 'text-gray-600'}`}>
              {section.icon}
            </div>
            <span className={`text-xs ${activeSection === index ? 'font-semibold' : 'font-medium'}`}>
              {section.title}
            </span>
          </button>
        ))}
      </nav>

      <div className="relative flex items-center justify-center mb-8">
        <button 
          onClick={prevSection}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none"
          aria-label="Previous section"
        >
          <FaChevronLeft size={20} />
        </button>

        <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6 sm:p-8 min-h-[400px]">
          {sections[activeSection].component}
        </div>

        <button 
          onClick={nextSection}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none"
          aria-label="Next section"
        >
          <FaChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

const ProjectImageUpload = () => (
  <div>
    <p className="text-gray-600 mb-6">Enhance your project's visual appeal with up to 3 high-quality images.</p>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[1, 2, 3].map((num) => (
        <div key={num} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors duration-300 cursor-pointer">
          <FaImage className="mx-auto text-4xl sm:text-5xl text-gray-400 mb-3" />
          <p className="text-sm text-gray-500">Upload Image {num}</p>
        </div>
      ))}
    </div>
  </div>
);

export default OnboardingPage;