import React, { useState } from "react";
import { Button, Col, Container, Row, Nav, Tab } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaPlusCircle } from 'react-icons/fa'
import { EventPublicView } from "./eventPublicView";



export const FeedMain = ({ children }) => {
    const [activeTab, setActiveTab] = useState('for-you')

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <Container fluid className="vh-100 d-flex align-items-start justify-content-center main-feed">
            <Tab.Container defaultActiveKey="for-you">
                <Row className="w-100">
                    <Col md={12} className="mt-4 p-2 navtabs">
                        <Nav variant="pills" defaultActiveKey="for-you" className="row">
                            <Nav.Item className="col-4" defaultActiveKey="for-you">
                                <Nav.Link eventKey="for-you" className="btn btn-navtab w-100">
                                    For you
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="col-4">
                                <Nav.Link eventKey="Joined" className="btn btn-navtab w-100">
                                    Joined
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="col-4">
                                <Nav.Link eventKey="my-events" className="btn btn-navtab w-100">
                                    My events
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Tab.Content activeKey={activeTab} className="mt-2">
                        <Tab.Pane eventKey="for-you">
                            <EventPublicView />
                        </Tab.Pane>
                        <Tab.Pane eventKey="Joined">
                            <p>Content for Tab 2</p>
                        </Tab.Pane>
                        <Tab.Pane eventKey="my-events">
                            <p>Content for Tab 3</p>
                        </Tab.Pane>
                    </Tab.Content>
                </Row>
            </Tab.Container>
        </Container>
    );
}