import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { FaHome, FaUser, FaCog } from 'react-icons/fa'; // Importa los iconos de FontAwesome
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";

const LeftSidebar = ({ changeContent }) => {
    const handleItemClick = (option) => {
        changeContent(option);
    };

    return (
        <Navbar expand="lg" className="flex-column justify-content-between vh-100 sidenav sidenav-left p-0">
            <Navbar.Brand href="/" className="w-100 text-center m-0">
                <h1>WanderBud</h1>
            </Navbar.Brand>
            <Nav className="p-0 d-flex flex-column w-100 justify-content-start h-100">
                <Nav.Item className="w-100 ">
                    <Nav.Link href="/feed" onClick={() => handleItemClick('feed')} className='d-flex align-items-center btn btn-secondary rounded-0'>
                        <FaHome className="me-2" /> Feed
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item className="w-100">
                    <Nav.Link href="#" onClick={() => handleItemClick('profile')} className='d-flex align-items-center btn btn-secondary rounded-0 '>
                        <FaUser className="me-2" /> Profile
                    </Nav.Link>
                </Nav.Item>
            </Nav>
            <Nav className="m-0 w-100">
                <Nav.Item className="w-100 d-flex justify-content-start">
                    <Nav.Link href="#" onClick={() => handleItemClick('settings')} className='d-flex align-items-center w-100 btn btn-secondary rounded-0 ' style={{ borderTop: "#4072a0 solid 1px" }}>
                        <FaCog className="me-2" /> Settings
                    </Nav.Link>
                </Nav.Item>
            </Nav>
        </Navbar>
    );
};

export default LeftSidebar;



