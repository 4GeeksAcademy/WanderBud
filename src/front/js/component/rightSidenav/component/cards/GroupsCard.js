import React from "react";
import { Button, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const GroupCard = ({ eventname, owner_id, last_message, img, chatId, number_messages }) => {
    const navigate = useNavigate();

    return (
        <div className="m-0 py-2 px-1 row w-100 request-container">
            <Col md={2} className="p-1">
                <Button variant="request" onClick={(e) => navigate("/profile/" + owner_id)} className="p-0 h-100 ratio ratio-1x1">
                    <img src={img} alt={eventname + "'s Photo"} className="rounded img-fluid h-100" style={{ objectFit: "cover" }} />
                </Button>
            </Col>
            <Col md={7}>
                <Button variant="request" onClick={(e) => navigate("/event-chat/" + chatId)} className="w-100">
                    <p className="m-0">{eventname}</p>
                    <span className="m-0 text-muted">{last_message}</span>
                </Button>
            </Col>
            <Col md={3} className="d-flex align-items-center justify-content-end">
                <Button variant="reject" disabled className="rounded-square">{number_messages}</Button>
            </Col>
        </div>
    );
}