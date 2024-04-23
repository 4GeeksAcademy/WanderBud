import React from "react";
import { Button, Col } from "react-bootstrap";
import { FiX } from "react-icons/fi";

export const ApplyCard = ({ username, eventname, img, chatId }) => (
    <div className="m-0 py-2 px-1 row w-100 request-container">
        <Col md={2} className="p-1">
            <img src={img} alt={username + "'s Photo"} className="rounded img-fluid" />
        </Col>
        <Col md={7}>
            <Button variant="request">
                <p className="m-0">{username}</p>
                <span className="m-0 text-muted">{eventname}</span>
            </Button>
        </Col>
        <Col md={3} className="d-flex align-items-center justify-content-end">
            <Button variant="reject" className="rounded-circle"><FiX /></Button>
        </Col>
    </div>
);