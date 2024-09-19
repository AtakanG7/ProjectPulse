import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function UserHeader({
  user,
  isEditing,
  editBio,
  setEditBio,
  handleUpdateBio,
  setIsEditing
}) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-10 flex flex-col md:flex-row items-center md:justify-between border border-gray-200">
      {/* Profile Info */}
      <div className="flex items-center space-x-4">
        <img
          src={user.profilePicture}
          alt={user.username}
          className="w-24 h-24 rounded-full border-2 border-gray-300 shadow-sm"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-gray-900">{user.username}</h1>
          {isEditing ? (
            <textarea
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          ) : (
            <p className="text-gray-700 mt-2">{user.bio}</p>
          )}
          <div className="flex space-x-4 mt-4">
            <a href={user.github} className="text-gray-700 hover:text-gray-900">
              <FaGithub className="text-xl" />
            </a>
            <a href={user.linkedin} className="text-gray-700 hover:text-gray-900">
              <FaLinkedin className="text-xl" />
            </a>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {isEditing ? "Save" : "Edit Bio"}
            </button>
          </div>
          {isEditing && (
            <button
              onClick={handleUpdateBio}
              className="bg-blue-600 text-white p-2 rounded-lg mt-2 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save Bio
            </button>
          )}
        </div>
      </div>
      {/* User Stats */}
      <div className="mt-6 md:mt-0">
        <div className="flex space-x-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{user.projects.length}</h3>
            <p className="text-gray-500 text-sm">Projects</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{user.likes}</h3>
            <p className="text-gray-500 text-sm">Likes</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{user.followers}</h3>
            <p className="text-gray-500 text-sm">Followers</p>
          </div>
        </div>
      </div>
    </div>
  );
}
