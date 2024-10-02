import React from 'react';
import Link from 'next/link';
import { FaRocket, FaArrowRight } from 'react-icons/fa';

const OnboardingOffer = ({ username }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto my-8">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <FaRocket className="text-3xl text-indigo-600" />
        </div>
        <div className="flex-grow">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Ready to showcase your projects?
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Let's set up your profile and add your first project.
          </p>
        </div>
        <div className="flex-shrink-0">
          <Link href={`/users/onboarding/${username}`}>
            <p className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition duration-300">
              Begin Setup
              <FaArrowRight className="ml-2" />
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OnboardingOffer;