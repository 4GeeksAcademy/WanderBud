import React, { useRef, useEffect } from "react";
import { Col, Row } from "react-bootstrap";

export const LeftMessage = ({ member_img, message, hour }) => {

    return (
        <Row className="justify-content-start align-items-center m-0 my-1 pe-2 ps-0 w-100" style={{ height: "fit-content" }}>
            <Col md={1} className="d-flex p-2 justify-content-center">
                <img src={member_img || "https://via.placeholder.com/150"} alt="profile" className="rounded-circle w-100" style={{ objectFit: "cover", aspectRatio: "1" }} />
            </Col>
            <Col md={11} className="d-flex flex-column message-chat">
                <div className="container-card container-shadow rounded m-0 p-2 flex-grow-1">
                    <h5 className="m-0" style={{ fontSize: "1rem" }}>{message}</h5>
                </div>
                <div className="d-flex justify-content-start">
                    <span className="badge badge-pill badge-primary text-muted pb-0 ml-2 align-self-start">{hour}</span>
                </div>
            </Col>
        </Row>
    );
}