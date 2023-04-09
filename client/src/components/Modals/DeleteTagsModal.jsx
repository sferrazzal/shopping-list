import React from 'react';
import Button from 'react-bootstrap/esm/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import CloseButton from 'react-bootstrap/esm/CloseButton';
import DeleteTagsModalCheckedItemList from './DeleteTagsModalCheckedItemList';

const DeleteTagsModal = (props) => {
    const [show, setShow] = useState(false);
    const [inputText, setInputText] = useState('');

    const [resultText, setResultText] = useState('');
    const [resultTextColor, setResultTextColor] = useState('text-success');

    const handleShow = () => {
        if (props.checkedItems.length > 0){
            setShow(true);
        }
    }

    const handleClose = () => {
        setShow(false);
        setInputText('');
        setResultText('');
    }

    const handleDeleteTag = async () => {
        const result = await props.callback(inputText);
        if (result.status === 'success') {
            setInputText('');
            setResultTextColor('text-success');
            setResultText(`Deleted tag ${inputText} from ${result.deletedTagCount} items`);
        } else {
            setResultTextColor('text-danger');
            setResultText('Failed to delete tags');
        }
    }

    const handleInputChange = (e) => {
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
                    {resultText !== "" ? <div className={resultTextColor}>{resultText}</div> : null}
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