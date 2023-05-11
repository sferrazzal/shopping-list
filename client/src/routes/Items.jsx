import NavBar from "../components/NavBar";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import BackendApi from "../apis/BackendApi";
import Item from "../components/Item";
import AddItemsModalController from "../components/Modals/AddItemsModalController";
import AddTagsModalController from "../components/Modals/AddTagsModalController";
import DeleteItemsModalController from "../components/Modals/DeleteItemsModalController";
import DeleteTagsModal from "../components/Modals/DeleteTagsModal";

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
            if (result.status === "success") {
                setItems((prev) => {
                    return [...prev, {id: result.item.id, name: result.item.name, tags: []}];
                });
            }
            return result;
        } catch (e) {
            console.log(e);
            return {
                status: "failure",
                failureReason: "Unhandled error"
            };
        }
    }

    const handleItemChecked = (checked, itemId, itemName, itemTags) => {
        if (checked) {
            setCheckedItems((prev) => {
                return [...prev, {id: itemId, name: itemName, tags: itemTags}]
            });
        } else {
            setCheckedItems((prev) => prev.filter(x=> x.id !== itemId));
        }
    }

    const addTagToCheckedItems = async (tagName) => {
        try {
            const result = await BackendApi.addTagToItems(checkedItems.map(x => x.id), tagName);
            if (result.status === "success") {
                displayNewTagOnItems(tagName);
                return result;
            }
        } catch (e) {
            console.error(e);
            return {result: {status: "failure"}};
        }
    }

    const deleteTagFromItems = async (tagName) => {
        try {
            const result = await BackendApi.deleteTagFromItems(checkedItems.map(x => x.id), tagName);
            if (result.status === "success") {
                stopDisplayingTagOnItems(tagName);
                return result;
            } else {
                return result;
            }
        } catch (e) {
            console.error(e);
            return {result: {status: "failure"}};
        }
    }

    const displayNewTagOnItems = (tagName) => {
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

        updateCheckedItemsFromItems();
    }

    const stopDisplayingTagOnItems = (tagName) => {
        setItems((prev) => {
            const checkedItemIds = checkedItems.map(x => x.id);
            return prev.map(x => {
                if (checkedItemIds.includes(x.id)) {
                    x.tags = x.tags.filter(tag => tag !== tagName);
                }
                return x;
            });
        });

        updateCheckedItemsFromItems();
    }

    const updateCheckedItemsFromItems = () => {
        setCheckedItems((prev) => {
            return prev.map(checkedItem => {
                return items.find(item => item.id === checkedItem.id);
            });
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
            console.error(e);
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
                    <AddItemsModalController allowDuplicateDatabaseEntries={false} handleAddItem={(item) => addItemToDatabase(item)}></AddItemsModalController>
                    <DeleteItemsModalController checkedItems={checkedItems} handleDeleteCheckedItems={() => deleteCheckedItems()}></DeleteItemsModalController>
                </div>
                <div className="row my-2"  style={{margin: 'auto'}}>
                    <AddTagsModalController checkedItems={checkedItems} handleAddTag={(tagName) => addTagToCheckedItems(tagName)}></AddTagsModalController>
                    <DeleteTagsModal checkedItems={checkedItems} callback={(tagName) => deleteTagFromItems(tagName)}></DeleteTagsModal>
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
