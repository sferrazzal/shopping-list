import React from "react";
import Item from './Item';
import ItemsApi from "../apis/ItemsApi";
import { useState, useEffect } from "react";

const ShoppingList = () => {
    const [items, setItems] = useState();

    useEffect(() => {
        const updateItems = async() => {
            const allItems = await ItemsApi.getAllItems();
            setItems(allItems);
        }

        updateItems();
    }, [])

    return (
        <div>
            {items && items.map((item) => {
                return <Item key={item.id} name={item.name}></Item>
            })}
        </div>
    )
}

export default ShoppingList;