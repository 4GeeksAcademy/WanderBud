import React, { useState, useContext, useEffect } from "react";
import { Button, Col, Container, Row, Nav, Tab } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaPlusCircle } from 'react-icons/fa'
import { useParams } from "react-router-dom";
import { Context } from "../../../store/appContext";
import { EventPublicView } from "./eventPublicView";
import LeftSidenav from "../../leftSidenav/leftSidenav";
import RightSidenav from "../../rightSidenav/rightSidenav";




export const EventPrivateView = ({ children }) => {
    const [activeTab, setActiveTab] = useState('for-you')
    const {store, actions} = useContext(Context)
    const {id} = useParams();

    useEffect(() => {
		actions.getOneEvent(id);

	}, []);
    console.log(store.publicEventData)
    // const handleTabChange = (tab) => {
    //     setActiveTab(tab);
    // };

    return (
        <Container fluid className='feed-container'>
            <Row className="vh-100 scrollbar">
                <Col md={2} className="p-0 vh-100 sidenav sidenav-left">
                    <LeftSidenav changeContent={changeContent} />
                </Col>
                <Col md={6} className="p-0 h-100">
                    {children ? children : null}
                </Col>
                <Col md={4} className="p-0 vh-100 sidenav sidenav-right">
                    <RightSidenav />
                </Col>
            </Row>
        </Container>
    );
}