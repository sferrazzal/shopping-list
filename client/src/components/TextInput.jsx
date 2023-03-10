import React from "react";
import { useState } from "react";

const TextInput = (props) => {
    const [inputText, setInputText] = useState("");

    const handleTextFieldChange = (e) => {
        setInputText(e.target.value);
    }

    const handleClick = () => {
        if (inputText === "") return;
        const succeeded = props.callback(inputText);
        if (succeeded) {
            console.log("text input callback succeeded");
            setInputText("");
        } else {
            console.error("Text input callback error");
        }
    }

    return (
        <div className="container input-group my-3">
            <input onChange={e => handleTextFieldChange(e)} type="text" className="form-control" placeholder={props.placeholderText} value={inputText}/>
            <button onClick={handleClick} className="btn btn-primary">{props.buttonText}</button>
        </div>
    )
}

export default TextInput;