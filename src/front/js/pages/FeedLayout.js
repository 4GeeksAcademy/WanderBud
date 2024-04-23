import React, { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import LeftSidenav from '../component/leftSidenav/leftSidenav';
import { Context } from '../store/appContext';
import RightSidenav from "../component/rightSidenav/rightSidenav";

export const FeedLayout = ({ children }) => {
    const { store, actions } = useContext(Context);

    const changeContent = (option) => {
        // Aquí puedes actualizar el estado o hacer cualquier acción necesaria
        console.log('Changing content to:', option);
    };

    return (
        <Container fluid className='feed-container'>
            <Row className="vh-100 scrollbar">
                <Col md={3} className="p-0 vh-100 sidenav sidenav-left">
                    <LeftSidenav changeContent={changeContent} />
                </Col>
                <Col md={5} className="p-0 h-100">
                    {children ? children : null}
                </Col>
                <Col md={4} className="p-0 vh-100 sidenav sidenav-right">
                    <RightSidenav />
                </Col>
            </Row>
        </Container>
    );
};
