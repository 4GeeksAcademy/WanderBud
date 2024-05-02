import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Context } from '../../store/appContext';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import ImageUploader from '../../component/signUp/imageUploader';


export const UpdateProfile = () => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [location, setLocation] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [message, setMessage] = useState(null);
  const { actions, store } = useContext(Context);
  const { user_id } = useParams()
  const navigate = useNavigate();
  const handleImageChange = (imageUrl) => {
    setImage(imageUrl);
  };

  useEffect(() => {
    actions.getUserProfile(user_id).then((data) => {
      const birthdateDate = new Date(data.birthdate);
      const formattedBirthdate = birthdateDate.toISOString().split('T')[0];
      setName(data.name);
      setLastName(data.last_name);
      setLocation(data.location);
      setDescription(data.description);
      setBirthdate(formattedBirthdate);
      setImage(data.profile_image)


    });
  }, []);

  const handleProfileCreation = async (e) => {
    e.preventDefault();
    let newProfile = await actions.updateUserProfile(
      name,
      lastName,
      location,
      birthdate,
      description,
      image,
    );

    if (newProfile) {
      setMessage(store.message);
      navigate(`/profile/${user_id}`);
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
              <Card.Title className="text-center mb-3 subtitle subtitle-bold"><h4>Edit Profile</h4></Card.Title>
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
                  <Form.Control
                    className="form-control mb-3"
                    type="text"
                    placeholder="Country"
                    onChange={(e) => setLocation(e.target.value)}
                    value={location}
                    required
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
                  Edit
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};