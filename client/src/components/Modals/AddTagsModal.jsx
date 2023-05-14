import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import OperationOutcomes from '../../Enums/OperationOutcomes';
import ResultTextColors from '../../Enums/ResultTextColors';

function AddTagsModal(props) {
  const [show, setShow] = useState(false);
  const [inputText, setInputText] = useState("");

  const [resultColor, setResultColor] = useState("text-success");
  
  useEffect(() => {
    if (props.addTagOperationStatus === OperationOutcomes.SUCCESS) {
        setInputText('');
    }

    if (props.addTagOperationStatus === OperationOutcomes.FAILURE) {
        setResultColor(ResultTextColors.FAILURE);
    } else {
        setResultColor(ResultTextColors.SUCCESS);
    }
  }, [OperationOutcomes, props.resultText])

  const handleClose = () => {
    setShow(false);
    setInputText("");
    props.handleClose();
  }

  const handleShow = () => setShow(true);

  const handleInputChange = (e) => {
    e.preventDefault();
    setInputText(e.target.value);
    props.handleInputChange();
  }

  const handleAddTag = async () => {
    if (inputText === "") return;
    await props.handleAddTag(inputText);
  }

  return (
    <>
      <Button className="col" variant="primary" onClick={handleShow}>
        Add tags to selected item(s)
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Tags</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-2">
            <div className="row mx-0 px-0">
              <input
                  onChange = {(e) => handleInputChange(e)}
                  className="form-control-lg border border-primary" 
                  type="text"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  placeholder="Enter new tag text"
                  value={inputText}
              />
            </div>
            <div className={resultColor} >{props.resultText}</div>
            <div>
              <div className="text-center my-2">Items to tag:</div>
              <ul className="list-group">
                {
                props.checkedItems.length > 0 ? 
                props.checkedItems.map(x => { return <li className="list-group-item" key={x.id}>{x.name}</li>}) :
                null
                }
              </ul>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleAddTag}>
            Add tag
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddTagsModal;