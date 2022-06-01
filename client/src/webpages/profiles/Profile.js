import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import jwt_decode from "jwt-decode";

import { BiCalendarCheck, BiUserCheck, BiMailSend } from "react-icons/bi";

import DateTime from "../../components/DateTime";
import EditProfile from "../../components/usersProfile/Editprofile";
import DeleteAccount from "../../components/usersProfile/DeleteAccount";

import ErrorBoundary from "../../components/ErrorBoundary";

function Profile(props) {
    const { access } = props;

    let { userSlug } = useParams();
    const [userData, setUserData] = useState({ profile: {} });
    const [dataIsLoaded, setDataIsLoaded] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [error, setError] = useState(false);

    const token = access;
    const decoded = jwt_decode(token);
    const user_id = decoded.userId;
    const user_role = decoded.role;

    // Request options
    const url = `http://localhost:8080/api/profiles/${userSlug}`;
    const reqOptions = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    };

    useEffect(() => {
        // Requête pour récupérer les informations du profile de l'utilisateur
        const fetchProfile = async () => {
            try {
                const res = await fetch(url, reqOptions);
                const data = await res.json();

                if (res.ok) {
                    setUserData(data);
                    setDataIsLoaded(true);
                    setError(false);
                } else {
                    setErrorMsg("Ce compte utilisateur n'existe pas");
                    setError(true);

                    setTimeout(function () {
                        setErrorMsg(null);
                        setError(false);
                    }, 3000);
                }
            } catch (err) {
                if (err) {
                    setErrorMsg(err);
                    setError(true);

                    setTimeout(function () {
                        setErrorMsg(null);
                        setError(false);
                    }, 3000);
                }
            }
        };

        fetchProfile();
    }, []);

    // Afin de pouvoir attendre le chargement des données
    if (!dataIsLoaded) {
        return (
            <div>
                <h1> En chargement... </h1>
            </div>
        );
    }

    return (
        <div className="profile">
            <div className="container">
                <div className="profile__data">
                    <div className="profile__user">
                        {!userData.profile.avatarUrl ? (
                            <div className="profile__img initiales">
                                <p>
                                    {`${userData.profile.firstName} ${userData.profile.lastName}
                                                `
                                        .match(/\b\w/g)
                                        .join("")
                                        .toUpperCase()}
                                </p>
                            </div>
                        ) : (
                            <img
                                className="profile__img"
                                src={userData.profile.avatarUrl}
                                alt={
                                    "Photo de profile de " +
                                    userData.profile.firstName +
                                    " " +
                                    userData.profile.lastName
                                }
                            />
                        )}
                        <div>
                            {userData.profile.role !== "admin" ? (
                                <h1 className="profile__title">
                                    {userData.profile.firstName + " " + userData.profile.lastName} <BiUserCheck />
                                </h1>
                            ) : (
                                <h1 className="profile__title admin">Administrateur</h1>
                            )}
                            <div className="profile__signupDate">
                                <BiCalendarCheck /> Inscrit <DateTime datetime={userData.profile.inscrit_le} />
                            </div>
                        </div>
                    </div>

                    <div className="profile__infos">
                        {userData.profile.role !== "admin" ? (
                            <div className="profile__user--margin">
                                <p>
                                    Role : <span>{userData.profile.role}</span>
                                </p>
                            </div>
                        ) : null}

                        {error ? (
                            <div className="errorMsg">
                                <p>{errorMsg}</p>
                            </div>
                        ) : null}

                        {user_id !== userData.profile.user_id ? null : (
                            <div className="profile__user--margin">
                                <p>
                                    <BiMailSend /> Adresse email : <span>{userData.profile.email}</span>
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="profile__btn">
                        <EditProfile
                            userId={userSlug}
                            first_name={userData.profile.firstName}
                            last_name={userData.profile.lastName}
                            birthDate={userData.profile.birthdate}
                            emailValue={userData.profile.email}
                            password={userData.profile.password}
                            avatar={userData.profile.avatarUrl}
                            access={access}
                        />
                    </div>

                    {user_id === userData.profile.user_id ? null : (
                        <div className="account_management">
                            {user_role === "admin" ? (
                                <ErrorBoundary>
                                    <DeleteAccount userId={userData.profile.user_id} access={access} />
                                </ErrorBoundary>
                            ) : null}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;
