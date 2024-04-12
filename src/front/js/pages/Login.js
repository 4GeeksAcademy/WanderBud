import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';


const Login = () => {
  return (
    <div className="login-page" style={{ backgroundColor: 'rgb(0, 0, 0)', height: '100vh' }}>
      <Container>
        <Row className="justify-content-center align-items-center" style={{ height: '100vh' }}>
          <Col xs={12} md={6}>
            <div className="login-form" style={{ borderRadius: '10px', padding: '20px', backgroundColor: 'B5C0D0' }}>
              <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: '20px', marginRight: '200px' }}>Log in</h2>
              <Button variant="light" style={{ borderRadius: '20px', marginBottom: '50px', width: '100%', maxWidth: '300px', marginLeft: 'auto', marginRight: 'auto', display: 'block' }}>Google</Button>
              <Form style={{ width: '100%', maxWidth: '300px', marginLeft: 'auto', marginRight: 'auto' }}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Control type="email" placeholder="Email" style={{ borderRadius: '10px', marginBottom: '20px' }} /> 
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Control type="password" placeholder="Password" style={{ borderRadius: '10px', marginBottom: '0px' }} /> 
                </Form.Group>

                <Form.Text className="text-muted" style={{ marginLeft: '10px', fontSize: '10px', marginBottom: '80px' }}>
                  <a href="#" style={{ color: '#fff' }}>Forgot Password?</a>
                </Form.Text>

                <Button variant="light" type="submit" style={{ borderRadius: '20px', backgroundColor: 'EEEDED', color: 'EEEDED', width: '100%', maxWidth: '300px', marginLeft: 'auto', marginRight: 'auto', display: 'block', marginTop: '30px' }}> 
                  Login
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
export default Login;