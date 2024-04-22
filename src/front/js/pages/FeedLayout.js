import React, { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import LeftSidebar from '../component/leftsidebar';
import { Context } from '../store/appContext';
import NavbarRight from "../component/NavbarRight";

export const FeedLayout = ({ children }) => {
    const { store, actions } = useContext(Context);

    const changeContent = (option) => {
        // Aquí puedes actualizar el estado o hacer cualquier acción necesaria
        console.log('Changing content to:', option);
    };

    return (
        <Container fluid className='feed-container'>
            <Row className="vh-100">
                <Col md={3} className="p-0 vh-100">
                    <LeftSidebar changeContent={changeContent} />
                </Col>
                <Col md={5} className="p-0 h-100">
                    {children ? children : null}
                </Col>
                <Col md={4} className="p-0 vh-100">
                    <NavbarRight />
                </Col>
            </Row>
        </Container>
    );
};
