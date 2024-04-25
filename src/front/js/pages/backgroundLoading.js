import React, { useEffect } from "react";
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import img from "../../img/WanderBud.png";  // Import the image to be displayed in the background

export const Background = ({ to }) => {

    return (
        <Container fluid className="vh-100">
            <Row className="vh-100 justify-content-center align-items-center">
                <Col md={2} className="position-relative">
                    <Spinner animation="border" variant="light" className="w-100 h-100 ratio ratio-1x1" />
                    <img src={img} alt="WanderBud" className="position-absolute top-50 start-50 translate-middle w-75" style={{ zIndex: 10 }} />
                </Col>
            </Row>
        </Container>
    );
}