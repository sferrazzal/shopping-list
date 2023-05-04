import Modal from 'react-bootstrap/Modal';
import React from "react";
import Button from 'react-bootstrap/esm/Button';
import CloseButton from 'react-bootstrap/esm/CloseButton';
import { useState } from 'react';

const RemoveRecipeModal = (props) => {
    const [show, setShow] = useState(false);

    const handleShow = () => {
        setShow(true);
    }

    const handleHide = () => {
        setShow(false);
    }

    const handleRemoveRecipe = () => {
        props.callback();
    }

    return (
        <>
            <Button className="badge bg-danger mx-1" key={props.id + props.recipe.title} onClick={() => handleShow()}>{props.recipe.title}</Button>
            <Modal show={show} onHide={() => handleHide()}>
                <Modal.Header>
                    <Modal.Title>Remove Recipe</Modal.Title>
                    <CloseButton onClick={() => handleHide()}></CloseButton>                    
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center fw-bold fs-5 mb-3">Removing recipe "{props.recipe.title}" will change the following item quantities. Items with 0 quantity will be removed. Proceed?</div>
                    <div className='row'>
                        <div className="col text-center fw-bold">Item</div>
                        <div className="col text-center fw-bold">Quantity Change</div>
                    </div>
                    <ul className="list-group mb-3">
                        {props.recipe.items.map((item) => {
                            return <li className="list-group-item" key={props.recipe.title + item.id}>
                                        <div className='row'>
                                            <div className="col text-center">{item.name}</div>
                                            <div className="col text-center">{"-" + item.quantity}</div>
                                        </div>
                                    </li>
                        })}
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="bg-danger" onClick={() => handleRemoveRecipe()}>Remove Recipe</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default RemoveRecipeModal;