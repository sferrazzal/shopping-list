import React from "react";
import Item from './Item';
import BackendApi from "../apis/BackendApi";
import { useState, useEffect } from "react";

const ShoppingList = () => {
    const [items, setItems] = useState();

    useEffect(() => {
        const updateItems = async() => {
            //TODO: Get items specific to shopping list
            const allItems = await BackendApi.getAllItems();
            setItems(allItems);
        }

        updateItems();
    }, [])

    return (
        <div className="text-center">
            {items && items.map((item) => {
                return <Item key={item.id} name={item.name}></Item>
            })}
        </div>
    )
}

export default ShoppingList;