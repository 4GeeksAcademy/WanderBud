import React, {useState, useContext} from 'react';
import { Context } from "../store/appContext";
import { useNavigate} from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';


 export const Login = () => {

  const[email, setEmail]= useState("")
  const[password, setPassword]= useState("")
  const { store, actions}= useContext(Context)
  const navigate= useNavigate()
  console.log(email);
  console.log(password);

  
  
  
  async function handleSubmit(e) {
    e.preventDefault()
    console.log(email,password);
     let logged = await actions.login(email,password)
     if (logged) {
      navigate("/create-profile")
      
     }
  }

  return (
    <div className="login-page"  style={{ backgroundColor: 'rgb(0, 0, 0)', height: '100vh' }}>
      <Container>
        <Row className="justify-content-center align-items-center" style={{ height: '100vh' }}>
          <Col xs={12} md={6}>
            <div className="login-form" style={{ borderRadius: '10px', padding: '20px', backgroundColor: 'B5C0D0' }}>
              <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: '20px', marginRight: '200px' }}>Log in</h2>
              <Button variant="light" style={{ borderRadius: '20px', marginBottom: '50px', width: '100%', maxWidth: '300px', marginLeft: 'auto', marginRight: 'auto', display: 'block' }}>Google</Button>
              <Form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '300px', marginLeft: 'auto', marginRight: 'auto' }}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Control type="email" placeholder="Email" onChange={(e)=>setEmail(e.target.value)} style={{ borderRadius: '10px', marginBottom: '20px' }} /> 
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Control type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} style={{ borderRadius: '10px', marginBottom: '0px' }} /> 
                </Form.Group>

                <Form.Text className="text-muted" style={{ marginLeft: '10px', fontSize: '10px', marginBottom: '80px' }}>
                <Link to="/password-recovery" style={{ color: '#fff' }}>Forgot Password?</Link>
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