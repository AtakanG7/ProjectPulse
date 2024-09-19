import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import UserHeader from "./UserHeader";
import Tabs from "./Tabs";
import ProjectsSection from "./ProjectsSection";
import AboutSection from "./AboutSection";
import AddProjectModal from "./AddProjectModal";

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
        });
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
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
          />
          <button
            onClick={() => setIsModalOpen(true)}
            className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          >
            Add Project
          </button>
        </div>
      )}
    </>
  );
}
