import React, { useState, useEffect } from "react";

import jwt_decode from "jwt-decode";

import { BiEditAlt, BiTrash } from "react-icons/bi";

import DeleteAccount from "../components/DeleteAccount";
import ErrorBoundary from "../components/ErrorBoundary";

function Editprofile(props) {
    // On récupère l'id de l'utilisateur avec props
    const { userId, first_name, last_name, birthDate, emailValue, password, avatar, access } = props;

    // State pour vérifier que c'est le bon utilisateur qui est connecté
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [changePwd, setChangePwd] = useState(false);

    const get_date = new Date(birthDate).getDate();
    const get_month = new Date(birthDate).getMonth() + 1; // On ajoute +1 afin de compenser la perte de 1 moi durant la convertion
    const get_year = new Date(birthDate).getFullYear();

    const birth = `${get_year}-${get_month}-${get_date}`;
    // console.log(birth);
    console.log(access);
    // const userObject = {
    //     token: access.token,
    //     user_id: access.user_id,
    //     role: access.role,
    // };

    // On prépare le state local pour stocker les données à modifier
    const [firstName, setFirstName] = useState(first_name);
    const [lastName, setLastName] = useState(last_name);
    const [birthdate, setBirthdate] = useState(birth);
    const [email, setEmail] = useState(emailValue);
    const [pwd, setpwd] = useState();
    const [image, setImage] = useState(avatar);
    // const [formPwdData, setFormPwdData] = useState(null);

    const [editMod, setEditMod] = useState(false);

    // On récupère les données de connexion de l'utilisateur loggé
    // const user = JSON.parse(sessionStorage.getItem("isAuthenticate"));
    // const token = user.pass;
    // const user_id = user.id;
    // const user_role = user.role;

    const token = access;
    const decoded = jwt_decode(token);
    const user_id = decoded.userId;
    const user_role = decoded.role;

    // Création de l'object user
    const formData = new FormData();
    formData.append("image", image);
    formData.append("first_name", firstName);
    formData.append("last_name", lastName);
    formData.append("birthdate", birthdate);
    formData.append("email", email);

    const formDataPwd = new FormData();
    formDataPwd.append("password", pwd);

    // const editPassword = () => {
    //     if (changePwd) {
    //         formData.append("password", pwd);
    //     }
    //     console.log(changePwd);
    // };

    const handleClick = (e) => {
        e.preventDefault();
        // editPassword();
        setChangePwd(!changePwd);
    };

    // console.log(pwd);

    // Request options
    const url = `http://localhost:8080/api/profiles/${userId}`;
    const reqOptions = {
        method: "PUT",
        body: formData,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const reqOptionsPwd = {
        method: "PUT",
        body: formDataPwd,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const set_authorization = async () => {
        if (userId === user_id || user_role === "admin") {
            setIsAuthorized(true);
        }
    };

    useEffect(() => {
        set_authorization();
    }, []);

    // Fonction pour modifier le profile de l'utilisateur
    const modifyProfile = async (e) => {
        e.preventDefault();

        try {
            let res = await fetch(url, reqOptions);
            let profileRes = await res.json();

            console.log("=====> Reponse modification de profile");
            console.log(profileRes);

            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    };

    const changePwdReq = async (e) => {
        e.preventDefault();

        try {
            let res = await fetch(url, reqOptionsPwd);
            let profileRes = await res.json();

            console.log("=====> Reponse modification de profile");
            console.log(profileRes);

            // window.location.reload();
        } catch (err) {
            console.log(err);
        }
    };

    // Afficher ou masque le mode edition
    const toggleEdit = () => {
        if (!editMod) {
            setEditMod(true);
            console.log("mode edition activée !");
        } else {
            setEditMod(false);
            console.log("mode edition désactivée !");
        }
    };

    function handleChange(e) {
        setImage(e.target.files[0]);
    }

    // CREER MAIS PAS ENCORE ADD A LA PAGE PROFILE
    return (
        <div className="profileForm">
            {!isAuthorized ? null : (
                <button className="comments__edit--btn btn" onClick={toggleEdit}>
                    <BiEditAlt />
                    {/* <span className="infobubble">Editer votre profile</span> */}
                </button>
            )}

            {/* <button className="profile__btn--edit btn">Edit</button> */}

            <div style={{ display: editMod ? "block" : "none" }}>
                <form onSubmit={modifyProfile} className="profileForm__form" method="PUT" encType="multipart/form-data">
                    <label>
                        <h3>Modifiez / Ajoutez une photo de profil</h3>
                        <input className="btn" type="file" name="image" src={image} onChange={handleChange} />
                        <img className="postForm__edit--imgPreview" src={image} />
                    </label>
                    <div className="profileForm__personnal">
                        <h3>Modifiez vos informations personnels</h3>
                        <div className="profileForm__personnal--inputs">
                            <label>
                                <input
                                    className="profileForm__firstName"
                                    type="text"
                                    name="first_name"
                                    placeholder="test"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </label>
                            <label>
                                <input
                                    className="profileForm__lastName"
                                    type="text"
                                    name="last_name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </label>
                        </div>

                        <label>
                            {!birthDate ? (
                                <input
                                    className="profileForm__birthdate"
                                    type="date"
                                    name="birthdate"
                                    onChange={(e) => setBirthdate(e.target.value)}
                                />
                            ) : (
                                <input
                                    className="profileForm__birthdate"
                                    type="date"
                                    name="birthdate"
                                    value={birthdate}
                                    onChange={(e) => setBirthdate(e.target.value)}
                                />
                            )}
                        </label>
                    </div>

                    <div className="profileForm__login">
                        <h3>Modifiez vos informations de connexion</h3>
                        <div className="profileForm__login--inputs">
                            <label>
                                <input
                                    className="profileForm__email"
                                    type="text"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </label>
                        </div>
                    </div>
                    <input className="profileForm__btn btn" type="submit" value="Envoyer" />
                </form>

                <form>
                    <button className="setPwd btn" onClick={handleClick}>
                        Changez votre mot de passe
                    </button>
                    <div style={{ display: changePwd ? "block" : "none" }}>
                        <label>
                            <input
                                className="profileForm__password"
                                type="password"
                                name="password"
                                placeholder="******"
                                onChange={(e) => setpwd(e.target.value)}
                            />
                        </label>
                        <input
                            className="profileForm__btn btn"
                            type="submit"
                            value="Envoyer votre nouveau mot de passe"
                            onClick={changePwdReq}
                        />
                    </div>
                </form>

                <div className="profile__delete">
                    <p>
                        <strong>Supprimez votre compte *</strong>
                    </p>
                    <p>* Attention ! cette action est définitive. </p>
                    {/* <button className="btn">
                        <BiTrash />
                    </button> */}
                    <ErrorBoundary>
                        <DeleteAccount userId={userId} access={access} />
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    );
}

export default Editprofile;
