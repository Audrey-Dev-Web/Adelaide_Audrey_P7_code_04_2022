import React, { Component } from "react";

export default class Posts extends Component {
    constructor(props) {
        super(props);

        this.state = {
            posts: [],
            DataIsLoaded: false,
        };
    }

    async componentDidMount() {
        const user = JSON.parse(sessionStorage.getItem("isAuthenticate"));

        const url = `http://localhost:8080/api/articles`;

        const token = user.pass;
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
            const postsData = await res.json();
            this.setState({ posts: postsData.articlesFound, DataIsLoaded: true });
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
                    <h1> Pleases wait some time.... </h1>{" "}
                </div>
            );

        return (
            <div className="posts">
                {posts.map((post) => {
                    <div className="post" key={post.article.id}>
                        <div className="post__header">
                            <div className="post__author">
                                <div className="post__author--avatar">{post.article.author_avatar}</div>
                                <div className="post__author--name">{post.article.author_firstName}</div>
                            </div>

                            <div className="post__datetime">{post.article.timestamp}</div>
                        </div>

                        <div className="post__content">
                            <h2 className="post__title">{post.article.title}</h2>
                            <div className="post__title">{post.article.content}</div>
                        </div>

                        <div className="post__footer">
                            <div className="post__likes">Likes</div>
                            <div className="post__dislikes">Dislikes</div>
                            <div className="post__share">Partages</div>
                            <div className="post__comments">Commentaires</div>
                        </div>
                    </div>;
                })}
            </div>
        );
    }
}
