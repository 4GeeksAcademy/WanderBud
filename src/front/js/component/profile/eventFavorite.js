import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Card, Button } from 'react-bootstrap';
import '../../../styles/event.css';
import { Context } from '../../store/appContext';
import { Link, useNavigate, useParams } from "react-router-dom";

const EventFavorite = () => {
    const { store, actions } = useContext(Context);
    const [currentUserID, setCurrentUserID] = useState({});
    const navigate = useNavigate();
    const { userId } = useParams()
    console.log(store.favorites);
    useEffect(() => {

        actions.getFavorites(userId);  // Asegúrate de que esta acción esté definida y traiga los eventos favoritos del usuario.
    }, [userId,store.favorites]);

    const handleRemoveEvent = (event_id) => {
        actions.removeFavoriteEvent(event_id); 
        
      }
    console.log(userId);
    const favoriteEvents = store.favorites


    return (
        store.favorites !== null ?
            <>
                <Row className="flex-column">
                    {favoriteEvents.map((item, index) => (
                        
                        <Col xs={12} className="mb-3" key={index}>
                            <Card className="h-100">
                                <Card.Body>
                                    <Row className="justify-content-between">
                                        <Col xs={9}>
                                            <Link to={`/event-view/${item.id}/${item.user_id}`}>
                                                <Card.Title className="p-3"><h4>{item.event_info.name}</h4></Card.Title>
                                            </Link>
                                        </Col>
                                        <Col xs={3}>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                className="mt-3"
                                                onClick={() =>{handleRemoveEvent(item.event_info.id)}}
                                            >
                                                {"Remove favorites"}
                                            </Button>
                                        </Col>
                                        <Row id="event-userRow" className="mt-2 ms-1">
                                            <Col xs={2}>
                                                <Card.Title className="p-3"><img className="rounded-circle" src={item.user_info.profile_image} style={{ width: "100px", height: "100px", objectFit: "cover" }} /></Card.Title>
                                            </Col>
                                            <Col xs={4} id="event-cardUserName">
                                                <Card.Title>{item.user_info.name}</Card.Title>
                                            </Col>
                                            <Col xs={4} id="event-userButton">
                                                <Button
                                                    variant="secondary"
                                                    onClick={() => navigate(`/profile/${item.user_id}`)}
                                                >
                                                    {"Visit Profile"}
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Row>
                                    <Card.Text>
                                        <label>Event Location:</label>
                                        <p>{item.event_info.location}</p>
                                        <label>Event Schedule:</label>
                                        <p>{item.event_info.start_date}, {item.event_info.start_time}-{item.event_info.end_time}</p>
                                        <label>Event description:</label>
                                        <p>{item.event_info.description}</p>
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer className="border"></Card.Footer>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </>
            : null);
};
export default EventFavorite;