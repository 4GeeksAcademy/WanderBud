import React from 'react';
import { Nav, Navbar, Button } from 'react-bootstrap';
import { FaHome, FaUser, FaCog } from 'react-icons/fa'; // Importa los iconos de FontAwesome
import { Link } from 'react-router-dom';

const LeftSidebar = ({ changeContent }) => {
    const handleItemClick = (option) => {
        changeContent(option);
    };

    return (
        <Navbar expand="lg" className="flex-column justify-content-between vh-100 sidenav sidenav-left p-0">
            <Navbar.Brand href="/" className="w-100 text-center m-0">
                <h1>WanderBud</h1>
            </Navbar.Brand>
            <Nav className="p-0 d-flex flex-column w-100 justify-content-start align-items-center h-100">
                <Nav.Item className='w-75 mb-2'>
                    <Link to='/feed'>
                        <Button variant="sidenav" className=''>
                            <FaHome className="me-2" /> Feed
                        </Button>
                    </Link>
                </Nav.Item>
                <Nav.Item className='w-75 mb-2'>
                    <Link to='/profile'>
                        <Button variant="sidenav">
                            <FaUser className="me-2" /> Profile
                        </Button>
                    </Link>
                </Nav.Item>
                <Nav.Item className='btn setting-container active w-75 mb-2 p-0 '>
                    <Link to='/settings'>
                        <Button variant="sidenav" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne" className='active mb-2'>
                            <FaCog className="me-2" /> Settings
                        </Button>
                    </Link>
                    <Nav.Item className='w-100 d-flex align-content-end flex-column'>
                        <Button variant="sidenav" className='w-100 mb-2'>
                            Account
                        </Button>
                        <Button variant="sidenav" className='w-100 mb-2'>
                            Notifications
                        </Button>
                        <Button variant="sidenav" className='w-100 mb-2'>
                            Privacy
                        </Button>
                        <Button variant="sidenav" className='w-100 mb-2'>
                            Security
                        </Button>
                        <Button variant="logout" className='w-100'>
                            Log out
                        </Button>
                    </Nav.Item>
                </Nav.Item>
            </Nav>
        </Navbar>
    );
};

export default LeftSidebar;



