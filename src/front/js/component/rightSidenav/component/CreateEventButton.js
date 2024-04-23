import React from "react";
import { Button } from "react-bootstrap";
import { FaPlusCircle } from 'react-icons/fa';

export const CreateEventButton = ({ handleClick }) => (
    <Button
        variant="create"
        className="d-flex align-items-center justify-content-between w-100 rounded-pill m-0 mt-4"
        onClick={handleClick}
    >
        Create New Event
        <FaPlusCircle className="ms-2" />
    </Button>
);