import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Col, Nav, Row, Spinner, Tab, Container } from "react-bootstrap";
import { ApplyCard } from "../rightSidenav/component/cards/ApplyCard";
import { RequestsCard } from "../rightSidenav/component/cards/RequestCard";
import { Context } from "../../store/appContext";


export const NotificationsView = () => {
    const { store, actions } = React.useContext(Context);
    const [key, setKey] = useState("requests");


    const NoRequests = ({ title }) => {
        return (
            <div className="d-flex justify-content-center align-items-center request-container">
                <h5 className="my-2">{title}</h5>
            </div>
        );
    };
    useEffect(() => {
        const interval = setInterval(() => {
            actions.getAppliedEvents();
            actions.getOwnerRequest();
        }, 1000);

        return () => clearInterval(interval);
    }, [store.appliedPublicEvents, store.ownerRequest]);


    const renderUserRequests = () => {
        if (store.appliedPublicEvents === null) return <div className="d-flex w-100 justify-content-center py-2"><Spinner animation="border" variant="info" /></div>;
        if (store.appliedPublicEvents.msg === "No applied events found" || store.appliedPublicEvents.lenght === 0) return <NoRequests title="No applied events found" />;
        return store.appliedPublicEvents.map((item, index) => (
            <ApplyCard key={index} username={`${item.owner_name} ${item.owner_last_name}`} eventname={item.name} img={item.owner_img} owner_id={item.owner_id} chatId={item.private_chat_id} event_id={item.id} />
        ));
    };

    const renderOwnerRequests = () => {
        if (store.ownerRequest === null) return <div className="d-flex w-100 justify-content-center py-2"><Spinner animation="border" variant="info" /></div>;
        if (store.ownerRequest.msg === "No owner request found" || store.ownerRequest.lenght === 0) return <NoRequests title="You have no requests" />;
        return store.ownerRequest.map((item, index) => (
            <RequestsCard key={index} username={`${item.member_name} ${item.member_last_name}`} eventname={item.name} img={item.member_img} member_id={item.member_id} chatId={item.private_chat_id} event_id={item.id} />
        ));
    };
    return (
        <Container fluid className="vh-100 d-flex align-items-start justify-content-center main-feed m-0 p-0">
            <Tab.Container defaultActiveKey="requests">
                <Row className="w-100 px-2">
                    <Col md={12} className="mt-2 p-2 navtabs">
                        <Nav variant="pills" className="row align-items-center">
                            <Nav.Item className="col-6">
                                <Nav.Link eventKey="requests" className="btn btn-navtab w-100" style={{ textWrap: "nowrap", textOverflow: "ellipsis" }}>
                                    Requests
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="col-6">
                                <Nav.Link eventKey="applications" className="btn btn-navtab w-100" style={{ textWrap: "nowrap", textOverflow: "ellipsis" }}>
                                    Applications
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Tab.Content className="mt-3">
                        <Tab.Pane eventKey="requests">
                            <Row className="w-100 p-0 m-0">
                                <Col md={12} className="px-0 container-card container-shadow rounded scrollbar">
                                    {renderUserRequests()}
                                </Col>
                            </Row>
                        </Tab.Pane>
                        <Tab.Pane eventKey="applications">
                            <Row className="w-100">
                                <Col md={12} className="px-0 container-card container-shadow rounded scrollbar">
                                    {renderOwnerRequests()}
                                </Col>
                            </Row>
                        </Tab.Pane>
                    </Tab.Content>
                </Row>
            </Tab.Container>
        </Container>
    );
}