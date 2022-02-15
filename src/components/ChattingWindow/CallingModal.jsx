import React, { memo } from "react";
import { Modal, Button } from "react-bootstrap";
const CallingModal = (props) => {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Calling {props.targetName}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>Calling ...</h4>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default memo(CallingModal);