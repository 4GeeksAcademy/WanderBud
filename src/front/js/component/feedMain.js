import React from "react";
import { Button, Col, Container, Row, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaPlusCircle } from 'react-icons/fa'
import { EventPublicView} from "./eventPublicView"


export const FeedMain = ({ children }) => {
    return (
        <Container fluid className="vh-100 d-flex align-items-start justify-content-center main-feed">
            <Row className="w-100">
                <Col md={12} className="mt-4 p-2 navtabs">
                    <Nav variant="pills" defaultActiveKey="/home" className="row">
                        <Nav.Item className="col-4">
                            <Button variant="navtab" className="w-100 active">
                                For you
                            </Button>
                        </Nav.Item>
                        <Nav.Item className="col-4">
                            <Button variant="navtab" className="w-100">
                                Joined
                            </Button>
                        </Nav.Item>
                        <Nav.Item className="col-4">
                            <Button variant="navtab" className="w-100">
                                My events
                            </Button>
                        </Nav.Item>
                    </Nav>
                </Col>
                    <EventPublicView />
            </Row>
        </Container>
    );
}