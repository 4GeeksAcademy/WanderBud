import React from "react";
import { Col, Row } from "react-bootstrap";

export const RightMessage = ({ member_img, message, hour }) => (
    <Row className="justify-content-end align-items-end m-0 my-1 pe-0 ps-2" style={{ height: "fit-content" }}>
        <Col md={11} className="d-flex flex-column align-items-end message-chat">
            <div className="container-card container-shadow rounded m-0 p-2 flex-grow-1" style={{ width: "max-content", maxWidth: "100%" }}>
                <h5 className="m-0" style={{ fontSize: "1rem", wordWrap: "break-word", textAlign: "left" }}>{message}</h5>
            </div>
            <div className="d-flex justify-content-start">
                <span className="badge badge-pill badge-primary text-muted pb-0 ml-2 align-self-end">{hour}</span>
            </div>
        </Col>
        <Col md={1} className="d-flex p-2 justify-content-center">
            <img src={member_img || "https://via.placeholder.com/150"} alt="profile" className="rounded-circle w-100 " style={{ objectFit: "cover", aspectRatio: "1" }} />
        </Col>
    </Row>
);