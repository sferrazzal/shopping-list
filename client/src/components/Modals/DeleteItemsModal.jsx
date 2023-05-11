import React from "react";
import Button from "react-bootstrap/Button";
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from "react";
import OperationOutcomes from "../../Enums/OperationOutcomes";

const DeleteItemsModal = (props) => {
    const [show, setShow] = useState(false);

    const handleShow = () => {
        if (props.checkedItems.length > 0) {
            setShow(true);
        }
    }

    const handleClose = () => {
        setShow(false);
    }

    useEffect(() => {
        if (props.deleteItemsOperationStatus === OperationOutcomes.SUCCESS) {

        }
    }, [props.deleteItemsOperationStatus])

    const handleDelete = async() => {
        const success = await props.handleDelete();
        if (success) {
            handleClose();
        } else {
            console.log("failed");
        }
    }

    return (
        <>
            <Button className="col" variant="danger" onClick={handleShow}>Delete Selected Item(s)</Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Items</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center fw-bold mb-3">Deleting items from the database will remove them from all lists.<br/><br/> Are you sure you want to delete the following items?</div>
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