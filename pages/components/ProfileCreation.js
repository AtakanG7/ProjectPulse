import { useState } from 'react';
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

export default function ProfileCreation() {
  const { data: session } = useSession();
  const [username, setUsername] = useState("");

  const handleCreateProfile = async (event) => {
    event.preventDefault();
    if (!username) return toast.warn("Please enter a username");

    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        name: session.user.name, 
        email: session.user.email, 
        username,
        profilePicture: session.user.image
      }),
    });

    if (response.ok) {
      toast.success("Profile created!");
      window.location.reload();
    } else {
      toast.error("Error creating profile");
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white py-20 px-6 rounded-xl shadow-lg overflow-hidden">
      <div className="absolute inset-0 bg-opacity-50 backdrop-blur-lg" />
      <div className="relative container mx-auto flex flex-col items-center text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
          Start Showcasing Your Projects with a Single Link
        </h2>
        <p className="text-lg md:text-xl mb-10 max-w-3xl">
          Create your profile now and bring your projects into the spotlight. Just one link to showcase everything you’ve built and share it with the world!
        </p>
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full max-w-md mx-auto">
          <input
            type="text"
            placeholder="Enter your custom username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="flex-grow p-4 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleCreateProfile}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Profile
          </button>
        </div>
      </div>
    </section>
  );
}
