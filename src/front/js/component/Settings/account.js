import React, { useState } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";

export const AccountContainer = () => {
    const [displayPassword, setDisplayPassword] = useState("d-none");


    return (
        <Container fluid>
            <Row className="h-100 p-3 pt-2">
                <Col md={12} className="container-card container-shadow rounded p-4">
                    <h2 className="text-center">Account Settings</h2>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" value={user.email} />
                            <Button variant="edit" onClick={() => setDisplayPassword("")}>
                                <FaEdit />
                            </Button>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="**********" />
                        </Form.Group>
                        <Form.Group className={"mb-3" + displayPassword} controlId="formBasicPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" placeholder="**********" />
                        </Form.Group>
                        <Button variant="delete">
                            Delete Account
                        </Button>
                        <Button variant="primary" type="submit">
                            Save Changes
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}