import React, { useState, useEffect } from 'react';
import { Nav, Navbar, Button } from 'react-bootstrap';
import { FaHome, FaUser, FaCog } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const LeftSidebar = ({ changeContent }) => {
    const [path, setPath] = useState(null);
    const [settingsOptions, setSettingsOptions] = useState("w-100 d-flex align-content-end flex-column d-none");
    const [settings, setSettings] = useState("btn setting-container w-75 p-0");
    const [settingsBtn, setSettingsBtn] = useState("");

    const location = useLocation();
    const handleItemClick = (option) => {
        changeContent(option);
    };
    useEffect(() => {
        setPath((location.pathname).toLocaleLowerCase());
    }
        , [location]);
    const handlePath = (option) => {
        if (path === option) {
            return 'active';
        } else {
            return '';
        }
    }
    const handleSettings = () => {
        if (settingsOptions.includes('d-none')) {
            setSettingsOptions('w-100 d-flex align-content-end flex-column active');
            setSettings('btn setting-container w-75 p-0 active');
            setSettingsBtn('active mb-2');
        } else {
            setSettingsOptions('w-100 d-flex align-content-end flex-column d-none');
            setSettings('btn setting-container w-75 p-0');
            setSettingsBtn('');
        }
    }


    const SidebarButton = ({ to, icon, text, w, variant }) => (
        <Nav.Item className={`w-${w} mb-2`}>
            <Link to={to}>
                <Button variant={variant} className={handlePath(to) + " justify-content-start"}>
                    {icon}
                    {text}
                </Button>
            </Link>
        </Nav.Item>
    );

    const SettingsButton = () => (
        <Nav.Item className={settings}>
            <Link to='#'>
                <Button variant="sidenav" className={settingsBtn} onClick={handleSettings}>
                    <FaCog className="me-2" /> Settings
                </Button>
            </Link>
            <Nav.Item className={settingsOptions + " setting-option"}>
                <SidebarButton to='/settings/account' text='Account' w="100" variant={'navtab'} />
                <SidebarButton to='/settings/notifications' text='Notifications' w="100" variant={'navtab'} />
                <SidebarButton to='/settings/privacy' text='Privacy' w="100" variant={'navtab'} />
                <SidebarButton to='/settings/security' text='Security' w="100" variant={'navtab'} />
                <Button variant="logout" className='w-100'>
                    Log out
                </Button>
            </Nav.Item>
        </Nav.Item>
    );

    return (
        <Navbar expand="lg" className="flex-column justify-content-between vh-100 sidenav sidenav-left p-0">
            <Navbar.Brand href="/" className="w-100 text-center m-0">
                <h1>WanderBud</h1>
            </Navbar.Brand>
            <Nav className="p-0 d-flex flex-column w-100 justify-content-start align-items-center h-100">
                <SidebarButton to='/feed' icon={<FaHome className='me-2' />} text='Feed' w="75" variant={'sidenav'} />
                <SidebarButton to='/profile' icon={<FaUser className='me-2' />} text='Profile' w="75" variant={'sidenav'} />
                <SettingsButton />
            </Nav>
        </Navbar>
    );
};

export default LeftSidebar;



