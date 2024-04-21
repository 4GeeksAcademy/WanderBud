import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import img from "../../img/WanderBud.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";


export const Home = () => {
    const { store, actions } = useContext(Context);


    return (
        <Container fluid className="container-fluid">
            <Row className="justify-content-center align-items-center min-vh-100">
                <Col md={6} className="d-flex flex-column align-items-center py-5">
                    <h1 className="home-title mb-4">WanderBud</h1>
                    <img src={img} className="img-fluid home-logo" alt="Logo de WanderBud" />
                </Col>
                <Col md={5} className="d-flex flex-column justify-content-center py-5">
                    <Card className="p-4 d-flex flex-column justify-content-between align-items-center card h-100 container-card container-shadow">
                        <Card.Title className="text-center mb-4 subtitle subtitle-bold">Connect. Create. Celebrate.</Card.Title>
                        <Link to="/login" className="btn btn-secondary btn-block rounded-pill mb-3 w-75">Login</Link>
                        <Button type="submit" className="btn-block btn-google rounded-pill mb-3 w-75">Google</Button>
                        <div className="d-flex w-75 mb-3 justify-content-center ">
                            <hr className="w-25 me-2" />
                            <span className="text-center align-content-center">If you don't have one</span>
                            <hr className="w-25 ms-2 " />
                        </div>
                        <Link to="/signup/user" className="btn btn-primary btn-block rounded-pill border w-75">Sign Up</Link>
                    </Card>
                </Col>
            </Row>
        </Container>

    );
};