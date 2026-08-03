import React from "react";
import { Modal, Button } from "react-bootstrap";

const CustomModal = ({
    show,
    handleClose,
    title,
    children,
    handleSubmit,
}) => {

    return (

        <Modal show={show} onHide={handleClose} centered>

            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>

                {children}

            </Modal.Body>

            <Modal.Footer>

                <Button
                    variant="secondary"
                    onClick={handleClose}
                >
                    Cancel
                </Button>

                <Button
                    variant="primary"
                    onClick={handleSubmit}
                >
                    Save
                </Button>

            </Modal.Footer>

        </Modal>

    );

};

export default CustomModal;