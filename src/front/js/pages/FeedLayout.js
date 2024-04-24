import React, { useContext } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import LeftSidenav from '../component/leftSidenav/leftSidenav';
import { Context } from '../store/appContext';
import RightSidenav from "../component/rightSidenav/rightSidenav";
import img from "../../img/WanderBud.png";
import { Background } from './backgroundLoading';

export const FeedLayout = ({ children, to }) => {
    const { store, actions } = useContext(Context);
    const { authProfile, auth } = store;

    const changeContent = (option) => {
        // Aquí puedes actualizar el estado o hacer cualquier acción necesaria
        console.log('Changing content to:', option);
    };

    return (
        authProfile && auth ?
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
            :
            <Background to={to} />

    );
};
