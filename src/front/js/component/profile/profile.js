import React from "react";
import { Container, Row, Col } from "react-bootstrap";

export const ProfileContainer = () => {
    return (
        <Container fluid>
            <Row>
                <Col md={12}>
                    <img src="https://via.placeholder.com/1920x1080" alt="Cover" className="img-fluid" />
                    <img src="https://via.placeholder.com/1080x1080" alt="Profile" className="img-thumbnail rounded-circle profile-img" />
                </Col>
                <Col md={12} className="container-card container-shadow pe-2">
                    <h1>Nombre de Usuario</h1>
                    <p>Descripción del usuario</p>
                </Col>
            </Row>
        </Container>
    )
}