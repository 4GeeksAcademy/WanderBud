import React from "react";
import { Button, Container, Col, Row, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaPlusCircle } from 'react-icons/fa'

const NavbarRight = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/create-event");
  };
  const RequestsCard = ({ username, eventname, img }) => (
    <Card.Body className="m-0 py-2 px-1 row w-100 request-container">
      <Col md={2} className="p-1">
        <img src={img} alt={username + "'s Photo"} className="rounded img-fluid" />
      </Col>
      <Col md={7} className="d-flex flex-column align-items-start object-fit-cover">
        <p className="m-0">{username}</p>
        <span className="m-0 text-muted">{eventname}</span>
      </Col>
      <Col md={3} className="d-flex align-items-center justify-content-end">
        <Button variant="success" className="rounded-circle me-1">A</Button>
        <Button variant="danger" className="rounded-circle">R</Button>
      </Col>
    </Card.Body>
  );

  return (
    <Container fluid className="h-100 d-flex align-items-start justify-content-center sidenav sidenav-right pt-4 px-4 m-0">
      <Row className="w-100">
        <Col md={12}>
          <Button
            variant="create"
            className="d-flex align-items-center justify-content-between w-100 rounded-pill m-0"
            onClick={handleClick}
          >Create New Event
            <FaPlusCircle className="ms-2" />
          </Button>
        </Col>
        <Col md={12} className="mt-4 pe-0">
          <Card className="request-container">
            <Card.Header>Join Requests</Card.Header>
            <RequestsCard username={"Bruno Murua"} eventname={"Dune 2 at the Cinema"} img={"https://media.licdn.com/dms/image/D4D03AQHepyIMxVGZ6A/profile-displayphoto-shrink_800_800/0/1703165598705?e=1719446400&v=beta&t=G3Qe-5D8glPTTi5Ovn20LKlI4no3y6qNuPucDm6ZaNU"} />
            <RequestsCard username={"Osian Lezcano"} eventname={"Alone in my House :("} img={"https://ca.slack-edge.com/T0BFXMWMV-U064ZSVS678-877ce3b7e9a7-512"} />
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NavbarRight;