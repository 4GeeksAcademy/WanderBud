import React from 'react';
import { FaHome, FaUser, FaCog } from 'react-icons/fa'; // Importa los iconos de FontAwesome
import { IconContext } from 'react-icons'; // Importa IconContext para configurar el contexto de los iconos

const LeftSidebar = ({ changeContent }) => {
    const handleItemClick = (option) => {
        changeContent(option);
    };

    return (
        <div className="d-flex flex-column h-100">
            <div className="w-100 p-0 border border-1 border-light sidenav left">
                <ul className="nav flex-column">
                    <li className="nav-item border-bottom">
                        <a href="/feed" className="nav-link" onClick={() => handleItemClick('feed')} style={{ fontSize: '24px', color: 'white', fontFamily: 'Helvetica' }}>
                            <IconContext.Provider value={{ className: 'me-2' }}>
                                <FaHome /> Feed
                            </IconContext.Provider>
                        </a>
                    </li>
                    <li className="nav-item border-bottom">
                        <a href="#" className="nav-link" onClick={() => handleItemClick('profile')} style={{ fontSize: '24px', color: 'white', fontFamily: 'Helvetica' }}>
                            <IconContext.Provider value={{ className: 'me-2' }}>
                                <FaUser /> Profile
                            </IconContext.Provider>
                        </a>
                    </li>
                </ul>
            </div>
            <div className="mt-auto">
                <ul className="nav flex-column">
                    <li className="nav-item border-top border-1 border-light">
                        <a href="#" className="nav-link" onClick={() => handleItemClick('settings')} style={{ fontSize: '24px', color: 'white', fontFamily: 'Helvetica' }}>
                            <IconContext.Provider value={{ className: 'me-2' }}>
                                <FaCog /> Settings
                            </IconContext.Provider>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default LeftSidebar;




