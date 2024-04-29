import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { SideAccordion } from "./SideAccordion";

export const MessageContainer = () => {
    return (
        <Row className="w-100">
            <Col md={4} className="message-container container-shadow">
                <SideAccordion title="Messages" extraClass="none" scrollbar={true} collapsed={true} />
            </Col>
        </Row>
    )
}