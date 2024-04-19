import React from "react";
import { useNavigate } from "react-router-dom";

export const NavbarRight = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/create-event"); 
  };

  return (
    <div style={{ position: "absolute", top: 0, right: 0, left: 0, padding: "0px", backgroundColor: "black", color: "white", display: "flex", alignItems: "center" }}>
      <span style={{ fontSize: "1rem", fontWeight: "normal", marginLeft: "30px" }}>Create New Event</span>
      <button style={{ backgroundColor: "#0C0C0C", 
                      color: "white", 
                      fontWeight: "normal", 
                      borderRadius: "20px", 
                      padding: "6px 18px", 
                      marginLeft: "40px", 
                      border: "none", width: "auto", 
                      marginTop: "20px", }} onClick={handleClick}>
        Create
      </button>
    </div>
  );
};



