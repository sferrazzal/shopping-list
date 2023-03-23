import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function AddTagsModal(props) {
  const [show, setShow] = useState(false);
  const [inputText, setInputText] = useState("");

  // Result Info
  const [addTagResultText, setAddTagResultText] = useState("");
  const [resultColor, setResultColor] = useState("text-success");

  const handleClose = () => {
    setShow(false);
    setInputText("");
    setAddTagResultText("");
  }

  const handleShow = () => setShow(true);

  const handleInputChange = (e) => {
    e.preventDefault();
    setInputText(e.target.value);
    setAddTagResultText("");
  }

  const handleAddTag = async () => {
    if (inputText === "") return;
    const result = await props.callback(inputText);
    if (result.status === "success" && result.duplicateCount > 0) {
      setResultColor("text-success");
      setAddTagResultText(`${result.addedRecordCount} tags added, ${result.duplicateCount} duplicate tag(s) unchanged.`);
      setInputText("");
    }
    else if (result.status === "success") {
      setResultColor("text-success");
      setAddTagResultText("Tag(s) updated!");
      setInputText("");
    } else {
      setResultColor("text-danger");
      setAddTagResultText("Couldn't add tags to items");
    }
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
            <div className={resultColor} >{addTagResultText}</div>
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