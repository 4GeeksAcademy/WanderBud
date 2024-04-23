import React, { useState } from "react";
import { Button, Container, Col, Row, Card, Accordion } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaPlusCircle } from 'react-icons/fa'
import { FiX, FiCheck } from "react-icons/fi";
import { CreateEventButton } from "./component/CreateEventButton";
import { SideAccordion } from "./component/container/SideAccordion";
import { MessageContainer } from "./component/container/messageContainer";

const RightSidenav = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/create-event");
  };

  const handleRequestChat = (chatId) => {
    // navigate("/request-chat/" + chatId);
  };

  return (
    <Container>
      <Row>
        <Col md={12}>
          <CreateEventButton handleClick={handleClick} />
          <SideAccordion
            extraClass="overflow-hidden"
            title="Join Requests"
            collapsed={false}
          />
          <SideAccordion
            extraClass="overflow-hidden"
            title="Apply Requests"
            collapsed={false}
          />
        </Col>
        <Col md={12} className="message-container p-0 m-0">
          <MessageContainer />
        </Col>
      </Row>
    </Container>
  );
}

export default RightSidenav;