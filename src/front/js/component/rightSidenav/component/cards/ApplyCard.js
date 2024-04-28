import React, { useContext } from "react";
import { Button, Col } from "react-bootstrap";
import { FiX } from "react-icons/fi";
import { Context } from "../../../../store/appContext";
import { useNavigate } from "react-router-dom";

export const ApplyCard = ({ username, eventname, img, chatId, owner_id, event_id }) => {
    const { actions } = useContext(Context);
    const navigate = useNavigate();

    const handleLeave = (event_id) => {
        // Leave request
    }

    return (
        <div className="m-0 py-2 px-1 row w-100 request-container">
            <Col md={2} className="p-1">
                <Button variant="request" onClick={(e) => navigate("/profile/" + owner_id)} className="p-0 h-100 ratio ratio-1x1" >
                    <img src={img} alt={username + "'s Photo"} className="rounded img-fluid h-100" style={{ objectFit: "cover" }} />
                </Button>
            </Col>
            <Col md={7}>
                <Button variant="request" className="w-100" onClick={(e) => navigate("/request-chat/" + chatId)}>
                    <p className="m-0">{username}</p>
                    <span className="m-0 text-muted">{eventname}</span>
                </Button>
            </Col>
            <Col md={3} className="d-flex align-items-center justify-content-end">
                <Button variant="reject" className="rounded-circle" onClick={(e) => handleLeave(event_id)}><FiX /></Button>
            </Col>
        </div>
    );
}