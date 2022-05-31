/*
Cette page sert à chercher et afficher tous les utilisateurs inscrits
*/

import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import { useCookies } from "react-cookie";
import jwt_decode from "jwt-decode";

import DateTime from "../components/DateTime";

function UsersProfile(props) {
    const [cookies] = useCookies("access");
    const [users, setUsers] = useState([]);
    const [dataIsLoaded, setDataIsLoaded] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [message, setMessage] = useState(null);

    const decoded = jwt_decode(cookies.access);
    const token = cookies.access;
    const user_id = decoded.userId;
    const User_role = decoded.role;

    const url = `http://localhost:8080/api/profiles`;
    const reqOptions = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    };

    useEffect(() => {
        fetch(url, reqOptions)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
            })
            .then((data) => {
                setUsers(data);
                setDataIsLoaded(true);
            })
            .catch((err) => {
                if (err) {
                    setMessage(err);
                }
            });
        // }
    }, []);

    if (!dataIsLoaded) {
        return (
            <div>
                <h1> Pleases wait some time.... </h1>
            </div>
        );
    }

    const usersList = users.slice(0, 5).map((user) => {
        return (
            <li className="usersList__user" key={user.usersProfile.user_Id}>
                <NavLink className="usersList__user--link" to={"/profile/" + user.usersProfile.user_Id}>
                    {!user.usersProfile.avatar ? (
                        <div className="usersList__user--avatar initiales">
                            <p>
                                {`${user.usersProfile.first_name} ${user.usersProfile.last_name}
                                                `
                                    .match(/\b\w/g)
                                    .join("")
                                    .toUpperCase()}
                            </p>
                        </div>
                    ) : (
                        <img
                            className="usersList__user--avatar"
                            src={user.usersProfile.avatar}
                            alt={"photo de profile de " + user.usersProfile.first_name}
                        />
                    )}
                    <div>
                        <div className="usersList__user--name">
                            <p>
                                <span className="user__firstName">{user.usersProfile.first_name} </span>
                                <span className="user__lastName">{user.usersProfile.last_name}</span>
                            </p>
                        </div>

                        <div className="usersList__user--signupDate">
                            <DateTime datetime={user.usersProfile.inscrit_le} />
                        </div>
                    </div>
                </NavLink>
            </li>
        );
    });

    return (
        <ul className="usersList">
            <h3 className="usersList__title">Nouveaux utilisateurs</h3>
            {usersList}
        </ul>
    );
}

export default UsersProfile;
