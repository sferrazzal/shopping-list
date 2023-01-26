import NavBar from "../components/NavBar";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import BackendApi from "../apis/BackendApi";
import RecipeInfo from "../components/RecipeInfo";

const Recipes = () => {
    const [recipes, setRecipes] = useState();
    useEffect(() => {
        const populateRecipes = async () => {
            const result = await BackendApi.getAllRecipes();
            setRecipes(result);
        }

        populateRecipes();
    }, [])

    return (
        <div>
            <NavBar></NavBar>
            <div className="container-fluid">
                <Header text="Recipes"></Header>
                {recipes && recipes.map((recipe) => {
                    return (
                        <RecipeInfo key={recipe.id} id={recipe.id} title={recipe.title}></RecipeInfo>
                    )
                })}
            </div>
        </div>
    )
}

export default Recipes;