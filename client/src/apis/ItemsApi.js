const baseUrl = "http://localhost:4000/api/v1/items";

const getAllItems = async () => {
    try {
        const response = await fetch(baseUrl);
        const jsonResponse = await response.json();
        return jsonResponse.data.items;
    } catch (e) {
        console.log(e);
    }
}

const ItemsApi = { 
    getAllItems 
};

export default ItemsApi;