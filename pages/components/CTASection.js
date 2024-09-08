import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { Rocket } from 'lucide-react';

export default function CTASection() {
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
    <section className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-16 text-center">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold mb-4">Ready to Showcase Your Talent?</h2>
        <p className="text-xl mb-8">Join ProjectPulse today and start your journey to the top of the leaderboard!</p>
        {session ? (
          <button
            onClick={() => navigateToProfile(session.user.username)}
            className="bg-white text-blue-700 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-100 transition-colors inline-flex items-center"
          >
            <Rocket className="mr-2" size={24} />
            View Your Profile
          </button>
        ) : (
          <button
            onClick={() => signIn()}
            className="bg-white text-blue-700 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-100 transition-colors inline-flex items-center"
          >
            <Rocket className="mr-2" size={24} />
            Launch Your Profile Now
          </button>
        )}
      </div>
    </section>
  );
}
