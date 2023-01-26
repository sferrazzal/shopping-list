import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import BackendApi from "../apis/BackendApi";
import Header from "../components/Header";
import Item from "../components/Item";
import NavBar from "../components/NavBar";

const ListDetail = () => {
    const [title, setTitle] = useState();
    const [items, setItems] = useState();

    const location = useLocation();
    const listId = location.pathname.slice(-1);
    
    useEffect(() => {
        const populateListInfo = async () => {
            const listInfo = await BackendApi.getListInfo(listId);
            setTitle(listInfo.title);
            setItems(listInfo.items);
        }

        populateListInfo();
    }, [])

    return (
        <>
            <NavBar></NavBar>
            <Header text={title ? title: ""}></Header>
            <div>
                {items && items.map((item) => {
                    return <Item key={item.id} name={item.name} clickable={true}></Item>
                })}
            </div>
        </>
    )
}

export default ListDetail;