import React from "react";
import { useLocation } from "react-router-dom";

const Header = (props) => {
    const location = useLocation();

    return (
        <h1 className="header text-center">{props.text}</h1>
    )
}

export default Header;