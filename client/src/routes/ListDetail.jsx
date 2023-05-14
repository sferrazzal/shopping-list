import React from "react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import BackendApi from "../apis/BackendApi";
import Header from "../components/Header";
import Item from "../components/Item";
import AddItemsModalController from "../components/Modals/AddItemsModalController";
import AddRecipeModalController from "../components/Modals/AddRecipeModalController";
import NavBar from "../components/NavBar";

const ListDetail = () => {
    const [title, setTitle] = useState();
    const [items, setItems] = useState([]);
    const [recipes, setRecipes] = useState([]);
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
        }

        populateListInfo();
    }, [listId])

    const getRecipesForItem = (itemName) => {
        const retval = []
        for (const recipe of recipes) {
            if (recipe.items.map((x) => x.name).includes(itemName)) {
                retval.push(recipe);
            }
        }

        return retval;
    }

    const handleAddItem = async(itemName) => {
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

    const handleAddRecipe = async(recipe) => {
        const response = await BackendApi.addRecipeToList(listId, recipe.id);
        if (response.addedRecipe === null) return response;

        setRecipes((prev) => {
            return [...prev, response.addedRecipe]
        });
        setItems((prev) => {
            const changedItems = response.addedRecipe.items;
            const updatedItemIds = changedItems.map(x => x.id);
            const newItems = [...prev].map((item) => {
                if (updatedItemIds.includes(item.id)) {
                    const updatedItem = changedItems.filter(x => x.id === item.id)[0];
                    const newQuantity = item.quantity + updatedItem.quantity;
                    return {...item, quantity: newQuantity}
                } else {
                    return {...item};
                }
            });
            for (const item of changedItems) {
                if (!newItems.map(x => x.id).includes(item.id)) {
                    newItems.push(item);
                }
            }
            
            return newItems;
        });

        return response;
    }

    const handleItemChecked = (checked, itemId) => {
        if (checked) {
            setCheckedItemIds((prev) => {
                return [...prev, itemId]
            });
        } else {
            setCheckedItemIds((prev) => prev.filter(x => x !== itemId));
        }
    }

    const handleRemoveRecipe = async (recipe) => {
        await BackendApi.removeRecipeFromList(listId, recipe.id);
        setRecipes((prev) => {
            return prev.filter(listRecipe => listRecipe.id !== recipe.id);
        });
        setItems((prev) => {
            const recipeItemIds = recipe.items.map(x => x.id);
            const newItems = prev.map(item => {
                if (recipeItemIds.includes(item.id)) {
                    const recipeItem = recipe.items.filter(x => x.id === item.id)[0];
                    const newQuantity = item.quantity - recipeItem.quantity;
                    const updatedItem = {...item, quantity: newQuantity};
                    return updatedItem;
                } else {
                    return item;
                }
            });
            return newItems.filter(x => x.quantity >= 0);
        })
    }

    const updateItemQuantity = async (itemId, quantity) => {
        const result = await BackendApi.updateListItem(listId, itemId, quantity);
        if (result.status === 'failure') console.error(`Failed to update quantity for itemId: ${itemId}`);
    }

    return (
        <>
            <NavBar></NavBar>
            <Header text={title ? title: ""}></Header>
            <div className="container">
                <div className="row">
                    <AddRecipeModalController handleAddRecipe={handleAddRecipe}></AddRecipeModalController>
                    <AddItemsModalController allowDuplicateDatabaseEntries={true} allowAddingFromSearchResults={true} handleAddItem={handleAddItem}></AddItemsModalController>
                </div>
            </div>
            <div className="container">
                {items && recipes && items.map((item) => {
                    return <Item 
                                key={item.id} 
                                name={item.name} 
                                id={item.id} 
                                recipes={getRecipesForItem(item.name)}
                                removeRecipeCallback={(recipe) => handleRemoveRecipe(recipe)}
                                tags={item.tags} 
                                quantity={item.quantity}
                                handleQuantityChanged={(itemId, quantity) => updateItemQuantity(itemId, quantity)}
                                handleChecked={handleItemChecked}
                                clickable={true}
                            ></Item>

                })}
            </div>
        </>
    )
}

export default ListDetail;