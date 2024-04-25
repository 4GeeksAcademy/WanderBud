import React, { useState, useContext, useEffect } from "react";
import { Button, Col, Container, Row, Nav, Tab, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { Context } from "../../../store/appContext";
import LeftSidenav from "../../leftSidenav/leftSidenav";



export const EventPrivateView = () => {

  const { store, actions } = useContext(Context)
  const { id } = useParams();

  useEffect(() => {
    actions.getOneEvent(id)
    // actions.getPublicUserProfile(user_id)
  }, [])

  console.log(store.publicEventData)
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
              {/* <Row id="event-userRow" className="mt-2 ms-1">
                <Col xs={2}>
                  <Card.Title className="p-3"><img className="rounded-circle" src={d.profile_image} style={{ width: "100px", height: "100px", objectFit: "cover" }} /></Card.Title>
                </Col>
                <Col xs={4} id="event-cardUserName">
                  <Card.Title >{data.owner.name}</Card.Title>
                </Col>
                <Col xs={4} id="event-userButton">
                  <Button
                    variant="secondary"
                  // onClick={() => actions.addFavouriteEvent(item.id)}
                  >
                    {"Visit Profile"}
                  </Button>
                </Col>
              </Row> */}
            </Row>
          </Col>
          <Col md={4}>
            <h1>Mensajes</h1>
          </Col>
        </Row>
      </Row>
    </Container>
  );
}