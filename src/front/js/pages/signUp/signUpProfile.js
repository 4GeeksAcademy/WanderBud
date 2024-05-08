import React, { useState, useMemo, useEffect } from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../store/appContext';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import ImageUploader from '../../component/signUp/imageUploader';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import countryList from 'react-select-country-list';

export const SignUpProfile = () => {
  const { actions, store } = useContext(Context);
  const googleData = JSON.parse(localStorage.getItem('googleData'));
  const [name, setName] = useState(googleData?.name.split(" ")[0] || '');
  const [lastName, setLastName] = useState(googleData?.name.split(" ")[1] || '');
  const [location, setLocation] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(googleData?.picture || '');
  const [coverImage, setCoverImage] = useState('');
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const options = useMemo(() => countryList().getData(), []);

  const handleImageChange = (imageUrl) => {
    setImage(imageUrl);
  };

  const handleProfileCreation = async (e) => {
    e.preventDefault();
    let accessToken = localStorage.getItem('token');
    let newProfile = await actions.createUserProfile(
      name,
      lastName,
      location,
      birthdate,
      description,
      image,
      coverImage,
      accessToken
    );

    if (newProfile) {
      setMessage(store.message);
      localStorage.removeItem('googleData');
      navigate(`/profile/${store.userAccount.id}`);
    } else {
      setMessage('Failed to create profile, please try again');
    }
  };

  return (
    <Container fluid className="container-fluid">
      <Row className="vh-100 justify-content-center align-items-center">
        <Col xs={12} md={5}>
          <Card className="p-4 my-5 justify-content-center w-100 card container-card container-shadow">
            <Card.Body>
              <Card.Title className="text-center mb-3 subtitle subtitle-bold"><h4>Create Profile</h4></Card.Title>
              <div className="image mb-3">
                <ImageUploader onImageUpload={handleImageChange} initialImageUrl={image} />
              </div>
              <Form onSubmit={handleProfileCreation} className="p-4 py-0 form">
                <Form.Group controlId="firstName">
                  <Form.Control
                    className="form-control mb-3"
                    type="text"
                    placeholder="First Name"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="lastName">
                  <Form.Control
                    className="form-control mb-3"
                    type="text"
                    placeholder="Last Name"
                    onChange={(e) => setLastName(e.target.value)}
                    value={lastName}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="country">
                  <Select
                    options={options}
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.value}
                    value={options.find(c => c.label === location)}
                    onChange={option => setLocation(option.label)}
                    placeholder="Select your country"
                  />
                </Form.Group>
                <Form.Group controlId="birthdate">
                  <Form.Label className="form-label">Birthdate</Form.Label>
                  <Form.Control
                    className="form-control mb-3"
                    type="date"
                    onChange={(e) => setBirthdate(e.target.value)}
                    value={birthdate}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="description">
                  <Form.Control
                    className="form-control mb-3"
                    as="textarea"
                    placeholder="Let others know about you..."
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" block className="w-100 button-primary">
                  Complete Register
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};