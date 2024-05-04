import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import { Link, useLocation } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';

export const PasswordReset = () => {
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { actions, store } = useContext(Context);
  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    // Update message state when store.message changes
    setMessage(store.message);
  }, [store.message]);

  function handleResetPassword(e) {
    e.preventDefault()
    if (password1 === password2) {
      let reset = actions.resetPassword(password1, token).then(() => {
        if (store.message === 'Password successfully changed') {
          navigate('/login');
        }
      }
      )
    } else {
      setMessage("Passwords don't match, try again");
    }
  };

  return (
    <Container fluid className="container-fluid" >
      <Row className="vh-100 justify-content-center align-items-center">
        <Col md={5}>
          <Card className="p-4 justify-content-center w-100 card container-card container-shadow">
            <Card.Title className="text-center mb-3 subtitle subtitle-bold"><h4>Change Password</h4></Card.Title>
            <Form onSubmit={handleResetPassword} className='p-4 py-0 '>
              <Form.Group controlId="password1">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter a new password"
                  onChange={e => setPassword1(e.target.value)}
                  value={password1}
                  className='mb-3'
                  required
                />
              </Form.Group>
              <Form.Group controlId="password2">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Repeat your password"
                  onChange={e => setPassword2(e.target.value)}
                  value={password2}
                  className='mb-3'
                  required
                />
              </Form.Group>
              <Button variant="secondary" onClick={() => setShowPassword(!showPassword)} className="mb-3 me-2">
                    {showPassword ? 'Hide Password' : 'Show Password'}
                  </Button>
              <Button variant="primary" type="submit" className='w-100'>Change Password</Button>
              {message && <p className="message">{message}</p>}
            </Form>
          </Card>
        </Col>
      </Row>
    </Container >
  );
};
