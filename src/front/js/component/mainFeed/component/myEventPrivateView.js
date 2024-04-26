import React, { useState, useContext, useEffect } from "react";
import { Button, Col, Container, Row, Nav, Tab, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { Context } from "../../../store/appContext";
import LeftSidenav from "../../leftSidenav/leftSidenav";



export const MyEventPrivateView = () => {

  const { store, actions } = useContext(Context)
  const { event_id, owner_id } = useParams();

  useEffect(() => {
    actions.getOneEvent(event_id)
    actions.getPublicUserProfile(owner_id)
  }, [])

  console.log(store.publicEventData)
  console.log(store.userProfileData)

  const eventData = store.publicEventData
  const ownerData = store.userProfileData

  return (
    <Container fluid className='feed-container'>
      <Row className="scrollbar">
        <Col md={2} className="p-0 vh-100 sidenav sidenav-left">
          <LeftSidenav />
        </Col>
        <Row id="event-private">
          <Col md={8} className="p-5">
            <h1>{eventData.name}</h1>
            <Row>
              <Col md={6}>
                <img src={ownerData.profile_image} style={{ width: "150px", height: "150px", objectFit: "cover" }} />
              </Col>
              <Col md={6}>
                <h1>{ownerData.name}</h1>
              </Col>
            </Row>
            <Row>
              <Card.Text>
                <label>Event Location:</label>
                <p>{eventData.location}</p>
                <label>Event Schedule:</label>
                <p>{eventData.start_date}, {eventData.start_time}-{eventData.end_time}</p>
                <label>Event description:</label>
                <p>{eventData.description}</p>
              </Card.Text>
            </Row>
          </Col>
          <Col md={4} className="p-5 border-start">
            <h1>Mensajes</h1>
            <Button
                    variant="secondary"
                    onClick={() => navigate(`/update-event/${event_id}/${owner_id}`)}
                  >
                    {"Update Profile"}
                  </Button>
          </Col>
        </Row>
      </Row>
    </Container>
  );
}