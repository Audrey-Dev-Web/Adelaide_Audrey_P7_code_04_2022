import React, { useState } from "react";
import logo from "../images/icon.svg";

// import { useCookies } from "react-cookie";
// import jwt_decode from "jwt-decode";

import { NavLink, useNavigate } from "react-router-dom";

import { BiMenuAltRight } from "react-icons/bi";

import UserLoggedIn from "./UserLoggedIn";

function Navigation(props) {
    const { access } = props;

    console.log(access);

    const navigate = useNavigate();
    let user = localStorage.getItem("user_id");

    const loggout = () => {
        sessionStorage.removeItem("isAuthenticate");
        navigate("/");
        window.location.reload();

        // REMPLACER  REMOVEITEM PAR UNE SUPPRESSION DE COOKIE

        // window.location.reload(true);
        // navigate("/", { replace: true });
    };

    const token_test = sessionStorage.getItem("isAuthenticate");

    let user_id;
    if (token_test) {
        user_id = JSON.parse(token_test).id;
    } else {
        user_id = "";
    }

    // nav responsive
    const [isNavExpanded, setIsNavExpanded] = useState(false);

    return (
        <div className="navigation">
            <div className="container navigation__container">
                <NavLink to="/" className="navigation__branding">
                    <img className="navigation__branding--logo" src={logo} alt="Logo Groupomania" />
                    <h1 className="navigation__branding--title">Groupomania</h1>
                </NavLink>

                <div
                    className="navigation__responsive"
                    onClick={() => {
                        setIsNavExpanded(!isNavExpanded);
                    }}
                >
                    <BiMenuAltRight />
                </div>

                <nav className={isNavExpanded ? "navigation__nav expanded" : "navigation__nav"}>
                    {user}
                    <ul className="navigation__nav--items">
                        <li className="navigation__nav--item">
                            <NavLink to="/">Home</NavLink>
                        </li>
                        <li className="navigation__nav--item">
                            <NavLink to={"/profile/" + access.user_id}>
                                {/* Afficher la photo de profile et le prénom de l'utilisateur connecté */}
                                <UserLoggedIn userId={access} access={access} />
                            </NavLink>
                        </li>
                        <li className="navigation__nav--item">
                            <NavLink className="btn" to="/" onClick={loggout}>
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
