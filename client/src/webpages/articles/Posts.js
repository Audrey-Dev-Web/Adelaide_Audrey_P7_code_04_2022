import React, { Component } from "react";
import { Link, Outlet } from "react-router-dom";

import { BiLike, BiDislike, BiShare, BiComment, BiCommentAdd } from "react-icons/bi";

import DateTime from "../../components/DateTime";

import Comments from "../../components/Comments";
import CommentForm from "../../components/CommentForm";

import EditPost from "../../components/EditPost";
import DeletePost from "../../components/DeletePost";
import ErrorBoundary from "../../components/ErrorBoundary";

// Import Socials
import SharePost from "../../components/SharePost";

export default class Posts extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            posts: [],
            comments: [],
            DataIsLoaded: false,
        };
    }

    async componentDidMount() {
        const user = JSON.parse(sessionStorage.getItem("isAuthenticate"));
        const token = user.pass;

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
                    <div className="article__footer">
                        <div className="article__footer--social">
                            <p className="social">
                                <span className="social__icon">
                                    <BiLike />
                                </span>
                                <span className="social__count">{post.article.likes}</span>
                            </p>
                            <p className="social">
                                <span className="social__icon">
                                    <BiDislike />
                                </span>
                                <span className="social__count"> {post.article.dislikes}</span>
                            </p>
                            <p className="social">
                                <span className="social__icon">
                                    <BiShare />
                                </span>
                                <span className="social__count">{post.article.shares}</span>
                            </p>
                            <p className="social">
                                <span className="social__icon">
                                    <BiComment />
                                </span>
                                <span className="social__count">{post.article.comments}</span>
                            </p>
                            <button className="social__icon btn">
                                <BiCommentAdd />
                            </button>
                            <DeletePost post_id={post.article.id} author_id={post.article.author} />
                        </div>
                        <ErrorBoundary>
                            <EditPost
                                post_id={post.article.id}
                                author_id={post.article.author}
                                post_title={post.article.title}
                                post_content={post.article.content}
                                post_img={post.article.images}
                            />
                        </ErrorBoundary>
                        <div className="article__comments">
                            <ErrorBoundary>
                                <CommentForm post_id={post.article.id} />
                            </ErrorBoundary>

                            <ErrorBoundary>
                                <Comments post_id={post.article.id} />
                            </ErrorBoundary>
                        </div>
                    </div>
                </div>
            );
        });

        return showPosts;

        // return (
        //     <div>
        //         {posts.map((post, index) => {
        //             <div className="article" key={post.article.id}>
        //                 <Link to={"/articles/" + post.article.id}>
        //                     <div className="article__header">
        //                         <h2 className="article__header--title">{post.article.title}</h2>
        //                         <div className="article__header--author">
        //                             {!post.article.author_avatar ? (
        //                                 <div className="author__img initiales">
        //                                     <p>
        //                                         {`${post.article.author_firstName} ${post.article.author_lastName}
        //                                         `
        //                                             .match(/\b\w/g)
        //                                             .join("")
        //                                             .toUpperCase()}
        //                                     </p>
        //                                 </div>
        //                             ) : (
        //                                 <img className="author__img" src={post.article.author_avatar} />
        //                             )}
        //                         </div>
        //                     </div>
        //                 </Link>
        //                 <Outlet />
        //             </div>;
        //         })}
        //     </div>
        // );
    }
}

// export default Posts;
