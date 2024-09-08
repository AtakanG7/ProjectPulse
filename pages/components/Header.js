import { useSession, signIn, signOut } from "next-auth/react";
import { LogOut, Menu } from 'lucide-react';

export default function Header({ isMenuOpen, setIsMenuOpen }) {
  const { data: session } = useSession();

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo and App Name */}
        <div className="flex items-center space-x-2">
          <img src="/img/logo.png" alt="App Logo" className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Projection</h1>
        </div>

        {/* User Profile or Sign-In Button */}
        <nav className="flex space-x-6 items-center">
          {session ? (
            <div className="flex items-center space-x-4">
              <img
                src={session.user.image}
                alt={session.user.name}
                className="w-10 h-10 rounded-full"
              />
              <button
                onClick={() => signOut()}
                className="flex items-center hover:text-blue-300 transition-colors"
              >
                <LogOut className="mr-1" size={16} />
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn()}
              className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 transition-colors"
            >
              Sign In
            </button>
          )}
        </nav>

        {/* Mobile Menu Toggle Button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="bg-blue-600 text-white md:hidden">
          {session ? (
            <div className="flex flex-col items-start px-6 py-2">
              <span>{session.user.name}</span>
              <button
                onClick={() => signOut()}
                className="flex items-center hover:text-blue-300 transition-colors"
              >
                <LogOut className="mr-1" size={16} />
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn()}
              className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 transition-colors"
            >
              Sign In
            </button>
          )}
        </nav>
      )}
    </header>
  );
}
