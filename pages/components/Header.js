import React, { useState, useRef, useEffect } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import Link from 'next/link';
import { Search, User, ChevronDown } from 'lucide-react';

const Header = () => {
  const { data: session } = useSession();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const userMenuRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-black text-white shadow-md ">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between px-10">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          ProjectPulse
        </Link>

        {/* Search and User Actions */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            {isSearchOpen ? (
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                className="bg-gray-700 text-white rounded-md py-1 px-3 pr-8 focus:outline-none focus:ring-2 focus:ring-white"
              />
            ) : (
              <button 
                onClick={() => setIsSearchOpen(true)} 
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Search size={20} />
              </button>
            )}
          </div>
          
          {session ? (
            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center text-gray-400 hover:text-white transition-colors"
              >
                <User size={20} className="mr-2" />
                <span>{session.user.name}</span>
                <ChevronDown size={16} className="ml-1" />
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md overflow-hidden shadow-xl z-20">
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-sm text-white">{session.user.name}</p>
                    <p className="text-xs text-gray-400">@{session.user.username}</p>
                  </div>
                  <Link 
                    href={`/users/${session.user.username}`}
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  >
                    Profile
                  </Link>
                  <button 
                    onClick={() => signOut()}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => signIn()}
              className="text-gray-400 hover:text-white transition-colors"
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
