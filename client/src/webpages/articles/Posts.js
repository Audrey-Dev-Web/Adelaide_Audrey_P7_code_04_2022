import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import jwt_decode from "jwt-decode";

import { BiComment, BiEditAlt, BiRepost } from "react-icons/bi";

// Import pour afficher le format de la date
import DateTime from "../../components/DateTime";

// Import pour la gestion des commentaires
import Comments from "../../components/comments/Comments";
// import CommentForm from "../../components/CommentForm";

// Import pour la gestion des posts
import EditPost from "../../components/articles/EditPost";
import DeletePost from "../../components/articles/DeletePost";

// Permet d'afficher les informations de l'utilisateur qui a créé un post losque celui-ci est un post partagé
import UserData from "../../components/usersProfile/UserData";

// Import pour la gestion des erreurs
import ErrorBoundary from "../../components/ErrorBoundary";

// Import Socials
import SharePost from "../../components/articles/SharePost";

function Posts(props) {
    const { access } = props;

    const [postEdit, setPostEdit] = useState({
        is_open: false,
        id: null,
    });
    // const [postEdit_id, setPostEdit_id] = useState(0);
    const [toggleComments, setToggleComments] = useState({
        comments_is_open: false,
        id: null,
    });
    // const [toggleComments_id, setToggleComments_id] = useState(0);

    const [posts, setPosts] = useState({ posts: [] });

    const decoded = jwt_decode(access);
    const user_id = decoded.userId;
    const role = decoded.role;

    const url = `http://localhost:8080/api/articles`;
    const reqOptions = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${access}`,
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    };

    const showEditForm = (id) => {
        if (postEdit.is_open) {
            setPostEdit({
                is_open: false,
                id: id,
            });

            if (id !== postEdit.id) {
                setPostEdit({
                    is_open: true,
                    id: id,
                });
            }
        } else {
            setPostEdit({
                is_open: true,
                id: id,
            });
        }
        // setPostEdit(!postEdit);
        // setPostEdit_id(id);
    };

    const showComments = (id) => {
        if (toggleComments.comments_is_open) {
            setToggleComments({
                comments_is_open: false,
                id: id,
            });

            if (id !== toggleComments.id) {
                setToggleComments({
                    comments_is_open: true,
                    id: id,
                });
            }
        } else {
            setToggleComments({
                comments_is_open: true,
                id: id,
            });
        }
    };

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(url, reqOptions);
            const data = await res.json();

            setPosts({ posts: data.articlesFound, DataIdLoaded: true });
        }
        fetchData();
    }, []);

    const postsData = posts.posts;

    if (!posts.DataIdLoaded) {
        return (
            <div>
                <h1>Aucune donnée a afficher pour le moment...</h1>
            </div>
        );
    }

    const showPosts = postsData.map((post) => {
        return (
            <div className="article" key={post.article.id}>
                <Link to={"/articles/" + post.article.id}>
                    <div className="article__header">
                        <div className="article__header--author">
                            <UserData
                                realAuthor_id={post.article.author}
                                dateTime={post.article.timestamp}
                                access={access}
                            />
                        </div>

                        <div className="article__header--share">
                            {!post.article.is_shared ? null : (
                                <div className="sharedFlex">
                                    <div className="article__header--shared">
                                        <BiRepost />
                                    </div>
                                    <p>A partagé </p>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Affichage du contenu de l'article */}
                    <div className="article__content">
                        {post.article.is_shared ? (
                            <div className="article__shareAuthor">
                                <div className="article__shareAuthor--margin">
                                    <UserData
                                        realAuthor_id={post.article.original_author_id}
                                        dateTime={post.article.post_shared_timestamp}
                                        access={access}
                                    />
                                </div>
                            </div>
                        ) : null}
                        <h2 className="article__header--title">{post.article.title}</h2>

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
                        <div className="social__wrapper">
                            {/* PARTAGER - SHARE */}
                            <div className="social">
                                <span className="social__icon">
                                    <ErrorBoundary>
                                        <SharePost post_id={post.article.id} access={access} />
                                    </ErrorBoundary>
                                </span>
                                <span className="social__count">{post.article.shares}</span>
                            </div>

                            {/* COMMENTAIRES BUTTON */}
                            <div className="social">
                                {/* Ce bouton doit ouvrir la div contenant les composants de commentaires */}
                                <button type="button" className="btn" onClick={() => showComments(post.article.id)}>
                                    <BiComment />
                                    <span className="social__count">{post.article.comments}</span>
                                </button>
                            </div>
                        </div>

                        {/* BOUTONS POUR MODIFIER ET SUPPRIMER UN POST */}
                        {post.article.is_shared ? (
                            // si l'article est un partage
                            <div className="social__icon social__postManage">
                                <div className="social__icon cancelShare">
                                    {/* Mettre le composant share ici */}
                                    {user_id === post.article.author ? (
                                        // Si l'utilisateur est le propriétaire
                                        <div className="social__icon shareBtn">
                                            {/* Cancel Sharing */}
                                            <SharePost
                                                // id="cancelShare"
                                                is_shared={post.article.is_shared}
                                                post_id={post.article.shared_id}
                                                access={access}
                                            />
                                            {/* cancel */}
                                        </div>
                                    ) : null}
                                </div>
                                <div className="social__icon deletePost">
                                    {user_id !== post.article.author && role === "admin" ? (
                                        // Si l'utilisateur n'est pas le propriétaire et qu'il est admin
                                        <DeletePost
                                            post_id={post.article.id}
                                            author_id={post.article.author}
                                            access={access}
                                        />
                                    ) : null}
                                </div>
                            </div>
                        ) : (
                            // Si c'est un article normal
                            <div className="social__icon social__postManage">
                                <div className="social__icon editPost">
                                    {user_id === post.article.author ? (
                                        // Si l'utilisateur est le propriétaire il peut modifier l'article
                                        <button
                                            type="button"
                                            className="btn"
                                            onClick={() => showEditForm(post.article.id)}
                                        >
                                            <p hidden>Afficher le formulaire de modification</p>
                                            <BiEditAlt />
                                        </button>
                                    ) : null}
                                </div>
                                <div className="social__icon deletePost">
                                    {user_id === post.article.author || role === "admin" ? (
                                        <DeletePost
                                            post_id={post.article.id}
                                            author_id={post.article.author}
                                            access={access}
                                        />
                                    ) : null}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* AFFICHAGE DES COMPOSANTS DE L'ARTICLE */}
                    <div className="article__displayComponents">
                        {/* AFFICHAGE DU FORMULAIRE POUR MODIFIER L'ARTICLE */}

                        {postEdit.id == post.article.id ? (
                            <div
                                className="article__editPost"
                                style={{
                                    display: postEdit.is_open ? "block" : "none",
                                }}
                            >
                                <ErrorBoundary>
                                    <EditPost
                                        post_id={post.article.id}
                                        author_id={post.article.author}
                                        post_title={post.article.title}
                                        post_content={post.article.content}
                                        post_img={post.article.images}
                                        access={access}
                                    />
                                </ErrorBoundary>
                            </div>
                        ) : null}

                        {/* AFFICHAGE DES COMPOSANTS COMMENTAIRE */}
                        <div className="article__comments">
                            {/* AFFICHAGE DES COMMENTAIRES DE L'ARTICLE */}
                            {toggleComments.id == post.article.id ? (
                                <div
                                    className="comments showAllComments"
                                    style={{ display: toggleComments.comments_is_open ? "block" : "none" }}
                                >
                                    <ErrorBoundary>
                                        <Comments post_id={post.article.id} access={access} />
                                    </ErrorBoundary>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        );
    });

    return showPosts;
}

export default Posts;
