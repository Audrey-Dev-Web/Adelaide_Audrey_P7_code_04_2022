import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import DateTime from "../DateTime";

import { BiCheckShield } from "react-icons/bi";

// Permet de récupérer et d'afficher les informations de l'utilisateur dont on communique l'id en props
function UserData(props) {
    const { realAuthor_id, dateTime, access } = props;
    const [realAuthor, setRealAuthor] = useState([]);
    const [dataOk, setDataOk] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [userFound, setUserFound] = useState(false);

    const token = access;
    const decoded = jwt_decode(token);
    const user_role = decoded.role;

    const url = `http://localhost:8080/api/profiles/${realAuthor_id}`;
    const reqOptions = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    };

    useEffect(() => {
        if (realAuthor_id === undefined || realAuthor_id === null) {
            setErrorMessage("Utilisateur inexistant");
        } else {
            const fetchUserData = async () => {
                try {
                    const res = await fetch(url, reqOptions);
                    const data = await res.json();

                    if (res.status === 201) {
                        setUserFound(false);
                        setDataOk(true);
                    }

                    if (data.profile) {
                        setRealAuthor(data.profile);
                        setDataOk(true);
                        setUserFound(true);
                    }
                } catch (err) {
                    if (err) {
                        setErrorMessage(err);
                    }
                }
            };

            fetchUserData();
        }
    }, []);

    if (!dataOk) {
        return (
            <div>
                <h1>En cours de chargement</h1>
                <p>{errorMessage}</p>
            </div>
        );
    }

    const first_Name = realAuthor.firstName;
    const last_Name = realAuthor.lastName;
    const fullName = `${first_Name} ${last_Name}`;
    const initiales = fullName.match(/\b\w/g).join("").toUpperCase();

    return (
        <div className="realAuthor">
            {realAuthor.role === "admin" ? (
                <div className="realAuthor__wrapper">
                    <div className="adminIcon">
                        <BiCheckShield className="icon" />
                    </div>

                    <div className="realAuthor__infos">
                        <p className="adminName">Administrateur</p>
                        {!dateTime ? null : (
                            <div className="realAuthor__infos--dateTime">
                                <DateTime datetime={dateTime} />
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="realAuthor__wrapper">
                    {!realAuthor.avatarUrl ? (
                        <div className="realAuthor__avatar initiales">
                            <p>{initiales}</p>
                        </div>
                    ) : (
                        <img className="realAuthor__avatar" src={realAuthor.avatarUrl} alt="Photo de profile" />
                    )}
                    <div className="realAuthor__infos">
                        {userFound == false ? (
                            <div>
                                <p className="realAuthor__infos--fullName">Compte supprimé</p>
                            </div>
                        ) : (
                            <p className="realAuthor__infos--fullName">{fullName}</p>
                        )}
                        {!dateTime ? null : (
                            <div className="realAuthor__infos--dateTime">
                                <DateTime datetime={dateTime} />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserData;
