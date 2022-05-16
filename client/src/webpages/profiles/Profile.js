import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { BiEditAlt } from "react-icons/bi";

import DateTime from "../../components/DateTime";
import EditProfile from "../../components/Editprofile";

function Profile() {
    let { userSlug } = useParams();
    const [userData, setUserData] = useState({ profile: {} });
    const [dataIsLoaded, setDataIsLoaded] = useState(false);

    const [isAuthorized, setIsAuthorized] = useState(false);

    const user = JSON.parse(sessionStorage.getItem("isAuthenticate"));
    const token = user.pass;
    const user_id = user.id;
    const user_role = user.role;

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

    const fetchProfile = () => {
        fetch(url, reqOptions)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                    // console.log(res);
                } else {
                    console.log("Ce profile n'existe pas");
                }
            })
            .then((data) => {
                setUserData(data);
                setDataIsLoaded(true);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    // Afin de pouvoir attendre le chargement des données
    if (!dataIsLoaded) {
        return (
            <div>
                <h1> Pleases wait some time.... </h1>
            </div>
        );
    }

    console.log("", userData);

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
                            <h1 className="profile__title">
                                {userData.profile.firstName + " " + userData.profile.lastName} <BiEditAlt />
                            </h1>
                            <p className="profile__signupDate">
                                Inscrit <DateTime datetime={userData.profile.inscrit_le} />
                            </p>
                        </div>
                    </div>

                    <div className="profile__infos">
                        <div className="profile__user--margin">
                            <p>
                                Date de naissance :{" "}
                                <span>
                                    {userData.profile.birthdate} <BiEditAlt />
                                </span>
                            </p>
                        </div>

                        <div className="profile__user--margin">
                            <p>
                                Role : <span>{userData.profile.role}</span>
                            </p>
                        </div>

                        <div className="profile__user--margin">
                            <p>
                                Email :
                                <span>
                                    {userData.profile.email} <BiEditAlt />
                                </span>
                            </p>
                        </div>

                        {/* <div className="profile__user--margin">
                        <p>Password : <span>{userData.profile.password}</span></p>
                    </div> */}
                    </div>
                    <div>Modifier les informations de connexion</div>
                    <div className="profile__btn">
                        {/* <button className="profile__btn--edit btn">Edit</button> */}
                        {/* <button className="profile__btn--delete btn">Supprimer</button> */}
                        <EditProfile
                            userId={userSlug}
                            first_name={userData.profile.firstName}
                            last_name={userData.profile.lastName}
                            birthDate={userData.profile.birthdate}
                            emailValue={userData.profile.email}
                            password={userData.profile.password}
                            avatar={userData.profile.avatarUrl}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
