import React from "react";
import { Button, Col } from "react-bootstrap";

export const GroupCard = ({ eventname, eventdate, img, chatId }) => (
    <div className="m-0 py-2 px-1 row w-100 request-container">
        <Col md={2} className="p-1">
            <img src={img} alt={eventname + "'s Photo"} className="rounded img-fluid" />
        </Col>
        <Col md={7}>
            <Button variant="request">
                <p className="m-0">{eventname}</p>
                <span className="m-0 text-muted">{eventdate}</span>
            </Button>
        </Col>
        <Col md={3} className="d-flex align-items-center justify-content-end">
            <Button variant="reject" disabled className="rounded-square">4</Button>
        </Col>
    </div>
);