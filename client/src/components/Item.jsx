import React from "react";
import { useState, useEffect } from "react";
import RemoveRecipeModalController from "./Modals/RemoveRecipeModalController";

const Item = (props) => {
    const [checked, setChecked] = useState(false);
    const [displayedQuantity, setDisplayedQuantity] = useState(props.quantity);
    const [textDecoration, setTextDecoration] = useState("none");
    const handleTextClicked = () => {
        if (props.clickable) {
            setTextDecoration(textDecoration === "none" ? "line-through" : "none");
        }
    }

    useEffect(() => {
        setDisplayedQuantity(props.quantity);
    }, [props.quantity]);

    const handleCheckClicked = () => {
        const newCheckedValue = !checked;
        setChecked(newCheckedValue);
        props.handleChecked(newCheckedValue, props.id, props.name, props.tags)
    }

    const handleQuantityChanged = (e) => {
        setDisplayedQuantity(e.target.value);
    }

    const submitQuantity = () => {
        if (displayedQuantity === props.quantity) return;
        props.handleQuantityChanged(props.id, displayedQuantity);
    }

    return (
        <li className="list-group-item">
            <div className="row">
                <div className="col d-flex justify-content-end my-1">
                    {props.recipes && props.recipes.map(recipe => (
                        <RemoveRecipeModalController 
                        callback={() => props.removeRecipeCallback(recipe)} 
                        key={props.id + recipe.title} 
                        id={props.id} 
                        recipe={recipe}
                        />
                    ))}
                </div>
                <div className="col">
                    <input onClick={handleCheckClicked} className="form-check-input me-1 text-center" type="checkbox" value=""/>
                    <h5 style={{textDecoration: textDecoration}} onClick={handleTextClicked} className="card-title text-center d-inline">{props.name}</h5>
                    {
                        'quantity' in props ?
                        <input 
                            type="number" 
                            value={displayedQuantity} 
                            className='w-25 ms-1 d-inline'
                            onChange={(e) => handleQuantityChanged(e)}
                            onBlur={submitQuantity}
                        ></input> :
                        null
                    }
                </div>
                <div className="col">
                    {props.tags && props.tags.map(tag => (<span className="badge bg-success mx-1" key={props.id + tag}>{tag}</span>))}
                </div>
            </div>
        </li>
    )
}

export default Item;