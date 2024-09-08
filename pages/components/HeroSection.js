import { useSession, signIn } from "next-auth/react";

export default function HeroSection() {
  const { data: session } = useSession();

  return (
    <section className="bg-gradient-to-r from-blue-500 to-teal-600 text-white py-20 text-center">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold mb-4">
          Showcase Your Projects to the World
        </h2>
        <p className="text-xl mb-8">
          Join our vibrant community of innovators and creators. Share your work, get inspired, and climb the ranks!
        </p>
        {session ? (
          <p className="text-2xl font-semibold mb-4">
            Welcome back, {session.user.name}!
          </p>
        ) : (
          <button
            onClick={() => signIn()}
            className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-100 transition-colors"
          >
            Get Started - It's Free!
          </button>
        )}
      </div>
    </section>
  );
}
