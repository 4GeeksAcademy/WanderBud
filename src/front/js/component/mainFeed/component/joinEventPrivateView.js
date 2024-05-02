import React, { useState, useContext, useEffect } from "react";
import { Button, Col, Container, Row, Nav, Tab, Card } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { Context } from "../../../store/appContext";
import LeftSidenav from "../../leftSidenav/leftSidenav";
import RightSidenav from "../../rightSidenav/rightSidenav";


export const JoinEventPrivateView = () => {

  const { store, actions } = useContext(Context)
  const { event_id, owner_id } = useParams();
  const navigate = useNavigate();
  const [text, setText] = useState("")
  const [eventData, setEventData] = useState({})
  const [ownerData, setOwnerData] = useState({})
  const [eventStatus, setEventStatus] = useState("")

  useEffect(() => {
    actions.getJoinedPublicEvents();
    actions.getOneEvent(event_id).then((data) => {
      setEventData(data)
      setOwnerData(data.owner)
    })
  }, [])

  const handleRequestMessage = () => {
    if (store.joinedPublicEvents.length > 0) {
      for (const event of store.joinedPublicEvents) {
        if (event_id == event.id) {
          setEventStatus("I joined this event");
          break;
        }
      }
    } else {
      setEventStatus("");
    }
  };

  useEffect(() => {
    handleRequestMessage();
  }, [store.joinedPublicEvents]) // This effect runs whenever store.joinedPublicEvents changes

  const handleLeaveEvent = () => {
    actions.leaveEvent(event_id);
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
                      <p>{eventData.start_date + "\n"}, {eventData.end_date}</p>
                      <label>Event description:</label>
                      <p>{eventData.description}</p>
                      <label>Budget:</label>
                      <p>{eventData.budget_per_person} €</p>
                    </Card.Text>
                  </Col>
                  <Col md={6} className="d-flex justify-content-center">
                    <div className="dropdown">
                      <button type="button" className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside" style={{ width: "320px" }}>
                        {eventStatus ? "Leave the event" : "You left this event"}
                      </button>
                      <form className="dropdown-menu p-2" style={{ width: "312px", height: "300px" }}>
                        <div className="mb-3">
                          <label for="exampleDropdownFormEmail2" className="form-label">Contact the event creator</label>
                          <textarea type="text" className="form-control" id="exampleDropdownFormEmail2" style={{ height: "200px" }} onChange={(e) => setText(e.target.value)} value={text} />
                        </div>
                        <button type="submit" className="btn btn-primary" onClick={() => { handleLeaveEvent() }}>Send</button>
                      </form>
                    </div>
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

