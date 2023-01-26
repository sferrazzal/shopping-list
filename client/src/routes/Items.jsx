import NavBar from "../components/NavBar";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import BackendApi from "../apis/BackendApi";
import Item from "../components/Item";
import AddItem from "../components/AddItem";

const Items = () => {
    const [items, setItems] = useState();

    useEffect(() => {
        const updateItems = async() => {
            const allItems = await BackendApi.getAllItems();
            setItems(allItems);
        }

        updateItems();
    }, [])

    return (
        <div>
            <NavBar></NavBar>
            <div className="container-fluid">
                <Header text="Items"></Header>
                <AddItem></AddItem>
                <div>
                    {items && items.map((item) => {
                        return <Item key={item.id} name={item.name}></Item>
                    })}
                </div>
            </div>
        </div>
    )
}

export default Items;