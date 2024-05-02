import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '../../store/appContext';
import { Container, Row, Col } from 'react-bootstrap';
import { createClient } from 'pexels';





const PrivacyContainer = () => {
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
                            src={"https://res.cloudinary.com/dkfphx3dm/image/upload/v1714631077/key-2114046_1920_pmi1iu.jpg"}
                            alt="Cover"
                            className="img-fluid rounded-top profile-banner"
                        />
                    </button>

                </Col>
                <Col md={12} className="container-card container-shadow pb-2 rounded-bottom" style={{ marginTop: `${(profileImgH / 2) * -1}px` }}>
                <h1>Privacy Policy of Wanderbud</h1>
    <p>At Wanderbud, we take the privacy and security of your personal data very seriously. This privacy policy explains how we collect, use, disclose, and protect the information we obtain when you visit our website or use our services.</p>

    <h3>1. Information We Collect:</h3>
    <ul>
        <li><strong>Personal Information:</strong> We collect personal information such as your name, email address, mailing address, and phone number when you register on our platform or make a purchase.</li>
        <li><strong>Usage Information:</strong> We collect information about how you use our website and services, such as the pages you visit, the duration of your visit, and the actions you take.</li>
        <li><strong>Device Information:</strong> We may collect information about the device you use to access our website, such as IP address, browser type, operating system, and unique device identifier.</li>
    </ul>

    <h3>2. Use of Information:</h3>
    <ul>
        <li>We use the information collected to provide you with our services, process your orders, personalize your experience on our website, and communicate with you about your account and transactions.</li>
        <li>We may also use the information to improve our services, develop new products, and conduct analytics and market research.</li>
    </ul>

    <h3>3. Disclosure of Information:</h3>
    <ul>
        <li>We do not sell, rent, or share your personal information with unaffiliated third parties without your consent, except as permitted by this privacy policy or as required by law.</li>
        <li>We may share your personal information with service providers who work on our behalf to provide and improve our services, such as payment processors, shipping services, and marketing services.</li>
    </ul>

    <h3>4. Security of Information:</h3>
    <ul>
        <li>We implement technical, administrative, and physical security measures to protect your information against unauthorized access, disclosure, misuse, and alteration.</li>
        <li>However, please note that no security measure is 100% secure, and we cannot guarantee the absolute security of your information.</li>
    </ul>

    <h3>5. Changes to Privacy Policy:</h3>
    <p>We reserve the right to modify this privacy policy at any time. We will notify you of any changes by prominently posting a notice on our website or by sending you an email.</p>

    <p>Effective Date: May 2nd, 2024</p>

    <p>Thank you for trusting Wanderbud for your travel and adventure needs. We hope you have an amazing experience with us!</p>
                </Col>

            </Row>
        </Container>
    )
}

export default PrivacyContainer;