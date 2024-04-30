import { el } from "date-fns/locale/el";
import React from "react";
import { Col, Row } from "react-bootstrap";

export const CenterMessage = ({ day }) => {

    const handleDay = (date) => {
        if (!date.includes("/")) {
            return date;
        }
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const partsDate = date.split("/");
        const messageDate = new Date(partsDate[2], partsDate[1] - 1, partsDate[0]);
        const daysBetweenDates = (date1, date2) => {
            const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
            const firstDate = new Date(date1);
            const secondDate = new Date(date2);
            const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
            return diffDays;
        };

        const daysDiff = daysBetweenDates(currentDate, messageDate);

        if (daysDiff === 0) {
            return "Today";
        } else if (daysDiff === 1) {
            return "Yesterday";
        } else {
            return `${messageDate.getDate()}/${messageDate.getMonth()}/${messageDate.getFullYear()}`;
        }
    }


    return (
        <Row className="justify-content-center align-items-center m-0 my-1 pe-0 ps-2" style={{ height: "fit-content", position: "sticky", top: "13%" }}>
            <Col md={11} className="d-flex flex-column align-items-end message-chat">
                <div className="rounded m-0 p-2 flex-grow-1">
                    <h5 className="m-0" style={{ fontSize: "0.8rem" }}><span class="badge text-bg-secondary">{handleDay(day)}</span></h5>
                </div>
            </Col>
        </Row>
    );
}