import React, { useContext, useEffect, useState } from "react";
import { Container, Image, Row, Col, Card, Button } from 'react-bootstrap';
import { Context } from "../../store/appContext";



export const MyProfileImages = () => {
    const { store, actions } = useContext(Context);
   console.log(store.profileImages)
    let myImages = store.profileImages

    useEffect(() => {
        actions.getProfileImages();
    }, []);

  

    return (
      <Container>
        <Row xs={1} md={2} lg={3} xl={4} className="g-4">
          {myImages.map((photo, index) => (
            <Col key={index}>
              <div style={{ position: 'relative' }}>
                <Image src={photo.image_path} alt={`Photo ${index}`} fluid />
                <div style={{ position: 'absolute', top: '5px', right: '5px' }}>
                  <Button variant="primary" size="sm" onClick={() => onUpdate(index)}>
                    Update
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => actions.deleteProfileImage(photo.id)} style={{ marginLeft: '5px' }}>
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