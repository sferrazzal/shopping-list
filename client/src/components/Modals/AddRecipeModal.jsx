import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/esm/Button';
import {useState} from 'react';
import CloseButton from 'react-bootstrap/esm/CloseButton';
import BackendApi from '../../apis/BackendApi';

const AddRecipeModal = (props) => {
    const [show, setShow] = useState(false);
    const [inputText, setInputText] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    // Result Info
    const [addRecipeResultText, setAddRecipeResultText] = useState("");
    const [resultColor, setResultColor] = useState("text-success");

    const handleShow = () => {
        setShow(true);
    }

    const handleClose = () => {
        setShow(false);
        setInputText("");
        setSearchResults([]);
        setAddRecipeResultText("");
    }

    const updateSearchResults = async (searchString) => {
        if (searchString === "") {
            setSearchResults([]);
            return;
        }

        const results = await BackendApi.getRecipesStartingWith(searchString);
        setSearchResults(results);
    }

    const handleInputChange = (e) => {
        e.preventDefault();
        setInputText(e.target.value);
        updateSearchResults(e.target.value);
        setAddRecipeResultText("");
    }

    const handleAddRecipe = async (recipeId, recipeTitle) => {
        const result = await props.callback(recipeId);
        if (result.status === 'success') {
            setResultColor('text-success');
            if (result.addedRecipe === null) {
                setAddRecipeResultText(`Recipe "${recipeTitle}" already in list`);
            } else {
                setAddRecipeResultText(`Successfully added ${recipeTitle}`);
            }
            setInputText('');
            setSearchResults([]);
        } else if (result.status === 'failure') {
            setAddRecipeResultText(`Failed to add recipe`);
            setResultColor('text-danger');
        }
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
                    <div className={resultColor}>{addRecipeResultText}</div>
                </div>

                <div className="searchHits">
                    {
                        searchResults.length > 0 ? 
                        <div className="my-1">Matching Recipes</div> :
                        null
                    }
                    <ul className="list-group">
                        {searchResults.map((result) => {
                            return (
                                <li className="list-group-item list-group-item-action" key={result.id} onClick={() => handleAddRecipe(result.id, result.title)}>{result.title}</li>
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