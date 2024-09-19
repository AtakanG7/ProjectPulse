import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import UserHeader from "../components/Users/UserHeader";
import Tabs from "../components/Users/Tabs";
import ProjectsSection from "../components/Users/ProjectsSection";
import AboutSection from "../components/Users/AboutSection";
import AddProjectModal from "../components/Users/AddProjectModal";

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
        .catch((err) => toast.error("Error fetching user data: " + err.message));
    }
  }, [username]);

  const handleAddProject = () => {
    fetch(`/api/users/${username}/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    })
      .then((res) => res.json())
      .then(() => {
        toast.success("Project added successfully");
        setIsModalOpen(false);
        setTitle("");
        setDescription("");
        setUser((prevUser) => ({
          ...prevUser,
          projects: [...prevUser.projects, { title, description }],
        }));
      })
      .catch((err) => toast.error("Error adding project: " + err.message));
  };

  const handleUpdateBio = () => {
    fetch(`/api/users/${username}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bio: editBio }),
    })
      .then((res) => res.json())
      .then(() => {
        toast.success("Bio updated successfully");
        setIsEditing(false);
      })
      .catch((err) => toast.error("Error updating bio: " + err.message));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {user && (
        <div className="container mx-auto px-4 py-8">
          <UserHeader
            user={user}
            isEditing={isEditing}
            editBio={editBio}
            setEditBio={setEditBio}
            handleUpdateBio={handleUpdateBio}
            setIsEditing={setIsEditing}
          />
          <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
          {selectedTab === "Projects" ? (
            <ProjectsSection projects={user.projects} />
          ) : (
            <AboutSection bio={user.bio} />
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white p-3 rounded-lg mt-6 hover:bg-blue-700 transition-colors"
          >
            Add Project
          </button>
          <AddProjectModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            handleAddProject={handleAddProject}
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
          />
        </div>
      )}
    </div>
  );
}
