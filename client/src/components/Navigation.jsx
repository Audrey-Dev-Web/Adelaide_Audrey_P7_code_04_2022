import React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
// import logo from "./logo.svg";
import logo from "../images/icon.svg";

import { NavLink } from "react-router-dom";

function Navigation() {
    let user = localStorage.getItem("user_id");

    const loggout = (e) => {
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_token");
        window.location.reload(true);
    };

    return (
        <div className="navigation">
            <div className="container navigation__container">
                <NavLink to="/Home" className="navigation__branding">
                    <img className="navigation__branding--logo" src={logo} alt="Logo Groupomania" />
                    <h1 className="navigation__branding--title">Groupomania</h1>
                </NavLink>

                <nav className="navigation__nav">
                    {user}
                    <ul className="navigation__nav--items">
                        <li className="navigation__nav--item">
                            <NavLink to="/Home">Home</NavLink>
                        </li>
                        <li className="navigation__nav--item">
                            <NavLink to="/User_profile">Profile</NavLink>
                        </li>
                        <li className="navigation__nav--item">
                            <NavLink to="/" onClick={loggout}>
                                Déconnection
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}

export default Navigation;
