import React from "react";
import { useState } from "react";

const Item = (props) => {
    const [checked, setChecked] = useState(false);
    const [textDecoration, setTextDecoration] = useState("none");
    const handleTextClicked = () => {
        if (props.clickable) {
            setTextDecoration(textDecoration === "none" ? "line-through" : "none");
        }
    }

    const handleCheckClicked = () => {
        const newCheckedValue = !checked;
        setChecked(newCheckedValue);
        props.handleChecked(newCheckedValue, props.id)
    }

    return (
        <li className="list-group-item">
            <div className="row">
                <div className="col"></div>
                <div className="col">
                    <input onClick={handleCheckClicked} className="form-check-input me-1 text-center" type="checkbox" value=""/>
                    <h5 style={{textDecoration: textDecoration}} onClick={handleTextClicked} className="card-title text-center d-inline">{props.name}</h5>
                </div>
                <div className="col">
                    {props.tags && props.tags.map(tag => (<span className="badge bg-success mx-1" key={props.id + tag}>{tag}</span>))}
                </div>
            </div>
        </li>
    )
}

export default Item;