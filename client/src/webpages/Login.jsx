import React, { useState } from "react";
// import { Routes, Route, Link, Navigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import { Routes, Route, Link, Navigate } from "react-router-dom";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../images/icon.svg";

// import Signup from "./Signup";

// import Auth from "../components/Auth";

// tutorial
// import { useHistory } from "react-router-dom";

// Import des icons de la page login
import { BiLogInCircle, BiLockOpenAlt, BiShow, BiHide } from "react-icons/bi";
// import Auth from "./Auth";

function Login() {
    let navigate = useNavigate();
    // connexion
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Creation du user connecté
    const [user, setUser] = useState("");

    // Message d'erreur
    const [msg, setMsg] = useState("");

    const url = `http://localhost:8080/api/auth/login`;

    // L'objet user envoyer pour la connexion
    const userObject = {
        email: email,
        password: password,
    };

    // La method
    const postLoggedIn = {
        method: "POST",
        body: JSON.stringify(userObject),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    };

    const Auth = async (e) => {
        e.preventDefault();

        try {
            let res = await fetch(url, postLoggedIn);

            if (res.status === 404) {
                setMsg("Cet utilisateur n'existe pas !");
            } else {
                const data = await res.json();
                setUser({ id: data.userId, pass: data.token });
            }

            // if (res.ok) {
            // }
        } catch (error) {
            setMsg(error);
        }
    };

    if (user) {
        sessionStorage.setItem("isAuthenticate", JSON.stringify(user));
        window.location.reload(true);
    }

    // icon pour afficher le mot de pass

    // Pour afficher ou cacher le mot de passe
    const [passwordShown, setPasswordShown] = useState(false);
    const [show, setShow] = useState(false);

    const togglePassword = () => {
        setPasswordShown(!passwordShown);
        setShow(!passwordShown);
    };

    return (
        <div className="login">
            <div className="login__container">
                <div className="login__branding">
                    <img src={logo} alt="Logo Groupomania" />
                    <h1 className="login__title">Groupomania</h1>
                </div>
                <div className="login__links">
                    <ul className="login__links--items">
                        <li className="item">
                            <NavLink className="item" to="/">
                                Connexion
                            </NavLink>
                        </li>
                        <p className="item">|</p>
                        <li className="item">
                            <NavLink className="item" to="/signup">
                                Inscription
                            </NavLink>
                        </li>
                    </ul>
                </div>

                <form onSubmit={Auth} className="login__form">
                    <div className="login__input-edit">
                        <div>
                            <label className="login__label">
                                <div className="login__icon">
                                    <BiLogInCircle />
                                </div>
                                <input
                                    className="login__input-text"
                                    type="text"
                                    name="email"
                                    placeholder="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </label>
                        </div>

                        <div>
                            <label className="login__label">
                                <div className="login__icon">
                                    <BiLockOpenAlt />
                                </div>

                                <div className="login__icon--hideShow">
                                    <span
                                        className="show"
                                        onClick={togglePassword}
                                        style={{ display: show ? "none" : "block" }}
                                    >
                                        <BiShow />
                                    </span>
                                    <span
                                        className="hide"
                                        onClick={togglePassword}
                                        style={{ display: show ? "block" : "none" }}
                                    >
                                        <BiHide />
                                    </span>
                                </div>
                                <input
                                    className="login__input-text"
                                    // type="password"
                                    type={passwordShown ? "text" : "password"}
                                    name="password"
                                    placeholder="******"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </label>
                        </div>
                    </div>
                    {/* <div>
                    <label className="login__rememberMe">
                        <input className="login__rememberMe--checkbox" type="checkbox" id="scales" name="scales" />
                        <p className="login__rememberMe--text">Se souvenir de moi</p>
                    </label>
                </div> */}

                    <p>{msg}</p>
                    <input className="login__btn btn" type="submit" value="Connexion" />
                    {/* <p>
                    <li>Mot de passe oublié ?</li>
                </p> */}
                    {/* {isAuthenticated ? <Navigate to="/" replace /> : "Vous devez vous connecter"} */}
                </form>
            </div>
        </div>
    );
    // }
}

export default Login;
