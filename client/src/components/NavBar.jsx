import React from "react";
import { NavLink } from "react-router-dom";

const NavBar = () => {
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <NavLink to="/" className="navbar-brand" href="#">Shopping List</NavLink>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink to="/lists" className="nav-link active" aria-current="page">Lists</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/recipes" className="nav-link active" aria-current="page">Recipes</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/items" className="nav-link active" aria-current="page">Items</NavLink>
                        </li>

                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default NavBar;