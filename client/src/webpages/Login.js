import React from "react";
import logo from "../images/icon.svg";

// Import des icons de la page login
import { BiLogInCircle } from "react-icons/bi";
import { BiLockOpenAlt } from "react-icons/bi";

function Login() {
    return (
        <div className="login">
            <div className="login__branding">
                <img src={logo} alt="Logo Groupomania" />
                <h1 className="login__title">Groupomania</h1>
            </div>

            <div className="login__links">
                <ul className="login__links--items">
                    <li className="item">Connexion</li>
                    <p className="item">|</p>
                    <li className="item">S'inscrire</li>
                </ul>
            </div>

            <form action="" method="" className="login__form">
                <div className="login__input-edit">
                    <div>
                        <label className="login__label">
                            <div className="login__icon">
                                <BiLogInCircle />
                            </div>
                            <input className="login__input-text" type="text" name="email" placeholder="email" />
                        </label>
                    </div>

                    <div>
                        <label className="login__label">
                            <div className="login__icon">
                                <BiLockOpenAlt />
                            </div>
                            <input className="login__input-text" type="text" name="password" placeholder="password" />
                        </label>
                    </div>
                </div>
                {/* <div>
                    <label className="login__rememberMe">
                        <input className="login__rememberMe--checkbox" type="checkbox" id="scales" name="scales" />
                        <p className="login__rememberMe--text">Se souvenir de moi</p>
                    </label>
                </div> */}

                <input className="login__btn btn" type="submit" value="Envoyer" />
                {/* <p>
                    <li>Mot de passe oublié ?</li>
                </p> */}
            </form>
        </div>
    );
}

export default Login;
