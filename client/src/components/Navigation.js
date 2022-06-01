import React, { useState } from "react";
import logo from "../images/icon.svg";
import { useCookies } from "react-cookie";

// import { useCookies } from "react-cookie";
// import jwt_decode from "jwt-decode";

import { NavLink, useNavigate } from "react-router-dom";
import { BiMenuAltRight, BiLogOutCircle, BiHome } from "react-icons/bi";
import jwt_decode from "jwt-decode";

import UserLoggedIn from "./usersProfile/UserLoggedIn";

function Navigation(props) {
    const { access } = props;
    const [cookies, setCookies, removeCookie] = useCookies(["access"]);

    // console.log(access);

    const navigate = useNavigate();
    // let user = localStorage.getItem("user_id");

    const loggout = (e) => {
        e.preventDefault();
        // sessionStorage.removeItem("isAuthenticate");
        // setCookie("access", data.token, { path: "/" });

        removeCookie("access", "", { path: "/" });
        // browser.cookies.remove("access");
        navigate("/");
        window.location.reload();

        // REMPLACER  REMOVEITEM PAR UNE SUPPRESSION DE COOKIE

        // window.location.reload(true);
        // navigate("/", { replace: true });
    };

    const decoded = jwt_decode(access);
    const user_id = decoded.userId;

    // nav responsive
    const [isNavExpanded, setIsNavExpanded] = useState(false);

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
                    {/* {user} */}
                    <ul className="navigation__nav--items">
                        <li className="navigation__nav--item">
                            <NavLink to="/" aria-label="Page d'accueil">
                                <BiHome className="icon" />
                            </NavLink>
                        </li>
                        <li className="navigation__nav--item">
                            <NavLink to={"/profile/" + user_id} aria-label="profile utilisateur">
                                {/* Afficher la photo de profile et le prénom de l'utilisateur connecté */}
                                <UserLoggedIn user_id={user_id} access={access} />
                            </NavLink>
                        </li>
                        <li className="navigation__nav--item">
                            {/* <NavLink className="btn" to="/" onClick={loggout}>
                                Déconnection
                            </NavLink> */}

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
