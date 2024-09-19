import { useState } from "react";
import { useSession } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Main/Header';
import HeroSection from './components/Main/HeroSection';
import SearchSection from './components/Main/SearchSection';
import Leaderboard from './components/Main/Leaderboard';
import About from "./components/Main/About";
import Footer from "./components/Main/Footer";

export default function Home() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('your status');
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'search':
        return <SearchSection />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'about':
        return <About />;
      default:
        return <HeroSection />;
    }
  };

  return (
    <>
      <Header />
      <ToastContainer />
      <main>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-indigo-800 mb-4">
              Discover, Connect, and Innovate
            </h1>
            <p className="text-gray-600">Explore exciting projects, connect with creators, and get inspired.</p>
          </div>

          {/* Mobile Navigation */}
          <div className="sm:hidden">
            <button
              onClick={() => setMobileNavOpen(!isMobileNavOpen)}
              className="px-4 py-2 text-lg font-semibold text-gray-500"
            >
              Menu
            </button>
            {isMobileNavOpen && (
              <nav className="flex flex-col space-y-2">
                {['your status', 'search', 'leaderboard', 'about'].map((tab) => (
                  <button
                    key={tab}
                    className={`w-full px-4 py-2 text-lg font-semibold ${activeTab === tab ? 'text-indigo-600' : 'text-gray-500'}`}
                    onClick={() => {
                      setActiveTab(tab);
                      setMobileNavOpen(false); // Close nav after selection
                    }}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1')}
                  </button>
                ))}
              </nav>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex justify-center mb-6">
            <nav className="flex space-x-4">
              {['your status', 'search', 'leaderboard', 'about'].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 text-lg font-semibold ${activeTab === tab ? 'text-indigo-600' : 'text-gray-500'}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1')}
                </button>
              ))}
            </nav>
          </div>

          {renderTabContent()}
        </div>
      </main>
      <Footer />
    </>
  );
}

