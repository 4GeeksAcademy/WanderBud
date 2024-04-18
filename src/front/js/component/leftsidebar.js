import React, { useState } from 'react';

const LeftSidebar = ({ changeContent }) => {
    const handleItemClick = (option) => {
        changeContent(option);
    };

    return (
        <div className="w-100 p-0 border border-1 border-light sidenav left">
            <ul className="nav flex-column">
                <li className="nav-item">
                    <a href="/feed" className="nav-link" onClick={() => handleItemClick('feed')}>
                        Feed
                    </a>
                </li>
                <li className="nav-item">
                    <a href="#" className="nav-link" onClick={() => handleItemClick('profile')}>
                        Profile
                    </a>
                </li>
                <li className="nav-item">
                    <a href="#" className="nav-link" onClick={() => handleItemClick('settings')}>
                        Settings
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default LeftSidebar;