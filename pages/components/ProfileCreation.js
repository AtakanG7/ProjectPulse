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
    <section className="mb-12 bg-gray-100 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Quick Profile Creation</h2>
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Enter your custom username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="flex-grow p-3 rounded-l-md border border-blue-500 focus:outline-none"
        />
        <button
          onClick={handleCreateProfile}
          className="bg-blue-600 text-white px-6 py-3 rounded-r-md hover:bg-blue-700 transition-colors"
        >
          Create
        </button>
      </div>
    </section>
  );
}
