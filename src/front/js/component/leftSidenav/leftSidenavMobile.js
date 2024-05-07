import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import IconButton from '@mui/joy/IconButton';
import Add from '@mui/icons-material/Add';
import { FaHome, FaUser, FaBell, FaEnvelope, FaCog } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function LeftSidenavMobile() {
    const [value, setValue] = React.useState('home');
    const navigate = useNavigate();
    const userId = localStorage.getItem('user_id');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className='xs-show m-0 p-0'>
            <IconButton variant="soft"
                color="neutral"
                onClick={() => { navigate('/create-event') }}
                sx={{
                    position: "fixed",
                    bottom: "10%", right: "5%", zIndex: "1000", width: "3rem", aspectRatio: "1/1",
                    backgroundColor: "#189ab4",
                    color: "white",
                    borderRadius: "50%", boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)"
                }}>
                <Add sx={{ width: "100%" }} />
            </IconButton>
            <BottomNavigation sx={{ width: "100%", position: "fixed", bottom: "0", zIndex: "1000", height: "8vh" }} value={value} onChange={handleChange}>
                <BottomNavigationAction
                    label="Home"
                    value="home"
                    icon={<FaHome />}
                    onClick={() => { navigate('/feed') }}
                />
                <BottomNavigationAction
                    label="Profile"
                    value="profile"
                    icon={<FaUser />}
                    onClick={() => { navigate('/profile/' + userId) }}
                />
                <BottomNavigationAction
                    label="Notifications"
                    value="notifications"
                    icon={<FaBell />}
                    onClick={() => { navigate('/notifications') }}
                />
                <BottomNavigationAction
                    label="Messages"
                    value="messages"
                    icon={<FaEnvelope />}
                    onClick={() => { navigate('/messages') }}
                />
                <BottomNavigationAction
                    label="Settings"
                    value="settings"
                    icon={<FaCog />}
                    onClick={() => { navigate('/settings') }}
                />
            </BottomNavigation>
        </div>
    );
}
