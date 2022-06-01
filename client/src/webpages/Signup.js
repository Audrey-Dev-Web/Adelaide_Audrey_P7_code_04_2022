import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../images/icon.svg";

import { useCookies } from "react-cookie";

// Import des icons de la page login
import { BiLogInCircle, BiLockOpenAlt, BiShow, BiHide } from "react-icons/bi";

function Signup() {
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(["access"]);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Validation du formulaire
    const [firstNameOk, setFirstNameOk] = useState(false);

    const [lastNameOk, setLastNameOk] = useState(false);

    const [emailOk, setEmailOk] = useState(false);

    const [message, setMessage] = useState(null);

    const validName = /^[A-Za-z\é\è\ê\ë\ï\É\ä\-]+$/;
    const validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    // Expiration du token sous 24h soit 86400 secondes
    const expiresIn = 86400;

    // Message d'erreur

    const url = `http://localhost:8080/api/auth/signup`;

    // L'objet user envoyer pour la connexion
    const userObject = {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
    };

    // La method
    const postSignup = {
        method: "POST",
        body: JSON.stringify(userObject),
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    };

    const checkInput = (e) => {
        if (firstName.match(validName)) {
            setFirstNameOk(true);
            // setFirstNameErr(false);
        } else {
            setFirstNameOk(false);
            // setFirstNameErr(true);
        }

        if (lastName.match(validName)) {
            setLastNameOk(true);
        } else {
            setLastNameOk(false);
        }

        if (email.match(validEmail)) {
            setEmailOk(true);
        } else {
            setEmailOk(false);
        }
    };

    useEffect(() => {
        checkInput();
    });

    const Signup = async (e) => {
        e.preventDefault();

        if (firstNameOk && lastNameOk && emailOk) {
            try {
                let res = await fetch(url, postSignup);

                if (res.status === 404) {
                    setMessage("Cet utilisateur n'existe pas !");
                } else {
                    console.log("click");
                    const dataSignup = await res.json();

                    if (res.status === 409) {
                        setMessage("Cet utilisateur existe déjà");
                    }

                    const loginUrl = "http://localhost:8080/api/auth/login";
                    const postLogin = {
                        method: "POST",
                        body: JSON.stringify(userObject),
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                    };

                    let resLogin = await fetch(loginUrl, postLogin);

                    if (resLogin.status === 404) {
                        setMessage("Cet utilisateur n'existe pas !");
                    } else {
                        const data = await resLogin.json();
                        setCookie("access", data.token, { path: "/", maxAge: expiresIn });

                        if (res.ok) {
                            navigate("/", { replace: true });
                            window.location.reload(true);
                        }
                    }
                }
            } catch (error) {
                setMessage(error);
            }
        } else {
            setMessage("veuillez remplir les champs convenablement");
        }
    };

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

                <form onSubmit={Signup} className="login__form">
                    <div className="login__input-edit">
                        <div>
                            <label className="login__label">
                                <p hidden>Prénom</p>
                                <div className="login__icon">
                                    <BiLogInCircle />
                                </div>
                                <input
                                    className="login__input-text"
                                    type="text"
                                    name="firstName"
                                    placeholder="Prénom"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </label>
                            {firstName && !firstNameOk ? <p>Veuillez entrer un prénom valide</p> : null}
                        </div>
                        <div>
                            <label className="login__label">
                                <p hidden>Nom</p>
                                <div className="login__icon">
                                    <BiLogInCircle />
                                </div>
                                <input
                                    className="login__input-text"
                                    type="text"
                                    name="lastName"
                                    placeholder="Nom"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </label>
                            {lastName && !lastNameOk ? <p>Veuillez entrer un Nom valide</p> : null}
                        </div>
                        <div>
                            <label className="login__label">
                                <p hidden>Email</p>
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
                                    required
                                />
                            </label>
                            {email && !emailOk ? <p>Veuillez entrer une adresse email valide</p> : null}
                        </div>

                        <div>
                            <label className="login__label">
                                <p hidden>Password</p>
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
                                    type={passwordShown ? "text" : "password"}
                                    name="password"
                                    placeholder="******"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </label>
                        </div>
                    </div>
                    <p>{message}</p>
                    <input className="login__btn btn" type="submit" value="Connexion" />
                </form>
            </div>
        </div>
    );
}

export default Signup;
