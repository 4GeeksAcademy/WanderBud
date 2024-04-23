import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Card, Button } from 'react-bootstrap';
import "../../../../styles/event.css";
import { Context } from "../../../store/appContext";

export const EventPublicView = () => {
    const { store, actions } = useContext(Context);
    const [buttonStates, setButtonStates] = useState({});
    const [buttonColors, setButtonColors] = useState({});

    useEffect(() => {
        let token = localStorage.getItem("token");
        actions.getPublicEvents(token);
    }, []);

    const handleRequestButton = async (id) => {
        await actions.requestJoinEvent(id);
        setButtonStates({ ...buttonStates, [id]: store.message });
    }

    return (
        <>
            <Row className="flex-column">
                {store.publicEvents.map((item, index) => (
                    <Col xs={12} className="mb-3" key={index}>
                        <Card>
                            <Card.Body>
                                <Row className="justify-content-between">
                                    <Col>
                                        <Card.Title>{item.name}</Card.Title>
                                    </Col>
                                    <Col>
                                        <Button
                                            variant="primary"
                                            onClick={() => handleRequestButton(item.id)}
                                        >
                                            {buttonStates[item.id] || "Join Us!"}
                                        </Button>
                                    </Col>
                                </Row>
                                <Card.Text>
                                    <p className="mt-3">{item.start_date}, {item.start_time}-{item.end_time}</p>
                                    <p className="mt-3">{item.location}</p>
                                </Card.Text>
                            </Card.Body>
                            <Card.Footer className="border"></Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>
        </>
    );
};