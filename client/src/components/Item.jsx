import React from "react";
import { useState } from "react";

const Item = (props) => {
    const [textDecoration, setTextDecoration] = useState("none");
    const handleClick = () => {
        if (props.clickable) {
            setTextDecoration(textDecoration === "none" ? "line-through" : "none");
        }
    }

    return (
        <div className="container">
            <div className="card">
                <div className="card-body">
                    <h5 style={{textDecoration: textDecoration}} onClick={handleClick} className="card-title text-center">{props.name}</h5>
                </div>
            </div>
        </div>
    )
}

export default Item;