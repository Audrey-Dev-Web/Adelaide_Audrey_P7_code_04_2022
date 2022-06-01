import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import jwt_decode from "jwt-decode";

import { BiComment, BiEditAlt, BiRepost } from "react-icons/bi";

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

    const [toggleComments, setToggleComments] = useState({
        comments_is_open: false,
        id: null,
    });

    const [posts, setPosts] = useState({ posts: [] });

    // on récupère l'id et le role de l'utilisateur
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

    // permet d'afficher ou de cacher le formulaire de modification
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
    };

    // Permet d'afficher ou de cacher la liste des commentaires
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
        // Permet de récupérer et d'afficher les articles
        async function fetchData() {
            const res = await fetch(url, reqOptions);
            const data = await res.json();

            if (res.ok) {
                setPosts({ posts: data.articlesFound, DataIdLoaded: true });
            }
        }
        fetchData();
    }, [posts]);

    const postsData = posts.posts;

    if (!posts.DataIdLoaded) {
        return (
            <div>
                <h1>Aucun article a afficher pour le moment</h1>
            </div>
        );
    }

    const showPosts = postsData.map((post) => {
        return (
            <div className="article" key={post.article.id}>
                {/* Le lien renvoi vers la page de l'article */}
                <Link to={"/articles/" + (post.article.shared_id ? post.article.shared_id : post.article.id)}>
                    {/* Affichage de l'entête des articles*/}
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
                                <ErrorBoundary>
                                    <SharePost
                                        post_id={post.article.id}
                                        access={access}
                                        commentsCount={post.article.shares}
                                    />
                                </ErrorBoundary>
                            </div>

                            {/* COMMENTAIRES BUTTON */}
                            <div className="social">
                                <button
                                    type="button"
                                    className="btn btn__comments"
                                    onClick={() => showComments(post.article.id)}
                                >
                                    <p hidden>Afficher les commentaires</p>
                                    <BiComment />
                                    <span className="social__count btn__comments--count">{post.article.comments}</span>
                                </button>
                            </div>
                        </div>

                        {/* BOUTONS POUR MODIFIER ET DE SUPPRESSION DES POSTS */}
                        <div className="social__icon social__postManage">
                            {user_id === post.article.author ? (
                                <div>
                                    {!post.article.is_shared ? (
                                        <div className="social__icon editPost">
                                            {/* Si l'utilisateur est le propriétaire il peut modifier l'article */}
                                            <button
                                                type="button"
                                                className="btn btn__edit"
                                                onClick={() => showEditForm(post.article.id)}
                                            >
                                                <p hidden>Afficher le formulaire de modification</p>
                                                <BiEditAlt />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="social__icon">
                                            <SharePost
                                                is_shared={post.article.is_shared}
                                                post_id={post.article.shared_id}
                                                access={access}
                                            />
                                        </div>
                                    )}
                                </div>
                            ) : null}
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
