import React, { useEffect, useState, Component } from "react";
import { Link } from "react-router-dom";

// import { useCookies, cookies, withCookies } from "react-cookie";
import jwt_decode from "jwt-decode";

import UserData from "./usersProfile/UserData";

// import { instanceOf } from 'prop-types';
// import { withCookies, Cookies } from 'react-cookie';

export default class UserLoggedIn extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userInfo: [],
            DataIsLoaded: false,
            access: this.props.access,
        };
    }

    async componentDidMount() {
        const token = this.state.access;
        const decoded = jwt_decode(token);
        const user_id = decoded.userId;

        const url = `http://localhost:8080/api/profiles/${user_id}`;

        const reqOptions = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        };

        try {
            const res = await fetch(url, reqOptions);
            const userData = await res.json();
            this.setState({ userInfo: userData, DataIsLoaded: true });
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        const { DataIsLoaded, userInfo, access } = this.state;

        const token = access;
        const decoded = jwt_decode(token);
        const user_id = decoded.userId;
        const user_role = decoded.role;

        if (!DataIsLoaded)
            return (
                <div>
                    <h1> Pleses wait some time.... </h1>{" "}
                </div>
            );

        const firstName = userInfo.profile.firstName;
        const lastName = userInfo.profile.lastName;
        const fullName = `${firstName} ${lastName}`;
        const initiales = fullName.match(/\b\w/g).join("").toUpperCase();

        const profileImgUrl = userInfo.profile.avatarUrl;

        return (
            // Ajouter un menu déroulant afin d'afficher la possibilité de modifier le profile
            <div className="userLoggedIn">
                {/* <Link to={"/profile/" + userInfo.profile.user_id}> */}
                <UserData
                    realAuthor_id={userInfo.profile.user_id}
                    // dateTime={post.articleFound.timestamp}
                    access={access}
                />
                {/* {!profileImgUrl ? (
                    <div className="userLoggedIn__pix initiales">
                        <p>{initiales}</p>
                    </div>
                ) : (
                    <img className="userLoggedIn__pix" src={userInfo.profile.avatarUrl} alt="Photo de profile" />
                )} */}
                {/* <img className="userLoggedIn__pix" src={userInfo.profile.avatarUrl} alt="Photo de profile" /> */}

                {/* {user_role === "admin" ? (
                    <span className="user_admin">Administrateur</span>
                ) : (
                    <span className="username">{userInfo.profile.firstName}</span>
                )} */}
                {/* </Link> */}
            </div>
        );
    }
}
