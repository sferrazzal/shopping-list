import NavBar from "../components/NavBar";
import Header from "../components/Header";
import { useState } from "react";
import { useEffect } from "react";
import BackendApi from "../apis/BackendApi";
import ListInfo from "../components/ListInfo";

const Lists = () => {
    const [lists, setLists] = useState();

    useEffect(() => {
        const updateLists = async() => {
            const lists = await BackendApi.getAllLists();
            setLists(lists);
        }

        updateLists();
    }, [])

    return (
        <div>
            <NavBar></NavBar>
            <div className="container-fluid">
                <Header text="Shopping Lists"></Header>
                <div>
                {lists && lists.map((list) => {
                    return <ListInfo key={list.id} id={list.id} title={list.title}></ListInfo>
                })}
                </div>
            </div>
        </div>
    )
}

export default Lists;