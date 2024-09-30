import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import dbConnect from '../../../utils/dbConnect';

import UserHeader from "./UserHeader";
import Tabs from "./Tabs";
import ProjectsSection from "./ProjectsSection";
import AboutSection from "./AboutSection";
import AddProjectModal from "./AddProjectModal";
import { FaPlus } from 'react-icons/fa';
import GitHubContributionGraph from "./GitHubContributionGraph";


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
          setEditBio(data.data?.bio);
        });
    }
  }, [username]);

  const handleAddProject = (projectData) => {
    fetch(`/api/projects/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projects: [projectData] }),
    })
      .then((res) => res.json())
      .then((projects) => {
        toast.success("Project added successfully");
        setIsModalOpen(false);
        setTitle("");
        setDescription("");
        setUser((prevUser) => ({
          ...prevUser,
          projects: [...prevUser.projects, ...projects.data],
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
    <>
      {user && (
        <div className="container mx-auto px-4">
          <UserHeader
            user={user}
            isEditing={isEditing}
            editBio={editBio}
            setEditBio={setEditBio}
            handleUpdateBio={handleUpdateBio}
            setIsEditing={setIsEditing}
          />
          <GitHubContributionGraph username={user.username} />
          <div className="my-6">
            <Tabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
          </div>
          <div className="mb-6">
            {selectedTab === "Projects" ? (
              <ProjectsSection projects={user.projects} />
            ) : (
              <AboutSection bio={user.bio} />
            )}
          </div>
          <AddProjectModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            handleAddProject={handleAddProject}
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="fixed bottom-6 right-6 rounded-full p-3 bg-white border border-gray-300 shadow-md hover:shadow-lg transition duration-300 ease-in-out
                      flex items-center justify-center
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            aria-label="Add Project"
          >
            <FaPlus className="text-gray-500 text-2xl" />
          </button>
        </div>
      )}
    </>
  );
}
