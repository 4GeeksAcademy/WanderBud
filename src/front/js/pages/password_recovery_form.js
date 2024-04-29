import React, { useState } from 'react';
import { useContext } from 'react';
import { Context } from '../store/appContext';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';

export const PasswordRecoveryForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const { actions } = useContext(Context);

  async function handleEmailChange(e) {
    e.preventDefault();
    let emailSent = await actions.passwordRecoverySubmit(email);
    if (emailSent) {
      setMessage("Check your email inbox");
    } else {
      setMessage("Failed to send email, please try again");
    }
  }

  return (
    <Container fluid className="container-fluid" >
      <Row className="vh-100 justify-content-center align-items-center">
        <Col md={5}>
          <Card className="p-4 justify-content-center w-100 card container-card container-shadow">
            <Card.Title className="text-center mb-3 subtitle subtitle-bold"><h4>Recover Password</h4></Card.Title>
            <Form onSubmit={handleEmailChange} className="p-4 py-0">
              <Form.Group controlId="formEmail" className='mb-3'>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  onChange={e => setEmail(e.target.value)}
                  value={email}
                  required
                />
              </Form.Group>
              <Button variant="secondary" type="submit" className="w-100">
                Send Email
              </Button>
              {message && <Alert variant="info">{message}</Alert>}
            </Form>
          </Card>
        </Col>
      </Row>
    </Container >
  );
};