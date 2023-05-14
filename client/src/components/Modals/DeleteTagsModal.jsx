import React from 'react';
import Button from 'react-bootstrap/esm/Button';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from 'react';
import CloseButton from 'react-bootstrap/esm/CloseButton';
import DeleteTagsModalCheckedItemList from './DeleteTagsModalCheckedItemList';
import ResultTextColors from '../../Enums/ResultTextColors';
import OperationOutcomes from '../../Enums/OperationOutcomes';

const DeleteTagsModal = (props) => {
    const [show, setShow] = useState(false);
    const [inputText, setInputText] = useState('');
    const [resultTextColor, setResultTextColor] = useState(ResultTextColors.SUCCESS);

    useEffect(() => {
        if (props.deleteTagOperationStatus === OperationOutcomes.SUCCESS) {
            setResultTextColor(ResultTextColors.SUCCESS);
            setInputText('');
        } else if (props.deleteTagOperationStatus === OperationOutcomes.FAILURE) {
            setResultTextColor(ResultTextColors.FAILURE);
        }
    }, [props.deleteTagOperationStatus])

    const handleShow = () => {
        if (props.checkedItems.length > 0){
            setShow(true);
        }
    }

    const handleClose = () => {
        setShow(false);
        setInputText('');
        props.handleClose();
    }

    const handleDeleteTag = async () => {
        await props.handleDeleteTag(inputText);
    }

    const handleInputChange = (e) => {
        e.preventDefault();
        setInputText(e.target.value);
    }

    const handleTagClick = (tagName) => {
        setInputText(tagName);
    }

    return (
        <>
            <Button className='col' variant='danger' onClick={handleShow}>Delete Tags From Selected Item(s)</Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>Delete Tags</Modal.Title>
                    <CloseButton onClick={handleClose}/>
                </Modal.Header>
                <Modal.Body>
                    <input type='text' className='form-control' placeholder='Enter or select tag' value={inputText} onChange={(e) => handleInputChange(e)}></input>
                    {props.deleteTagOperationResultText !== "" ? <div className={resultTextColor}>{props.deleteTagOperationResultText}</div> : null}
                    <div className='mt-2'>Selected Items</div>
                    <ul className='list-group border border-secondary rounded mb-2'>
                        {<DeleteTagsModalCheckedItemList checkedItems={props.checkedItems} callback={(tag) => handleTagClick(tag)}/>}
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='danger' onClick={handleDeleteTag}>Delete Tag(s)</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default DeleteTagsModal;