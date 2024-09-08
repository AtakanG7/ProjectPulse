import React, { useState, useEffect } from 'react';
import { Award, Trophy, Medal, ThumbsUp } from 'lucide-react';
import { toast } from "react-toastify";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((res) => res.json())
      .then((data) => setLeaderboard(data.data || []))
      .catch((err) => toast.error("Failed to fetch leaderboard"));
  }, []);

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return <Trophy className="text-yellow-400" size={24} />;
      case 1: return <Medal className="text-gray-400" size={24} />;
      case 2: return <Medal className="text-yellow-600" size={24} />;
      default: return null;
    }
  };

  return (
    <section className="relative from-gray-900 via-black to-gray-800 text-white py-20">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black opacity-30 -z-10" />

      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-300 flex items-center justify-center">
          <Award className="mr-3 text-indigo-400" size={36} />
          Project Leaderboard
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {leaderboard.map((project, index) => (
            <div 
              key={project._id} 
              className={`bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl border-2 transition-all duration-300 ease-in-out transform hover:-translate-y-1 ${
                index < 3 ? 'border-indigo-300' : 'border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-200 truncate flex-grow mr-2">{project.title}</h3>
                <div className="flex items-center justify-center w-10 h-10 bg-gray-700 rounded-full">
                  {getRankIcon(index) || (
                    <span className="text-lg font-semibold text-gray-200">#{index + 1}</span>
                  )}
                </div>
              </div>
              <p className="text-gray-400 mb-4 h-12 overflow-hidden">{project.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-indigo-400 font-semibold">
                  <ThumbsUp className="mr-2" size={18} />
                  {project.likes} Likes
                </div>
                <span className="text-sm text-gray-500">
                  by {project.author || 'Anonymous'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Leaderboard;
