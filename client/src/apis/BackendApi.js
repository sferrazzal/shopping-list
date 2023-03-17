const baseUrl = "http://localhost:4000/api/v1/";
const itemsEndpoint = "items/";
const listsEndpoint = "lists/";
const recipesEndpoint = "recipes/";
const tagsEndpoint = "tags/";

const getAllItems = async () => {
    const jsonResponse = await get(baseUrl + itemsEndpoint);
    return jsonResponse.items;
};

const addItemToDatabase = async (itemName) => {
    const itemsUrl = baseUrl + itemsEndpoint;
    const payload = JSON.stringify({newItemName: itemName});
    const jsonResponse = await (post(itemsUrl, payload));
    return jsonResponse;
}

const getItemsStartingWith = async (searchString) => {
    const searchUrl = baseUrl + itemsEndpoint + "?name=sw." + searchString;
    const jsonResponse = await get(searchUrl);
    return jsonResponse.items.map(item => item.name);
}

const addTagToItems = async (itemIds, tagName) => {
    const tagsUrl = baseUrl + tagsEndpoint;
    const payload = JSON.stringify({itemIds, tagName});
    const jsonResponse = await post(tagsUrl, payload);
    return jsonResponse;
}

const getAllTags = async() => {
    const jsonResponse = await get(baseUrl + tagsEndpoint);
    return jsonResponse.tags;
}

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

const get = async(endpoint) => {
    try {
        const response = await fetch(endpoint);
        const jsonResponse = await response.json();
        return jsonResponse.data;
    } catch (e) {
        console.error(e);
    };
};

const post = async(endpoint, payload) => {
    console.log(payload);
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: payload
        });
        const jsonResponse = await response.json();
        return jsonResponse;
    } catch (e) {
        console.error(e);
    }
}

const BackendApi = { 
    getAllItems,
    getAllLists,
    getAllTags,
    getListInfo,
    getAllRecipes,
    getRecipeInfo,
    addItemToDatabase,
    getItemsStartingWith,
    addTagToItems,
};

export default BackendApi;