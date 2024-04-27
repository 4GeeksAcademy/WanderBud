import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Button, Form, InputGroup, Alert } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { Context } from "../../store/appContext";
import { ModalWarning } from "./components/modalWarning";

export const AccountContainer = () => {
    const { store, actions } = useContext(Context);
    const [displayPassword, setDisplayPassword] = useState(true);
    const [displayEmail, setDisplayEmail] = useState(true);
    const [error, setError] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [data, setData] = useState({ email: "", password: "" });
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState(data.email);

    const [modal, setModal] = useState({
        show: false,
        title: "",
        body: "",
        handleClose: "",
        handleConfirm: ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError({ ...error, confirmPassword: "Passwords do not match" });
            return; S
        } else if (password.length < 8) {
            setError({ ...error, password: "Password must be at least 8 characters long" });
            return;
        } else if (email.includes("@") === false) {
            setError({ ...error, email: "Please enter a valid email address" });
            return;
        } else {
            setError({ email: "", password: "", confirmPassword: "" });
        }
        store.updateUser = true;

        setModal({
            show: true,
            title: "Warning!",
            body: "Are you sure you want to update your account?",
            handleClose: () => setModal({ show: false, title: "", body: "" }),
            handleConfirm: () => {
                setModal({ show: false, title: "", body: "" });
                actions.updateUserAccount({ email, password });
            }
        });
    };
    const handleDelete = (e) => {
        e.preventDefault();
        alert("Are you sure you want to delete your account?");
        store.updateUser = true;
        setModal({
            show: true,
            title: "Warning!",
            body: "Are you sure you want to delete your account?",
            handleClose: () => setModal({ show: false, title: "", body: "" }),
            handleConfirm: () => {
                setModal({ show: false, title: "", body: "" });
                actions.deleteUserAccount();
            }
        });

    };

    useEffect(() => {
        actions.getUserAccount().then(resp => {
            if (resp) {
                console.log(resp);
                setData(store.userAccount);
                setEmail(store.userAccount.email);
            }
        });
    }, [modal]);


    return (
        <Container fluid>
            <ModalWarning show={modal.show} handleConfirm={modal.handleConfirm} handleClose={modal.handleClose} title={modal.title} body={modal.body} />
            <Row className="h-100 p-3 pt-2">
                <Col md={12} className="container-card container-shadow rounded p-4">
                    <h2 className="text-center">Account Settings</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    aria-describedby="emailHelp"
                                    type="email"
                                    value={email}
                                    disabled={displayEmail}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <InputGroup.Text id="emailHelp" onClick={() => { setDisplayEmail(!displayEmail); displayEmail ? setEmail(data.email) : null }}>
                                    <FaEdit />
                                </InputGroup.Text>
                            </InputGroup>
                            {error.email && <Form.Text variant="text-danger">{error.email}</Form.Text>}
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    aria-describedby="passwordHelp"
                                    type="password"
                                    placeholder="*********"
                                    disabled={displayPassword}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <InputGroup.Text id="passwordHelp" onClick={() => { setDisplayPassword(!displayPassword) }} >
                                    <FaEdit />
                                </InputGroup.Text>
                            </InputGroup>
                            {error.password && <Form.Text variant="text-danger">{error.password}</Form.Text>}
                        </Form.Group>
                        <Form.Group className={"mb-3 " + (displayPassword ? "d-none" : null)} controlId="formBasicConfirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    aria-describedby="confirmPasswordHelp"
                                    placeholder="Enter your password again"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </InputGroup>
                            {error.confirmPassword && <Form.Text variant="text-danger">{error.confirmPassword}</Form.Text>}
                        </Form.Group>
                        <div className="d-flex flex-row justify-content-center">
                            <Button variant="danger" className="me-2" onClick={(e) => {
                                handleDelete(e);
                            }}>
                                Delete Account
                            </Button>
                            <Button variant="primary" type="submit" onClick={(e) => {
                                handleSubmit(e);

                            }}>
                                Save Changes
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};