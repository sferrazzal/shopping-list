import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/esm/Button';
import {useState, useEffect} from 'react';
import CloseButton from 'react-bootstrap/esm/CloseButton';
import OperationOutcomes from '../../Enums/OperationOutcomes';
import ResultTextColors from '../../Enums/ResultTextColors';

const AddRecipeModal = (props) => {
    const [show, setShow] = useState(false);
    const [inputText, setInputText] = useState("");

    const [resultTextColor, setResultTextColor] = useState(ResultTextColors.SUCCESS);

    useEffect(() => {
        if (props.addRecipeOperationStatus === OperationOutcomes.SUCCESS) {
            setInputText('');
        }

        if (props.addRecipeOperationStatus === OperationOutcomes.FAILURE) {
            setResultTextColor(ResultTextColors.FAILURE);
        } else {
            setResultTextColor(ResultTextColors.SUCCESS);
        }
    }, [OperationOutcomes])

    const handleShow = () => {
        setShow(true);
    }

    const handleClose = () => {
        setShow(false);
        setInputText("");
        props.handleInputChange("");
        props.handleClose();
    }

    const handleInputChange = (e) => {
        e.preventDefault();
        setInputText(e.target.value);
        props.handleInputChange(e.target.value);
    }

    const handleRecipeClicked = async (recipe) => {
        await props.handleRecipeClicked(recipe);
    }

    return (
        <>
        <Button className="col" variant="primary" onClick={handleShow}>Add Recipe</Button>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>Add Items From Recipe</Modal.Title>
                <CloseButton onClick={handleClose}></CloseButton>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-2">
                    <div className="row mx-0 px-0">
                        <input
                            type="text" 
                            placeholder="Search for recipes" 
                            className="form-control" 
                            onChange={(e) => handleInputChange(e)}
                            value={inputText}
                        ></input>
                    </div>
                    <div className={resultTextColor}>{props.resultText}</div>
                </div>

                <div className="searchHits">
                    {
                        props.searchResults && props.searchResults.length > 0 ? 
                        <div className="my-1">Matching Recipes</div> :
                        null
                    }
                    <ul className="list-group">
                        {props.searchResults && props.searchResults.map((recipe) => {
                            return (
                                <li className="list-group-item list-group-item-action" key={recipe.id} onClick={async () => await handleRecipeClicked(recipe)}>{recipe.title}</li>
                            )
                        })}
                    </ul>
                </div>
            </Modal.Body>
        </Modal>
        </>
    );
}

export default AddRecipeModal;