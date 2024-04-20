import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import MapContainer from "./mapContainer";

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
            window.location.href = process.env.FRONT_END_URL + "/feed";
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
        <div className="main-feed">
            <div className="row border-1 border-light border-bottom p-0 py-2 title-container">
                <div className="col-md-12">
                    <h1 className="text-center title-feed m-0">Create Event</h1>
                </div>
                <div className="col-md-8">
                    <label htmlFor="title">Event Title</label>
                    <input
                        type="text"
                        id="title"
                        className="input-background"
                        placeholder="Give a name to your Event"
                        value={title}
                        onChange={(e) => {
                            e.persist();
                            setEventData(prevState => ({ ...prevState, title: e.target.value }));
                        }}
                    />
                    {errors.title && <div className="text-danger">{errors.title}</div>}
                </div>
                <div className="col-md-4">
                    <label htmlFor="typeEvent">Event Type</label>
                    <select
                        className="input-background"
                        id="typeEvent"
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
                    </select>
                    {errors.typeEvent && <div className="text-danger">{errors.typeEvent}</div>}
                </div>

                <div className="col-md-12">
                    <label htmlFor="budget">Budget {budget}$</label>
                    <input
                        type="range"
                        id="budget"
                        className="input-range"
                        min="0"
                        max="100"
                        step={10}
                        value={budget}
                        onChange={(e) => {
                            e.persist();
                            setEventData(prevState => ({ ...prevState, budget: e.target.value }));
                        }}
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="startDate">Start Date</label>
                    <input
                        type="datetime-local"
                        id="startDate"
                        className="input-background"
                        defaultValue={new Date().toISOString().slice(0, 16)}
                        onChange={(e) => {
                            e.persist();
                            setEventData(prevState => ({ ...prevState, startDate: e.target.value }))
                            setEventData(prevState => ({ ...prevState, endDate: e.target.value }))
                                ;
                        }}
                    />
                    {errors.startDate && <div className="text-danger">{errors.startDate}</div>}
                </div>
                <div className="col-md-6">
                    <label htmlFor="endDate">End Date</label>
                    <input
                        type="datetime-local"
                        id="endDate"
                        className="input-background"
                        value={endDate}
                        onChange={(e) => {
                            e.persist();
                            setEventData(prevState => ({ ...prevState, endDate: e.target.value }));
                        }}
                    />
                    {errors.endDate && <div className="text-danger">{errors.endDate}</div>}
                </div>
                <div className="col-md-12">
                    <MapContainer selectedLocation={eventData.markerPosition} onLocationSelect={handleLocationSelect} />
                    {errors.markerPosition && <div className="text-danger">{errors.markerPosition}</div>}
                </div>
                <div className="col-md-12">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        className="input-background w-100"
                        placeholder="Describe your event"
                        value={description}
                        onChange={(e) => {
                            e.persist();
                            setEventData(prevState => ({ ...prevState, description: e.target.value }));
                        }}
                    />
                    {errors.description && <div className="text-danger">{errors.description}</div>}
                </div>
                <button className="btn btn-primary col-md-11" onClick={createEventHandler}>
                    Create Event
                </button>
            </div>
        </div>
    );
};
