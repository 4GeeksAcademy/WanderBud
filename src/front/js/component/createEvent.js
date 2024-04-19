import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import MapContainer from "./mapContainer";

export const CreateEvent = () => {
    const { store, actions } = useContext(Context);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [title, setTitle] = useState("");
    const [budget, setBudget] = useState(10);
    const [description, setDescription] = useState("");
    const [markerPosition, setMarkerPosition] = useState(null);
    const [typeEvent, setTypeEvent] = useState("");
    const [eventTypeId, setEventTypeId] = useState("");
    const [eventType, setEventType] = useState([]);
    const [gmt, setGmt] = useState(0);

    const handleMarkerDragEnd = (e) => {
        setMarkerPosition({
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
        });
    };

    useEffect(() => {
        actions.getEventTypes().then((types) => {
            const typesId = types.map((type) => type.id);
            const typesName = types.map((type) => type.name);
            setEventType(typesName);
            setEventTypeId(typesId);
        });
        setGmt(new Date().getTimezoneOffset() / 60);
    }, []);

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
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="col-md-4">
                    <label htmlFor="typeEvent">Event Type</label>
                    <select className="input-background" id="typeEvent" value={typeEvent} onChange={(e) => setTypeEvent(e.target.key)}>
                        <option value="" disabled>None</option>
                        {eventType.map((type, index) => (
                            <option className="select-text" key={index} value={type}>{type}</option>
                        ))}
                    </select>
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
                        defaultValue={10}
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="startDate">Start Date</label>
                    <input
                        type="datetime-local"
                        id="startDate"
                        className="input-background"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div className="col-md-6">
                    <label htmlFor="endDate">Start Date</label>
                    <input
                        type="datetime-local"
                        id="endDate"
                        className="input-background"
                        value={startDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <div className="col-md-12">
                    <MapContainer markerPosition={markerPosition} handleMarkerDragEnd={handleMarkerDragEnd} />
                </div>
                <div className="col-md-12">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        className="input-background w-100"
                        placeholder="Describe your event"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <button className="btn btn-primary col-md-11" onClick={() => actions.createEvent({ title, budget, startDate, endDate, description, markerPosition, eventTypeId, gmt })}>
                    Create Event
                </button>
            </div>
        </div>
    );
};
