import React, { Component } from "react";
import { Link, Outlet } from "react-router-dom";

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

        return (
            <div>
                {posts.map((post, index) => {
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
                                </div>
                            </div>
                        </Link>
                        <Outlet />
                    </div>;
                })}
            </div>
        );
    }
}

// export default Posts;
