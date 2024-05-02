import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '../../store/appContext';
import { Container, Row, Col } from 'react-bootstrap';
import { createClient } from 'pexels';





const AboutUsContainer = () => {
    const { store, actions } = useContext(Context);
    const [profileImgH, setProfileImgH] = useState(0);
    const client = createClient(process.env.PEXELS_API_KEY);
    const { user_id } = useParams();
    const userId = store.userAccount.id;



    return (

        <Container fluid className='d-flex align-items-start justify-content-center'>
            <Row className='p-3 pt-2'>
                <Col md={12} className='p-0'>
                    <button className='w-100 btn p-0 m-0 border-0'>
                        <img
                            src={"https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1713005832/Logo2_t2gs97.jpg"}
                            alt="Cover"
                            className="img-fluid rounded-top profile-banner"
                        />
                    </button>

                </Col>
                <Col md={12} className="container-card container-shadow pb-2 rounded-bottom" style={{ marginTop: `${(profileImgH / 2) * -1}px` }}>
                <h1>About Us</h1>
    <p>Welcome to our world of event creation and sharing! WanderBud was born from the collective passion for bringing people together to create memorable experiences. Let us introduce you to the minds behind the magic:</p>

    <div class="team-member">
        <img className="img-fluid rounded-top profile-banner" src="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1714632825/rabbit-7855464_1920_tzaeye.jpg" alt="Bruno" />
        <h4>Bruno:</h4>
        <p>With a keen eye for design and a knack for user experience, Bruno ensures that WanderBud is not only functional but also visually appealing and intuitive to navigate.</p>
    </div>

    <div class="team-member">
        <img className="img-fluid rounded-top profile-banner" src="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1714633687/ai-generated-8710183_1920_w8zhbw.jpg" alt="Osián" />
        <h4>Osián:</h4>
        <p>The mastermind behind WanderBud's backend architecture, Osián's expertise in coding and database management keeps our platform running smoothly and securely, ensuring a seamless experience for our users.</p>
    </div>

    <div class="team-member">
        <img className="img-fluid rounded-top profile-banner" src="https://res.cloudinary.com/dkfphx3dm/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1714633330/cat-7466429_1920_ixd8kb.jpg" alt="Frank" />
        <h4>Frank:</h4>
        <p>As our resident front-end developer, Frank brings creativity and innovation to the table, constantly pushing the boundaries of what's possible in web development to deliver a dynamic and engaging user interface.</p>
    </div>

    <div class="team-member">
        <img className="img-fluid rounded-top profile-banner" src="https://res.cloudinary.com/dkfphx3dm/image/upload/v1714632366/fox-7468838_1280_vmawkk.jpg" alt="Lucia" />
        <h4>Lucia:</h4>
        <p>With a passion for community building and user engagement, Lucia oversees our marketing and user outreach efforts, connecting with our audience and fostering a vibrant and inclusive community of event enthusiasts.</p>
    </div>

    <p>Together, we strive to provide you with a platform where you can effortlessly create, discover, and share events with friends, family, and fellow adventurers. Whether it's a small gathering with friends or a large-scale festival, WanderBud is here to help you turn your ideas into unforgettable experiences.</p>

    <p>Join us on this journey of exploration, connection, and celebration. Let's create memories together with WanderBud!</p>

                </Col>

            </Row>
        </Container>
    )
}

export default AboutUsContainer;