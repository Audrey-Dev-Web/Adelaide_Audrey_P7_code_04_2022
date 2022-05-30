import React from "react";
import { Link } from "react-router-dom";
import jwt_decode from "jwt-decode";

import { BiComment, BiEditAlt, BiRepost } from "react-icons/bi";

// Import pour afficher le format de la date
import DateTime from "../../components/DateTime";

// Import pour la gestion des commentaires
import Comments from "../../components/Comments";
// import CommentForm from "../../components/CommentForm";

// Import pour la gestion des posts
import EditPost from "../../components/EditPost";
import DeletePost from "../../components/DeletePost";

// Permet d'afficher les informations de l'utilisateur qui a créé un post losque celui-ci est un post partagé
import UserData from "../../components/usersProfile/UserData";

// Import pour la gestion des erreurs
import ErrorBoundary from "../../components/ErrorBoundary";

// Import Socials
import SharePost from "../../components/SharePost";

class Posts extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            posts: [],
            DataIsLoaded: false,
            access: this.props.access,
        };

        this.handleClick = this.handleClick.bind(this);
        this.showComments = this.showComments.bind(this);
    }

    handleClick(id) {
        this.setState((state) => ({
            isToggleOn: !state.isToggleOn,
        }));
        this.setState({ EDIT: id });
    }

    showComments(id) {
        this.setState((state) => ({
            isShowOn: !state.isShowOn,
        }));
        this.setState({ commentsPost: id });
    }

    async componentDidMount() {
        const { access } = this.state;

        const token = access;
        const decoded = jwt_decode(token);
        // const user_role = decoded.role;
        // const user_id = decoded.user_id;

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
            console.log(data.articlesFound);
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        const { DataIsLoaded, posts, access } = this.state;

        // On récupère de nouveau le cookie
        const decoded = jwt_decode(access);
        // console.log(decoded);
        const user_id = decoded.userId;
        const role = decoded.role;

        if (!DataIsLoaded)
            return (
                <div>
                    <h1> Pleses wait some time.... </h1>
                </div>
            );

        const showPosts = posts.slice(0, 10).map((post) => {
            return (
                <div className="article" key={post.article.id}>
                    <Link to={"/articles/" + post.article.id}>
                        <div className="article__header">
                            {/* {!post.article.is_shared ? null : (
                                <div className="sharedFlex">
                                    <div className="article__header--shared">
                                        <BiRepost />
                                    </div>
                                    <p>a partagé cet article</p>
                                </div>
                            )} */}

                            {/* <div className="article__header--author"> */}
                            <div className="article__header--author">
                                <UserData
                                    realAuthor_id={post.article.author}
                                    dateTime={post.article.timestamp}
                                    access={access}
                                />
                            </div>

                            <div className="article__header--shared">
                                {!post.article.is_shared ? null : (
                                    <div className="sharedFlex">
                                        <div className="article__header--shared">
                                            <BiRepost />
                                        </div>
                                        <p>a partagé cet article</p>
                                    </div>
                                )}
                            </div>
                            {/* {!post.article.author_avatar ? (
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
                                )} */}

                            {/* <div className="article__info">
                                    <div className="article__info--wrapper"> */}
                            {/* <p className="author__name">
                                            {post.article.author_firstName + " " + post.article.author_lastName}
                                        </p>
                                        <div className="author__postDate">
                                            <DateTime datetime={post.article.timestamp} access={access} />
                                        </div> */}
                            {/* </div> */}

                            {/* {!post.article.is_shared ? null : (
                                        <div className="sharedFlex">
                                            <div className="article__header--shared">
                                                <BiRepost />
                                            </div>
                                            <p>a partagé cet article</p>
                                        </div>
                                    )} */}
                            {/* </div>
                            </div> */}
                        </div>

                        {/* Affichage du contenu de l'article */}
                        <div className="article__content">
                            {post.article.is_shared ? (
                                <UserData
                                    realAuthor_id={post.article.original_author_id}
                                    dateTime={post.article.post_shared_timestamp}
                                    access={access}
                                />
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
                                    <button
                                        type="button"
                                        className="btn"
                                        onClick={() => this.showComments(post.article.id)}
                                    >
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
                                                    post_id={post.article.shared_id}
                                                    access={access}
                                                />
                                                cancel
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="social__icon deletePost">
                                        {user_id !== post.article.author && role === "admin" ? (
                                            // Si l'utilisateur n'est pas le propriétaire et qu'il est admin
                                            <DeletePost
                                                post_id={post.article.id}
                                                author_id={post.article.author}
                                                access={this.props.access}
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
                                                onClick={() => this.handleClick(post.article.id)}
                                            >
                                                <BiEditAlt />
                                            </button>
                                        ) : null}
                                    </div>
                                    <div className="social__icon deletePost">
                                        {user_id === post.article.author || role === "admin" ? (
                                            <DeletePost
                                                post_id={post.article.id}
                                                author_id={post.article.author}
                                                access={this.props.access}
                                            />
                                        ) : null}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* AFFICHAGE DES COMPOSANTS DE L'ARTICLE */}
                        <div className="article__displayComponents">
                            {/* AFFICHAGE DU FORMULAIRE POUR MODIFIER L'ARTICLE */}

                            {this.state.EDIT == post.article.id ? (
                                <div
                                    className="article__editPost"
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
                                            access={access}
                                        />
                                    </ErrorBoundary>
                                </div>
                            ) : null}

                            {/* AFFICHAGE DES COMPOSANTS COMMENTAIRE */}
                            <div className="article__comments">
                                {/* AFFICHAGE DES COMMENTAIRES DE L'ARTICLE */}
                                {this.state.commentsPost == post.article.id ? (
                                    <div
                                        className="comments showAllComments"
                                        style={{ display: this.state.isShowOn ? "block" : "none" }}
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
}
export default Posts;
