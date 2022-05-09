import React, { useState } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";

import Posts from "./Posts";

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
        console.log(user.pass);

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
                <div className="container">
                    <h1 hidden>Home</h1>
                    <div className="home__article">
                        {/* Boucle pour afficher tous les articles trouvé */}
                        <div className="newPost">
                            <form className="newPost__add">
                                <label>
                                    <input
                                        className="newPost__add--title"
                                        type="text"
                                        name="title"
                                        placeholder="Votre titre ici..."
                                    />
                                </label>

                                <label>
                                    <textarea
                                        className="newPost__add--content"
                                        type="text"
                                        name="content"
                                        placeholder="Votre text ici...."
                                    />
                                </label>

                                <div className="newPost__btn">
                                    <input className="newPost__add--img btn" type="submit" value="Ajouter une image" />
                                    <input className="newPost__add--send btn" type="submit" value="Envoyer" />
                                </div>
                            </form>
                        </div>

                        {items.map((item) => (
                            <div className="article" key={item.article.id}>
                                {/* <div className="article__img">
                                    <img src={item.article.images} />
                                </div> */}
                                <div className="article__header">
                                    <h2 className="article__title">{item.article.title}</h2>
                                    <div className="article__header--author">
                                        <img className="author__img" src={item.article.author_avatar} />
                                        <div className="article__info">
                                            <p className="author__name">
                                                {item.article.author_firstName + " " + item.article.author_lastName}
                                            </p>
                                            <div className="article__header--datetime">{item.article.timestamp}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="home__article--content">{item.article.content}</div>
                                <div className="home__article--footer">
                                    {/* <button onClick={handleLike(item.article.id)}>Likes : </button> */}

                                    {/* <p>
                                        <button onClick={(e) => handleLike(item.article.id)}>Likes : </button>
                                        {item.article.likes}
                                    </p> */}
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
                            </div>
                        ))}
                    </div>
                    <Posts />
                </div>
            </div>
        );
    }
}

export default Home;
