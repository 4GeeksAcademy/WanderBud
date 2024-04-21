import React, { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import LeftSidebar from '../component/leftsidebar';
import { Context } from '../store/appContext';
import NavbarRight from "../component/NavbarRight";
import { EventPublicView } from "../component/eventPublicView";

export const FeedLayout = ({ children }) => {
    const { store, actions } = useContext(Context);

    const changeContent = (option) => {
        // Aquí puedes actualizar el estado o hacer cualquier acción necesaria
        console.log('Changing content to:', option);
    };

    return (
        <Container fluid>
            <Row className="vh-100">
                <Col md={3} className="p-0 vh-100">
                    <LeftSidebar changeContent={changeContent} />
                </Col>
                <Col md={6} className="p-0 h-100">

                </Col>
                <Col md={3} className="p-0 vh-100">
                    <NavbarRight />
                </Col>
            </Row>
        </Container>
    );
};
