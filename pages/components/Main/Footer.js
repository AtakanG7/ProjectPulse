import React from 'react';
import { Globe, MessageCircle, Github, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white text-gray-900 py-16 mx-auto">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Connecting Developers, Inspiring Innovation</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">Join our community of passionate developers and showcase your projects to the world.</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          <FooterLink icon={<Globe size={20} />} text="Official Website" link="https://atakangul.com" />
          <FooterLink icon={<MessageCircle size={20} />} text="Community Chat" link="https://chat.atakangul.com" />
          <FooterLink icon={<Github size={20} />} text="GitHub Repository" link="https://github.com/atakang7" />
        </div>

        <div className="text-center text-gray-700 text-sm">
          2023 ProjectPulse. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ icon, text, link }) => (
  <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center space-x-2 text-gray-700 hover:text-indigo-700 transition-colors duration-300 group"
  >
    {icon}
    <span>{text}</span>
    <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  </a>
);

export default Footer;

