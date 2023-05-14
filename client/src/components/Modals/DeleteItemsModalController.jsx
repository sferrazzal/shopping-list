import DeleteItemsModal from "./DeleteItemsModal";
import React from 'react';

const DeleteItemsModalController = (props) => {

    const handleDelete = async() => {
        const success = await props.handleDeleteCheckedItems();
        return success;
    }

    return (
        <DeleteItemsModal
            checkedItems={props.checkedItems}
            handleDelete={handleDelete}
        />
    )
}

export default DeleteItemsModalController;