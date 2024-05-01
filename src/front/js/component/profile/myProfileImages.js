import React, { useContext, useEffect, useState } from "react";
import { Container, Image, Row, Col, Card, Button } from 'react-bootstrap';
import { Context } from "../../store/appContext";




export const MyProfileImages = (props) => {
    const { store, actions } = useContext(Context);
    const userId = store.userAccount.id;
   console.log(store.profileImages)
    let myImages = store.profileImages

    useEffect(() => {
        actions.getProfileImages(props.user_id);
    }, [props.user_id]);

    const handleDeleteImage = (imageId) => {
      actions.deleteProfileImage(imageId)
          .then(() => {
              window.location.reload();
          })
          .catch(error => {
              console.error('Error al eliminar la imagen:', error);
          });
  };

    return (
      <Container>
        <Row xs={1} md={2} lg={3} xl={4} className="g-4">
          {myImages.map((photo, index) => (
            <Col key={index}>
              <div style={{ position: 'relative', objectFit: 'cover' }}>
                <Image src={photo.image_path} alt={`Photo ${index}`} style={{aspectRatio: '1', width: '100%'}} fluid />
                <div style={{ position: 'relative'}} className="d-flex justify-content-center">
                  <Button variant="danger" className={'rounded-pill w-75 mt-1' + (parseInt(userId) === parseInt(props.user_id) ? "" : "hidden")} size="sm" onClick={() => handleDeleteImage(photo.id)} style={{ marginLeft: '5px' }}>
                    Delete
                  </Button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    );
  };