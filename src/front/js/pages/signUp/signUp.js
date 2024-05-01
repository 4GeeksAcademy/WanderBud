import React, { useContext } from 'react';
import { Context } from '../../store/appContext';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const SignUp = () => {
  const { actions } = useContext(Context);
  const navigate = useNavigate();

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

  const handleSubmit = async (values) => {
    try {
      const { email, password } = values;
      const response = await actions.createUser({ email, password, is_active: true });
  
      if (response) {
        navigate("/signup/profile");
        alert('Usuario creado correctamente');
      } else {
        alert('Error al crear el usuario: ' + response.error);
      }
    } catch (error) {
      console.error('Error en la solicitud createUser:', error);
      alert('Error al crear el usuario. Por favor, inténtalo de nuevo.');
    }
  };
  

  return (
    <Container fluid className="container-fluid">
      <Row className="vh-100 justify-content-center align-items-center">
        <Col md={5}>
          <Card className="p-4 justify-content-center w-100 card container-card container-shadow">
            <Card.Title className="text-center mb-3 subtitle subtitle-bold"><h4>Sign Up</h4></Card.Title>
            <Formik
              initialValues={{ email: '', password: '', confirmpassword: '' }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ handleSubmit, handleChange, values, errors }) => (
                <Form onSubmit={handleSubmit} className="p-4 py-0">
                  <Form.Group controlId="formEmail">
                    <Form.Control
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

export default SignUp
