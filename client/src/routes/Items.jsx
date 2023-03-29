import NavBar from "../components/NavBar";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import BackendApi from "../apis/BackendApi";
import Item from "../components/Item";
import AddItemsModal from "../components/Modals/AddItemsModal";
import AddTagsModal from "../components/Modals/AddTagsModal";
import DeleteItemsModal from "../components/Modals/DeleteItemsModal";

const Items = () => {
    const [items, setItems] = useState();
    const [checkedItems, setCheckedItems] = useState([]);

    useEffect(() => {
        populateItems();
    }, [])

    const populateItems = async() => {
        const allItems = await BackendApi.getAllItems();
        setItems(allItems);
    }

    const addItemToDatabase = async(itemName) => {
        try {
            const result = await BackendApi.addItemToDatabase(itemName);
            if (result.status = "success") {
                setItems((prev) => {
                    return [...prev, {id: result.newItemId, name: itemName, tags: []}];
                });
                return true;
            }
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    const handleItemChecked = (checked, itemId, itemName) => {
        if (checked) {
            setCheckedItems((prev) => {
                return [...prev, {id: itemId, name: itemName}]
            });
        } else {
            setCheckedItems((prev) => prev.filter(x=> x.id !== itemId));
        }
    }

    const addTagToCheckedItems = async (tagName) => {
        try {
            const result = await BackendApi.addTagToItems(checkedItems.map(x => x.id), tagName);
            if (result.status === "success") {
                updateDisplayedTags(tagName);
                return result;
            }
        } catch (e) {
            console.log(e);
            return {result: {status: "failure"}};
        }
    }

    const updateDisplayedTags = (tagName) => {
        setItems((prev) => {
            const checkedItemIds = checkedItems.map(x => x.id);
            const newItems = prev.map(x => {
                if (checkedItemIds.includes(x.id)) {
                    if (!x.tags.includes(tagName)) {
                        x.tags.push(tagName);
                    }
                }
                return x;
            });
            return newItems;
        });
    }

    const deleteCheckedItems = async () => {
        try {
            const response = await BackendApi.deleteItemsById(checkedItems.map(x => x.id));
            if (response.status === 204) {
                stopDisplayingDeletedItems();
                setCheckedItems([]);
                return true;
            }
            return false;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    const stopDisplayingDeletedItems = () => {
        setItems((prev) => {
            return prev.filter((item) => {
                return !(checkedItems.map(checkedItem => checkedItem.id).includes(item.id));
            });
        });
    }

    return (
        <div>
            <NavBar></NavBar>
            <Header text="Items"></Header>
            <div className="container">
                <div className="row my-2" style={{margin: 'auto'}}>
                    <DeleteItemsModal checkedItems={checkedItems} callback={() => deleteCheckedItems()}></DeleteItemsModal>
                    <AddTagsModal checkedItems={checkedItems} callback={(tagName) => addTagToCheckedItems(tagName)}></AddTagsModal>
                    <AddItemsModal callback={(item) => addItemToDatabase(item)}></AddItemsModal>
                </div>
            </div>

            <div className="container">
                <ul className="list-group mb-5">
                    {items && items.map((item) => {
                        return <Item key={item.id} name={item.name} id={item.id} tags={item.tags} handleChecked={handleItemChecked}></Item>
                    })}
                </ul>
            </div>
        </div>
    )
}

export default Items;
