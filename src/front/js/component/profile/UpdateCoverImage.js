import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Context } from '../../store/appContext';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import CoverImageUploader from './CoverImageUploader';


export const UpdateCoverImage = () => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [location, setLocation] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [message, setMessage] = useState(null);
  const { actions, store } = useContext(Context);
  const { user_id } = useParams()
  const navigate = useNavigate();
  console.log(coverImage)
  const handleImageChange = (imageUrl) => {
    setCoverImage(imageUrl);
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
        setCoverImage(data.cover_image)


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
      coverImage
    );

    if (newProfile) {
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
              <Card.Title className="text-center mb-3 subtitle subtitle-bold"><h4>Edit Cover Image</h4></Card.Title>
              <div className="image mb-3">
                <CoverImageUploader onImageUpload={handleImageChange} initialImageUrl={coverImage}/>
              </div>
              <Form onSubmit={handleProfileCreation} className="p-4 py-0 form">
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