import React, { useState, useContext, useEffect } from "react";
import { Button, Col, Container, Row, Nav, Tab, Card } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { Context } from "../../../store/appContext";
import LeftSidenav from "../../leftSidenav/leftSidenav";
import RightSidenav from "../../rightSidenav/rightSidenav";



export const MyEventPrivateView = () => {

  const { actions } = useContext(Context)
  const { event_id } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({})
  const [ownerData, setOwnerData] = useState({})
  console.log(event_id)
  console.log(eventData)
  console.log(ownerData)

  useEffect(() => {
    actions.getOneEvent(event_id).then((data) => {
      setEventData(data)
      setOwnerData(data.owner)
    })
  }, [])

  const handleDeleteEvent = (event_id) => {
    actions.deleteEvent(event_id); 
    navigate("/feed")
  }

  return (
    <Container fluid className='feed-container'>
      <Row className="vh-100 scrollbar">
        <Col md={2} className="p-0 vh-100 sidenav sidenav-left">
          <LeftSidenav />
        </Col>
        <Col md={6} className="p-0 h-100">
          {eventData && ownerData ?
            (<Row id="event-private">
              <Col md={12} className="p-5 ">
                <h1 className="text-center">{eventData.name}</h1>
                <Row id="event-userRow" className="mt-4 ms-1">
                  <Col xs={2}>
                    <Card.Title className="p-3"><img className="rounded-circle" src={ownerData.profile_image} style={{ width: "100px", height: "100px", objectFit: "cover" }} /></Card.Title>
                  </Col>
                  <Col xs={4} id="event-cardUserName">
                    <Card.Title >{ownerData.name}</Card.Title>
                  </Col>
                  <Col xs={4} id="event-userButton">
                    <Button
                      variant="secondary"
                      onClick={() => navigate(`/profile/${ownerData.user_id}`)}
                    >
                      {"Visit Profile"}
                    </Button>
                  </Col>
                </Row>
                <Row className="mt-5">
                  <Col md={6}>
                    <Card.Text>
                      <label>Event Location:</label>
                      <p>{eventData.location}</p>
                      <label>Event Schedule:</label>
                      <p>{eventData.start_date}, {eventData.start_time}-{eventData.end_time}</p>
                      <label>Event description:</label>
                      <p>{eventData.description}</p>
                    </Card.Text>
                  </Col>
                  <Col md={6} className="d-flex justify-content-center">
                    <Button
                      variant="primary"
                      onClick={() => navigate(`/update-event/${event_id}`)}
                    >
                      {"Edit Event"}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() =>{handleDeleteEvent(event_id)}}
                    >
                      {"Delete Event"}
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
            ) : (<div>Loading....</div>)}
        </Col>
        <Col md={4} className="p-0 vh-100 sidenav sidenav-right scrollbar">
          <RightSidenav />
        </Col>
      </Row>
    </Container>
  );
}