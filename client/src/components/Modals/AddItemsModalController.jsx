import React from "react";
import {useState} from "react";
import BackendApi from "../../apis/BackendApi";
import AddItemsModal from "./AddItemsModal";
import OperationOutcomes from "../../Enums/OperationOutcomes";

const AddItemsModalController = (props) => {
    const [searchResults, setSearchResults] = useState([]);
    const [resultText, setResultText] = useState("");
    const [addItemOperationStatus, setAddItemOperationStatus] = useState(OperationOutcomes.NULL);

    const updateSearchResults = async(searchString) => {
        resetSearchResults();

        if (searchString === "") {
          return;
        }

        const results = await BackendApi.getItemsStartingWith(searchString);
        setSearchResults(results);
      }

    const resetSearchResults = () => {
        setResultText("");
        setSearchResults([]);
    }
    
    const handleAddItem = async (itemName, clearOnSuccess) => {
        setAddItemOperationStatus(OperationOutcomes.NULL);
        const itemExistsInDatabase = searchResults.includes(itemName);
        if (itemExistsInDatabase && !props.allowDuplicateDatabaseEntries) {
            setAddItemOperationStatus(OperationOutcomes.FAILURE);
            setResultText("Item already in database");
            return;
        } 
        
        const result = await props.handleAddItem(itemName);

        if (result.status === "success") {
            setAddItemOperationStatus(OperationOutcomes.SUCCESS);
            setResultText("Item added");
            if (clearOnSuccess) {
                setSearchResults([]);
            }
            return;
        } else {
            setAddItemOperationStatus(OperationOutcomes.FAILURE);
            setResultText(result.failureReason);    
            return;
        }
    }


    return (
        <AddItemsModal
            searchResults={searchResults}
            handleInputChange={updateSearchResults}
            handleAddItem={handleAddItem}
            handleClose={resetSearchResults}
            resultText={resultText}
            operationStatus={addItemOperationStatus}
            allowAddingFromSearchResults={props.allowAddingFromSearchResults}
        />
    )
}

export default AddItemsModalController;