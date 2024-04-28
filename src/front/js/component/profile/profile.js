import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '../../store/appContext';
import { Container, Row, Col, Spinner, Button, ButtonGroup, Tab, Nav } from 'react-bootstrap';
import { FaBirthdayCake, FaMapMarkerAlt } from "react-icons/fa";
import { createClient } from 'pexels';
import { parse } from 'date-fns';

const Profile = () => {
    const { store, actions } = useContext(Context);
    const [loaded, setLoaded] = useState(false);
    const [profileImgH, setProfileImgH] = useState(0);
    const [page, setPage] = useState(0);
    const [profile, setProfile] = useState({});
    const [cover, setCover] = useState('https://via.placeholder.com/1000');
    const [activeTab, setActiveTab] = useState('my-events');
    const client = createClient(process.env.PEXELS_API_KEY);
    const [queryRes, setQueryRes] = useState({});
    const { user_id } = useParams();
    const userId = store.userAccount.id;

    useEffect(() => {
        funtionsEffect();
    }, [user_id]);

    const funtionsEffect = () => {
        actions.getUserProfile(user_id).then(async (res) => {
            const query = res.location || 'nature';
            const queryResult = await client.photos.search({ query, per_page: 200 });
            setQueryRes(queryResult);
            setProfile(res);
            setLoaded(true);
        });
    };

    const handleProfileImageLoad = (event) => {
        const profileImg = event.target;
        const height = profileImg.offsetHeight;
        setProfileImgH(height);
    };
    function fetchWallpapers() {
        if (parseInt(userId) === parseInt(user_id)) {
            const length = queryRes.photos.length;
            if (page < length - 1) {
                setPage(page + 1);
            } else {
                actions.noMoreCoverImages(user_id);
                setPage(0);
            }
            return queryRes;
        }
    }
    const formatDate = (dateString) => {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        const date = new Date(dateString);
        const dayOfWeek = days[date.getDay()];
        const dayOfMonth = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        const nth = (day) => {
            if (day > 3 && day < 21) return 'th';
            switch (day % 10) {
                case 1: return "st";
                case 2: return "nd";
                case 3: return "rd";
                default: return "th";
            }
        };

        const formattedDate = `${dayOfWeek} ${dayOfMonth}${nth(dayOfMonth)} ${month} ${year}`;

        return formattedDate;
    }

    return (
        loaded ? (
            <Container fluid className='d-flex align-items-start justify-content-center'>
                <Row className='p-3 pt-2'>
                    <Col md={12} className='p-0'>
                        <button className='btn p-0 m-0 border-0' onClick={() => fetchWallpapers()}>
                            <img
                                src={profile.cover_image || queryRes?.photos[page].src.original || "https://via.placeholder.com/1000"}
                                alt="Cover"
                                className="img-fluid rounded-top profile-banner"
                            />
                        </button>
                        <img
                            src={profile.profile_image || "https://via.placeholder.com/150"}
                            alt="Profile"
                            className="img-thumbnail rounded-circle"
                            onLoad={handleProfileImageLoad}
                            style={{ marginTop: `${(profileImgH / 2) * -1}px` }}
                            id='profile-img'
                        />
                    </Col>
                    <Col md={12} className="container-card container-shadow pb-2 rounded-bottom" style={{ marginTop: `${(profileImgH / 2) * -1}px` }}>
                        <div className="d-flex justify-content-end w-100 py-3">
                            <ButtonGroup aria-label="Basic example" className={'rounded-pill ' + (parseInt(userId) === parseInt(user_id) ? "" : "hidden")} >
                                <Button variant="primary">Edit Profile</Button>
                                <Button variant="upload">Set Banner</Button>
                            </ButtonGroup>
                        </div>
                        <div className='pt-4 profile-container p-2'>
                            <h3>{profile.name} {profile.last_name}</h3>
                            <p>{profile.description}</p>
                            <div className='d-flex flex-row align-items-center span-container p-0'>
                                <div className="d-flex align-items-center">
                                    <FaMapMarkerAlt className="me-1" />
                                    <span>{profile.location}</span>
                                </div>
                                <div className="d-flex align-items-center ms-2">
                                    <FaBirthdayCake className="me-1" />
                                    <span>Birthdate: {formatDate(profile.birthdate)}</span>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Tab.Container defaultActivekey="my-events">
                        <Row className="w-100 justify-content-center m-0 p-0">
                            <Col md={12} className="mt-2 p-2 navtabs">
                                <Nav variant="pills" defaultActivekey="for-you" className="row">
                                    <Nav.Item className="col-4" defaultActivekey="my-events">
                                        <Nav.Link eventKey="my-events" className="btn btn-navtab w-100">
                                            My events
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className="col-4">
                                        <Nav.Link eventKey="Images" className="btn btn-navtab w-100">
                                            Images
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item className="col-4">
                                        <Nav.Link eventKey="favorites" className="btn btn-navtab w-100">
                                            Favorites
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Col>
                            <Tab.Content activeKey={activeTab} className="mt-2">
                                <Tab.Pane eventKey="my-events">
                                    <p>Content for Tab 1</p>
                                </Tab.Pane>
                                <Tab.Pane eventKey="Images">
                                    <p>Content for Tab 2</p>
                                </Tab.Pane>
                                <Tab.Pane eventKey="favorites">
                                    <p>Content for Tab 3</p>
                                </Tab.Pane>
                            </Tab.Content>
                        </Row>
                    </Tab.Container>
                </Row>
            </Container>
        ) : (
            <Spinner animation="border" variant="light" />
        )
    );
};

export default Profile;
