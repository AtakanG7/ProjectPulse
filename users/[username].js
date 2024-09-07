import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function UserProfile() {
  const router = useRouter();
  const { username } = router.query;
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (username) {
      // Fetch user data by username
      fetch(`/api/users/${username}`)
        .then((res) => res.json())
        .then((data) => setUser(data.data))
        .catch((err) => {
          console.error("Failed to fetch user data", err);
          toast.error("Failed to fetch user data");
        });
    }
  }, [username]);

  const handleAddProject = async () => {
    if (!title || !description) {
      toast.warning("Please fill all fields");
      return;
    }

    const response = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, userId: user._id }),
    });

    if (response.ok) {
      toast.success("Project added!");
      setTitle("");
      setDescription("");
      fetch(`/api/users/${username}`)
        .then((res) => res.json())
        .then((data) => setUser(data.data))
        .catch((err) => {
          console.error("Failed to fetch user data", err);
          toast.error("Failed to fetch user data");
        });
    } else {
      toast.error("Error adding project");
    }
  };

  if (!user) return <div className="text-center text-gray-500">Loading...</div>;

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center mb-6">
          <img src={user.profilePicture} alt={user.username} className="w-24 h-24 rounded-full border-2 border-gray-200 mr-4" />
          <h1 className="text-3xl font-bold">{user.username}'s Profile</h1>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Projects</h2>
        <ul className="space-y-4">
          {user.projects.map((project) => (
            <li key={project._id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold">{project.title}</h3>
              <p className="text-gray-700">{project.description}</p>
            </li>
          ))}
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Add New Project</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Project Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Project Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddProject}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-500"
          >
            Add Project
          </button>
        </div>
      </div>
    </div>
  );
}
