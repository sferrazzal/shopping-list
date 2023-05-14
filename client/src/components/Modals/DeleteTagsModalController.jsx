import React, {useState} from "react";
import OperationOutcomes from "../../Enums/OperationOutcomes";
import DeleteTagsModal from "./DeleteTagsModal";

const DeleteTagsModalController = (props) => {
    const [resultText, setResultText] = useState('');
    const [operationStatus, setoperationStatus] = useState(OperationOutcomes.NULL);

    const handleDeleteTag = async (tag) => {
        setoperationStatus(OperationOutcomes.NULL);
        const result = await props.handleDeleteTag(tag);
        if (result.status === 'success') {
            setoperationStatus(OperationOutcomes.SUCCESS);
            setResultText(`Deleted tag ${tag} from ${result.deletedTagCount} items`);
        } else {
            setoperationStatus(OperationOutcomes.FAILURE);
            setResultText('Failed to delete tags');
        }
    }

    const handleClose = () => {
        setResultText("");
        setoperationStatus(OperationOutcomes.NULL);
    }

    return (
        <DeleteTagsModal
            checkedItems={props.checkedItems}
            handleDeleteTag={handleDeleteTag}
            handleClose={handleClose}
            deleteTagOperationStatus={operationStatus}
            deleteTagOperationResultText={resultText}
        />
    )
}

export default DeleteTagsModalController;