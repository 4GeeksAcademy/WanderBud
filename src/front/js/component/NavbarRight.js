import React from "react";

export const NavbarRight = ({ onCreateEvent }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black text-white">
      <div className="flex items-center">
        <span className="text-lg font-semibold mr-2">Create New Event</span>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg" onClick={onCreateEvent}>
          Create
        </button>
      </div>
    </div>
  );
};




