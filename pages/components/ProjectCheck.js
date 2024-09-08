import React from 'react';
import { Mail, Link, CheckCircle } from 'lucide-react';

const ProjectCheckHeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white py-24  flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-30 -z-10" />

      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Text Content */}
        <div className="flex flex-col justify-center text-center md:text-left md:pl-12 space-y-6 animate-fadeIn">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
            Keep Your Projects in Check
          </h2>
          <p className="text-lg md:text-xl mb-12 max-w-lg mx-auto md:mx-0 text-gray-300 leading-relaxed">
            Add your project URL and get email notifications if your project goes down. Ensure your applications are always running smoothly.
          </p>
          <button className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:from-teal-400 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-400">
            Start Monitoring
          </button>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-8 animate-fadeIn delay-100">
          <FeatureCard
            icon={<CheckCircle className="w-12 h-12 text-green-400" />}
            title="Real-Time Status Checks"
            description="Continuously monitor your project's status with instant updates on its health."
          />
          <FeatureCard
            icon={<Mail className="w-12 h-12 text-yellow-400" />}
            title="Instant Email Notifications"
            description="Receive immediate email alerts if your project experiences downtime. Stay informed and act fast."
          />
          <FeatureCard
            icon={<Link className="w-12 h-12 text-blue-400" />}
            title="Easy Project Tracking"
            description="Simply input your project URL to start tracking its status effortlessly."
          />
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-gray-800 bg-opacity-80 p-8 rounded-2xl text-center flex flex-col items-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 border border-gray-700 hover:border-blue-500">
    <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full mb-6 flex items-center justify-center shadow-lg">
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-4 text-teal-300">{title}</h3>
    <p className="text-gray-300 mb-4 text-sm">{description}</p>
  </div>
);

export default ProjectCheckHeroSection;
