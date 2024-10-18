import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import dbConnect from '../../../utils/dbConnect';

import UserHeader from "./UserHeader";
import ProjectsSection from "./ProjectsSection";
import AddProjectModal from "./AddProjectModal";
import { FaPlus, FaGithub } from 'react-icons/fa';

import ProfileOnboarding from "../Users/ProfileOnboarding";

export default function UserProfile() {
  const router = useRouter();
  const { username } = router.query;
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState("");
  const [showOnboarding, setShowOnboarding] = useState(false);

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
        setUser((prevUser) => ({
          ...prevUser,
          projects: [...prevUser.projects, ...projects.data],
        }));
      })
      .catch((err) => toast.error("Error adding project: " + err.message));
  };

  const handleImportGithub = () => {
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = async (selectedProjects) => {
    try {
      const response = await fetch(`/api/projects/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projects: selectedProjects }),
      });
    } catch (error) {
      console.error('Error saving projects:', error);
    }
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
            setIsEditing={setIsEditing}
          />
          {showOnboarding && (
            <ProfileOnboarding
              username={user?.username}
              onComplete={() => handleOnboardingComplete()}
            />
          )}
          <div className="flex justify-between items-center mb-6 mt-6">
            <button
              onClick={handleImportGithub}
              className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <FaGithub className="mr-2" />
              Import GitHub
            </button>
          </div>
          <ProjectsSection projects={user.projects} />
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