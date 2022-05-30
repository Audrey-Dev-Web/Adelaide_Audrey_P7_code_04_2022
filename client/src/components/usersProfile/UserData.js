import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import jwt_decode from "jwt-decode";

import DateTime from "../DateTime";

import { BiCheckShield } from "react-icons/bi";

function UserData(props) {
    const { realAuthor_id, dateTime, access } = props;
    const [realAuthor, setRealAuthor] = useState([]);
    const [dataOk, setDataOk] = useState(false);
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [userFound, setUserFound] = useState(false);

    const token = access;
    const decoded = jwt_decode(token);
    // const user_id = decoded.user_id;
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
            fetch(url, reqOptions)
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    } else {
                        // if (res.status == 404) {
                        //     console.log("404");
                        // }
                        setErrorMessage("Utilisateur inconnu");
                        throw new Error("Utilisateur inexistant");
                    }
                })
                .then((data) => {
                    setRealAuthor(data.profile);
                    setDataOk(true);
                })
                .catch((err) => {
                    if (err) {
                        setMessage(err);
                    }
                });
        }
    }, []);

    // if (!dataOk) {
    //     return null;
    // }

    const first_Name = realAuthor.firstName;
    const last_Name = realAuthor.lastName;
    const fullName = `${first_Name} ${last_Name}`;
    const initiales = fullName.match(/\b\w/g).join("").toUpperCase();

    // console.log(dateTime);

    return (
        <div>
            <div className="realAuthor">
                {/* <Link to={"/profile/" + realAuthor_id}> */}
                {realAuthor.role === "admin" ? (
                    <div className="realAuthor__wrapper">
                        <div className="adminAvatar initiales">
                            <BiCheckShield />
                        </div>

                        <div className="realAuthor__infos">
                            <p>Administrateur</p>
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
                            <p className="realAuthor__infos--fullName">
                                {realAuthor.firstName && realAuthor.lastName
                                    ? first_Name + " " + last_Name
                                    : "Utilisateur inconnu"}
                            </p>
                            {!dateTime ? null : (
                                <div className="realAuthor__infos--dateTime">
                                    <DateTime datetime={dateTime} />
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {/* </Link> */}
            </div>
        </div>
    );
}

export default UserData;
