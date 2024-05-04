import React, { useContext, useState, useEffect } from "react";
import { Modal, Button } from 'react-bootstrap';
import { Context } from "../store/appContext";

export const ModalAlert = () => {
    const { store, actions } = useContext(Context);
    const [show, setShow] = useState(store.storeShow);
    const handleClose = () => actions.hideAlert();
    const [alertTitle, setAlertTitle] = useState(store.alertTitle);
    const [alertBody, setAlertBody] = useState(store.alertBody);

    useEffect(() => {
        setShow(store.storeShow);
        setAlertTitle(store.alertTitle);
        setAlertBody(store.alertBody);
    }
        , [store.storeShow, store.alertTitle, store.alertBody]);


    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title><h1>{alertTitle}</h1></Modal.Title>
            </Modal.Header>
            <Modal.Body>{alertBody}</Modal.Body>
            <Modal.Footer>
                <Button className={(store.alertTitle !== 'Welcome to WanderBud' ? "" : "d-none")} variant="google" onClick={handleClose}>
                    Close
                </Button>
                <Button className={(store.alertTitle === 'Welcome to WanderBud' ? "" : "d-none")} variant="upload" onClick={handleClose}>
                    Create your profile
                </Button>
            </Modal.Footer>
        </Modal>
    );
}