import React from "react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import BackendApi from "../apis/BackendApi";
import Header from "../components/Header";
import Item from "../components/Item";
import AddItemsModal from "../components/Modals/AddItemsModal";
import AddRecipeModal from "../components/Modals/AddRecipeModal";
import NavBar from "../components/NavBar";

const ListDetail = () => {
    const [title, setTitle] = useState();
    const [items, setItems] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [recipesForItems, setRecipesForItems] = useState([]);
    const [checkedItemIds, setCheckedItemIds] = useState([]);

    const location = useLocation();
    // TODO: Should use params
    const listId = location.pathname.slice(-1);
    
    useEffect(() => {
        const populateListInfo = async () => {
            const listInfo = await BackendApi.getListInfo(listId);
            setTitle(listInfo.title);
            setItems(listInfo.items);
            setRecipes(listInfo.recipes);
            mapRecipesToItems();
        }

        populateListInfo();
    }, [listId])

    const mapRecipesToItems = () => {
        const retval = initializeRecipesForItems();

        for (const recipe of recipes) {
            for (const item of recipe.items) {
                retval[item.name].push({
                    title: recipe.title,
                    id: recipe.id
                });
            }
        }

        console.log(retval);
        setRecipesForItems(retval);
    }

    const initializeRecipesForItems = () => {
        const retval = [];
        for (const item of items) {
            retval[item.name] = []
        }
        return retval;
    }

    const addItem = async(itemName) => {
        const addItemToDatabaseResult = await BackendApi.addItemToDatabase(itemName);
        if (addItemToDatabaseResult.status === "success") {
            const itemId = addItemToDatabaseResult.item.id;
            const addItemToListResult = await BackendApi.addItemToList(itemId, listId)
            if (addItemToListResult.status === "success") {
                setItems((prev) => {
                    return [...prev, addItemToDatabaseResult.item]
                });
            }
            return addItemToListResult;
        } else if (addItemToDatabaseResult.status === "failure") {
            return addItemToDatabaseResult;
        }
    }

    const addItemsFromRecipe = async(recipeId) => {
        const result = await BackendApi.addItemsFromRecipe(listId, recipeId);
        return result;
    }

    const handleItemChecked = (checked, itemId) => {
        if (checked) {
            setCheckedItemIds((prev) => {
                return [...prev, itemId]
            }
                );
        } else {
            setCheckedItemIds((prev) => prev.filter(x => x !== itemId));
        }
    }

    const updateItemQuantity = async (itemId, quantity) => {
        const result = await BackendApi.updateListItem(listId, itemId, quantity);
        if (result.status === 'failure') console.error(`Failed to update quantity for itemId: ${itemId}`);
    }

    const getRecipesForItem = (itemName) => {
        if (recipes.length === 0) return;
        const recipesForItem = [];
        for (const recipe of recipes) {
            if (recipe.items.includes(itemName)){
                recipesForItem.push(recipe.title);
            }
        }
        return recipesForItem;
    }

    return (
        <>
            <NavBar></NavBar>
            <Header text={title ? title: ""}></Header>
            <div className="container">
                <div className="row">
                    <AddRecipeModal callback={addItemsFromRecipe}></AddRecipeModal>
                    <AddItemsModal allowDuplicateDatabaseEntries={true} allowAddingFromSearchResults={true} callback={addItem}></AddItemsModal>
                </div>
            </div>
            <div className="container">
                {items && items.map((item) => {
                    return <Item 
                        key={item.id} 
                        name={item.name} 
                        id={item.id} 
                        recipes={recipesForItems[item.name]}
                        tags={item.tags} 
                        quantity={item.quantity}
                        handleSubmitQuantity={(itemId, quantity) => updateItemQuantity(itemId, quantity)}
                        handleChecked={handleItemChecked}
                        clickable={true}
                    ></Item>
                })}
            </div>
        </>
    )
}

export default ListDetail;