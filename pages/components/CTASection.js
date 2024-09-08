import React from 'react';
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { Rocket, Stars, ArrowRight } from 'lucide-react';

const CTASection = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const navigateToProfile = (username) => {
    if (username) {
      router.push(`/users/${username}`);
    } else {
      console.error('Username is undefined');
    }
  };

  return (
    <section className="relative overflow-hidden from-gray-900 text-white py-20  dark:via-gray-800 dark:to-black transition-colors duration-300">
      {/* Animated Stars and Parallax Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <Stars className="absolute animate-spin-slow text-gray-100 opacity-10 w-full h-full -z-10" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight tracking-wide">
            Ready to Showcase Your Talent?
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-gray-300 dark:text-gray-400">
            Join ProjectPulse today and start your journey to the top of the leaderboard!
          </p>

          {/* Conditional rendering based on session */}
          {session ? (
            <button
              onClick={() => navigateToProfile(session.user.username)}
              className="group bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-500 transition-all duration-200 ease-in-out inline-flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Rocket className="mr-3" size={24} />
              View Your Profile
              <ArrowRight className="ml-3 transition-transform duration-200 group-hover:translate-x-1" size={20} />
            </button>
          ) : (
            <button
              onClick={() => signIn()}
              className="group bg-gradient-to-r from-pink-500 to-yellow-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gradient-to-r hover:from-yellow-500 hover:to-pink-500 transition-all duration-200 ease-in-out inline-flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Rocket className="mr-3" size={24} />
              Launch Your Profile Now
              <ArrowRight className="ml-3 transition-transform duration-200 group-hover:translate-x-1" size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Background Overlay */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-gray-900 to-transparent opacity-40 dark:from-black"></div>
    </section>
  );
};

export default CTASection;
