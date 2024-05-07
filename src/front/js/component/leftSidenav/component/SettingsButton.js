import React from 'react';
import { Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SidebarButton from './SidebarButton';
import { FaCog } from 'react-icons/fa';

const SettingsButton = ({ settings, settingsBtn, handleSettings, settingsOptions, handlePath, handleLogout }) => (
    <Nav.Item className={settings + " mb-2"}>
        <Link to='#'>
            <Button variant="sidenav" className={settingsBtn} onClick={handleSettings}>
                <FaCog className="me-2" /> Settings
            </Button>
        </Link>
        <Nav.Item className={settingsOptions + " setting-option"}>
            <SidebarButton to='/settings/account' text='Account' w="100" variant={'navtab'} handlePath={handlePath} />
            <SidebarButton to='/settings/news' text='News' w="100" variant={'navtab'} handlePath={handlePath} />
            <SidebarButton to='/settings/privacy' text='Privacy' w="100" variant={'navtab'} handlePath={handlePath} />
            <SidebarButton to='/settings/about' text='About Us' w="100" variant={'navtab'} handlePath={handlePath} />
            <Button variant="logout" className='w-100' onClick={handleLogout}>
                Log out
            </Button>
        </Nav.Item>
    </Nav.Item>
);

export default SettingsButton;