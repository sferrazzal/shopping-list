import React from "react";
import {useState} from "react";
import BackendApi from "../../apis/BackendApi";
import AddRecipeModal from "./AddRecipeModal";
import OperationOutcomes from "../../Enums/OperationOutcomes";

const AddRecipeModalController = (props) => {
    const [searchResults, setSearchResults] = useState([]);
    const [resultText, setResultText] = useState("");
    const [addRecipeOperationStatus, setAddRecipeOperationStatus] = useState(OperationOutcomes.NULL);

    const updateSearchResults = async (searchString) => {
        setAddRecipeOperationStatus(OperationOutcomes.NULL);
        if (searchString === "") {
            setSearchResults([]);
            return;
        }

        setResultText("");
        const results = await BackendApi.getRecipesStartingWith(searchString);
        setSearchResults(results);
    }

    const resetSearchResults = () => {
        setResultText("");
        setSearchResults([]);
    }

    const handleAddRecipe = async (recipe) => {
        setAddRecipeOperationStatus(OperationOutcomes.NULL);
        const result = await props.handleAddRecipe(recipe);
        if (result.status === 'success') {
            setAddRecipeOperationStatus(OperationOutcomes.SUCCESS);
            
            if (result.addedRecipe === null) {
                setAddRecipeOperationStatus(OperationOutcomes.NOCHANGE);
                setResultText(`Recipe "${recipe.title}" already in list`);
            } else {
                setAddRecipeOperationStatus(OperationOutcomes.SUCCESS);
                setResultText(`Successfully added recipe "${recipe.title}"`);
                setSearchResults([]);
            }
        } else if (result.status === 'failure') {
            setAddRecipeOperationStatus(OperationOutcomes.FAILURE);
            setResultText(`Failed to add recipe`);
        }
    }

    return (
        <AddRecipeModal
            searchResults={searchResults}
            handleInputChange={updateSearchResults}
            handleRecipeClicked={handleAddRecipe}
            handleClose={resetSearchResults}
            operationOutcomes={OperationOutcomes}
            addRecipeOperationStatus={addRecipeOperationStatus}
            resultText={resultText}
        />
    );

}

export default AddRecipeModalController;