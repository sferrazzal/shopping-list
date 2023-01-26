import { json } from "react-router-dom";

const baseUrl = "http://localhost:4000/api/v1/";
const itemsEndpoint = "items/";
const listsEndpoint = "lists/";
const recipesEndpoint = "recipes/";

const get = async(endpoint) => {
    try {
        const response = await fetch(endpoint);
        const jsonResponse = await response.json();
        return jsonResponse.data;
    } catch (e) {
        console.log(e);
    };
};

const getAllItems = async () => {
    const jsonResponse = await (get(baseUrl + itemsEndpoint));
    return jsonResponse.items;
};

const getAllLists = async () => {
    const jsonResponse = await (get(baseUrl + listsEndpoint));
    return jsonResponse.lists;
};

const getListInfo = async (listId) => {
    const jsonResponse = await (get(baseUrl + listsEndpoint + listId));
    return {
        title: jsonResponse.name.rows[0].title,
        items: jsonResponse.items
    };
};

const getAllRecipes = async() => {
    const jsonResponse = await (get(baseUrl + recipesEndpoint));
    return jsonResponse.recipes;
}

const getRecipeInfo = async (recipeId) => {
    const jsonResponse = await (get(baseUrl + recipesEndpoint + recipeId));
    return {
        title: jsonResponse.title,
        items: jsonResponse.items
    };
};

const BackendApi = { 
    getAllItems,
    getAllLists,
    getListInfo,
    getAllRecipes,
    getRecipeInfo
};

export default BackendApi;