import React, { useState, useContext, useEffect } from "react";
import { Button, Col, Container, Row, Nav, Tab, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { Context } from "../../../store/appContext";
import LeftSidenav from "../../leftSidenav/leftSidenav";
import RightSidenav from "../../rightSidenav/rightSidenav";


export const EventPrivateView = () => {

  const { store, actions } = useContext(Context)
  const { event_id, owner_id } = useParams();
  const [text, setText] = useState("")
  const [eventData, setEventData] = useState({})
  const [ownerData, setOwnerData] = useState({})
  const [requestMessage, setRequestMessage] = useState("")


  useEffect(() => {
    actions.getOneEvent(event_id).then((data) => {
      setEventData(data)
      setOwnerData(data.owner)
    })
  }, [])


  // const sendRequest = (event_id) => {
  //   ;
  //   alert("quiero tener amigos!!!")
  // }

  return (
    <Container fluid className='feed-container'>
      <Row className="vh-100 scrollbar">
        <Col md={2} className="p-0 vh-100 sidenav sidenav-left">
          <LeftSidenav />
        </Col>
        <Col md={6} className="p-0 h-100">
          <Row id="event-private">
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
                  // onClick={() => actions.addFavouriteEvent(item.id)}
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
                  <div className="dropdown">
                    <button type="button" className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside" style={{ width: "320px" }}>
                      {requestMessage ? "Pending" : "Event Request"}
                    </button>
                    <form className="dropdown-menu p-2" style={{ width: "312px", height: "300px" }}>
                      <div className="mb-3">
                        <label for="exampleDropdownFormEmail2" className="form-label">Contact the event creator</label>
                        <textarea type="text" className="form-control" id="exampleDropdownFormEmail2" style={{ height: "200px" }} onChange={(e) => setText(e.target.value)} value={text} />
                      </div>
                      <button type="submit" className="btn btn-primary" onClick={() => { actions.requestJoinEvent(event_id) }}>Send</button>
                    </form>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col md={4} className="p-0 vh-100 sidenav sidenav-right scrollbar">
          <RightSidenav />
        </Col>
      </Row>
    </Container>
  );
}