import React, { useState, useContext } from 'react';
import { Context } from "../store/appContext";
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import GoogleApp from './Login_Google';

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();


  async function handleSubmit(e) {
    e.preventDefault();
    await actions.login(email, password).then((response) => {
      if (response) {
        actions.validateToken()
      } else {
        actions.wrongPassword()
      }
    }
    )
  }

  return (
    <Container fluid className="container-fluid">
      <Row className="vh-100 justify-content-center align-items-center">
        <Col md={5}>
          <Card className="p-4 justify-content-center w-100 card container-card container-shadow">
            <Card.Title className="text-center mb-3 subtitle subtitle-bold"><h4>Log In</h4></Card.Title>
            <Form onSubmit={handleSubmit} className="p-4 py-0">
              <Button variant='google' className='rounded-pill w-100 p-0 m-0' style={{ overflow: "hidden" }}>
                <GoogleApp />
              </Button>
              <hr className="border border-secondary mb-3" />
              <Form.Group controlId="formBasicEmail" className="mb-3">
                <Form.Control type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
              </Form.Group>
              <Form.Group controlId="formBasicPassword" className="mb-3">
                <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>
              <Button variant="secondary" type="submit" className="w-100">
                Login
              </Button>
              <Form.Text>
                <Link to="/password-recovery">Forgot Password?</Link>
              </Form.Text>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;

