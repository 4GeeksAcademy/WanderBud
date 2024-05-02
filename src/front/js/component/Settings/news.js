import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '../../store/appContext';
import { Container, Row, Col } from 'react-bootstrap';
import { createClient } from 'pexels';





const NewsContainer = () => {
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
                            src={"https://res.cloudinary.com/dkfphx3dm/image/upload/v1714630215/news-1074604_nui6z9.jpg"}
                            alt="Cover"
                            className="img-fluid rounded-top profile-banner"
                        />
                    </button>

                </Col>
                <Col md={12} className="container-card container-shadow pb-2 rounded-bottom" style={{ marginTop: `${(profileImgH / 2) * -1}px` }}>
                    <div className='pt-4 profile-container p-2'>
                        <span className="news-date">May 2, 2024</span>
                        <h3>WanderBud Launches Innovative Travel Planning Tool!</h3>
                        <p>WanderBud unveils its latest feature, a revolutionary travel planning tool designed to simplify trip organization. Users can now effortlessly create custom itineraries, explore local attractions, and book accommodations directly through the platform. Discover a new way to plan your adventures with WanderBud!</p>
                        <div className='d-flex flex-row align-items-center span-container p-0'>
                            <div className="d-flex align-items-center">
                                <span><a href="[Link to article 1]">Link to article</a></span>
                            </div>
                        </div>
                    </div>
                    <div className='pt-4 profile-container p-2'>
                        <span className="news-date">April 30, 2024</span>
                        <h3>WanderBud Partners with Eco-Friendly Accommodations for Sustainable Travel Initiative!</h3>
                        <p>In a bid to promote eco-conscious tourism, WanderBud collaborates with environmentally friendly accommodations worldwide. Travelers can now easily identify and book stays at eco-conscious hotels, resorts, and lodges through WanderBud's platform. Join us in our commitment to sustainable travel!</p>
                        <div className='d-flex flex-row align-items-center span-container p-0'>
                            <div className="d-flex align-items-center">
                                <span><a href="[Link to article 2]">Link to article</a></span>
                            </div>
                        </div>
                    </div>
                    <div className='pt-4 profile-container p-2'>
                        <span className="news-date">April 28, 2024</span>
                        <h3>WanderBud Introduces Multilingual Support for Global Users!</h3>
                        <p>WanderBud announces the addition of multilingual support, catering to its diverse user base across the globe. Travelers can now access the platform in multiple languages, enhancing their experience and making trip planning more accessible than ever before. Explore the world with WanderBud, no matter where you are!</p>
                        <div className='d-flex flex-row align-items-center span-container p-0'>
                            <div className="d-flex align-items-center">
                                <span><a href="[Link to article 3]">Link to article</a></span>
                            </div>
                        </div>
                    </div>
                    <div className='pt-4 profile-container p-2'>
                        <span className="news-date">April 26, 2024</span>
                        <h3>WanderBud Unveils Exclusive Deals for Adventure Seekers!</h3>
                        <p>Adventure enthusiasts rejoice as WanderBud launches exclusive deals on thrilling experiences worldwide. From adrenaline-pumping activities like skydiving and whitewater rafting to guided hiking tours and wildlife safaris, WanderBud offers unbeatable discounts for the ultimate adventure seekers. Don't miss out on your next adrenaline rush!</p>
                        <div className='d-flex flex-row align-items-center span-container p-0'>
                            <div className="d-flex align-items-center">
                                <span><a href="[Link to article 4]">Link to article</a></span>
                            </div>
                        </div>
                    </div>
                    <div className='pt-4 profile-container p-2'>
                        <span className="news-date">April 24, 2024</span>
                        <h3>WanderBud Celebrates Milestone: 1 Million Users and Counting!</h3>
                        <p>WanderBud reaches a significant milestone, surpassing one million users on its platform. With its user-friendly interface, comprehensive travel resources, and dedication to customer satisfaction, WanderBud continues to be the go-to destination for travelers around the world. Join the growing community of WanderBuddies today!</p>
                        <div className='d-flex flex-row align-items-center span-container p-0'>
                            <div className="d-flex align-items-center">
                                <span><a href="[Link to article 5]">Link to article</a></span>
                            </div>
                        </div>
                    </div>
                    <div className='pt-4 profile-container p-2'>
                        <span className="news-date">April 22, 2024</span>
                        <h3>WanderBud Launches Mobile App for On-the-Go Travel Planning!</h3>
                        <p>Travel planning just got easier with the launch of WanderBud's mobile app. Now available for iOS and Android devices, the app allows users to seamlessly plan their adventures, access real-time travel updates, and make bookings on the fly. Experience the convenience of WanderBud wherever you go!</p>
                        <div className='d-flex flex-row align-items-center span-container p-0'>
                            <div className="d-flex align-items-center">
                                <span><a href="[Link to article 6]">Link to article</a></span>
                            </div>
                        </div>
                    </div>
                </Col>

            </Row>
        </Container>
    )
}

export default NewsContainer;