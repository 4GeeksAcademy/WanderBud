import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Card, Button } from 'react-bootstrap';
import "../../../../styles/event.css";
import { Context } from "../../../store/appContext";
import { Link, useNavigate } from "react-router-dom";
import EventCard from "../../Events/eventCard";

export const EventPublicView = () => {
    const { store, actions } = useContext(Context);
    const [currentUserID, setCurrentUSerID] = useState(store.userAccount.id);
    const navigate = useNavigate()
    useEffect(() => {
        actions.getPublicEvents();
    }, []);

    const filteredEvents = store.publicEvents.filter(item => item.owner.user_id !== currentUserID);
    return (
        <>
            <Row className="flex-column">
                {filteredEvents.map((item, index) => (
                    <Col md={12} key={index} className="d-flex justify-content-center">
                        <EventCard event={item} />
                    </Col>
                ))}
            </Row>
        </>
    );
};