import React from "react";
import { Link } from "react-router-dom";

// import { instanceOf } from "prop-types";
// import { useCookies, Cookies } from "react-cookie";
import jwt_decode from "jwt-decode";

import { BiComment, BiEditAlt, BiRepost } from "react-icons/bi";

// Import pour afficher le format de la date
import DateTime from "../../components/DateTime";

// Import pour la gestion des commentaires
import Comments from "../../components/Comments";
import CommentForm from "../../components/CommentForm";

// Import pour la gestion des posts
import EditPost from "../../components/EditPost";
import DeletePost from "../../components/DeletePost";

// Permet d'afficher les informations de l'utilisateur qui a créé un post losque celui-ci est un post partagé
import RealAuthor from "../../components/usersProfile/RealAuthor";

// Import pour la gestion des erreurs
import ErrorBoundary from "../../components/ErrorBoundary";

// Import Socials
import SharePost from "../../components/SharePost";

class Posts extends React.Component {
    // static propTypes = {
    //     cookies: instanceOf(Cookies).isRequired,
    // };

    constructor(props) {
        super(props);

        this.state = {
            posts: [],
            DataIsLoaded: false,
            // display: false,
            access: this.props.access, // On récupère le cookie
            role: [],
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
        // console.log(first);
        // const cookies = Cookies.get(["access"]);

        const token = access.token;
        const decoded = jwt_decode(token);
        const user_role = decoded.role;
        const user_id = decoded.id;
        // console.log(token);

        // const user = JSON.parse(sessionStorage.getItem("isAuthenticate"));
        // const token = user.pass;
        // const user_id = user.id;

        // console.log(token);

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

            this.setState({ posts: data.articlesFound, DataIsLoaded: true, role: decoded.role });
            // console.log(this.state);
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        const { DataIsLoaded, posts, access, role } = this.state;
        // const user = JSON.parse(sessionStorage.getItem("isAuthenticate"));
        // const user_id = user.id;

        console.log(role);

        // On récupère de nouveau le cookie
        const token = access.token;
        // On décode le cookie
        const decoded = jwt_decode(token);
        // Pour récupérer l'id de l'utilisateur
        const user_id = decoded.userId;
        // et son role
        // const user_role = decoded.role;
        // console.log(user_role);

        // On vérifi si l'utilisateur a le bon role ou le bon user_id

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
                                    <div className="article__info--wrapper">
                                        <p className="author__name">
                                            {post.article.author_firstName + " " + post.article.author_lastName}
                                        </p>
                                        <div className="author__postDate">
                                            <p>Posté</p> <DateTime datetime={post.article.timestamp} access={access} />
                                        </div>
                                    </div>

                                    {!post.article.is_shared ? null : (
                                        <div className="sharedFlex">
                                            <div className="article__header--shared">
                                                <BiRepost />
                                            </div>
                                            <p>a partagé cet article</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Affichage du contenu de l'article */}
                        <div className="article__content">
                            <RealAuthor
                                realAuthor_id={post.article.original_author_id}
                                dateTime={post.article.post_shared_timestamp}
                                access={access}
                            />
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
                            {/* PARTAGER - SHARE */}
                            <div className="social__wrapper">
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

                            {/* BOUTONS POUR MODIFIER ET SUPPRIMER LE POST */}

                            {/* <div className="social__icon social__postManage"> */}
                            {/* On vérifis que c'est l'auteur du post qui souhaite le modifier */}
                            {/* {user_id === post.article.author ? (
                                    // Si le post est un partage alors on cache le bouton editer
                                    post.article.is_shared ? (

                                        // BOUTON CANCEL SHARE SEULEMENT SUR LES PARTAGES
                                        <div className="social social__icon deletePost">
                                            <button type="button" className="btn">
                                                cancel
                                            </button>
                                        </div>
                                    ) : (
                                        // BOUTON EDIT SEULEMENT SUR LES POST
                                        <div className="social social__icon editPost">
                                            <button
                                                type="button"
                                                className="btn"
                                                onClick={() => this.handleClick(post.article.id)}
                                            >
                                                <BiEditAlt />
                                            </button>
                                        </div>
                                    )
                                ) : null}

                                {/* Si l'utilisateur est le propriétaire du post ou possède le role admin alors il peut supprimer le post */}
                            {/* {user_id === post.article.author || role === "admin" ? (
                                    <div className="social social__icon deletePost">
                                        <DeletePost post_id={post.article.id} author_id={post.article.author} />
                                    </div>
                                ) : null}  */}

                            {post.article.is_shared ? (
                                user_id === post.article.author ? (
                                    <div className="social__icon social__postManage">
                                        <div className="social social__icon deletePost">
                                            <button type="button" className="btn">
                                                cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : null
                            ) : role === "admin" ? (
                                <div className="social__icon social__postManage">
                                    <div className="social social__icon deletePost">
                                        <DeletePost
                                            post_id={post.article.id}
                                            author_id={post.article.author}
                                            access={this.props.access}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="social__icon social__postManage">
                                    <div className="social social__icon editPost">
                                        <button
                                            type="button"
                                            className="btn"
                                            onClick={() => this.handleClick(post.article.id)}
                                        >
                                            <BiEditAlt />
                                        </button>
                                    </div>

                                    <div className="social social__icon deletePost">
                                        <DeletePost
                                            post_id={post.article.id}
                                            author_id={post.article.author}
                                            access={access}
                                        />
                                    </div>
                                </div>
                            )}
                            {/* </div> */}

                            {/* {role === "admin" ? (
                                <div className="social social__icon deletePost">
                                    <DeletePost post_id={post.article.id} author_id={post.article.author} />
                                </div>
                            ) : null} */}
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

// export default withCookies(Posts);
export default Posts;
