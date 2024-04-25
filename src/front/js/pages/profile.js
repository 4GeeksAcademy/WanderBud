import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../store/appContext';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Profile = () => {
    const { store, actions } = useContext(Context);
    const [loaded, setLoaded] = useState(false);
    const [profile, setProfile] = useState({});
    useEffect(() => {
        const token = localStorage.getItem("token")
        const getUserProfile = async () => {
            try {
                await actions.getUserProfile(localStorage.getItem("token"));
                console.log(store.userProfile[0])
                setProfile(store.userProfile[0])
            } catch (error) {
                console.error('Error al obtener el perfil del usuario:', error);
            }
        };
        getUserProfile().then(setLoaded(true));
    }, []);

    return (
      loaded ?
        <Container className="mt-4">
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Perfil de Usuario</Card.Title>
                            {/* Muestra la información del perfil */}
                            <p><strong>Profile image:</strong> {profile.profile_image}</p>
                            <p><strong>Name:</strong> {profile.name}</p>
                            <p><strong>Last Name:</strong> {profile.last_name}</p>
                            <p><strong>Birthdate:</strong> {profile.birthdate}</p>
                            <p><strong>Location:</strong> {profile.location}</p>
                            <p><strong>Description:</strong> {profile.description}</p>
                            {/* Agrega más campos según la estructura de tu perfil de usuario */}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container> : null
    );
};

export default Profile;
