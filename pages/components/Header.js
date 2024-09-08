import React from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import { LogOut, Menu, User } from 'lucide-react';
import Link from 'next/link';
const Header = ({ isMenuOpen, setIsMenuOpen }) => {
  const { data: session } = useSession();

  return (
    <header className="transparent bg-gradient to-black text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
              {/* Logo and App Name */}
              <div className="flex items-center justify-center space-x-4">
        <h1 className="relative text-4xl md:text-7xl font-mono font-extrabold tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-600 to-red-500">
          <span className="absolute -left-4 -top-1 text-7xl md:text-8xl text-purple-400 rotate-12 opacity-60">P</span>
          <span className="relative">
            <span className="text-4xl md:text-2xl font-extrabold">P</span>
            <span className="text-7xl md:text-6xl">rojection</span>
          </span>
          <span className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-transparent to-white opacity-10 rounded-full blur-xl"></span>
        </h1>
      </div>

        {/* User Profile or Sign-In Button (Desktop) */}
        <nav className="hidden md:flex space-x-6 items-center">
          {session ? (
            <div className="flex items-center space-x-4">
              <Link href={`/users/${session.user.username}`} className='flex items-center space-x-2 bg-gray-800 rounded-full py-1 px-3'>
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name}
                      className="w-8 h-8 rounded-full border-2 border-purple-400"
                    />
                  ) : (
                    <User className="w-8 h-8 text-white bg-gray-600 rounded-full p-1" />
                  )}
                  <span className="font-medium text-gray-300">{session.user.name}</span>
              </Link>
              <button
                onClick={() => signOut()}
                className="flex items-center hover:text-purple-400 transition-colors bg-gray-800 hover:bg-gray-700 rounded-full py-1 px-3"
              >
                <LogOut className="mr-2" size={18} />
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full font-semibold hover:from-purple-500 hover:to-pink-500 transition-colors shadow-md"
            >
              Sign In
            </button>
          )}
        </nav>

        {/* Mobile Menu Toggle Button */}
        <button 
          className="md:hidden text-white focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-md p-1"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <Menu size={28} />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="bg-gray-900 text-white md:hidden p-4 space-y-4">
          {session ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center space-x-2">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name}
                    className="w-10 h-10 rounded-full border-2 border-purple-400"
                  />
                ) : (
                  <User className="w-10 h-10 text-white bg-gray-600 rounded-full p-1" />
                )}
                <span className="font-medium text-gray-300">{session.user.name}</span>
              </div>
              <button
                onClick={() => signOut()}
                className="flex items-center justify-center w-full bg-gray-800 hover:bg-gray-700 rounded-full py-2 px-4 transition-colors"
              >
                <LogOut className="mr-2" size={18} />
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 px-4 rounded-full font-semibold hover:from-purple-500 hover:to-pink-500 transition-colors shadow-md"
            >
              Sign In
            </button>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
