import React, { useState, useRef, useEffect } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import Link from 'next/link';
import Image from 'next/image';
import { Search, User, ChevronDown, Settings, LogOut } from 'lucide-react';

const Header = () => {
  const { data: session } = useSession();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white text-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image src="/img/logo.svg" alt="ProjectPulse Logo" width={32} height={32} />
          <span className="text-xl font-semibold text-gray-800 ml-2">ProjectPulse</span>
        </Link>

        <div className="flex items-center space-x-4">
          {session ? (
            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 hover:bg-gray-100 rounded-full py-2 px-3 transition-colors"
              >
                <img 
                  src={session.user.image || '/api/placeholder/32'} 
                  alt={session.user.name} 
                  className="w-8 h-8 rounded-full"
                />
                <ChevronDown size={16} className={`text-gray-600 transform transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg overflow-hidden shadow-lg z-20 border border-gray-200">
                  <div className="p-4 border-b border-gray-200">
                    <p className="text-lg font-semibold text-gray-800">{session.user.name}</p>
                    <p className="text-sm text-gray-600">@{session.user.username}</p>
                  </div>
                  <Link 
                    href={`/users/${session.user.username}`}
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <User size={20} className="mr-3 text-gray-500" />
                    Profile
                  </Link>
                  <Link 
                    href="/settings"
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Settings size={20} className="mr-3 text-gray-500" />
                    Settings
                  </Link>
                  <button 
                    onClick={() => signOut()}
                    className="flex items-center w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <LogOut size={20} className="mr-3 text-gray-500" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => signIn()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;