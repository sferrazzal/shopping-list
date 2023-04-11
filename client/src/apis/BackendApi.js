const baseUrl = "http://localhost:4000/api/v1/";

const itemsEndpoint = "items";
const listsEndpoint = "lists";
const recipesEndpoint = "recipes";
const tagsEndpoint = "tags";

const deleteOperationString = ":delete";
const deleteByIdsOperationString = ":deletebyids";

const getAllItems = async () => {
    const jsonResponse = await get(baseUrl + itemsEndpoint);
    return jsonResponse.items;
};

const addItemToDatabase = async (itemName) => {
    const itemsUrl = baseUrl + itemsEndpoint;
    const payload = JSON.stringify({newItemName: itemName});
    const response = await (post(itemsUrl, payload));
    const jsonResponse = await response.json();
    return jsonResponse;
}

const deleteItemsById = async (itemIds) => {
    const itemsUrl = baseUrl + itemsEndpoint + deleteByIdsOperationString;
    const payload = JSON.stringify({itemIds: itemIds});
    const response = await (post(itemsUrl, payload));
    return response;
}

const getItemsStartingWith = async (searchString) => {
    const searchUrl = baseUrl + itemsEndpoint + "?name=sw." + searchString;
    const jsonResponse = await get(searchUrl);
    return jsonResponse.items.map(item => item.name);
}

const addTagToItems = async (itemIds, tagName) => {
    const tagsUrl = baseUrl + tagsEndpoint;
    const payload = JSON.stringify({itemIds, tagName});
    const response = await (post(tagsUrl, payload));
    const jsonResponse = await response.json();
    return jsonResponse;
}

const deleteTagFromItems = async (itemIds, tagName) => {
    const tagsUrl = baseUrl + tagsEndpoint + deleteOperationString;
    const payload = JSON.stringify({itemIds, tagName});
    const response = await (post(tagsUrl, payload));
    const jsonResponse = await response.json();
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
    const jsonResponse = await (get(baseUrl + listsEndpoint + "/" + listId));
    return {
        title: jsonResponse.name.rows[0].title,
        items: jsonResponse.items
    };
};

const addItemToList = async (itemId, listId) => {
    const listItemsUrl = baseUrl + listsEndpoint + "/" + listId;
    const payload = JSON.stringify({itemId});
    try {
        const response = await(post(listItemsUrl, payload))
        const jsonResponse = await response.json();
        return jsonResponse;
    } catch (e) {
        return {
            status: "failure",
            failureReason: "Unhandled error encountered when adding item"
        }
    }
}

const addItemsFromRecipe = async (listId, recipeId) => {
    const listItemsUrl = baseUrl + listsEndpoint + "/" + listId;
    const payload = JSON.stringify({recipeId});
    try {
        const response = await(post(listItemsUrl, payload))
        const jsonResponse = await response.json();
        return jsonResponse;
    } catch (e) {
        return {
            status: "failure",
            failureReason: "Unhandled error encountered when adding item"
        }
    }

}

const updateListItem = async (listId, itemId, quantity) => {
    const listItemsUrl = baseUrl + listsEndpoint + "/" + listId;
    const payload = JSON.stringify({itemId, quantity});
    try {
        const response = await (patch(listItemsUrl, payload));
        const jsonResponse = await response.json();
        return jsonResponse;
    } catch (e) {
        console.error(e);
        return {status: "failure"}
    }
}

const getAllRecipes = async() => {
    const jsonResponse = await (get(baseUrl + recipesEndpoint));
    return jsonResponse.recipes;
}

const getRecipeInfo = async (recipeId) => {
    const jsonResponse = await (get(baseUrl + recipesEndpoint + "/" + recipeId));
    return {
        title: jsonResponse.title,
        items: jsonResponse.items
    };
};

const getRecipesStartingWith = async (searchString) => {
    const searchUrl = baseUrl + recipesEndpoint + "?title=sw." + searchString;
    const jsonResponse = await get(searchUrl);
    return jsonResponse.recipes;
}

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
    const response = await executeRequestWithPayload('POST', endpoint, payload);
    return response;
}

const patch = async(endpoint, payload) => {
    const response = await executeRequestWithPayload('PATCH', endpoint, payload);
    return response;
}

const executeRequestWithPayload = async(method, endpoint, payload) => {
    try {
        const response = await fetch(endpoint, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: payload
        });
        return response;
    } catch (e) {
        console.error(e);
        return {status: 'failure'}
    }

}

const BackendApi = { 
    getAllItems,
    addItemToDatabase,
    getItemsStartingWith,
    deleteItemsById,
    getAllLists,
    getAllTags,
    getListInfo,
    addItemToList,
    addItemsFromRecipe,
    updateListItem,
    getAllRecipes,
    getRecipeInfo,
    getRecipesStartingWith,
    addTagToItems,
    deleteTagFromItems
};

export default BackendApi;