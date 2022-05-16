import React from "react";
// import { Routes, Route, Link, Navigate, Outlet } from "react-router-dom";

import Posts from "./articles/Posts";
import PostForm from "../components/PostForm";
import UsersProfile from "../components/UsersProfile";

function Home() {
    return (
        <div className="home">
            <div className="home__container container">
                <div className="home__article">
                    <h1 hidden>Home</h1>
                    <div className="newPost">
                        <PostForm />
                    </div>
                    <div className="home__articles">
                        <Posts />
                    </div>
                </div>

                <UsersProfile />
            </div>
        </div>
    );
}

export default Home;
