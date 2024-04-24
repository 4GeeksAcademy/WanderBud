import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Card, Button } from 'react-bootstrap';
import "../../../../styles/event.css";
import { Context } from "../../../store/appContext";
import { Link } from "react-router-dom";

export const EventPublicView = () => {
    const { store, actions } = useContext(Context);
    const [buttonStates, setButtonStates] = useState({});
    console.log(store.publicEvents)

    useEffect(() => {
        let token = localStorage.getItem("token");
        actions.getPublicEvents(token);
    }, []);

    // const handleRequestButton = async (id) => {
    //     await actions.requestJoinEvent(id);
    //     setButtonStates({ ...buttonStates, [id]: store.message });
    // }

    return (
        <>
            <Row className="flex-column">
                {store.publicEvents.map((item, index) => (
                    <Col xs={12} className="mb-3" key={index}>
                        <Link to={`/event-view/${item.id}`}>
                            <Card className="h-100">
                                <Card.Body>
                                    <Row className="justify-content-between">
                                        <Col xs={9}>
                                            <Card.Title><h4>{item.name}</h4></Card.Title>
                                        </Col>
                                        <Col xs={3}>
                                            <Button
                                                variant="primary"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Evita que el clic se propague al Link
                                                    // Lógica para agregar a favoritos
                                                    // actions.addFavouriteEvent(item.id);
                                                }}


                                            >
                                                {"Add to favorites"}
                                            </Button>
                                        </Col>
                                        <Row className="mt-4 d-flex justify-content-between">
                                            <Col xs={2}>
                                                <Card.Title><img className="rounded-circle" src={item.owner.profile_image} style={{ width: "80px", height: "80px", objectFit: "cover" }} /></Card.Title>
                                            </Col>
                                            <Col xs={3} className="p-4">
                                                <Card.Title >{item.owner.name}</Card.Title>
                                            </Col>
                                            <Col xs={6} className="p-4">
                                                <Button

                                                    xs={3}
                                                    variant="primary"
                                                // onClick={() => actions.addFavouriteEvent(item.id)}

                                                >
                                                    {"Visit Profile today"}
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Row>
                                    <Card.Text>
                                        <label>Event Location:</label>
                                        <p>{item.location}</p>
                                        <label>Event Schedule:</label>
                                        <p>{item.start_date}, {item.start_time}-{item.end_time}</p>
                                        <label>Event description:</label>
                                        <p>{item.description}</p>
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer className="border"></Card.Footer>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </>
    );
};