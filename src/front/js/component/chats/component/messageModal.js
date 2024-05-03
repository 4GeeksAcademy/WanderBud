import React from "react";
import { Modal, Button, Spinner, Col } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

export const MessageModal = ({ handleClose, show, message, group_chat_id }) => {
    const navigate = useNavigate();
    return (

        <Modal show={show} onHide={() => { (message === "Accepted" ? navigate("/event-chat/" + group_chat_id) : navigate("/feed")); handleClose }}>
            <Modal.Header closeButton>
                <Modal.Title className="w-100 m-0"><h3 className="m-0">{message === "Accepted" ? "Member Accepted" : "Member Rejected"}</h3></Modal.Title>
            </Modal.Header>
            <Modal.Body className="">
                {message === "Accepted" ? "You has been Accepted" : "You has been Rejected"}
            </Modal.Body>
            <Modal.Footer>
                <Button variant={message === "Accepted" ? "primary" : "google"} onClick={() => { message === "Accepted" ? navigate("/event-chat/" + group_chat_id) : navigate("/feed") }}>
                    {message === "Accepted" ? "Go to Chat" : "Close"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}