import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../images/icon.svg";

// import jwt_decode from "jwt-decode";

import { useCookies } from "react-cookie";

// Import des icons de la page login
import { BiLogInCircle, BiLockOpenAlt, BiShow, BiHide } from "react-icons/bi";

function Login() {
    let navigate = useNavigate();

    const [cookies, setCookie] = useCookies(["access"]);

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
                if (res.status === 401) {
                    setMsg("Mot de passe incorrect");
                }

                const data = await res.json();
                setUser({ id: data.userId, pass: data.token, role: data.userRole });

                setCookie("access", data.token, { path: "/" });

                if (res.ok) {
                    window.location.reload();
                }
            }
        } catch (error) {
            setMsg(error);
        }
    };

    const [passwordShown, setPasswordShown] = useState(false);
    const [show, setShow] = useState(false);

    const togglePassword = () => {
        setPasswordShown(!passwordShown);
        setShow(!passwordShown);
    };

    return (
        <div className="login">
            <div className="login__flex">
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

                        <p>{msg}</p>
                        <input className="login__btn btn" type="submit" value="Connexion" />
                    </form>
                </div>
            </div>
        </div>
    );
    // }
}

export default Login;
