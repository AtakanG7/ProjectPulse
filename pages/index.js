import { useState } from "react";
import { useSession } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from "framer-motion";

import Header from './components/Main/Header';
import HeroSection from './components/Main/HeroSection';
import SearchSection from './components/Main/SearchSection';
import Leaderboard from './components/Main/Leaderboard';
import About from "./components/Main/About";
import Footer from "./components/Main/Footer";
import UpvoteList from "./components/Main/UpvoteList";

// Animation variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

export default function Home() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('your status');
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'search':
        return (
          <motion.div
            key="search"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <SearchSection />
            <UpvoteList />
          </motion.div>
        );
      case 'leaderboard':
        return (
          <motion.div
            key="leaderboard"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Leaderboard />
          </motion.div>
        );
      case 'about':
        return (
          <motion.div
            key="about"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <About />
          </motion.div>
        );
      default:
        return (
          <motion.div
            key="hero"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <HeroSection />
          </motion.div>
        );
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
            <AnimatePresence>
              {isMobileNavOpen && (
                <motion.nav
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col space-y-2 overflow-hidden"
                >
                  {['your status', 'search', 'leaderboard', 'about'].map((tab) => (
                    <button
                      key={tab}
                      className={`w-full px-4 py-2 text-lg font-semibold ${activeTab === tab ? 'text-indigo-600' : 'text-gray-500'}`}
                      onClick={() => {
                        setActiveTab(tab);
                        setMobileNavOpen(false);
                      }}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1')}
                    </button>
                  ))}
                </motion.nav>
              )}
            </AnimatePresence>
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

          <AnimatePresence mode="wait">
            {renderTabContent()}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  );
}