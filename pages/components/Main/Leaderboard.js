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
      case 1: return <Medal className="text-gray-500" size={24} />;
      case 2: return <Medal className="text-yellow-600" size={24} />;
      default: return null;
    }
  };

  return (
    <section className="bg-gradient-to-br py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-indigo-700 flex items-center justify-center">
          <Award className="mr-3 text-blue-600" size={32} />
          Project Leaderboard
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {leaderboard.map((project, index) => (
            <div 
              key={project._id} 
              className={`bg-white p-6 rounded-lg shadow-lg transition-transform duration-300 ${
                index < 3 ? 'border-l-4 border-indigo-500' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 truncate flex-grow mr-2">{project.title}</h3>
                <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-full">
                  {getRankIcon(index) || (
                    <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                  )}
                </div>
              </div>
              <p className="text-gray-600 mb-4 h-12 overflow-hidden text-sm">
                {project.description.length > 100 ? (
                  `${project.description.slice(0, 100)}...`
                ) : project.description}
              </p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-blue-600 font-medium">
                  <ThumbsUp className="mr-1" size={16} />
                  {project.likes} Likes
                </div>
                <span className="text-gray-500">
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
