import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Spinner } from 'react-bootstrap';
import "../../../../styles/event.css";
import { Context } from "../../../store/appContext";
import EventCard from "../../Events/eventCard";

export const EventCardHandler = ({ tab }) => {
    const { store, actions } = useContext(Context);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        let fetchEventsPromise;
        if (tab === "for-you") {
            fetchEventsPromise = actions.getPublicEvents(1);
        } else if (tab === "Joined") {
            fetchEventsPromise = actions.getJoinedPublicEvents();
        } else if (tab === "my-events") {
            fetchEventsPromise = actions.getMyPublicEvents();
        }

        fetchEventsPromise
            .then((res) => {
                console.log("Fetched events:" + tab + " ", res);
                setEvents(res); // Ensure events is an array even if API returns undefined
            })
            .catch((error) => {
                console.error("Error fetching events:", error);
                setEvents([]); // Set events to empty array on error
            })
            .finally(() => {
                setLoading(false);
            });
    }, [tab, store.loaded, store.favorites]);

    return (
        <Row className="flex-column">
            {loading && store.loaded && store.favorites !== null ? (
                <Col md={12} className="d-flex justify-content-center">
                    <Spinner animation="border" variant="primary" />
                </Col>
            ) : events.map((item, index) => (
                <Col md={12} key={index} className="d-flex justify-content-center">
                    <EventCard event={item} />
                </Col>
            ))}
        </Row>
    );
};
