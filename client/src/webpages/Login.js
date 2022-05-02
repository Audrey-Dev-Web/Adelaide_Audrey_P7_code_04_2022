import React from "react";
import logo from "../images/icon-left-font.svg";

function Login() {
    return (
        <div className="login">
            <h1 className="login__branding">
                <img src={logo} />
            </h1>

            <div>
                <ul>
                    <li>connection</li>
                    <li>S'inscrire</li>
                </ul>
            </div>

            <form>
                <div>
                    <label>
                        <input type="text" name="email" placeholder="email" />
                    </label>
                </div>

                <div>
                    <label>
                        <input type="text" name="password" placeholder="password" />
                    </label>
                </div>

                <div>
                    <label>
                        <input type="checkbox" id="scales" name="scales" />
                        <p>Se souvenir de moi</p>
                    </label>
                </div>

                <input type="submit" value="Envoyer" />
                <p>
                    <li>Mot de passe oublié ?</li>
                </p>
            </form>
        </div>
    );
}

export default Login;
