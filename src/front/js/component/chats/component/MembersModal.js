import React from "react";
import { Modal, Button, Spinner, Col } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

export const MembersModal = ({ handleClose, show, members }) => {
    const navigate = useNavigate();
    const Member = ({ member }) => {
        return (
            <div className="m-0 py-2 px-1 row w-100 request-container">
                <Col md={2} className="p-1">
                    <Button variant="request" onClick={(e) => navigate("/profile/" + member.user_id)} className="p-0 h-100 ratio ratio-1x1" >
                        <img src={member.profile_image} alt={member.name + " " + member.last_name + "'s Photo"} className="rounded-circle img-fluid h-100" style={{ objectFit: "cover" }} />
                    </Button>
                </Col>
                <Col md={10}>
                    <Button variant="request" className="w-100" onClick={(e) => navigate("/profile/" + member.user_id)}>
                        <p className="m-0">{member.name + " " + member.last_name}</p>
                        <span className="m-0 text-muted">{member.location}</span>
                    </Button>
                </Col>
            </div>
        );
    }

    const RenderMembers = () => {
        if (members === null) return <div className="d-flex w-100 justify-content-center py-2"><Spinner animation="border" variant="info" /></div>;
        if (members.msg === "No members found" || members.lenght === 0) return <NoRequests title="No members found" />;
        return members.map((member, index) => (
            <Member key={index} member={member} />
        ));
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title className="w-100 m-0"><h3 className="m-0">Members</h3></Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-0">
                <RenderMembers />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="google" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}