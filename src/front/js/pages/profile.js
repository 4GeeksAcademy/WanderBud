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

        // Llama a la función para obtener el perfil cuando el componente se monta
        getUserProfile().then(setLoaded(true));
    }, []); // Asegúrate de incluir actions y store.token como dependencias del efecto

    return (
      loaded ?
        <Container className="mt-4">
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Perfil de Usuario</Card.Title>
                            {/* Muestra la información del perfil */}
                            <p><strong>Nombre:</strong> {profile.name}</p>
                            <p><strong>Correo Electrónico:</strong> {store.userProfile.email}</p>
                            {/* Agrega más campos según la estructura de tu perfil de usuario */}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container> : null
    );
};

export default Profile;
