import React from "react";
import { useNavigate } from "react-router-dom";

export const NavbarRight = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/create-event"); 
  };

  return (
    <div style={{ position: "absolute", top: 0, right: 0, left: 0, padding: "0px", color: "white", display: "flex", alignItems: "center" }}>
      <span style={{ fontSize: "1rem", fontWeight: "helvetica", marginLeft: "15px",fontSize:"20px" }}>Create New Event</span>
      <button style={{ backgroundColor: "#1a1f25", 
                      color: "white", 
                      fontWeight: "helvetica", 
                      borderRadius: "20px", 
                      padding: "4px 10px", 
                      marginLeft: "40px", 
                      border: "1px solid white", width: "auto", 
                      marginTop: "12px",fontSize:"20px" }} onClick={handleClick}>
        Create
      </button>
    </div>
  );
};



