import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import BackendApi from '../../apis/BackendApi';

function AddItemsModal(props) {
  const [show, setShow] = useState(false);
  const [inputText, setInputText] = useState("");
  const [searchResults, setSearchResults] = useState([])

  // Result Info
  const [addItemResultText, setAddItemResultText] = useState("");
  const [resultColor, setResultColor] = useState("text-success");

  const handleClose = () => {
    setShow(false);
    setInputText("");
    setAddItemResultText("");
    setSearchResults([]);
  }
  const handleShow = () => setShow(true);

  const handleInputChange = (e) => {
    e.preventDefault();
    setInputText(e.target.value);
    updateSearchResults(e.target.value);
    setAddItemResultText("");
  }

  const updateSearchResults = async(searchString) => {
    if (searchString === "") {
      setSearchResults([]);
      return;
    }
    const results = await BackendApi.getItemsStartingWith(searchString);
    setSearchResults(results);
  }

  const handleAddItem = async () => {
    if (inputText === "") return;
    if (searchResults.includes(inputText)) {
      setResultColor("text-danger");
      setAddItemResultText("Already in database");
      return;
    }
    
    const result = await props.callback(inputText);
    setResultColor("text-success");
    setAddItemResultText("Item added");

    setInputText("");
  }

  return (
    <>
      <Button className="col" variant="primary" onClick={handleShow}>
        Add New Item(s)
      </Button>

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
            <div className={resultColor} >{addItemResultText}</div>
          </div>

          <div className="searchHits">
            {searchResults.length > 0? <div>Existing items</div>: null}
            <ul className="list-group" >
              {searchResults.map((result, index) => {
                return <li className="list-group-item" key={index}>{result}</li>
              })}
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleAddItem}>
            Add Item
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddItemsModal;