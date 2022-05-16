import React, { useState } from "react";
import { Routes, Route, Link, Navigate, Outlet } from "react-router-dom";

import Posts from "./articles/Posts";
import PostForm from "../components/PostForm";
// import UserDetails from "../components/UserDetails";
import Comments from "../components/Comments";
// import getPostComments from "../components/Comments";
import UsersProfile from "../components/UsersProfile";

import { BiLike, BiDislike, BiShare, BiComment, BiCommentAdd } from "react-icons/bi";
// import { IconName } from "react-icons/fa";

function Home() {
    // class Home extends React.Component {
    // constructor(props) {
    //     super(props);

    //     this.state = {
    //         items: [],
    //         DataisLoaded: false,
    //     };
    // }

    // async componentDidMount() {
    //     const user = JSON.parse(sessionStorage.getItem("isAuthenticate"));
    //     // console.log(user.pass);

    //     const url = `http://localhost:8080/api/articles`;

    //     const token = user.pass;
    //     const reqOptions = {
    //         method: "GET",
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //             Accept: "application/json",
    //             "Content-Type": "application/json",
    //         },
    //     };

    //     try {
    //         const res = await fetch(url, reqOptions);
    //         const postsData = await res.json();
    //         this.setState({ items: postsData.articlesFound, DataisLoaded: true });

    //         console.log(this.state);
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }

    // render() {
    // ====================> Like Request
    // const handleLike = async (e) => {
    //     const user = JSON.parse(sessionStorage.getItem("isAuthenticate"));
    //     console.log(user.pass);

    //     const url = `http://localhost:8080/api/articles/${e}/like`;

    //     const like = {
    //         like: 1,
    //     };

    //     const token = user.pass;
    //     const reqOptions = {
    //         method: "POST",
    //         body: JSON.stringify(like),
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //             Accept: "application/json",
    //             "Content-Type": "application/json",
    //         },
    //     };

    //     try {
    //         const res = await fetch(url, reqOptions);
    //         const resLiked = await res.json();

    //         console.log(resLiked);
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };

    // =================> Show all posts
    // const { DataisLoaded, items } = this.state;

    // if (!DataisLoaded)
    //     return (
    //         <div>
    //             <h1> Pleses wait some time.... </h1>{" "}
    //         </div>
    //     );

    return (
        <div className="home">
            <div className="home__container container">
                <div className="home__article">
                    <h1 hidden>Home</h1>
                    <div className="newPost">
                        <PostForm />
                    </div>
                    <div>
                        <Posts />
                    </div>
                </div>

                <div className="home__users">
                    <UsersProfile />
                </div>
            </div>
        </div>
    );
}
// }

export default Home;
