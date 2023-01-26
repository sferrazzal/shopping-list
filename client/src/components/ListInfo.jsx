import React from "react";
import { NavLink } from "react-router-dom";

const ListInfo = (props) => {
    return (
        <div className="container">
            <div className="card">
                <div className="card-body">
                    <NavLink to={`/lists/${props.id}`}>
                        <h5 className="card-title text-center">{props.title}</h5>
                    </NavLink>
                </div>
            </div>
        </div>
    )
}

export default ListInfo;