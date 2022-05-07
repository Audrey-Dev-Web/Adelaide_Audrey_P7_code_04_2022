import React from "react";
// import { Routes, Route, Link, Navigate } from "react-router-dom";
// import logo from "./logo.svg";
import logo from "../images/icon.svg";

import { NavLink, useNavigate } from "react-router-dom";

function Navigation() {
    const navigate = useNavigate();
    let user = localStorage.getItem("user_id");

    const loggout = () => {
        sessionStorage.removeItem("isAuthenticate");
        // localStorage.removeItem("user_token");
        window.location.reload(true);
        // navigate("/", { replace: true });
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
                            <NavLink to="/">Home</NavLink>
                        </li>
                        <li className="navigation__nav--item">
                            <NavLink to="/profile">Profile</NavLink>
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
