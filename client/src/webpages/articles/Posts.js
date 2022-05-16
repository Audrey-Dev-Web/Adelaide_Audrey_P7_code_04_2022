import React, { Component } from "react";
import { Link, Outlet } from "react-router-dom";

import { BiLike, BiDislike, BiShare, BiComment, BiCommentAdd } from "react-icons/bi";

export default class Posts extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            posts: [],
            DataIsLoaded: false,
        };
    }

    async componentDidMount() {
        const user = JSON.parse(sessionStorage.getItem("isAuthenticate"));
        const token = user.pass;

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

        if (!DataIsLoaded)
            return (
                <div>
                    <h1> Pleses wait some time.... </h1>
                </div>
            );

        const showPosts = posts.map((post, index) => {
            return (
                <div className="article" key={post.article.id}>
                    <Link to={"/articles/" + post.article.id}>
                        <div className="article__header">
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
                                    <div className="article__header--datetime">{post.article.timestamp}</div>
                                </div>
                            </div>
                        </div>

                        <div className="home__article--content">
                            {post.article.content}
                            <img
                                className="article__img"
                                src={post.article.images}
                                alt={"Photo de l'article " + post.article.title}
                            />
                        </div>
                    </Link>
                    <div className="home__article--footer">
                        <div className="article__social">
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
                        </div>
                        {/* <Outlet /> */}
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
