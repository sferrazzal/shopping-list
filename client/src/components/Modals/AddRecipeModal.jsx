import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/esm/Button';
import {useState, useEffect} from 'react';
import CloseButton from 'react-bootstrap/esm/CloseButton';

const AddRecipeModal = (props) => {
    const [show, setShow] = useState(false);
    const [inputText, setInputText] = useState("");
    const [submittedRecipeTitle, setSubmittedRecipeTitle] = useState("");

    const [resultText, setResultText] = useState("");

    const resultTextColors = Object.freeze({
        Success: "text-success",
        Failure: "text-danger"
    });
    const [resultTextColor, setResultTextColor] = useState(resultTextColors.Success);

    useEffect(() => {
        if (props.addRecipeOperationStatus === props.operationOutcomes.Success) {
            setResultTextColor(resultTextColors.Success);
            setResultText(`Successfully added recipe "${submittedRecipeTitle}"`);
            setInputText('');
        } else if (props.addRecipeOperationStatus === props.operationOutcomes.NoChange) {
            setResultTextColor(resultTextColors.Success);
            setResultText(`Recipe "${submittedRecipeTitle}" already in list`);
        } else if (props.addRecipeOperationStatus === props.operationOutcomes.Failure) {
            setResultTextColor(resultTextColors.Failure);
            setResultText(`Failed to add recipe`);
        }

        setSubmittedRecipeTitle("");
    }, [props.operationOutcomes])

    const handleShow = () => {
        setShow(true);
    }

    const handleClose = () => {
        setShow(false);
        setInputText("");
        setResultText("");
        props.handleInputChange("");
        props.handleClose();
    }

    const handleInputChange = (e) => {
        e.preventDefault();
        setInputText(e.target.value);
        setResultText("");
        props.handleInputChange(e.target.value);
    }

    const handleRecipeClicked = async (recipe) => {
        setSubmittedRecipeTitle(recipe.title);
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
                    <div className={resultTextColor}>{resultText}</div>
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