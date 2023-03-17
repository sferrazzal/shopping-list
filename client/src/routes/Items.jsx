import NavBar from "../components/NavBar";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import BackendApi from "../apis/BackendApi";
import Item from "../components/Item";
import TextInput from "../components/TextInput";
import AddItemsModal from "../components/AddItemsModal";

const Items = () => {
    const [items, setItems] = useState();
    const [checkedItemIds, setCheckedItemIds] = useState([]);

    useEffect(() => {
        const populateItems = async() => {
            const allItems = await BackendApi.getAllItems();
            setItems(allItems);
        }

        populateItems();
    }, [])

    const addItemToDatabase = async(itemName) => {
        try {
            const result = await BackendApi.addItemToDatabase(itemName);
            if (result.status = "success") {
                setItems((prev) => {
                    const nextId = items.reduce((a, b) => a.id > b.id? a.id : b.id) + 1;
                    return [...prev, {id: nextId, name: itemName, tags: []}];
                });
                return true;
            }
        } catch (e) {
            console.log(e);
            return false;
        }
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

    const addTagToItems = async (tagName) => {
        try {
            const result = await BackendApi.addTagToItems(checkedItemIds, tagName);
            return result.status === "success"? true: false;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    return (
        <div>
            <NavBar></NavBar>
            <Header text="Items"></Header>
            <TextInput callback={(item) => addItemToDatabase(item)} placeholderText="New Item" buttonText="Add Item"></TextInput>
            <div className="container">
                <div className="row my-2" style={{margin: 'auto'}}>
                    <button className="btn btn-primary me-2 col">Add Tag to Selected Items</button>
                    <AddItemsModal callback={(item) => addItemToDatabase(item)}></AddItemsModal>
                </div>
            </div>

            <div className="container">
                <ul className="list-group">
                    {items && items.map((item) => {
                        return <Item key={item.id} name={item.name} id={item.id} tags={item.tags} handleChecked={handleItemChecked}></Item>
                    })}
                </ul>
            </div>
            <TextInput callback={(tagName) => addTagToItems(tagName)} placeholderText="New Tag" buttonText="Add Tag to Checked Items"></TextInput>
        </div>
    )
}

export default Items;