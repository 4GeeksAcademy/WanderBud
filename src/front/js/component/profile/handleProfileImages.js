import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Context } from '../../store/appContext';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import CoverImageUploader from './CoverImageUploader';


export const HandleProfileImages = () => {

  const [image, setImage] = useState('');
  const { actions, store } = useContext(Context);
  const [message, setMessage] = useState("")
  const { user_id } = useParams()
  const navigate = useNavigate();

  const handleImageChange = (imageUrl) => {
    setImage(imageUrl);
  };

  const handleProfileCreation = async (e) => {
    e.preventDefault();
    let newImage = await actions.addProfileImage(image);

    if (newImage) {
      setMessage(store.message);
      navigate(`/profile/${user_id}`);
    } else {
      setMessage('Failed to upload cover image, please try again');
    }
  };

  return (
    <Container fluid className="container-fluid">
      <Row className="vh-100 justify-content-center align-items-center">
        <Col xs={12} md={5}>
          <Card className="p-4 my-5 justify-content-center w-100 card container-card container-shadow">
            <Card.Body>
              <Card.Title className="text-center mb-3 subtitle subtitle-bold"><h4>Upload Image</h4></Card.Title>
              <div className="image mb-3">
                <CoverImageUploader onImageUpload={handleImageChange} />
              </div>
              <Form onSubmit={handleProfileCreation} className="p-4 py-0 form">
                <Button variant="primary" type="submit" block className="w-100 button-primary">
                  Submit
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};