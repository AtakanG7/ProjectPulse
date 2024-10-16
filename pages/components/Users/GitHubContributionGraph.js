import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const GitHubContributionGraph = ({ username }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(`/api/users/github/contributions/${username}`)
      .then(response => response.text())
      .then(data => {
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching GitHub contributions:', error);
        setIsLoading(false);
      });
  }, [username]);

  const renderSkeleton = () => (
    <svg width="100%" height="100%" viewBox="0 0 722 112" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
      <style>
        {`
          .contribution { shape-rendering: geometricPrecision; }
          .month-label { font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"; font-size: 9px; fill: #7e7e7e; }
          .day-label { font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"; font-size: 9px; fill: #7e7e7e; }
        `}
      </style>
      {/* Month labels */}
      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => (
        <text 
          key={month}
          x={15 + index * 50} 
          y="10" 
          className="month-label" 
          transform={`rotate(-45, ${15 + index * 50}, 10)`}
          textAnchor="start"
          dominantBaseline="hanging"
        >
          {month}
        </text>
      ))}
      {/* Day labels */}
      {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((day, index) => (
        day && <text key={day} x="0" y={index * 13 + 35} className="day-label" textAnchor="start">{day}</text>
      ))}
      {/* Contribution cells */}
      {[...Array(53)].map((_, week) => (
        [...Array(7)].map((_, day) => {
          const opacity = Math.random() * 0.15;
          return (
            <rect 
              key={`${week}-${day}`}
              x={week * 13 + 15} 
              y={day * 13 + 20} 
              width="10" 
              height="10" 
              fill={`rgba(57, 211, 83, ${opacity})`} 
              className="contribution"
              rx="2" 
              ry="2"
            />
          );
        })
      ))}
    </svg>
  );

  if (isLoading) {
    return renderSkeleton();
  } else {
    return (
      <>
        <div 
          className="w-full h-[200px] md:h-auto md:max-h-[400px] cursor-pointer overflow-hidden"
          onClick={openModal}
        >
          <img 
            src={`/api/users/github/contributions/${username}`} 
            alt={`${username}'s GitHub contributions`}
            className="w-full h-full object-cover md:object-contain"
          />
        </div>
  
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-screen overflow-auto">
              <div className="flex justify-end p-2">
                <button 
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label="Close"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-4">
                <img 
                  src={`/api/users/github/contributions/${username}`} 
                  alt={`${username}'s GitHub contributions`}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
};

export default GitHubContributionGraph;