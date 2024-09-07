import { useState, useEffect } from 'react';
import { Award } from 'lucide-react';
import { toast } from "react-toastify";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((data) => setLeaderboard(data.data || []))
      .catch((err) => toast.error("Failed to fetch leaderboard"));
  }, []);

  return (
    <section>
      <h2 className="text-3xl font-bold mb-6 text-blue-600 flex items-center">
        <Award className="mr-2" size={28} />
        Project Leaderboard
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {leaderboard.map((project, index) => (
          <div key={project._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-semibold text-blue-600">{project.title}</h3>
              <span className="text-2xl font-bold text-blue-500">#{index + 1}</span>
            </div>
            <p className="text-gray-700 mb-4">{project.description}</p>
            <p className="text-blue-500 font-semibold">Likes: {project.likes}</p>
          </div>
        ))}
      </div>
    </section>
  );
}