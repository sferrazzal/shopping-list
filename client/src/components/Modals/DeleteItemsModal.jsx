import React from "react";
import Button from "react-bootstrap/Button";
import Modal from 'react-bootstrap/Modal'
import { useState } from "react";

const DeleteItemsModal = (props) => {
    const [show, setShow] = useState(false);

    const handleShow = () => {
        if (props.checkedItems.length !== 0) {
            setShow(true);
        }
    }

    const handleClose = () => {
        setShow(false);
    }

    const handleDelete = async() => {
        const success = await props.callback();
        if (success) {
            handleClose();
        } else {
            console.log("failed");
        }
    }

    return (
        <>
            <Button className="col" variant="danger" onClick={handleShow}>Delete Selected Items</Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Items</Modal.Title>

                </Modal.Header>
                <Modal.Body>
                    <div className="text-center fw-bold mb-3">Delete the following items. Are you sure?</div>
                    <ul className="list-group mb-3">
                        {props.checkedItems.map((x) => {
                            return <li className="list-group-item" key={x.id}>{x.name}</li>
                        })}
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => handleDelete()}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </>
    )


}

export default DeleteItemsModal;