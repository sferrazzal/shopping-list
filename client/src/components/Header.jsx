import React from "react";
import { useLocation } from "react-router-dom";

const Header = (props) => {
    const location = useLocation();

    return (
        <div>
            <h1 className="text-center">{props.text}</h1>
        </div>
    )
}

export default Header;