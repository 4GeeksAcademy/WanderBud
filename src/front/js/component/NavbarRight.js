import React from "react";
import { useNavigate } from "react-router-dom";

export const NavbarRight = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/create-event");
  };

  return (
    <div className="vh-100 border border-1 border-light sidenav rightnav">
      <div className="d-flex flex-row justify-content-between">
        <span style={{ fontSize: "24px", fontWeight: "helvetica", marginLeft: "15px" }}>Create New Event</span>
        <button className="btn btn-outline-dark rounded-pill text-white border-white w-25 m-2" onClick={handleClick}>
          Create
        </button>
      </div>
    </div>
  );
};



