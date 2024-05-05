import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import IconButton from '@mui/joy/IconButton';
import Add from '@mui/icons-material/Add';
import { FaHome, FaUser, FaBell, FaEnvelope } from 'react-icons/fa';

export default function LeftSidenavMobile() {
    const [value, setValue] = React.useState('home');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className='xs-show m-0 p-0'>
            <IconButton variant="soft"
                color="neutral"
                sx={{
                    position: "fixed",
                    bottom: "7%", right: "5%", zIndex: "1000", width: "3rem", aspectRatio: "1/1",
                    backgroundColor: "#189ab4",
                    color: "white",
                    borderRadius: "50%", boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)"
                }}>
                <Add sx={{ width: "100%" }} />
            </IconButton>
            <BottomNavigation sx={{ width: "100%", position: "fixed", bottom: "0", zIndex: "1000" }} value={value} onChange={handleChange}>
                <BottomNavigationAction
                    label="Home"
                    value="home"
                    icon={<FaHome />}
                />
                <BottomNavigationAction
                    label="Profile"
                    value="profile"
                    icon={<FaUser />}
                />
                <BottomNavigationAction
                    label="Notifications"
                    value="notifications"
                    icon={<FaBell />}
                />
                <BottomNavigationAction label="Messages" value="messages" icon={<FaEnvelope />} />
            </BottomNavigation>
        </div>
    );
}
