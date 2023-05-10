import React from "react";
import {useState} from "react";
import BackendApi from "../../apis/BackendApi";
import AddRecipeModal from "./AddRecipeModal";

const AddRecipeModalController = (props) => {
    const [searchResults, setSearchResults] = useState([]);

    const operationOutcomes = Object.freeze({
        Null: '',
        Success: 'Success',
        NoChange: 'NoChange',
        Failure: 'Failure'
    });
    const [addRecipeOperationStatus, setAddRecipeOperationStatus] = useState(operationOutcomes.Null);

    const updateSearchResults = async (searchString) => {
        setAddRecipeOperationStatus(operationOutcomes.Null);
        if (searchString === "") {
            setSearchResults([]);
            return;
        }

        const results = await BackendApi.getRecipesStartingWith(searchString);
        setSearchResults(results);
    }

    const resetSearchResults = () => {
        setSearchResults([]);
    }

    const handleAddRecipe = async (recipe) => {
        const result = await props.handleAddRecipe(recipe);
        if (result.status === 'success') {
            setAddRecipeOperationStatus(operationOutcomes.Success);
            if (result.addedRecipe === null) {
                setAddRecipeOperationStatus(operationOutcomes.NoChange);
            } else {
                setAddRecipeOperationStatus(operationOutcomes.Success);
                setSearchResults([]);
            }
        } else if (result.status === 'failure') {
            setAddRecipeOperationStatus(operationOutcomes.Failure);
        }
    }

    return (
        <AddRecipeModal
            searchResults={searchResults}
            handleInputChange={(searchString) => updateSearchResults(searchString)}
            handleRecipeClicked={handleAddRecipe}
            handleClose={() => resetSearchResults()}
            operationOutcomes={operationOutcomes}
            addRecipeOperationStatus={addRecipeOperationStatus}
        />
    );

}

export default AddRecipeModalController;