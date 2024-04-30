import React, { useState, useContext } from 'react';
import { Context } from '../../store/appContext';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const SignUp = () => {
  const { actions } = useContext(Context);
  const navigate = useNavigate();

  const [confirmpassword, setConfirmpassword] = useState('');


  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .matches(/(?=.*[A-Z])(?=.*\W)/, 'Password must contain at least one uppercase letter and one symbol'),
    confirmpassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const handleSubmit = async (userData) => {
    try {
      const success = await actions.createUser(userData);
      if (success) {
        navigate("/signup/profile");
        alert('Usuario creado correctamente');
      } else {
        alert('Error al crear el usuario');
      }
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      alert('Error al crear el usuario');
    }
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Container fluid className="container-fluid">
      <Row className="vh-100 justify-content-center align-items-center">
        <Col md={5}>
          <Card className="p-4 justify-content-center w-100 card container-card container-shadow">
            <Card.Title className="text-center mb-3 subtitle subtitle-bold"><h4>Sign Up</h4></Card.Title>
            {}
            <Formik
              initialValues={{
                email: '',
                password: '',
                confirmpassword: '',
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => handleSubmit(values)}
            >
              {({ handleSubmit, handleChange, values, errors }) => (
                <Form onSubmit={handleSubmit} className="p-4 py-0">
                  <Form.Group controlId="formEmail">
                    <Form.Control
                      className="form-control mb-3"
                      type="email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      placeholder="Email"
                    />
                    <ErrorMessage name="email" component="div" className="text-danger" />
                  </Form.Group>
                  
                  <hr className="border border-secondary mb-3" />
                  
                  <Form.Group controlId="formPassword">
                    <Form.Control
                      className="form-control mb-3"
                      type="password"
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      placeholder="Password"
                    />
                    <ErrorMessage name="password" component="div" className="text-danger" />
                  </Form.Group>
                  
                  <Form.Group controlId="formConfirmPassword">
                    <Form.Control
                      className="form-control mb-3"
                      type="password"
                      name="confirmpassword"
                      value={values.confirmpassword}
                      onChange={handleChange}
                      placeholder="Confirm Password"
                    />
                    <ErrorMessage name="confirmpassword" component="div" className="text-danger" />
                  </Form.Group>
                  
                  <Button variant="primary" type="submit" className="w-100">
                  Register
                  </Button>
                </Form>
              )}
            </Formik>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUp;

