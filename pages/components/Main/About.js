import React from 'react';
import { Sparkles, Code, Users, ChevronRight, Globe } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: <Sparkles className="text-yellow-400" size={24} />,
      title: "Discover New Projects",
      description: "Explore groundbreaking projects that push the boundaries of innovation and creativity.",
    },
    {
      icon: <Code className="text-indigo-500" size={24} />,
      title: "Showcase Your Work",
      description: "Share your visionary projects and let your creativity inspire a global audience of innovators.",
    },
    {
      icon: <Users className="text-blue-600" size={24} />,
      title: "Connect with Creators",
      description: "Collaborate with brilliant minds from around the world and turn your ideas into reality.",
    }
  ];

  return (
    <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-20 relative">
          <Globe className="text-indigo-100 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" size={300} />
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-indigo-700 leading-tight relative z-10">
            Empowering Creators <br /> Across the Globe
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed relative z-10">
            Join a vibrant community where innovation knows no borders. Discover, create, and collaborate on our platform designed for the visionaries of tomorrow.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-24">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-2xl shadow-md transition-shadow duration-300 hover:shadow-lg"
            >
              <div className="flex items-center mb-6">
                <div className="mr-4 p-2 bg-gray-50 rounded-xl">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row items-center mb-24 bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="lg:w-1/2 p-12 lg:p-16">
            <h3 className="text-3xl font-semibold text-gray-900 mb-6 leading-tight">Our Collaborative Vision</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Imagine a world where every idea has the potential to change the future. Our platform is the canvas for that world—a space where creativity flourishes, boundaries disappear, and innovation becomes a shared journey.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Whether you're sketching out the first draft of a world-changing concept or seeking kindred spirits to bring your vision to life, you'll find a community here that believes in the power of collaborative creativity.
            </p>
          </div>
          <div className="lg:w-1/2 relative overflow-hidden">
            <img 
              src="/img/about.webp" 
              alt="Two people planning a project" 
              className="w-full h-full object-cover"
              style={{ maxHeight: '500px' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent"></div>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-3xl font-semibold text-gray-900 mb-6">Begin Your Journey Today</h3>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            The future of innovation is collaborative, and it starts here. Join our global community and be part of the next big breakthrough.
          </p>
          <a href="/register" className="inline-flex items-center bg-indigo-700 text-white py-4 px-8 rounded-full text-lg font-semibold hover:bg-indigo-800 transition-colors duration-300">
            Start Creating
            <ChevronRight className="ml-2" size={20} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default About;