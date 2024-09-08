import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa"; // For icons

export default function UserProfile() {
  const router = useRouter();
  const { username } = router.query;
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Projects");
  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState("");

  useEffect(() => {
    if (username) {
      fetch(`/api/users/${username}`)
        .then((res) => res.json())
        .then((data) => {
          setUser(data.data);
          setEditBio(data.data.bio);
        })
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
      setIsModalOpen(false);
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

  const handleUpdateBio = async () => {
    if (!editBio) {
      toast.warning("Bio cannot be empty");
      return;
    }

    const response = await fetch(`/api/users/${username}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bio: editBio }),
    });

    if (response.ok) {
      toast.success("Bio updated!");
      setIsEditing(false);
      fetch(`/api/users/${username}`)
        .then((res) => res.json())
        .then((data) => setUser(data.data))
        .catch((err) => {
          console.error("Failed to fetch user data", err);
          toast.error("Failed to fetch user data");
        });
    } else {
      toast.error("Error updating bio");
    }
  };

  if (!user) return <div className="text-center text-gray-500">Loading...</div>;

  return (
    <div className="container mx-auto px-6 py-10">
      {/* User Header */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-10 flex flex-col md:flex-row items-center md:justify-between">
        <div className="flex items-center">
          <img
            src={user.profilePicture}
            alt={user.username}
            className="w-24 h-24 rounded-full border-4 border-blue-500 mr-6"
          />
          <div>
            <h1 className="text-3xl font-bold">{user.username}</h1>
            {isEditing ? (
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg mt-2"
                rows="3"
              />
            ) : (
              <p className="text-gray-600 mt-2">{user.bio}</p>
            )}
            <div className="flex space-x-4 mt-4">
              <a href={user.github} className="text-blue-500 hover:text-blue-700">
                <FaGithub className="text-xl" />
              </a>
              <a href={user.linkedin} className="text-blue-500 hover:text-blue-700">
                <FaLinkedin className="text-xl" />
              </a>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-blue-500 hover:text-blue-700"
              >
                {isEditing ? "Save" : "Edit Bio"}
              </button>
            </div>
            {isEditing && (
              <button
                onClick={handleUpdateBio}
                className="bg-blue-600 text-white p-2 rounded-lg mt-2"
              >
                Save Bio
              </button>
            )}
          </div>
        </div>
        {/* Stats */}
        <div className="mt-4 md:mt-0">
          <div className="flex space-x-6">
            <div>
              <h3 className="text-xl font-bold">{user.projects.length}</h3>
              <p className="text-gray-500">Projects</p>
            </div>
            <div>
              <h3 className="text-xl font-bold">{user.likes}</h3>
              <p className="text-gray-500">Likes</p>
            </div>
            <div>
              <h3 className="text-xl font-bold">{user.followers}</h3>
              <p className="text-gray-500">Followers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for switching sections */}
      <div className="flex justify-center mb-6">
        <button
          className={`px-4 py-2 text-lg font-semibold ${
            selectedTab === "Projects"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setSelectedTab("Projects")}
        >
          Projects
        </button>
        <button
          className={`px-4 py-2 text-lg font-semibold ${
            selectedTab === "About"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500"
          }`}
          onClick={() => setSelectedTab("About")}
        >
          About
        </button>
      </div>

      {/* Projects Section */}
      {selectedTab === "Projects" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user.projects.map((project) => (
            <div
              key={project._id}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold">{project.title}</h3>
              <p className="text-gray-700 mt-2">{project.description}</p>
              <div className="flex justify-between items-center mt-4">
                {/* Like Button */}
                <button className="flex items-center text-blue-500 hover:text-blue-700">
                  👍 <span className="ml-1">Like</span>
                </button>
                {/* Report Issue Button */}
                <button className="text-red-500 hover:text-red-700">
                  Report Issue
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* About Section */}
      {selectedTab === "About" && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-700">{user.bio}</p>
        </div>
      )}

      {/* Floating Action Button for Adding a New Project */}
      <button
        className="fixed bottom-10 right-10 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-500 focus:outline-none"
        onClick={() => setIsModalOpen(true)}
      >
        ➕
      </button>

      {/* Modal for Adding New Project */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Add New Project
                  </Dialog.Title>
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Project Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      placeholder="Project Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="4"
                    ></textarea>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={handleAddProject}
                    >
                      Add Project
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
