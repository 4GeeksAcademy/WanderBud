import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Card, Button } from 'react-bootstrap';
import '../../../styles/event.css';
import { Context } from '../../store/appContext';
import { Link, useNavigate, useParams } from "react-router-dom";
import EventCard from "../Events/eventCard";

const EventFavorite = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const { userId } = useParams()
    
    useEffect(() => {

        actions.getFavorites(userId);  // Asegúrate de que esta acción esté definida y traiga los eventos favoritos del usuario.
    }, [userId, store.favorites]);

    
    const favoriteEvents = store.favorites


    return (
        store.favorites !== null ?
            <>
                <Row className="flex-column">
                    {favoriteEvents.map((item, index) => (

                        <Col md={12} key={index} className="d-flex justify-content-center">
                            <EventCard event={item} />
                        </Col>
                    ))}
                </Row>
            </>
            : null);
};
export default EventFavorite;