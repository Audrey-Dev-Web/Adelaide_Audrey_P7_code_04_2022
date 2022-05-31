import React, { useState } from "react";
// import { Routes, Route, Link, Navigate, Outlet } from "react-router-dom";

import Posts from "./articles/Posts";
// import Posts2 from "./articles/Posts2";
import PostForm from "../components/PostForm";
import UsersProfile from "../components/UsersProfile";
import ErrorBoundary from "../components/ErrorBoundary";

import { BiPlus, BiX } from "react-icons/bi";

function Home(props) {
    const { access } = props;
    return (
        <div className="home">
            <React.StrictMode>
                <div className="home__container container">
                    <div className="home__article">
                        <h1 hidden>Home</h1>

                        <div className="createNewPost">
                            {/* <button
                            type="button"
                            className="createMod createMod__button createMod__closed btn"
                            onClick={toggleCreateMod}
                            style={{ display: createMod ? "none" : "block" }}
                        >
                            <span className="createMod__open createMod__icon">
                                <BiPlus />
                            </span>


                        </button> */}

                            {/* <div className={createMod ? "createMod createPost__show" : "createMod createPost__hide"}> */}
                            {/* <button
                                type="button"
                                className="createMod createMod__button createMod__opened btn"
                                onClick={toggleCreateMod}
                                style={{ display: createMod ? "block" : "none" }}
                            >
                                <span className="createMod__close createMod__icon">
                                    <BiX />
                                </span>
                            </button> */}
                            <PostForm access={access} />
                            {/* </div> */}
                        </div>

                        <div className="home__articles">
                            <ErrorBoundary>
                                <Posts access={access} />
                            </ErrorBoundary>
                            {/* <ErrorBoundary>
                                <Posts2 access={access} />
                            </ErrorBoundary> */}
                        </div>
                    </div>
                    <ErrorBoundary>
                        <UsersProfile access={access} />
                    </ErrorBoundary>
                </div>
            </React.StrictMode>
        </div>
    );
}

export default Home;
