import React, { useEffect, useState, Component } from "react";
import { Link } from "react-router-dom";

import DateTime from "../DateTime";

export default function RealAuthor(props) {
    const { realAuthor_id, dateTime, access } = props;
    const [realAuthor, setRealAuthor] = useState({ userInfos: {} });
    const [dataOk, setDataOk] = useState(false);

    // console.log(realAuthor_id);

    // const user = JSON.parse(sessionStorage.getItem("isAuthenticate"));
    // const token = user.pass;

    const token = access.token;
    const user_id = access.user_id;
    const user_role = access.role;

    const url = `http://localhost:8080/api/profiles/${realAuthor_id}`;
    const reqOptions = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    };

    const fetchRealAuthor = async () => {
        try {
            const res = await fetch(url, reqOptions);
            const userData = await res.json();

            if (res.status !== 404) {
                setRealAuthor(userData);
                setDataOk(true);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (realAuthor_id !== undefined) {
            fetchRealAuthor();
        } else {
            console.log("message d'erreur a ajouter !");
        }
    }, []);

    if (!dataOk) {
        return null;
    }

    const first_Name = realAuthor.profile.firstName;
    const last_Name = realAuthor.profile.lastName;
    const fullName = `${first_Name} ${last_Name}`;
    const initiales = fullName.match(/\b\w/g).join("").toUpperCase();

    return (
        <div>
            <div className="realAuthor">
                {/* <p>Article créé par</p> */}
                <div className="realAuthor__wrapper">
                    {!realAuthor.profile.avatarUrl ? (
                        <div className="realAuthor__avatar initiales">
                            <p>{initiales}</p>
                        </div>
                    ) : (
                        <img className="realAuthor__avatar" src={realAuthor.profile.avatarUrl} alt="Photo de profile" />
                    )}
                    <div className="realAuthor__infos">
                        <p className="realAuthor__infos--fullName">
                            {realAuthor.profile.firstName} {realAuthor.profile.lastName}
                        </p>
                        <div className="realAuthor__infos--dateTime">
                            <p>posté </p>
                            <DateTime datetime={dateTime} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
