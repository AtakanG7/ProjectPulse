import React from 'react';
import { Globe, MessageCircle, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative overflow-hidden from-gray-900 text-white py-20  dark:via-gray-800 dark:to-black transition-colors duration-300">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Website Card */}
        <FooterCard
          icon={<Globe className="w-12 h-12 " />}
          title="Visit My Website"
          description="Learn more about the creator of this application, explore other projects, and get in touch through the official website."
          link="https://atakangul.com"
          linkText="Visit Website"
        />

        {/* Chat Application Card */}
        <FooterCard
          icon={<MessageCircle className="w-12 h-12 " />}
          title="Chat with Us"
          description="Have a question or want to discuss projects? Join our community chat and get connected with other developers."
          link="https://chat.atakangul.com"
          linkText="Join the Chat"
        />

        {/* GitHub Card */}
        <FooterCard
          icon={<Github className="w-12 h-12" />}
          title="Check Out the GitHub"
          description="Want to contribute or explore the source code? Visit the GitHub repository to view the code and open issues."
          link="https://github.com/atakang7"
          linkText="View on GitHub"
        />
      </div>
    </footer>
  );
};

const FooterCard = ({ icon, title, description, link, linkText }) => (
  <div className="bg-gray-800 bg-opacity-80 p-8 rounded-2xl text-center flex flex-col items-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 border border-gray-700 hover:border-blue-500">
    <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full mb-6 flex items-center justify-center shadow-lg">
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-4 text-teal-300">{title}</h3>
    <p className="text-gray-300 mb-4 text-sm">{description}</p>
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block bg-gradient-to-r from-teal-500 to-blue-600 text-white px-4 py-2 rounded-full font-semibold text-sm hover:from-teal-400 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-teal-400"
    >
      {linkText}
    </a>
  </div>
);

export default Footer;
