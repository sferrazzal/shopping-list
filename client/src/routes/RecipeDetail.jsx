import React from "react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Item from "../components/Item";
import NavBar from "../components/NavBar";
import Header from "../components/Header";
import BackendApi from "../apis/BackendApi";

const RecipeDetail = () => {
    const location = useLocation();
    const recipeId = location.pathname.slice(-1);

    const [items, setItems] = useState();
    const [title, setTitle] = useState();

    useEffect(() => {
        const populateItems = async() => {
            const recipeInfo = await BackendApi.getRecipeInfo(recipeId);
            setItems(recipeInfo.items);
            setTitle(recipeInfo.title);
        }

        populateItems();
    }, [])

    return (
        <>
            <NavBar></NavBar>
            <Header text={title ? title: ""}></Header>
            <div>
                {items && items.map((item) => {
                    return <Item key={item.id} name={item.name} ></Item>
                })}
            </div>
        </>
    )
}

export default RecipeDetail;