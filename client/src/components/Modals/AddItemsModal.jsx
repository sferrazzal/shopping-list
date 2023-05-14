import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import OperationOutcomes from '../../Enums/OperationOutcomes';
import ResultTextColors from '../../Enums/ResultTextColors';

function AddItemsModal(props) {
  const [show, setShow] = useState(false);
  const [inputText, setInputText] = useState("");
  const [resultColor, setResultColor] = useState("text-success");
  const [clearInputOnSuccess, setClearInputOnSuccess] = useState(false);

  useEffect(() => {
    if (props.operationStatus === OperationOutcomes.FAILURE) {
      setResultColor(ResultTextColors.FAILURE);
    } else {
      setResultColor(ResultTextColors.SUCCESS);
        if (clearInputOnSuccess) {
          setInputText('');
          setClearInputOnSuccess(false);
        } 
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
    props.handleInputChange(e.target.value);
  }

  const handleAddItem = (itemName, clearOnSuccess) => {
    setClearInputOnSuccess(clearOnSuccess);
    if (inputText === "") return;
    props.handleAddItem(itemName, clearOnSuccess);
  }

  return (
    <>
      <Button className="col" variant="primary" onClick={handleShow}>Add New Item(s)</Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Item(s)</Modal.Title>
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
                  placeholder="Enter new item name"
                  value={inputText}
              />
            </div>
            <div className={resultColor} >{props.resultText}</div>
          </div>

          <div className="searchHits">
            {
            props.searchResults && props.searchResults.length > 0 ?
              props.allowAddingFromSearchResults ?
                <div className="hover">Existing items - press to add</div> :
                <div>Existing items</div> :
              null
            }
            <ul className="list-group" >
              {props.searchResults && props.searchResults.map((result, index) => {
                return props.allowAddingFromSearchResults ?
                <li className="list-group-item list-group-item-action" onClick={() => handleAddItem(result, false)} key={index}>{result}</li> :
                <li className="list-group-item" key={index}>{result}</li>
              })}
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => handleAddItem(inputText, true)}>
            Add New Item
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddItemsModal;