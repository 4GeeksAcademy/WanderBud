import React from 'react';
import { Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const SidebarButton = ({ to, icon, text, w, variant, handlePath }) => (
    <Nav.Item className={`w-${w} mb-2`}>
        <Link to={to}>
            <Button variant={variant} className={handlePath(to) + " justify-content-start"}>
                {icon}
                {text}
            </Button>
        </Link>
    </Nav.Item>
);

export default SidebarButton;
