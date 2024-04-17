import React from "react";

const NavbarRight = ({ onCreateEvent }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black text-white">
      <div className="flex flex-col items-center justify-center">
        <span className="text-lg font-semibold mb-2">Create New Event</span>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded" onClick={onCreateEvent}>
          Create
        </button>
      </div>
    </div>
  );
};

export default NavbarRight;


