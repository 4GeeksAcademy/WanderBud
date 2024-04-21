import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Form, Button, Row, Col } from "react-bootstrap";
import MapContainer from "./mapContainer";
import "../../styles/event.css";

export const CreateEvent = () => {
    const { store, actions } = useContext(Context);
    const [eventData, setEventData] = useState({
        title: "",
        budget: 0,
        startDate: "",
        endDate: "",
        description: "",
        markerPosition: "",
        typeEvent: "",
        gmt: 0,
        errors: {}
    });

    const [eventType, setEventType] = useState([]);
    const [eventTypeId, setEventTypeId] = useState([]);

    const handleLocationSelect = (location) => {
        setEventData(prevState => ({
            ...prevState,
            markerPosition: location
        }));
    };

    const createEventHandler = async () => {
        const { title, budget, startDate, endDate, description, markerPosition, typeEvent, gmt } = eventData;
        const errors = {};
        setEventData(prevState => ({
            ...prevState,
            errors: {}
        }));

        if (!title.trim()) {
            errors.title = "Please enter event title";
        }

        if (!typeEvent) {
            errors.typeEvent = "Please select event type";
        }

        if (!startDate) {
            errors.startDate = "Please select start date";
        }

        if (!endDate) {
            errors.endDate = "Please select end date";
        } else if (new Date(endDate) <= new Date(startDate)) {
            errors.endDate = "End date must be after start date";
        }

        if (!description.trim()) {
            errors.description = "Please enter event description";
        }

        if (!markerPosition) {
            errors.markerPosition = "Please select event location";
        }

        if (Object.keys(errors).length > 0) {
            setEventData(prevState => ({
                ...prevState,
                errors: errors
            }));
            return;
        }

        try {
            const data = {
                name: title,
                budget,
                startDate: startDate,
                endDate: endDate,
                description,
                location: markerPosition,
                event_type_id: typeEvent,
                timezone: gmt
            };
            await actions.createEvent(data);
            alert("Event created successfully!");
            window.location.href = "/feed";
        } catch (error) {
            console.error("Error creating event:", error);
            alert("An error occurred while creating the event. Please try again later.");
        }
    };

    useEffect(() => {
        actions.getEventTypes().then((types) => {
            if (types) {
                const typesId = types.map((type) => type.id);
                const typesName = types.map((type) => type.name);
                setEventType(typesName);
                setEventTypeId(typesId);
            }
        });
        setEventData(prevState => ({
            ...prevState,
            gmt: new Date().getTimezoneOffset() / 60
        }));
    }, []);

    const { title, budget, startDate, endDate, markerPosition, description, errors } = eventData;

    return (
        <div className="create-event">
            <Row className="border-1 border-light border-bottom p-0 py-2 title-container">
                <Col md={12}>
                    <h1 className="text-center title-feed m-0">Create Event</h1>
                </Col>
                <Col md={8}>
                    <Form.Group controlId="title">
                        <Form.Label>Event Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Give a name to your Event"
                            value={title}
                            onChange={(e) => {
                                e.persist();
                                setEventData(prevState => ({ ...prevState, title: e.target.value }));
                            }}
                        />
                        {errors.title && <Form.Text className="text-danger">{errors.title}</Form.Text>}
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group controlId="typeEvent">
                        <Form.Label>Event Type</Form.Label>
                        <Form.Control
                            as="select"
                            value={eventData.typeEvent}
                            onChange={(e) => {
                                e.persist();
                                setEventData(prevState => ({ ...prevState, typeEvent: e.target.value }));
                            }}
                        >
                            <option value="">Select Event Type</option>
                            {eventType.map((type, index) => (
                                <option className="select-text" key={index} value={index}>
                                    {type}
                                </option>
                            ))}
                        </Form.Control>
                        {errors.typeEvent && <Form.Text className="text-danger">{errors.typeEvent}</Form.Text>}
                    </Form.Group>
                </Col>

                <Col md={12}>
                    <Form.Group controlId="budget">
                        <Form.Label>Budget {budget}$</Form.Label>
                        <Form.Control
                            type="range"
                            min="0"
                            max="100"
                            step={10}
                            value={budget}
                            onChange={(e) => {
                                e.persist();
                                setEventData(prevState => ({ ...prevState, budget: e.target.value }));
                            }}
                        />
                    </Form.Group>
                </Col>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId="startDate">
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                defaultValue={new Date().toISOString().slice(0, 16)}
                                onChange={(e) => {
                                    e.persist();
                                    setEventData(prevState => ({ ...prevState, startDate: e.target.value }))
                                    setEventData(prevState => ({ ...prevState, endDate: e.target.value }));
                                }}
                            />
                            {errors.startDate && <Form.Text className="text-danger">{errors.startDate}</Form.Text>}
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="endDate">
                            <Form.Label>End Date</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={endDate}
                                onChange={(e) => {
                                    e.persist();
                                    setEventData(prevState => ({ ...prevState, endDate: e.target.value }));
                                }}
                            />
                            {errors.endDate && <Form.Text className="text-danger">{errors.endDate}</Form.Text>}
                        </Form.Group>
                    </Col>
                </Row>
                <Col md={12}>
                    <MapContainer selectedLocation={eventData.markerPosition} onLocationSelect={handleLocationSelect} />
                    {errors.markerPosition && <Form.Text className="text-danger">{errors.markerPosition}</Form.Text>}
                </Col>
                <Col md={12}>
                    <Form.Group controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            placeholder="Describe your event"
                            value={description}
                            onChange={(e) => {
                                e.persist();
                                setEventData(prevState => ({ ...prevState, description: e.target.value }));
                            }}
                        />
                        {errors.description && <Form.Text className="text-danger">{errors.description}</Form.Text>}
                    </Form.Group>
                </Col>
                <Button variant="primary" onClick={createEventHandler}>
                    Create Event
                </Button>
            </Row>
        </div>
    );
};
