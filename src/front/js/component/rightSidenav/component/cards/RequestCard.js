import React, { useContext } from "react";
import { Button, Col } from "react-bootstrap";
import { FiX, FiCheck } from "react-icons/fi";
import { Context } from "../../../../store/appContext";
import { useNavigate } from "react-router-dom";

export const RequestsCard = ({ username, member_id, eventname, img, chatId }) => {
    const navigate = useNavigate();
    const { actions } = useContext(Context);

    const handleAccept = (member_id) => {
        // Accept request
    }
    const handleReject = (member_id) => {
        // Reject request
    }


    return (
        <div className="m-0 py-2 px-1 row w-100 request-container">
            <Col md={2} className="p-1">
                <Button variant="request" onClick={(e) => navigate("/profile/" + member_id)} className="p-0 h-100 ratio ratio-1x1">
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
                <Button variant="accept" className="rounded-circle me-1" onClick={(e) => handleAccept(member_id)}><FiCheck /></Button>
                <Button variant="reject" className="rounded-circle" onClick={(e) => handleReject(member_id)}><FiX /></Button>
            </Col>
        </div>
    );
}