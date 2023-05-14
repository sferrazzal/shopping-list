import React from "react";
import RemoveRecipeModal from "./RemoveRecipeModal";

const RemoveRecipeModalController = (props) => {
    return (
        <RemoveRecipeModal
        callback={props.callback} 
        key={props.id + props.recipe.title} 
        id={props.id} 
        recipe={props.recipe}
        />
    )
}

export default RemoveRecipeModalController;