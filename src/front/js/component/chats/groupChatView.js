import React, { useContext, useEffect } from "react";
import { GroupCard } from "../rightSidenav/component/cards/GroupsCard";
import Spinner from "react-bootstrap/Spinner";
import { Context } from "../../store/appContext";
import { Col, Container, Row, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export const GroupChatView = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const NoRequests = ({ title }) => {
        return (
            <div className="d-flex justify-content-center align-items-center request-container">
                <h5 className="my-2">{title}</h5>
            </div>
        );
    };
    useEffect(() => {
        const interval = setInterval(() => {
            actions.getGroupChat();
        }, 1000);

        return () => clearInterval(interval);
    }, [store.groupChat]);
    const renderGroupChats = () => {
        if (store.groupChat === null) return <div className="d-flex w-100 justify-content-center py-2"><Spinner animation="border" variant="info" /></div>;
        if (store.groupChat.msg === "No group chat found" || store.groupChat.lenght === 0) return <NoRequests title="You haven't joined any groups" />;
        return store.groupChat.map((item, index) => (
            <GroupCard key={index} eventname={item.event_name} owner_id={item.owner_id} last_message={item.sender_last_message === "System" ? item.last_message : item.sender_last_message + ": " + item.last_message} img={item.owner_img} chatId={item.id} number_messages={item.number_of_messages} />
        ));
    }

    return (
        <Container fluid className="vh-100">
            <Row className="px-2 py-0">
                <Col xs={12} className="px-2 mb-3 mt-1 container-card container-shadow rounded d-flex justify-content-between" style={{
                    position: "sticky",
                    top: "0",
                    zIndex: "100",
                }}>
                    <Button variant="request" className="p-0" onClick={(e) => { navigate(-1) }}>
                        <h3><FaArrowLeft /></h3>
                    </Button>
                    <h2 className="text-center">
                        Group Chats
                    </h2>
                    <Button variant="request" className="p-0 hidden" onClick={(e) => { navigate(-1) }}>
                        <h3><FaArrowLeft /></h3>
                    </Button>
                </Col>
                <Col xs={12} className="px-0 container-card container-shadow rounded scrollbar">
                    {renderGroupChats()}
                </Col>
            </Row>
        </Container>
    );
};
