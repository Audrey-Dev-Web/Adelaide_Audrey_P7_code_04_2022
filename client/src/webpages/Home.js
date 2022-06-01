import React from "react";

import Posts from "./articles/Posts";
import PostForm from "../components/articles/PostForm";
import UsersProfile from "../components/usersProfile/UsersProfile";

function Home(props) {
    const { access } = props;
    return (
        <div className="home">
            <div className="home__container container">
                <div className="home__article">
                    <h1 hidden>Home</h1>

                    {/* Affichage du formulaire de création d'article */}
                    <div className="createNewPost">
                        <PostForm access={access} />
                    </div>

                    {/* Récupération des articles */}
                    <div className="home__articles">
                        <Posts access={access} />
                    </div>
                </div>

                {/* Affichage des nouveaux utilisateurs */}
                <UsersProfile access={access} />
            </div>
        </div>
    );
}

export default Home;
