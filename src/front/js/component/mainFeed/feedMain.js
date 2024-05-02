import React, { useState } from "react";
import { Button, Col, Container, Row, Nav, Tab } from "react-bootstrap";
import { EventCardHandler } from "./component/eventCardHandler";



export const FeedMain = ({ children }) => {

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <Container fluid className="vh-100 d-flex align-items-start justify-content-center main-feed">
            <Tab.Container defaultActiveKey="for-you">
                <Row className="w-100">
                    <Col md={12} className="mt-4 p-2 navtabs">
                        <Nav variant="pills" className="row">
                            <Nav.Item className="col-4">
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
                    <Tab.Content className="mt-2">
                        <Tab.Pane eventKey="for-you">
                            <EventCardHandler tab="for-you" />
                        </Tab.Pane>
                        <Tab.Pane eventKey="Joined">
                            <EventCardHandler tab="Joined" />
                        </Tab.Pane>
                        <Tab.Pane eventKey="my-events">
                            <EventCardHandler tab="my-events" />
                        </Tab.Pane>
                    </Tab.Content>
                </Row>
            </Tab.Container>
        </Container>
    );
}