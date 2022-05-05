import React, { useState } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            DataisLoaded: false,
        };
    }

    // const Home = () => {
    // const [msg, setMsg] = useState("");

    async componentDidMount() {
        const url = `http://localhost:8080/api/articles`;

        const token = JSON.parse(localStorage.getItem("user_token"));
        const reqOptions = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        };
        // fetch("http://localhost:8080/api/articles")
        //     .then((res) => res.json())
        //     .then((data) => this.setState({ totalPosts: data.length }));

        const res = await fetch(url, reqOptions);
        const postsData = await res.json();
        this.setState({ items: postsData.articlesFound, DataisLoaded: true });
        // console.log(token);
        // console.log(postsData.articlesFound);

        // const posts = postsData.articlesFound;

        // // posts.forEach((post) => {
        // //     <div className="Home__article">
        // //         <div>{post.title}</div>
        // //     </div>;
        // // });
        // console.log(postsData.articlesFound);
        console.log(this.state);
    }

    render() {
        const { DataisLoaded, items } = this.state;

        if (!DataisLoaded)
            return (
                <div>
                    <h1> Pleses wait some time.... </h1>{" "}
                </div>
            );

        return (
            <div className="home">
                <div className="container">
                    <h1 hidden>Home</h1>
                    <div className="home__articles">
                        {items.map((item) => (
                            <div className="home__article" key={item.article.id}>
                                <div className="article__img">
                                    <img src={item.article.images} />
                                </div>
                                <div className="home__article--title">{item.article.title}</div>
                                <div className="home__article--author">
                                    {item.article.author_firstName + " " + item.article.author_lastName}
                                </div>
                                <div className="home__article--content">{item.article.content}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
