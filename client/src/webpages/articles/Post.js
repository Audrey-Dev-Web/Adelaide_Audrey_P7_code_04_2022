import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Route } from "react-router-dom";
import jwt_decode from "jwt-decode";

// import { useCookies } from "react-cookie";
// import jwt_decode from "jwt-decode";

import { BiRepost, BiEditAlt, BiComment } from "react-icons/bi";

// Import pour la gestion de l'article
import EditPost from "../../components/articles/EditPost";
import DeletePost from "../../components/articles/DeletePost";

// Import pour la gestion des commentaires
import CommentForm from "../../components/comments/CommentForm";
// Import pour la gestion des commentaires
import Comments from "../../components/comments/Comments";
import EditComment from "../../components/comments/EditComment";
import DeleteComment from "../../components/comments/DeleteComment";

import UserData from "../../components/usersProfile/UserData";

import ErrorBoundary from "../../components/ErrorBoundary";

// Import Socials
import SharePost from "../../components/articles/SharePost";

function Post(props) {
    const { access } = props;
    let { postSlug } = useParams();
    const [post, setPost] = useState({ post: {} });
    const [postIsLoaded, setPostIsLoaded] = useState(false);

    // const [comments, setComments] = useState({ comments: {} });

    const [isAuthor, setIsAuthor] = useState(false);
    const [editMod, setEditMod] = useState(false);
    const [showComments, setShowComments] = useState(false);

    // const decoded = jwt_decode(token);
    const token = access;
    const decoded = jwt_decode(token);
    const user_id = decoded.userId;
    const user_role = decoded.role;

    // Request options
    const url = `http://localhost:8080/api/articles/${postSlug}`;
    // const urlComments = `http://localhost:8080/api/articles/${postSlug}/comments`;
    const reqOptions = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    };

    // const fetchDetails = () => {
    //     Promise.all([fetch(url, reqOptions), fetch(urlComments, reqOptions)])
    //         .then(([resPost, resComments]) => Promise.all([resPost.json(), resComments.json()]))
    //         .then(([dataPost, dataComments]) => {
    //             setPost(dataPost);
    //             setComments(dataComments);
    //             setPostIsLoaded(true);

    //             if (user_id === dataPost.articleFound.author_id || user_role === "admin") {
    //                 setIsAuthor(true);
    //             }
    //         });
    // };

    useEffect(() => {
        // fetchDetails();
        fetch(url, reqOptions)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
            })
            .then((dataPost) => {
                setPost(dataPost);
                setPostIsLoaded(true);

                console.log(dataPost);

                if (user_id === dataPost.articleFound.author_id || user_role === "admin") {
                    setIsAuthor(true);
                }
            });
    }, []);

    const editModToggler = () => {
        setEditMod(!editMod);
    };

    const commentsToggler = () => {
        setShowComments(!showComments);
    };

    if (!postIsLoaded) {
        return (
            <div>
                <h1> Pleses wait some time.... </h1>
            </div>
        );
    }

    return (
        <div className="post">
            <div className="post__container container">
                <div>
                    <div className="post__details">
                        <div className="post__header">
                            <h1 className="post__title">{post.articleFound.title}</h1>
                            <div className="post__header--author">
                                <UserData
                                    realAuthor_id={post.articleFound.author}
                                    dateTime={post.articleFound.timestamp}
                                    access={access}
                                />
                            </div>
                            <div className="article__header--shared">
                                {!post.articleFound.is_shared ? null : (
                                    <div className="sharedFlex">
                                        <div className="article__header--shared">
                                            <BiRepost />
                                        </div>
                                        <p>a partagé</p>
                                    </div>
                                )}
                            </div>
                            {/* <div>
                                    {!post.articleFound.author_avatar ? (
                                        <div className="author__img initiales">
                                            <p>
                                                {`${post.articleFound.author_firstName} ${post.articleFound.author_lastName}
                                                `
                                                    .match(/\b\w/g)
                                                    .join("")
                                                    .toUpperCase()}
                                            </p>
                                        </div>
                                    ) : (
                                        <img
                                            className="author__img"
                                            src={post.articleFound.author_avatar}
                                            alt={"Photo de profile de " + post.articleFound.author_firstName}
                                        />
                                    )}
                                </div>

                                <div className="header__infos">
                                    <p className="author__name">
                                        {post.articleFound.author_firstName + " " + post.articleFound.author_lastName}
                                    </p>
                                    <div className="post__header--datetime">{post.articleFound.timestamp}</div>
                                </div> */}
                            {/* </div> */}
                        </div>

                        {post.articleFound.img ? (
                            <div className="post__content">
                                <p>{post.articleFound.content}</p>
                                <img
                                    className="post__content--img"
                                    src={post.articleFound.img}
                                    alt={"image de l'article" + post.articleFound.title}
                                />
                            </div>
                        ) : (
                            <div className="post__content">
                                <p>{post.articleFound.content}</p>
                            </div>
                        )}

                        {/* POST FOOTER */}
                        <div className="article__footer">
                            <div className="article__footer--social">
                                <div className="social__wrapper">
                                    {/* PARTAGER - SHARE */}
                                    <div className="social">
                                        <span className="social__icon">
                                            <ErrorBoundary>
                                                <SharePost post_id={post.articleFound.id} access={access} />
                                            </ErrorBoundary>
                                        </span>
                                        <span className="social__count">{post.articleFound.shares}</span>
                                    </div>
                                    {/* COMMENTAIRES BUTTON */}
                                    <div className="social">
                                        {/* Ce bouton doit ouvrir la div contenant les composants de commentaires */}
                                        <button type="button" className="btn" onClick={() => commentsToggler()}>
                                            <BiComment />
                                            <span className="social__count">{post.articleFound.comments}</span>
                                        </button>
                                    </div>

                                    {/* BOUTONS POUR MODIFIER ET SUPPRIMER UN POST */}
                                    {post.articleFound.is_shared ? (
                                        // si l'article est un partage
                                        <div className="social__icon social__postManage">
                                            <div className="social__icon cancelShare">
                                                {/* Mettre le composant share ici */}
                                                {user_id === post.articleFound.author ? (
                                                    // Si l'utilisateur est le propriétaire
                                                    <div className="social__icon shareBtn">
                                                        {/* Cancel Sharing */}
                                                        <ErrorBoundary>
                                                            <SharePost
                                                                // id="cancelShare"
                                                                post_id={post.articleFound.shared_id}
                                                                access={access}
                                                            />
                                                        </ErrorBoundary>
                                                        cancel
                                                    </div>
                                                ) : null}
                                            </div>
                                            <div className="social__icon deletePost">
                                                {user_id !== post.articleFound.author && user_role === "admin" ? (
                                                    // Si l'utilisateur n'est pas le propriétaire et qu'il est admin
                                                    <ErrorBoundary>
                                                        <DeletePost
                                                            post_id={post.articleFound.id}
                                                            author_id={post.articleFound.author}
                                                            access={access}
                                                        />
                                                    </ErrorBoundary>
                                                ) : null}
                                            </div>
                                        </div>
                                    ) : (
                                        // Si c'est un article normal
                                        <div className="social__icon social__postManage">
                                            <div className="social__icon editPost">
                                                {user_id === post.articleFound.author_id ? (
                                                    //   "handleClick ici"
                                                    <button
                                                        type="button"
                                                        className="btn"
                                                        onClick={() => editModToggler()}
                                                    >
                                                        <BiEditAlt />
                                                    </button>
                                                ) : null}
                                            </div>
                                            <div className="social__icon deletePost">
                                                {user_id === post.articleFound.author || user_role === "admin" ? (
                                                    <ErrorBoundary>
                                                        <DeletePost
                                                            post_id={post.articleFound.id}
                                                            author_id={post.articleFound.author}
                                                            access={access}
                                                        />
                                                    </ErrorBoundary>
                                                ) : null}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="article__displayComponents">
                                {/* AFFICHAGE DU FORMULAIRE POUR MODIFIER L'ARTICLE */}

                                <div
                                    className="article__editPost"
                                    style={{
                                        display: editMod ? "block" : "none",
                                    }}
                                >
                                    <ErrorBoundary>
                                        <EditPost
                                            post_id={post.articleFound.id}
                                            author_id={post.articleFound.author}
                                            post_title={post.articleFound.title}
                                            post_content={post.articleFound.content}
                                            post_img={post.articleFound.images}
                                            access={access}
                                        />
                                    </ErrorBoundary>
                                </div>

                                {/* AFFICHAGE DES COMPOSANTS COMMENTAIRE */}
                                <div className="article__comments">
                                    {/* AFFICHAGE DES COMMENTAIRES DE L'ARTICLE */}

                                    <div
                                        className="comments showAllComments"
                                        style={{ display: showComments ? "block" : "none" }}
                                    >
                                        <ErrorBoundary>
                                            <Comments post_id={post.articleFound.id} access={access} />
                                        </ErrorBoundary>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Post;
