import React from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaPlusCircle } from 'react-icons/fa'

const NavbarRight = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/create-event");
  };

  return (
    <Container fluid className="h-100 d-flex align-items-start justify-content-center sidenav sidenav-right pt-3">
      <Button
        variant="primary"
        className="d-flex align-items-center justify-content-center rounded-pill"
        onClick={handleClick}
      >Create New Event
        <FaPlusCircle className="ms-2" />
      </Button>
    </Container>
  );
};

export default NavbarRight;