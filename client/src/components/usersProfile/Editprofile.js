import React, { useState, useEffect } from "react";

import jwt_decode from "jwt-decode";

import { BiEditAlt, BiImageAdd } from "react-icons/bi";

import DeleteAccount from "./DeleteAccount";

// Permet de modifier le profile de l'utilisateur
function Editprofile(props) {
    // On récupère les de l'utilisateur dont on a besoin avec props
    const { userId, first_name, last_name, birthDate, emailValue, password, avatar, access } = props;

    // State pour vérifier si c'est le bon utilisateur qui est connecté
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [changePwd, setChangePwd] = useState(false);

    const [message, setMessage] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const get_date = new Date(birthDate).getDate();
    const get_month = new Date(birthDate).getMonth() + 1; // On ajoute +1 afin de compenser la perte de 1 moi durant la convertion
    const get_year = new Date(birthDate).getFullYear();

    const birth = `${get_year}-${get_month}-${get_date}`;

    // On prépare le state local pour stocker les données à modifier
    const [firstName, setFirstName] = useState(first_name);
    const [lastName, setLastName] = useState(last_name);
    const [birthdate, setBirthdate] = useState(birth);
    const [email, setEmail] = useState(emailValue);
    const [pwd, setpwd] = useState();
    const [image, setImage] = useState(avatar);
    const [fileDataURL, setFileDataURL] = useState(null);

    const [editMod, setEditMod] = useState(false);

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

    const handleClick = (e) => {
        e.preventDefault();
        setChangePwd(!changePwd);
    };

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

            if (res.ok) {
                setMessage("Profile modifié avec succès");
                setSuccess(true);
                setTimeout(function () {
                    setMessage(null);
                    setSuccess(false);
                    window.location.reload();
                }, 3000);
            } else {
                throw new Error("Error");
            }
        } catch (err) {
            setErrorMsg(err);
            setError(true);
            setTimeout(function () {
                setErrorMsg(null);
                setError(false);
            }, 3000);
        }
    };

    const changePwdReq = async (e) => {
        e.preventDefault();

        try {
            let res = await fetch(url, reqOptionsPwd);
            let profileRes = await res.json();

            if (res.ok) {
                setMessage("Password modifié avec succès");
                setSuccess(true);
                setTimeout(function () {
                    setMessage(null);
                    setSuccess(false);
                    window.location.reload();
                }, 3000);
            } else {
                throw new Error("Error");
            }
        } catch (err) {
            setErrorMsg(err);
            setError(true);
            setTimeout(function () {
                setErrorMsg(null);
                setError(false);
            }, 3000);
        }
    };

    // Afficher ou masque le mode edition
    const toggleEdit = () => {
        if (!editMod) {
            setEditMod(true);
        } else {
            setEditMod(false);
        }
    };

    // Fonction qui permet d'afficher une image preview
    function handleChange(e) {
        setImage(e.target.files[0]);

        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            const { result } = e.target;
            setFileDataURL(result);
        };
        reader.readAsDataURL(file);
    }

    // CREER MAIS PAS ENCORE ADD A LA PAGE PROFILE
    return (
        <div className="profileForm">
            {!isAuthorized ? null : (
                <button className="comments__edit--btn btn" onClick={toggleEdit}>
                    <p hidden>Afficher le formulaire de modification</p>
                    <BiEditAlt />
                </button>
            )}

            <div style={{ display: editMod ? "block" : "none" }}>
                <form onSubmit={modifyProfile} className="profileForm__form" method="PUT" encType="multipart/form-data">
                    <h3>Modifiez / Ajoutez une photo de profil</h3>

                    {!fileDataURL ? (
                        <div>
                            <p className="previewTxt">Photo de profile actuelle</p>
                            {!image ? null : <img className="postForm__imgPreview" src={image} />}
                        </div>
                    ) : (
                        <div>
                            <p className="previewTxt">Nouvelle photo de profile</p>
                            <img className="postForm__imgPreview" src={fileDataURL} />
                        </div>
                    )}

                    <label htmlFor="img-profile" className="btn btn__img" aria-label="Ajouter une image">
                        <p hidden>Ajouter ou modifier votre photo de profile</p>
                        <BiImageAdd className="imgIcon" />
                    </label>
                    <input
                        id="img-profile"
                        className="profileForm__image btn"
                        type="file"
                        name="image"
                        alt="photo de profile"
                        onChange={handleChange}
                    />

                    <div className="profileForm__personnal">
                        <h3>Modifiez vos informations personnels</h3>
                        <div className="profileForm__personnal--inputs">
                            <label htmlFor="first_name" aria-label="Prénom">
                                <p hidden>Modifier ou ajouter votre prénom</p>
                                <input
                                    id="first_name"
                                    className="profileForm__firstName"
                                    type="text"
                                    name="first_name"
                                    placeholder="test"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </label>
                            <label htmlFor="last_name" aria-label="Nom">
                                <p hidden>Modifier ou ajoutez votre Nom</p>
                                <input
                                    id="last_name"
                                    className="profileForm__lastName"
                                    type="text"
                                    name="last_name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </label>
                        </div>

                        <label htmlFor="birthDate" aria-label="Date de naissance">
                            <p hidden>Modifier ou ajoutez votre date de naissance</p>
                            {!birthDate ? (
                                <input
                                    id="birthDate"
                                    className="profileForm__birthdate"
                                    type="date"
                                    name="birthdate"
                                    onChange={(e) => setBirthdate(e.target.value)}
                                    aria-label="Ajouter votre date de naissance"
                                />
                            ) : (
                                <input
                                    id="birthDate"
                                    className="profileForm__birthdate"
                                    type="date"
                                    name="birthdate"
                                    value={birthdate}
                                    onChange={(e) => setBirthdate(e.target.value)}
                                    aria-label="Modifier votre date de naissance"
                                />
                            )}
                        </label>

                        <label htmlFor="emailInput" aria-label="Modifier votre adress email">
                            <p hidden>Modifier votre adresse email</p>
                            <input
                                id="emailInput"
                                className="profileForm__email"
                                type="text"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                aria-label="champ modifier votre adresse email"
                            />
                        </label>
                    </div>

                    <input className="profileForm__btn btn" type="submit" value="Envoyer" />
                </form>

                <form>
                    <div className="profileForm__login">
                        <h3>Modifiez votre mot de passe</h3>
                        {!error ? null : <div className="errorMsg">{errorMsg}</div>}
                        {!success ? null : <div className="validateMsg">{message}</div>}
                        <button className="setPwd btn" onClick={handleClick}>
                            Changez votre mot de passe
                        </button>
                        <div style={{ display: changePwd ? "block" : "none" }}>
                            <label htmlFor="passwordInput" aria-label="Modifier votre mot de passe">
                                <p hidden>Modifier votre mot de passe</p>
                                <input
                                    id="passwordInput"
                                    className="profileForm__password"
                                    type="password"
                                    name="password"
                                    placeholder="******"
                                    onChange={(e) => setpwd(e.target.value)}
                                    aria-label="champ modifier votre mot de passe"
                                />
                            </label>
                            <input
                                className="profileForm__btn btn"
                                type="submit"
                                value="Envoyer votre nouveau mot de passe"
                                autoComplete="new-password"
                                onClick={changePwdReq}
                                aria-label="Envoyer le nouveau mot de passe"
                            />
                        </div>
                    </div>
                </form>

                <div className="profile__delete">
                    <p>
                        <strong>Supprimez votre compte *</strong>
                    </p>
                    <p>* Attention! Cette action est définitive. </p>
                    <DeleteAccount userId={userId} access={access} />
                </div>
            </div>
        </div>
    );
}

export default Editprofile;
