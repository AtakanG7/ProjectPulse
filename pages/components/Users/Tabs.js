export default function Tabs({ selectedTab, setSelectedTab }) {
    return (
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
    );
  }
  