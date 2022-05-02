import React from "react";
// import logo from "./logo.svg";

import { NavLink } from "react-router-dom";

function Navigation() {
    return (
        <div className="navigation">
            <div className="container">
                <NavLink to="/Home">GROUPOMANIA</NavLink>

                <div>
                    <ul>
                        <li>
                            <NavLink to="/">Login</NavLink>
                        </li>
                        <li>
                            <NavLink to="/Home">Home</NavLink>
                        </li>
                        <li>
                            <NavLink to="/User_profile">Profile</NavLink>
                        </li>
                    </ul>
                </div>
            </div>
            <h1>Navigation</h1>
        </div>
    );
}

export default Navigation;
