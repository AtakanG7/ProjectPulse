import React from 'react';
import { signIn } from "next-auth/react";
import { ChevronRight } from "lucide-react";
import URLPreviewBox from "./GithubLink";

const ActionComponent = ({ isRegistered, username }) => {
  return (
    <div className="mt-1 flex flex-col items-center">
      {!isRegistered && <URLPreviewBox />}
      {isRegistered && <URLPreviewBox username={username} />}

      {isRegistered ? (
        <p className="text-2xl font-semibold mt-6 text-center text-blue-800">
          Achievement Unlocked: Showcased Projects
        </p>
      ) : (
        <button
          onClick={() => signIn('github')}
          className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-3 rounded-full text-lg font-bold mt-4 flex items-center"
        >
          Create Your Profile
          <ChevronRight className="ml-2" />
        </button>
      )}
    </div>
  );
};

export default ActionComponent;