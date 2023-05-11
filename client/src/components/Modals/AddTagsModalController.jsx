import React, {useState} from "react";
import AddTagsModal from "./AddTagsModal";
import OperationOutcomes from "../../Enums/OperationOutcomes";

const AddTagsModalController = (props) => {
    const [resultText, setResultText] = useState("");
    const [addTagOperationStatus, setAddTagOperationStatus] = useState(OperationOutcomes.NULL);

    const handleAddTag = async (tagText) => {
        setAddTagOperationStatus(OperationOutcomes.NULL);

        const result = await props.handleAddTag(tagText);
        if (result.status === "success" && result.duplicateCount > 0) {
          setAddTagOperationStatus(OperationOutcomes.SUCCESS);
          setResultText(`${result.addedRecordCount} tags added, ${result.duplicateCount} duplicate tag(s) unchanged.`);
        }
        else if (result.status === "success") {
          setAddTagOperationStatus(OperationOutcomes.SUCCESS);
          setResultText("Tag(s) updated!");
        } else {
            setAddTagOperationStatus(OperationOutcomes.FAILURE);
          setResultText("Couldn't add tags to items");
        }
      }

    const resetTagResults = () => {
        setAddTagOperationStatus(OperationOutcomes.NULL);
        setResultText("");
    }

    return (
        <AddTagsModal
            handleClose={resetTagResults}
            handleInputChange={resetTagResults}
            handleAddTag={handleAddTag}
            checkedItems={props.checkedItems}
            resultText={resultText}
            addTagOperationStatus={addTagOperationStatus}
        />
    )
}

export default AddTagsModalController