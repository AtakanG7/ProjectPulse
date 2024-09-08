import React from 'react';
import { useSession, signIn } from "next-auth/react";
import { Github, MessageCircle, ChevronRight } from "lucide-react";

const HeroSection = () => {
  const { data: session } = useSession();

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-24 min-h-screen flex items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10 animate-pulse"
        style={{ backgroundImage: 'url(/img/landing.jpg)', animation: 'pulseBackground 10s infinite' }}
      />
      <div className="container mx-auto px-6 relative z-10 text-center">
        <h2 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
          Showcase Your Projects to the World
        </h2>

        <p className="text-lg md:text-xl mb-12 max-w-3xl mx-auto text-gray-400 leading-relaxed">
          Join our vibrant community of innovators and creators. Share your work, get inspired, and climb the ranks!
        </p>

        {session ? (
          <p className="text-3xl md:text-4xl font-semibold mb-8">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 animate-text-pulse">{session.user.name}</span>!
          </p>
        ) : (
          <button
            onClick={() => signIn()}
            className="group bg-gradient-to-r from-teal-500 to-blue-600 text-white px-8 py-4 rounded-full text-lg md:text-xl font-bold "
          >
            Get Started - It's Free!
            <ChevronRight className="inline-block ml-2 transform transition-transform" />
          </button>
        )}

        <div className="flex flex-col md:flex-row justify-center items-stretch space-y-8 md:space-y-0 md:space-x-8 mt-20 max-w-4xl mx-auto">
          <Card
            icon={<Github className="w-10 h-10 text-white" />}
            title="Collaborate Effortlessly"
            description="Work together with teams across the globe, share insights, and build amazing things faster."
          />
          <Card
            icon={<MessageCircle className="w-10 h-10 text-white" />}
            title="Engage & Network"
            description="Connect with like-minded creators and entrepreneurs. Build your network and find new opportunities."
          />
        </div>

        <p className="text-xs text-gray-500 mt-24 font-medium tracking-wider uppercase">
          Trusted by Teams Around the World
        </p>
      </div>
    </section>
  );
};

const Card = ({ icon, title, description }) => (
  <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg p-8 rounded-2xl text-center w-full max-w-sm mx-auto flex flex-col items-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 border border-gray-700">
    <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full mb-6 flex items-center justify-center shadow-lg">
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-4 text-teal-300">{title}</h3>
    <p className="text-gray-400 mb-4 text-sm">{description}</p>
  </div>
);

export default HeroSection;
