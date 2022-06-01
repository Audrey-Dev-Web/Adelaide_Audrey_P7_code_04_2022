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
import Comments from "../../components/comments/Comments";

import UserData from "../../components/usersProfile/UserData";

import ErrorBoundary from "../../components/ErrorBoundary";

// Import Socials
import SharePost from "../../components/articles/SharePost";

function Post(props) {
    const { access } = props;
    let { postSlug } = useParams();
    const [post, setPost] = useState({ post: {} });
    const [postIsLoaded, setPostIsLoaded] = useState(false);

    const [isAuthor, setIsAuthor] = useState(false);
    const [editMod, setEditMod] = useState(false);
    const [showComments, setShowComments] = useState(false);

    // récupération de l'id et du role de l'utilisateur
    const token = access;
    const decoded = jwt_decode(token);
    const user_id = decoded.userId;
    const user_role = decoded.role;

    // Request options
    const url = `http://localhost:8080/api/articles/${postSlug}`;

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
            .then((dataPost) => {
                setPost(dataPost);
                setPostIsLoaded(true);

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
                <h1> En chargement... </h1>
            </div>
        );
    }

    return (
        <div className="post">
            <div className="post__container container">
                <div>
                    <div className="post__details">
                        <div className="post__header">
                            <UserData
                                realAuthor_id={post.articleFound.author_id}
                                dateTime={post.articleFound.timestamp}
                                access={access}
                            />

                            {post.articleFound.is_shared ? (
                                <div className="sharedFlex">
                                    <div className="article__header--shared">
                                        <BiRepost />
                                    </div>
                                    <p>a partagé</p>
                                </div>
                            ) : null}
                        </div>

                        {post.articleFound.img ? (
                            <div className="post__content">
                                <h1 className="post__title">{post.articleFound.title}</h1>
                                <p>{post.articleFound.content}</p>
                                <img
                                    className="post__content--img"
                                    src={post.articleFound.img}
                                    alt={"image de l'article" + post.articleFound.title}
                                />
                            </div>
                        ) : (
                            <div className="post__content">
                                <h1 className="post__title">{post.articleFound.title}</h1>
                                <p>{post.articleFound.content}</p>
                            </div>
                        )}

                        {/* POST FOOTER */}
                        <div className="article__footer">
                            <div className="article__footer--social">
                                <div className="social__wrapper">
                                    {/* PARTAGER - SHARE */}
                                    <div className="social">
                                        <ErrorBoundary>
                                            <SharePost
                                                post_id={post.articleFound.id}
                                                access={access}
                                                commentsCount={post.articleFound.shares}
                                            />
                                        </ErrorBoundary>
                                    </div>

                                    {/* COMMENTAIRES BUTTON */}
                                    <div className="social">
                                        {/* Ce bouton doit ouvrir la div contenant les composants de commentaires */}
                                        <button
                                            type="button"
                                            className="btn btn__comments"
                                            onClick={() => commentsToggler()}
                                        >
                                            <p hidden>Afficher les commentaires</p>
                                            <BiComment />
                                            <span className="social__count btn__comments--count">
                                                {post.articleFound.comments}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                {/* BOUTONS POUR MODIFIER ET SUPPRIMER UN POST */}
                                <div className="social__icon social__postManage">
                                    <div>
                                        <div className="social__icon editPost">
                                            {user_id === post.articleFound.author_id ? (
                                                <button
                                                    type="button"
                                                    className="btn btn__edit"
                                                    onClick={() => editModToggler()}
                                                >
                                                    <p hidden>Afficher le formulaire de modification</p>
                                                    <BiEditAlt />
                                                </button>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="social__icon deletePost">
                                        {user_id === post.articleFound.author_id || user_role === "admin" ? (
                                            <ErrorBoundary>
                                                <DeletePost
                                                    post_id={post.articleFound.id}
                                                    author_id={post.articleFound.author_id}
                                                    access={access}
                                                />
                                            </ErrorBoundary>
                                        ) : null}
                                    </div>
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
