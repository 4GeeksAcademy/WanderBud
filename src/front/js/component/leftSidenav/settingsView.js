import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import SidebarButton from './component/SidebarButton';
import { useNavigate } from 'react-router-dom';


const SettingsView = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };
    return (
        <Container fluid className="vh-100 d-flex align-items-start justify-content-center main-feed m-0 p-0">
            <Row className="w-100 px-2">
                <Col xs={12} className="mt-2 p-2 container-card container-shadow rounded">
                    <h1 className="text-center m-0">Settings</h1>
                </Col>
                <Col xs={12} className="mt-2 p-2 container-card container-shadow rounded ">
                    <SidebarButton to='/settings/account' text='Account' w="100" variant={'sidenav'} />
                    <SidebarButton to='/settings/news' text='News' w="100" variant={'sidenav'} />
                    <SidebarButton to='/settings/privacy' text='Privacy' w="100" variant={'sidenav'} />
                    <SidebarButton to='/settings/about' text='About Us' w="100" variant={'sidenav'} />
                    <Button variant="danger" className='w-100' onClick={handleLogout}>
                        Log out
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

export default SettingsView;
