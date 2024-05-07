import React, { useContext } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import LeftSidenav from '../component/leftSidenav/leftSidenav';
import RightSidenav from "../component/rightSidenav/rightSidenav";
import { Context } from '../store/appContext';
import { Background } from './backgroundLoading';
import LeftSidenavMobile from '../component/leftSidenav/leftSidenavMobile';

export const FeedLayout = ({ children, to }) => {
    const { store, actions } = useContext(Context);
    const { authProfile, auth } = store;

    const changeContent = (option) => {
        // Aquí puedes actualizar el estado o hacer cualquier acción necesaria
        console.log('Changing content to:', option);
    };

    return (
        authProfile && auth ?
            <Container fluid className='feed-container m-0 p-0'>
                <Row className="feed-row scrollbar">
                    <Col md={3} lg={2} className="p-0 vh-100 sidenav sidenav-left">
                        <LeftSidenav changeContent={changeContent} />
                    </Col>
                    <Col md={9} lg={6} className="p-0 h-100 pb-4">
                        {children ? children : null}
                    </Col>
                    <Col md={0} lg={4} className="p-0 vh-100 sidenav sidenav-right scrollbar">
                        <RightSidenav />
                    </Col>
                </Row>
                <LeftSidenavMobile />
            </Container>
            :
            <Background to={to} />

    );
};
