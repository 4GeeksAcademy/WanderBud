import React, { useState, useEffect, useContext } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { FaHome, FaUser, FaBell, FaEnvelope } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import SidebarButton from './component/SidebarButton';
import SettingsButton from './component/SettingsButton';
import { Context } from '../../store/appContext';
import icon from '../../../img/WanderBud.png';

const LeftSidenav = ({ changeContent }) => {
    const { store, actions } = useContext(Context);
    const [path, setPath] = useState(null);
    const [settingsOptions, setSettingsOptions] = useState("w-100 d-flex align-content-end flex-column d-none");
    const [settings, setSettings] = useState("btn setting-container w-75 p-0");
    const [settingsBtn, setSettingsBtn] = useState("");
    const userID = store.userAccount.id;

    const navigate = useNavigate();
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
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <Navbar className="flex-column justify-content-between vh-100 p-0">
            <Navbar.Brand href="/feed" className="w-100 text-center m-0">
                <img src={icon} alt="logo" className="image-logo" />
            </Navbar.Brand>
            <Nav className="p-0 d-flex flex-column w-100 justify-content-start align-items-center h-100">
                <SidebarButton to='/feed' icon={<FaHome className='me-2' />} text='Feed' w="75" variant={'sidenav'} handlePath={handlePath} />
                <SidebarButton to={'/profile/' + userID} icon={<FaUser className='me-2' />} text='Profile' w="75" variant={'sidenav'} handlePath={handlePath} />
                <SidebarButton to={'/notifications' + userID} icon={<FaBell className='me-2' />} text='Notifications' w="75" variant={'sidenav'} handlePath={handlePath} className="md-show" />
                <SidebarButton to={'/messages' + userID} icon={<FaEnvelope className='me-2' />} text='Messages' w="75" variant={'sidenav'} handlePath={handlePath} className="md-show" />
                <SettingsButton settings={settings} settingsBtn={settingsBtn} handleSettings={handleSettings} settingsOptions={settingsOptions} handlePath={handlePath} handleLogout={handleLogout} />
                <SidebarButton to={'/create-event'} icon={<FaUser className='me-2' />} text='Create Event' w="75" variant={'create'} handlePath={handlePath} className="md-show rounded-pill" />
            </Nav>
        </Navbar>
    );
};

export default LeftSidenav;