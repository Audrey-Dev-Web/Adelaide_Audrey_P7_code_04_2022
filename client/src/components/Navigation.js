import React, { useState } from "react";
import logo from "../images/icon.svg";
import { useCookies } from "react-cookie";
import { NavLink, useNavigate } from "react-router-dom";
import { BiMenuAltRight, BiLogOutCircle, BiHome } from "react-icons/bi";
import jwt_decode from "jwt-decode";

import UserLoggedIn from "./usersProfile/UserLoggedIn";

function Navigation(props) {
    const { access } = props;
    // On récupère le cookies de connexion
    const [cookies, setCookies, removeCookie] = useCookies(["access"]);

    const navigate = useNavigate();

    const loggout = (e) => {
        e.preventDefault();

        // On supprime le cookie afin de déconnecter l'utilisateur
        removeCookie("access", "", { path: "/" });
        navigate("/");
        window.location.reload();
    };

    const decoded = jwt_decode(access);
    const user_id = decoded.userId;

    // nav responsive
    const [isNavExpanded, setIsNavExpanded] = useState(false);

    const handleClick = (e) => {
        setIsNavExpanded(false);
    };

    return (
        <div className="navigation">
            <div className="container navigation__container">
                <NavLink to="/" className="navigation__branding" aria-label="Page d'accueil">
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
                    <ul className="navigation__nav--items">
                        <li className="navigation__nav--item">
                            <NavLink to="/" aria-label="Page d'accueil" onClick={(e) => handleClick()}>
                                <BiHome className="icon" />
                            </NavLink>
                        </li>
                        <li className="navigation__nav--item">
                            <NavLink
                                to={"/profile/" + user_id}
                                aria-label="profile utilisateur"
                                onClick={(e) => handleClick()}
                            >
                                {/* Afficher la photo de profile et le prénom de l'utilisateur connecté */}
                                <UserLoggedIn user_id={user_id} access={access} />
                            </NavLink>
                        </li>
                        <li className="navigation__nav--item">
                            <button className="logoutBtn" onClick={loggout} aria-label="Déconnexion">
                                <BiLogOutCircle />
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}

export default Navigation;
