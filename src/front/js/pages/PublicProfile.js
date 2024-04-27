import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios'; // Importa Axios para realizar solicitudes HTTP

const PublicProfile = ({ ownerId }) => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`/api/public-user-profile/${ownerId}`); // Hacer solicitud al endpoint de la API
                const userData = response.data;

                if (userData.msg === 'ok') {
                    const userProfileData = userData.results[0]; // Suponiendo que solo obtienes un perfil
                    setProfile(userProfileData);
                } else {
                    console.error('Error al obtener el perfil del usuario:', userData.msg);
                }
            } catch (error) {
                console.error('Error al obtener el perfil del usuario:', error);
            }
        };

        fetchUserProfile();
    }, [ownerId]);

    return (
        <Container className="mt-4">
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Perfil de Usuario</Card.Title>
                            {profile ? (
                                <>
                                    <p><strong>Nombre de usuario:</strong> {profile.username}</p>
                                    <p><strong>Nombre:</strong> {profile.name}</p>
                                    <p><strong>Apellido:</strong> {profile.lastName}</p>
                                    <p><strong>Fecha de nacimiento:</strong> {profile.birthdate}</p>
                                    <p><strong>Ubicación:</strong> {profile.location}</p>
                                    <p><strong>Descripción:</strong> {profile.description}</p>
                                </>
                            ) : (
                                <p>Cargando perfil...</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default PublicProfile;
