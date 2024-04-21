import React, { useState, useContext } from 'react';
import { Context } from '../../store/appContext';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';

const SignUp = () => {
  const { actions } = useContext(Context);
  const navigate = useNavigate();
  const [confirmpassword, setConfirmpassword] = useState("");
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    is_active: true
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userData.password !== confirmpassword) {
      alert('Error: Las contraseñas no coinciden');
      return;
    }

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
            <Form onSubmit={handleSubmit} className="p-4 py-0">
              {/* Campo de Email */}
              <Form.Group controlId="formEmail">
                <Form.Control
                  className="form-control mb-3"
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                />
              </Form.Group>
              {/* Separador */}
              <hr className="border border-secondary mb-3" />
              {/* Campo de Contraseña */}
              <Form.Group controlId="formPassword">
                <Form.Control
                  className="form-control mb-3"
                  type="password"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                />
              </Form.Group>
              {/* Confirmación de Contraseña */}
              <Form.Group controlId="formConfirmPassword">
                <Form.Control
                  className="form-control mb-3"
                  type="password"
                  name="confirmpassword"
                  value={confirmpassword}
                  onChange={(e) => setConfirmpassword(e.target.value)}
                  placeholder="Confirm Password"
                  required
                />
              </Form.Group>
              {/* Botón de Registro */}
              <Button variant="primary" type="submit" block className="w-100">
                Register
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>


  );
};

export default SignUp;
