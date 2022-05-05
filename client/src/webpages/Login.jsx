import React, { useState } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import logo from "../images/icon.svg";
// tutorial
// import { useHistory } from "react-router-dom";

// Import des icons de la page login
import { BiLogInCircle, BiLockOpenAlt, BiShow, BiHide } from "react-icons/bi";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState("");
    const [userId, setUserId] = useState("");

    const url = `http://localhost:8080/api/auth/login`;

    const userObject = {
        email: email,
        password: password,
    };

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

            if (res.status == 404) {
                console.log(res.status);
                setIsLoggedIn(false);
                setMsg("Cet utilisateur n'existe pas !");
            }

            const data = await res.json();
            // console.log(data);

            setToken(data.token);
            setUserId(data.userId);
            setIsLoggedIn(true);

            window.localStorage.setItem("user_token", JSON.stringify(data.token));
            window.localStorage.setItem("user_id", JSON.stringify(data.userId));

            window.location.reload(true);
        } catch (error) {
            if (error.res) {
                setMsg(error.res.data.msg);
            }
        }
    };

    const [passwordShown, setPasswordShown] = useState(false);
    // Pour afficher ou cacher le mot de passe
    const [show, setShow] = useState(false);

    const togglePassword = () => {
        setPasswordShown(!passwordShown);
        setShow(!passwordShown);
    };

    // render() {
    return (
        <div className="login">
            <div className="login__container">
                <div className="login__branding">
                    <img src={logo} alt="Logo Groupomania" />
                    <h1 className="login__title">Groupomania</h1>
                </div>

                {/* test de connexion */}
                {/* {console.log(token)}
                {console.log(userId)}
                {console.log(isLoggedIn)} */}

                <div className="login__links">
                    <ul className="login__links--items">
                        <li className="item">Connexion</li>
                        <p className="item">|</p>
                        <li className="item">S'inscrire</li>
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
                    <input className="login__btn btn" type="submit" value="Connexion" /*onClick={handleLogin}*/ />
                    {/* <p>
                    <li>Mot de passe oublié ?</li>
                </p> */}
                </form>
            </div>
        </div>
    );
    // }
}

export default Login;
