const baseUrl = "http://localhost:4000/api/v1/items";

const getAllItems = async () => {
    const response = await fetch(baseUrl);
    const jsonResponse = await response.json();
    return jsonResponse.data.items;
}

const ItemsApi = { 
    getAllItems 
};

export default ItemsApi;