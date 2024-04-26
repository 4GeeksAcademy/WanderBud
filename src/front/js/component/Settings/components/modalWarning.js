import React, { useEffect, useState, useContext } from "react";
import { Modal, Button, useAccordionButton } from 'react-bootstrap';
import { Context } from "../../../store/appContext";

export const ModalWarning = ({ show, handleConfirm, handleClose, title, body }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title><h1>Update Profile</h1></Modal.Title>
            </Modal.Header>
            <Modal.Body>{body}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleConfirm}>
                    Confirm
                </Button>
                <Button variant="google" onClick={handleClose}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
}