import React, { Component } from "react";
import { Link, Outlet } from "react-router-dom";

// import { instanceOf } from "prop-types";

import { useCookies } from "react-cookie";

import { CSSTransition } from "react-transition-group";

import { BiLike, BiDislike, BiShare, BiComment, BiCommentAdd, BiEditAlt } from "react-icons/bi";

import DateTime from "../../components/DateTime";

import Comments from "../../components/Comments";
import CommentForm from "../../components/CommentForm";

import EditPost from "../../components/EditPost";
import DeletePost from "../../components/DeletePost";
import ErrorBoundary from "../../components/ErrorBoundary";

// Import Socials
import SharePost from "../../components/SharePost";

class Posts extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            posts: [],
            DataIsLoaded: false,
            display: false,
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState((state) => ({
            isToggleOn: !state.isToggleOn,
        }));
        this.setState({ display: true });

        // this.setState((prevstate) => ({
        //     display: !prevstate.display,
        // }));
    }

    async componentDidMount() {
        const user = JSON.parse(sessionStorage.getItem("isAuthenticate"));
        const token = user.pass;
        // const user_id = user.id;

        console.log(token);

        const url = `http://localhost:8080/api/articles`;
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
            const data = await res.json();

            this.setState({ posts: data.articlesFound, DataIsLoaded: true });

            console.log(this.state);
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        const { DataIsLoaded, posts } = this.state;
        const user = JSON.parse(sessionStorage.getItem("isAuthenticate"));
        const user_id = user.id;

        // const user_id = user.id;
        // console.log(cookies);
        // console.log("", posts);
        if (!DataIsLoaded)
            return (
                <div>
                    <h1> Pleses wait some time.... </h1>
                </div>
            );

        const showPosts = posts.slice(0, 10).map((post) => {
            return (
                <div className="article" key={post.article.id}>
                    {/* {user && <p>{user}</p>}
                    <button onClick={this.handleCookie}>Set Cookie</button> */}

                    <Link to={"/articles/" + post.article.id}>
                        <div className="article__header">
                            {!post.article.is_shared ? null : (
                                <div className="article__header--shared">
                                    <p>Partage</p>
                                </div>
                            )}
                            <h2 className="article__header--title">{post.article.title}</h2>
                            <div className="article__header--author">
                                {!post.article.author_avatar ? (
                                    <div className="author__img initiales">
                                        <p>
                                            {`${post.article.author_firstName} ${post.article.author_lastName}
                                            `
                                                .match(/\b\w/g)
                                                .join("")
                                                .toUpperCase()}
                                        </p>
                                    </div>
                                ) : (
                                    <img className="author__img" src={post.article.author_avatar} />
                                )}

                                <div className="article__info">
                                    <p className="author__name">
                                        {post.article.author_firstName + " " + post.article.author_lastName}
                                    </p>
                                    {/* <div className="article__header--datetime">{post.article.timestamp}</div> */}
                                    <div className="author__postDate">
                                        <p>Posté</p> <DateTime datetime={post.article.timestamp} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="article__content">
                            {post.article.content}
                            {!post.article.images ? null : (
                                <img
                                    className="article__content--img"
                                    src={post.article.images}
                                    alt={"Photo de l'article " + post.article.title}
                                />
                            )}
                        </div>
                    </Link>

                    {/* FOOTER DES ARTICLES */}
                    <div className="article__footer">
                        <div className="article__footer--social">
                            {/* <div className="social"> */}

                            {/* LIKE */}
                            <div className="social">
                                <span className="social__icon">
                                    <BiLike />
                                </span>
                                <span className="social__count">{post.article.likes}</span>
                            </div>

                            {/* DISLIKE */}
                            <div className="social">
                                <span className="social__icon">
                                    <BiDislike />
                                </span>
                                <span className="social__count"> {post.article.dislikes}</span>
                            </div>

                            {/* PARTAGER - SHARE */}
                            <div className="social">
                                <span className="social__icon">
                                    {/* <BiShare /> */}
                                    <ErrorBoundary>
                                        <SharePost post_id={post.article.id} />
                                    </ErrorBoundary>
                                </span>
                                <span className="social__count">{post.article.shares}</span>
                            </div>

                            {/* COMMENTAIRES BUTTON */}
                            <div className="social">
                                {/* Ce bouton doit ouvrir la div contenant les composants de commentaires */}
                                <span className="social__icon">
                                    <BiComment />
                                </span>
                                <span className="social__count">{post.article.comments}</span>
                            </div>

                            {/* BOUTONS POUR MODIFIER ET SUPPRIMER LE POST */}

                            {user_id === post.article.author ? (
                                <div className="social">
                                    <span className="social__icon social__postManage">
                                        <div className="social__icon editPost">
                                            {/* <label class="switch">
                                                <input id="toggle" className="showEditPostMod" type="checkbox" />
                                                <span>
                                                    <BiEditAlt />
                                                </span>
                                            </label> */}

                                            {/* <button onClick={this.handleClick}> */}
                                            <button onClick={this.handleClick}>
                                                <BiEditAlt />
                                            </button>
                                        </div>
                                        <div className="social__icon deletePost">
                                            <DeletePost post_id={post.article.id} author_id={post.article.author} />
                                        </div>
                                    </span>
                                </div>
                            ) : null}
                        </div>

                        {/* AFFICHAGE DES COMPOSANTS DE L'ARTICLE */}
                        <div className="article__displayComponents">
                            {/* AFFICHAGE DU FORMULAIRE POUR MODIFIER L'ARTICLE */}

                            {/* <CSSTransition
                                in={this.state.isToggleOn}
                                timeout={300}
                                className="article__editPost"
                                unmountOnExit
                            > */}
                            <div
                                className="article__editPost"
                                variant="primary"
                                style={{
                                    display: this.state.isToggleOn ? "block" : "none",
                                }}
                            >
                                <ErrorBoundary>
                                    <EditPost
                                        post_id={post.article.id}
                                        author_id={post.article.author}
                                        post_title={post.article.title}
                                        post_content={post.article.content}
                                        post_img={post.article.images}
                                    />
                                </ErrorBoundary>
                            </div>
                            {/* </CSSTransition> */}

                            {/* AFFICHAGE DES COMPOSANTS COMMENTAIRE */}
                            <div className="article__comments">
                                <div className="comments">
                                    {/* AFFICHAGE DU FORMULAIRE DE COMMENTAIRE */}
                                    <div className="showCommentForm">
                                        <ErrorBoundary>
                                            <CommentForm post_id={post.article.id} />
                                        </ErrorBoundary>
                                    </div>

                                    {/* AFFICHAGE DES COMMENTAIRES DE L'ARTICLE */}
                                    <div className="showAllComments">
                                        <ErrorBoundary>
                                            <Comments post_id={post.article.id} />
                                        </ErrorBoundary>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        });

        return showPosts;
    }
}

// export default withCookies(Posts);
export default Posts;
