import React, { useState } from "react";
import { Routes, Route, Link, Navigate, Outlet } from "react-router-dom";

import Posts from "./articles/Posts";
import PostForm from "../components/PostForm";
// import UserDetails from "../components/UserDetails";
import Comments from "../components/Comments";
// import getPostComments from "../components/Comments";

import { BiLike, BiDislike, BiShare, BiComment, BiCommentAdd } from "react-icons/bi";
// import { IconName } from "react-icons/fa";

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            DataisLoaded: false,
        };
    }

    async componentDidMount() {
        const user = JSON.parse(sessionStorage.getItem("isAuthenticate"));
        // console.log(user.pass);

        const url = `http://localhost:8080/api/articles`;

        const token = user.pass;
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
            const postsData = await res.json();
            this.setState({ items: postsData.articlesFound, DataisLoaded: true });

            console.log(this.state);
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        // ====================> Like Request
        const handleLike = async (e) => {
            const user = JSON.parse(sessionStorage.getItem("isAuthenticate"));
            console.log(user.pass);

            const url = `http://localhost:8080/api/articles/${e}/like`;

            const like = {
                like: 1,
            };

            const token = user.pass;
            const reqOptions = {
                method: "POST",
                body: JSON.stringify(like),
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            };

            try {
                const res = await fetch(url, reqOptions);
                const resLiked = await res.json();

                console.log(resLiked);
            } catch (err) {
                console.log(err);
            }
        };

        // =================> Show all posts
        const { DataisLoaded, items } = this.state;

        if (!DataisLoaded)
            return (
                <div>
                    <h1> Pleses wait some time.... </h1>{" "}
                </div>
            );

        return (
            <div className="home">
                <div className="home__container container">
                    <div className="home__article">
                        <h1 hidden>Home</h1>
                        {/* TEST DE LA PAGE POSTS
                        <Posts />
                        FIN DU TEST */}
                        <div className="newPost">
                            <PostForm />
                        </div>
                        {/* Boucle pour afficher tous les articles trouvé */}
                        {items.map((item, index) => (
                            <div className="article" key={item.article.id}>
                                <Link to={"/articles/" + item.article.id}>
                                    <div className="article__header">
                                        <h2 className="article__title">{item.article.title}</h2>
                                        <div className="article__header--author">
                                            {!item.article.author_avatar ? (
                                                <div className="author__img initiales">
                                                    <p>
                                                        {`${item.article.author_firstName} ${item.article.author_lastName}
                                                `
                                                            .match(/\b\w/g)
                                                            .join("")
                                                            .toUpperCase()}
                                                    </p>
                                                </div>
                                            ) : (
                                                <img className="author__img" src={item.article.author_avatar} />
                                            )}
                                            {/* <img className="author__img" src={item.article.author_avatar} /> */}
                                            <div className="article__info">
                                                <p className="author__name">
                                                    {item.article.author_firstName + " " + item.article.author_lastName}
                                                </p>
                                                <div className="article__header--datetime">
                                                    {item.article.timestamp}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="home__article--content">
                                        {item.article.content}
                                        <img
                                            className="article__img"
                                            src={item.article.images}
                                            alt={"Photo de l'article " + item.article.title}
                                        />
                                    </div>
                                </Link>
                                <div className="home__article--footer">
                                    {/* <button onClick={handleLike(item.article.id)}>Likes : </button> */}
                                    {/* <p>
                                        <button onClick={(e) => handleLike(item.article.id)}>Likes : </button>
                                        {item.article.likes}
                                    </p> */}
                                    <div className="article__social">
                                        <p className="social">
                                            <span className="social__icon">
                                                <BiLike />
                                            </span>
                                            <span className="social__count">{item.article.likes}</span>
                                        </p>
                                        <p className="social">
                                            <span className="social__icon">
                                                <BiDislike />
                                            </span>
                                            <span className="social__count"> {item.article.dislikes}</span>
                                        </p>
                                        <p className="social">
                                            <span className="social__icon">
                                                <BiShare />
                                            </span>
                                            <span className="social__count">{item.article.shares}</span>
                                        </p>
                                        <p className="social">
                                            <span className="social__icon">
                                                <BiComment />
                                            </span>
                                            <span className="social__count">{item.article.comments}</span>
                                        </p>
                                        <button className="social__icon btn">
                                            <BiCommentAdd />
                                        </button>
                                    </div>

                                    {/* <Comments post_id={item.article.id} /> */}

                                    {/* <div className="article__comments">
                                        <h3>Commentaires</h3>
                                    </div> */}
                                </div>
                            </div>
                        ))}

                        <Outlet />
                    </div>

                    {/* Afficher une liste des utilisateurs inscrit */}

                    <div className="home__users">
                        <h2>Utilisateurs connectés</h2>
                        <ul className="users">
                            <li className="user">
                                <img src="#" />
                                <div className="user__infos">
                                    <p>FirstName LastName</p>
                                    <p className="signUpDate">Connecté il y a 1h</p>
                                </div>
                            </li>
                            <li className="user">
                                <img src="#" />
                                <div className="user__infos">
                                    <p>FirstName LastName</p>
                                    <p className="signUpDate">Connecté il y a 3 jours</p>
                                </div>
                            </li>
                            <li className="user">
                                <img src="#" />
                                <div className="user__infos">
                                    <p>FirstName LastName</p>
                                    <p className="signUpDate">Connecté il y a 2 semaines</p>
                                </div>
                            </li>
                            <li className="user">
                                <img src="#" />
                                <div className="user__infos">
                                    <p>FirstName LastName</p>
                                    <p className="signUpDate">Connecté il y a 5 mois</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
