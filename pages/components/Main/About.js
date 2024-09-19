import React from 'react';
import { Sparkles, Code, Users } from 'lucide-react';

const About = () => {
  return (
    <section className="relative bg-gradient-to-r from-blue-50 to-gray-100 py-20 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 flex justify-center items-center">
        <svg className="absolute top-0 left-0 w-full h-full opacity-10" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="100" fill="url(#gradient)"/>
          <defs>
            <linearGradient id="gradient" x1="0" x2="1" y1="1" y2="0">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.1)" />
              <stop offset="100%" stopColor="rgba(0, 0, 0, 0.1)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">About Our Platform</h2>
          <p className="mt-4 text-lg text-gray-600">
            Discover and showcase incredible projects and connect with creators worldwide.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-indigo-500">
            <div className="flex items-center justify-center mb-6 text-indigo-600">
              <Sparkles className="h-16 w-16" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Discover New Projects</h3>
            <p className="text-gray-700">
              Explore a diverse range of innovative projects from creators globally. Find inspiration, the latest trends, and more right here.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-green-500">
            <div className="flex items-center justify-center mb-6 text-green-600">
              <Code className="h-16 w-16" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Showcase Your Work</h3>
            <p className="text-gray-700">
              Share your projects and get noticed. Our platform makes it easy to highlight your work and connect with others who share your passion.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-blue-500">
            <div className="flex items-center justify-center mb-6 text-blue-600">
              <Users className="h-16 w-16" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Connect with Creators</h3>
            <p className="text-gray-700">
              Network with like-minded individuals and build meaningful connections. Our platform encourages collaboration and learning.
            </p>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <h3 className="text-3xl font-semibold text-gray-900 mb-6">Join Us Today</h3>
          <p className="text-gray-600 mb-8">
            Sign up now to start exploring, showcasing, and connecting. Be part of a vibrant community dedicated to innovation and creativity.
          </p>
          <a href="/register" className="inline-block bg-indigo-700 text-white py-4 px-8 rounded-full text-lg font-semibold hover:bg-indigo-800 transition-colors duration-300">
            Get Started
          </a>
        </div>
      </div>
    </section>
  );
};

export default About;
